import { OBLIGATORY_PRAYER_SET, OBLIGATORY_PRAYERS } from "@munib-tracker/shared/constants";
import type {
  PrayerId,
  PrayerLog,
  QazaDailyProgress,
  QazaSchedule,
} from "@munib-tracker/shared/types";
import { addDays, parseLocalDateString } from "@munib-tracker/shared/utils";

/**
 * Pure aggregation behind the Statistics screen. Everything here works from one
 * O(n) pass over the prayer logs ({@link indexPrayerDays}) so the year view no
 * longer rescans every log for each of 365 days.
 *
 * Counting rules (shared by charts, averages and per-salah rates):
 * - "On time" = status `completed` (the same rule streaks / perfect days use).
 * - Excused days (hayd / illness / travel) are left out of every rate — they
 *   are neither a success nor a failure.
 * - Days before the user's first log are left out, so a new user is not graded
 *   on weeks they never tracked.
 * - Today counts toward a salah's rate only once that salah has been logged, so
 *   the rate doesn't drop just because Isha isn't due yet.
 */

export type StatsPeriod = "week" | "month" | "year";

const FARD_COUNT = OBLIGATORY_PRAYERS.length;

export type DayRecord = {
  completed: number;
  delayed: number;
  qaza: number;
  missed: number;
  excused: boolean;
  /** Per-salah status for this day (fard + Witr + sunnah). */
  statuses: Partial<Record<PrayerId, PrayerLog["status"]>>;
};

export type PrayerDayIndex = {
  days: Map<string, DayRecord>;
  /** Earliest date with any log, or null when nothing was ever logged. */
  firstDate: string | null;
};

function emptyDay(): DayRecord {
  return { completed: 0, delayed: 0, qaza: 0, missed: 0, excused: false, statuses: {} };
}

/** One pass over every log → per-date fard tallies, excused flags and statuses. */
export function indexPrayerDays(logs: PrayerLog[]): PrayerDayIndex {
  const days = new Map<string, DayRecord>();
  let firstDate: string | null = null;
  for (const log of logs) {
    let day = days.get(log.date);
    if (!day) {
      day = emptyDay();
      days.set(log.date, day);
    }
    if (log.isExcused) day.excused = true;
    day.statuses[log.prayerId] = log.status;
    if (firstDate === null || log.date < firstDate) firstDate = log.date;
    if (!OBLIGATORY_PRAYER_SET.has(log.prayerId)) continue;
    if (log.status === "completed") day.completed += 1;
    else if (log.status === "delayed") day.delayed += 1;
    else if (log.status === "qaza") day.qaza += 1;
    else if (log.status === "missed") day.missed += 1;
  }
  return { days, firstDate };
}

export type PeriodRange = {
  from: string;
  to: string;
  /** The equally long window right before (same span last year for "year"). */
  previousFrom: string;
  previousTo: string;
};

/** Inclusive date window for a period ending today. Year = calendar year to date. */
export function periodRange(period: StatsPeriod, today: string): PeriodRange {
  if (period === "year") {
    const [year, month, day] = today.split("-");
    const lastYear = `${Number(year) - 1}`;
    // Feb 29 has no twin last year — compare against Feb 28.
    const previousTo =
      month === "02" && day === "29" ? `${lastYear}-02-28` : `${lastYear}-${month}-${day}`;
    return { from: `${year}-01-01`, to: today, previousFrom: `${lastYear}-01-01`, previousTo };
  }
  const days = period === "week" ? 7 : 30;
  const from = addDays(today, -(days - 1));
  return { from, to: today, previousFrom: addDays(from, -days), previousTo: addDays(from, -1) };
}

export type DayPoint = {
  date: string;
  /** On-time fard share 0..1. */
  level: number;
  excused: boolean;
  /** Before the user's first log — shown faded, never averaged. */
  beforeStart: boolean;
  isToday: boolean;
  hasLogs: boolean;
};

/** One point per day in [from, to], oldest first. */
export function dailyPoints(
  index: PrayerDayIndex,
  from: string,
  to: string,
  today: string,
): DayPoint[] {
  const points: DayPoint[] = [];
  for (let date = from; date <= to; date = addDays(date, 1)) {
    const day = index.days.get(date);
    points.push({
      date,
      level: day ? day.completed / FARD_COUNT : 0,
      excused: day?.excused ?? false,
      beforeStart: index.firstDate === null || date < index.firstDate,
      isToday: date === today,
      hasLogs: day != null,
    });
  }
  return points;
}

/** Whether a day counts toward rates: tracked, not excused, and (if today) logged. */
function countable(point: DayPoint): boolean {
  if (point.beforeStart || point.excused) return false;
  // Today only counts once something has been logged — the day isn't over yet.
  return !point.isToday || point.hasLogs;
}

/** Average on-time level over countable days, or null when there are none. */
export function averageLevel(points: DayPoint[]): number | null {
  let sum = 0;
  let n = 0;
  for (const point of points) {
    if (!countable(point)) continue;
    sum += point.level;
    n += 1;
  }
  return n > 0 ? sum / n : null;
}

export type MonthPoint = {
  /** 0..11 */
  month: number;
  level: number | null;
  future: boolean;
  isCurrent: boolean;
};

/** Calendar-year months, each the average of its countable days. */
export function monthlyPoints(index: PrayerDayIndex, today: string): MonthPoint[] {
  const [yearStr, monthStr] = today.split("-");
  const year = Number(yearStr);
  const currentMonth = Number(monthStr) - 1;
  const months: MonthPoint[] = [];
  for (let month = 0; month < 12; month += 1) {
    if (month > currentMonth) {
      months.push({ month, level: null, future: true, isCurrent: false });
      continue;
    }
    const mm = `${month + 1}`.padStart(2, "0");
    const lastDay = new Date(year, month + 1, 0).getDate();
    const from = `${year}-${mm}-01`;
    const end = `${year}-${mm}-${`${lastDay}`.padStart(2, "0")}`;
    const to = end < today ? end : today;
    months.push({
      month,
      level: averageLevel(dailyPoints(index, from, to, today)),
      future: false,
      isCurrent: month === currentMonth,
    });
  }
  return months;
}

export type PeriodSummary = {
  completed: number;
  delayed: number;
  qaza: number;
  missed: number;
  /** Fard with no status recorded on countable days (not logged at all). */
  unlogged: number;
  perfectDays: number;
  activeDays: number;
  excusedDays: number;
  /** Days that count toward rates (see module notes). */
  countedDays: number;
  /** Longest run of perfect days inside the period. */
  bestPerfectRun: number;
  average: number | null;
};

export function summarizePeriod(index: PrayerDayIndex, points: DayPoint[]): PeriodSummary {
  const summary: PeriodSummary = {
    completed: 0,
    delayed: 0,
    qaza: 0,
    missed: 0,
    unlogged: 0,
    perfectDays: 0,
    activeDays: 0,
    excusedDays: 0,
    countedDays: 0,
    bestPerfectRun: 0,
    average: averageLevel(points),
  };
  let run = 0;
  for (const point of points) {
    const day = index.days.get(point.date);
    if (point.excused) {
      summary.excusedDays += 1;
      continue; // transparent for the perfect-day run, like streaks
    }
    if (day) {
      summary.completed += day.completed;
      summary.delayed += day.delayed;
      summary.qaza += day.qaza;
      summary.missed += day.missed;
      if (day.completed + day.delayed + day.qaza + day.missed > 0) summary.activeDays += 1;
    }
    const perfect = (day?.completed ?? 0) >= FARD_COUNT;
    if (perfect) summary.perfectDays += 1;
    if (countable(point)) {
      summary.countedDays += 1;
      const logged = day ? day.completed + day.delayed + day.qaza + day.missed : 0;
      if (!point.isToday) summary.unlogged += Math.max(0, FARD_COUNT - logged);
    }
    if (perfect) {
      run += 1;
      summary.bestPerfectRun = Math.max(summary.bestPerfectRun, run);
    } else if (!point.isToday) {
      run = 0;
    }
  }
  return summary;
}

export type SalahRow = {
  prayerId: PrayerId;
  completed: number;
  delayed: number;
  qaza: number;
  missed: number;
  /** Days this salah could have been prayed in the period (rate denominator). */
  days: number;
  /** completed / days (0..1), null when there are no countable days. */
  onTimeRate: number | null;
};

/** Per-salah tallies and on-time rates for the given salah over the period. */
export function salahBreakdown(
  index: PrayerDayIndex,
  points: DayPoint[],
  prayers: readonly PrayerId[],
): SalahRow[] {
  return prayers.map((prayerId) => {
    const row: SalahRow = {
      prayerId,
      completed: 0,
      delayed: 0,
      qaza: 0,
      missed: 0,
      days: 0,
      onTimeRate: null,
    };
    for (const point of points) {
      if (point.beforeStart || point.excused) continue;
      const status = index.days.get(point.date)?.statuses[prayerId];
      // Today: only once this salah is logged (it may not be due yet).
      if (point.isToday && (status == null || status === "pending")) continue;
      row.days += 1;
      if (status === "completed") row.completed += 1;
      else if (status === "delayed") row.delayed += 1;
      else if (status === "qaza") row.qaza += 1;
      else if (status === "missed") row.missed += 1;
    }
    row.onTimeRate = row.days > 0 ? row.completed / row.days : null;
    return row;
  });
}

/** Strongest and weakest fard by on-time rate (null when they tie or lack data). */
export function salahExtremes(rows: SalahRow[]): {
  strongest: SalahRow | null;
  weakest: SalahRow | null;
} {
  const rated = rows.filter(
    (row): row is SalahRow & { onTimeRate: number } =>
      row.onTimeRate != null && OBLIGATORY_PRAYER_SET.has(row.prayerId),
  );
  if (rated.length < 2) return { strongest: null, weakest: null };
  const sorted = [...rated].sort((a, b) => b.onTimeRate - a.onTimeRate);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];
  if (!strongest || !weakest || strongest.onTimeRate === weakest.onTimeRate) {
    return { strongest: null, weakest: null };
  }
  return { strongest, weakest };
}

/** Weekday (0 = Sunday) with the highest average, needing ≥2 countable samples each. */
export function strongestWeekday(points: DayPoint[]): number | null {
  const sums = new Array<number>(7).fill(0);
  const counts = new Array<number>(7).fill(0);
  for (const point of points) {
    if (!countable(point)) continue;
    const weekday = parseLocalDateString(point.date).getDay();
    sums[weekday] = (sums[weekday] ?? 0) + point.level;
    counts[weekday] = (counts[weekday] ?? 0) + 1;
  }
  let best: number | null = null;
  let bestAvg = -1;
  let ties = 0;
  for (let weekday = 0; weekday < 7; weekday += 1) {
    const count = counts[weekday] ?? 0;
    if (count < 2) continue;
    const avg = (sums[weekday] ?? 0) / count;
    if (avg > bestAvg + 1e-9) {
      bestAvg = avg;
      best = weekday;
      ties = 0;
    } else if (Math.abs(avg - bestAvg) <= 1e-9) {
      ties += 1;
    }
  }
  // A flat week (all days equal) has no meaningful "best day".
  return best != null && bestAvg > 0 && ties === 0 ? best : null;
}

/** Qaza prayers made up over an inclusive range. */
export function sumQazaMadeUp(
  progress: Record<string, QazaDailyProgress>,
  from: string,
  to: string,
): number {
  let sum = 0;
  for (const [date, day] of Object.entries(progress)) {
    if (date < from || date > to) continue;
    for (const count of Object.values(day.completed)) sum += count ?? 0;
  }
  return sum;
}

export type QazaProjection = {
  /** Qaza made up per day used for the estimate. */
  perDay: number;
  basis: "pace" | "plan";
  days: number;
  finishDate: string;
};

/**
 * When the remaining qaza would be cleared: at the recent pace (made up over the
 * last `windowDays`, ending today) or — with no recent activity — the daily plan.
 */
export function projectQazaFinish(
  remaining: number,
  progress: Record<string, QazaDailyProgress>,
  schedule: QazaSchedule | undefined,
  today: string,
  windowDays = 30,
): QazaProjection | null {
  if (remaining <= 0) return null;
  const recent = sumQazaMadeUp(progress, addDays(today, -(windowDays - 1)), today);
  const pace = recent / windowDays;
  const plan = Object.values(schedule?.targets ?? {}).reduce<number>((s, n) => s + (n ?? 0), 0);
  const perDay = pace > 0 ? pace : plan;
  if (perDay <= 0) return null;
  const days = Math.ceil(remaining / perDay);
  return { perDay, basis: pace > 0 ? "pace" : "plan", days, finishDate: addDays(today, days) };
}

export type QuranReadingSummary = {
  ayahsRead: number;
  totalAyahs: number;
  surahsStarted: number;
  surahsCompleted: number;
};

/** Reading coverage from the per-surah furthest-ayah map. */
export function summarizeQuranReading(
  progress: Record<number, { furthestAyah: number }>,
  surahs: readonly { number: number; ayahCount: number }[],
): QuranReadingSummary {
  let ayahsRead = 0;
  let totalAyahs = 0;
  let surahsStarted = 0;
  let surahsCompleted = 0;
  for (const surah of surahs) {
    totalAyahs += surah.ayahCount;
    const furthest = Math.min(progress[surah.number]?.furthestAyah ?? 0, surah.ayahCount);
    if (furthest <= 0) continue;
    surahsStarted += 1;
    ayahsRead += furthest;
    if (furthest >= surah.ayahCount) surahsCompleted += 1;
  }
  return { ayahsRead, totalAyahs, surahsStarted, surahsCompleted };
}
