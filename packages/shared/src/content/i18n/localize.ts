/**
 * Content localization overlay engine.
 *
 * The English content in `packages/shared/src/content/*.ts` is the single source
 * of truth for STRUCTURE — ids, routes, section keys, Qur'an surah/ayah numbers,
 * hadith collections/citations and grades. Translations are supplied as *string
 * overlays* that mirror that structure and carry only the human-readable text.
 *
 * {@link localizeContent} deep-merges an overlay onto an English value:
 * - strings   → the overlay string wins when it is a non-empty string, else English.
 * - arrays    → merged element-by-element by index (missing indices keep English).
 * - objects   → merged key-by-key (only keys present in the overlay are touched).
 * - numbers / booleans → always kept from English.
 *
 * Structural identifier keys (see {@link PROTECTED_CONTENT_KEYS}) are NEVER taken
 * from the overlay, so a translation can never silently corrupt an id, a route or
 * a citation even if one is mistakenly included.
 *
 * This keeps every locale in perfect structural lock-step with English: a missing
 * or partial translation degrades gracefully to English rather than breaking, and
 * citations/ids simply cannot drift across languages.
 */

import type { AppLocale } from "../../i18n/app-locale";

/** Recursive partial — the shape an overlay is authored against. */
export type DeepPartial<T> = T extends readonly (infer U)[]
  ? DeepPartial<U>[]
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

export type ContentLocale = AppLocale;

/**
 * Keys that are structural identifiers or already-translated enum tokens
 * (rendered via i18n `t()` in the UI). They are always kept from English and
 * are ignored if present on an overlay.
 */
export const PROTECTED_CONTENT_KEYS: ReadonlySet<string> = new Set([
  "id",
  "route",
  "duaId",
  "pathname",
  "href",
  "slug",
  "section",
  "hub",
  "kind",
  "journey",
  "theme",
  "category",
  "categories",
  "era",
  "arabicName",
  "prayerId",
  "grade",
  "importance",
  "ruling",
  "signType",
  "collection",
  "citation",
  "surah",
  "ayahFrom",
  "ayahTo",
  /** Genealogy structural / citation fields — UI uses i18n for certainty & branch. */
  "sources",
  "certainty",
  "branch",
  "parentId",
  "siblingOf",
  "iconKey",
  "order",
  "arabic",
  "kind",
]);

/**
 * Merge a translation `overlay` onto an English `base` value. See file header
 * for the merge semantics. Returns a new value; `base` is never mutated.
 */
export function localizeContent<T>(base: T, overlay: unknown): T {
  if (overlay === undefined || overlay === null) return base;

  if (typeof base === "string") {
    return (typeof overlay === "string" && overlay.trim().length > 0 ? overlay : base) as T;
  }

  if (Array.isArray(base)) {
    if (!Array.isArray(overlay)) return base;
    return base.map((item, index) =>
      localizeContent(item, (overlay as readonly unknown[])[index]),
    ) as unknown as T;
  }

  if (typeof base === "object") {
    if (typeof overlay !== "object" || Array.isArray(overlay)) return base;
    const overlayRecord = overlay as Record<string, unknown>;
    const merged: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    for (const key of Object.keys(base as Record<string, unknown>)) {
      if (PROTECTED_CONTENT_KEYS.has(key)) continue;
      if (Object.hasOwn(overlayRecord, key)) {
        merged[key] = localizeContent((base as Record<string, unknown>)[key], overlayRecord[key]);
      }
    }
    return merged as T;
  }

  return base;
}

/**
 * Resolve a list to the active locale using its overlays. Falls back to the
 * English list when no overlay exists for the locale (or it is empty).
 */
export function localizeContentList<T>(
  base: readonly T[],
  overlay: readonly DeepPartial<T>[] | undefined,
): T[] {
  if (!overlay || overlay.length === 0) return base as T[];
  return base.map((item, index) => localizeContent(item, overlay[index]));
}

export type { ContentOverlay, ContentOverlays, OverlayLocale } from "./overlay-locale";
export { overlayExportSuffix, parseOverlayExportName } from "./overlay-locale";
