import { DEFAULT_LOCALE, type Locale } from "@/i18n/routing";

/**
 * Long-form content (feature, comparison, audience and article pages) stays
 * typed TS data rather than message-catalog JSON. English is the source; a
 * translation is a full entry with the **same** slug and structural fields
 * (icon, dates, hrefs, screenshot keys…) and translated prose, registered per
 * locale next to the English registry:
 *
 *   // content/features/index.ts
 *   const TRANSLATIONS: ContentTranslations<FeaturePage> = {
 *     ur: [hadithUr, salahTrackerUr],
 *   };
 *
 * Any page without a translation falls back to English, so a locale can
 * launch with its UI catalog first and pages translated over time.
 */
export type ContentTranslations<T> = Partial<Record<Locale, readonly T[]>>;

/** `source` in `locale`: translated entries replace English ones by key, order kept. */
export function localizeEntries<T>(
  source: readonly T[],
  translations: ContentTranslations<T>,
  locale: Locale,
  key: (entry: T) => string,
): readonly T[] {
  if (locale === DEFAULT_LOCALE) return source;
  const translated = translations[locale];
  if (!translated?.length) return source;
  const byKey = new Map(translated.map((entry) => [key(entry), entry]));
  return source.map((entry) => byKey.get(key(entry)) ?? entry);
}
