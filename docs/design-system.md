# the issuing entity Contract Design System

Locked design tokens for all contracts. Pulled verbatim from the the issuing entity Brand Guidelines PDF.

## Colors

### Primary palette

```
Charcoal (ink):      #040404
White background:    #FFFFFF
```

### Accent — gradient only (per brandbook "Use the accents as gradient")

```
Cyan start:          #0EF  (or #00EEFF)
Neon end:            #2BD37F
```

Used as:
- 3px page-top brand band (linear horizontal gradient cyan→neon)
- 2px accent bars on dark cards
- 3px vertical bar inside the Effective From info card
- Top edge of the IP "ASSIGNED TO THE COMPANY" callout
- Small gradient logo accent in stipend tile

### Greyscale ramp (UI)

```
Body ink:            #1E1E1E   (NOT pure black — softer for readability)
Secondary text:      #3D3D3D
Tertiary / labels:   #7B7B7B
Disabled / dividers: #B1B1B1
Light divider:       #E6E6E6
Card background:     #F7F7F7
```

## Typography

Single family: **Inter**.

| Weight | Style name (Figma) | Use |
|---|---|---|
| Semi Bold | `Semi Bold` (with space!) | Headlines, section titles, names |
| Medium | `Medium` | Sub-display, header info |
| Regular | `Regular` | Body, labels |
| Italic | `Italic` | "in association with {{studio.name}}", captions |

**Gotcha:** Inter uses `Semi Bold` (space), not `SemiBold`. Set both in `figma.loadFontAsync({family: "Inter", style: "Semi Bold"})`. Same for `Extra Bold`.

## Type scale (within an A4 contract at 794px wide)

| Token | Size | Line-height | Tracking | Color | Use |
|---|---|---|---|---|---|
| Title display | 40px | 1.08 | -1.2px | #040404 | Page 1 main hero "Internship Engagement Letter" |
| Entity name | 17px | 1.7 | -1.7px | #040404 | "the issuing entity", "the counterparty" |
| Card name | 13px | 1.7 | -1.04px | #040404 | Name in signature cards |
| Section heading | 9.5px | 1.7 | +5.7px (heavy track) | #040404 | "POSITION & ENGAGEMENT" |
| Eyebrow label | 7.5–8px | 1.7 | +4.5px to +4.8px | #7B7B7B | "CANDIDATE", "EMPLOYER", "ROLE" |
| Body paragraph | 10.5–11px | 1.65–1.7 | -0.63px to -0.66px (≈-6%) | #1E1E1E | All body copy |
| Small italic | 9.5–10px | 1.7 | -0.57px to -0.6px | #7B7B7B | "in association with {{studio.name}}" |
| Footer label | 7–7.5px | 1.7 | +2.1px to +5.1px | #7B7B7B | Page footer crumbs |
| Section numeral | 12px | 1.7 | -0.72px | #B1B1B1 | "01", "02", "03" beside section titles |

**Tracking convention:** Body Inter at -6% (= negative letter-spacing) for tighter, more refined feel. This is per the brand spec. Apply uniformly.

## Spacing system

A4 portrait page: **794 × 1123 px** at 1×.

```
Outer margin (left/right): 56px
Inner content width:        682px (794 - 56*2)
Top safe area:              48px to 108px (header band)
Bottom safe area:           1075px (footer divider)
Section gap (between blocks): 18-30px depending on element
Card internal padding:      14-18px
```

## Component library

### Card variants

| Variant | Bg | Border | Accent | Use |
|---|---|---|---|---|
| Soft card | #F7F7F7 | none | dark left bar | Info chips (Effective From, Position cards, contact cards) |
| Bordered card | white | 1px #040404 | none | Signature blocks |
| Dark callout | #040404 | none | gradient top stripe | IP Assignment, "BY THE COMPANY" termination |

Border radius:
- Info cards: 8px
- Hero / callout cards: 12px
- Contact cards: 10px
- Signature cards: 10px

### Signature card (CRITICAL — must be this exact size)

**Size: 218w × 156h.** Three sit side-by-side on Page 3 with 14px gutters.

Originally 116h — too cramped, caused overlap. After multiple iterations the 156h spec works cleanly. **Do not shrink it.**

Internal anchors (relative to card top-left):
- Eyebrow label: y=14, x=14, h=14, tracking +4.8px
- Name: y=30, x=14, h=22, text-13px
- Co-Founder text (optional 3rd line): y=52, x=14, h=16, text-9.5px
- *(empty zone for signature image)*
- Signature image: y=100, h=40 (sized horizontally by aspect)
- Signature underline: y=120, h=1px, w=138 (left) + 46 (right gap)
- "Signature" / "Date" labels: y=142, h=14, text-8px

Card bottom: y=156.

## Voice / tone

Per the issuing entity brand book:
- Clear, methodical, business-first
- No marketing fluff, no superlatives
- Direct but warm ("Dear Mr. [Surname]," not "Dear Sir/Madam")
- Use Indian English conventions
- Numbers always formatted: "thirty (30) days", "₹ 15,000"
- Currency: ALWAYS space around `₹` and `/` — `₹ 15,000 / month` (NEVER `₹15,000/month`)

## Page top band

3px gradient strip (cyan → neon) spanning full width at y=0. Visual signature of every page.

## Footer

Every page has at y=1075:
```
[divider rule, 1px #040404, w=682]

{{ENTITY_WORDMARK}}  ·  INTERN ENGAGEMENT LETTER  ·  [CANDIDATE NAME]                 0X / 03
```
- Left text: text-7px tracking +2.1px color #7B7B7B
- Right page number: text-8.5px tracking +5.1px color #040404
