import { useEffect } from "react";

import { DB_KEYS } from "@/db/keys";
import { KeyedCollection } from "@/db/store";
import { migrateLegacyWhiteDaysChecklist } from "@/lib/white-days-migration";

import { createStore, useStore } from "./create-store";
import { voluntaryFastingStore } from "./voluntary-fasting-store";

/**
 * LEGACY (kept readable, local only). The tracker's White Days checklist
 * now reads and writes the voluntary-fasting log (NF-3.2, one record of a
 * fast); `load()` folds these rows into it via `migrateLegacyWhiteDaysChecklist`.
 * The UI no longer writes here.
 *
 * White Days (Ayyām al-Bīḍ) fasting checklist progress — month-scoped toggles
 * (`${itemId}::${hijriYear}-${hijriMonth}`). Unlike the Friday checklist (which
 * is scoped to a single Gregorian day), the White Days span the 13th–15th of a
 * Hijri month, so all three rows share one month bucket. Content ids live in
 * `@munib-tracker/shared` (`WHITE_DAYS_CHECKLIST`); this store only tracks which
 * days were marked fasted in which Hijri month. No longer synced: the
 * `white_days_checklist` sync entity is retired (the API ignores it).
 */
export interface WhiteDaysCheckRow {
  id: string;
  /** Hijri month key, e.g. "1448-2". */
  monthKey: string;
  completedAt: string;
}

export function whiteDaysCheckKey(itemId: string, monthKey: string): string {
  return `${itemId}::${monthKey}`;
}

const collection = new KeyedCollection<WhiteDaysCheckRow>(DB_KEYS.whiteDaysChecklist);

interface WhiteDaysChecklistState {
  /** Composite key → true when completed. */
  done: Record<string, boolean>;
  isReady: boolean;
  load: () => Promise<void>;
  toggle: (itemId: string, monthKey: string) => Promise<void>;
  resetMonth: (monthKey: string) => Promise<void>;
}

export const whiteDaysChecklistStore = createStore<WhiteDaysChecklistState>((set, get) => ({
  done: {},
  isReady: false,

  async load() {
    const rows = await collection.getAll();
    set({
      done: Object.fromEntries(rows.map((row) => [whiteDaysCheckKey(row.id, row.monthKey), true])),
      isReady: true,
    });
    // Rows synced from a device on the previous release → fold into the fasting log.
    const added = await migrateLegacyWhiteDaysChecklist();
    if (added > 0 && voluntaryFastingStore.getState().isReady) {
      await voluntaryFastingStore.getState().load();
    }
  },

  async toggle(itemId, monthKey) {
    const key = whiteDaysCheckKey(itemId, monthKey);
    const done = { ...get().done };
    if (done[key]) {
      await collection.remove(key);
      delete done[key];
    } else {
      await collection.upsert(key, {
        id: itemId,
        monthKey,
        completedAt: new Date().toISOString(),
      });
      done[key] = true;
    }
    set({ done });
  },

  async resetMonth(monthKey) {
    const map = await collection.getMap();
    const next = { ...get().done };
    for (const [key, row] of Object.entries(map)) {
      if (row.monthKey === monthKey) {
        await collection.remove(key);
        delete next[key];
      }
    }
    set({ done: next });
  },
}));

export function useEnsureWhiteDaysChecklistLoaded(): void {
  useEffect(() => {
    if (!whiteDaysChecklistStore.getState().isReady) {
      void whiteDaysChecklistStore.getState().load();
    }
  }, []);
}

export function useWhiteDaysChecklist(): Record<string, boolean> {
  return useStore(whiteDaysChecklistStore, (s) => s.done);
}

export function useWhiteDaysChecklistForMonth(monthKey: string): Record<string, boolean> {
  const done = useWhiteDaysChecklist();
  const forMonth: Record<string, boolean> = {};
  const suffix = `::${monthKey}`;
  for (const [key, value] of Object.entries(done)) {
    if (value && key.endsWith(suffix)) {
      const itemId = key.slice(0, -suffix.length);
      forMonth[itemId] = true;
    }
  }
  return forMonth;
}

const whiteDaysChecklistActions = {
  load: () => whiteDaysChecklistStore.getState().load(),
  toggle: (itemId: string, monthKey: string) =>
    whiteDaysChecklistStore.getState().toggle(itemId, monthKey),
  resetMonth: (monthKey: string) => whiteDaysChecklistStore.getState().resetMonth(monthKey),
} as const;

export function useWhiteDaysChecklistActions() {
  return whiteDaysChecklistActions;
}
