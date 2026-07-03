import { OBLIGATORY_PRAYERS } from "../constants/index";
import type { DailySummary, PrayerLog, QazaCounter, ZikrProgress } from "../types/index";
import { addDays, getLocalDateString } from "./date";

const OBLIGATORY_SET = new Set<string>(OBLIGATORY_PRAYERS);

/** A day counts toward a streak if a prayer was completed or a qaza performed that day. */
function activeDates(logs: PrayerLog[], obligatoryOnly: boolean): Set<string> {
  const dates = new Set<string>();
  for (const log of logs) {
    if (log.status !== "completed" && log.status !== "qaza") continue;
    if (obligatoryOnly && !OBLIGATORY_SET.has(log.prayerId)) continue;
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
    obligatoryTotal = OBLIGATORY_PRAYERS.length,
    streakDays = 0,
  } = input;

  const logsForDate = prayerLogs.filter((log) => log.date === date);
  const salahCompleted = logsForDate.filter(
    (log) => log.status === "completed" && OBLIGATORY_SET.has(log.prayerId),
  ).length;
  const qazaCompletedToday = logsForDate.filter((log) => log.status === "qaza").length;

  const zikrForDate = zikrProgress.filter((entry) => entry.date === date);
  const zikrCompleted = zikrForDate.filter((entry) => entry.completed).length;

  const qazaRemaining = qazaCounters.reduce((sum, counter) => sum + counter.remaining, 0);

  return {
    date,
    salahCompleted,
    salahTotal: obligatoryTotal,
    zikrCompleted,
    zikrTotal: zikrForDate.length,
    qazaRemaining,
    qazaCompletedToday,
    streakDays,
  };
}
