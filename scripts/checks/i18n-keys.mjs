// Fails if en.json and zh.json don't have exactly the same message keys.
import fs from "node:fs";
import path from "node:path";

const dir = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../../src/messages");
const load = (l) => JSON.parse(fs.readFileSync(path.join(dir, `${l}.json`), "utf8"));

function keys(obj, prefix = "") {
  return Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === "object" ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`],
  );
}

const en = new Set(keys(load("en")));
const zh = new Set(keys(load("zh")));
const missingZh = [...en].filter((k) => !zh.has(k));
const extraZh = [...zh].filter((k) => !en.has(k));

if (missingZh.length || extraZh.length) {
  if (missingZh.length) console.error("[i18n] missing in zh.json:\n  " + missingZh.join("\n  "));
  if (extraZh.length) console.error("[i18n] only in zh.json:\n  " + extraZh.join("\n  "));
  process.exit(1);
}
console.log(`[i18n] OK: ${en.size} keys in both locales.`);
