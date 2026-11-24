import { useEffect } from "react";

import { QuranPracticeRepository } from "@/db/repositories/quran-practice-repository";
import type { DueItem } from "@/lib/quran-companion/due-queue";
import { EMPTY_HISTORY } from "@/lib/quran-companion/merge";
import type { PracticeHistory, PracticeSummary } from "@/lib/quran-companion/types";

import { createStore, useStore } from "./create-store";
import { recordPracticeReading } from "./quran-reading-log-store";

/**
 * Practice history (§10) plus two in-memory pieces the routes share:
 * - `lastSummary`: the just-finished session for `/quran/practice/summary`
 *   (a cold open of the summary with nothing here redirects to the hub);
 * - `sitting`: the current revision sitting (§9.4), held here and not in the URL.
 */
export type RevisionSitting = {
  items: DueItem[];
  index: number;
  /** Rows left for other days after today's cap. */
  remaining: number;
};

interface PracticeState {
  history: PracticeHistory;
  isReady: boolean;
  lastSummary: PracticeSummary | null;
  sitting: RevisionSitting | null;
  load: () => Promise<void>;
  addSummary: (summary: PracticeSummary) => Promise<void>;
  clearHistory: () => Promise<void>;
  setLastSummary: (summary: PracticeSummary | null) => void;
  startSitting: (sitting: RevisionSitting | null) => void;
  advanceSitting: () => DueItem | null;
}

export const quranPracticeStore = createStore<PracticeState>((set, get) => ({
  history: EMPTY_HISTORY,
  isReady: false,
  lastSummary: null,
  sitting: null,

  async load() {
    const history = await QuranPracticeRepository.get();
    set({ history, isReady: true });
  },

  async addSummary(summary) {
    set({ lastSummary: summary });
    const history = await QuranPracticeRepository.add(summary);
    set({ history });
    // D40: a practice session is a reading day in the daily Qur'an reading log.
    void recordPracticeReading(summary);
  },

  async clearHistory() {
    const history = await QuranPracticeRepository.clear();
    set({ history });
  },

  setLastSummary(summary) {
    set({ lastSummary: summary });
  },

  startSitting(sitting) {
    set({ sitting });
  },

  advanceSitting() {
    const sitting = get().sitting;
    if (!sitting) return null;
    const index = sitting.index + 1;
    if (index >= sitting.items.length) {
      set({ sitting: { ...sitting, index } });
      return null;
    }
    set({ sitting: { ...sitting, index } });
    return sitting.items[index] ?? null;
  },
}));

export function useEnsurePracticeLoaded(): void {
  useEffect(() => {
    if (!quranPracticeStore.getState().isReady) void quranPracticeStore.getState().load();
  }, []);
}

export function usePracticeHistory(): PracticeHistory {
  return useStore(quranPracticeStore, (s) => s.history);
}

export function useLastPracticeSummary(): PracticeSummary | null {
  return useStore(quranPracticeStore, (s) => s.lastSummary);
}

export function useRevisionSitting(): RevisionSitting | null {
  return useStore(quranPracticeStore, (s) => s.sitting);
}
