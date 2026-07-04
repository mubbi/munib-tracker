import { useQuery } from "@tanstack/react-query";

import { fetchRemoteCollection } from "@/api/hadith-remote";

/**
 * Cache-first hook for a full (D6) hadith collection. Offline-first: an opened
 * collection is cached in AsyncStorage and re-read offline afterward.
 */
export function useRemoteCollection(id: string | null) {
  return useQuery({
    queryKey: ["hadith-collection", id],
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
