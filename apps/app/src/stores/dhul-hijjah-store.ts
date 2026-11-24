import type {
  DhulHijjahState,
  DhulHijjahStore,
  ObligatoryPrayer,
  UdhiyahPlan,
} from "@munib-tracker/shared/types";
import { useEffect } from "react";

import { DB_KEYS } from "@/db/keys";
import { readJSON, withKeyLock, writeJSON } from "@/db/store";
import {
  emptyYearState,
  sanitizeDhulHijjahStore,
  setIntendsUdhiyah,
  setUdhiyahPlan,
  toggleDailyCheck,
  toggleTashriq,
} from "@/lib/dhul-hijjah";

import { createStore, useStore } from "./create-store";

/**
 * Dhul-Hijjah mode (NF-3.3) — per-Hijri-year state under `DB_KEYS.dhulHijjah`,
 * synced as blob entity `dhul_hijjah` with `mergeDhulHijjah` (union maps, LWW
 * planner). Pure transitions live in `lib/dhul-hijjah.ts`.
 */
interface DhulHijjahStoreState {
  years: DhulHijjahStore;
  isReady: boolean;
  load: () => Promise<void>;
  applyYear: (year: number, fn: (state: DhulHijjahState) => DhulHijjahState) => Promise<void>;
}

const KEY = DB_KEYS.dhulHijjah;

export const dhulHijjahStore = createStore<DhulHijjahStoreState>((set, get) => ({
  years: {},
  isReady: false,

  async load() {
    const raw = await readJSON<unknown>(KEY, null);
    set({ years: sanitizeDhulHijjahStore(raw), isReady: true });
  },

  async applyYear(year, fn) {
    if (!get().isReady) await get().load();
    await withKeyLock(KEY, async () => {
      const current = get().years[String(year)] ?? emptyYearState(year);
      const next = fn(current);
      if (next === current) return;
      const years = { ...get().years, [String(year)]: next };
      set({ years });
      await writeJSON(KEY, years);
    });
  },
}));

export function useEnsureDhulHijjahLoaded(): void {
  useEffect(() => {
    if (!dhulHijjahStore.getState().isReady) void dhulHijjahStore.getState().load();
  }, []);
}

export function useDhulHijjahYear(year: number): DhulHijjahState | undefined {
  return useStore(dhulHijjahStore, (s) => s.years[String(year)]);
}

export function useDhulHijjahReady(): boolean {
  return useStore(dhulHijjahStore, (s) => s.isReady);
}

const applyYear = (year: number, fn: (state: DhulHijjahState) => DhulHijjahState) =>
  dhulHijjahStore.getState().applyYear(year, fn);

const dhulHijjahActions = {
  load: () => dhulHijjahStore.getState().load(),
  toggleDaily: (year: number, itemId: string, date: string) =>
    applyYear(year, (s) => toggleDailyCheck(s, itemId, date)),
  toggleTashriq: (year: number, date: string, prayer: ObligatoryPrayer) =>
    applyYear(year, (s) => toggleTashriq(s, date, prayer)),
  setIntendsUdhiyah: (year: number, intends: boolean) =>
    applyYear(year, (s) => setIntendsUdhiyah(s, intends)),
  setUdhiyahPlan: (year: number, plan: UdhiyahPlan | null) =>
    applyYear(year, (s) => setUdhiyahPlan(s, plan)),
} as const;

export function useDhulHijjahActions() {
  return dhulHijjahActions;
}
