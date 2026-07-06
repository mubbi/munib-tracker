import { DEFAULT_USER_PREFERENCES } from "@munib-tracker/shared/constants";
import type {
  NotificationPreferences,
  PrayerId,
  UserPreferences,
  WeatherPreferences,
} from "@munib-tracker/shared/types";

import { initDatabase, PreferencesRepository } from "@/db";
import { syncHapticsEnabled } from "@/lib/haptics";

import { createStore, useStore } from "./create-store";

export interface PreferencesState {
  prefs: UserPreferences;
  isReady: boolean;

  load: () => Promise<void>;
  update: (patch: Partial<UserPreferences>) => Promise<void>;
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
    await initDatabase();
    const prefs = await PreferencesRepository.get();
    set({ prefs, isReady: true });
  },

  async update(patch) {
    const prefs = await PreferencesRepository.update(patch);
    set({ prefs });
  },

  async setNotificationPrefs(patch) {
    const current = get().prefs;
    const prefs = await PreferencesRepository.update({
      notificationPrefs: { ...current.notificationPrefs, ...patch },
    });
    set({ prefs });
  },

  async setWeatherPrefs(patch) {
    const current = get().prefs;
    const prefs = await PreferencesRepository.update({
      weatherPrefs: { ...current.weatherPrefs, ...patch },
    });
    set({ prefs });
  },

  async setPrayerAlert(prayerId, enabled) {
    const current = get().prefs;
    const prayerAlerts = { ...current.prayerAlerts, [prayerId]: enabled };
    const prefs = await PreferencesRepository.update({ prayerAlerts });
    set({ prefs });
  },

  async toggleFavorite(zikrId) {
    const prefs = await PreferencesRepository.toggleFavorite(zikrId);
    set({ prefs });
  },

  async setFavoriteOrder(order) {
    const prefs = await PreferencesRepository.setFavoriteOrder(order);
    set({ prefs });
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
  update: (...args: Parameters<PreferencesState["update"]>) =>
    preferencesStore.getState().update(...args),
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
