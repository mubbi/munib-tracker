import { OBLIGATORY_PRAYER_SET, OBLIGATORY_PRAYERS } from "@munib-tracker/shared/constants";
import type {
  CoachContext,
  CoachKhushuInput,
  CoachPrayerWeek,
  CoachWeekStats,
  ExcusedReason,
  FamilyTiesSummary,
  MuhasabahWeekSummary,
  ObligatoryPrayer,
  PrayerLog,
  QazaCounter,
  QazaDailyProgress,
  QazaSchedule,
  SunnahHabitsState,
  UserPreferences,
  VoluntaryFastingMap,
  ZikrProgress,
} from "@munib-tracker/shared/types";
import {
  addDays,
  computeStreak,
  getLocalDateString,
  isLiveFastEntry,
  longestStreak,
  parseLocalDateString,
  rawatibConsistency,
  summarizeRawatib,
} from "@munib-tracker/shared/utils";

import { adhkarSetsForDay, DAILY_ADHKAR_SETS, zikrCountsByDate } from "@/lib/adhkar-history";
import { emergencyCountLastWeek } from "@/lib/focus-lock/state";
import {
  dailyTargetForPlan,
  expectedAyahsBeforeToday,
  type KhatmPlan,
  khatmTotalForUnit,
} from "@/lib/khatm";
import type { KhushuEntry } from "@/lib/khushu";
import {
  firstReadingLogDate,
  type QuranReadingLog,
  readingDaysBetween,
} from "@/lib/quran-reading-log";
import {
  dailyPoints,
  indexPrayerDays,
  type PrayerDayIndex,
  projectQazaFinish,
  salahBreakdown,
  summarizePeriod,
  sumQazaMadeUp,
} from "@/lib/statistics";
import {
  type HabitContext,
  habitProgress,
  isQuranRecitationHabit,
  selectedHabits,
} from "@/lib/sunnah-habits";

/**
 * NF-3.14: maps the trackers' public read APIs into the pure engine's
 * {@link CoachContext}. Reuses the statistics engine (`indexPrayerDays`,
 * `dailyPoints`, `summarizePeriod`, `salahBreakdown`, `projectQazaFinish`)
 * rather than recomputing it; vault features arrive as counts only
 * (`readMuhasabahWeekSummary` / `readFamilyTiesSummary`, null when locked).
 */

/** Earlier weeks fed to multi-week rules (fajr_gap 2, weekday_dip 3, improvement 4-week baseline). */
export const COACH_PREVIOUS_WEEKS = 4;
/** Khushu averages look back four weeks. */
export const COACH_KHUSHU_DAYS = 28;

export interface CoachSources {
  today: string;
  /** First day of the reviewed week (`coachWeekFor(...).weekStart`). */
  weekStart: string;
  prayerLogs: readonly PrayerLog[];
  zikrProgress: readonly ZikrProgress[];
  qazaCounters: readonly Pick<QazaCounter, "remaining">[];
  qazaDailyProgress: Record<string, QazaDailyProgress>;
  qazaSchedule?: QazaSchedule;
  khatm: { plan: KhatmPlan | null; read: number };
  khushu: readonly KhushuEntry[];
  /**
   * D40 daily Qur'an reading log — the source of truth for reading days from
   * its first entry on. Optional so callers/tests without it keep working.
   */
  quranReadingLog?: QuranReadingLog;
  /**
   * Per-surah reading progress (`updatedAt` marks a reading day). Fallback
   * approximation, used only for days BEFORE the reading log's first entry.
   */
  quranReadingProgress: Record<number, { updatedAt?: string }>;
  /** Qur'an practice session end times (ISO). */
  practiceSessionEnds: readonly string[];
  habits: SunnahHabitsState;
  habitContext: HabitContext;
  voluntaryFasting: VoluntaryFastingMap;
  prefs: Pick<UserPreferences, "activeExcusedReason" | "homeMasjid" | "bedtime">;
  muhasabah: MuhasabahWeekSummary | null;
  family: FamilyTiesSummary | null;
  /**
   * NF-3.13 device-local focus-lock state (`focusLockStore`): the emergency
   * unlock log (ISO times). Null/absent when focus lock was never set up here.
   */
  focusLock?: { emergencyLog: readonly string[] } | null;
}

const FARD = OBLIGATORY_PRAYERS as readonly ObligatoryPrayer[];
const MORNING_SET = 0;
const EVENING_SET = DAILY_ADHKAR_SETS.findIndex((scope) => scope.categoryId === "evening");

function localDateOf(iso: string | undefined): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : getLocalDateString(date);
}

function datesIn(from: string, to: string): string[] {
  const out: string[] = [];
  for (let date = from; date <= to; date = addDays(date, 1)) out.push(date);
  return out;
}

/** Per-source activity dates, computed once and sliced per week. */
interface ActivityIndex {
  quran: Set<string>;
  adhkar: Set<string>;
  habitDone: Map<string, Set<string>>;
  fasted: Set<string>;
  qaza: Set<string>;
}

function buildActivityIndex(sources: CoachSources, from: string, to: string): ActivityIndex {
  const inRange = (date: string | null): date is string =>
    date != null && date >= from && date <= to;

  const quran = new Set<string>();
  const log = sources.quranReadingLog ?? {};
  for (const date of readingDaysBetween(log, from, to)) quran.add(date);
  // Before the log existed, approximate from the per-surah `updatedAt` stamps.
  const logStart = firstReadingLogDate(log);
  for (const entry of Object.values(sources.quranReadingProgress)) {
    const date = localDateOf(entry?.updatedAt);
    if (inRange(date) && (logStart == null || date < logStart)) quran.add(date);
  }
  for (const ended of sources.practiceSessionEnds) {
    const date = localDateOf(ended);
    if (inRange(date)) quran.add(date);
  }

  const adhkar = new Set<string>();
  for (const [date, counts] of zikrCountsByDate([...sources.zikrProgress])) {
    if (!inRange(date)) continue;
    const sets = adhkarSetsForDay(counts);
    if (sets[MORNING_SET]?.done || sets[EVENING_SET]?.done) adhkar.add(date);
  }

  const habitDone = new Map<string, Set<string>>();
  const habits = selectedHabits(sources.habits);
  for (const habit of habits) {
    const done = new Set<string>();
    for (const date of datesIn(from, to)) {
      if (habitProgress(sources.habits, habit, date, sources.habitContext).done) done.add(date);
    }
    habitDone.set(habit.id, done);
    if (isQuranRecitationHabit(habit.id)) for (const date of done) quran.add(date);
  }

  const fasted = new Set<string>();
  for (const [date, entry] of Object.entries(sources.voluntaryFasting)) {
    if (inRange(date) && isLiveFastEntry(entry) && entry.status === "fasted" && !entry.asQaza) {
      fasted.add(date);
    }
  }

  const qaza = new Set<string>();
  for (const [date, day] of Object.entries(sources.qazaDailyProgress)) {
    if (!inRange(date)) continue;
    if (Object.values(day.completed).some((n) => (n ?? 0) > 0)) qaza.add(date);
  }

  return { quran, adhkar, habitDone, fasted, qaza };
}

function countIn(dates: ReadonlySet<string>, from: string, to: string): number {
  let n = 0;
  for (const date of dates) if (date >= from && date <= to) n += 1;
  return n;
}

/** One week's stats from the statistics engine plus the activity index. */
function coachWeekStats(
  sources: CoachSources,
  index: PrayerDayIndex,
  activity: ActivityIndex,
  weekStart: string,
): CoachWeekStats {
  const weekEnd = addDays(weekStart, 6);
  const points = dailyPoints(index, weekStart, weekEnd, sources.today);
  const summary = summarizePeriod(index, points);
  const rows = salahBreakdown(index, points, FARD);

  const fard = {} as Record<ObligatoryPrayer, CoachPrayerWeek>;
  for (const row of rows) {
    fard[row.prayerId as ObligatoryPrayer] = {
      onTime: row.completed,
      delayed: row.delayed,
      jama: 0,
      days: row.days,
    };
  }
  for (const log of sources.prayerLogs) {
    if (log.date < weekStart || log.date > weekEnd || !log.isJama || log.isExcused) continue;
    if (log.status !== "completed" && log.status !== "delayed") continue;
    const row = fard[log.prayerId as ObligatoryPrayer];
    if (row) row.jama += 1;
  }

  const weekdayLevels: (number | null)[] = new Array(7).fill(null);
  for (const point of points) {
    const counts = !point.beforeStart && !point.excused && (!point.isToday || point.hasLogs);
    if (counts) weekdayLevels[parseLocalDateString(point.date).getDay()] = point.level;
  }

  const cells = rawatibConsistency(
    sources.prayerLogs as PrayerLog[],
    weekStart,
    weekEnd,
    sources.today,
  );
  const rawatibSummary = summarizeRawatib(cells);
  const countedCells = cells.filter(
    (cell) => !cell.beforeStart && !cell.excused && !(cell.isToday && cell.done === 0),
  );
  let fajrDays = 0;
  for (const cell of countedCells) {
    if (index.days.get(cell.date)?.statuses.fajr_before === "completed") fajrDays += 1;
  }

  const active = new Set<string>();
  for (const point of points) {
    const day = index.days.get(point.date);
    if (day && day.completed + day.delayed + day.qaza + day.missed > 0) active.add(point.date);
  }
  for (const set of [
    activity.quran,
    activity.adhkar,
    activity.fasted,
    activity.qaza,
    ...activity.habitDone.values(),
  ]) {
    for (const date of set) if (date >= weekStart && date <= weekEnd) active.add(date);
  }

  return {
    weekStart,
    countedDays: summary.countedDays,
    excusedDays: summary.excusedDays,
    activeDays: active.size,
    perfectDays: summary.perfectDays,
    fard,
    weekdayLevels,
    rawatib: {
      done: rawatibSummary.rowsCompleted,
      possible: countedCells.reduce((sum, cell) => sum + cell.total, 0),
      fajrDays,
    },
    quranDays: countIn(activity.quran, weekStart, weekEnd),
    adhkarDays: countIn(activity.adhkar, weekStart, weekEnd),
  };
}

function dominantReason(
  logs: readonly PrayerLog[],
  from: string,
  to: string,
): ExcusedReason | null {
  const byDate = new Map<string, ExcusedReason>();
  for (const log of logs) {
    if (log.isExcused && log.date >= from && log.date <= to) {
      byDate.set(log.date, log.excusedReason ?? "sick");
    }
  }
  const tally = new Map<ExcusedReason, number>();
  for (const reason of byDate.values()) tally.set(reason, (tally.get(reason) ?? 0) + 1);
  let best: ExcusedReason | null = null;
  for (const [reason, n] of tally) if (!best || n > (tally.get(best) ?? 0)) best = reason;
  return best;
}

function khushuByPrayer(
  entries: readonly KhushuEntry[],
  from: string,
  to: string,
): Partial<Record<ObligatoryPrayer, CoachKhushuInput>> {
  const sums = new Map<ObligatoryPrayer, { sum: number; n: number }>();
  for (const entry of entries) {
    if (entry.date < from || entry.date > to) continue;
    if (!OBLIGATORY_PRAYER_SET.has(entry.prayerId)) continue;
    const key = entry.prayerId as ObligatoryPrayer;
    const acc = sums.get(key) ?? { sum: 0, n: 0 };
    acc.sum += entry.rating;
    acc.n += 1;
    sums.set(key, acc);
  }
  const out: Partial<Record<ObligatoryPrayer, CoachKhushuInput>> = {};
  for (const [prayer, { sum, n }] of sums) out[prayer] = { average: sum / n, entries: n };
  return out;
}

function khatmDaysBehind(khatm: CoachSources["khatm"], today: string): number {
  const { plan, read } = khatm;
  if (!plan) return 0;
  if (read >= khatmTotalForUnit(plan.unit ?? "ayah")) return 0;
  const daily = dailyTargetForPlan(plan);
  if (daily <= 0) return 0;
  return Math.max(0, Math.floor((expectedAyahsBeforeToday(plan, today) - read) / daily));
}

/** Pure: everything the engine needs, from already-loaded tracker data. */
export function buildCoachContext(sources: CoachSources): CoachContext {
  const { weekStart, today } = sources;
  const weekEnd = addDays(weekStart, 6);
  const earliest = addDays(weekStart, -7 * COACH_PREVIOUS_WEEKS);
  const logs = sources.prayerLogs as PrayerLog[];
  const index = indexPrayerDays(logs);
  const activity = buildActivityIndex(sources, earliest, weekEnd);

  const week = coachWeekStats(sources, index, activity, weekStart);
  const previousWeeks = Array.from({ length: COACH_PREVIOUS_WEEKS }, (_, i) =>
    coachWeekStats(sources, index, activity, addDays(weekStart, -7 * (i + 1))),
  );

  const upToWeekEnd = logs.filter((log) => log.date <= weekEnd);
  const beforeWeek = logs.filter((log) => log.date < weekStart);

  const remaining = sources.qazaCounters.reduce((sum, c) => sum + Math.max(0, c.remaining), 0);
  const projection =
    remaining > 0
      ? projectQazaFinish(remaining, sources.qazaDailyProgress, sources.qazaSchedule, today)
      : null;

  return {
    week,
    previousWeeks,
    excused: {
      active: sources.prefs.activeExcusedReason ?? null,
      dominant: dominantReason(logs, weekStart, weekEnd),
    },
    streak: {
      current: computeStreak(upToWeekEnd, true, weekEnd),
      best: longestStreak(upToWeekEnd),
      bestBeforeWeek: longestStreak(beforeWeek),
    },
    qaza:
      remaining > 0
        ? {
            remaining,
            madeUpThisWeek: sumQazaMadeUp(sources.qazaDailyProgress, weekStart, weekEnd),
            perDay: projection?.perDay ?? null,
            finishDate: projection?.finishDate ?? null,
          }
        : null,
    khatm: {
      hasPlan: sources.khatm.plan != null,
      daysBehind: khatmDaysBehind(sources.khatm, today),
    },
    khushu: khushuByPrayer(sources.khushu, addDays(weekEnd, -(COACH_KHUSHU_DAYS - 1)), weekEnd),
    habits: selectedHabits(sources.habits).map((habit) => ({
      id: habit.id,
      doneDays: countIn(activity.habitDone.get(habit.id) ?? new Set(), weekStart, weekEnd),
    })),
    voluntaryFastsKept: countIn(activity.fasted, weekStart, weekEnd),
    homeMasjidSet: sources.prefs.homeMasjid != null,
    bedtime: sources.prefs.bedtime ?? null,
    muhasabah: sources.muhasabah
      ? {
          reviewDays: sources.muhasabah.reviewDays,
          istighfarDays: sources.muhasabah.istighfarDays,
        }
      : null,
    family: sources.family
      ? {
          parentDue: sources.family.parentDue,
          dueCount: sources.family.dueCount,
          contactsThisWeek: sources.family.contactsThisWeek,
        }
      : null,
    // Neutral count only: the 7 days ending at the close of the reviewed week.
    focusLock: sources.focusLock
      ? {
          emergencyUnlocks: emergencyCountLastWeek(
            sources.focusLock.emergencyLog,
            parseLocalDateString(addDays(weekEnd, 1)),
          ),
        }
      : null,
  };
}
