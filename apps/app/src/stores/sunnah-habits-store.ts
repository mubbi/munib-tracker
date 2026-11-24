import type { SunnahHabitsState } from "@munib-tracker/shared/types";
import { getLocalDateString } from "@munib-tracker/shared/utils";
import { useEffect } from "react";

import { DB_KEYS } from "@/db/keys";
import { readJSON, withKeyLock, writeJSON } from "@/db/store";
import {
  addCustomHabit,
  addHabit,
  EMPTY_SUNNAH_HABITS,
  markSpotlightSeen,
  moveHabit,
  pruneOldChecks,
  removeHabit,
  sanitizeSunnahHabits,
  setHabitTarget,
  setHabitValue,
  toggleHabit,
} from "@/lib/sunnah-habits";

import { createStore, useStore } from "./create-store";

/**
 * Daily Sunnah habits (NF-3.5) — one blob under `DB_KEYS.sunnahHabits`, synced
 * as blob entity `sunnah_habits` with `mergeSunnahHabits`. All transitions are
 * the pure helpers in `lib/sunnah-habits.ts`.
 */
interface SunnahHabitsStoreState {
  data: SunnahHabitsState;
  isReady: boolean;
  load: () => Promise<void>;
  apply: (fn: (data: SunnahHabitsState) => SunnahHabitsState) => Promise<void>;
}

const KEY = DB_KEYS.sunnahHabits;

export const sunnahHabitsStore = createStore<SunnahHabitsStoreState>((set, get) => ({
  data: EMPTY_SUNNAH_HABITS,
  isReady: false,

  async load() {
    const raw = await readJSON<unknown>(KEY, null);
    set({ data: sanitizeSunnahHabits(raw), isReady: true });
  },

  async apply(fn) {
    if (!get().isReady) await get().load();
    await withKeyLock(KEY, async () => {
      const current = get().data;
      const next = fn(current);
      if (next === current) return;
      set({ data: next });
      await writeJSON(KEY, next);
    });
  },
}));

export function useEnsureSunnahHabitsLoaded(): void {
  useEffect(() => {
    if (!sunnahHabitsStore.getState().isReady) void sunnahHabitsStore.getState().load();
  }, []);
}

export function useSunnahHabits(): SunnahHabitsState {
  return useStore(sunnahHabitsStore, (s) => s.data);
}

export function useSunnahHabitsReady(): boolean {
  return useStore(sunnahHabitsStore, (s) => s.isReady);
}

const apply = (fn: (data: SunnahHabitsState) => SunnahHabitsState) =>
  sunnahHabitsStore.getState().apply(fn);

const sunnahHabitsActions = {
  load: () => sunnahHabitsStore.getState().load(),
  add: (id: string) => apply((d) => addHabit(d, id)),
  remove: (id: string) => apply((d) => removeHabit(d, id)),
  move: (id: string, delta: -1 | 1) => apply((d) => moveHabit(d, id, delta)),
  addCustom: (title: string, target?: number) =>
    apply((d) =>
      addCustomHabit(d, {
        id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
        title,
        ...(target != null && { target }),
      }),
    ),
  setTarget: (id: string, target: number) => apply((d) => setHabitTarget(d, id, target)),
  toggle: (id: string, date: string) =>
    apply((d) => pruneOldChecks(toggleHabit(d, id, date), getLocalDateString())),
  setValue: (id: string, date: string, value: number) =>
    apply((d) => setHabitValue(d, id, date, value)),
  markSpotlightSeen: (id: string, date: string) => apply((d) => markSpotlightSeen(d, id, date)),
} as const;

export function useSunnahHabitsActions() {
  return sunnahHabitsActions;
}
