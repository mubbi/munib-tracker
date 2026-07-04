import { DEFAULT_USER_PREFERENCES } from "@munib-tracker/shared/constants";
import type { UserPreferences } from "@munib-tracker/shared/types";

import { DB_KEYS } from "../keys";
import { readJSON, withKeyLock, writeJSON } from "../store";

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
    weatherPrefs: {
      ...DEFAULT_USER_PREFERENCES.weatherPrefs,
      ...stored.weatherPrefs,
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

  /**
   * Atomic read-modify-write of the preferences blob. Stamps `updatedAt` so the
   * sync engine can last-write-wins the blob (callers may override by passing
   * their own `updatedAt`, e.g. when applying a remote record).
   */
  async update(patch: Partial<UserPreferences>): Promise<UserPreferences> {
    return withKeyLock(DB_KEYS.userPreferences, async () => {
      const current = await this.get();
      const next = withDefaults({
        ...current,
        ...patch,
        updatedAt: patch.updatedAt ?? new Date().toISOString(),
      });
      await writeJSON(DB_KEYS.userPreferences, next);
      return next;
    });
  },

  async toggleFavorite(zikrId: string): Promise<UserPreferences> {
    return withKeyLock(DB_KEYS.userPreferences, async () => {
      const current = await this.get();
      const isFavorite = current.favoriteZikrIds.includes(zikrId);
      const favoriteZikrIds = isFavorite
        ? current.favoriteZikrIds.filter((id) => id !== zikrId)
        : [...current.favoriteZikrIds, zikrId];
      const favoriteZikrOrder = isFavorite
        ? current.favoriteZikrOrder.filter((id) => id !== zikrId)
        : [...current.favoriteZikrOrder, zikrId];
      const now = new Date().toISOString();
      const next = withDefaults({
        ...current,
        favoriteZikrIds,
        favoriteZikrOrder,
        favoritesUpdatedAt: now,
        updatedAt: now,
      });
      await writeJSON(DB_KEYS.userPreferences, next);
      return next;
    });
  },

  async setFavoriteOrder(order: string[]): Promise<UserPreferences> {
    return this.update({ favoriteZikrOrder: order, favoritesUpdatedAt: new Date().toISOString() });
  },

  /**
   * Applies a pulled preferences blob with last-write-wins on `updatedAt`.
   * Favorites are owned by their own record (see {@link applyRemoteFavorites}),
   * so they are excluded here to avoid two authorities fighting over the list.
   */
  async applyRemotePreferences(incoming: Partial<UserPreferences>): Promise<void> {
    await withKeyLock(DB_KEYS.userPreferences, async () => {
      const current = await this.get();
      if (current.updatedAt && incoming.updatedAt && current.updatedAt >= incoming.updatedAt) {
        return;
      }
      const patch: Partial<UserPreferences> = { ...incoming };
      patch.favoriteZikrIds = undefined;
      patch.favoriteZikrOrder = undefined;
      patch.favoritesUpdatedAt = undefined;
      const next = withDefaults({
        ...current,
        ...patch,
        favoriteZikrIds: current.favoriteZikrIds,
        favoriteZikrOrder: current.favoriteZikrOrder,
        favoritesUpdatedAt: current.favoritesUpdatedAt,
        updatedAt: incoming.updatedAt,
      });
      await writeJSON(DB_KEYS.userPreferences, next);
    });
  },

  /** Applies pulled favorites with last-write-wins on `favoritesUpdatedAt`. */
  async applyRemoteFavorites(
    ids: string[],
    order: string[],
    favoritesUpdatedAt?: string,
  ): Promise<void> {
    await withKeyLock(DB_KEYS.userPreferences, async () => {
      const current = await this.get();
      if (
        current.favoritesUpdatedAt &&
        favoritesUpdatedAt &&
        current.favoritesUpdatedAt >= favoritesUpdatedAt
      ) {
        return;
      }
      const next = withDefaults({
        ...current,
        favoriteZikrIds: ids,
        favoriteZikrOrder: order,
        favoritesUpdatedAt,
      });
      await writeJSON(DB_KEYS.userPreferences, next);
    });
  },
};

export type PreferencesRepositoryType = typeof PreferencesRepository;
