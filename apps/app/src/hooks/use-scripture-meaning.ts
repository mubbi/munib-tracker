import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { fetchRemoteEditionSurah } from "@/api/quran-remote";
import {
  baseLanguage,
  joinAyahRangeText,
  type QuranMeaningRef,
  resolveScriptureMeaning,
  type ScriptureMeaning,
  shouldResolveQuranFromDataset,
} from "@/lib/scripture-meaning";
import { isBundledQuranEdition, resolveQuranEditionId } from "@/lib/translation-locale";
import { usePreferences } from "@/stores/preferences-store";

/** Session memo of edition surahs (`editionId:surah`) — remote ones are also cached on disk. */
const surahCache = new Map<string, Record<string, string>>();

async function loadEditionAyahs(editionId: string, surah: number): Promise<Record<string, string>> {
  if (isBundledQuranEdition(editionId)) {
    const quran = await import("@/lib/quran");
    return quran.getBundledEdition(editionId, surah);
  }
  return fetchRemoteEditionSurah(editionId, surah);
}

/**
 * D45 display decision for a scripture meaning excerpt authored in English.
 *
 * - English UI → the excerpt as-is.
 * - Qur'an ref (short span) → the user's dataset translation edition (bundled, or remote and
 *   cache-first), falling back to the labelled English while loading / offline / when the
 *   edition is English.
 * - No ref (hadith, dua) → the English with `englishFallback: true`, so the caller renders
 *   `<EnglishMeaningLabel />`.
 *
 * Deliberately free of react-query so leaf components using it render without a QueryClient.
 */
export function useScriptureMeaning(
  english: string | undefined | null,
  quranRef?: QuranMeaningRef | null,
): ScriptureMeaning {
  const { i18n } = useTranslation();
  const { translationLocale, locale } = usePreferences();
  const uiLanguage = baseLanguage(i18n.language);
  const editionId = resolveQuranEditionId({ translationLocale, locale });
  const ref = shouldResolveQuranFromDataset(uiLanguage, editionId, quranRef) ? quranRef : null;
  const cacheKey = ref ? `${editionId}:${ref.surah}` : null;
  const [ayahs, setAyahs] = useState<Record<string, string> | null>(() =>
    cacheKey ? (surahCache.get(cacheKey) ?? null) : null,
  );

  // `ref` / `editionId` are fully captured by `cacheKey` (edition + surah); avoids object-identity churn.
  // biome-ignore lint/correctness/useExhaustiveDependencies: cacheKey covers editionId + ref.surah
  useEffect(() => {
    if (!cacheKey || !ref) {
      setAyahs(null);
      return;
    }
    const cached = surahCache.get(cacheKey);
    if (cached) {
      setAyahs(cached);
      return;
    }
    let cancelled = false;
    loadEditionAyahs(editionId, ref.surah)
      .then((data) => {
        surahCache.set(cacheKey, data);
        if (!cancelled) setAyahs(data);
      })
      // Offline / failed fetch: keep the labelled English (failures are already reported).
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [cacheKey]);

  const datasetText = ref ? joinAyahRangeText(ayahs, ref) : null;
  return resolveScriptureMeaning(english ?? "", uiLanguage, datasetText);
}
