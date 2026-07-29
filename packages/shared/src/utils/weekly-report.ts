import type { PrayerLog, QazaDailyProgress, ZikrProgress } from "../types/index";
import { addDays, getLocalDateString } from "./date";
import { buildDayActivity, sumPrayerTotals } from "./history";
import { sumQazaDailyProgress } from "./qaza";

/** The rolling 7-day worship summary shown in the weekly in-app report (NF-1.6). */
export interface WeeklyReport {
  /** Inclusive [from, to] date range (7 days ending today). */
  from: string;
  to: string;
  prayersCompleted: number;
  /** Days in the range where every obligatory prayer was completed. */
  perfectDays: number;
  /** Qaza prayers made up during the range. */
  qazaCleared: number;
  /** Zikr sessions completed during the range. */
  zikrSessions: number;
}

export interface WeeklyReportInput {
  today?: string;
  prayerLogs: PrayerLog[];
  zikrProgress: ZikrProgress[];
  qazaDailyProgress: Record<string, QazaDailyProgress>;
  /** Obligatory prayers per day (default 5) for the perfect-day check. */
  obligatoryTotal?: number;
}

/** Aggregates the last 7 days of tracking data into a {@link WeeklyReport}. */
export function buildWeeklyReport(input: WeeklyReportInput): WeeklyReport {
  const {
    prayerLogs,
    zikrProgress,
    qazaDailyProgress,
    today = getLocalDateString(),
    obligatoryTotal = 5,
  } = input;
  const from = addDays(today, -6);

  let perfectDays = 0;
  let qazaCleared = 0;
  for (let i = 0; i < 7; i += 1) {
    const date = addDays(from, i);
    if (buildDayActivity(prayerLogs, date, obligatoryTotal).completed >= obligatoryTotal) {
      perfectDays += 1;
    }
    qazaCleared += sumQazaDailyProgress(qazaDailyProgress[date]);
  }

  const zikrSessions = zikrProgress.filter(
    (entry) => entry.completed && entry.date >= from && entry.date <= today,
  ).length;

  return {
    from,
    to: today,
    prayersCompleted: sumPrayerTotals(prayerLogs, from, today).completed,
    perfectDays,
    qazaCleared,
    zikrSessions,
  };
}

/**
 * Whether a new weekly report is due: never delivered, or the last one was 7+
 * days ago. Keeps the report to at most one per week.
 */
export function shouldDeliverWeeklyReport(
  lastDeliveredIso: string | undefined,
  today: string = getLocalDateString(),
): boolean {
  if (!lastDeliveredIso) return true;
  const last = lastDeliveredIso.slice(0, 10);
  return today >= addDays(last, 7);
}
