import type { QuranWord, TajweedSegment } from "@munib-tracker/shared/types";
import { useSurahTajweed, useSurahWords } from "@/hooks/use-quran";

/** Stable empty maps so FlatList `extraData` does not change identity every render. */
const EMPTY_TAJWEED: Record<string, TajweedSegment[]> = {};
const EMPTY_WORDS: Record<string, QuranWord[]> = {};

/** Opt-in study layers for one surah: tajweed colouring and word-by-word, fetched on demand. */
export function useSurahStudyLayers({
  surahNumber,
  hasSurah,
  showTajweed,
  showWordByWord,
  wordLang,
}: {
  surahNumber: number;
  hasSurah: boolean;
  showTajweed: boolean;
  showWordByWord: boolean;
  /** Word-by-word gloss language (scripture translation locale, else UI locale). */
  wordLang: string;
}) {
  const tajweedQuery = useSurahTajweed(surahNumber, showTajweed && hasSurah);
  const wordsQuery = useSurahWords(surahNumber, wordLang, showWordByWord && hasSurah);
  return {
    tajweedByAyah: tajweedQuery.data ?? EMPTY_TAJWEED,
    wordByWordByAyah: wordsQuery.data ?? EMPTY_WORDS,
    studyExtrasLoading:
      (showTajweed && tajweedQuery.isPending) || (showWordByWord && wordsQuery.isPending),
  };
}
