import type { DhulHijjahState, SunnahHabitsState } from "@munib-tracker/shared/types";

import { EMPTY_HABIT_CONTEXT, EMPTY_SUNNAH_HABITS, type HabitContext } from "@/lib/sunnah-habits";

/**
 * NF-3.3: 1 Dhul-Hijjah 1448 per `lib/hijri.ts` with no observer (Umm al-Qura),
 * cross-checked against ICU `islamic-umalqura`: Friday 7 May 2027.
 * Arafah = 2027-05-15, Eid al-Adha = 2027-05-16, last day of Tashriq = 2027-05-19.
 */
export const DHUL_HIJJAH_1448 = {
  year: 1448,
  start: "2027-05-07",
  arafah: "2027-05-15",
  eid: "2027-05-16",
  lastTashriq: "2027-05-19",
  /** 25 Dhul-Qa'dah 1448 — the first teaser day. */
  teaserFrom: "2027-05-02",
  /** 29 Dhul-Qa'dah 1448 — the eve of the ten (that Dhul-Qa'dah has 29 days). */
  eve: "2027-05-06",
} as const;

/** Local-noon `Date` for a YYYY-MM-DD (avoids midnight edges in Hijri lookups). */
export function noonOf(date: string): Date {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y as number, (m as number) - 1, d as number, 12, 0, 0);
}

export function buildSunnahHabitsState(
  overrides: Partial<SunnahHabitsState> = {},
): SunnahHabitsState {
  return { ...EMPTY_SUNNAH_HABITS, ...overrides };
}

export function buildHabitContext(overrides: Partial<HabitContext> = {}): HabitContext {
  return { ...EMPTY_HABIT_CONTEXT, ...overrides };
}

export function buildDhulHijjahState(overrides: Partial<DhulHijjahState> = {}): DhulHijjahState {
  return { hijriYear: DHUL_HIJJAH_1448.year, dailyChecks: {}, tashriq: {}, ...overrides };
}
