import { useEffect } from "react";

import { DB_KEYS } from "@/db/keys";
import { KeyedCollection } from "@/db/store";

import { createStore, useStore } from "./create-store";

/**
 * Hajj & Umrah checklist progress (NF-2.3) — a local set of completed rite ids.
 * One row per checked step, so toggling a rite is a single upsert/remove. The
 * rite content itself lives in `@munib-tracker/shared` (`HAJJ_GUIDE_SECTIONS`);
 * this store only tracks which steps the pilgrim has marked done.
 */
interface HajjCheckRow {
  id: string;
  completedAt: string;
}

const collection = new KeyedCollection<HajjCheckRow>(DB_KEYS.hajjChecklist);

interface HajjChecklistState {
  done: Record<string, boolean>;
  isReady: boolean;
  load: () => Promise<void>;
  toggle: (id: string) => Promise<void>;
  reset: () => Promise<void>;
}

export const hajjChecklistStore = createStore<HajjChecklistState>((set, get) => ({
  done: {},
  isReady: false,

  async load() {
    const rows = await collection.getAll();
    set({ done: Object.fromEntries(rows.map((row) => [row.id, true])), isReady: true });
  },

  async toggle(id) {
    const done = { ...get().done };
    if (done[id]) {
      await collection.remove(id);
      delete done[id];
    } else {
      await collection.upsert(id, { id, completedAt: new Date().toISOString() });
      done[id] = true;
    }
    set({ done });
  },

  async reset() {
    await collection.clear();
    set({ done: {} });
  },
}));

export function useEnsureHajjChecklistLoaded(): void {
  useEffect(() => {
    if (!hajjChecklistStore.getState().isReady) void hajjChecklistStore.getState().load();
  }, []);
}

export function useHajjChecklist(): Record<string, boolean> {
  return useStore(hajjChecklistStore, (s) => s.done);
}

const hajjChecklistActions = {
  load: () => hajjChecklistStore.getState().load(),
  toggle: (id: string) => hajjChecklistStore.getState().toggle(id),
  reset: () => hajjChecklistStore.getState().reset(),
} as const;

export function useHajjChecklistActions() {
  return hajjChecklistActions;
}
