#!/usr/bin/env node
/** Clone English SEO route metadata into per-locale JSON stubs for translation. */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../..");
const SRC = path.join(ROOT, "src/config/seo-routes.data.json");
const OUT_DIR = path.join(ROOT, "src/config/seo-routes-locale");

const LOCALES = fs
  .readdirSync(path.join(ROOT, "src/i18n"))
  .filter((f) => f.endsWith(".json") && f !== "en.json")
  .map((f) => f.replace(".json", ""));

const en = JSON.parse(fs.readFileSync(SRC, "utf8"));
fs.mkdirSync(OUT_DIR, { recursive: true });

for (const locale of LOCALES) {
  const outPath = path.join(OUT_DIR, `${locale}.json`);
  if (!fs.existsSync(outPath)) {
    fs.writeFileSync(outPath, `${JSON.stringify(en, null, 2)}\n`, "utf8");
    console.log(`Created ${locale}.json`);
  } else {
    console.log(`Skipped ${locale}.json (exists)`);
  }
}

console.log(`Done — ${LOCALES.length} locale SEO files in ${OUT_DIR}`);
