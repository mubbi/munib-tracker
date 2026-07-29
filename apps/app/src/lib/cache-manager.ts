import AsyncStorage from "@react-native-async-storage/async-storage";

import { DB_KEYS } from "@/db/keys";
import { clearAudioCache, getAudioCacheInfo } from "@/lib/audio-cache";
import { clearQcfFontCache, getQcfFontCacheInfo } from "@/lib/qcf-font-cache";

/**
 * Offline download / cache manager (NF-1.14). Lists the rebuildable caches
 * (fetched Qur'an editions, hadith collections, audio + location lookups) with
 * their on-device size and lets the user clear them. User data (logs, bookmarks,
 * favorites) is never touched here — only caches that refetch on demand.
 *
 * The "audio" group spans both AsyncStorage (HEAD-estimated durations) and the
 * downloaded MP3s themselves — native files or the web Cache Storage bucket, both
 * read via {@link getAudioCacheInfo}.
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
  {
    id: "quran",
    labelKey: "offlineData.quran",
    // Editions/tafsir plus ayah-study caches (tajweed / word-by-word).
    keys: [DB_KEYS.quranEditionCache, DB_KEYS.quranStudyCache],
  },
  {
    id: "mushafFonts",
    labelKey: "offlineData.mushafFonts",
    keys: [],
  },
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
    if (group.id === "mushafFonts") {
      const mushafFonts = await getQcfFontCacheInfo();
      bytes += mushafFonts.bytes;
      count = mushafFonts.count;
    }
    summary.push({ ...group, bytes, count });
  }
  return summary;
}

/** On-device size + file count of downloaded audio (native files or web cache). */
async function getDownloadedAudio(): Promise<{ bytes: number; count: number }> {
  return getAudioCacheInfo();
}

/** Deletes every downloaded audio clip (native files or web cache). */
export async function clearDownloadedAudio(): Promise<void> {
  await clearAudioCache();
}

/** Removes the given cache keys (safe — they refetch on demand). */
export async function clearCacheKeys(keys: string[]): Promise<void> {
  await Promise.all(keys.map((key) => AsyncStorage.removeItem(key)));
}

/** Deletes cached mushaf page fonts (native files or web cache). */
export async function clearDownloadedQcfFonts(): Promise<void> {
  await clearQcfFontCache();
}

/** Human-readable size, e.g. 1536 → "1.5 KB". */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
