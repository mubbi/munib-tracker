import { OBLIGATORY_PRAYER_SET } from "@munib-tracker/shared/constants";
import type {
  ExcusedReason,
  MuhasabahEntry,
  MuhasabahPromptId,
  MuhasabahPromptTally,
  MuhasabahRetentionDays,
  MuhasabahWeekSummary,
  PrayerLog,
} from "@munib-tracker/shared/types";
import { addDays, diffInDays } from "@munib-tracker/shared/utils";

/**
 * Pure muhasabah logic (NF-3.6): retention, the private per-prompt trends, the
 * read-only weekly summary for the NF-3.14 coach, the read-only Salah recap and
 * the Today card state. No overall score is ever computed (plan §6).
 */

// ── Retention ───────────────────────────────────────────────────────────────

/** Entries older than `retentionDays` (0 = keep forever) relative to `today`. */
export function expiredEntryDates(
  entries: readonly Pick<MuhasabahEntry, "date">[],
  today: string,
  retentionDays: MuhasabahRetentionDays,
): string[] {
  if (retentionDays === 0) return [];
  return entries
    .filter((entry) => diffInDays(today, entry.date) >= retentionDays)
    .map((entry) => entry.date);
}

// ── Trends (visible only to the user) ───────────────────────────────────────

export const MUHASABAH_TREND_DAYS = 30;

function emptyTally(): MuhasabahPromptTally {
  return { yes: 0, partly: 0, no: 0 };
}

function inWindow(date: string, start: string, end: string): boolean {
  return date >= start && date <= end;
}

/** Per-prompt answer counts for the `days` ending on `endDate` (inclusive). */
export function promptTrends(
  entries: readonly MuhasabahEntry[],
  prompts: readonly MuhasabahPromptId[],
  endDate: string,
  days: number = MUHASABAH_TREND_DAYS,
): Array<{ promptId: MuhasabahPromptId; tally: MuhasabahPromptTally; answered: number }> {
  const start = addDays(endDate, -(days - 1));
  const tallies = new Map<MuhasabahPromptId, MuhasabahPromptTally>(
    prompts.map((id) => [id, emptyTally()]),
  );
  for (const entry of entries) {
    if (!inWindow(entry.date, start, endDate)) continue;
    for (const id of prompts) {
      const answer = entry.answers[id];
      const tally = tallies.get(id);
      if (answer && tally) tally[answer] += 1;
    }
  }
  return prompts.map((promptId) => {
    const tally = tallies.get(promptId) ?? emptyTally();
    return { promptId, tally, answered: tally.yes + tally.partly + tally.no };
  });
}

// ── Coach input (NF-3.14): aggregated rates only, never text ────────────────

/**
 * Read-only weekly summary the NF-3.14 coach consumes: per-prompt answer counts
 * for the 7 days starting `weekStart`. Text fields are never read.
 */
export function summarizeMuhasabahWeek(
  entries: readonly MuhasabahEntry[],
  weekStart: string,
): MuhasabahWeekSummary {
  const end = addDays(weekStart, 6);
  const perPrompt: MuhasabahWeekSummary["perPrompt"] = {};
  let reviewDays = 0;
  let istighfarDays = 0;
  for (const entry of entries) {
    if (!inWindow(entry.date, weekStart, end)) continue;
    reviewDays += 1;
    if (entry.readIstighfar) istighfarDays += 1;
    for (const [id, answer] of Object.entries(entry.answers) as [
      MuhasabahPromptId,
      MuhasabahEntry["answers"][MuhasabahPromptId],
    ][]) {
      if (!answer) continue;
      const tally = perPrompt[id] ?? emptyTally();
      tally[answer] += 1;
      perPrompt[id] = tally;
    }
  }
  return { weekStart, reviewDays, perPrompt, istighfarDays };
}

// ── Salah recap (screen 1, read-only) ───────────────────────────────────────

export interface MuhasabahSalahRecap {
  /** Fard logged as prayed on time. */
  fardOnTime: number;
  /** Fard prayed late (delayed) or made up the same day. */
  fardLate: number;
  fardTotal: 5;
  /** Witr / sunnah / nafl / rawatib logged as prayed. */
  voluntary: number;
  /** Set when the day is excused — the screen shows rest copy and no counts. */
  excusedReason: ExcusedReason | null;
}

export function summarizeSalahForMuhasabah(
  logs: readonly PrayerLog[],
  date: string,
  activeExcusedReason?: ExcusedReason | null,
): MuhasabahSalahRecap {
  let fardOnTime = 0;
  let fardLate = 0;
  let voluntary = 0;
  let excusedReason: ExcusedReason | null = activeExcusedReason ?? null;
  for (const log of logs) {
    if (log.date !== date) continue;
    if (log.isExcused && !excusedReason) excusedReason = log.excusedReason ?? "sick";
    if (OBLIGATORY_PRAYER_SET.has(log.prayerId)) {
      if (log.status === "completed") fardOnTime += 1;
      else if (log.status === "delayed" || log.status === "qaza") fardLate += 1;
    } else if (log.status === "completed" || log.status === "delayed") {
      // Witr and every optional / rawatib id the tracker knows.
      voluntary += 1;
    }
  }
  return { fardOnTime, fardLate, fardTotal: 5, voluntary, excusedReason };
}

// ── Today card ──────────────────────────────────────────────────────────────

export type MuhasabahCardState =
  | { kind: "reflect" }
  | { kind: "intention"; intention: string }
  | { kind: "done" }
  | null;

/**
 * What the home Today card shows:
 * - after Isha (or the evening fallback) and no review yet → "reflect"
 * - otherwise yesterday's intention for today, when one was set → "intention"
 * - after Isha with tonight's review done → "done"
 */
export function muhasabahCardState(input: {
  afterIsha: boolean;
  today: MuhasabahEntry | undefined;
  yesterday: MuhasabahEntry | undefined;
}): MuhasabahCardState {
  if (input.afterIsha) return input.today ? { kind: "done" } : { kind: "reflect" };
  const intention = input.yesterday?.intention?.trim();
  return intention ? { kind: "intention", intention } : null;
}

/** Fallback evening start when no location is set (Isha can't be computed). */
export const MUHASABAH_EVENING_FALLBACK_HOUR = 20;
