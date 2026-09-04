# Lessons Learned — the reference contract Build Notes

Hard-won insights from the first contract build (the counterparty, May 2026). Read this before you start a new contract. Each lesson is a thing that went wrong and how to avoid it.

---

## 1. Don't confuse document types

**What went wrong:** First iteration used "Engaging Entities ↔ Hire" framing and "Stipend invoiced in arrears" payment language. That's a B2B engagement letter ({{brand.name}} style), not an employment contract.

**Lesson:** Employment/internship contracts use **employer ↔ employee** framing.
- Pay: "monthly stipend, paid by bank transfer"
- IP: "all work product belongs to the employer"
- Termination: notice from employee side, immediate-for-cause from company side

When the user says "intern contract" — it's employer/employee. Not client/vendor.

---

## 2. PII is NOT optional

**What went wrong:** I almost put the full Aadhaar number in the contract.

**Lesson:** Aadhaar = national ID = financial-grade PII. UIDAI guidelines + Indian HR practice say NEVER print it in full. Either:
- Mask: `Aadhaar · last 4 digits · XXXX XXXX 8857`
- Omit and use PAN instead
- Reference: "Aadhaar copy on file with HR"

Same for: bank accounts, passport numbers, photographs. None of these go in the printed contract.

---

## 3. Signature cards: 218×156, NOT 116

**What went wrong:** Original cards were 218×116. That gave ~12px between Co-Founder text and the signature line. A 38px signature placed there overlapped the "Signature" label below. Iteration 2 tried moving labels down → labels collided with card bottom. Iteration 3 tried shrinking signatures → they looked tiny.

**Lesson:** The cards need to be **156px tall** for signatures to fit cleanly:
- Top zone (y=14-68 rel): label, name, co-founder text
- Middle zone (y=68-100 rel): empty buffer
- Signature zone (y=100-140 rel): 40px image above the line
- Bottom zone (y=142+ rel): "Signature" / "Date" labels

If you keep cards at 116, you'll fail. Go straight to 156.

When you bump card height, ALSO push everything below the cards (divider, contact section, footer position references) down by the same amount.

---

## 4. Signatures sit ABOVE the line, not crossing it

**What went wrong:** Tried centering signatures vertically on the signature line. They overlapped Co-Founder text above AND "Signature" labels below.

**Lesson:** Position signatures so:
- Sig.bottom ≈ sig_line.y (touches line at bottom of signature)
- Sig.top is 30-40px above the line
- Sig spans entirely in the empty zone between Co-Founder and the line

This matches how a person actually signs a paper contract — above the line, not bisecting it.

---

## 5. Aspect ratios vary; embrace the asymmetry

**What went wrong:** Tried to make two founders' signatures the same width. Couldn't, because one signature was a wide cursive (aspect about 2.86) and the other a tall monogram (about 1.45).

**Lesson:** Match by HEIGHT (both at 40px), let widths differ:
- Wide cursive: 114w × 40h
- Tall monogram: 58w × 40h

Don't try to "fix" this. Real signatures have natural variation.

---

## 6. ₹ and / need spaces around them

**What went wrong:** `₹15,000/month` rendered with letters touching. Looked cramped.

**Lesson:** Always write currency as `₹ 15,000 / month` with:
- Space after ₹ symbol
- Spaces on BOTH sides of `/`
- Tighten letter-spacing to ~-2% (not -20%, which makes ₹ kern into digits)

---

## 7. Don't use `figma.loadAllPagesAsync()` — not supported

**What went wrong:** Tried to load all pages upfront. Plugin API threw `"loadAllPagesAsync is not a supported API"`.

**Lesson:** Iterate pages individually:
```js
for (const page of figma.root.children) {
  await figma.setCurrentPageAsync(page);
  const texts = page.findAll(n => n.type === "TEXT");
  // ...
}
```

After `setCurrentPageAsync`, the page's children are accessible.

---

## 8. Big PNG uploads via base64 fail through the MCP

**What went wrong:** Tried to upload 15-30KB signature PNGs by embedding base64 in the `use_figma` code parameter. Got a generic "An unexpected error occurred" from Figma every time.

**Lesson:** The MCP transport flakes on large code payloads. For images bigger than ~5KB:
1. Ask the user to drag the PNG onto the Figma canvas
2. Then read the new image-fill node via `findAll`
3. Reposition / resize it programmatically

A tiny 1×1 PNG embed worked fine. Anything >10KB started failing.

---

## 9. Don't use loadAllFontsInText for one-off character changes

Every text edit needs the font loaded first. Helper pattern:

```js
async function loadAllFontsInText(tn) {
  const len = tn.characters.length;
  if (len === 0) return;
  const fonts = new Set();
  for (let i = 0; i < len; i++) {
    try {
      const f = tn.getRangeFontName(i, i + 1);
      if (f && f !== figma.mixed) fonts.add(JSON.stringify(f));
    } catch (e) {}
  }
  for (const f of fonts) await figma.loadFontAsync(JSON.parse(f));
}

// Then before any tn.characters = "..." assignment:
await loadAllFontsInText(tn);
tn.characters = "new text";
```

---

## 10. Inter "Semi Bold" has a space (Inter quirk)

**What went wrong:** `figma.loadFontAsync({family: "Inter", style: "SemiBold"})` failed silently.

**Lesson:** Inter's style names use spaces:
- `Semi Bold` not `SemiBold`
- `Extra Bold` not `ExtraBold`

This is unique to Inter. Other fonts (Fraunces, etc.) use `SemiBold`. Verify with `listAvailableFontsAsync` if in doubt.

---

## 11. Always cross-check section references in body text

**What went wrong:** Body text said "...terminated earlier in accordance with §7" but §7 was Code of Conduct. The intended reference was §8 (Termination & Notice).

**Lesson:** After laying out sections, search all body paragraphs for `§N` references and verify each points to the section that actually matches its meaning. Section numbers may shift between iterations; references must follow.

---

## 12. Co-Founder, not Principal

**What went wrong:** v1 used "Principal" as the founder title. User firmly corrected: "Co-Founder, not Principal."

**Lesson:** Both founders are titled "Co-Founder" everywhere. Section heading uses "{{STUDIO_WORDMARK}} CO-FOUNDERS" (not "PRINCIPALS").

---

## 13. Don't include phone numbers we don't have

**What went wrong:** v1 contact card had `+91 — phone to confirm` placeholder for one founder. Looked unfinished.

**Lesson:** If a phone number isn't provided, OMIT the row entirely. Don't leave placeholder text on a contract that will be signed. A card without a phone has 3 lines (title, name, email); one with a phone has 4 (title, name, email, phone). Asymmetric but clean.

---

## 14. Render between every change

When you make structural edits (reposition multiple nodes, change card sizes), immediately call `get_design_context` to see the result. Bbox math can be misleading — the only way to know if it looks right is to look at it.

If you don't render and check, you'll ship a layout that "should work on paper" but has visible overlaps.

---

## 15. Governing law: where you OPERATE, not where you're registered

**What went wrong:** Set governing law to Tezpur, Assam (the issuing entity's legal address).

**Lesson:** the issuing entity is REGISTERED in Tezpur but OPERATES from Delhi. Disputes will be resolved in Delhi courts. Default to Delhi for jurisdiction. Only use Tezpur if the user explicitly wants it.

---

## Reference: full iteration log of the reference contract

For posterity (and so the next person doesn't repeat the same mistakes):

1. Initial build: B2B framing → user said "this is employee, not client"
2. Rebuild with employer/employee framing
3. Theme: {{brand.name}} → user said "different doc type, use the issuing entity brand book"
4. Rebuild with the issuing entity charcoal+gradient palette
5. Sig cards too cramped (h=116) → overlap with labels
6. Tried moving labels down → cards still too small
7. Tried shrinking signatures → looked tiny
8. Tried moving Co-Founder up → overlapped with Name
9. **Final fix:** card height 116→156 + cascade everything below down by 40px

Lesson of lessons: when layout is fundamentally too cramped, **make the container bigger**. Don't try to squeeze elements into insufficient space.
