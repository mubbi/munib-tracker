import { initDatabase } from "@/db";
import { ContinueRepository } from "@/db/repositories/continue-repository";
import type { ContinueActivity, ContinueActivityInput } from "@/lib/continue-activity";

import { createStore, useStore } from "./create-store";

interface ContinueState {
  activity: ContinueActivity | null;
  isReady: boolean;
  load: () => Promise<void>;
  record: (input: ContinueActivityInput) => Promise<void>;
  clear: () => Promise<void>;
}

export const continueStore = createStore<ContinueState>((set) => ({
  activity: null,
  isReady: false,

  async load() {
    await initDatabase();
    const activity = await ContinueRepository.get();
    set({ activity, isReady: true });
  },

  async record(input) {
    const activity = await ContinueRepository.set(input);
    set({ activity, isReady: true });
  },

  async clear() {
    await ContinueRepository.clear();
    set({ activity: null });
  },
}));

export function useContinueActivity(): ContinueActivity | null {
  return useStore(continueStore, (s) => s.activity);
}

/** Fire-and-forget helper for recording outside React components. */
export function recordContinueActivity(input: ContinueActivityInput): void {
  void continueStore.getState().record(input);
}
