#!/usr/bin/env node
/** Repair corrupted i18n {{interpolation}} tokens in locale catalogs. */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const I18N_DIR = join(__dirname, "../../src/i18n");
const en = JSON.parse(readFileSync(join(I18N_DIR, "en.json"), "utf8"));

/** Known bad tokens produced by word-replacement translators → canonical names. */
const TOKEN_ALIASES = new Map(
  Object.entries({
    prماهer: "prayer",
    prmoiser: "prayer",
    prwataer: "prayer",
    prmwezier: "prayer",
    perPrماهer: "perPrayer",
    perPrmoiser: "perPrayer",
    perPrwataer: "perPrayer",
    perPrmwezier: "perPrayer",
    درy: "day",
    dmois: "day",
    dwata: "day",
    dmwezi: "day",
    درte: "date",
    درtes: "dates",
    درilyTotal: "dailyTotal",
    درys: "days",
    dmoiss: "days",
    dwatas: "days",
    dmwezis: "days",
    leوl: "level",
    leetl: "level",
    ledal: "level",
    lenal: "level",
    mباstones: "milestones",
    maetcstones: "milestones",
    "mtare dastones": "milestones",
    mnastones: "milestones",
    weatهر: "weather",
    ماهahs: "ayahs",
    moisahs: "ayahs",
    wataahs: "ayahs",
    mweziahs: "ayahs",
    تم: "done",
    الإجمالي: "total",
    مکمل: "done",
    کل: "total",
  }),
);

function walk(obj, prefix = "") {
  const out = [];
  if (typeof obj === "string") {
    out.push([prefix, obj]);
    return out;
  }
  if (Array.isArray(obj)) {
    for (const [i, item] of obj.entries()) {
      out.push(...walk(item, `${prefix}[${i}]`));
    }
    return out;
  }
  if (obj && typeof obj === "object") {
    for (const [key, value] of Object.entries(obj)) {
      out.push(...walk(value, prefix ? `${prefix}.${key}` : key));
    }
  }
  return out;
}

function getAt(obj, path) {
  return path.split(".").reduce((cur, key) => cur?.[key], obj);
}

function setAt(obj, path, value) {
  const parts = path.split(".");
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (part === "__proto__" || part === "constructor" || part === "prototype") {
      throw new Error(`Unsafe i18n path segment: ${part}`);
    }
    if (cur[part] == null) cur[part] = Object.create(null);
    cur = cur[part];
  }
  const last = parts[parts.length - 1];
  if (last === "__proto__" || last === "constructor" || last === "prototype") {
    throw new Error(`Unsafe i18n path segment: ${last}`);
  }
  cur[last] = value;
}

const interpVars = (s) => [...new Set(s.match(/\{\{[^}]+\}\}/g) ?? [])].sort();

function normalizeTokens(value) {
  let out = value;

  // Broken quadruple braces / PH placeholders.
  out = out
    .replace(/\{\{\{\{/g, "{{")
    .replace(/__\s*PH0\s*__/gi, "{{count}}")
    .replace(/__PH0\s*__/gi, "{{count}}")
    .replace(/__\s*PH1\s*__/gi, "{{total}}")
    .replace(/__PH1\s*__/gi, "{{total}}");

  // Rename corrupted inner tokens.
  out = out.replace(/\{\{([^}]+)\}\}/g, (_, inner) => {
    const canonical = TOKEN_ALIASES.get(inner.trim());
    return canonical ? `{{${canonical}}}` : `{{${inner}}}`;
  });

  return out;
}

function alignToEnglish(enVal, locVal) {
  let out = normalizeTokens(locVal);
  const need = interpVars(enVal);
  let have = interpVars(out);

  if (need.join() === have.join()) return out;

  // Re-order / graft: walk English template, substitute localized tokens in sequence.
  const locTokens = [...out.matchAll(/\{\{[^}]+\}\}/g)].map((m) => m[0]);
  if (locTokens.length === need.length) {
    let i = 0;
    out = enVal.replace(/\{\{[^}]+\}\}/g, () => locTokens[i++] ?? "");
    // Restore non-placeholder text from original localized string is wrong — instead swap names only.
  }

  // Swap token names positionally when counts match.
  if (locTokens.length === need.length) {
    for (let i = 0; i < need.length; i++) {
      if (locTokens[i] !== need[i]) {
        out = out.replace(locTokens[i], need[i]);
      }
    }
    have = interpVars(out);
  }

  // Prefix missing {{count}}.
  if (need.includes("{{count}}") && !have.includes("{{count}}")) {
    out = `{{count}} ${out}`.trim();
  }

  // Insert missing {{total}} after {{score}}.
  if (
    need.includes("{{total}}") &&
    !interpVars(out).includes("{{total}}") &&
    out.includes("{{score}}")
  ) {
    out = out.replace("{{score}}", "{{score}} / {{total}}");
  }

  // Fix {{pct}} for qazaProgress-style strings.
  if (need.includes("{{pct}}") && !interpVars(out).includes("{{pct}}")) {
    out = out.replace(/(?:__PH0\s*__|)(\d*)%?/, "{{pct}}%");
  }

  return out;
}

let fixed = 0;

for (const file of readdirSync(I18N_DIR).filter((f) => f.endsWith(".json") && f !== "en.json")) {
  const path = join(I18N_DIR, file);
  const catalog = JSON.parse(readFileSync(path, "utf8"));

  for (const [keyPath, enVal] of walk(en)) {
    if (typeof enVal !== "string") continue;
    const locVal = getAt(catalog, keyPath);
    if (typeof locVal !== "string") continue;

    let repaired = alignToEnglish(enVal, locVal);
    if (repaired.trim() === "" && enVal.trim() !== "") {
      repaired = enVal;
    }

    if (repaired !== locVal) {
      setAt(catalog, keyPath, repaired);
      fixed += 1;
    }
  }

  writeFileSync(path, `${JSON.stringify(catalog, null, 2)}\n`);
}

console.log(`Fixed ${fixed} strings`);
