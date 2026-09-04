# Pitfalls — every mistake that happened building v1→v4

These all happened during the original {{brand.name}} catalog build. The
exhaustive list is here so future runs can avoid them. If you find yourself
about to do any of these, stop and re-read the relevant fix.

## Image / crop / aspect

### 1. Eyeballed crop rectangles capture two rows in one frame
**What happened:** Picked V0N y-ranges by reading the visual ratio off a
contact sheet. Several swatches showed up with two strips stacked inside one
target rectangle (e.g. V02 + part of V03 visible together).

**Why:** Source swatch sheets have a consistent vertical layout but
NON-uniform spacing between strips. A 0.55–0.75 y-range that looked right
for one image straddled two strips on another.

**Fix:** Run `scripts/measure_swatches.py` on every source. It detects
non-white bands and emits exact normalized bounds. Never type crop numbers
by hand.

### 2. CROP imageTransform on a frame whose aspect ≠ crop aspect → stretching
**What happened:** Set `scaleMode: "CROP"` with the right transform but kept
the frame at a fixed size, so the underlying texture got squashed
horizontally or vertically.

**Fix:** `frameHeight = frameWidth / cropAspect` per family. Compute the
crop aspect from the imageTransform: `aspect = (a * sourceW) / (e * sourceH)`
where `a` is `transform[0][0]` and `e` is `transform[1][1]`.

### 3. FILL on lifestyle mockups crops the model out
**What happened:** Used `scaleMode: "FILL"` for jacket / bag / shoe mockups
and the photos got zoomed in — heads cut off, products half-visible.

**Fix:** Mockups are ALWAYS `scaleMode: "FIT"`. Frame fills must be a
**single IMAGE fill, no SOLID underlay**. With FIT, source aspect ≠ frame
aspect means visible margins — and those margins must show the cream page
background, not a stark white solid. Adding a `{type:"SOLID", color:WHITE}`
fill behind the image creates visible white borders that don't match the
rest of the catalog. Match exactly: `card.fills = [{type:"IMAGE",
imageHash, scaleMode:"FIT"}]`.

### 4. Ratio of mockups inverted between PRINT and APPS
**What happened:** Spent multiple iterations trying to make APPS layouts
match the swatch crops. They are different: swatches are CROP (sub-region of
a swatch sheet) and mockups are FIT (full image, never cropped).

**Fix:** Decide per-rectangle BEFORE you set fills:
- Swatch on PRINT page → CROP + transform + matching frame aspect
- Reference thumb on APPS page → CROP + transform + matching frame aspect
- Mockup on APPS page → FIT (with white backdrop fill underneath)

## Color / colorway matching

### 5. Default V01 thumbnail on every APPS page
**What happened:** All APPS pages defaulted to V01 (the hero) for the
top-right reference thumbnail, even when mockups featured V03 or V05.

**Fix:** Look at the mockup color first, find the V0N that matches, and
only then build the reference thumbnail with that V0N's transform. Match by
COLOR + TEXTURE, not by alphabetical order.

### 6. Stack of 4 thumbs instead of one matched thumb
**What happened:** Earliest APPS pages had a vertical stack of all 4
colorways in the corner.

**Fix:** Single thumbnail only. The user's instruction:
> "See the mock-up prints' color and then put only that print on the right
> top corner."

### 7. Color match by texture, ignoring hue
**What happened:** Both Sage Honeycomb and Rose-Gold Basketweave have woven
texture, so I once matched the wrong family to a swatch sheet.

**Fix:** Color first, then texture. A mint-green hero with gold/blue
variants is FC-6003 (sage honeycomb). A rose-gold woven sheet is FC-6004.

## FC numbers / labels

### 8. Made-up FC codes
**What happened:** Two flavors of this:
1. Used `FC-26 / 0X` as a placeholder and shipped it.
2. When a family didn't have a matching raw photo on hand (e.g. Python
   Coloured was a ChatGPT-generated reference image, not a raw catalog
   shot), I invented `FC-6013·C` by tacking `·C` onto the Python Classic
   code instead of looking up the real one.

**Fix:** Read the physical raw catalog folder. Each photo has the real
`Art. FC-6XXX` printed on it. Build the mapping table in Phase 1 and use
those codes verbatim on PRINT pages. Even when the catalog visual is a
synthetic / AI-generated stand-in, the FC code MUST come from the real
physical photo of the same family — Python Coloured = FC-6006 (a separate
article from Python Classic FC-6013), NOT a derived suffix code. If you
cannot find a real photo for a family, ask the user; do not invent.

### 9. Missing V01–V05 labels
**What happened:** First pass had swatches with no labels at all.

**Fix:** Always emit a small `V0N` text below each swatch (Medium 8pt,
tracking 18%, fill SOFT) centered horizontally with the swatch.

### 10. Cobalt "Hollow" instead of "Yellow"
**What happened:** Typo'd a colorway name reading from photo at small
resolution.

**Fix:** Read raw photos at full resolution. Cross-check colorway names
between the photo's printed labels and the AVAILABLE list before shipping.

## Cover

### 11. Built a "designer" cover with overlay typography
**What happened:** Added a giant "26" + a {{BRAND_WORDMARK}} wordmark overlay on
top of the user's cover image. User rejected it three times.

**Fix:** The cover is the user's pre-made composite. Place it full-bleed
with `scaleMode: "FILL"`, then mask the EXCLUSIVE DISTRIBUTOR / C.F.M. black
bar with a cream rectangle at y=905, h=175. **No overlay text. No "improvements."**

### 12. Tried to keep the black distributor bar visible on the cover
**What happened:** Left the black bar showing because "the user might want
it." They didn't.

**Fix:** Always mask it with the cream rect. The CFM block belongs on the
contact page only.

## Page count / structure

### 13. Built fewer than 23 pages
**What happened:** Skipped pages or treated colorway-suffix APPS as part of
the parent family count.

**Fix:** 23 frames every time:
- 1 cover
- 10 families × 2 pages (PRINT + APPS) = 20
- 1 contact
- 1 extra colorway-suffix APPS page (typically Basket Weave Antique Gold OR
  Midnight Navy)

= **23 total**. Adjust the third column on row 11 if there's a second
colorway suffix.

### 14. Built individual pages, missed the catalog grid layout
**What happened:** First builds put pages anywhere on the canvas, made
contact-sheet review impossible.

**Fix:** Use `buildCatalogGrid()` to get canonical (x, y) per frame.
Row 0 = cover, rows 1..N = PRINT (col 0) + APPS (col 1) + optional second
APPS (col 2), final row = contact.

## Layout glitches

### 15. Page 11/15 missing the middle mockup
**What happened:** Build script created only 2 of 3 mockup rectangles on
some pages — silent off-by-one in the loop.

**Fix:** Always check `mockups.length === 3` before each APPS page render.
Iteration phase should include a "count rectangles" QA pass.

### 16. Title overlap with reference thumb
**What happened:** Family name with colorway suffix
("Herringbone · Fine — Champagne Gold") at 38pt ran into the top-right
reference thumbnail.

**Fix:** If the page name contains ` — `, render title at 30pt instead of
38pt. The `buildApps` function in `page_builders.js` does this
automatically.

### 17. Lost reference thumbnail on iteration
**What happened:** While editing page 17, I deleted the ref thumb thinking
it was a stale element from a prior build.

**Fix:** Reference thumbnails on APPS pages are required. Check every APPS
page has exactly one rect at x=W-156, y=100 before declaring done.

### 18. Captions in wrong y-position after switching FILL→FIT
**What happened:** When mockup heights changed (from FILL-cropped frames to
FIT 231×312), captions stayed at y=754/770/788 — way below the smaller new
mockups, hovering in dead space.

**Fix:** Caption y-positions:
- FIT 231×312 mockups → captions at y=606 / 622 / 640
- (legacy FILL 231×440 mockups had y=754 / 770 / 788 — DON'T use this)

## Footer / contact

### 19. Used the phone number printed on raw catalog photos
**What happened:** The raw photos have the number printed on the source photos printed on them. I
copied that into the bottom contact strip.

**Fix:** Always ask the user for the phone number explicitly. The user
provides a different number for the catalog (e.g. +91 00000 00000) than
what's printed on raw photos.

### 20. Wrong footer text for interior pages
**What happened:** First builds had `[CLIENT TAGLINE] / {{BRAND_WORDMARK}} · [CITY, COUNTRY]` centered at the bottom — copied from a different
brand element.

**Fix:** Bottom of every interior page is a 4-column distributed contact
strip: address · phone · email · website. The cover and contact page have
their own bottoms (chip strip on cover, CFM block + chip strip on contact).

## Plugin code mechanics

### 21. Tried to use Inter Black without loading it
**What happened:** Got `Cannot load font Inter Black` errors mid-build.

**Fix:** Load all five Inter weights up front in EVERY use_figma call:
```js
await figma.loadFontAsync({ family: "Inter", style: "Regular" });
await figma.loadFontAsync({ family: "Inter", style: "Medium" });
await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
await figma.loadFontAsync({ family: "Inter", style: "Bold" });
await figma.loadFontAsync({ family: "Inter", style: "Black" });
```

### 22. 50,000-character limit on use_figma payload
**What happened:** Tried to build all 23 pages in one call → silent
truncation, half the catalog missing.

**Fix:** Build in chunks of 2-4 families per call. Set up the page once,
then make multiple calls each containing a subset of `buildPrint*` /
`buildApps` invocations. The `figma` global persists across calls.

### 23. Missing await on setCurrentPageAsync
**What happened:** Created the new page but kept building on Page 1.

**Fix:** Always:
```js
const newPage = figma.createPage();
newPage.name = "★ CATALOG vN — SAMPLE FORMAT";
await figma.setCurrentPageAsync(newPage);
```
And call it BEFORE `figma.createFrame()` etc.

### 24. Picked the wrong image for a family by index
**What happened:** Treated source images as "image 1, image 2, image 3"
without checking visual content. Mismatched a leopard sheet to the python
family.

**Fix:** `get_screenshot` every unfamiliar hash to confirm visual content
before assigning to a family. Build the FC mapping table from physical
photos, not from Figma node order.

## Iteration etiquette

### 25. Re-running full build instead of patching
**What happened:** When user said "page 17 ref color is wrong," I rebuilt
the whole catalog.

**Fix:** Iteration phase = surgical edits only. Find the specific node by
name + position, replace the fill or update the text, screenshot just that
page, send back. Do NOT regenerate frames.

### 26. Forgetting that Page 1 has new images on iteration
**What happened:** User said "I added 3 images to Page 1 for page 11" and I
skipped re-listing Page 1, used stale image data.

**Fix:** When the user says "I added images," ALWAYS re-list Page 1 first
(IDs, hashes, dates) and identify the new ones by date or ID range before
touching the catalog page.

### 27. Reading old screenshot instead of fresh one
**What happened:** After making edits, I described the result based on the
prior screenshot.

**Fix:** Take a fresh `get_screenshot` of the modified frame after every
edit. Never trust the visual model of a frame you haven't just rendered.

## Communication

### 28. Claiming "everything is fixed" without QA
**What happened:** Reported success after each round, then user found 4
more issues.

**Fix:** Run the QC checklist (workflow.md Phase 5) on EVERY round before
claiming completion. Build the contact-sheet PNG and inspect each
thumbnail. Don't say "done" until the checklist passes.

### 29. Not asking for the phone / collection number up front
**What happened:** Used placeholder values, then had to redo the bottom
strip on 21 pages.

**Fix:** Phase 0 of workflow.md gates on confirming inputs. Don't start
building until you have: Figma file URL, source-images-on-Page-1 confirmed,
raw folder path, phone number, collection number, cover hash.

## Memory / state

### 30. Forgetting the FC mapping mid-iteration
**What happened:** After several rounds I'd lost track of which Figma
hash mapped to which FC code and started swapping them.

**Fix:** Save the FC mapping table to a Python dict / JSON in the build
script and reference it. Don't keep it in working memory across iterations.
