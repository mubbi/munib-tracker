#!/usr/bin/env node
/**
 * Replaces corrupted auto-translate strings in a locale catalog with English fallbacks.
 * Usage: node sanitize-corrupted-catalog.mjs [locale...]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_I18N_DIR = join(__dirname, "../../src/i18n");

const RATE_LIMIT_RE = /MYMEMORY WARNING/i;

function walkReplace(localeObj, enObj, stats) {
  if (typeof enObj === "string") {
    if (typeof localeObj === "string" && RATE_LIMIT_RE.test(localeObj)) {
      stats.fixed += 1;
      return enObj;
    }
    return localeObj;
  }
  if (Array.isArray(enObj)) {
    const src = Array.isArray(localeObj) ? localeObj : [];
    return enObj.map((item, i) => walkReplace(src[i], item, stats));
  }
  if (enObj && typeof enObj === "object") {
    const src = localeObj && typeof localeObj === "object" ? localeObj : {};
    const out = {};
    for (const [key, value] of Object.entries(enObj)) {
      out[key] = walkReplace(src[key], value, stats);
    }
    return out;
  }
  return localeObj;
}

const locales = process.argv.slice(2);
if (locales.length === 0) {
  console.error("Usage: sanitize-corrupted-catalog.mjs <locale> [locale...]");
  process.exit(1);
}

const en = JSON.parse(readFileSync(join(APP_I18N_DIR, "en.json"), "utf8"));

for (const locale of locales) {
  const path = join(APP_I18N_DIR, `${locale}.json`);
  const catalog = JSON.parse(readFileSync(path, "utf8"));
  const stats = { fixed: 0 };
  const cleaned = walkReplace(catalog, en, stats);
  writeFileSync(path, `${JSON.stringify(cleaned, null, 2)}\n`);
  console.log(`${locale}.json: reset ${stats.fixed} corrupted strings to English`);
}
