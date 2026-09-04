# figma-docgen

**Generate business documents as real Figma files — contracts, invoices, catalogs — driven by code, with the layout locked to a validated build.**

Not "export a PDF from a template." The output is a native, editable Figma document with correct type ramps, real image fills and pixel-exact positions, produced programmatically from a config.

---

## Why do it this way

A contract or a product catalog is a design artefact. It has a type system, a grid, a cover, signature blocks and a QC standard. Producing it in a word processor loses all of that; producing it by hand in Figma loses a working day per document and drifts every time.

So: the layout is specified to the pixel once, validated against a real build, and thereafter driven by config. The parts that change per document — names, dates, amounts, page contents — are the only parts anyone touches.

## The system

| | |
|---|---|
| `docs/layout-spec.md` | Every element's absolute position on an A4 page at 1× = 794 × 1123 px. 264 lines. |
| `docs/design-system.md` | The type ramp — size, line height, letter spacing and colour for every text role. |
| `docs/page-templates.md` | Page archetypes for multi-page documents: cover, sample spread, applications spread, contact page. |
| `docs/figma-helpers.md` | The Figma plugin-API patterns that actually work, and the ones that silently don't. |
| `docs/qc-checklist.md` | What to verify before a document is considered done. |
| `docs/workflow.md` | The build order, and why it is that order. |
| `docs/pitfalls.md` | **295 lines. Every mistake made across four rebuilds.** |
| `docs/lessons-learned.md` | 206 lines of the same, from the contract side. |
| `scripts/build_invoice.js` | Invoice generator. Paste into the Figma code tool with a config. |
| `scripts/page_builders.js` | Catalog page builders, one function per page archetype. |
| `scripts/measure_swatches.py` | Measures source images so crop rectangles are computed, never eyeballed. |

## The pitfalls file is the point

Half a thousand lines of this repository are a record of things that went wrong and the specific fix. A sample:

- **`clone()` drops edits silently.** Cloning a node and modifying it can lose the modification with no error. Render and verify node by node; never trust that a clone took your change.
- **Eyeballed crop rectangles capture two rows in one frame.** Picking crop ranges by reading ratios off a contact sheet put two swatches inside one target rectangle. That is why `measure_swatches.py` exists — the crop is computed from the image, not judged by eye.
- **Font weight names are not consistent between families.** One family wants `"Semi Bold"`, another wants `"SemiBold"`. Always resolve the real name with `listAvailableFontsAsync` before setting it, or the text silently falls back.
- **A phone number printed on a source photo is not a source of truth.** It got copied into a contact strip. Ask for contact details explicitly; never read them off artwork.

None of these are things you reason your way to in advance. They are what four rebuilds cost, written down so the fifth is cheap.

## Configuration

Nothing identifying lives in source. Copy `config.example.json` to `config.json` and fill it in:

```bash
cp config.example.json config.json
```

`config.json` is gitignored. **Bank details, account numbers, addresses and contact details must never enter source control** — this repository is structured that way because a prior version of the invoice script had real account details hardcoded in it.

Templates reference config as `{{payee.name}}`, `{{client.gstin}}`, `{{brand.name}}` and so on.

## Requirements

The Figma plugin API, reached through an MCP `use_figma` tool or a plugin context. `measure_swatches.py` needs Pillow. `page_builders.js` and `build_invoice.js` are pasted into the Figma code environment rather than run under Node.

MIT licensed.
