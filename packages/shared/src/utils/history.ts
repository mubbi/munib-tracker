import { OBLIGATORY_PRAYER_SET, OBLIGATORY_PRAYERS } from "../constants/index";
import type { PrayerLog } from "../types/index";
import { addDays, getLocalDateString } from "./date";

export interface DayActivity {
  date: string;
  completed: number;
  missed: number;
  qaza: number;
  delayed: number;
  total: number;
  /** completed / total, 0..1 */
  level: number;
}

/** Aggregates one day's obligatory-prayer logs into a compact activity record. */
export function buildDayActivity(
  logs: PrayerLog[],
  date: string,
  total: number = OBLIGATORY_PRAYERS.length,
): DayActivity {
  let completed = 0;
  let missed = 0;
  let qaza = 0;
  let delayed = 0;
  for (const log of logs) {
    if (log.date !== date || !OBLIGATORY_PRAYER_SET.has(log.prayerId)) continue;
    if (log.status === "completed") completed += 1;
    else if (log.status === "missed") missed += 1;
    else if (log.status === "qaza") qaza += 1;
    else if (log.status === "delayed") delayed += 1;
  }
  return { date, completed, missed, qaza, delayed, total, level: total ? completed / total : 0 };
}

/** Maps every date that has activity to its `DayActivity`. */
export function aggregateByDate(logs: PrayerLog[]): Map<string, DayActivity> {
  const map = new Map<string, DayActivity>();
  const dates = new Set(logs.map((log) => log.date));
  for (const date of dates) map.set(date, buildDayActivity(logs, date));
  return map;
}

export interface PrayerTotals {
  completed: number;
  missed: number;
  qaza: number;
  delayed: number;
}

/** Sums obligatory-prayer statuses over an inclusive [from, to] date range. */
export function sumPrayerTotals(logs: PrayerLog[], from: string, to: string): PrayerTotals {
  const totals: PrayerTotals = { completed: 0, missed: 0, qaza: 0, delayed: 0 };
  for (const log of logs) {
    if (!OBLIGATORY_PRAYER_SET.has(log.prayerId)) continue;
    if (log.date < from || log.date > to) continue;
    if (log.status === "completed") totals.completed += 1;
    else if (log.status === "missed") totals.missed += 1;
    else if (log.status === "qaza") totals.qaza += 1;
    else if (log.status === "delayed") totals.delayed += 1;
  }
  return totals;
}

/** Per-day completion level for the last `days` days, oldest first (for charts). */
export function dailyCompletionSeries(
  logs: PrayerLog[],
  days: number,
  today: string = getLocalDateString(),
): DayActivity[] {
  const series: DayActivity[] = [];
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = addDays(today, -offset);
    series.push(buildDayActivity(logs, date));
  }
  return series;
}
