import { useEffect } from "react";

import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";

import { createStore, useStore } from "./create-store";

/**
 * Standalone favorites store for duas. Mirrors the zikr-favorites approach
 * (ordered id list persisted to AsyncStorage) without touching the shared
 * `UserPreferences` schema — keeping the change additive and cross-platform
 * (AsyncStorage already ships on iOS/Android/Web, no native rebuild).
 */

const STORAGE_KEY = DB_KEYS.duaFavorites;

interface DuaFavoritesState {
  order: string[];
  isReady: boolean;
  load: () => Promise<void>;
  toggle: (id: string) => Promise<void>;
  setOrder: (order: string[]) => Promise<void>;
}

export const duaFavoritesStore = createStore<DuaFavoritesState>((set, get) => ({
  order: [],
  isReady: false,

  async load() {
    const order = await readJSON<string[]>(STORAGE_KEY, []);
    set({ order, isReady: true });
  },

  async toggle(id) {
    const current = get().order;
    const next = current.includes(id)
      ? current.filter((existing) => existing !== id)
      : [...current, id];
    set({ order: next });
    await writeJSON(STORAGE_KEY, next);
  },

  async setOrder(order) {
    set({ order });
    await writeJSON(STORAGE_KEY, order);
  },
}));

/**
 * Loads persisted dua favorites once on first mount. `app-providers` owns the
 * other stores' startup load; this store is self-contained, so any dua screen
 * calls this to hydrate it lazily (the load is idempotent).
 */
export function useEnsureDuaFavoritesLoaded(): void {
  useEffect(() => {
    if (!duaFavoritesStore.getState().isReady) {
      void duaFavoritesStore.getState().load();
    }
  }, []);
}

export function useFavoriteDuaIds(): string[] {
  return useStore(duaFavoritesStore, (s) => s.order);
}

export function useIsFavoriteDua(id: string): boolean {
  return useStore(duaFavoritesStore, (s) => s.order.includes(id));
}

// Stable singleton — actions never change reference, so no subscription needed.
const duaFavoritesActions = {
  load: (...args: Parameters<DuaFavoritesState["load"]>) =>
    duaFavoritesStore.getState().load(...args),
  toggle: (...args: Parameters<DuaFavoritesState["toggle"]>) =>
    duaFavoritesStore.getState().toggle(...args),
  setOrder: (...args: Parameters<DuaFavoritesState["setOrder"]>) =>
    duaFavoritesStore.getState().setOrder(...args),
} as const;

export function useDuaFavoritesActions() {
  return duaFavoritesActions;
}
