import { longestDayRun, type RecitationStats } from "@munib-tracker/shared/achievements";

import { creditableAyahs, sessionDate } from "@/lib/quran-companion/reading-credit";
import type { PracticeHistory } from "@/lib/quran-companion/types";

export type PracticeTotals = RecitationStats & {
  /** Whole minutes spent in finished practice sessions. */
  minutes: number;
};

/**
 * Statistics › Qur'an practice (D68): totals over the user's own practice
 * history on this device. "Ayahs recited" uses the reading-credit rule (an ayah
 * counts when at least two thirds of its words were heard), summed per session,
 * so revising the same ayah on two days counts twice — it was recited twice.
 */
export function practiceTotals(history: PracticeHistory | null | undefined): PracticeTotals {
  const items = history?.items ?? [];
  let durationMs = 0;
  let ayahsRecited = 0;
  const revisionDays: string[] = [];
  for (const summary of items) {
    if (Number.isFinite(summary.durationMs) && summary.durationMs > 0) {
      durationMs += summary.durationMs;
    }
    ayahsRecited += creditableAyahs(summary).length;
    if (summary.mode === "revision") {
      const day = sessionDate(summary);
      if (day) revisionDays.push(day);
    }
  }
  return {
    sessions: items.length,
    minutes: Math.floor(durationMs / 60_000),
    ayahsRecited,
    bestRevisionStreak: longestDayRun(revisionDays),
  };
}

/**
 * D71: the history's totals raised to the lifetime Recitation totals (sessions,
 * ayahs, best revision run), so the practice card and its badges never drop as
 * old rows leave the 30-row history. Minutes stay history-only.
 */
export function withLifetimeTotals(
  totals: PracticeTotals,
  lifetime: RecitationStats | null | undefined,
): PracticeTotals {
  if (!lifetime) return totals;
  return {
    ...totals,
    sessions: Math.max(totals.sessions, lifetime.sessions),
    ayahsRecited: Math.max(totals.ayahsRecited, lifetime.ayahsRecited),
    bestRevisionStreak: Math.max(totals.bestRevisionStreak, lifetime.bestRevisionStreak),
  };
}
