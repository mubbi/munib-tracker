/**
 * NF-3.17 "My daily goal" — private, per partner circle, on this device only.
 * Never sent to the API or to partners (only `goal_done` for a date is shared).
 * `DB_KEYS.partnerGoals` is `userData`: included in backups and wiped on reset.
 */
import { useEffect } from "react";

import { DB_KEYS } from "@/db/keys";
import { readJSON, updateJSON } from "@/db/store";
import { createStore, useStore } from "@/stores/create-store";

import {
  type PartnerGoal,
  type PartnerGoalMap,
  sanitizePartnerGoal,
  sanitizePartnerGoalMap,
} from "./partner";

type PartnerGoalState = {
  goals: PartnerGoalMap;
  isReady: boolean;
  load: () => Promise<void>;
  setGoal: (circleId: string, goal: PartnerGoal | null) => Promise<void>;
};

export const partnerGoalStore = createStore<PartnerGoalState>((set) => ({
  goals: {},
  isReady: false,
  async load() {
    const raw = await readJSON<unknown>(DB_KEYS.partnerGoals, {});
    set({ goals: sanitizePartnerGoalMap(raw), isReady: true });
  },
  async setGoal(circleId, goal) {
    const clean = goal ? sanitizePartnerGoal(goal) : null;
    const next = await updateJSON<PartnerGoalMap>(DB_KEYS.partnerGoals, {}, (current) => {
      const copy = { ...sanitizePartnerGoalMap(current) };
      if (clean) copy[circleId] = clean;
      else delete copy[circleId];
      return copy;
    });
    set({ goals: sanitizePartnerGoalMap(next), isReady: true });
  },
}));

export function useEnsurePartnerGoalsLoaded(): boolean {
  const isReady = useStore(partnerGoalStore, (s) => s.isReady);
  useEffect(() => {
    if (!isReady) void partnerGoalStore.getState().load();
  }, [isReady]);
  return isReady;
}

export function usePartnerGoal(circleId: string | undefined): PartnerGoal | null {
  return useStore(partnerGoalStore, (s) => (circleId ? (s.goals[circleId] ?? null) : null));
}

export function setPartnerGoal(circleId: string, goal: PartnerGoal | null): Promise<void> {
  return partnerGoalStore.getState().setGoal(circleId, goal);
}
