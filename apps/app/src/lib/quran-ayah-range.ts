/**
 * Resolve Arabic + transliteration for a surah ayah range from the bundled
 * Qur'an corpora. Callers that must keep ayah JSON out of `__common` should
 * use {@link loadQuranAyahRange} (dynamic import) rather than sync helpers.
 */

import type { RevelationPlace } from "@munib-tracker/shared/types";

export type QuranAyahRangeTexts = {
  arabic: string;
  transliteration: string;
};

export type QuranAyahCardData = {
  ayah: number;
  arabic: string;
  transliteration: string;
  translation: string;
  sajda: boolean;
};

export type QuranAyahCardsPayload = {
  surah: number;
  surahName: string;
  nameArabic: string;
  nameEnglish: string;
  revelationPlace?: RevelationPlace;
  ayahCount: number;
  ayahs: QuranAyahCardData[];
};

type QuranRangeApi = Pick<
  typeof import("@/lib/quran"),
  "getSurahAyahs" | "getTransliteration" | "getBundledEdition" | "getSurahByNumber"
>;

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

/** Per-ayah card data (Arabic, transliteration, translation) for a span. */
export function joinQuranAyahCards(
  quran: QuranRangeApi,
  surah: number,
  ayahFrom: number,
  ayahTo: number,
  editionId: string,
): QuranAyahCardsPayload {
  const end = Math.max(ayahFrom, ayahTo);
  const all = quran.getSurahAyahs(surah);
  const translit = quran.getTransliteration(surah);
  const translation = quran.getBundledEdition(editionId, surah);
  const meta = quran.getSurahByNumber(surah);
  const ayahs: QuranAyahCardData[] = [];

  for (let n = ayahFrom; n <= end; n++) {
    const row = all[n - 1];
    if (!row) continue;
    ayahs.push({
      ayah: n,
      arabic: row.arabic,
      transliteration: translit[String(n)] ?? "",
      translation: translation[String(n)] ?? "",
      sajda: !!row.sajda,
    });
  }

  return {
    surah,
    surahName: meta?.nameTransliteration ?? `Surah ${surah}`,
    nameArabic: meta?.nameArabic ?? "",
    nameEnglish: meta?.nameEnglish ?? "",
    revelationPlace: meta?.revelationPlace,
    ayahCount: meta?.ayahCount ?? ayahs.length,
    ayahs,
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

/** Dynamically load `@/lib/quran` then build per-ayah cards for a span. */
export async function loadQuranAyahCards(
  surah: number,
  ayahFrom: number,
  ayahTo: number,
  editionId: string,
): Promise<QuranAyahCardsPayload> {
  const quran = await import("@/lib/quran");
  return joinQuranAyahCards(quran, surah, ayahFrom, ayahTo, editionId);
}

/** Load per-ayah cards for one or more spans (e.g. the three Quls). */
export async function loadQuranAyahCardsRanges(
  ranges: Array<{ surah: number; ayahFrom: number; ayahTo: number }>,
  editionId: string,
): Promise<QuranAyahCardsPayload[]> {
  const quran = await import("@/lib/quran");
  return ranges.map((range) =>
    joinQuranAyahCards(quran, range.surah, range.ayahFrom, range.ayahTo, editionId),
  );
}
