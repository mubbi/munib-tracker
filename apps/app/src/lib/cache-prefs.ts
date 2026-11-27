import { type DevicePreferences, devicePreferencesStore } from "@/stores/device-preferences-store";
import { preferencesStore } from "@/stores/preferences-store";

/**
 * Single read point for the three "Save … locally" storage toggles.
 *
 * Every fetcher/cache that decides whether to write downloaded content to
 * on-device storage asks here. They are device preferences (settings audit B4,
 * `DB_KEYS.devicePreferences`, never synced); before the device store has
 * loaded, the legacy synced value is the fallback. All three default to `true`
 * when unset so existing installs keep caching until the user opts out.
 */

type CacheFlag = "cacheQuranEditionsLocally" | "cacheHadithLocally" | "cacheAudioLocally";

function cacheFlag(key: CacheFlag): boolean {
  const device: DevicePreferences[CacheFlag] | undefined =
    devicePreferencesStore.getState().prefs[key];
  if (device !== undefined) return device;
  return preferencesStore.getState().prefs[key] !== false;
}

/** Persist fetched Qur'an translations, tafsir, tajweed and word-by-word data. */
export function shouldCacheQuranEditions(): boolean {
  return cacheFlag("cacheQuranEditionsLocally");
}

/** Persist fetched hadith collections. */
export function shouldCacheHadith(): boolean {
  return cacheFlag("cacheHadithLocally");
}

/** Persist streamed audio (recitation, duas, adhan…) to the on-device audio cache. */
export function shouldCacheAudio(): boolean {
  return cacheFlag("cacheAudioLocally");
}
