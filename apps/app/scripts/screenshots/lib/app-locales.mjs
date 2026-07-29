import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
/** apps/app/scripts/screenshots/lib → repo root */
const REPO_ROOT = path.resolve(HERE, "../../../../../");

/**
 * Load every AppLocale from packages/shared (single source of truth).
 * Parsed from TypeScript so Node screenshot scripts stay in sync without a build step.
 */
export function loadAppLocaleCodes() {
  const file = path.join(REPO_ROOT, "packages/shared/src/i18n/app-locale.ts");
  const src = fs.readFileSync(file, "utf8");
  const block = src.match(/export const APP_LOCALE_CODES = \[([\s\S]*?)\] as const/);
  if (!block) {
    throw new Error(`Could not parse APP_LOCALE_CODES from ${file}`);
  }
  const codes = [...block[1].matchAll(/"([a-z]{2})"/g)].map((m) => m[1]);
  if (codes.length < 2 || codes[0] !== "en") {
    throw new Error(`Unexpected APP_LOCALE_CODES parse result: ${codes.join(",")}`);
  }
  return codes;
}

/**
 * Marketing screenshot-studio locales (App Store / Play listing copy).
 * Native capture uses the full AppLocale set; studio decks stay on this subset
 * until seed-project.mjs has copy for every locale.
 */
export function loadStudioLocaleCodes() {
  const file = path.join(REPO_ROOT, "packages/store-screenshots/spec.json");
  const spec = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!Array.isArray(spec.locales) || !spec.locales.length) {
    throw new Error(`packages/store-screenshots/spec.json missing locales`);
  }
  return spec.locales;
}
