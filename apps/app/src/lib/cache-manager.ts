import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

import { DB_KEYS } from "@/db/keys";
import { clearAudioCache, getAudioCacheSize } from "@/lib/audio-cache";
import { clearWebAudioCache, getWebAudioCacheSize } from "@/lib/pwa/audio-sw-cache";

/**
 * Offline download / cache manager (NF-1.14). Lists the rebuildable caches
 * (fetched Qur'an editions, hadith collections, audio + location lookups) with
 * their on-device size and lets the user clear them. User data (logs, bookmarks,
 * favorites) is never touched here — only caches that refetch on demand.
 *
 * The "audio" group spans both AsyncStorage (HEAD-estimated durations) and the
 * downloaded MP3s themselves — native files via {@link getAudioCacheSize}, or the
 * service-worker cache on web ({@link getWebAudioCacheSize}).
 */

export interface CacheGroup {
  id: string;
  labelKey: string;
  keys: string[];
}

export interface CacheGroupSize extends CacheGroup {
  bytes: number;
  /** Cached file count — set for audio, where opaque web clips have no readable size. */
  count?: number;
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
    let count = 0;
    if (group.id === "audio") {
      const downloaded = await getDownloadedAudio();
      bytes += downloaded.bytes;
      count = downloaded.count;
    }
    summary.push({ ...group, bytes, count });
  }
  return summary;
}

/** On-device size + file count of downloaded audio (native files or web SW cache). */
async function getDownloadedAudio(): Promise<{ bytes: number; count: number }> {
  if (Platform.OS === "web") {
    const info = await getWebAudioCacheSize();
    return { bytes: info.bytes, count: info.count };
  }
  return { bytes: await getAudioCacheSize(), count: 0 };
}

/** Deletes every downloaded audio clip (native files or web SW cache). */
export async function clearDownloadedAudio(): Promise<void> {
  if (Platform.OS === "web") {
    await clearWebAudioCache();
    return;
  }
  await clearAudioCache();
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
