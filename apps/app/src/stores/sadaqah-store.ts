import { getLocalDateString } from "@munib-tracker/shared/utils";
import { useEffect } from "react";

import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";

import { createStore, useStore } from "./create-store";

export type SadaqahPeriod = "daily" | "weekly";

export interface SadaqahGoal {
  period: SadaqahPeriod;
  /** Target amount in the chosen currency. */
  amount: number;
  currencyCode: string;
  startDate: string;
}

export interface SadaqahLogEntry {
  id: string;
  amount: number;
  at: string;
  note?: string;
}

interface SadaqahData {
  goal: SadaqahGoal | null;
  log: SadaqahLogEntry[];
}

interface SadaqahState extends SadaqahData {
  isReady: boolean;
  load: () => Promise<void>;
  setGoal: (goal: SadaqahGoal) => Promise<void>;
  clearGoal: () => Promise<void>;
  addEntry: (amount: number, note?: string) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
  clearLog: () => Promise<void>;
}

const STORAGE_KEY = DB_KEYS.sadaqahGoals;
const MAX_LOG = 200;

function isGoal(value: unknown): value is SadaqahGoal {
  if (value == null || typeof value !== "object") return false;
  const g = value as SadaqahGoal;
  return (
    (g.period === "daily" || g.period === "weekly") &&
    typeof g.amount === "number" &&
    typeof g.currencyCode === "string" &&
    typeof g.startDate === "string"
  );
}

function normalizeLog(value: unknown): SadaqahLogEntry[] {
  if (!Array.isArray(value)) return [];
  const out: SadaqahLogEntry[] = [];
  for (const entry of value) {
    if (entry == null || typeof entry !== "object") continue;
    const e = entry as SadaqahLogEntry;
    if (typeof e.id !== "string" || typeof e.amount !== "number" || typeof e.at !== "string") {
      continue;
    }
    out.push({
      id: e.id,
      amount: e.amount,
      at: e.at,
      note: typeof e.note === "string" ? e.note : undefined,
    });
  }
  return out.slice(0, MAX_LOG);
}

async function persist(data: SadaqahData): Promise<void> {
  await writeJSON(STORAGE_KEY, data);
}

export const sadaqahStore = createStore<SadaqahState>((set, get) => ({
  goal: null,
  log: [],
  isReady: false,

  async load() {
    const data = await readJSON<SadaqahData>(STORAGE_KEY, { goal: null, log: [] });
    set({
      goal: isGoal(data.goal) ? data.goal : null,
      log: normalizeLog(data.log),
      isReady: true,
    });
  },

  async setGoal(goal) {
    set({ goal });
    await persist({ goal, log: get().log });
  },

  async clearGoal() {
    set({ goal: null });
    await persist({ goal: null, log: get().log });
  },

  async addEntry(amount, note) {
    const entry: SadaqahLogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      amount: Math.max(0, amount),
      at: new Date().toISOString(),
      note: note?.trim() || undefined,
    };
    const log = [entry, ...get().log].slice(0, MAX_LOG);
    set({ log });
    await persist({ goal: get().goal, log });
  },

  async removeEntry(id) {
    const log = get().log.filter((e) => e.id !== id);
    set({ log });
    await persist({ goal: get().goal, log });
  },

  async clearLog() {
    set({ log: [] });
    await persist({ goal: get().goal, log: [] });
  },
}));

export function useEnsureSadaqahLoaded(): void {
  useEffect(() => {
    if (!sadaqahStore.getState().isReady) void sadaqahStore.getState().load();
  }, []);
}

export function useSadaqahGoal(): SadaqahGoal | null {
  return useStore(sadaqahStore, (s) => s.goal);
}

export function useSadaqahLog(): SadaqahLogEntry[] {
  return useStore(sadaqahStore, (s) => s.log);
}

export function useSadaqahReady(): boolean {
  return useStore(sadaqahStore, (s) => s.isReady);
}

const actions = {
  setGoal: (goal: SadaqahGoal) => sadaqahStore.getState().setGoal(goal),
  clearGoal: () => sadaqahStore.getState().clearGoal(),
  addEntry: (amount: number, note?: string) => sadaqahStore.getState().addEntry(amount, note),
  removeEntry: (id: string) => sadaqahStore.getState().removeEntry(id),
  clearLog: () => sadaqahStore.getState().clearLog(),
} as const;

export function useSadaqahActions() {
  return actions;
}

/** Sum of log entries that fall in the current daily or weekly window. */
export function sumSadaqahInPeriod(
  log: SadaqahLogEntry[],
  period: SadaqahPeriod,
  now = new Date(),
): number {
  const today = getLocalDateString(now);
  if (period === "daily") {
    return log
      .filter((e) => getLocalDateString(new Date(e.at)) === today)
      .reduce((sum, e) => sum + e.amount, 0);
  }
  // ISO week: Monday start — compare calendar week of local dates.
  const start = startOfLocalWeek(now);
  return log.filter((e) => new Date(e.at) >= start).reduce((sum, e) => sum + e.amount, 0);
}

function startOfLocalWeek(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = d.getDay(); // 0 Sun … 6 Sat
  const diff = day === 0 ? -6 : 1 - day; // Monday start
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}
