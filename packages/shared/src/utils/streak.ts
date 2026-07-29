import { OBLIGATORY_PRAYER_SET, OBLIGATORY_PRAYERS } from "../constants/index";
import type {
  DailySummary,
  PrayerId,
  PrayerLog,
  QazaCounter,
  QazaDailyProgress,
  QazaSchedule,
  ZikrProgress,
} from "../types/index";
import { addDays, getLocalDateString } from "./date";
import { buildDayActivity } from "./history";
import { sumQazaDailyProgress, sumQazaScheduleTargets } from "./qaza";

/** A day counts toward a streak if a prayer was completed or a qaza performed that day. */
function activeDates(logs: PrayerLog[], obligatoryOnly: boolean): Set<string> {
  const dates = new Set<string>();
  for (const log of logs) {
    if (log.status !== "completed" && log.status !== "qaza") continue;
    if (obligatoryOnly && !OBLIGATORY_PRAYER_SET.has(log.prayerId)) continue;
    dates.add(log.date);
  }
  return dates;
}

/** Dates the user marked excused (hayd / illness / travel) — the streak passes through them. */
function excusedDates(logs: PrayerLog[]): Set<string> {
  const dates = new Set<string>();
  for (const log of logs) if (log.isExcused) dates.add(log.date);
  return dates;
}

/**
 * Consecutive-day streak ending today. Today counts if it has activity; if it
 * doesn't yet, the streak still stands as long as yesterday was active (grace
 * period for the current day). Excused days (hayd / illness / travel) are
 * transparent: they neither count toward nor break the streak, so an excused
 * stretch doesn't reset a habit (NF-1.2). Returns 0 when there is no qualifying
 * activity.
 */
export function computeStreak(
  logs: PrayerLog[],
  obligatoryOnly = true,
  today: string = getLocalDateString(),
): number {
  const active = activeDates(logs, obligatoryOnly);
  if (active.size === 0) return 0;
  const excused = excusedDates(logs);

  let cursor = today;
  // Grace for the current day not being logged yet; excused days are skipped the
  // same way so the walk-back continues past them.
  if (!active.has(cursor) && !excused.has(cursor)) {
    cursor = addDays(cursor, -1);
  }

  let streak = 0;
  while (active.has(cursor) || excused.has(cursor)) {
    if (active.has(cursor)) streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

/** The set of dates a single prayer was marked completed (NF-2.13). */
export function prayerCompletionDates(logs: PrayerLog[], prayerId: PrayerId): Set<string> {
  const dates = new Set<string>();
  for (const log of logs) {
    if (log.prayerId === prayerId && log.status === "completed") dates.add(log.date);
  }
  return dates;
}

/**
 * Consecutive-day streak for one specific prayer (e.g. Tahajjud), ending today
 * (NF-2.13). Today is given grace if not yet logged — the streak still stands as
 * long as yesterday qualifies. Unlike the fard streak, a voluntary prayer has no
 * excused pass-through: a missed night simply ends the streak. Returns 0 when the
 * prayer was never completed.
 */
export function computePrayerStreak(
  logs: PrayerLog[],
  prayerId: PrayerId,
  today: string = getLocalDateString(),
): number {
  const dates = prayerCompletionDates(logs, prayerId);
  if (dates.size === 0) return 0;

  let cursor = today;
  if (!dates.has(cursor)) cursor = addDays(cursor, -1);

  let streak = 0;
  while (dates.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

/** Longest consecutive-day run the prayer was ever kept (NF-2.13). */
export function longestPrayerStreak(logs: PrayerLog[], prayerId: PrayerId): number {
  const dates = prayerCompletionDates(logs, prayerId);
  if (dates.size === 0) return 0;

  let longest = 0;
  for (const date of dates) {
    // Only start counting from the beginning of a run (no completed day before it).
    if (dates.has(addDays(date, -1))) continue;
    let run = 0;
    let cursor = date;
    while (dates.has(cursor)) {
      run += 1;
      cursor = addDays(cursor, 1);
    }
    longest = Math.max(longest, run);
  }
  return longest;
}

export interface DailySummaryInput {
  date: string;
  prayerLogs: PrayerLog[];
  zikrProgress?: ZikrProgress[];
  qazaCounters?: QazaCounter[];
  qazaSchedule?: QazaSchedule;
  qazaDailyProgress?: QazaDailyProgress;
  obligatoryTotal?: number;
  streakDays?: number;
}

/** Aggregates a single day's tracking data into the dashboard summary. */
export function buildDailySummary(input: DailySummaryInput): DailySummary {
  const {
    date,
    prayerLogs,
    zikrProgress = [],
    qazaCounters = [],
    qazaSchedule,
    qazaDailyProgress,
    obligatoryTotal = OBLIGATORY_PRAYERS.length,
    streakDays = 0,
  } = input;

  const activity = buildDayActivity(prayerLogs, date, obligatoryTotal);

  const zikrForDate = zikrProgress.filter((entry) => entry.date === date);
  const zikrCompleted = zikrForDate.filter((entry) => entry.completed).length;

  const qazaRemaining = qazaCounters.reduce((sum, counter) => sum + counter.remaining, 0);
  const qazaTargetToday = sumQazaScheduleTargets(qazaSchedule);
  const qazaCompletedToday = sumQazaDailyProgress(
    qazaDailyProgress?.date === date ? qazaDailyProgress : undefined,
  );

  return {
    date,
    salahCompleted: activity.completed,
    salahTotal: obligatoryTotal,
    zikrCompleted,
    zikrTotal: zikrForDate.length,
    qazaRemaining,
    qazaTargetToday,
    qazaCompletedToday,
    streakDays,
  };
}
