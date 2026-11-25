import AsyncStorage from "@react-native-async-storage/async-storage";
import { act } from "@testing-library/react-native";

import { PreferencesRepository } from "@/db/repositories/preferences-repository";
import type { PlatformCtx } from "@/lib/settings/types";
import { resetDevicePreferencesStore } from "@/stores/device-preferences-store";
import { hadithStore } from "@/stores/hadith-store";
import { locationStore } from "@/stores/location-store";
import { preferencesStore } from "@/stores/preferences-store";
import { quranCompanionPrefsStore } from "@/stores/quran-companion-prefs-store";
import { quranStore } from "@/stores/quran-store";

/** Settings `PlatformCtx` for `available` predicates (phone iOS by default). */
export function platformCtx(overrides: Partial<PlatformCtx> = {}): PlatformCtx {
  return {
    os: "ios",
    tv: false,
    native: true,
    web: false,
    liveActivitySupported: false,
    ...overrides,
  };
}

export const PHONE_IOS = platformCtx();
export const PHONE_ANDROID = platformCtx({ os: "android" });
export const WEB = platformCtx({ os: "web", native: false, web: true });
export const TV = platformCtx({ os: "android", tv: true, native: false });

/**
 * Wipes storage and hydrates every store a setting reads (preferences, Qur'an,
 * hadith, practice, location) so registry reads/writes hit
 * real repositories.
 */
export async function resetSettingsStores(): Promise<void> {
  await AsyncStorage.clear();
  await act(async () => {
    resetDevicePreferencesStore();
    preferencesStore.setState({ isReady: false });
    await preferencesStore.getState().load();
    await quranStore.getState().load();
    await hadithStore.getState().load();
    await quranCompanionPrefsStore.getState().load();
    await locationStore.getState().load();
  });
}

/**
 * Sets the app-wide translation / transliteration pair (D13) for reader tests:
 * in memory right away, and in the stored preferences blob (returned promise) so
 * a later store refresh — `MunibThemeProvider` hydrating or writing the colour
 * mode back via `update()` — keeps the pair instead of the stored default.
 */
export function setReadingDisplayState(
  pair: Partial<{ showTranslation: boolean; showTransliteration: boolean }>,
): Promise<unknown> {
  const { prefs } = preferencesStore.getState();
  const readingDisplay = {
    showTranslation: prefs.readingDisplay?.showTranslation !== false,
    showTransliteration: prefs.readingDisplay?.showTransliteration !== false,
    ...pair,
  };
  preferencesStore.setState({ prefs: { ...prefs, readingDisplay } });
  return PreferencesRepository.update({ readingDisplay });
}
