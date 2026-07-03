import { useQuery } from "@tanstack/react-query";

import { fetchRemoteEditionSurah } from "@/api/quran-remote";

/**
 * Cache-first hook for a remote (D2) translation edition of one surah. The
 * shared `QueryClient` is already provided by `AppApiProvider` — scripture is
 * immutable so we mark it permanently fresh and offline-first.
 */
export function useRemoteEditionSurah(editionId: string | null, surah: number) {
  return useQuery({
    queryKey: ["quran-edition", editionId, surah],
    enabled: editionId != null,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
    networkMode: "offlineFirst",
    retry: 1,
    queryFn: () => fetchRemoteEditionSurah(editionId as string, surah),
  });
}
