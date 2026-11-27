import type { CoachHistory } from "@munib-tracker/shared/types";
import { emptyCoachHistory, sanitizeCoachHistory } from "@munib-tracker/shared/utils";
import { useEffect } from "react";

import { DB_KEYS } from "@/db/keys";
import { readJSON, withKeyLock, writeJSON } from "@/db/store";

import { createStore, useStore } from "./create-store";

/**
 * NF-3.14 coach history — one blob under `DB_KEYS.coachHistory`, synced as blob
 * entity `coach_history` with `mergeCoachHistory`. Holds shown rule ids,
 * accepted micro-goals + outcomes and dismiss / snooze choices — never raw data.
 * Transitions are the pure helpers in `@munib-tracker/shared/utils` (coach).
 */
interface CoachHistoryState {
  data: CoachHistory;
  isReady: boolean;
  load: () => Promise<void>;
  apply: (fn: (data: CoachHistory) => CoachHistory) => Promise<void>;
}

const KEY = DB_KEYS.coachHistory;

export const coachHistoryStore = createStore<CoachHistoryState>((set, get) => ({
  data: emptyCoachHistory(),
  isReady: false,

  async load() {
    const raw = await readJSON<unknown>(KEY, null);
    set({ data: sanitizeCoachHistory(raw), isReady: true });
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

export function useEnsureCoachHistoryLoaded(): void {
  useEffect(() => {
    if (!coachHistoryStore.getState().isReady) void coachHistoryStore.getState().load();
  }, []);
}

export function useCoachHistory(): CoachHistory {
  return useStore(coachHistoryStore, (state) => state.data);
}

export function useCoachHistoryReady(): boolean {
  return useStore(coachHistoryStore, (state) => state.isReady);
}
