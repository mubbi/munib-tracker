import type { ExcusedReason, PrayerLog } from "../types/index";
import { addDays } from "./date";

/** Max days to backfill when an excused period spans time the app wasn't opened. */
export const EXCUSED_PERIOD_MAX_LOOKBACK_DAYS = 45;

/** Reason marked on a date, if any prayer log for that day is excused. */
export function excusedReasonForDate(logs: PrayerLog[], date: string): ExcusedReason | null {
  for (const log of logs) {
    if (log.date !== date) continue;
    if (log.isExcused) return log.excusedReason ?? "sick";
  }
  return null;
}

function dayHasLogs(logs: PrayerLog[], date: string): boolean {
  return logs.some((log) => log.date === date);
}

/**
 * Infer an ongoing excused period from yesterday only (legacy bootstrap when
 * `activeExcusedReason` was never persisted). Does not walk further back — on
 * the old per-day model, skipping a mark meant the period ended.
 */
export function inferExcusedReasonFromYesterday(
  logs: PrayerLog[],
  today: string,
): ExcusedReason | null {
  return excusedReasonForDate(logs, addDays(today, -1));
}

/**
 * Calendar dates that should receive the active excused reason so the pause
 * (and streak freeze) continue across midnight and across days the app wasn't
 * opened.
 *
 * Always includes `today` when it is not yet excused. Empty gap days before
 * today are included only when they connect back to an already-excused day —
 * otherwise a newly started period would incorrectly flag weeks of empty
 * history.
 */
export function datesNeedingExcuseCarryForward(
  logs: PrayerLog[],
  today: string,
  maxLookbackDays: number = EXCUSED_PERIOD_MAX_LOOKBACK_DAYS,
): string[] {
  if (excusedReasonForDate(logs, today) != null) return [];

  const todayDates = [today];
  const gap: string[] = [];
  let cursor = addDays(today, -1);

  for (let i = 1; i < maxLookbackDays; i++) {
    if (excusedReasonForDate(logs, cursor) != null) {
      return [...todayDates, ...gap];
    }
    if (dayHasLogs(logs, cursor)) {
      // Normal tracking / explicit resume day — do not rewrite history.
      return todayDates;
    }
    gap.push(cursor);
    cursor = addDays(cursor, -1);
  }

  // No prior excused anchor within the lookback — only flag today.
  return todayDates;
}
