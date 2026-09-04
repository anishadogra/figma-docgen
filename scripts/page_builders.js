// page_builders.js — Figma plugin code template for the {{brand.name}} catalog.
//
// Run inside the `use_figma` MCP. This file is a *template* — paste the
// pieces you need into use_figma calls. Each top-level function is
// independent. Call them in order from a build script, chunked 2-4 families
// per call to stay under the 50,000-character payload limit.
//
// Required up front (do this exactly once before any other call):
//   await figma.loadFontAsync({ family: "Inter", style: "Regular" });
//   await figma.loadFontAsync({ family: "Inter", style: "Medium" });
//   await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
//   await figma.loadFontAsync({ family: "Inter", style: "Bold" });
//   await figma.loadFontAsync({ family: "Inter", style: "Black" });
//
// All page coords assume A4 portrait at 96 DPI: 794 × 1123.

// ─── tokens ───────────────────────────────────────────────────────────────
const W = 794, H = 1123;
const BG    = { r: 0.949, g: 0.933, b: 0.906 };
const INK   = { r: 0.10,  g: 0.10,  b: 0.10  };
const SOFT  = { r: 0.50,  g: 0.48,  b: 0.45  };
const RULE  = { r: 0.78,  g: 0.74,  b: 0.66  };
const GOLD  = { r: 0.65,  g: 0.50,  b: 0.20  };
const WHITE = { r: 1,     g: 1,     b: 1     };
const DARK  = { r: 0.85,  g: 0.10,  b: 0.13  };

const SHADOW = {
  type: "DROP_SHADOW",
  color: { r: 0, g: 0, b: 0, a: 0.10 },
  offset: { x: 0, y: 6 },
  radius: 14,
  visible: true,
  blendMode: "NORMAL",
};

// Default contact strip — replace `phone` per project.
const CONTACT = {
  addr:    "[STREET ADDRESS, CITY PIN]",
  phone:   "+91 00000 00000",
  email:   "INFO@{{BRAND_WORDMARK}}.COM",
  website: "WWW.{{BRAND_WORDMARK}}.COM",
};

// ─── helpers ──────────────────────────────────────────────────────────────
function txt(parent, x, y, str, opts = {}) {
  const t = figma.createText();
  t.fontName = { family: "Inter", style: opts.style || "Regular" };
  t.characters = str;
  t.fontSize = opts.size || 11;
  if (opts.tracking != null) t.letterSpacing = { value: opts.tracking, unit: "PERCENT" };
  if (opts.lh != null) t.lineHeight = { value: opts.lh, unit: "PIXELS" };
  t.fills = [{ type: "SOLID", color: opts.fill || INK }];
  if (opts.width) {
    t.textAutoResize = "HEIGHT";
    t.resize(opts.width, t.height);
  }
  t.x = x; t.y = y;
  parent.appendChild(t);
  return t;
}

function rect(parent, x, y, w, h, fill, opts = {}) {
  const r = figma.createRectangle();
  r.x = x; r.y = y; r.resize(w, h);
  r.fills = fill ? [{ type: "SOLID", color: fill }] : [];
  if (opts.cornerRadius) r.cornerRadius = opts.cornerRadius;
  if (opts.effects) r.effects = opts.effects;
  parent.appendChild(r);
  return r;
}

function imageFill(hash, scaleMode = "FILL", transform = null) {
  const f = { type: "IMAGE", imageHash: hash, scaleMode };
  if (scaleMode === "CROP" && transform) f.imageTransform = transform;
  return [f];
}

function makeFrame(name, x, y) {
  const f = figma.createFrame();
  f.name = name;
  f.resize(W, H);
  f.x = x; f.y = y;
  f.fills = [{ type: "SOLID", color: BG }];
  f.clipsContent = true;
  return f;
}

// ─── chrome (top header + bottom contact strip) ───────────────────────────
function chrome(frame, pageNum, totalPages, tag, contact = CONTACT) {
  // Top hairline + headers.
  rect(frame, 36, 32, W - 72, 0.5, RULE);

  txt(frame, 36, 44,
    `${String(pageNum).padStart(2, "0")} / ${String(totalPages).padStart(2, "0")}`,
    { size: 7, style: "Medium", tracking: 22, fill: SOFT });

  const center = txt(frame, 0, 44, "{{BRAND_WORDMARK}} — COLLECTION 26",
    { size: 7, style: "Medium", tracking: 22, fill: SOFT });
  center.x = (W - center.width) / 2;

  const right = txt(frame, 0, 44, tag,
    { size: 7, style: "Medium", tracking: 22, fill: SOFT });
  right.x = W - 36 - right.width;

  // Bottom hairline.
  rect(frame, 36, H - 50, W - 72, 0.5, RULE);

  // 4-column distributed contact strip.
  const cols = [contact.addr, contact.phone, contact.email, contact.website];
  const colW = (W - 72) / 4;
  cols.forEach((label, i) => {
    const t = txt(frame, 0, H - 38, label,
      { size: 7, style: "Medium", tracking: 18, fill: SOFT });
    const colX = 36 + colW * i;
    t.x = colX + (colW - t.width) / 2;
  });
}

// ─── COVER ────────────────────────────────────────────────────────────────
// Pure image cover. Place the user's pre-made cover composite full-bleed
// and mask the bottom black bar with a cream rectangle. NO overlay
// typography — the original image already has the wordmark/banner.
function buildCover(frame, coverHash) {
  rect(frame, 0, 0, W, H, null, {})
    .fills = imageFill(coverHash, "FILL");
  // Mask the EXCLUSIVE DISTRIBUTOR / C.F.M. black bar.
  rect(frame, 0, 905, W, 175, BG);
}

// ─── PRINT — SAMPLE SHEET (4-strip layout) ────────────────────────────────
// fam: { idx, name, desc, available[], fcCode, hash, strips: [V01..V04] }
// each strip: { transform: [[a,0,c],[0,e,f]] }  // imageTransform for CROP
function buildPrint4(frame, pageNum, totalPages, fam, contact = CONTACT) {
  chrome(frame, pageNum, totalPages, "PRINT  —  SAMPLE SHEET", contact);

  txt(frame, 36, 84, `/ ${String(fam.idx).padStart(2, "0")}`,
    { size: 11, style: "Medium", tracking: 16, fill: SOFT });
  txt(frame, 36, 102, fam.name, { size: 46, style: "Bold" });
  txt(frame, 36, 168, fam.desc, { size: 11, lh: 17, width: 580 });

  // ARTICLE block — upper right corner, FC code big and bold.
  // FC code reads as a prominent identifier at a glance, with a small
  // "ARTICLE" caption underneath. Both right-aligned to the page margin.
  const articleVal = txt(frame, 0, 84, fam.fcCode, { size: 30, style: "Bold" });
  articleVal.x = W - 36 - articleVal.width;
  const articleLbl = txt(frame, 0, 124, "ARTICLE",
    { size: 8, style: "Medium", tracking: 28, fill: SOFT });
  articleLbl.x = W - 36 - articleLbl.width;

  // White card.
  const cardX = 110, cardY = 240, cardW = W - 220, cardH = 660;
  rect(frame, cardX, cardY, cardW, cardH, WHITE, { effects: [SHADOW] });

  // 4 strips inside the card.
  const innerPad = 20, gap = 18;
  const stripW = cardW - innerPad * 2;
  const stripH = (cardH - innerPad * 2 - gap * 3) / 4;

  fam.strips.forEach((strip, i) => {
    const sw = rect(
      frame,
      cardX + innerPad,
      cardY + innerPad + (stripH + gap) * i,
      stripW, stripH,
      null,
      { effects: [SHADOW] }
    );
    sw.fills = imageFill(fam.hash, "CROP", strip.transform);

    // V0N label below.
    const label = txt(frame, 0, sw.y + sw.height + 6, `V0${i + 1}`,
      { size: 8, style: "Medium", tracking: 18, fill: SOFT });
    label.x = sw.x + sw.width / 2 - label.width / 2;
  });

  // Footer: AVAILABLE list (full bottom row — ARTICLE is now top-right).
  txt(frame, 36, 920, "AVAILABLE",
    { size: 7, style: "Medium", tracking: 28, fill: SOFT });
  txt(frame, 36, 938, fam.available.join("  ·  "),
    { size: 11, width: W - 72 });
}

// ─── PRINT — SAMPLE SHEET (1+4 layout) ────────────────────────────────────
// fam: { idx, name, desc, available[], fcCode, hash,
//        hero: {transform, aspect}, smalls: [V02..V05 each {transform, aspect}] }
function buildPrint14(frame, pageNum, totalPages, fam, contact = CONTACT) {
  chrome(frame, pageNum, totalPages, "PRINT  —  SAMPLE SHEET", contact);

  txt(frame, 36, 84, `/ ${String(fam.idx).padStart(2, "0")}`,
    { size: 11, style: "Medium", tracking: 16, fill: SOFT });
  txt(frame, 36, 102, fam.name, { size: 46, style: "Bold" });
  txt(frame, 36, 168, fam.desc, { size: 11, lh: 17, width: 580 });

  // ARTICLE block — upper right (see buildPrint4 for rationale).
  const articleLbl = txt(frame, 0, 84, "ARTICLE",
    { size: 9, style: "Medium", tracking: 28, fill: SOFT });
  articleLbl.x = W - 36 - articleLbl.width;
  const articleVal = txt(frame, 0, 100, fam.fcCode, { size: 14, style: "Bold" });
  articleVal.x = W - 36 - articleVal.width;

  const cardX = 110, cardY = 240, cardW = W - 220, cardH = 660;
  rect(frame, cardX, cardY, cardW, cardH, WHITE, { effects: [SHADOW] });

  // Hero V01 — full width within the card, height by source aspect.
  const innerPad = 20;
  const heroW = cardW - innerPad * 2;
  const heroH = Math.min(heroW / fam.hero.aspect, cardH * 0.45);
  const hero = rect(frame, cardX + innerPad, cardY + innerPad, heroW, heroH,
    null, { effects: [SHADOW] });
  hero.fills = imageFill(fam.hash, "CROP", fam.hero.transform);
  const heroLbl = txt(frame, 0, hero.y + hero.height + 6, "V01",
    { size: 8, style: "Medium", tracking: 18, fill: SOFT });
  heroLbl.x = hero.x + hero.width / 2 - heroLbl.width / 2;

  // 2×2 grid of smalls.
  const gridY = hero.y + hero.height + 32;
  const gridGap = 16;
  const smW = (heroW - gridGap) / 2;
  const labels = ["V02", "V03", "V04", "V05"];
  fam.smalls.forEach((s, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const smH = Math.min(smW / s.aspect, (cardH - heroH - 110) / 2);
    const sx = cardX + innerPad + col * (smW + gridGap);
    const sy = gridY + row * (smH + 30);
    const sw = rect(frame, sx, sy, smW, smH, null, { effects: [SHADOW] });
    sw.fills = imageFill(fam.hash, "CROP", s.transform);
    const lbl = txt(frame, 0, sy + smH + 6, labels[i],
      { size: 8, style: "Medium", tracking: 18, fill: SOFT });
    lbl.x = sx + smW / 2 - lbl.width / 2;
  });

  // Footer: AVAILABLE list (full bottom row — ARTICLE is now top-right).
  txt(frame, 36, 920, "AVAILABLE",
    { size: 7, style: "Medium", tracking: 28, fill: SOFT });
  txt(frame, 36, 938, fam.available.join("  ·  "), { size: 10, width: W - 72 });
}

// ─── APPLICATIONS (lifestyle + reference thumb) ───────────────────────────
// page: { idx, name, desc, mockups: [{hash, title, category}, ...3],
//         refThumb: {hash, transform, aspect}, footer: {...} }
function buildApps(frame, pageNum, totalPages, page, contact = CONTACT) {
  chrome(frame, pageNum, totalPages, "APPLICATIONS", contact);

  txt(frame, 36, 84, `/ ${String(page.idx).padStart(2, "0")}`,
    { size: 11, style: "Medium", tracking: 16, fill: SOFT });

  // Title — shrink to 30 if it has a colorway suffix " — ".
  const titleSize = page.name.includes(" — ") ? 30 : 38;
  txt(frame, 36, 102, page.name, { size: titleSize, style: "Bold" });

  txt(frame, 36, 168, page.desc, { size: 11, lh: 17, width: 540 });

  // Reference print thumb top-right (ALWAYS a single matched-V0N thumb).
  const refW = 120;
  const refH = refW / page.refThumb.aspect;
  const ref = rect(frame, W - 36 - refW, 100, refW, refH,
    null, { effects: [SHADOW] });
  ref.fills = imageFill(page.refThumb.hash, "CROP", page.refThumb.transform);

  // Mockups — 1 big (left) + 2 small stacked (right), all FIT mode on
  // white card. The big mockup carries the hero product shot; the two
  // smaller frames stack along the right column.
  // Layout coords (locked):
  //   BIG : x=36,  y=280, w=465, h=620   (caption block at y=915)
  //   SM1 : x=515, y=280, w=243, h=270   (caption block at y=565)
  //   SM2 : x=515, y=620, w=243, h=280   (caption block at y=915)
  const SLOTS = [
    { box: { x: 36,  y: 280, w: 465, h: 620 }, capY: 915 },
    { box: { x: 515, y: 280, w: 243, h: 270 }, capY: 565 },
    { box: { x: 515, y: 620, w: 243, h: 280 }, capY: 915 },
  ];

  page.mockups.slice(0, 3).forEach((m, i) => {
    const { box, capY } = SLOTS[i];
    // Single IMAGE fill, NO solid underlay — when FIT mode leaves
    // margins (source aspect != frame aspect), the cream page BG must
    // show through. A WHITE solid behind the image creates an ugly
    // white border that doesn't match the rest of the catalog.
    const card = rect(frame, box.x, box.y, box.w, box.h, null,
      { effects: [SHADOW] });
    card.fills = [
      { type: "IMAGE", imageHash: m.hash, scaleMode: "FIT" },
    ];

    txt(frame, box.x, capY, `/ ${String(i + 1).padStart(2, "0")}`,
      { size: 9, style: "Medium", tracking: 14, fill: SOFT });
    txt(frame, box.x, capY + 16, m.title, { size: 11, style: "Medium" });
    txt(frame, box.x, capY + 34, m.category,
      { size: 7, style: "Medium", tracking: 22, fill: SOFT });
  });

  // No bottom detail block — APPS pages rely on the chrome contact strip
  // for footer info. Big-mockup caption sits flush with the SM2 caption
  // at y=915 so the page reads as a balanced two-column composition.
}

// ─── IN DETAIL — APPLICATIONS (when no lifestyle mockups exist) ──────────
function buildInDetail(frame, pageNum, totalPages, page, contact = CONTACT) {
  chrome(frame, pageNum, totalPages, "IN DETAIL  —  APPLICATIONS", contact);

  txt(frame, 36, 84, `/ ${String(page.idx).padStart(2, "0")}`,
    { size: 11, style: "Medium", tracking: 16, fill: SOFT });
  txt(frame, 36, 102, page.name, { size: 38, style: "Bold" });
  txt(frame, 36, 168,
    "In detail — colour library and recommended applications.",
    { size: 11, lh: 17, width: 540 });

  // Swatches column (left).
  const cardX = 36, cardY = 240, cardW = 380, cardH = 540;
  rect(frame, cardX, cardY, cardW, cardH, WHITE, { effects: [SHADOW] });
  // ... (caller fills swatches via CROP transforms; layout is up to caller)

  // Right column.
  const colX = 470, colY = 240;
  txt(frame, colX, colY, "COLOURWAYS",
    { size: 7, style: "Medium", tracking: 28, fill: SOFT });
  rect(frame, colX, colY + 18, 60, 1, GOLD);
  page.colourways.forEach((cw, i) => {
    txt(frame, colX, colY + 30 + i * 18,
      `/ ${String(i + 1).padStart(2, "0")}  ${cw}`, { size: 11 });
  });

  let y = colY + 40 + page.colourways.length * 18;
  txt(frame, colX, y, "RECOMMENDED FOR",
    { size: 7, style: "Medium", tracking: 28, fill: SOFT });
  rect(frame, colX, y + 18, 60, 1, GOLD);
  page.recommendedFor.forEach((r, i) => {
    txt(frame, colX, y + 30 + i * 18, `— ${r}`, { size: 11 });
  });

  y += 40 + page.recommendedFor.length * 18;
  txt(frame, colX, y, "MOQ",
    { size: 7, style: "Medium", tracking: 28, fill: SOFT });
  txt(frame, colX, y + 18, "100m linear, mixed colourways", { size: 11 });

  y += 50;
  txt(frame, colX, y, "LEAD TIME",
    { size: 7, style: "Medium", tracking: 28, fill: SOFT });
  txt(frame, colX, y + 18, "14 days — sampling", { size: 11 });

  // Custom Shade callout.
  const csY = colY + cardH - 100;
  rect(frame, colX, csY, 280, 90, INK);
  txt(frame, colX + 16, csY + 14, "CUSTOM SHADE",
    { size: 7, style: "Medium", tracking: 28, fill: GOLD });
  txt(frame, colX + 16, csY + 36,
    "Bespoke colours and dies on a 4-week turnaround.",
    { size: 11, lh: 16, fill: WHITE, width: 250 });
}

// ─── CONTACT (page 23) ────────────────────────────────────────────────────
function buildContact(frame, pageNum, totalPages, contact = CONTACT) {
  frame.fills = [{ type: "SOLID", color: INK }];

  // Header.
  rect(frame, 36, 32, W - 72, 0.5, { r: 0.4, g: 0.4, b: 0.4 });
  txt(frame, 36, 44,
    `${String(pageNum).padStart(2, "0")} / ${String(totalPages).padStart(2, "0")}`,
    { size: 7, style: "Medium", tracking: 22, fill: { r: 0.6, g: 0.6, b: 0.6 } });
  const c = txt(frame, 0, 44, "{{BRAND_WORDMARK}} — COLLECTION 26",
    { size: 7, style: "Medium", tracking: 22, fill: { r: 0.6, g: 0.6, b: 0.6 } });
  c.x = (W - c.width) / 2;
  const r2 = txt(frame, 0, 44, "CONTACT",
    { size: 7, style: "Medium", tracking: 22, fill: { r: 0.6, g: 0.6, b: 0.6 } });
  r2.x = W - 36 - r2.width;

  txt(frame, 36, 110, "END OF CATALOG  ·  COLLECTION 26",
    { size: 9, style: "Medium", tracking: 28, fill: { r: 0.7, g: 0.7, b: 0.7 } });

  txt(frame, 36, 144, "Make something",
    { size: 64, style: "Bold", lh: 70, fill: WHITE });
  txt(frame, 36, 218, "that lasts.",
    { size: 64, style: "Bold", lh: 70, fill: WHITE });

  txt(frame, 36, 320,
    "Sample requests, custom colours and bespoke programmes\non application. Sampling within fourteen days.",
    { size: 13, lh: 18, fill: { r: 0.85, g: 0.85, b: 0.85 } });

  rect(frame, 36, 410, 80, 1, WHITE);

  txt(frame, 36, 440, "{{BRAND_WORDMARK}}.", { size: 38, style: "Bold", fill: WHITE });
  txt(frame, 36, 488, "[Client tagline]",
    { size: 11, fill: { r: 0.7, g: 0.7, b: 0.7 } });

  // Two-col contact block.
  txt(frame, 36, 580, "{{BRAND_WORDMARK}}",
    { size: 8, style: "Semi Bold", tracking: 32, fill: GOLD });
  txt(frame, 36, 602, "F-355, Sector 63", { size: 11, fill: WHITE });
  txt(frame, 36, 622, "[City, State PIN]", { size: 11, fill: WHITE });
  txt(frame, 36, 642, "India", { size: 11, fill: WHITE });

  txt(frame, W / 2, 580, "GET IN TOUCH",
    { size: 8, style: "Semi Bold", tracking: 32, fill: GOLD });
  txt(frame, W / 2, 602, contact.email.toLowerCase(), { size: 11, fill: WHITE });
  txt(frame, W / 2, 622, contact.phone, { size: 11, fill: WHITE });
  txt(frame, W / 2, 642, "{{brand_slug}}.com", { size: 11, fill: WHITE });
  txt(frame, W / 2, 662, "@{{brand_slug}}", { size: 11, fill: WHITE });

  // EXCLUSIVE DISTRIBUTOR cream block.
  const distY = 760;
  rect(frame, 36, distY, W - 72, 96, BG);
  txt(frame, 56, distY + 14, "EXCLUSIVE DISTRIBUTOR",
    { size: 8, style: "Semi Bold", tracking: 32, fill: DARK });
  txt(frame, 56, distY + 32, "C.F.M.", { size: 38, style: "Bold", fill: INK });
  txt(frame, 56, distY + 76, "Italian Transfer Foils  ·  Direct from Lombardy",
    { size: 11, fill: INK });

  // Bottom rule + chip strip.
  rect(frame, 36, H - 67, W - 72, 0.5, { r: 0.3, g: 0.3, b: 0.3 });
  txt(frame, 36, H - 57,
    "● FOILS    ● FOILED LEATHER    ● CUT PLATES    ● PRINTING",
    { size: 7, style: "Medium", tracking: 28, fill: { r: 0.7, g: 0.7, b: 0.7 } });
}

// ─── catalog grid layout ──────────────────────────────────────────────────
// Place 23 frames on a single page in the canonical {{brand.name}} grid.
// Returns an array of {name, x, y} positions for cover, 10 families × 2 pages
// (PRINT + APPS), optional extra colorway APPS, and the contact page.
function buildCatalogGrid({ familyCount = 10, extraApps = {} } = {}) {
  const colGap = 86, rowGap = 177, rowH = H + rowGap;
  const layout = [];

  // Row 0: cover.
  layout.push({ name: "01 · Cover", x: 0, y: 0 });

  // Rows 1..N: each family → PRINT (col 0) + APPS (col 1) + optional APPS (col 2).
  for (let i = 0; i < familyCount; i++) {
    const y = (i + 1) * rowH;
    const idx = i + 1;
    layout.push({ name: `${String(2 + i * 2).padStart(2, "0")} · /${idx} PRINT`, x: 0, y });
    layout.push({ name: `${String(3 + i * 2).padStart(2, "0")} · /${idx} APPS`,
                  x: W + colGap, y });
    if (extraApps[idx]) {
      layout.push({ name: `${String(3 + i * 2).padStart(2, "0")}b · /${idx} APPS — ${extraApps[idx]}`,
                    x: 2 * (W + colGap), y });
    }
  }

  // Final row: contact.
  layout.push({
    name: "23 · End of Catalog",
    x: 0,
    y: (familyCount + 1) * rowH,
  });

  return layout;
}

// ─── usage example ────────────────────────────────────────────────────────
// (Paste into a use_figma call after loading Inter weights.)
//
// const newPage = figma.createPage();
// newPage.name = "★ CATALOG v1 — SAMPLE FORMAT";
// await figma.setCurrentPageAsync(newPage);
//
// const grid = buildCatalogGrid({ familyCount: 10, extraApps: { 10: "Antique Gold" } });
// const frames = grid.map(g => makeFrame(g.name, g.x, g.y));
//
// buildCover(frames[0], COVER_HASH);
// buildPrint4(frames[1], 2, 23, FAM_01);
// buildApps  (frames[2], 3, 23, APPS_01);
// // ... continue for each family, chunked across multiple use_figma calls
// buildContact(frames[frames.length - 1], 23, 23);
