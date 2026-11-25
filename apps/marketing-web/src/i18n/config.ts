/**
 * Locales the marketing site is published in — dependency-free so
 * `next.config.ts` (redirects) can import it. English is the source language
 * and the fallback for any string or content page that is not translated yet.
 *
 * To add a language: add its code here, its entry in `LOCALE_META`
 * (`src/i18n/locales.ts`) and a catalog in `src/messages/<locale>/` — see
 * `src/i18n/README.md`.
 */
export const LOCALES = ["en", "ar", "ur"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";
