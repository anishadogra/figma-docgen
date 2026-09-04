# Page Templates — pixel-precise specs

All pages: 794 × 1123 px (A4 portrait), cream background.

## Page 1 — Cover

```
y=0    ┌──────────────────────────────────────────────┐
       │                                              │
       │                                              │
       │     [Original cover image — full bleed]      │
       │                                              │
       │     scaleMode: FILL                          │
       │                                              │
       │                                              │
       │                                              │
       │                                              │
y≈905  │  ┌──────────────────────────────────────┐    │
       │  │  CREAM RECTANGLE — clips black bar    │   │
       │  │  x=0, y=905, w=794, h=175             │    │
y≈1080 │  └──────────────────────────────────────┘    │
       │                                              │
       │     (chip strip from original image)         │
y=1123 └──────────────────────────────────────────────┘
```

The cover is the user's original cover image (e.g., 1:15 — abstract foil splash with COLLECTION 26 banner, {{BRAND_WORDMARK}} logo, tagline, and chip strip).

The image is placed full-bleed with `scaleMode: "FILL"`. Aspect mismatch (source ~0.667, target 0.707) means a small vertical crop top/bottom (~33.5px each).

The black `EXCLUSIVE DISTRIBUTOR / C.F.M. / Italian Transfer Foils` bar appears at source y ≈ 0.83-0.93 → target y ≈ 905-1080. Mask it with a cream rectangle at y=905, h=175.

**Don't add overlay typography** — the original image already has COLLECTION 26 and {{BRAND_WORDMARK}} logo; do not add bigger versions.

## Pages 2-22 (interior) — common chrome

### Top header
```
y=32  ┌──────────────────────────────────────────────┐  thin rule, x=36 to W-36, color RULE, 0.5px
y=44     PG/TT  {{BRAND_WORDMARK}} — COLLECTION 26   PAGE_TAG
                size 7pt, Medium, tracking 18-22%, fill SOFT
       └──────────────────────────────────────────────┘
```

### Bottom contact strip
```
y=H-50 ┌──────────────────────────────────────────────┐  thin rule
y=H-38   ADDR        PHONE        EMAIL       WEBSITE
                4 items, evenly distributed across the bottom
                size 7pt, Medium, tracking 18%, fill SOFT
```

The 4 contact items, each centered in its 1/4-width column:
1. `[STREET ADDRESS, CITY PIN]`
2. `+91 [user-provided phone]` — e.g., `+91 00000 00000`
3. `INFO@{{BRAND_WORDMARK}}.COM`
4. `WWW.{{BRAND_WORDMARK}}.COM`

## PRINT — SAMPLE SHEET (4-strip layout)

```
y=84    / 0X                              FC-6XXX   (eyebrow size 11 Medium 16% SOFT;
                                                     FC code Bold 30pt INK, right-aligned x=W-36)
y=102   Family Name                                  (Bold 46pt INK)
y=124   (—)                               ARTICLE   (size 8 Medium 28% SOFT, right-aligned x=W-36)
y=168   Description text wrapping to 2-3 lines       (Regular 11pt INK width 560 lh 17)

y=240   ┌───────────────────────────────────────┐   white card x=110 to W-110, y=240 to 900
        │                                       │
        │   ┌─────────── strip 1 ───────────┐   │   each strip ~510 wide × ~135 tall
        │   └───────────────────────────────┘   │   centered on card, with drop shadow
        │              V01                       │   V0N label below, Medium 8pt 18% SOFT
        │                                       │
        │   ┌─────────── strip 2 ───────────┐   │
        │   └───────────────────────────────┘   │
        │              V02                       │
        │                                       │
        │   ... (4 strips total)                │
        │                                       │
y=900   └───────────────────────────────────────┘

y=920   AVAILABLE                                    (size 7 Medium tracking 28% SOFT)
y=938   Name1 · Name2 · Name3 · Name4               (Regular 11pt INK; full bottom row, no right-side article)
```

**ARTICLE block placement note:** Originally lived at bottom-right (y=920/938
at 7pt/11pt). Now at the upper-right corner with the FC code rendered big
(Bold 30pt INK, y=84) and a small "ARTICLE" caption beneath it (size 8
Medium 28% SOFT, y=124). Both right-aligned to x=W-36 (page margin). FC
code reads as a prominent identifier at a glance, mirroring the `/ 0X`
eyebrow on the left. Bottom row is now AVAILABLE-only.

Strip dimensions: stripW = 510, stripH = (innerCardH - 3*stripGap) / 4 where innerCardH = 660 - 40 = 620, stripGap = 18. Each strip's actual rendered height = `min(stripW / sourceStripAspect, stripH)`.

## PRINT — SAMPLE SHEET (1+4 layout)

```
y=84    / 0X                              ARTICLE   (right-aligned x=W-36, size 9 Medium 28% SOFT)
y=100   (—)                               FC-6XXX   (right-aligned x=W-36, Bold 14pt INK)
y=102   Family Name
y=168   Description

y=240   ┌───────────────────────────────────────┐   white card
        │                                       │
y=270   │   ┌─────── V01 hero ───────────┐     │   heroW=510, heroH = 510/heroAspect
        │   └─────────────────────────────┘     │   centered on card, drop shadow
        │              V01                       │   V01 label below
        │                                       │
        │   ┌── V02 ──┐  ┌── V03 ──┐            │   2x2 grid below hero
        │   └─────────┘  └─────────┘            │   each smW=240, smH = 240/smallAspect
        │      V02            V03                │   gap 16
        │                                       │
        │   ┌── V04 ──┐  ┌── V05 ──┐            │
        │   └─────────┘  └─────────┘            │
        │      V04            V05                │
        │                                       │
y=900   └───────────────────────────────────────┘

y=920   AVAILABLE                                  (size 7 Medium tracking 28% SOFT)
y=938   V0N1 · V0N2 · V0N3 · V0N4 · V0N5          (Regular 10pt for 5 names; full bottom row)
```

## APPLICATIONS (lifestyle)

Layout: **1 big mockup on the left + 2 small stacked on the right** (replaces
the earlier 3-equal-column grid). Big-mockup caption sits flush with SM2's
caption at y=915 so the page reads as a balanced two-column composition;
SM1's caption tucks between SM1 and SM2 at y=565.

```
y=84    / 0X                                       │   ┌─ REFERENCE PRINT thumb ─┐
y=102   Family Name (— Colorway)                  │   │   single matched V0N    │
                                                   │   │   x=W-156, w=120, h auto │
y=168   Description                                │   └──────────────────────────┘

y=280   ┌──────────────────────┐   ┌─── SM1 ─────┐
        │                      │   │  243 × 270   │
        │       BIG mockup     │   │  FIT mode    │
        │       465 × 620      │   │  white bg    │
        │       FIT mode       y=550└─────────────┘
        │       white bg       y=565 / 02
        │                      y=581 Title
        │                      y=599 CATEGORY
        │                      y=620 ┌─── SM2 ─────┐
        │                            │  243 × 280   │
        │                            │  FIT mode    │
        │                            │  white bg    │
y=900   └──────────────────────┘ y=900└─────────────┘
y=915   / 01                          / 03                (eyebrows size 9 Medium 14% SOFT)
y=931   Big mockup title              Title              (Medium 11pt INK)
y=949   CATEGORY                      CATEGORY           (size 7 Medium 22% SOFT)

(no bottom detail block — page ends here; chrome contact strip
 lives at y=H-38 from the standard footer)
```

**Bottom block removed:** v4 originally rendered a 3-column ORDER INFO /
RECOMMENDED LEATHER / RESERVE PROGRAMME block with a thin rule at y=880.
That whole region was deleted on user request — APPS pages now end at the
mockup captions and rely on the chrome contact strip for the footer.

**Mockup dimensions (locked):**
- Big: `x=36, y=280, w=465, h=620` (aspect 0.75 — clean fit for 1086×1448 sources)
- Small 1 (top right): `x=515, y=280, w=243, h=270`
- Small 2 (bottom right): `x=515, y=620, w=243, h=280`
- All three use **scaleMode: "FIT"** so the entire image is visible — never FILL.

**Caption Y values:** big and SM2 captions both sit at y=915 (the page reads
as a balanced two-column composition); SM1 caption sits between SM1 and
SM2 at y=565.

The reference print thumbnail in top-right (y=100, x=W-156, w=120) is **a single thumbnail** showing the specific V0N matched to the mockups. NOT a stack of all 4 colorways. Compute height from V0N crop aspect: `h = 120 / aspect`.

When the family name carries a colorway suffix (e.g., `Herringbone · Fine — Champagne Gold`), shrink title from 38pt to 30pt to avoid overlapping the reference thumb.

## IN DETAIL — APPLICATIONS

Use only when the family has zero matching lifestyle mockups (rare — prefer APPS lifestyle). Layout:

```
y=84    / 0X
y=102   Family Name (38pt)
y=168   In detail — colour library and recommended applications.

y=240   ┌───────── swatches column ─────────┐    ┌── COLOURWAYS ──┐
        │   white card 380 × 540             │    │  / 01 Name1     │
        │                                    │    │  / 02 Name2     │
        │   4-strip stacked OR 1+4 grid      │    │  / 0N NameN     │
        │                                    │    │                 │
        │                                    │    │  RECOMMENDED FOR│
        │                                    │    │  — Item 1       │
        │                                    │    │  — Item 2       │
        │                                    │    │                 │
        │                                    │    │  MOQ            │
        │                                    │    │  100m linear... │
        │                                    │    │                 │
        │                                    │    │  LEAD TIME      │
        │                                    │    │  14 days        │
        │                                    │    │                 │
        │                                    │    │  ┌───────────┐  │
        │                                    │    │  │CUSTOM SHADE│ │
        │                                    │    │  │black box  │  │
        │                                    │    │  └───────────┘  │
y=780   └────────────────────────────────────┘    └─────────────────┘
```

Right column starts at x=470. Section labels in size 7 Medium 28% SOFT, with a 60px gold/rule line below each. Custom Shade box: black fill, gold "CUSTOM SHADE" caption, white body text.

## Page 23 — Contact

Black background `INK`, all text in white or light gray, with a cream `EXCLUSIVE DISTRIBUTOR / C.F.M.` block in the middle.

```
y=44    23 / 23   {{BRAND_WORDMARK}} — COLLECTION 26   CONTACT     (white-ish header, fill 0.6 gray)

y=110   END OF CATALOG  ·  COLLECTION 26                   (size 9 Medium 28% fill 0.7 gray)

y=144   Make something                                      (Bold 64pt WHITE lh 70)
y=218   that lasts.                                         (Bold 64pt WHITE lh 70)

y=320   Sample requests, custom colours and bespoke programmes  (Regular 13pt 0.85 gray)
y=344   on application. Sampling within fourteen days.

y=410   ────────                                            (80px white rule, 1px)

y=440   {{BRAND_WORDMARK}}.                                        (Bold 38pt 4% WHITE)
y=488   [Client tagline]                       (Regular 11pt 12% 0.7 gray)

y=580   {{BRAND_WORDMARK}}                       GET IN TOUCH      (size 8 Semi Bold 32% GOLD)
y=602   F-355, Sector 63                  info@{{brand_slug}}.com
y=622   [City, State PIN]       +91 [phone]
y=642   India                             {{brand_slug}}.com
y=662                                     @{{brand_slug}}

y=760   ┌────────── EXCLUSIVE DISTRIBUTOR ─────────────┐   (cream block, x=36, w=W-72, h=96)
        │  EXCLUSIVE DISTRIBUTOR (red 0.85, 0.10, 0.13)│
        │  C.F.M.                                       │  (Bold 38pt INK)
        │  Italian Transfer Foils  ·  Direct from Lombardy
y=856   └───────────────────────────────────────────────┘

y=1056  ────────────────────────────────────────         (thin rule, 0.30 gray)
y=1066  ● FOILS    ● FOILED LEATHER   ● CUT PLATES   ● PRINTING  (chip strip, fill 0.7 gray)
```

## Frame layout on the page

Place all 23 frames on a single Figma page (`★ CATALOG vN — SAMPLE FORMAT`):

```
Row 0  (y=0)        Cover (x=0)
Row 1  (y=1300)     /01 PRINT (x=0)        /01 APPS (x=880)
Row 2  (y=2600)     /02 PRINT              /02 APPS
...
Row 11 (y=14300)    /10 PRINT              /10 APPS Antique Gold      /10 APPS Midnight Navy (x=1760)
Row 12 (y=15600)    Contact (x=0)
```

Frame width 794, gap 86 horizontally, gap 177 vertically (rows = 1300 px tall).
