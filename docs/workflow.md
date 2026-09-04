# Workflow — building a {{brand.name}} catalog end to end

The full process, in the order it has to happen.

## Phase 0 — Confirm inputs

Before touching Figma, confirm with the user:

- [ ] Which Figma file? (URL or file key)
- [ ] Source images: where are they on Page 1? (User drags raw swatch sheets + lifestyle mockups onto Page 1.)
- [ ] Physical raw catalog folder path (e.g. `~/Desktop/{{brand_slug}} catalog 26/jpegmini_optimized/`) — for FC-XXXX article numbers
- [ ] Sample PDF reference path if available (`~/Desktop/sample catalog.pdf`)
- [ ] Phone number to use in the bottom contact strip (NOT the number printed on raw catalog photos)
- [ ] Collection number (default 26)
- [ ] Cover image hash (the user's pre-made cover composite)

If the user hasn't dropped images yet, **wait** — do not start building. Tell them to drag images onto Page 1, then confirm before proceeding.

## Phase 1 — Discovery

### 1a. List Page 1 images

```js
// in use_figma
const p1 = figma.root.children.find(p => p.name === "Page 1");
await p1.loadAsync();
const imgs = p1.children.filter(c => c.type === "RECTANGLE" && c.fills?.[0]?.type === "IMAGE");
return JSON.stringify(imgs.map(n => ({
  id: n.id, name: n.name, hash: n.fills[0].imageHash, x: n.x, y: n.y, w: n.width, h: n.height
})));
```

Categorize by visual:
- **Cover image** — the abstract foil splash composite (~1024×1536)
- **Raw swatch sheets** — gallery photos showing 4-strip or 1+4 swatch grids on white card
- **Lifestyle mockups** — model/product photography (jacket, bag, shoes etc.)

Use `get_screenshot` on each unfamiliar hash to identify visual content.

### 1b. Read the physical raw folder

```python
# bash
ls "/path/to/folder/"
# → IMG_0873.jpg, IMG_0874.jpg, ...
```

For each file, use `Read` (the `.jpg` is small enough for inline view). Each shows ONE family with `Art. FC-6XXX` at top right and V01-V05 swatches with labels.

Build the FC mapping table:

| Figma raw image | Visual family theme | Physical FC-XXXX |
|---|---|---|
| 1:2 (4-strip florals) | Watercolour Floral | FC-6016 |
| 1:3 (4-strip leopard) | Leopard | FC-6014 |
| 1:4 (4-strip sand python) | Python Classic | FC-6013 |
| 1:5 (1+4 mint/champagne/gold/blue python) | Python Coloured | **FC-6006** |
| 1:6 (4-strip cow/zebra/giraffe) | Exotic Cow & Zebra | FC-6015 |
| 1:7 (1+4 denim) | Denim Weave | FC-6010 |
| 1:8 (4-strip crocodile) | Crocodile | FC-6011 |
| 1:9 (1+4 herringbone fine) | Herringbone · Fine | FC-6005 |
| 1:10 (1+4 herringbone coarse) | Herringbone · Coarse | FC-6002 |
| 1:11 (1+4 honeycomb basket) | Basket Weave | FC-6003 |

Each family gets its own FC code. **Never invent a code** by suffixing a
sibling family's code (e.g., `FC-6013·C` for Python Coloured is wrong —
the real Python Coloured code is FC-6006, a separate article).

Match by COLOR + TEXTURE — e.g., a Figma swatch sheet with mint-green hero + gold/blue/dark variants matches FC-6003 (sage honeycomb) better than FC-6004 (rose-gold basketweave) even though both are woven, because color matters.

### 1c. Read the sample PDF

```python
import fitz
doc = fitz.open("~/Desktop/sample catalog.pdf")
for i, page in enumerate(doc):
    page.get_pixmap(dpi=120).save(f"/tmp/{{brand_slug}}/sample/page_{i+1:02d}.png")
```

Then `Read` each rendered page to confirm format. Especially:
- Cover composition
- PRINT page layout per family (4-strip vs 1+4 + swatch sheet style)
- APPLICATIONS layout (3 mockups + reference thumb top-right + 3-col footer)
- IN DETAIL layout (use only for families with no lifestyle mockups)
- Contact page

## Phase 2 — Measure source swatches (Python)

For each raw swatch sheet, run `scripts/measure_swatches.py`:

```bash
python3 ~/.claude/skills/figma-{{brand_slug}}-catalog-generator/scripts/measure_swatches.py \
  /tmp/{{brand_slug}}/source_thumbs/img_1-2.png \
  /tmp/{{brand_slug}}/source_thumbs/img_1-3.png \
  ...
```

Output is a precise crop dict per image:

```python
"img_1-7.png": {
  "V01": [[0.795, 0, 0.107], [0, 0.293, 0.099]],   # hero region
  "V02": [[0.370, 0, 0.099], [0, 0.210, 0.442]],   # top-left small
  "V03": [[0.374, 0, 0.533], [0, 0.210, 0.442]],
  "V04": [[0.372, 0, 0.098], [0, 0.210, 0.702]],
  "V05": [[0.378, 0, 0.530], [0, 0.210, 0.702]]
}
```

Save these into your Figma plugin code as a `CROPS` dict + `ASPECT` lookup table (aspect = w / h of crop region).

## Phase 3 — Plan family pages

Per family, decide:

1. **Layout type**: 4-strip (4 swatches) or 1+4 (1 hero + 4 small)
2. **APPLICATIONS or IN DETAIL**: prefer APPS lifestyle if 3 matching mockups exist
3. **Hero V0N for the APPS page**: the colorway shown in the mockups (color match)
4. **Mockup-to-V0N mapping**: which V0N each mockup represents (color + texture match)

For families with multiple featured colorways (e.g., Basket Weave with both Antique Gold AND Midnight Navy in sample), build TWO APPS pages — one per colorway. The reference thumb on each page shows that colorway's swatch.

## Phase 4 — Build catalog

Create the Figma page and lay out all 23 frames. Use `scripts/page_builders.js` for code:

```js
const newPage = figma.createPage();
newPage.name = "★ CATALOG vN — SAMPLE FORMAT";
await figma.setCurrentPageAsync(newPage);

// Build 23 frames in a grid
buildCover(makeFrame("01 · Cover", 0, 0));
buildPrint4(makeFrame("02 · ...", 0, 1300), 2, 23, FAM_01);
buildApps(makeFrame("03 · ...", W+86, 1300), 3, 23, FAM_01);
// ...
buildContact(makeFrame("23 · End of Catalog", 0, 15600), 23, 23, contactInfo);
```

Build in chunks (2-4 families per `use_figma` call) to stay under the 50k-char limit.

## Phase 5 — QC pass

After all 23 pages built, screenshot each and assemble a 5-column contact-sheet PNG:

```python
# Local Python with PIL
from PIL import Image, ImageDraw, ImageFont
# Stitch 23 thumbnails with labels into a single review image
```

Visually verify:
- [ ] All swatches: aspect-correct, no stretching
- [ ] All mockups: FIT mode, no cropping
- [ ] Each PRINT page: V01-V05 labels visible
- [ ] Each PRINT page: physical FC-XXXX shown at bottom right
- [ ] Each APPS page: single reference thumb in top-right matching mockup colorway
- [ ] Colorway-suffix APPS pages (e.g., "— Champagne Gold"): title at 30pt, no overlap
- [ ] Bottom contact strip on all interior pages
- [ ] Cover: original image + black bar masked
- [ ] Contact: black bg + headline + 2-col contact + CFM block

Send the contact-sheet inline to the user.

## Phase 6 — Iteration (always happens)

The user iterates ~5-15 times after first pass. Common patterns and how to handle:

### "I added N new images for page X"

1. Re-list Page 1 images.
2. Identify newly added ones by ID range or by date in name (e.g., images from May 7 vs original from May 4).
3. `get_screenshot` each to confirm visual content.
4. Find page X frame, identify mockup rectangles (y=280, FIT mode, width ~231).
5. Replace fills with new hashes (still FIT mode).
6. Update captions (title + category).
7. If page X has fewer mockup rectangles than expected (e.g., 2 instead of 3), create the missing one at the third position.

### "The reference print on page X is wrong color"

1. Identify the colorway shown in mockups (color match).
2. Find the matching V0N (e.g., V05 Sky Blue).
3. Find the reference thumbnail rect (top-right, x=638, y=100, w=120).
4. Resize to match V0N aspect: `h = 120 / aspectOfV0N`.
5. Replace fill: same family hash, new crop = V0N's crop.

### "Page X has overlap top-right"

Family name with colorway suffix is too long.
1. Find the title text (size 38).
2. Change to size 30.

### "Mockups are cropped"

1. For each APPS page, find mockup rectangles (y=280).
2. Resize to 231×312.
3. Change scaleMode FILL → FIT.
4. Move captions from y=754/770/788 to y=606/622/640.

### "Use real FC-XXXX numbers / add V0N labels"

Per PRINT page:
1. Find REF text (`FC-26 / 0X`), replace with physical `FC-6XXX`.
2. Find swatch rectangles in the white card.
3. Sort by y, then x. Add `V0N` text below each.

### "Update the bottom contact info"

Per interior page (NOT cover or contact):
1. Find bottom footer texts (`[CLIENT TAGLINE]`, `{{BRAND_WORDMARK}} · [CITY, COUNTRY]`).
2. Remove them.
3. Add 4 new texts evenly distributed across the bottom: address, phone (user-provided), email, website.

### "Clip the black bar on the cover"

1. Find cover frame.
2. Add cream rectangle at y≈905, h≈175 (covers the C.F.M. distributor bar).
3. Don't modify the original image rectangle.

### "Replace cover with original"

1. Clear all cover children.
2. Place 1:15 (or user's cover hash) full-bleed FILL.
3. Optionally add cream mask for black bar.
4. Don't add overlay typography.

## Phase 7 — Final delivery

Always end with:

1. Figma file URL + page name (`★ CATALOG vN — SAMPLE FORMAT`)
2. Inline contact-sheet PNG showing all 23 pages
3. Brief summary of what's there
