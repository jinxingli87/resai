// Fails if any winner name (from the git-ignored raw sheet) or any owner identifier
// (from git-ignored private/owner-names.txt) appears in the source, assets, or build output.
// Both inputs are local-only, so on CI/Vercel the check is skipped.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const RAW = path.join(root, "data-raw/usaaio-2026-round2.csv");
const OWNER = path.join(root, "private/owner-names.txt");

function parseCsvLine(line) {
  const out = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (quoted) {
      if (c === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (c === '"') quoted = false;
      else cur += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      out.push(cur);
      cur = "";
    } else cur += c;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

const terms = new Set();
if (fs.existsSync(RAW)) {
  const [header, ...rows] = fs.readFileSync(RAW, "utf8").split(/\r?\n/).filter(Boolean);
  const cols = parseCsvLine(header).map((h) => h.toLowerCase());
  const li = cols.indexOf("last name");
  const fi = cols.indexOf("first name");
  for (const row of rows) {
    const r = parseCsvLine(row);
    const first = r[fi];
    const last = r[li];
    if (first && last) {
      terms.add(`${first} ${last}`.toLowerCase());
      terms.add(`${last} ${first}`.toLowerCase());
      terms.add(`${last}, ${first}`.toLowerCase());
    }
  }
}
if (fs.existsSync(OWNER)) {
  for (const line of fs.readFileSync(OWNER, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (t && !t.startsWith("#")) terms.add(t.toLowerCase());
  }
}

if (!terms.size) {
  console.log("[no-names] skipped: no local name lists found (expected on CI).");
  process.exit(0);
}

const SCAN = ["src", "public", "assets", "scripts", ".next/server", ".next/static", "README.md"];
const SKIP_DIRS = new Set(["node_modules", ".git", "cache"]);
const TEXT = /\.(html?|js|mjs|cjs|ts|tsx|json|rsc|body|txt|css|md|mdx|csv|svg|xml|meta|py|map)$/i;
const SELF = path.relative(root, new URL(import.meta.url).pathname);

const hits = [];
let files = 0;
function walk(p) {
  if (!fs.existsSync(p)) return;
  const st = fs.statSync(p);
  if (st.isDirectory()) {
    if (SKIP_DIRS.has(path.basename(p))) return;
    for (const f of fs.readdirSync(p)) walk(path.join(p, f));
    return;
  }
  const rel = path.relative(root, p);
  if (rel === SELF || !TEXT.test(p) || st.size > 20_000_000) return;
  files++;
  const text = fs.readFileSync(p, "utf8").toLowerCase().replace(/\s+/g, " ");
  for (const t of terms) if (text.includes(t)) hits.push([rel, t]);
}
for (const s of SCAN) walk(path.join(root, s));

if (hits.length) {
  console.error(`[no-names] FAILED: ${hits.length} match(es) in ${new Set(hits.map((h) => h[0])).size} file(s):`);
  for (const [f, t] of hits.slice(0, 50)) console.error(`  ${f}: "${t}"`);
  process.exit(1);
}
console.log(`[no-names] OK: scanned ${files} files for ${terms.size} terms, no matches.`);
