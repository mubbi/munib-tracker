import { DB_KEYS } from "@/db/keys";

import {
  createFavoritesStore,
  useEnsureFavoritesLoaded,
  useFavoritesOrder,
} from "./create-favorites-store";

/** How many recently opened duas the hub remembers. */
export const DUA_RECENTS_LIMIT = 8;

/**
 * Recently opened duas (most recent first) for the hub's "Recently read" row.
 * Same ordered-id-list persistence as favorites, but device-local history:
 * never synced or included in backups.
 */
const api = createFavoritesStore(DB_KEYS.duaRecents, DB_KEYS.duaRecentsUpdatedAt);

export const duaRecentsStore = api.store;

/** Moves `id` to the front of the recents list (loading the list first if needed). */
export async function recordDuaRecent(id: string): Promise<void> {
  if (!api.store.getState().isReady) await api.actions.load();
  const current = api.store.getState().order;
  if (current[0] === id) return;
  const next = [id, ...current.filter((existing) => existing !== id)].slice(0, DUA_RECENTS_LIMIT);
  await api.actions.setOrder(next);
}

export function clearDuaRecents(): Promise<void> {
  return api.actions.setOrder([]);
}

export function useEnsureDuaRecentsLoaded(): void {
  useEnsureFavoritesLoaded(api);
}

export function useRecentDuaIds(): string[] {
  return useFavoritesOrder(api);
}
