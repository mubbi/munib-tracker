import { devicePreferencesStore } from "@/stores/device-preferences-store";
import { hadithStore } from "@/stores/hadith-store";
import { locationStore } from "@/stores/location-store";
import { preferencesStore } from "@/stores/preferences-store";
import { quranCompanionPrefsStore } from "@/stores/quran-companion-prefs-store";
import { quranStore } from "@/stores/quran-store";

import type { SettingsSnapshot } from "./types";

/** Every store a registered setting can read from or write to. */
const STORES = [
  preferencesStore,
  quranStore,
  hadithStore,
  quranCompanionPrefsStore,
  locationStore,
  devicePreferencesStore,
] as const;

/** Current values across all pref stores (cheap: references only). */
export function getSettingsSnapshot(): SettingsSnapshot {
  return {
    prefs: preferencesStore.getState().prefs,
    quran: quranStore.getState().prefs,
    hadith: hadithStore.getState().prefs,
    companion: quranCompanionPrefsStore.getState().prefs,
    location: locationStore.getState().location,
    device: devicePreferencesStore.getState().prefs,
  };
}

/** Subscribe to a change in any settings store. */
export function subscribeSettings(listener: () => void): () => void {
  const unsubs = STORES.map((store) => store.subscribe(listener));
  return () => {
    for (const unsub of unsubs) unsub();
  };
}

/**
 * Lazily-loaded stores (hadith, practice, Qur'an) are only
 * hydrated by their feature screens — Settings and search load them on mount so
 * rows never show defaults instead of the stored value.
 */
export function ensureSettingsStoresLoaded(): void {
  if (!quranStore.getState().isReady) void quranStore.getState().load();
  if (!hadithStore.getState().isReady) void hadithStore.getState().load();
  if (!quranCompanionPrefsStore.getState().isReady) {
    void quranCompanionPrefsStore.getState().load();
  }
  if (!locationStore.getState().isReady) void locationStore.getState().load();
}
