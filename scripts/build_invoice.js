// build_invoice.js — generate an invoice as a real Figma document.
// Paste into the `use_figma` tool (code param) after pointing CONFIG at your data.
// Layout coordinates are LOCKED to a validated build. Change CONFIG, not coords.
//
// Load payee/billed-to from config.json rather than editing this file, so bank
// details never live in source control. See config.example.json.

// ===================== CONFIG =====================
const CONFIG = {
  invoiceNo: "00001",                 // ask explicitly; never silently reuse
  date: "01 January 2026",            // "DD Month YYYY"
  service: "Design Consulting Services",
  amount: "INR 00,000",               // used in BOTH the service-row TOTAL and Total Due
  payee: {
    name: "{{payee.name}}",
    bank: "{{payee.bank}}",
    ifsc: "{{payee.ifsc}}",
    accountNumber: "{{payee.account_number}}",
    accountName: "{{payee.account_name}}",
    addressLines: ["{{payee.address_line_1}}", "{{payee.address_line_2}}", "{{payee.address_line_3}}"],
    phone: "{{payee.phone}}",
    email: "{{payee.email}}",
  },
};
const BILLED_TO = [
  "{{client.legal_name}}",
  "{{client.address_line_1}}",
  "{{client.address_line_2}}",
  "",
  "GSTIN: {{client.gstin}}",
  "Email: {{client.email}}",
];
// ==================================================

const ink  = {r:0.07,g:0.07,b:0.07};
const grey = {r:0.32,g:0.32,b:0.32};
const line = {r:0.80,g:0.80,b:0.80};
const bg   = {r:0.953,g:0.949,b:0.941};

await figma.loadFontAsync({family:"Inter",style:"Regular"});
await figma.loadFontAsync({family:"Inter",style:"Bold"});

const page = figma.currentPage;
const F = figma.createFrame();
F.name = "Invoice — " + CONFIG.payee.name;
F.resize(900, 1273);
F.x = 0; F.y = 0;
F.fills = [{type:"SOLID", color:bg}];
F.clipsContent = true;
page.appendChild(F);

const L = 88, R = 812, W = R - L;

function txt(x,y,chars,size,style,color,align,boxW){
  const t = figma.createText();
  t.fontName = {family:"Inter", style:style};
  t.fontSize = size;
  t.characters = chars;
  t.fills = [{type:"SOLID", color:color||ink}];
  t.lineHeight = {value:size*1.4, unit:"PIXELS"};
  if(boxW){ t.textAutoResize="HEIGHT"; t.resize(boxW, t.height); }
  else { t.textAutoResize="WIDTH_AND_HEIGHT"; }
  if(align){ t.textAlignHorizontal=align; }
  F.appendChild(t); t.x=x; t.y=y; return t;
}
function rule(y){
  const r = figma.createRectangle();
  r.resize(W,1); r.fills=[{type:"SOLID",color:line}];
  F.appendChild(r); r.x=L; r.y=y; return r;
}

// Header
txt(L, 88, "Invoice", 56, "Bold", ink);
txt(L, 96, "Invoice no: " + CONFIG.invoiceNo, 14, "Regular", grey, "RIGHT", W);
txt(L, 118, CONFIG.date, 14, "Regular", grey, "RIGHT", W);
rule(178);

// Billed to (locked the issuing entity)
txt(L, 206, "Billed to:", 14.5, "Bold", ink);
let by = 244;
BILLED_TO.forEach(linec => { if(linec) txt(L, by, linec, 14, "Regular", ink); by += linec ? 24 : 16; });
rule(404);

// Table header
const cRate = 360, cHours = 500;
txt(L, 426, "SERVICE", 14, "Bold", ink);
txt(cRate, 426, "RATE", 14, "Bold", ink);
txt(cHours, 426, "HOURS", 14, "Bold", ink);
txt(L, 426, "TOTAL", 14, "Bold", ink, "RIGHT", W);
rule(462);

// Service row (amount #1)
txt(L, 492, CONFIG.service, 14, "Regular", ink);
txt(cRate, 492, "-", 14, "Regular", ink);
txt(cHours, 492, "-", 14, "Regular", ink);
txt(L, 492, CONFIG.amount, 14, "Regular", ink, "RIGHT", W);
rule(596);

// Total due (amount #2)
txt(L, 622, "Total Due", 14.5, "Bold", ink);
txt(L, 622, CONFIG.amount, 14.5, "Bold", ink, "RIGHT", W);
rule(662);

// Payment information (payee bank)
txt(L, 724, "Payment Information", 14.5, "Bold", ink);
const valX = 248, py = 784, dy = 28;
const pay = [
  ["Bank:", CONFIG.payee.bank],
  ["IFSC Code:", CONFIG.payee.ifsc],
  ["Account Number:", CONFIG.payee.accountNumber],
  ["Account Name:", CONFIG.payee.accountName],
];
pay.forEach((row,i)=>{
  txt(L,   py+i*dy, row[0], 14, "Regular", ink);
  txt(valX, py+i*dy, row[1], 14, "Regular", ink);
});

// Footer (payee contact)
txt(L, 1010, CONFIG.payee.name, 22, "Bold", ink);
let fy = 1056;
CONFIG.payee.addressLines.forEach(linec => { txt(L, fy, linec, 14, "Regular", ink); fy += 24; });
fy += 16;
txt(L, fy, CONFIG.payee.phone, 14, "Regular", ink); fy += 24;
txt(L, fy, CONFIG.payee.email, 14, "Regular", ink);

figma.currentPage.selection = [F];
figma.viewport.scrollAndZoomIntoView([F]);
"built invoice for " + CONFIG.payee.name + " — frame " + F.id;
