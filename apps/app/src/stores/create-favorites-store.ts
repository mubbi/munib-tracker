import { useEffect } from "react";

import { readJSON, writeJSON } from "@/db/store";

import { createStore, type Store, useStore } from "./create-store";

/**
 * Standalone favorites store: an ordered id list persisted to its own
 * AsyncStorage key, plus a sibling `updatedAt` watermark so the whole list can
 * sync as a single last-write-wins blob record (mirrors the zikr `favorites`
 * entity). Shared by dua, durood, and 99-names favorites — one implementation,
 * three stores.
 */
export interface FavoritesBlob {
  order: string[];
  updatedAt?: string;
}

interface FavoritesState {
  order: string[];
  updatedAt?: string;
  isReady: boolean;
  load: () => Promise<void>;
  toggle: (id: string) => Promise<void>;
  setOrder: (order: string[]) => Promise<void>;
}

interface FavoritesActions {
  load: () => Promise<void>;
  toggle: (id: string) => Promise<void>;
  setOrder: (order: string[]) => Promise<void>;
}

export interface FavoritesStoreApi {
  store: Store<FavoritesState>;
  /** Reads the persisted blob directly (used by the sync snapshot builder). */
  readBlob: () => Promise<FavoritesBlob>;
  /** Applies a pulled blob with last-write-wins on `updatedAt`. */
  applyRemote: (order: string[], updatedAt?: string) => Promise<void>;
  useEnsureLoaded: () => void;
  useFavoriteIds: () => string[];
  useIsFavorite: (id: string) => boolean;
  useActions: () => FavoritesActions;
}

export function createFavoritesStore(storageKey: string, updatedAtKey: string): FavoritesStoreApi {
  async function readBlob(): Promise<FavoritesBlob> {
    const [order, updatedAt] = await Promise.all([
      readJSON<string[]>(storageKey, []),
      readJSON<string | undefined>(updatedAtKey, undefined),
    ]);
    return { order, updatedAt };
  }

  const store = createStore<FavoritesState>((set, get) => ({
    order: [],
    updatedAt: undefined,
    isReady: false,

    async load() {
      const { order, updatedAt } = await readBlob();
      set({ order, updatedAt, isReady: true });
    },

    async toggle(id) {
      const current = get().order;
      const next = current.includes(id)
        ? current.filter((existing) => existing !== id)
        : [...current, id];
      const updatedAt = new Date().toISOString();
      set({ order: next, updatedAt });
      await Promise.all([writeJSON(storageKey, next), writeJSON(updatedAtKey, updatedAt)]);
    },

    async setOrder(order) {
      const updatedAt = new Date().toISOString();
      set({ order, updatedAt });
      await Promise.all([writeJSON(storageKey, order), writeJSON(updatedAtKey, updatedAt)]);
    },
  }));

  async function applyRemote(order: string[], updatedAt?: string): Promise<void> {
    const localUpdatedAt = await readJSON<string | undefined>(updatedAtKey, undefined);
    if (localUpdatedAt && updatedAt && localUpdatedAt >= updatedAt) return;
    await writeJSON(storageKey, order);
    if (updatedAt) await writeJSON(updatedAtKey, updatedAt);
    if (store.getState().isReady) store.setState({ order, updatedAt });
  }

  // Stable singleton — actions never change reference, so no subscription needed.
  const actions: FavoritesActions = {
    load: () => store.getState().load(),
    toggle: (id) => store.getState().toggle(id),
    setOrder: (order) => store.getState().setOrder(order),
  };

  function useEnsureLoaded(): void {
    useEffect(() => {
      if (!store.getState().isReady) void store.getState().load();
    }, []);
  }

  function useFavoriteIds(): string[] {
    return useStore(store, (s) => s.order);
  }

  function useIsFavorite(id: string): boolean {
    return useStore(store, (s) => s.order.includes(id));
  }

  function useActions(): FavoritesActions {
    return actions;
  }

  return {
    store,
    readBlob,
    applyRemote,
    useEnsureLoaded,
    useFavoriteIds,
    useIsFavorite,
    useActions,
  };
}
