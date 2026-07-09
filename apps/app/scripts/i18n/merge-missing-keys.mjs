#!/usr/bin/env node
/** Merge missing keys from en.json into every other locale catalog. */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const I18N_DIR = join(__dirname, "../../src/i18n");

function deepMergeMissing(target, source) {
  if (typeof source !== "object" || source === null || Array.isArray(source)) {
    return target ?? source;
  }
  const out = { ...(target && typeof target === "object" ? target : {}) };
  for (const [key, value] of Object.entries(source)) {
    if (!(key in out)) {
      out[key] = structuredClone(value);
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      out[key] = deepMergeMissing(out[key], value);
    }
  }
  return out;
}

const en = JSON.parse(readFileSync(join(I18N_DIR, "en.json"), "utf8"));

for (const file of readdirSync(I18N_DIR).filter((f) => f.endsWith(".json") && f !== "en.json")) {
  const path = join(I18N_DIR, file);
  const catalog = JSON.parse(readFileSync(path, "utf8"));
  const merged = deepMergeMissing(catalog, en);
  writeFileSync(path, `${JSON.stringify(merged, null, 2)}\n`);
  console.log(`Merged missing keys into ${file}`);
}
