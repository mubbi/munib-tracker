import { getLocalDateString } from "@munib-tracker/shared/utils";
import { useEffect } from "react";
import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";
import type { KhatmPlan } from "@/lib/khatm";
import { QURAN_TOTAL_AYAHS } from "@/lib/khatm";

import { createStore, useStore } from "./create-store";

interface KhatmData {
  plan: KhatmPlan | null;
  ayahsRead: number;
}

interface KhatmState extends KhatmData {
  isReady: boolean;
  load: () => Promise<void>;
  start: (days: number) => Promise<void>;
  setAyahsRead: (ayahsRead: number) => Promise<void>;
  clear: () => Promise<void>;
}

const STORAGE_KEY = DB_KEYS.khatm;

async function persist(data: KhatmData): Promise<void> {
  await writeJSON(STORAGE_KEY, data);
}

export const khatmStore = createStore<KhatmState>((set, get) => ({
  plan: null,
  ayahsRead: 0,
  isReady: false,

  async load() {
    const data = await readJSON<KhatmData>(STORAGE_KEY, { plan: null, ayahsRead: 0 });
    set({ plan: data.plan, ayahsRead: data.ayahsRead, isReady: true });
  },

  async start(days) {
    const plan: KhatmPlan = { days, startDate: getLocalDateString() };
    set({ plan, ayahsRead: 0 });
    await persist({ plan, ayahsRead: 0 });
  },

  async setAyahsRead(ayahsRead) {
    const clamped = Math.max(0, Math.min(QURAN_TOTAL_AYAHS, Math.round(ayahsRead)));
    set({ ayahsRead: clamped });
    await persist({ plan: get().plan, ayahsRead: clamped });
  },

  async clear() {
    set({ plan: null, ayahsRead: 0 });
    await persist({ plan: null, ayahsRead: 0 });
  },
}));

export function useEnsureKhatmLoaded(): void {
  useEffect(() => {
    if (!khatmStore.getState().isReady) void khatmStore.getState().load();
  }, []);
}

export function useKhatm(): { plan: KhatmPlan | null; ayahsRead: number } {
  return useStore(khatmStore, (s) => ({ plan: s.plan, ayahsRead: s.ayahsRead }));
}

const khatmActions = {
  load: () => khatmStore.getState().load(),
  start: (days: number) => khatmStore.getState().start(days),
  setAyahsRead: (n: number) => khatmStore.getState().setAyahsRead(n),
  clear: () => khatmStore.getState().clear(),
} as const;

export function useKhatmActions() {
  return khatmActions;
}
