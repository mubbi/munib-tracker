#!/usr/bin/env node
/**
 * Apply curated i18n patch files to locale catalogs.
 * Usage: node apply-patch-i18n.mjs [locale...]
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const I18N_DIR = join(__dirname, "../../src/i18n");

const PATCH_FILES = readdirSync(__dirname)
  .filter((name) => name.endsWith("-i18n.json"))
  .map((name) => join(__dirname, name));

function setByPath(obj, path, value) {
  const parts = path.split(".");
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    if (p === "__proto__" || p === "constructor" || p === "prototype") {
      throw new Error(`Unsafe i18n path segment: ${p}`);
    }
    if (!(p in cur) || typeof cur[p] !== "object") cur[p] = Object.create(null);
    cur = cur[p];
  }
  const last = parts[parts.length - 1];
  if (last === "__proto__" || last === "constructor" || last === "prototype") {
    throw new Error(`Unsafe i18n path segment: ${last}`);
  }
  cur[last] = value;
}

function loadPatches() {
  const merged = {};
  for (const file of PATCH_FILES) {
    const data = JSON.parse(readFileSync(file, "utf8"));
    for (const [loc, patch] of Object.entries(data)) {
      merged[loc] = { ...(merged[loc] ?? {}), ...patch };
    }
  }
  return merged;
}

const TRANSLATIONS = loadPatches();

function applyLocale(loc) {
  const patch = TRANSLATIONS[loc];
  if (!patch) {
    console.warn(`[patch-i18n] no translations for ${loc}`);
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

const locales = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(TRANSLATIONS);
let total = 0;
for (const loc of locales) total += applyLocale(loc);
console.log(
  `[patch-i18n] Applied ${total} strings across ${locales.length} locale(s) from ${PATCH_FILES.length} patch file(s).`,
);
