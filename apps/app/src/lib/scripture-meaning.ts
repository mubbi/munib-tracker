/**
 * D45 — scripture meaning text (Qur'an / hadith / dua) is never AI-translated.
 *
 * Learn content and a few catalog strings carry an English meaning excerpt. In a non-English
 * UI we either show the locale's DATASET translation (Qur'an refs: the user's translation
 * edition, bundled or remote — see `translation-locale.ts`) or keep the English and label it
 * "English meaning". Hadith refs in guides only carry a citation, so they always fall back to
 * the labelled English. Pure helpers live here; the React glue is `use-scripture-meaning.ts`.
 */

export type QuranMeaningRef = { surah: number; ayahFrom: number; ayahTo?: number };

/**
 * Longest ayah span we replace with a dataset translation. Longer spans (story overviews,
 * e.g. "Surah 2:30–39") would turn a one-line excerpt into a wall of text, so they keep the
 * labelled English excerpt and the reader can open the full passage in the Qur'an reader.
 */
export const MAX_DATASET_MEANING_AYAHS = 5;

/** Base language of an app locale / i18n language tag (`"fr-FR"` → `"fr"`). */
export function baseLanguage(tag: string | undefined | null): string {
  return (tag ?? "en").split("-")[0]?.toLowerCase() || "en";
}

/** Language of a Qur'an edition id (`"fr-hamidullah"` → `"fr"`). */
export function editionLanguage(editionId: string): string {
  return baseLanguage(editionId);
}

/** Whether a Qur'an ref should be shown from the user's dataset edition instead of English. */
export function shouldResolveQuranFromDataset(
  uiLanguage: string,
  editionId: string,
  ref: QuranMeaningRef | null | undefined,
): ref is QuranMeaningRef {
  if (!ref || baseLanguage(uiLanguage) === "en") return false;
  if (editionLanguage(editionId) === "en") return false;
  if (!Number.isInteger(ref.surah) || ref.surah < 1 || ref.surah > 114) return false;
  if (!Number.isInteger(ref.ayahFrom) || ref.ayahFrom < 1) return false;
  const end = ref.ayahTo ?? ref.ayahFrom;
  return end >= ref.ayahFrom && end - ref.ayahFrom + 1 <= MAX_DATASET_MEANING_AYAHS;
}

/** Join an edition's ayah texts (`ayah number → text`) for a range; `null` if any ayah is missing. */
export function joinAyahRangeText(
  ayahs: Record<string, string> | null | undefined,
  ref: QuranMeaningRef,
): string | null {
  if (!ayahs) return null;
  const end = ref.ayahTo ?? ref.ayahFrom;
  const parts: string[] = [];
  for (let n = ref.ayahFrom; n <= end; n++) {
    const text = ayahs[String(n)]?.trim();
    if (!text) return null;
    parts.push(text);
  }
  return parts.length ? parts.join(" ") : null;
}

export type ScriptureMeaning = {
  /** Text to render (dataset translation, or the English source). */
  text: string;
  /** True when a non-English UI shows the English meaning — render the "English meaning" label. */
  englishFallback: boolean;
};

/** Final display decision given the (optional) dataset text. */
export function resolveScriptureMeaning(
  english: string,
  uiLanguage: string,
  datasetText: string | null | undefined,
): ScriptureMeaning {
  if (baseLanguage(uiLanguage) === "en") return { text: english, englishFallback: false };
  if (datasetText?.trim()) return { text: datasetText.trim(), englishFallback: false };
  return { text: english, englishFallback: english.trim().length > 0 };
}
