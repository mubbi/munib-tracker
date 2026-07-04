import { OBLIGATORY_PRAYER_SET, OBLIGATORY_PRAYERS } from "../constants/index";
import type {
  DailySummary,
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

/**
 * Consecutive-day streak ending today. Today counts if it has activity; if it
 * doesn't yet, the streak still stands as long as yesterday was active (grace
 * period for the current day). Returns 0 when there is no qualifying activity.
 */
export function computeStreak(
  logs: PrayerLog[],
  obligatoryOnly = true,
  today: string = getLocalDateString(),
): number {
  const active = activeDates(logs, obligatoryOnly);
  if (active.size === 0) return 0;

  let cursor = today;
  if (!active.has(cursor)) {
    cursor = addDays(cursor, -1);
    if (!active.has(cursor)) return 0;
  }

  let streak = 0;
  while (active.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
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
