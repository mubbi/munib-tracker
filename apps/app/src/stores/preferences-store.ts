import { DEFAULT_USER_PREFERENCES } from "@munib-tracker/shared/constants";
import { matchDeviceLocale } from "@munib-tracker/shared/i18n";
import type {
  AppLocale,
  NotificationPreferences,
  PrayerId,
  UserPreferences,
  WeatherPreferences,
} from "@munib-tracker/shared/types";
import * as Localization from "expo-localization";

import { initDatabase, PreferencesRepository } from "@/db";
import { bootstrapAppLocale, changeAppLocale } from "@/i18n";
import { syncHapticsEnabled } from "@/lib/haptics";
import { willRequireNativeReloadForLocale } from "@/lib/i18n/rtl";
import { clearPreferencesDirty, markPreferencesDirty } from "@/lib/sync/preferences-cloud-sync";
import {
  cancelScheduledPreferencesCloudSync,
  pushPreferencesNow,
  schedulePreferencesCloudSync,
} from "@/lib/sync/push-preferences";

import { createStore, useStore } from "./create-store";

/** Shallow merge for optimistic UI — matches repository defaults for nested blobs. */
function mergePrefs(current: UserPreferences, patch: Partial<UserPreferences>): UserPreferences {
  return {
    ...current,
    ...patch,
    notificationPrefs: patch.notificationPrefs
      ? { ...current.notificationPrefs, ...patch.notificationPrefs }
      : current.notificationPrefs,
    fontPrefs: patch.fontPrefs
      ? {
          ...current.fontPrefs,
          ...patch.fontPrefs,
          arabic: { ...current.fontPrefs.arabic, ...patch.fontPrefs.arabic },
          translation: { ...current.fontPrefs.translation, ...patch.fontPrefs.translation },
          transliteration: {
            ...current.fontPrefs.transliteration,
            ...patch.fontPrefs.transliteration,
          },
          global: { ...current.fontPrefs.global, ...patch.fontPrefs.global },
          titles: { ...current.fontPrefs.titles, ...patch.fontPrefs.titles },
        }
      : current.fontPrefs,
    weatherPrefs: patch.weatherPrefs
      ? { ...current.weatherPrefs, ...patch.weatherPrefs }
      : current.weatherPrefs,
    updatedAt: patch.updatedAt ?? new Date().toISOString(),
  };
}

function scheduleCloudSync(prefs: UserPreferences): void {
  markPreferencesDirty();
  schedulePreferencesCloudSync(prefs);
}

export interface PreferencesState {
  prefs: UserPreferences;
  isReady: boolean;

  /** Initial hydration — applies saved locale / RTL once at app start. */
  load: () => Promise<void>;
  /** Reload in-memory prefs from SQLite without locale or RTL side effects. */
  refreshFromDb: () => Promise<void>;
  update: (patch: Partial<UserPreferences>) => Promise<void>;
  /** App UI language — persists, applies strings, and flips RTL when needed. */
  setLocale: (locale: AppLocale) => Promise<void>;
  setNotificationPrefs: (patch: Partial<NotificationPreferences>) => Promise<void>;
  setWeatherPrefs: (patch: Partial<WeatherPreferences>) => Promise<void>;
  setPrayerAlert: (prayerId: PrayerId, enabled: boolean) => Promise<void>;
  toggleFavorite: (zikrId: string) => Promise<void>;
  setFavoriteOrder: (order: string[]) => Promise<void>;
}

export const preferencesStore = createStore<PreferencesState>((set, get) => ({
  prefs: DEFAULT_USER_PREFERENCES,
  isReady: false,

  async load() {
    if (get().isReady) return;

    try {
      await initDatabase();
      let prefs = await PreferencesRepository.get();

      if (!prefs.hasCompletedOnboarding && prefs.locale === "en") {
        const deviceTags = Localization.getLocales().map((l) => l.languageTag);
        const matched = matchDeviceLocale(deviceTags);
        if (matched && matched !== "en") {
          prefs = await PreferencesRepository.update({
            locale: matched,
            translationLocale: matched,
          });
        }
      }

      set({ prefs });
      await bootstrapAppLocale(prefs.locale);
    } finally {
      // Always unblock startup. When a native RTL reload succeeds, JS remounts
      // before the user sees UI; when reloadAppAsync fails, we must not leave
      // the app stuck on the splash screen forever.
      set({ isReady: true });
    }
  },

  async refreshFromDb() {
    const prefs = await PreferencesRepository.get();
    set({ prefs });
  },

  async update(patch) {
    const previous = get().prefs;
    set({ prefs: mergePrefs(previous, patch) });
    try {
      const prefs = await PreferencesRepository.update(patch);
      set({ prefs });
      scheduleCloudSync(prefs);
    } catch {
      set({ prefs: previous });
    }
  },

  async setLocale(locale) {
    cancelScheduledPreferencesCloudSync();
    const previous = get().prefs;
    set({ prefs: mergePrefs(previous, { locale }) });
    try {
      const prefs = await PreferencesRepository.update({ locale });
      set({ prefs });
      markPreferencesDirty();

      const willReload = willRequireNativeReloadForLocale(locale);

      // A native reload discards debounced sync timers — push locale immediately
      // so the server snapshot matches after restart.
      if (willReload) {
        try {
          const pushed = await pushPreferencesNow(prefs);
          if (pushed) clearPreferencesDirty();
        } catch {
          // Offline — next foreground sync will retry.
        }
      }

      const reloaded = await changeAppLocale(locale);
      if (!reloaded && !willReload) {
        schedulePreferencesCloudSync(prefs);
      }
    } catch {
      set({ prefs: previous });
    }
  },

  async setNotificationPrefs(patch) {
    const previous = get().prefs;
    const optimistic = mergePrefs(previous, {
      notificationPrefs: { ...previous.notificationPrefs, ...patch },
    });
    set({ prefs: optimistic });
    try {
      const current = get().prefs;
      const prefs = await PreferencesRepository.update({
        notificationPrefs: { ...current.notificationPrefs, ...patch },
      });
      set({ prefs });
      scheduleCloudSync(prefs);
    } catch {
      set({ prefs: previous });
    }
  },

  async setWeatherPrefs(patch) {
    const previous = get().prefs;
    const optimistic = mergePrefs(previous, {
      weatherPrefs: { ...previous.weatherPrefs, ...patch },
    });
    set({ prefs: optimistic });
    try {
      const current = get().prefs;
      const prefs = await PreferencesRepository.update({
        weatherPrefs: { ...current.weatherPrefs, ...patch },
      });
      set({ prefs });
      scheduleCloudSync(prefs);
    } catch {
      set({ prefs: previous });
    }
  },

  async setPrayerAlert(prayerId, enabled) {
    const previous = get().prefs;
    const optimistic = mergePrefs(previous, {
      prayerAlerts: { ...previous.prayerAlerts, [prayerId]: enabled },
    });
    set({ prefs: optimistic });
    try {
      const prefs = await PreferencesRepository.update({
        prayerAlerts: { ...get().prefs.prayerAlerts, [prayerId]: enabled },
      });
      set({ prefs });
      scheduleCloudSync(prefs);
    } catch {
      set({ prefs: previous });
    }
  },

  async toggleFavorite(zikrId) {
    const prefs = await PreferencesRepository.toggleFavorite(zikrId);
    set({ prefs });
    scheduleCloudSync(prefs);
  },

  async setFavoriteOrder(order) {
    const prefs = await PreferencesRepository.setFavoriteOrder(order);
    set({ prefs });
    scheduleCloudSync(prefs);
  },
}));

export function usePreferences(): UserPreferences {
  return useStore(preferencesStore, (s) => s.prefs);
}

export function usePreferencesReady(): boolean {
  return useStore(preferencesStore, (s) => s.isReady);
}

export function useFavoriteZikrIds(): string[] {
  return useStore(preferencesStore, (s) => s.prefs.favoriteZikrOrder);
}

export function useIsFavoriteZikr(zikrId: string): boolean {
  return useStore(preferencesStore, (s) => s.prefs.favoriteZikrIds.includes(zikrId));
}

// Stable singleton — actions never change reference, so no subscription needed.
const preferencesActions = {
  load: (...args: Parameters<PreferencesState["load"]>) =>
    preferencesStore.getState().load(...args),
  refreshFromDb: (...args: Parameters<PreferencesState["refreshFromDb"]>) =>
    preferencesStore.getState().refreshFromDb(...args),
  update: (...args: Parameters<PreferencesState["update"]>) =>
    preferencesStore.getState().update(...args),
  setLocale: (...args: Parameters<PreferencesState["setLocale"]>) =>
    preferencesStore.getState().setLocale(...args),
  setNotificationPrefs: (...args: Parameters<PreferencesState["setNotificationPrefs"]>) =>
    preferencesStore.getState().setNotificationPrefs(...args),
  setWeatherPrefs: (...args: Parameters<PreferencesState["setWeatherPrefs"]>) =>
    preferencesStore.getState().setWeatherPrefs(...args),
  setPrayerAlert: (...args: Parameters<PreferencesState["setPrayerAlert"]>) =>
    preferencesStore.getState().setPrayerAlert(...args),
  toggleFavorite: (...args: Parameters<PreferencesState["toggleFavorite"]>) =>
    preferencesStore.getState().toggleFavorite(...args),
  setFavoriteOrder: (...args: Parameters<PreferencesState["setFavoriteOrder"]>) =>
    preferencesStore.getState().setFavoriteOrder(...args),
} as const;

export function usePreferencesActions() {
  return preferencesActions;
}

// `Listener` is a zero-arg notification (see create-store.ts); read the current
// state via getState() rather than a listener argument that is never passed.
preferencesStore.subscribe(() => {
  syncHapticsEnabled(preferencesStore.getState().prefs.hapticsEnabled);
});
syncHapticsEnabled(preferencesStore.getState().prefs.hapticsEnabled);
