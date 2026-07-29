import { useEffect } from "react";

import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";

import { createStore, useStore } from "./create-store";

/**
 * Ramadan fasting log (NF-1.1): a map of ISO date → fasting status. Kept
 * standalone (like the dua-favorites store) so it stays additive and
 * cross-platform without touching the shared preferences schema.
 */
export type FastStatus = "fasted" | "missed" | "exempt";

type FastingMap = Record<string, FastStatus>;

const STORAGE_KEY = DB_KEYS.fasting;

interface FastingState {
  days: FastingMap;
  isReady: boolean;
  load: () => Promise<void>;
  /** Cycles a day fasted → missed → exempt → cleared, or sets it explicitly. */
  setStatus: (date: string, status: FastStatus | null) => Promise<void>;
}

export const fastingStore = createStore<FastingState>((set, get) => ({
  days: {},
  isReady: false,

  async load() {
    const days = await readJSON<FastingMap>(STORAGE_KEY, {});
    set({ days, isReady: true });
  },

  async setStatus(date, status) {
    const next = { ...get().days };
    if (status == null) delete next[date];
    else next[date] = status;
    set({ days: next });
    await writeJSON(STORAGE_KEY, next);
  },
}));

export function useEnsureFastingLoaded(): void {
  useEffect(() => {
    if (!fastingStore.getState().isReady) void fastingStore.getState().load();
  }, []);
}

export function useFastingDays(): FastingMap {
  return useStore(fastingStore, (s) => s.days);
}

export function useFastStatus(date: string): FastStatus | undefined {
  return useStore(fastingStore, (s) => s.days[date]);
}

/** Count of days with a given status within an inclusive [from, to] date range. */
export function countFastsInRange(
  days: FastingMap,
  from: string,
  to: string,
  status: FastStatus,
): number {
  let count = 0;
  for (const [date, value] of Object.entries(days)) {
    if (value === status && date >= from && date <= to) count += 1;
  }
  return count;
}

const fastingActions = {
  load: () => fastingStore.getState().load(),
  setStatus: (date: string, status: FastStatus | null) =>
    fastingStore.getState().setStatus(date, status),
} as const;

export function useFastingActions() {
  return fastingActions;
}
