import { longestDayRun, type RecitationStats } from "@munib-tracker/shared/achievements";

import { creditableAyahs, sessionDate } from "./reading-credit";
import type { PracticeSummary } from "./types";

/**
 * D71: lifetime Recitation-track totals. The practice history keeps only the
 * newest 30 sessions (`MAX_HISTORY`), so totals summed over it would plateau and
 * then fall as old rows roll off — taking milestones and Noor with them. Each
 * session is instead credited here once, by id, and never subtracted.
 *
 * Not a sync entity: practice rows already sync, and every device credits the
 * rows it sees (a fresh device seeds itself from the synced history on its first
 * read). "Delete practice history" removes the rows but keeps these counts —
 * earned recitation milestones and Noor never go backwards; Reset app data wipes
 * them with everything else.
 */
export type RecitationTotals = {
  schemaVersion: 1;
  sessions: number;
  /** Heard ayahs summed per session — the `heardAyahs` / reading-credit rule. */
  ayahsRecited: number;
  /** Best run of consecutive revision days ever seen (kept when old days are trimmed). */
  bestRevisionStreak: number;
  /** Distinct local days with a revision session, ascending, newest {@link MAX_REVISION_DAYS}. */
  revisionDays: string[];
  /** Ids already credited, oldest first, newest {@link MAX_CREDITED_IDS} (idempotency). */
  creditedIds: string[];
};

/** Far more than the 30-row history, so a row still in the history is always remembered. */
export const MAX_CREDITED_IDS = 300;
/** Two years of revision days — enough to keep a running streak growing. */
export const MAX_REVISION_DAYS = 730;

export const EMPTY_RECITATION_TOTALS: RecitationTotals = {
  schemaVersion: 1,
  sessions: 0,
  ayahsRecited: 0,
  bestRevisionStreak: 0,
  revisionDays: [],
  creditedIds: [],
};

const count = (value: unknown): number =>
  typeof value === "number" && Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;

const strings = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];

/** A stored value as totals; anything unreadable (or a newer schema) reads as `null`. */
export function asRecitationTotals(raw: unknown): RecitationTotals | null {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Record<string, unknown>;
  if (value.schemaVersion !== 1) return null;
  return {
    schemaVersion: 1,
    sessions: count(value.sessions),
    ayahsRecited: count(value.ayahsRecited),
    bestRevisionStreak: count(value.bestRevisionStreak),
    revisionDays: strings(value.revisionDays),
    creditedIds: strings(value.creditedIds),
  };
}

/**
 * Credits every summary whose id isn't credited yet (pure). Returns the same
 * object when nothing was new, so callers can skip the write.
 */
export function creditRecitationTotals(
  totals: RecitationTotals,
  summaries: Iterable<PracticeSummary | null | undefined>,
): RecitationTotals {
  const credited = new Set(totals.creditedIds);
  const newIds: string[] = [];
  let sessions = totals.sessions;
  let ayahsRecited = totals.ayahsRecited;
  const days = new Set(totals.revisionDays);
  for (const summary of summaries) {
    if (!summary || typeof summary.id !== "string" || credited.has(summary.id)) continue;
    credited.add(summary.id);
    newIds.push(summary.id);
    sessions += 1;
    ayahsRecited += creditableAyahs(summary).length;
    if (summary.mode === "revision") {
      const day = sessionDate(summary);
      if (day) days.add(day);
    }
  }
  if (newIds.length === 0) return totals;
  const revisionDays = [...days].sort().slice(-MAX_REVISION_DAYS);
  return {
    schemaVersion: 1,
    sessions,
    ayahsRecited,
    bestRevisionStreak: Math.max(totals.bestRevisionStreak, longestDayRun(revisionDays)),
    revisionDays,
    creditedIds: [...totals.creditedIds, ...newIds].slice(-MAX_CREDITED_IDS),
  };
}

/** The Recitation track's stats: never below the lifetime totals or the history's own sums. */
export function recitationStatsFrom(
  totals: RecitationTotals,
  fromHistory: RecitationStats,
): RecitationStats {
  return {
    sessions: Math.max(totals.sessions, fromHistory.sessions),
    ayahsRecited: Math.max(totals.ayahsRecited, fromHistory.ayahsRecited),
    bestRevisionStreak: Math.max(totals.bestRevisionStreak, fromHistory.bestRevisionStreak),
  };
}
