import type { QuranWord } from "@munib-tracker/shared/types";
import { useMemo } from "react";

import { isRemoteEdition } from "@/api/quran-remote";
import { useIsOnline } from "@/hooks/use-is-online";
import { useRemoteEditionSurah, useSurahWords } from "@/hooks/use-quran";
import { getBundledEdition, getSurahAyahs, getTransliteration } from "@/lib/quran";
import { splitAyahWords } from "@/lib/quran-companion/align-words";
import { useQuranPrefs } from "@/stores/quran-store";

const BUNDLED_EN_FALLBACK = "en-pickthall";

export type PracticeAyahText = {
  ayah: number;
  arabic: string;
  translation: string;
  transliteration: string;
  /** Study words: Quran.com words when cached, else the bundled ayah split on whitespace. */
  words: string[];
  /** Per-word audio (only with Quran.com words). */
  wordAudio: (string | undefined)[];
  /** True when the study row came from the offline whitespace fallback (§6). */
  fallbackWords: boolean;
};

/**
 * Text for a practice passage: bundled Arabic (the source of what the person
 * sees — no basmala is prepended), the reader's chosen translation, and the study
 * words. Quran.com words need a network once; offline with an empty cache the
 * row falls back to the bundled ayah split on whitespace. Practice never blocks
 * on that request and never invents glosses.
 */
export function usePracticeAyahText(
  surah: number,
  ayahs: number[],
  language: string,
): {
  rows: Record<number, PracticeAyahText>;
  wordsLoading: boolean;
  /** Quran.com word count per ayah of the whole surah (mushaf glyph mapping); null until loaded. */
  surahWordCounts: Record<number, number> | null;
} {
  const prefs = useQuranPrefs();
  const online = useIsOnline();
  const wordsQuery = useSurahWords(surah, language, true);
  const editionId = prefs.preferredTranslationIds[0] ?? BUNDLED_EN_FALLBACK;
  const remote = isRemoteEdition(editionId);
  const remoteQuery = useRemoteEditionSurah(remote ? editionId : null, surah);

  const rows = useMemo(() => {
    const out: Record<number, PracticeAyahText> = {};
    const all = getSurahAyahs(surah);
    const translit = getTransliteration(surah);
    const translation =
      remote && remoteQuery.data && Object.keys(remoteQuery.data).length
        ? (remoteQuery.data as Record<string, string>)
        : getBundledEdition(remote ? BUNDLED_EN_FALLBACK : editionId, surah);
    for (const ayah of ayahs) {
      const arabic = all[ayah - 1]?.arabic ?? "";
      const studyWords: QuranWord[] | undefined = wordsQuery.data?.[String(ayah)];
      const fromStudy = studyWords?.length ? studyWords.map((w) => w.arabic) : null;
      out[ayah] = {
        ayah,
        arabic,
        translation: translation[String(ayah)] ?? "",
        transliteration: translit[String(ayah)] ?? "",
        words: fromStudy ?? splitAyahWords(arabic),
        wordAudio: studyWords?.length ? studyWords.map((w) => w.audioUrl) : [],
        fallbackWords: !fromStudy,
      };
    }
    return out;
  }, [ayahs, editionId, remote, remoteQuery.data, surah, wordsQuery.data]);

  const surahWordCounts = useMemo(() => {
    const data = wordsQuery.data;
    if (!data) return null;
    const out: Record<number, number> = {};
    for (const [ayah, words] of Object.entries(data)) out[Number(ayah)] = words.length;
    return Object.keys(out).length ? out : null;
  }, [wordsQuery.data]);

  return { rows, wordsLoading: online && wordsQuery.isPending, surahWordCounts };
}
