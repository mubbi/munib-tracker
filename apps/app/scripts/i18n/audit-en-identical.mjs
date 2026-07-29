#!/usr/bin/env node
/**
 * Audit English-identical strings in locale catalogs.
 * Usage: node audit-en-identical.mjs [locale...]
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const I18N_DIR = join(__dirname, "../../src/i18n");

function flatten(obj, prefix = "") {
  const out = [];
  for (const [k, v] of Object.entries(obj)) {
    const p = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) out.push(...flatten(v, p));
    else out.push([p, v]);
  }
  return out;
}

const en = JSON.parse(readFileSync(join(I18N_DIR, "en.json"), "utf8"));
const enMap = new Map(flatten(en));

const locales = process.argv.slice(2).length
  ? process.argv.slice(2)
  : [
      "id",
      "tr",
      "bn",
      "ms",
      "fa",
      "fr",
      "ha",
      "sw",
      "ru",
      "az",
      "ps",
      "so",
      "uz",
      "kk",
      "ku",
      "bs",
      "sq",
      "ky",
      "tg",
      "tk",
    ];

let grandTotal = 0;
for (const loc of locales) {
  const cat = JSON.parse(readFileSync(join(I18N_DIR, `${loc}.json`), "utf8"));
  const identical = flatten(cat).filter(
    ([k, v]) => typeof v === "string" && v.trim() && enMap.get(k) === v,
  );
  grandTotal += identical.length;
  console.log(`${loc}: ${identical.length} English-identical strings`);
}
console.log(`Total: ${grandTotal}`);
