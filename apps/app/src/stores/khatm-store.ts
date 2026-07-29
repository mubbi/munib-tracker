import { getLocalDateString } from "@munib-tracker/shared/utils";
import { useEffect } from "react";
import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";
import type { KhatmPlan } from "@/lib/khatm";
import { khatmTotalForUnit } from "@/lib/khatm";

import { createStore, useStore } from "./create-store";

interface KhatmData {
  plan: KhatmPlan | null;
  ayahsRead: number;
  unit?: "ayah" | "page";
}

interface KhatmState extends KhatmData {
  isReady: boolean;
  load: () => Promise<void>;
  start: (days: number, unit?: "ayah" | "page") => Promise<void>;
  setAyahsRead: (ayahsRead: number) => Promise<void>;
  setUnit: (unit: "ayah" | "page") => Promise<void>;
  clear: () => Promise<void>;
}

const STORAGE_KEY = DB_KEYS.khatm;

async function persist(data: KhatmData): Promise<void> {
  await writeJSON(STORAGE_KEY, data);
}

export const khatmStore = createStore<KhatmState>((set, get) => ({
  plan: null,
  ayahsRead: 0,
  unit: "ayah",
  isReady: false,

  async load() {
    const data = await readJSON<KhatmData>(STORAGE_KEY, { plan: null, ayahsRead: 0, unit: "ayah" });
    set({
      plan: data.plan,
      ayahsRead: data.ayahsRead,
      unit: data.unit ?? data.plan?.unit ?? "ayah",
      isReady: true,
    });
  },

  async start(days, unit = "ayah") {
    const plan: KhatmPlan = { days, startDate: getLocalDateString(), unit };
    set({ plan, ayahsRead: 0, unit });
    await persist({ plan, ayahsRead: 0, unit });
  },

  async setAyahsRead(ayahsRead) {
    const unit = get().unit ?? get().plan?.unit ?? "ayah";
    const max = khatmTotalForUnit(unit);
    const clamped = Math.max(0, Math.min(max, Math.round(ayahsRead)));
    set({ ayahsRead: clamped });
    await persist({ plan: get().plan, ayahsRead: clamped, unit });
  },

  async setUnit(unit) {
    const plan = get().plan;
    const nextPlan = plan ? { ...plan, unit } : null;
    set({ unit, ayahsRead: 0, plan: nextPlan });
    await persist({ plan: nextPlan, ayahsRead: 0, unit });
  },

  async clear() {
    set({ plan: null, ayahsRead: 0, unit: "ayah" });
    await persist({ plan: null, ayahsRead: 0, unit: "ayah" });
  },
}));

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
