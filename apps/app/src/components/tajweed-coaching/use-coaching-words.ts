import type { QuranWord, TajweedWordRef } from "@munib-tracker/shared/types";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { fetchSurahWords } from "@/api/quran-words";

export const wordRefKey = (ref: TajweedWordRef) => `${ref.surah}:${ref.ayah}:${ref.wordIndex}`;

/**
 * Coaching example words, rendered BY REFERENCE: each ref resolves to the
 * Quran.com study word (Uthmani text + the reciter's word audio) through the
 * cache-first `fetchSurahWords`. Nothing is typed or stored as text.
 */
export function useCoachingWords(refs: readonly TajweedWordRef[]): {
  words: ReadonlyMap<string, QuranWord>;
  loading: boolean;
} {
  const { i18n } = useTranslation();
  const language = i18n.language;
  // Stable content key so a new array with the same refs doesn't refetch.
  const refsKey = refs.map(wordRefKey).join("|");
  const surahs = useMemo(
    () => [...new Set(refs.map((r) => r.surah))].sort((a, b) => a - b).join(","),
    [refs],
  );
  const [words, setWords] = useState<ReadonlyMap<string, QuranWord>>(new Map());
  const [loading, setLoading] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: `refsKey` / `surahs` are the stable keys for `refs`
  useEffect(() => {
    if (!surahs) {
      setWords(new Map());
      return;
    }
    let cancelled = false;
    setLoading(true);
    void Promise.all(
      surahs.split(",").map(async (s) => {
        const surah = Number(s);
        try {
          return [surah, await fetchSurahWords(surah, language)] as const;
        } catch {
          return [surah, null] as const;
        }
      }),
    ).then((loaded) => {
      if (cancelled) return;
      const bySurah = new Map(loaded);
      const out = new Map<string, QuranWord>();
      for (const ref of refs) {
        const word = bySurah.get(ref.surah)?.[String(ref.ayah)]?.[ref.wordIndex];
        if (word) out.set(wordRefKey(ref), word);
      }
      setWords(out);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [refsKey, surahs, language]);

  return { words, loading };
}
