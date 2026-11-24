import type {
  TajweedCoachingPlan,
  TajweedCoachingState,
  TajweedDrillHeadId,
  TajweedListenCategory,
} from "@munib-tracker/shared/types";
import { useEffect } from "react";

import { DB_KEYS } from "@/db/keys";
import { readJSON, withKeyLock, writeJSON } from "@/db/store";
import type { DrillVerdict } from "@/lib/quran-companion/pronunciation/judge";
import {
  EMPTY_TAJWEED_COACHING,
  recordDrillVerdict,
  recordListened,
  sanitizeTajweedCoaching,
} from "@/lib/tajweed-coaching/progress";

import { createStore, useStore } from "./create-store";

/**
 * NF-3.15 tajweed coaching — one blob under `DB_KEYS.tajweedCoaching`, synced
 * as blob entity `tajweed_coaching` with `mergeTajweedCoaching`. Drill counts,
 * spacing dates and the last plan only: no audio, no scores, no transcripts.
 * Transitions are the pure helpers in `lib/tajweed-coaching/progress.ts`.
 */
interface TajweedCoachingStoreState {
  data: TajweedCoachingState;
  isReady: boolean;
  load: () => Promise<void>;
  apply: (fn: (data: TajweedCoachingState) => TajweedCoachingState) => Promise<void>;
  recordDrill: (head: TajweedDrillHeadId, verdict: DrillVerdict) => Promise<void>;
  recordListen: (category: TajweedListenCategory) => Promise<void>;
  setPlan: (plan: TajweedCoachingPlan | null) => Promise<void>;
}

const KEY = DB_KEYS.tajweedCoaching;

export const tajweedCoachingStore = createStore<TajweedCoachingStoreState>((set, get) => ({
  data: EMPTY_TAJWEED_COACHING,
  isReady: false,

  async load() {
    const raw = await readJSON<unknown>(KEY, null);
    set({ data: sanitizeTajweedCoaching(raw), isReady: true });
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

  recordDrill: (head, verdict) =>
    get().apply((data) => recordDrillVerdict(data, head, verdict, new Date())),

  recordListen: (category) => get().apply((data) => recordListened(data, category, new Date())),

  setPlan: (plan) =>
    get().apply((data) => {
      if (!plan) {
        if (!data.plan) return data;
        const { plan: _drop, ...rest } = data;
        return rest;
      }
      return { ...data, plan };
    }),
}));

export function useEnsureTajweedCoachingLoaded(): void {
  useEffect(() => {
    if (!tajweedCoachingStore.getState().isReady) void tajweedCoachingStore.getState().load();
  }, []);
}

export function useTajweedCoaching(): TajweedCoachingState {
  return useStore(tajweedCoachingStore, (state) => state.data);
}

export function useTajweedCoachingReady(): boolean {
  return useStore(tajweedCoachingStore, (state) => state.isReady);
}
