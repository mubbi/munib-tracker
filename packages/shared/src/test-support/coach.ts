import type {
  CoachContext,
  CoachPrayerWeek,
  CoachWeekStats,
  ObligatoryPrayer,
} from "../types/index";
import { addDays } from "../utils/date";

/**
 * Fixture weeks for the NF-3.14 coach engine. `makeCoachWeek` starts from a
 * steady, fully on-time week; tests override only what the rule looks at.
 */

const FARD: readonly ObligatoryPrayer[] = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

export function prayerWeek(overrides: Partial<CoachPrayerWeek> = {}): CoachPrayerWeek {
  return { onTime: 7, delayed: 0, jama: 0, days: 7, ...overrides };
}

export type CoachWeekOverrides = Omit<Partial<CoachWeekStats>, "fard"> & {
  fard?: Partial<Record<ObligatoryPrayer, Partial<CoachPrayerWeek>>>;
};

export function makeCoachWeek(
  weekStart: string,
  overrides: CoachWeekOverrides = {},
): CoachWeekStats {
  const { fard = {}, ...rest } = overrides;
  return {
    weekStart,
    countedDays: 7,
    excusedDays: 0,
    activeDays: 7,
    perfectDays: 7,
    fard: Object.fromEntries(FARD.map((p) => [p, prayerWeek(fard[p])])) as Record<
      ObligatoryPrayer,
      CoachPrayerWeek
    >,
    weekdayLevels: [1, 1, 1, 1, 1, 1, 1],
    rawatib: { done: 20, possible: 35, fajrDays: 5 },
    quranDays: 0,
    adhkarDays: 0,
    ...rest,
  };
}

/** `count` steady weeks before `weekStart`, newest first (for `previousWeeks`). */
export function makePreviousWeeks(
  weekStart: string,
  count: number,
  overrides: CoachWeekOverrides = {},
): CoachWeekStats[] {
  return Array.from({ length: count }, (_, i) =>
    makeCoachWeek(addDays(weekStart, -7 * (i + 1)), overrides),
  );
}

/** A neutral context around one week: no qaza, no plan, vault readable but empty. */
export function makeCoachContext(
  week: CoachWeekStats,
  overrides: Partial<CoachContext> = {},
): CoachContext {
  return {
    week,
    previousWeeks: [],
    excused: { active: null, dominant: null },
    streak: { current: 0, best: 0, bestBeforeWeek: 0 },
    qaza: null,
    khatm: { hasPlan: false, daysBehind: 0 },
    khushu: {},
    habits: [],
    voluntaryFastsKept: 0,
    homeMasjidSet: false,
    bedtime: "22:30",
    muhasabah: { reviewDays: 0, istighfarDays: 0 },
    family: { parentDue: false, dueCount: 0, contactsThisWeek: 0 },
    ...overrides,
  };
}

/** An empty first week (nothing tracked yet). */
export function makeEmptyCoachWeek(weekStart: string): CoachWeekStats {
  return makeCoachWeek(weekStart, {
    countedDays: 0,
    activeDays: 0,
    perfectDays: 0,
    fard: Object.fromEntries(FARD.map((p) => [p, { onTime: 0, days: 0 }])),
    weekdayLevels: [null, null, null, null, null, null, null],
    rawatib: { done: 0, possible: 0, fajrDays: 0 },
  });
}
