import AsyncStorage from "@react-native-async-storage/async-storage";

import { DB_KEYS } from "@/db/keys";

/**
 * Offline download / cache manager (NF-1.14). Lists the rebuildable caches
 * (fetched Qur'an editions, hadith collections, audio + location lookups) with
 * their on-device size and lets the user clear them. User data (logs, bookmarks,
 * favorites) is never touched here — only caches that refetch on demand.
 */

export interface CacheGroup {
  id: string;
  labelKey: string;
  keys: string[];
}

export interface CacheGroupSize extends CacheGroup {
  bytes: number;
}

export const CACHE_GROUPS: CacheGroup[] = [
  { id: "quran", labelKey: "offlineData.quran", keys: [DB_KEYS.quranEditionCache] },
  { id: "hadith", labelKey: "offlineData.hadith", keys: [DB_KEYS.hadithBookCache] },
  { id: "audio", labelKey: "offlineData.audio", keys: [DB_KEYS.audioDurationCache] },
  {
    id: "location",
    labelKey: "offlineData.location",
    keys: [DB_KEYS.reverseGeocodeCache, DB_KEYS.weatherCache],
  },
];

/** Reads the on-device byte size of each cache group. */
export async function getCacheSummary(): Promise<CacheGroupSize[]> {
  const summary: CacheGroupSize[] = [];
  for (const group of CACHE_GROUPS) {
    let bytes = 0;
    for (const key of group.keys) {
      const raw = await AsyncStorage.getItem(key);
      bytes += raw?.length ?? 0;
    }
    summary.push({ ...group, bytes });
  }
  return summary;
}

/** Removes the given cache keys (safe — they refetch on demand). */
export async function clearCacheKeys(keys: string[]): Promise<void> {
  await Promise.all(keys.map((key) => AsyncStorage.removeItem(key)));
}

/** Human-readable size, e.g. 1536 → "1.5 KB". */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
