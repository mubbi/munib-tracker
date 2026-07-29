import { HAJJ_CHECKLIST } from "@munib-tracker/shared/content/hajj-checklist";
import { UMRAH_CHECKLIST } from "@munib-tracker/shared/content/umrah-checklist";
import { useEffect } from "react";

import { DB_KEYS } from "@/db/keys";
import { KeyedCollection, removeKey } from "@/db/store";

import { createStore, useStore } from "./create-store";

/**
 * Hajj rite checklist progress (NF-2.3). Tracks completed Hajj rite ids only.
 * Umrah rites live in `umrah-checklist-store`. On every load, legacy mixed rows
 * are partitioned (umrah-* → umrah store; non-rite educational/prep keys dropped)
 * so backup restore and cloud pulls of pre-split data stay correct without a
 * sticky flag that would survive reset/wipe.
 */
interface CheckRow {
  id: string;
  completedAt: string;
}

const VALID_HAJJ_RITE_IDS = new Set(HAJJ_CHECKLIST.map((item) => item.id));
const VALID_UMRAH_RITE_IDS = new Set(UMRAH_CHECKLIST.map((item) => item.id));
/** Pre-content-driven migrate flag — cleared once if still present. */
const LEGACY_MIGRATION_FLAG = `${DB_KEYS.hajjChecklist}::migrated_v4`;

const collection = new KeyedCollection<CheckRow>(DB_KEYS.hajjChecklist);
const umrahCollection = new KeyedCollection<CheckRow>(DB_KEYS.umrahChecklist);

interface HajjChecklistState {
  done: Record<string, boolean>;
  isReady: boolean;
  load: () => Promise<void>;
  toggle: (id: string) => Promise<void>;
  reset: () => Promise<void>;
}

/** Partitions mixed Hajj/Umrah rows. Idempotent; safe after restore/sync. */
export async function migrateLegacyMixedChecklist(): Promise<void> {
  const hajjMap = await collection.getMap();
  const toMove: CheckRow[] = [];
  const toDrop: string[] = [];
  for (const [id, row] of Object.entries(hajjMap)) {
    if (id.startsWith("umrah-") && VALID_UMRAH_RITE_IDS.has(id)) {
      toMove.push(row);
    } else if (!VALID_HAJJ_RITE_IDS.has(id)) {
      toDrop.push(id);
    }
  }

  for (const row of toMove) {
    await umrahCollection.upsert(row.id, row);
  }
  if (toMove.length > 0 || toDrop.length > 0) {
    await collection.mutate((map) => {
      for (const row of toMove) delete map[row.id];
      for (const id of toDrop) delete map[id];
    });
  }

  // Drop the old sticky flag so it cannot survive reset/wipe and block a later
  // re-partition of restored/synced mixed data.
  await removeKey(LEGACY_MIGRATION_FLAG);
}

export const hajjChecklistStore = createStore<HajjChecklistState>((set, get) => ({
  done: {},
  isReady: false,

  async load() {
    await migrateLegacyMixedChecklist();
    const rows = await collection.getAll();
    const done: Record<string, boolean> = {};
    for (const row of rows) {
      if (VALID_HAJJ_RITE_IDS.has(row.id)) done[row.id] = true;
    }
    set({ done, isReady: true });
  },

  async toggle(id) {
    if (!VALID_HAJJ_RITE_IDS.has(id)) return;
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
      if (VALID_HAJJ_RITE_IDS.has(row.id)) await collection.remove(row.id);
    }
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
