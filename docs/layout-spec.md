# Layout Specification — Exact Pixel Positions

All coordinates are absolute relative to each page frame. Pages are A4 portrait at 1× = **794 × 1123 px**.

The reference file is the reference contract (the counterparty, file key `{{figma.reference_file_key}}`). Open it in Figma side-by-side when building a new contract to copy structure.

---

## PAGE 1 — Header / Position / Stipend (frame `7:2`)

### Header band (y=0 to y=108)

```
0    , 0    : Brand gradient strip — h=3, w=794 (cyan→neon)
56   , 48   : the issuing entity wordmark — 168×38 image fill
244  , 52   : Divider rule — w=1, h=30, #E6E6E6
264  , 53   : {{studio.name}} wordmark — 60×28 image fill
264  , 83   : "in association with {{studio.name}}" — text 7px tracking 2.1px #7B7B7B
738  , 48   : (right-aligned) "INTERN ENGAGEMENT LETTER" — Semi Bold 9px tracking 5.4px
738  , 62   : (right-aligned) "JUNIOR DEVELOPER · v02 · CONFIDENTIAL" — Medium 7px
738  , 74   : (right-aligned) "REF · SKB/INT/XXXX" — Regular 7.5px
738  , 89   : (right-aligned) "DATE · [DD Month YYYY]" — Regular 7.5px
56   , 108  : Horizontal rule — 1px #040404, w=682
```

### Hero block (y=138 to y=340)

```
56   , 138  : "DOCUMENT  ·  INTERNSHIP ENGAGEMENT LETTER" — eyebrow Semi Bold 9px tracking 5.4px
56   , 162  : "Internship Engagement Letter" — Title display 40px (auto-wraps 2 lines)
518  , 158  : Info card bg — 220×120, #F7F7F7, radius 12
518  , 158  : Vertical accent bar — 3×120, gradient cyan→neon
536  , 174  : "EFFECTIVE FROM" — eyebrow 7.5px tracking 4.5px #7B7B7B
536  , 188  : "[START DATE]" — Semi Bold 14px
536  , 218  : "DURATION" — eyebrow same style
536  , 232  : "[DURATION]" — Semi Bold 11px
56   , 262  : Opening paragraph (~3 lines wrapping at w=442)
56   , 340  : Horizontal divider rule
```

### Section 01: Addressed To (y=358 to y=530)

```
56   , 358  : "01" numeral — Semi Bold 12px #B1B1B1
88   , 360  : "ADDRESSED TO · THE INTERN" — section heading
56   , 388  : "CANDIDATE" eyebrow
56   , 404  : "[CANDIDATE NAME]" — Semi Bold 17px
56   , 432  : address (2 lines wrapping)
56   , 466  : "Date of Birth · [DD Month YYYY]" — Regular 10px
56   , 485  : "Aadhaar · last 4 digits · XXXX XXXX YYYY" (masked!)
408  , 388  : "EMPLOYER" eyebrow
408  , 404  : "the issuing entity" — Semi Bold 17px
408  , 432  : the issuing entity address (2 lines)
408  , 468  : "in association with {{studio.name}}" — italic
408  , 489  : "GSTIN · {{client.gstin}}"
408  , 510  : "Hello · {{entity.domain}}"
56   , 530  : Horizontal divider rule
```

### Opening salutation (y=548 to y=644)

```
56   , 548  : "Dear Mr./Ms. [Surname]," — Semi Bold 14px
56   , 574  : Welcome paragraph (~3 lines wrapping at w=682)
56   , 644  : Horizontal divider rule
```

### Section 02: Position & Engagement (y=662 to y=854)

```
56   , 662  : "02" numeral
88   , 664  : "POSITION & ENGAGEMENT" — section heading
```

4 cards in a row, each 166×76, gap 6px, top-rule 2px #040404 + bg #F7F7F7 radius 8:
```
56   , 692  : ROLE card           — "[ROLE]"
228  , 692  : REPORTING TO card   — "[REPORTING MANAGER]"  
400  , 692  : START DATE card     — "[START DATE]"
572  , 692  : DURATION card       — "[DURATION]"
```

Each card has eyebrow at y=704 and value at y=720 (line-height 1.35).

```
56   , 782  : Role paragraph (~3 lines, references §8 for termination)
56   , 854  : Horizontal divider rule
```

### Section 03: Stipend (y=872 to y=998)

```
56   , 872  : "03" numeral
88   , 874  : "STIPEND" — section heading
56   , 902  : Dark hero tile — 682×96, #040404, radius 12
662  , 916  : Decorative gradient block — 56×68, radius 8
80   , 920  : "MONTHLY STIPEND" — eyebrow tracking 4.8px color #0EF (cyan!)
80   , 934  : "₹ [AMOUNT]  /  month" — Semi Bold 28px white (DOUBLE SPACES around /)
80   , 976  : "Paid on the [Nth] of every month by bank transfer  ·  TDS deducted as per applicable law" — 9.5px #E6E6E6
```

### Footer (y=1075 to y=1101)

```
56   , 1075 : Divider rule
56   , 1087 : "{{ENTITY_WORDMARK}}  ·  INTERN ENGAGEMENT LETTER  ·  [CANDIDATE NAME]" — 7px tracking 2.1px
738  , 1087 : (right-aligned) "01 / 03" — 8.5px tracking 5.1px Semi Bold
```

---

## PAGE 2 — Scope / Confidentiality / IP / Conduct (frame `9:2`)

Same brand band at y=0, same header info at y=52-66, same footer.

### Section 04: Scope of Engagement (y=118 to y=486)

```
56   , 118  : "04" numeral
88   , 120  : "SCOPE OF ENGAGEMENT" — section heading
56   , 148  : Intro paragraph (~2 lines)
```

4 scope cards in 2×2 grid, each 299×120, gap 28h × 22w:
```
56,  226 → 355, 308 → 74-padded text: "Scripts & Automation"
421, 226 → 720, 308 → 74-padded text: "Engineering Support"  
56,  350 → 355, 432 → text: "Learning Assignments"
421, 350 → 720, 432 → text: "Documentation"
```

Each card: eyebrow "01"/"02" at y=top+14, name at y=top+28 (Semi Bold 16-18px), 3-line description below.

```
56   , 458  : Italic note about {{studio.name}} engagements
```

### Section 05: Confidentiality (y=526 to ~y=624)

```
56   , 526  : "05" numeral
88   , 528  : "CONFIDENTIALITY"
56   , 556  : Body paragraph (~5 lines)
```

### Section 06: Intellectual Property (y=666 to ~y=780)

```
56   , 666  : "06" numeral
88   , 668  : "INTELLECTUAL PROPERTY"
56   , 696  : Dark callout card — 682×62 #040404 radius 12, gradient top rule
76   , 710  : "IP — ASSIGNED TO THE COMPANY" eyebrow color #0EF
76   , 726  : IP body text white
```

### Section 07: Code of Conduct (y=810 to ~y=920)

```
56   , 810  : "07" numeral
88   , 812  : "CODE OF CONDUCT"
```

3 conduct cards in a row, each 195×60, soft bg:
```
56   , 854  : Professional conduct
299  , 854  : No conflict of interest
529  , 854  : Honest reporting
```

---

## PAGE 3 — Termination / Acceptance / Contacts (frame `11:2`)

### Section 08: Termination (y=118 to y=286)

```
56   , 118  : "08" numeral
88   , 120  : "TERMINATION & NOTICE"
```

Two side-by-side cards, 335×124:
```
56   , 148  : Soft card (#F7F7F7), top rule #040404 — "BY THE INTERN" — "30 days' written notice"
403  , 148  : Dark card (#040404), top rule gradient — "BY THE COMPANY" — "Immediate, for cause"
```

### Section 09: Governing Law (y=304 to y=394)

```
56   , 304  : "09" numeral
88   , 306  : "GOVERNING LAW"
56   , 334  : Body paragraph (single sentence, references "courts of [CITY], India" — default: Delhi)
```

### Section 10: Acceptance — SIGNATURE BLOCKS (y=412 to y=634)

```
56   , 412  : "10" numeral
88   , 414  : "ACCEPTANCE"
56   , 442  : Acceptance line ("I, [Candidate Name], accept the role of [Role] on the terms set out in this letter.")
```

**THREE signature cards side by side at y=478, each 218w × 156h, gap 14px:**

```
Card 1 (Intern):    x=56,  y=478, w=218, h=156, border 1px #040404, radius 10
Card 2 (Founder A):  x=288, y=478, w=218, h=156
Card 3 (Founder B):  x=520, y=478, w=218, h=156
```

Within each card (relative anchors — add card.x and card.y):

```
+14, +14 : Eyebrow "THE INTERN" / "FOR {{ENTITY_WORDMARK}}" — Semi Bold 8px tracking 4.8px #7B7B7B
+14, +30 : Name "[Candidate Name]" / "[Founder A name]" / "[Founder B name]" — Semi Bold 13px
+14, +52 : "Co-Founder" (only on cards 2 and 3) — Regular 9.5px tracking -0.57 #3D3D3D
+14, +100: SIGNATURE IMAGE — h=40, w=variable (preserve aspect)
+14, +120: Signature underline — 1px #040404, w=138
+158,+120: Date underline — 1px #040404, w=46
+14, +142: "Signature" label — Regular 8px tracking 1.6px #7B7B7B
+158,+142: "Date" label — Regular 8px tracking 1.6px #7B7B7B
```

**Signature image positioning notes:**
- Founder A signature (example aspect ≈ 2.86): place at +14, +100 → w=114, h=40
- Founder B signature (example aspect ≈ 1.45): place at +40, +100 → w=58, h=40 (centered horizontally in the line area)
- BOTH heights = 40px. Widths differ because their actual signatures have different aspect ratios. Embrace the asymmetry.

### Contact section (y=652 onward)

```
56   , 652  : Horizontal divider rule
56   , 670  : "QUESTIONS · {{STUDIO_WORDMARK}} CO-FOUNDERS" — section heading
```

Two contact cards (Founder A + Founder B), 335×76, soft bg, dark left bar:
```
56   , 692  : Founder A card  (bg + left bar at x=56)
403  , 692  : Founder B card (bg + left bar at x=403)
```

Within each card (relative anchors):
```
+16, +12 : "CO-FOUNDER" eyebrow
+16, +26 : Name (Semi Bold 13px)
+16, +46 : {{entity.domain}}
+16, +66 : (only where a phone was provided) phone "+91 [phone]"; a card with no phone has NO phone row
```

Below:
```
56   , 780  : "General · {{entity.domain}}  ·  in association with {{studio.name}}" — italic small
```

### Footer (same as Page 1 with page number "03 / 03")

---

## Hard rules for positioning

1. **Signature cards MUST be 218×156.** Anything smaller causes overlap. This was learned through 4+ iterations.
2. **Signatures positioned ABOVE the line, not crossing it.** Sig at y=+100 (relative), line at y=+120, labels at y=+142. Clean zones.
3. **Labels "Signature" / "Date" stay at y=+142** (relative to card top). Never closer to the line.
4. **Co-Founder text at y=+52.** Don't move it to make room for sig — the structural fix is bigger cards, not lifting Co-Founder.
