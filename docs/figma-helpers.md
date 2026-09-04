# Figma Plugin Code Snippets — Reusable

Drop these into the `code` parameter of `mcp__a03998a6-...-__use_figma` calls. Hard-tested with the the reference contract build.

## Boilerplate header — start every script with this

```js
const log = [];
await figma.setCurrentPageAsync(figma.root.children[0]);

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
```

## Find text nodes containing a substring

```js
const pages = figma.root.children;
for (const page of pages) {
  await figma.setCurrentPageAsync(page);
  const texts = page.findAll(n => n.type === "TEXT");
  for (const tn of texts) {
    if (tn.characters && tn.characters.includes("SEARCH TERM")) {
      log.push(`Found ${tn.id}: "${tn.characters.substring(0, 100)}"`);
    }
  }
}
```

## Edit text (always load fonts first)

```js
const node = await figma.getNodeByIdAsync("X:Y");
if (node) {
  await loadAllFontsInText(node);
  node.characters = "New text";
}
```

## Move a node

```js
const node = await figma.getNodeByIdAsync("X:Y");
if (node) {
  node.x = NEW_X;
  node.y = NEW_Y;
}
```

## Resize a node

```js
node.resize(width, height);
```

## Delete a node

```js
const node = await figma.getNodeByIdAsync("X:Y");
if (node) node.remove();
```

## Find image-fill nodes (e.g. newly dropped signatures)

```js
const candidates = page.findAll(n => {
  if (n.type !== "RECTANGLE" && n.type !== "FRAME") return false;
  if (!n.fills || !Array.isArray(n.fills)) return false;
  return n.fills.some(f => f.type === "IMAGE" && f.imageHash);
});
for (const c of candidates) {
  const f = c.fills.find(x => x.type === "IMAGE");
  log.push(`[${c.id}] ${c.name} ${c.width}x${c.height} @ (${c.x},${c.y}) hash=${f.imageHash}`);
}
```

## Create new rectangle with image fill (signature placement)

```js
const sigRect = figma.createRectangle();
sigRect.name = "Founder A signature";
sigRect.resize(114, 40);
sigRect.x = 302;  // align to card
sigRect.y = 578;  // 100px below card top
sigRect.fills = [{
  type: "IMAGE",
  scaleMode: "FIT",
  imageHash: "ABC...HASH_FROM_DRAGGED_IMAGE..."
}];
sigRect.strokes = [];  // no border
page3.appendChild(sigRect);
```

## Reparent a node (move from canvas to a page frame)

```js
const sig = await figma.getNodeByIdAsync("81:3");
const page3 = await figma.getNodeByIdAsync("11:2");
page3.appendChild(sig);  // automatically removes from old parent
sig.x = NEW_X;
sig.y = NEW_Y;
```

## Bulk move — shift many nodes by same offset

```js
const SHIFT = 40;
const idsToShift = ["11:46", "11:47", "11:48", /* ... */];
for (const id of idsToShift) {
  const n = await figma.getNodeByIdAsync(id);
  if (n) {
    n.y = n.y + SHIFT;
    log.push(`${id}: shifted to y=${n.y}`);
  }
}
```

## Anti-patterns — DO NOT use

```js
// ❌ Not supported
await figma.loadAllPagesAsync();

// ❌ Not supported
figma.currentPage = somePage;

// ❌ Causes "An unexpected error" on large payloads
const huge_b64 = "..."; // 30K chars
const image = figma.createImage(atob(huge_b64));
```

Use these instead:
- `setCurrentPageAsync(page)` for navigation
- Ask user to drag PNG, then read hash from canvas (for large images)

## Pattern: complete contract scaffold (new file)

For starting a brand new contract, this scaffolds the 3 page frames with brand band + header. Variables in CAPS.

```js
const VARS = {
  REF: "SKB/INT/0002",
  DATE: "[DD Month YYYY]",
  CANDIDATE: "[CANDIDATE NAME]",
  ROLE: "[ROLE TITLE]",
  START: "[START DATE]",
  DURATION: "[DURATION]",
  STIPEND: "[AMOUNT]",
  PAY_DAY: "[Nth]",
};

// Load all required fonts upfront
const fonts = [
  {family: "Inter", style: "Semi Bold"},
  {family: "Inter", style: "Medium"},
  {family: "Inter", style: "Regular"},
  {family: "Inter", style: "Italic"},
];
for (const f of fonts) await figma.loadFontAsync(f);

// Create 3 page frames at A4 portrait
const page1 = figma.createFrame();
page1.name = "Page 1 — Header, Position, Stipend";
page1.resize(794, 1123);
page1.fills = [{type: "SOLID", color: {r:1, g:1, b:1}}];
// ... etc
```

(Full scaffold is verbose — easier to clone the the reference contract file and overwrite values.)

## Pattern: cloning the the reference contract file

Easiest path for new contracts: open file `{{figma.reference_file_key}}`, "Duplicate to drafts" in Figma UI, then run a single use_figma script that updates all VARS at once via search-and-replace.

```js
// Update reference number on all pages
const oldRef = "the reference contract";
const newRef = "SKB/INT/0002";

for (const page of figma.root.children) {
  await figma.setCurrentPageAsync(page);
  const texts = page.findAll(n => n.type === "TEXT" && n.characters.includes(oldRef));
  for (const tn of texts) {
    await loadAllFontsInText(tn);
    tn.characters = tn.characters.replace(oldRef, newRef);
  }
}
```
