import { useEffect } from "react";

import { DB_KEYS } from "@/db/keys";
import { KeyedCollection } from "@/db/store";

import { createStore, useStore } from "./create-store";

/**
 * Friday / Jumu'ah checklist progress — date-scoped toggles
 * (`${itemId}::${YYYY-MM-DD}`). Content ids live in
 * `@munib-tracker/shared` (`FRIDAY_CHECKLIST`); this store only tracks which
 * items were marked done on which Friday. Synced as blob entity
 * `friday_checklist`.
 */
export interface FridayCheckRow {
  id: string;
  date: string;
  completedAt: string;
}

export function fridayCheckKey(itemId: string, date: string): string {
  return `${itemId}::${date}`;
}

const collection = new KeyedCollection<FridayCheckRow>(DB_KEYS.fridayChecklist);

interface FridayChecklistState {
  /** Composite key → true when completed. */
  done: Record<string, boolean>;
  isReady: boolean;
  load: () => Promise<void>;
  toggle: (itemId: string, date: string) => Promise<void>;
  resetDate: (date: string) => Promise<void>;
}

export const fridayChecklistStore = createStore<FridayChecklistState>((set, get) => ({
  done: {},
  isReady: false,

  async load() {
    const rows = await collection.getAll();
    set({
      done: Object.fromEntries(rows.map((row) => [fridayCheckKey(row.id, row.date), true])),
      isReady: true,
    });
  },

  async toggle(itemId, date) {
    const key = fridayCheckKey(itemId, date);
    const done = { ...get().done };
    if (done[key]) {
      await collection.remove(key);
      delete done[key];
    } else {
      await collection.upsert(key, {
        id: itemId,
        date,
        completedAt: new Date().toISOString(),
      });
      done[key] = true;
    }
    set({ done });
  },

  async resetDate(date) {
    const map = await collection.getMap();
    const next = { ...get().done };
    for (const [key, row] of Object.entries(map)) {
      if (row.date === date) {
        await collection.remove(key);
        delete next[key];
      }
    }
    set({ done: next });
  },
}));

export function useEnsureFridayChecklistLoaded(): void {
  useEffect(() => {
    if (!fridayChecklistStore.getState().isReady) void fridayChecklistStore.getState().load();
  }, []);
}

export function useFridayChecklist(): Record<string, boolean> {
  return useStore(fridayChecklistStore, (s) => s.done);
}

export function useFridayChecklistForDate(date: string): Record<string, boolean> {
  const done = useFridayChecklist();
  const forDate: Record<string, boolean> = {};
  const suffix = `::${date}`;
  for (const [key, value] of Object.entries(done)) {
    if (value && key.endsWith(suffix)) {
      const itemId = key.slice(0, -suffix.length);
      forDate[itemId] = true;
    }
  }
  return forDate;
}

const fridayChecklistActions = {
  load: () => fridayChecklistStore.getState().load(),
  toggle: (itemId: string, date: string) => fridayChecklistStore.getState().toggle(itemId, date),
  resetDate: (date: string) => fridayChecklistStore.getState().resetDate(date),
} as const;

export function useFridayChecklistActions() {
  return fridayChecklistActions;
}
