# {{brand.name}} Catalog — Design Language

Locked specs. Don't deviate.

## Page format

- **Dimensions**: 794 × 1123 px (A4 portrait at 96 DPI)
- **Orientation**: portrait
- **Background**: warm cream `{ r: 0.949, g: 0.933, b: 0.906 }` (≈ #F2EEE7)

## Color tokens

```js
const BG    = { r: 0.949, g: 0.933, b: 0.906 };  // page background
const INK   = { r: 0.10,  g: 0.10,  b: 0.10  };  // primary text + dark blocks
const SOFT  = { r: 0.50,  g: 0.48,  b: 0.45  };  // secondary text, footer, tracked labels
const RULE  = { r: 0.78,  g: 0.74,  b: 0.66  };  // thin hairlines (top/bottom chrome)
const GOLD  = { r: 0.65,  g: 0.50,  b: 0.20  };  // distributor caption gold (sparingly)
const WHITE = { r: 1,     g: 1,     b: 1     };  // swatch cards, mockup card backdrops
const DARK  = { r: 0.85,  g: 0.10,  b: 0.13  };  // CFM red — only on contact page distributor block
```

## Typography

**Font family: Inter only.** No serifs (Playfair was wrong in earlier attempts). Load all weights upfront:

```js
await figma.loadFontAsync({ family: "Inter", style: "Regular" });
await figma.loadFontAsync({ family: "Inter", style: "Medium" });
await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
await figma.loadFontAsync({ family: "Inter", style: "Bold" });
await figma.loadFontAsync({ family: "Inter", style: "Black" });
```

### Type scale

| Element | Style | Size | Tracking | Notes |
|---|---|---|---|---|
| Family name (PRINT) | Bold | 46pt | 0 | y ≈ 102 |
| Family name (APPS) | Bold | 38pt | 0 | shrink to 30pt if colorway suffix runs long |
| Cover "Collection" | Medium | 38pt | 0 | |
| Cover "26" | Black | 230pt | 0 | line-height 220 |
| Cover wordmark "{{BRAND_WORDMARK}}." | Bold | 22pt | 4% | (only when typing the wordmark — usually we use the image) |
| Headline (Contact) "Make something / that lasts." | Bold | 64pt | 0 | line-height 70 |
| C.F.M. (cover + contact) | Bold | 32-38pt | 0 | |
| Section subtitle (Reference Print, Available, Order Info, etc.) | Medium | 7pt | 28% | small caps style via tracking + uppercase |
| Body description | Regular | 11pt | 0 | line-height 17, max width ~540-580 |
| Mockup caption — title | Medium | 11pt | 0 | "Cropped Foiled Jacket" |
| Mockup caption — category | Medium | 7pt | 22% | "GARMENT" / "SMALL LEATHER" / "FOOTWEAR" |
| Mockup caption — index | Medium | 9pt | 14% | "/ 01" |
| AVAILABLE colourway list | Regular/Medium | 10-11pt | 0 | dot-separated names |
| ARTICLE / REF code | Bold | 11pt | 0 | bottom-right of PRINT page |
| Page number / page tag | Medium | 7pt | 18-22% | top header |
| Footer chrome | Medium | 7pt | 18-28% | bottom strip |
| V0N label (under swatch) | Medium | 8pt | 18% | center under swatch |

## Page chrome

Every interior page (pages 2-22) has identical chrome:

### Top
```
y=32  ┌──────────────────────────────────────────────┐  thin rule (W-72 wide, 0.5px, RULE color)
y=44  PG/TT  {{BRAND_WORDMARK}} — COLLECTION 26  PAGE_TAG    page numbers + center title + right tag
                                                       size 7pt, Medium, tracking 18-22%, fill SOFT
```

Page tags vary:
- PRINT pages: `"PRINT  —  SAMPLE SHEET"`
- APPS pages: `"APPLICATIONS"`
- IN DETAIL pages: `"IN DETAIL  —  APPLICATIONS"`
- Contact: `"CONTACT"`

### Bottom (interior pages)
```
y=H-50 ┌──────────────────────────────────────────────┐  thin rule
y=H-38   ADDR ·  PHONE  ·  EMAIL  ·  WEBSITE              4 evenly-distributed contact items
                                                            size 7pt, Medium, tracking 18%, fill SOFT
```

The 4 items:
1. `[STREET ADDRESS, CITY PIN]`
2. `+91 [user-provided phone]` (user gives the number; do NOT use the one from raw catalog photos)
3. `INFO@{{BRAND_WORDMARK}}.COM`
4. `WWW.{{BRAND_WORDMARK}}.COM`

Each centered in its 1/4-width column.

### Cover and Contact bottom

Cover and Contact have their own bottom layouts (not the standard chrome footer):
- **Cover**: chip strip at very bottom (`● FOILS · ● FOILED LEATHER · ● CUT PLATES · ● PRINTING`) — comes from the original cover image
- **Contact**: cream CFM distributor block + chip strip in `{ r: 0.7, g: 0.7, b: 0.7 }` on black

## Effects

- **Drop shadow on swatches and mockup cards**:
  ```js
  effects: [{
    type: "DROP_SHADOW",
    color: { r: 0, g: 0, b: 0, a: 0.10 },
    offset: { x: 0, y: 6 },
    radius: 14,
    visible: true,
    blendMode: "NORMAL"
  }]
  ```
  Subtle. Don't increase opacity/radius — the sample is restrained.

## Layout grid

- **Page margins**: 36px left/right, 32-50px top/bottom (chrome rules sit at y=32 top, y=H-50 bottom)
- **Description max width**: 540-580px from x=36
- **Mockup column count**: 3 (always)
- **Mockup gaps**: 14px between mockups, 22px in BW Antique Gold layout
- **White card padding**: ~20px inside the swatch card

## V0N label placement

Small `V0N` text directly below each swatch on PRINT pages, centered horizontally with the swatch:

```js
const t = txt(parent, 0, sw.y + sw.height + 6, `V0${i+1}`, {
  size: 8, style: "Medium", tracking: 18, fill: SOFT
});
t.x = sw.x + sw.width / 2 - t.width / 2;
```
