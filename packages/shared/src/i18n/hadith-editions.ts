import type { AppLocale } from "./app-locale";

/**
 * fawazahmed0/hadith-api edition prefix per app locale (see editions.json).
 * Arabic (`ara-*`) is always fetched into `HadithItem.arabic`; English (`eng-*`)
 * into `HadithItem.english`. These prefixes supply optional translation text.
 */
export const HADITH_TRANSLATION_PREFIX: Partial<Record<AppLocale, string>> = {
  ur: "urd",
  id: "ind",
  tr: "tur",
  bn: "ben",
  fr: "fra",
  ru: "rus",
};

/** Locales with a remote hadith translation edition on fawazahmed0 (excludes `ar`). */
export const HADITH_TRANSLATED_LOCALES = Object.keys(HADITH_TRANSLATION_PREFIX) as AppLocale[];

/** Whether a hadith translation edition exists for this locale on the CDN. */
export function hasHadithTranslationEdition(locale: AppLocale): boolean {
  return locale in HADITH_TRANSLATION_PREFIX;
}

/** Edition slug, e.g. `urd-bukhari`, or null when only English fallback is available. */
export function hadithEditionSlug(locale: AppLocale, collectionId: string): string | null {
  const prefix = HADITH_TRANSLATION_PREFIX[locale];
  if (!prefix) return null;
  return `${prefix}-${collectionId}`;
}
