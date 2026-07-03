import { DEFAULT_USER_PREFERENCES } from "@munib-tracker/shared/constants";
import type { NotificationPreferences, UserPreferences } from "@munib-tracker/shared/types";

import { initDatabase, PreferencesRepository } from "@/db";

import { createStore, useStore } from "./create-store";

export interface PreferencesState {
  prefs: UserPreferences;
  isReady: boolean;

  load: () => Promise<void>;
  update: (patch: Partial<UserPreferences>) => Promise<void>;
  setNotificationPrefs: (patch: Partial<NotificationPreferences>) => Promise<void>;
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

export function usePreferencesActions() {
  return useStore(preferencesStore, (s) => ({
    load: s.load,
    update: s.update,
    setNotificationPrefs: s.setNotificationPrefs,
    toggleFavorite: s.toggleFavorite,
    setFavoriteOrder: s.setFavoriteOrder,
  }));
}
