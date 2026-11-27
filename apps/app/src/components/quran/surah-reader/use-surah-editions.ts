import { getTafsirEdition } from "@munib-tracker/shared/i18n";
import type { UserPreferences } from "@munib-tracker/shared/types";
import { useCallback, useMemo } from "react";
import { hasEditionAyahs, isRemoteEdition, REMOTE_EDITIONS } from "@/api/quran-remote";
import type { QuranPrefs } from "@/db/repositories/quran-repository";
import { useRemoteEditionSurah, useTafsirSurah } from "@/hooks/use-quran";
import { getBundledEdition, getEditionById } from "@/lib/quran";
import { resolvePrimaryEditionId, resolveSecondaryEditionId } from "@/lib/quran-surah-reader";
import { resolvePreferredTafsirId } from "@/lib/quran-tafsir-options";
import { ALL_QURAN_TRANSLATIONS } from "@/lib/quran-translation-options";
import { resolveQuranEditionId } from "@/lib/translation-locale";

/** Bundled stand-in while a remote edition is loading or offline. */
const BUNDLED_EN_FALLBACK = "en-pickthall";

/** Stable empty map so FlatList `extraData` does not change identity every render. */
const EMPTY_EDITION: Record<string, string> = {};

function editionDirection(id: string): "ltr" | "rtl" {
  return (
    getEditionById(id)?.direction ?? REMOTE_EDITIONS.find((e) => e.id === id)?.direction ?? "ltr"
  );
}

/**
 * The text editions shown beside the Arabic in one surah: the primary
 * translation (remote cache-first, bundled fallback), the NF-1.13 second
 * translation and the NF-1.10 on-demand tafsir. Map identities stay stable
 * (query data / memo) so the memoised ayah rows only re-render on real changes.
 */
export function useSurahEditions({
  surahNumber,
  hasSurah,
  prefs,
  translationLocale,
  appLocale,
}: {
  surahNumber: number;
  hasSurah: boolean;
  prefs: Pick<
    QuranPrefs,
    "preferredTranslationIds" | "secondaryTranslationId" | "preferredTafsirId"
  >;
  translationLocale: UserPreferences["translationLocale"];
  appLocale: UserPreferences["locale"];
}) {
  const defaultEditionId = resolveQuranEditionId({ translationLocale, locale: appLocale });
  const knownEdition = resolvePrimaryEditionId(prefs.preferredTranslationIds[0], defaultEditionId);
  const remoteActive = isRemoteEdition(knownEdition);

  // Remote editions are fetched cache-first; call the hook unconditionally.
  const remoteQuery = useRemoteEditionSurah(
    remoteActive && hasSurah ? knownEdition : null,
    surahNumber,
  );
  const bundledTranslation = useMemo(
    () =>
      hasSurah
        ? getBundledEdition(remoteActive ? BUNDLED_EN_FALLBACK : knownEdition, surahNumber)
        : EMPTY_EDITION,
    [hasSurah, surahNumber, knownEdition, remoteActive],
  );
  // Remote data when available, otherwise fall back to a bundled translation.
  const remoteReady = hasEditionAyahs(remoteQuery.data);
  const translation =
    remoteActive && hasEditionAyahs(remoteQuery.data) ? remoteQuery.data : bundledTranslation;
  const translationLoading = remoteActive && remoteQuery.isPending;
  const usingFallback = remoteActive && !remoteReady && !translationLoading;
  const translationDir = usingFallback ? "ltr" : editionDirection(knownEdition);
  const selectedEdition =
    ALL_QURAN_TRANSLATIONS.find((e) => e.id === knownEdition) ??
    ALL_QURAN_TRANSLATIONS.find((e) => e.id === BUNDLED_EN_FALLBACK) ??
    ALL_QURAN_TRANSLATIONS[0];

  // ── Second (side-by-side) translation — NF-1.13 ──────────────────────────
  const secondaryId = prefs.secondaryTranslationId;
  const secondaryKnown = resolveSecondaryEditionId(secondaryId, knownEdition);
  const secondaryRemoteActive = secondaryKnown ? isRemoteEdition(secondaryKnown) : false;
  const secondaryRemoteQuery = useRemoteEditionSurah(
    secondaryRemoteActive && hasSurah ? (secondaryKnown ?? null) : null,
    surahNumber,
  );
  const secondaryBundled = useMemo(
    () =>
      secondaryKnown && hasSurah
        ? getBundledEdition(
            secondaryRemoteActive ? BUNDLED_EN_FALLBACK : secondaryKnown,
            surahNumber,
          )
        : EMPTY_EDITION,
    [secondaryKnown, secondaryRemoteActive, hasSurah, surahNumber],
  );
  const secondaryRemoteReady = hasEditionAyahs(secondaryRemoteQuery.data);
  const secondTranslation = secondaryKnown
    ? secondaryRemoteActive && secondaryRemoteReady
      ? secondaryRemoteQuery.data
      : secondaryBundled
    : undefined;
  const secondaryDir = secondaryKnown ? editionDirection(secondaryKnown) : "ltr";
  const secondaryEdition = ALL_QURAN_TRANSLATIONS.find((e) => e.id === secondaryId);

  // ── On-demand tafsir (NF-1.10) ───────────────────────────────────────────
  const activeTafsirId = resolvePreferredTafsirId(
    prefs.preferredTafsirId,
    translationLocale,
    appLocale,
  );
  const tafsirEdition = activeTafsirId ? getTafsirEdition(activeTafsirId) : undefined;
  const tafsirQuery = useTafsirSurah(activeTafsirId ?? null, surahNumber);
  const tafsirMap = hasEditionAyahs(tafsirQuery.data) ? tafsirQuery.data : undefined;
  const tafsirLoading = Boolean(activeTafsirId) && tafsirQuery.isPending;
  const tafsirOffline =
    Boolean(activeTafsirId) && !tafsirLoading && tafsirQuery.isError && !tafsirMap;

  // C-02: a failed remote edition / tafsir gets an inline "Try again", not a grey sentence.
  const refetchTranslation = remoteQuery.refetch;
  const retryTranslation = useCallback(() => {
    void refetchTranslation();
  }, [refetchTranslation]);
  const refetchTafsir = tafsirQuery.refetch;
  const retryTafsir = useCallback(() => {
    void refetchTafsir();
  }, [refetchTafsir]);

  return {
    /** Primary translation edition id actually shown (preferred, else locale default). */
    knownEdition,
    selectedEdition,
    translation,
    translationLoading,
    usingFallback,
    translationDir,
    /** Raw preference (the picker's selection), even when not shown. */
    secondaryId,
    secondaryEdition,
    secondTranslation,
    secondaryDir,
    activeTafsirId,
    tafsirEdition,
    tafsirMap,
    tafsirLoading,
    tafsirOffline,
    retryTranslation,
    retryTafsir,
  } as const;
}
