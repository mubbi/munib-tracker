import type { LocalizedText } from "./types";

export const DEFAULT_LOCALE = "en";

// Read the value for `locale` from a localized field. Falls back to en, then to
// the first locale that has a non-empty value, then to empty string. Used by
// the canvas/preview/thumb so switching to a locale the user hasn't filled in
// shows the source copy instead of blanks.
export function pickText(field: LocalizedText | undefined, locale: string): string {
  if (!field) return "";
  const direct = field[locale];
  if (direct?.length) return direct;
  const en = field[DEFAULT_LOCALE];
  if (en?.length) return en;
  for (const k of Object.keys(field)) {
    const v = field[k];
    if (v?.length) return v;
  }
  return "";
}

// Script-direction locales (mirrors the app's RTL_LOCALES).
const RTL_LOCALES = new Set(["ar", "ur", "fa", "ps", "ku", "he"]);

// Text direction for what `pickText` renders. RTL only when the locale is RTL
// *and* has its own copy — an English fallback stays LTR. Without an explicit
// `dir`, Arabic/Urdu lines with digits, Latin words or trailing punctuation are
// laid out LTR ("24" and the full stop land on the wrong end).
export function textDir(field: LocalizedText | undefined, locale: string): "rtl" | "ltr" {
  const base = locale.split("-")[0] ?? locale;
  return RTL_LOCALES.has(base) && field?.[locale]?.length ? "rtl" : "ltr";
}

// Replace `{locale}` placeholders in a screenshot path. Data URLs and empty
// strings pass through unchanged.
export function resolveScreenshot(path: string | undefined, locale: string): string {
  if (!path) return "";
  if (path.startsWith("data:")) return path;
  if (!path.includes("{locale}")) return path;
  return path.replace(/\{locale\}/g, locale);
}

// Convert legacy `string` headline/label fields to the per-locale shape. Safe
// to call on already-migrated data.
export function coerceLocalized(value: unknown): LocalizedText {
  if (typeof value === "string") return { [DEFAULT_LOCALE]: value };
  if (value && typeof value === "object") return value as LocalizedText;
  return {};
}

// Set or clear the value for `locale` on a localized field. Empty values delete
// the key so the persisted JSON stays free of "" placeholders.
export function writeLocalized(
  field: LocalizedText | undefined,
  locale: string,
  value: string,
): LocalizedText {
  const next: LocalizedText = { ...(field || {}) };
  if (value.length === 0) delete next[locale];
  else next[locale] = value;
  return next;
}
