import { useEffect } from "react";

import { QuranPracticeRepository } from "@/db/repositories/quran-practice-repository";
import { RecitationTotalsRepository } from "@/db/repositories/recitation-totals-repository";
import type { DueItem } from "@/lib/quran-companion/due-queue";
import { EMPTY_HISTORY } from "@/lib/quran-companion/merge";
import { planReadingCredit, type ReadingCreditResult } from "@/lib/quran-companion/reading-credit";
import { applyReadingCredit } from "@/lib/quran-companion/reading-credit-apply";
import type { PracticeHistory, PracticeSummary } from "@/lib/quran-companion/types";

import { createStore, useStore } from "./create-store";
import { quranCompanionPrefsStore } from "./quran-companion-prefs-store";

/**
 * Practice history (§10) plus in-memory pieces the routes share:
 * - `lastSummary`: the just-finished session for `/quran/practice/summary`
 *   (a cold open of the summary with nothing here redirects to the hub);
 * - `lastCredit`: what that session added to the reading log / khatm (D68);
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
  lastCredit: ReadingCreditResult | null;
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
  lastCredit: null,
  sitting: null,

  async load() {
    const history = await QuranPracticeRepository.get();
    set({ history, isReady: true });
  },

  async addSummary(summary) {
    set({ lastSummary: summary, lastCredit: null });
    // D68: credit the reading log + personal khatm once per session id. The
    // in-memory map covers a double save racing the history write; the
    // persisted history covers everything else (re-open, reload).
    const firstSave = !creditedSessions.has(summary.id);
    if (firstSave) creditedSessions.set(summary.id, undefined);
    const before = await readHistory();
    const existing = before.items.find((item) => item?.id === summary.id);
    const plan = firstSave && !existing ? await planCredit(summary, before) : null;
    if (plan?.ayahs.length) creditedSessions.set(summary.id, plan.ayahs);
    // A repeat save keeps what the first one logged (later sessions dedupe on it).
    const loggedAyahs = plan
      ? plan.ayahs
      : (creditedSessions.get(summary.id) ?? existing?.loggedAyahs);
    const stored = loggedAyahs?.length ? { ...summary, loggedAyahs } : summary;
    const history = await QuranPracticeRepository.add(stored);
    set({ history });
    await creditRecitation([stored, ...history.items]);
    if (!plan) return;
    const credit = await applyReadingCredit(plan);
    if (get().lastSummary?.id === summary.id) set({ lastCredit: credit });
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

/** Session ids saved in this app run → the ayahs their first save logged. */
const creditedSessions = new Map<string, number[] | undefined>();

async function readHistory(): Promise<PracticeHistory> {
  try {
    return await QuranPracticeRepository.get();
  } catch {
    return EMPTY_HISTORY;
  }
}

/**
 * D71: adds the session to the lifetime Recitation totals — once per id, so a
 * repeat save adds nothing. Crediting the whole history too seeds the totals on
 * the first save after an upgrade (or of sessions synced from another device).
 */
async function creditRecitation(summaries: PracticeSummary[]): Promise<void> {
  try {
    await RecitationTotalsRepository.credit(summaries);
  } catch (error) {
    if (__DEV__) console.warn("Failed to credit recitation totals", error);
  }
}

async function planCredit(summary: PracticeSummary, history: PracticeHistory) {
  try {
    const prefsStore = quranCompanionPrefsStore.getState();
    if (!prefsStore.isReady) await prefsStore.load();
    const enabled = quranCompanionPrefsStore.getState().prefs.logToReadingLog !== false;
    return planReadingCredit({ summary, history, enabled });
  } catch {
    return null;
  }
}

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

/** D68: the reading credit of `summaryId` (the summary on screen), or `null`. */
export function useLastPracticeCredit(summaryId: string | undefined): ReadingCreditResult | null {
  return useStore(quranPracticeStore, (s) =>
    summaryId != null && s.lastCredit?.sessionId === summaryId ? s.lastCredit : null,
  );
}

export function useRevisionSitting(): RevisionSitting | null {
  return useStore(quranPracticeStore, (s) => s.sitting);
}
