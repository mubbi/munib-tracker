import { useQuery } from "@tanstack/react-query";

import { fetchRemoteEditionSurah } from "@/api/quran-remote";
import { fetchTafsirSurah } from "@/api/quran-tafsir";
import { fetchSurahTajweed } from "@/api/quran-tajweed";
import { fetchAyahWordSegments, fetchSurahWords } from "@/api/quran-words";

/**
 * Cache-first hook for a remote (D2) translation edition of one surah. The
 * shared `QueryClient` is already provided by `AppApiProvider` — scripture is
 * immutable so we mark it permanently fresh and offline-first.
 */
export function useRemoteEditionSurah(editionId: string | null, surah: number) {
  return useQuery({
    // v2: payloads are read from fawaz `chapter[]` (older cache entries were empty `{}`).
    queryKey: ["quran-edition", "v2", editionId, surah],
    enabled: editionId != null,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
    networkMode: "offlineFirst",
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    queryFn: () => fetchRemoteEditionSurah(editionId as string, surah),
  });
}

/** Cache-first hook for an on-demand tafsir edition of one surah. */
export function useTafsirSurah(editionId: string | null, surah: number) {
  return useQuery({
    queryKey: ["quran-tafsir", "v1", editionId, surah],
    enabled: editionId != null && surah >= 1 && surah <= 114,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
    networkMode: "offlineFirst",
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    queryFn: () => fetchTafsirSurah(editionId as string, surah),
  });
}

/** Opt-in tajweed segments for one surah (ayah study). */
export function useSurahTajweed(surah: number, enabled: boolean) {
  return useQuery({
    queryKey: ["quran-tajweed", "v3", surah],
    enabled: enabled && surah >= 1 && surah <= 114,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
    networkMode: "offlineFirst",
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    queryFn: () => fetchSurahTajweed(surah),
  });
}

/** Opt-in word-by-word map for one surah (ayah study). */
export function useSurahWords(surah: number, language: string, enabled: boolean) {
  const lang = language.split("-")[0]?.toLowerCase() || "en";
  return useQuery({
    queryKey: ["quran-words", "v2", lang, surah],
    enabled: enabled && surah >= 1 && surah <= 114,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
    networkMode: "offlineFirst",
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    queryFn: () => fetchSurahWords(surah, lang),
  });
}

/** Word timing segments for the currently playing ayah (highlight follow). */
export function useAyahWordSegments(
  recitationId: number | null,
  surah: number,
  ayah: number | null,
  enabled: boolean,
) {
  return useQuery({
    queryKey: ["quran-word-segments", "v2", recitationId, surah, ayah],
    enabled: enabled && recitationId != null && ayah != null && ayah >= 1,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
    networkMode: "offlineFirst",
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    queryFn: () => fetchAyahWordSegments(recitationId as number, surah, ayah as number),
  });
}
