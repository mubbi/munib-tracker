#!/usr/bin/env node
/**
 * Repair garbled auto-translate strings (Runglish / mixed-script corruption).
 * Replaces corrupted values with locale overrides when available, otherwise English.
 *
 * Usage: node fix-runglish-catalog.mjs [locale...]
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const I18N_DIR = join(__dirname, "../../src/i18n");
const OVERRIDES_DIR = join(__dirname, "catalog-overrides");

/** Patterns seen in failed MyMemory / mixed-script auto-translations. */
const CORRUPT_RE =
  /pryer|erlier|lter pry|mнаth|Trcker|Thjjud|wилиship|Impилиt|Stилиe|begв|durвg|обновлениеd|сегодня's|t {2}glce|nme,|rr th|wилиld|mu'kkdh|frd pry|hэтоt|Trvell|Downlod|phнаe|slh|combвe|shилиten|dhkr к|sunnh|pused|ct из|trckвg|Fвd|directiна|JSна|Dtes|sttus|sttuses|qz rr|sel на|beдляe|rushвg|bck к|puse для|dys fsted|Suhoили|Iftr|Rmd|Dy |Fst |Lylt|odd ночь|strove hrdest|thousи|decdes|allhumm|pry Thjjud|аккаунт, sme|MYMEMORY WARNING/i;

function walkReplace(localeObj, enObj, overrides, stats) {
  if (typeof enObj === "string") {
    if (typeof localeObj !== "string") return localeObj;
    if (!CORRUPT_RE.test(localeObj)) return localeObj;
    stats.fixed += 1;
    return overrides[stats.path] ?? enObj;
  }
  if (Array.isArray(enObj)) {
    const src = Array.isArray(localeObj) ? localeObj : [];
    return enObj.map((item, i) => {
      stats.path = stats.pathPrefix;
      return walkReplace(src[i], item, overrides, stats);
    });
  }
  if (enObj && typeof enObj === "object") {
    const src = localeObj && typeof localeObj === "object" ? localeObj : {};
    const out = {};
    for (const [key, value] of Object.entries(enObj)) {
      const prev = stats.pathPrefix;
      stats.pathPrefix = stats.pathPrefix ? `${stats.pathPrefix}.${key}` : key;
      stats.path = stats.pathPrefix;
      out[key] = walkReplace(src[key], value, overrides, stats);
      stats.pathPrefix = prev;
    }
    // Preserve locale-only keys (e.g. ru _few/_many plural forms not in en).
    for (const [key, value] of Object.entries(src)) {
      if (key in out) continue;
      const prev = stats.pathPrefix;
      stats.pathPrefix = stats.pathPrefix ? `${stats.pathPrefix}.${key}` : key;
      stats.path = stats.pathPrefix;
      if (typeof value === "string" && CORRUPT_RE.test(value)) {
        stats.fixed += 1;
        out[key] = overrides[stats.path] ?? value;
      } else {
        out[key] =
          value && typeof value === "object" && !Array.isArray(value)
            ? walkReplace(value, {}, overrides, stats)
            : value;
      }
      stats.pathPrefix = prev;
    }
    return out;
  }
  return localeObj;
}

function loadOverrides(locale) {
  const path = join(OVERRIDES_DIR, `${locale}.json`);
  if (!existsSync(path)) return {};
  return JSON.parse(readFileSync(path, "utf8"));
}

const locales = process.argv.slice(2);
if (locales.length === 0) {
  console.error("Usage: fix-runglish-catalog.mjs <locale> [locale...]");
  process.exit(1);
}

const en = JSON.parse(readFileSync(join(I18N_DIR, "en.json"), "utf8"));

for (const locale of locales) {
  const path = join(I18N_DIR, `${locale}.json`);
  const catalog = JSON.parse(readFileSync(path, "utf8"));
  const overrides = loadOverrides(locale);
  const stats = { fixed: 0, path: "", pathPrefix: "" };
  const cleaned = walkReplace(catalog, en, overrides, stats);
  writeFileSync(path, `${JSON.stringify(cleaned, null, 2)}\n`, "utf8");
  const overrideUsed = Object.keys(overrides).length;
  console.log(
    `${locale}.json: repaired ${stats.fixed} corrupted strings (${overrideUsed} overrides available)`,
  );
}
