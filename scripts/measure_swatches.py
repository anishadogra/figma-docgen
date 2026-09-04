#!/usr/bin/env python3
"""
measure_swatches.py — derive precise normalized crop transforms for each V0N
swatch on a raw {{brand.name}} swatch sheet.

Why this exists:
  Eyeballing crops in Figma stretches textures and frequently captures two
  rows in one frame. The only reliable approach is to detect the actual
  non-white bands in the source image and emit `imageTransform` matrices
  that map exactly to those bands.

Usage:
  python3 measure_swatches.py img_1-2.png img_1-3.png ... [--out crops.json]

Each input is one raw swatch sheet — either:
  * 4-strip layout: four horizontal strips of texture stacked vertically on a
    white card, optionally labelled at the bottom.
  * 1+4 layout: one wide hero strip up top, then a 2×2 grid of smaller
    swatches below.

Output is a JSON dict keyed by image filename, where each entry is a dict of
V01..V05 (or V01..V04) → [[a, b, c], [d, e, f]] — the imageTransform matrix
expected by Figma's CROP scaleMode.

The matrix maps target UV (the rectangle's 0..1 space) to source UV. For an
axis-aligned crop of region (u0, v0) → (u1, v1) of the source, the matrix is:
    [[u1-u0, 0,     u0],
     [0,     v1-v0, v0]]

so c = u0 (left), f = v0 (top), a = width, e = height.

Algorithm:
  1. Convert image to grayscale, find the bounding box of non-white pixels
     (white = card background, anything below threshold ≈ swatch).
  2. Inside that box, scan rows: row brightness < threshold → swatch row.
  3. Cluster contiguous swatch-rows into bands. For 4-strip: take all 4
     bands top→bottom. For 1+4: top band is the hero; remaining bands are
     scanned column-wise to split into V02/V03 and V04/V05.
  4. Convert each band's pixel bounds to normalized UV coordinates against
     the full source image, and emit the matrix.

Run-time deps: Pillow, numpy.
"""
import argparse
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image


# Tunables — most swatch sheets have a clean white card so these are forgiving.
WHITE_THRESHOLD = 235        # 0..255; pixels above this = white card
ROW_FILL_RATIO = 0.20        # row counts as "swatch" if ≥ this fraction of pixels are non-white
COL_FILL_RATIO = 0.20        # same for columns within a band
MIN_BAND_HEIGHT_FRAC = 0.04  # ignore bands shorter than this fraction of card height (label noise)
MIN_GAP_FRAC = 0.005         # merge bands separated by less than this gap


def load_gray(path: Path) -> np.ndarray:
    img = Image.open(path).convert("L")
    return np.asarray(img)


def find_card_bbox(gray: np.ndarray) -> tuple[int, int, int, int]:
    """Tightest bbox of non-white content. Returns (x0, y0, x1, y1) in pixels."""
    mask = gray < WHITE_THRESHOLD
    if not mask.any():
        h, w = gray.shape
        return 0, 0, w, h
    rows = np.where(mask.any(axis=1))[0]
    cols = np.where(mask.any(axis=0))[0]
    return int(cols[0]), int(rows[0]), int(cols[-1]) + 1, int(rows[-1]) + 1


def detect_horizontal_bands(
    gray: np.ndarray,
    bbox: tuple[int, int, int, int],
) -> list[tuple[int, int]]:
    """Within the card bbox, return list of (y_start, y_end) pixel rows for each
    horizontal swatch band."""
    x0, y0, x1, y1 = bbox
    region = gray[y0:y1, x0:x1] < WHITE_THRESHOLD
    width = region.shape[1]
    row_fill = region.sum(axis=1) / max(width, 1)
    is_band = row_fill >= ROW_FILL_RATIO

    bands: list[tuple[int, int]] = []
    in_band = False
    start = 0
    for i, v in enumerate(is_band):
        if v and not in_band:
            in_band = True
            start = i
        elif not v and in_band:
            in_band = False
            bands.append((start + y0, i + y0))
    if in_band:
        bands.append((start + y0, len(is_band) + y0))

    # Merge bands separated by tiny gaps (caption serifs etc.)
    h = y1 - y0
    min_gap = max(1, int(MIN_GAP_FRAC * h))
    merged: list[tuple[int, int]] = []
    for b in bands:
        if merged and b[0] - merged[-1][1] <= min_gap:
            merged[-1] = (merged[-1][0], b[1])
        else:
            merged.append(b)

    # Drop bands that are too short — usually V0N labels or shadow lines.
    min_h = max(1, int(MIN_BAND_HEIGHT_FRAC * h))
    return [b for b in merged if (b[1] - b[0]) >= min_h]


def detect_columns_in_band(
    gray: np.ndarray,
    band: tuple[int, int],
    bbox: tuple[int, int, int, int],
) -> list[tuple[int, int]]:
    """Within a horizontal band, find vertical sub-columns. Used for the lower
    rows of 1+4 layouts (each row has V02|V03 or V04|V05 side by side)."""
    x0, _y0, x1, _y1 = bbox
    y_start, y_end = band
    region = gray[y_start:y_end, x0:x1] < WHITE_THRESHOLD
    h = region.shape[0]
    col_fill = region.sum(axis=0) / max(h, 1)
    is_col = col_fill >= COL_FILL_RATIO

    cols: list[tuple[int, int]] = []
    in_col = False
    start = 0
    for i, v in enumerate(is_col):
        if v and not in_col:
            in_col = True
            start = i
        elif not v and in_col:
            in_col = False
            cols.append((start + x0, i + x0))
    if in_col:
        cols.append((start + x0, len(is_col) + x0))

    width = x1 - x0
    min_gap = max(1, int(MIN_GAP_FRAC * width))
    merged: list[tuple[int, int]] = []
    for c in cols:
        if merged and c[0] - merged[-1][1] <= min_gap:
            merged[-1] = (merged[-1][0], c[1])
        else:
            merged.append(c)

    min_w = max(1, int(MIN_BAND_HEIGHT_FRAC * width))
    return [c for c in merged if (c[1] - c[0]) >= min_w]


def transform_for(
    px_box: tuple[int, int, int, int],
    img_w: int,
    img_h: int,
) -> list[list[float]]:
    """Convert pixel bbox (x0, y0, x1, y1) to a Figma imageTransform matrix."""
    x0, y0, x1, y1 = px_box
    u0 = x0 / img_w
    v0 = y0 / img_h
    u1 = x1 / img_w
    v1 = y1 / img_h
    return [
        [round(u1 - u0, 4), 0, round(u0, 4)],
        [0, round(v1 - v0, 4), round(v0, 4)],
    ]


def measure_one(path: Path) -> dict:
    gray = load_gray(path)
    h, w = gray.shape
    bbox = find_card_bbox(gray)
    bands = detect_horizontal_bands(gray, bbox)

    if len(bands) == 0:
        print(f"[warn] {path.name}: no bands detected", file=sys.stderr)
        return {}

    # Heuristic: 1+4 if the topmost band is significantly wider/taller than
    # the rest AND there are exactly 3 bands (1 hero + 2 rows of pairs), or
    # if there are 5 bands. 4-strip otherwise.
    if len(bands) >= 5:
        # Treat first 4 as V01..V04 (5th is likely the names row)
        result: dict[str, list[list[float]]] = {}
        x0, _y0, x1, _y1 = bbox
        for i, (ys, ye) in enumerate(bands[:4]):
            result[f"V0{i+1}"] = transform_for((x0, ys, x1, ye), w, h)
        return result

    if len(bands) == 4:
        result = {}
        x0, _y0, x1, _y1 = bbox
        for i, (ys, ye) in enumerate(bands):
            result[f"V0{i+1}"] = transform_for((x0, ys, x1, ye), w, h)
        return result

    if len(bands) == 3:
        # 1+4: top is hero, bottom 2 split into pairs
        result = {}
        x0, _y0, x1, _y1 = bbox
        hero_ys, hero_ye = bands[0]
        result["V01"] = transform_for((x0, hero_ys, x1, hero_ye), w, h)

        labels = ("V02", "V03", "V04", "V05")
        idx = 0
        for ys, ye in bands[1:]:
            cols = detect_columns_in_band(gray, (ys, ye), bbox)
            if len(cols) < 2:
                # Fallback: split midpoint.
                mid = (x0 + x1) // 2
                cols = [(x0, mid), (mid, x1)]
            for cx0, cx1 in cols[:2]:
                if idx < len(labels):
                    result[labels[idx]] = transform_for((cx0, ys, cx1, ye), w, h)
                    idx += 1
        return result

    # Fallback: dump whatever we found.
    result = {}
    x0, _y0, x1, _y1 = bbox
    for i, (ys, ye) in enumerate(bands):
        result[f"V0{i+1}"] = transform_for((x0, ys, x1, ye), w, h)
    return result


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("images", nargs="+", help="Source swatch sheet PNGs/JPGs")
    p.add_argument("--out", default=None, help="Optional JSON output path")
    args = p.parse_args()

    crops: dict[str, dict] = {}
    for s in args.images:
        path = Path(s)
        if not path.exists():
            print(f"[skip] {s}: not found", file=sys.stderr)
            continue
        crops[path.name] = measure_one(path)

    blob = json.dumps(crops, indent=2)
    if args.out:
        Path(args.out).write_text(blob)
        print(f"wrote {args.out}")
    else:
        print(blob)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
