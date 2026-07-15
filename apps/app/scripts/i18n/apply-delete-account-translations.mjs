#!/usr/bin/env node
/**
 * Apply delete-account profile translations to locale catalogs.
 * Usage: node apply-delete-account-translations.mjs [locale...]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const I18N_DIR = join(__dirname, "../../src/i18n");
const TRANSLATIONS = JSON.parse(
  readFileSync(join(__dirname, "delete-account-profile-translations.json"), "utf8"),
);

function setByPath(obj, path, value) {
  const parts = path.split(".");
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    if (!(p in cur) || typeof cur[p] !== "object" || cur[p] === null) cur[p] = {};
    cur = cur[p];
  }
  cur[parts[parts.length - 1]] = value;
}

function applyLocale(loc) {
  const patch = TRANSLATIONS[loc];
  if (!patch) {
    console.warn(`[delete-account-i18n] no translations for ${loc}`);
    return 0;
  }
  const file = join(I18N_DIR, `${loc}.json`);
  const catalog = JSON.parse(readFileSync(file, "utf8"));
  let n = 0;
  for (const [key, value] of Object.entries(patch)) {
    setByPath(catalog, key, value);
    n++;
  }
  writeFileSync(file, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
  return n;
}

const locales = process.argv.slice(2);
const targets = locales.length > 0 ? locales : Object.keys(TRANSLATIONS);
let total = 0;
for (const loc of targets) {
  total += applyLocale(loc);
  console.log(`[delete-account-i18n] ${loc}: applied`);
}
console.log(`[delete-account-i18n] done (${total} keys across ${targets.length} locales)`);
