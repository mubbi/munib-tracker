import { useEffect } from "react";

import { QuranCompanionPrefsRepository } from "@/db/repositories/quran-companion-prefs-repository";
import { DEFAULT_COMPANION_PREFS } from "@/lib/quran-companion/prefs";
import type { QuranCompanionPrefs } from "@/lib/quran-companion/types";

import { createStore, useStore } from "./create-store";

/**
 * Qur'an practice prefs (§9.5). Lazy: loaded from the practice routes and the
 * settings screen only — never from `app-providers.tsx` (§19). Practice prefs
 * never change the reader's own settings.
 */
interface CompanionPrefsState {
  prefs: QuranCompanionPrefs;
  isReady: boolean;
  load: () => Promise<void>;
  update: (patch: Partial<QuranCompanionPrefs>) => Promise<void>;
  /** First launch only: copy the reader's translation/transliteration toggles. */
  seedReadingToggles: (showTranslation: boolean, showTransliteration: boolean) => Promise<void>;
}

export const quranCompanionPrefsStore = createStore<CompanionPrefsState>((set, get) => ({
  prefs: { ...DEFAULT_COMPANION_PREFS },
  isReady: false,

  async load() {
    const prefs = await QuranCompanionPrefsRepository.get();
    set({ prefs, isReady: true });
  },

  async update(patch) {
    set({ prefs: { ...get().prefs, ...patch } });
    const prefs = await QuranCompanionPrefsRepository.update(patch);
    set({ prefs });
  },

  async seedReadingToggles(showTranslation, showTransliteration) {
    if (get().prefs.readingTogglesSeeded) return;
    await get().update({ showTranslation, showTransliteration, readingTogglesSeeded: true });
  },
}));

export function useEnsureCompanionPrefsLoaded(): void {
  useEffect(() => {
    if (!quranCompanionPrefsStore.getState().isReady) {
      void quranCompanionPrefsStore.getState().load();
    }
  }, []);
}

export function useCompanionPrefs(): QuranCompanionPrefs {
  return useStore(quranCompanionPrefsStore, (s) => s.prefs);
}

export function useCompanionPrefsReady(): boolean {
  return useStore(quranCompanionPrefsStore, (s) => s.isReady);
}

const actions = {
  update: (patch: Partial<QuranCompanionPrefs>) =>
    quranCompanionPrefsStore.getState().update(patch),
  seedReadingToggles: (t: boolean, tr: boolean) =>
    quranCompanionPrefsStore.getState().seedReadingToggles(t, tr),
} as const;

export function useCompanionPrefsActions() {
  return actions;
}
