import { getLocalDateString } from "@munib-tracker/shared/utils";
import { useEffect } from "react";
import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";
import type { KhatmPlan } from "@/lib/khatm";
import { khatmTotalForUnit } from "@/lib/khatm";
import {
  creditedAyahsForCycle,
  encodeAyahRanges,
  type KhatmPracticeCredited,
  khatmCycleKey,
  sanitizePracticeCredited,
} from "@/lib/khatm-practice-credit";

import { createStore, useStore } from "./create-store";

interface KhatmData {
  plan: KhatmPlan | null;
  ayahsRead: number;
  unit?: "ayah" | "page";
  /**
   * D72: ayahs practice already credited to this khatm cycle (additive, optional —
   * older clients ignore it). Reset by `start`, `setUnit` and `clear`.
   */
  practiceCredited?: KhatmPracticeCredited;
}

interface KhatmState extends KhatmData {
  isReady: boolean;
  load: () => Promise<void>;
  start: (days: number, unit?: "ayah" | "page") => Promise<void>;
  setAyahsRead: (ayahsRead: number) => Promise<void>;
  setUnit: (unit: "ayah" | "page") => Promise<void>;
  clear: () => Promise<void>;
  /**
   * D72: records `globalAyahs` as credited by practice in the current cycle and
   * moves progress forward by `units` (clamped) in one write. No-op without a plan.
   */
  creditPractice: (globalAyahs: readonly number[], units: number) => Promise<void>;
}

const STORAGE_KEY = DB_KEYS.khatm;

async function persist(data: KhatmData): Promise<void> {
  const { practiceCredited, ...rest } = data;
  await writeJSON(STORAGE_KEY, practiceCredited ? { ...rest, practiceCredited } : rest);
}

function currentUnit(s: Pick<KhatmData, "unit" | "plan">): "ayah" | "page" {
  return s.unit ?? s.plan?.unit ?? "ayah";
}

export const khatmStore = createStore<KhatmState>((set, get) => ({
  plan: null,
  ayahsRead: 0,
  unit: "ayah",
  practiceCredited: undefined,
  isReady: false,

  async load() {
    const data = await readJSON<KhatmData>(STORAGE_KEY, { plan: null, ayahsRead: 0, unit: "ayah" });
    set({
      plan: data.plan,
      ayahsRead: data.ayahsRead,
      unit: data.unit ?? data.plan?.unit ?? "ayah",
      practiceCredited: sanitizePracticeCredited(data.practiceCredited),
      isReady: true,
    });
  },

  async start(days, unit = "ayah") {
    const plan: KhatmPlan = { days, startDate: getLocalDateString(), unit };
    set({ plan, ayahsRead: 0, unit, practiceCredited: undefined });
    await persist({ plan, ayahsRead: 0, unit });
  },

  async setAyahsRead(ayahsRead) {
    const unit = currentUnit(get());
    const max = khatmTotalForUnit(unit);
    const clamped = Math.max(0, Math.min(max, Math.round(ayahsRead)));
    set({ ayahsRead: clamped });
    await persist({
      plan: get().plan,
      ayahsRead: clamped,
      unit,
      practiceCredited: get().practiceCredited,
    });
  },

  async setUnit(unit) {
    const plan = get().plan;
    const nextPlan = plan ? { ...plan, unit } : null;
    set({ unit, ayahsRead: 0, plan: nextPlan, practiceCredited: undefined });
    await persist({ plan: nextPlan, ayahsRead: 0, unit });
  },

  async clear() {
    set({ plan: null, ayahsRead: 0, unit: "ayah", practiceCredited: undefined });
    await persist({ plan: null, ayahsRead: 0, unit: "ayah" });
  },

  async creditPractice(globalAyahs, units) {
    const { plan, ayahsRead } = get();
    if (!plan) return;
    const unit = currentUnit(get());
    const cycle = khatmCycleKey(plan, unit);
    const credited = creditedAyahsForCycle(get().practiceCredited, cycle);
    for (const g of globalAyahs) credited.add(g);
    const practiceCredited = { cycle, ayahs: encodeAyahRanges(credited) };
    const max = khatmTotalForUnit(unit);
    const next = Math.max(0, Math.min(max, Math.round(ayahsRead + Math.max(0, units))));
    set({ ayahsRead: next, practiceCredited });
    await persist({ plan, ayahsRead: next, unit, practiceCredited });
  },
}));

/** D72: global ayahs practice already credited to the running khatm cycle (empty without a plan). */
export function khatmPracticeCreditedAyahs(
  s: Pick<KhatmData, "plan" | "unit" | "practiceCredited"> = khatmStore.getState(),
): Set<number> {
  if (!s.plan) return new Set();
  return creditedAyahsForCycle(s.practiceCredited, khatmCycleKey(s.plan, currentUnit(s)));
}

export function useEnsureKhatmLoaded(): void {
  useEffect(() => {
    if (!khatmStore.getState().isReady) void khatmStore.getState().load();
  }, []);
}

export function useKhatm(): {
  plan: KhatmPlan | null;
  ayahsRead: number;
  unit: "ayah" | "page";
} {
  return useStore(khatmStore, (s) => ({
    plan: s.plan,
    ayahsRead: s.ayahsRead,
    unit: s.unit ?? s.plan?.unit ?? "ayah",
  }));
}

const khatmActions = {
  load: () => khatmStore.getState().load(),
  start: (days: number, unit?: "ayah" | "page") => khatmStore.getState().start(days, unit),
  setAyahsRead: (n: number) => khatmStore.getState().setAyahsRead(n),
  setUnit: (unit: "ayah" | "page") => khatmStore.getState().setUnit(unit),
  clear: () => khatmStore.getState().clear(),
} as const;

export function useKhatmActions() {
  return khatmActions;
}
