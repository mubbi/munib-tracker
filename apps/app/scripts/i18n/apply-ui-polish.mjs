#!/usr/bin/env node
/**
 * Apply native UI polish patches to locale catalogs.
 * Usage: node apply-ui-polish.mjs [locale...]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const I18N_DIR = join(__dirname, "../../src/i18n");
const PATCHES = JSON.parse(readFileSync(join(__dirname, "ui-polish-patches.json"), "utf8"));

function setByPath(obj, path, value) {
  const parts = path.split(".");
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    if (!(p in cur) || typeof cur[p] !== "object") cur[p] = {};
    cur = cur[p];
  }
  cur[parts[parts.length - 1]] = value;
}

function applyLocale(loc) {
  const patch = PATCHES[loc];
  if (!patch) {
    console.warn(`[polish] no patches for ${loc}`);
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

const locales = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(PATCHES);
let total = 0;
for (const loc of locales) total += applyLocale(loc);
console.log(`[polish] Applied ${total} strings across ${locales.length} locale(s).`);
