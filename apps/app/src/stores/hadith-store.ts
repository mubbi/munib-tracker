import { useEffect } from "react";

import { HadithRepository, initDatabase } from "@/db";
import { DEFAULT_HADITH_PREFS, type HadithPrefs } from "@/db/repositories/hadith-repository";

import { createStore, useStore } from "./create-store";

export interface HadithState {
  prefs: HadithPrefs;
  isReady: boolean;

  load: () => Promise<void>;
  updatePrefs: (patch: Partial<HadithPrefs>) => Promise<void>;
}

export const hadithStore = createStore<HadithState>((set) => ({
  prefs: DEFAULT_HADITH_PREFS,
  isReady: false,

  async load() {
    await initDatabase();
    const prefs = await HadithRepository.getPrefs();
    set({ prefs, isReady: true });
  },

  async updatePrefs(patch) {
    const prefs = await HadithRepository.updatePrefs(patch);
    set({ prefs });
  },
}));

export function useEnsureHadithLoaded(): void {
  useEffect(() => {
    if (!hadithStore.getState().isReady) {
      void hadithStore.getState().load();
    }
  }, []);
}

export function useHadithPrefs(): HadithPrefs {
  useEnsureHadithLoaded();
  return useStore(hadithStore, (s) => s.prefs);
}

const hadithActions = {
  load: (...args: Parameters<HadithState["load"]>) => hadithStore.getState().load(...args),
  updatePrefs: (...args: Parameters<HadithState["updatePrefs"]>) =>
    hadithStore.getState().updatePrefs(...args),
} as const;

export function useHadithActions() {
  return hadithActions;
}
