import { UMRAH_CHECKLIST } from "@munib-tracker/shared/content/umrah-checklist";
import { useEffect } from "react";

import { DB_KEYS } from "@/db/keys";
import { KeyedCollection } from "@/db/store";

import { createStore, useStore } from "./create-store";

/** Umrah rite checklist progress (NF-2.3) — separate from Hajj rites. */
interface CheckRow {
  id: string;
  completedAt: string;
}

const VALID_UMRAH_RITE_IDS = new Set(UMRAH_CHECKLIST.map((item) => item.id));
const collection = new KeyedCollection<CheckRow>(DB_KEYS.umrahChecklist);

interface UmrahChecklistState {
  done: Record<string, boolean>;
  isReady: boolean;
  load: () => Promise<void>;
  toggle: (id: string) => Promise<void>;
  reset: () => Promise<void>;
}

export const umrahChecklistStore = createStore<UmrahChecklistState>((set, get) => ({
  done: {},
  isReady: false,

  async load() {
    // Run Hajj migration first so umrah-* rows moved from the legacy mixed blob
    // are visible before we snapshot the Umrah collection.
    const { hajjChecklistStore } = await import("./hajj-checklist-store");
    if (!hajjChecklistStore.getState().isReady) {
      await hajjChecklistStore.getState().load();
    }
    const rows = await collection.getAll();
    const done: Record<string, boolean> = {};
    for (const row of rows) {
      if (VALID_UMRAH_RITE_IDS.has(row.id)) done[row.id] = true;
    }
    set({ done, isReady: true });
  },

  async toggle(id) {
    if (!VALID_UMRAH_RITE_IDS.has(id)) return;
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
    const rows = await collection.getAll();
    for (const row of rows) {
      if (VALID_UMRAH_RITE_IDS.has(row.id)) await collection.remove(row.id);
    }
    set({ done: {} });
  },
}));

export function useEnsureUmrahChecklistLoaded(): void {
  useEffect(() => {
    if (!umrahChecklistStore.getState().isReady) void umrahChecklistStore.getState().load();
  }, []);
}

export function useUmrahChecklist(): Record<string, boolean> {
  return useStore(umrahChecklistStore, (s) => s.done);
}

const umrahChecklistActions = {
  load: () => umrahChecklistStore.getState().load(),
  toggle: (id: string) => umrahChecklistStore.getState().toggle(id),
  reset: () => umrahChecklistStore.getState().reset(),
} as const;

export function useUmrahChecklistActions() {
  return umrahChecklistActions;
}
