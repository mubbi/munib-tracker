/**
 * D45 (owner decision, locked) — Qur'an / hadith / dua *meaning* text is never
 * machine- or hand-translated. A locale shows the meaning only from a dataset
 * translation (bundled or remote edition, see `translation-locale.ts`); when
 * none exists it shows the English meaning, clearly labelled, beside the Arabic.
 *
 * Two places carried AI-translated scripture before D45:
 *
 * 1. Learn content overlays (`packages/shared/src/content/i18n/*.<locale>.ts`) —
 *    the fields below hold verse/hadith/dua meaning text. Overlays must not
 *    carry them; `localizeContent` ignores them so the English source wins, and
 *    the app resolves Qur'an refs from the locale's dataset edition at render time.
 * 2. UI catalogs (`apps/app/src/i18n/*.json`) — the keys matched by
 *    {@link isScriptureMeaningCatalogKey} live in `en.json` only; other locales
 *    fall back to English via i18next and the UI adds the "English meaning" label.
 */

/** Learn-content object keys whose string value is scripture meaning text. */
export const SCRIPTURE_MEANING_CONTENT_KEYS: ReadonlySet<string> = new Set([
  /** Qur'an / hadith ref excerpt (`JannahQuranRef`, `JannahHadithRef`, verse entries…). */
  "excerpt",
  /** Meaning of a recited Arabic phrase / ayah (salah-guide steps & phrases, daily lesson). */
  "translation",
]);

/** UI catalog keys (dot paths) that hold scripture meaning text — `en.json` only. */
const SCRIPTURE_MEANING_CATALOG_KEY =
  /\.(quran|hadith)\.\d+\.excerpt$|\.localRefExcerpt$|^qazaPlan\.consistencyHadith$|^tahajjud\.virtueBody$|^dhulHijjah\.virtue$|^onboarding\.brandDuaTranslation$/;

export function isScriptureMeaningCatalogKey(key: string): boolean {
  return SCRIPTURE_MEANING_CATALOG_KEY.test(key);
}
