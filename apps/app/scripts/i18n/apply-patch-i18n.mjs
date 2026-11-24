#!/usr/bin/env node
/**
 * Apply curated i18n patch files to locale catalogs.
 * Usage: node apply-patch-i18n.mjs [locale...]
 *
 * `en.json` is the key source of truth: it is patched first, then every other locale is patched
 * and PRUNED so it only holds keys that exist in `en` (plus the CLDR plural variants of an `en`
 * plural key). Orphan keys (renamed/removed in `en`, or `a[0].b` bracket paths) therefore can't
 * linger, and `parity.test.ts` fails if one appears.
 *
 * D45: scripture meaning keys (`isScriptureMeaningCatalogKey`) live in `en.json` only — other
 * locales fall back to the English meaning, which the UI labels. They are never written to, and
 * are removed from, non-`en` catalogs.
 */
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { isScriptureMeaningCatalogKey } from "../../../../packages/shared/src/i18n/scripture-meaning.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const I18N_DIR = join(__dirname, "../../src/i18n");

// `locale-repair-<loc>-i18n.json` files fix pre-existing corrupted values (stripped/mangled English,
// Kurmanji left in the Sorani `ku` catalog). They are applied LAST so a feature patch that still
// carries the old corrupted value for the same key cannot re-break it.
const isRepair = (name) => name.startsWith("locale-repair-");
const PATCH_FILES = readdirSync(__dirname)
  .filter((name) => name.endsWith("-i18n.json"))
  .sort((a, b) => Number(isRepair(a)) - Number(isRepair(b)) || a.localeCompare(b))
  .map((name) => join(__dirname, name));

const UNSAFE = new Set(["__proto__", "constructor", "prototype"]);
const PLURAL_SUFFIX = /_(zero|one|two|few|many|other)$/;

function setByPath(obj, path, value) {
  const parts = path.split(".");
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    if (UNSAFE.has(p)) throw new Error(`Unsafe i18n path segment: ${p}`);
    if (!(p in cur) || typeof cur[p] !== "object") cur[p] = Object.create(null);
    cur = cur[p];
  }
  const last = parts[parts.length - 1];
  if (UNSAFE.has(last)) throw new Error(`Unsafe i18n path segment: ${last}`);
  cur[last] = value;
}

/** Every leaf path of `obj`; array elements are addressed by index (`zakat.quran.0.label`). */
function leafKeys(obj, prefix = "", out = new Set()) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object") leafKeys(v, key, out);
    else out.add(key);
  }
  return out;
}

/** A non-`en` key is valid when `en` has it, or it is a plural variant of an `en` plural key. */
function makeKeyFilter(enKeys) {
  const pluralBases = new Set();
  for (const k of enKeys) if (PLURAL_SUFFIX.test(k)) pluralBases.add(k.replace(PLURAL_SUFFIX, ""));
  return (key) => {
    if (isScriptureMeaningCatalogKey(key)) return false;
    if (enKeys.has(key)) return true;
    return PLURAL_SUFFIX.test(key) && pluralBases.has(key.replace(PLURAL_SUFFIX, ""));
  };
}

/**
 * Remove leaves rejected by `keep`, then empty objects. Array elements are never removed (that would
 * shift indices) — only the rejected fields inside them. Returns the number of removed leaves.
 */
function prune(obj, keep, prefix = "") {
  let removed = 0;
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object") {
      removed += prune(v, keep, key);
      if (!Array.isArray(obj) && !Array.isArray(v) && Object.keys(v).length === 0) delete obj[k];
    } else if (!keep(key) && !Array.isArray(obj)) {
      delete obj[k];
      removed++;
    }
  }
  return removed;
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
const readCatalog = (loc) => JSON.parse(readFileSync(join(I18N_DIR, `${loc}.json`), "utf8"));
const writeCatalog = (loc, catalog) =>
  writeFileSync(join(I18N_DIR, `${loc}.json`), `${JSON.stringify(catalog, null, 2)}\n`, "utf8");

// 1. `en` first — it defines which keys every other catalog may hold.
const en = readCatalog("en");
let total = 0;
for (const [key, value] of Object.entries(TRANSLATIONS.en ?? {})) {
  setByPath(en, key, value);
  total++;
}
writeCatalog("en", en);
const keep = makeKeyFilter(leafKeys(en));

// 2. Every other requested locale: patch (valid keys only), then prune orphans.
const requested = process.argv.slice(2).length
  ? process.argv.slice(2)
  : readdirSync(I18N_DIR)
      .filter((f) => /^[a-z]{2}\.json$/.test(f))
      .map((f) => f.slice(0, 2));
let skipped = 0;
let pruned = 0;
for (const loc of requested) {
  if (loc === "en") continue;
  const catalog = readCatalog(loc);
  for (const [key, value] of Object.entries(TRANSLATIONS[loc] ?? {})) {
    if (!keep(key)) {
      skipped++;
      continue;
    }
    setByPath(catalog, key, value);
    total++;
  }
  pruned += prune(catalog, keep);
  writeCatalog(loc, catalog);
}

// `JSON.stringify` expands what Biome keeps inline (the `[{}, {}]` index placeholders `prune`
// leaves behind), so format the written catalogs or `pnpm lint` fails after every patch.
const written = ["en", ...requested.filter((loc) => loc !== "en")].map((loc) =>
  join(I18N_DIR, `${loc}.json`),
);
const biome = createRequire(import.meta.url).resolve("@biomejs/biome/bin/biome");
execFileSync(process.execPath, [biome, "format", "--write", ...written], { stdio: "ignore" });
console.log(
  `[patch-i18n] Applied ${total} strings across ${requested.length} locale(s) from ${PATCH_FILES.length} patch file(s); ` +
    `skipped ${skipped} orphan/scripture patch key(s), pruned ${pruned} catalog key(s).`,
);
