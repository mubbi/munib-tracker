/**
 * Resolve Arabic + transliteration for a surah ayah range from the bundled
 * Qur'an corpora. Callers that must keep ayah JSON out of `__common` should
 * use {@link loadQuranAyahRange} (dynamic import) rather than sync helpers.
 */

export type QuranAyahRangeTexts = {
  arabic: string;
  transliteration: string;
};

type QuranRangeApi = Pick<typeof import("@/lib/quran"), "getSurahAyahs" | "getTransliteration">;

/** Join ayah range texts given an already-loaded `@/lib/quran` module. */
export function joinQuranAyahRange(
  quran: QuranRangeApi,
  surah: number,
  ayahFrom: number,
  ayahTo?: number,
): QuranAyahRangeTexts {
  const end = Math.max(ayahFrom, ayahTo ?? ayahFrom);
  const ayahs = quran.getSurahAyahs(surah);
  const translit = quran.getTransliteration(surah);
  const arabicParts: string[] = [];
  const translitParts: string[] = [];

  for (let ayah = ayahFrom; ayah <= end; ayah++) {
    const arabic = ayahs[ayah - 1]?.arabic?.trim();
    if (arabic) arabicParts.push(arabic);
    const latin = translit[String(ayah)]?.trim();
    if (latin) translitParts.push(latin);
  }

  return {
    arabic: arabicParts.join(" "),
    transliteration: translitParts.join(" "),
  };
}

/** Dynamically load `@/lib/quran` then join the requested ayah range. */
export async function loadQuranAyahRange(
  surah: number,
  ayahFrom: number,
  ayahTo?: number,
): Promise<QuranAyahRangeTexts> {
  const quran = await import("@/lib/quran");
  return joinQuranAyahRange(quran, surah, ayahFrom, ayahTo);
}
