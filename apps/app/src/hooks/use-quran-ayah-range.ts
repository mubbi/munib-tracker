import { useQuery } from "@tanstack/react-query";

import { loadQuranAyahRange, type QuranAyahRangeTexts } from "@/lib/quran-ayah-range";

/**
 * Cache-first Arabic + transliteration for a Learn evidence ayah range.
 * Uses a dynamic import of `@/lib/quran` so ayah JSON stays out of `__common`.
 */
export function useQuranAyahRange(
  surah: number,
  ayahFrom: number,
  ayahTo?: number,
): QuranAyahRangeTexts | undefined {
  const end = ayahTo ?? ayahFrom;
  const { data } = useQuery({
    queryKey: ["quran-ayah-range", surah, ayahFrom, end],
    enabled: surah >= 1 && surah <= 114 && ayahFrom >= 1,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
    networkMode: "offlineFirst",
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    queryFn: () => loadQuranAyahRange(surah, ayahFrom, ayahTo),
  });
  return data;
}
