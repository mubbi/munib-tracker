import { DEFAULT_USER_PREFERENCES } from "@munib-tracker/shared/constants";
import type { UserPreferences } from "@munib-tracker/shared/types";

import { DB_KEYS } from "../keys";
import { readJSON, writeJSON } from "../store";

/** Deep-merges stored preferences over defaults so new fields always have values. */
function withDefaults(stored: Partial<UserPreferences>): UserPreferences {
  return {
    ...DEFAULT_USER_PREFERENCES,
    ...stored,
    notificationPrefs: {
      ...DEFAULT_USER_PREFERENCES.notificationPrefs,
      ...stored.notificationPrefs,
    },
    fontPrefs: {
      ...DEFAULT_USER_PREFERENCES.fontPrefs,
      ...stored.fontPrefs,
    },
    favoriteZikrIds: stored.favoriteZikrIds ?? [],
    favoriteZikrOrder: stored.favoriteZikrOrder ?? [],
    prayerAlerts: stored.prayerAlerts ?? {},
  };
}

export const PreferencesRepository = {
  async get(): Promise<UserPreferences> {
    const stored = await readJSON<Partial<UserPreferences>>(DB_KEYS.userPreferences, {});
    return withDefaults(stored);
  },

  async update(patch: Partial<UserPreferences>): Promise<UserPreferences> {
    const current = await this.get();
    const next = withDefaults({ ...current, ...patch });
    await writeJSON(DB_KEYS.userPreferences, next);
    return next;
  },

  async toggleFavorite(zikrId: string): Promise<UserPreferences> {
    const current = await this.get();
    const isFavorite = current.favoriteZikrIds.includes(zikrId);
    const favoriteZikrIds = isFavorite
      ? current.favoriteZikrIds.filter((id) => id !== zikrId)
      : [...current.favoriteZikrIds, zikrId];
    const favoriteZikrOrder = isFavorite
      ? current.favoriteZikrOrder.filter((id) => id !== zikrId)
      : [...current.favoriteZikrOrder, zikrId];
    return this.update({ favoriteZikrIds, favoriteZikrOrder });
  },

  async setFavoriteOrder(order: string[]): Promise<UserPreferences> {
    return this.update({ favoriteZikrOrder: order });
  },
};

export type PreferencesRepositoryType = typeof PreferencesRepository;
