# QC Checklist — Run BEFORE Declaring a Contract Done

Walk this list top-to-bottom. Fix everything before delivering the Figma link. Render each page via `get_design_context` and visually verify.

## A. Brand & identity

- [ ] the issuing entity wordmark is a real image fill (NOT recreated in substitute fonts)
- [ ] {{studio.name}} wordmark is a real image fill
- [ ] "in association with {{studio.name}}" appears in lowercase italic
- [ ] All three pages have the cyan→neon brand band at y=0 (3px tall)
- [ ] Header info (top right) shows: DOC TYPE / version·CONFIDENTIAL / REF / DATE — all on every page, all synced

## B. PII safety

- [ ] Aadhaar number is NOT in full anywhere
  - Either omitted entirely, OR shown as "XXXX XXXX YYYY" (last 4 only)
  - Label format: "Aadhaar · last 4 digits · XXXX XXXX YYYY"
- [ ] No father's name on the contract
- [ ] No candidate photo on the contract
- [ ] No bank account numbers anywhere
- [ ] PAN (if used) is in full — PAN is allowed

## C. Founders block (always BOTH)

- [ ] Founders appear in the order the user specifies
- [ ] Title for BOTH is "Co-Founder" (NEVER "Principal", "Director", "MD", "Managing Director")
- [ ] On signature page: 3 signature blocks (Intern + Founder A + Founder B)
- [ ] Contact section (bottom of page 3) has a card for each founder
- [ ] Phone rows appear only for founders who provided a number

## D. Pricing / GST / TDS

- [ ] Currency is formatted with breathing room: `₹ [AMOUNT] / month` (NEVER `₹AMOUNT/month`)
- [ ] Space after ₹ symbol, spaces around forward slash
- [ ] For interns: NO GST line (interns are personal-services, GST doesn't apply)
- [ ] For full employment: "+ 18% GST" if applicable, or omit. NEVER "GST extra" / "taxes additional"
- [ ] "TDS deducted as per applicable law" is mentioned in stipend block
- [ ] Payment day specified: "Paid on the [Nth] of every month by bank transfer"

## E. Dates & references

- [ ] Date format: `26 May 2026` (long form, consistent everywhere)
- [ ] NOT mixed with `26/05/2026` or `26-05-2026`
- [ ] DOB format same: `10 January 2005`
- [ ] Reference number on header of all 3 pages: `SKB/INT/XXXX`
- [ ] Reference is consistent across all pages (use search to verify)

## F. Section numbering integrity

- [ ] §1 Addressed To
- [ ] §2 Position & Engagement
- [ ] §3 Stipend
- [ ] §4 Scope of Engagement
- [ ] §5 Confidentiality
- [ ] §6 Intellectual Property
- [ ] §7 Code of Conduct
- [ ] §8 Termination & Notice
- [ ] §9 Governing Law
- [ ] §10 Acceptance
- [ ] In-body section references (e.g. "see §8 below") point to the CORRECT section
- [ ] Most common bug: "terminated earlier in accordance with §X" — verify X is the Termination section number (currently §8)

## G. Governing law

- [ ] Default jurisdiction: **Delhi, India** (NOT Tezpur, even though that's the registered office)
- [ ] Sentence reads: "...subject to the exclusive jurisdiction of the courts of Delhi, India."

## H. Layout — NO overlaps

Critical zones to verify visually on the rendered PNG:

### Page 1
- [ ] Header info (right column) lines don't overlap each other (4px spacing minimum)
- [ ] Stipend caption "Paid on the Nth..." fits INSIDE the dark tile, not below it
- [ ] Employer block rows (address / "in association" / GSTIN / hello) all readable, no bbox overlap
- [ ] DOB and Aadhaar rows don't touch the line above

### Page 3 (CRITICAL — most failure-prone)
- [ ] Signature cards are 218×156 (NOT 116 — that's the OLD cramped version)
- [ ] Co-Founder text (y=+52 relative to card) does NOT touch the Name above it
- [ ] Signature image (y=+100 to +140) does NOT overlap Co-Founder
- [ ] Signature image does NOT overlap "Signature"/"Date" labels (y=+142)
- [ ] Signature line (y=+120) is clearly visible between signature image and labels
- [ ] Three signature blocks are top-aligned at y=478

## I. Squint test

- [ ] Squint at each page render. Anything crooked, floating, or off-grid? Fix.
- [ ] All cards aligned to the same horizontal baseline within a row
- [ ] All eyebrow labels use the same tracking
- [ ] Body type tracking is consistent (~-6% / -0.6px)

## J. Final delivery

- [ ] Figma file URL works
- [ ] Page deep-links provided (3 of them)
- [ ] Inline screenshot rendered for the user
- [ ] List of remaining placeholders (if any)
- [ ] Update the running serial table in `SKILL.md` with the new contract row

If ANY item fails, fix it. Don't ship a contract with overlap or PII issues — they'll have to be redone.
