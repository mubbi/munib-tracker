import { useQuery } from "@tanstack/react-query";

import { fetchRemoteCollection } from "@/api/hadith-remote";
import { usePreferences } from "@/stores/preferences-store";

/**
 * Cache-first hook for a full (D6) hadith collection. Offline-first: an opened
 * collection is cached in AsyncStorage and re-read offline afterward.
 */
export function useRemoteCollection(id: string | null) {
  const { translationLocale } = usePreferences();
  return useQuery({
    queryKey: ["hadith-collection", id, translationLocale],
    enabled: id != null,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
    networkMode: "offlineFirst",
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    queryFn: () => fetchRemoteCollection(id as string),
  });
}
