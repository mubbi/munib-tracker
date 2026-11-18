import type { QazaCounter, QazaDailyProgress, QazaSchedule } from "@munib-tracker/shared/types";

/** A Fajr qaza counter with 10 remaining unless overridden. */
export function buildQazaCounter(overrides: Partial<QazaCounter> = {}): QazaCounter {
  return { prayerId: "fajr", remaining: 10, completed: 0, ...overrides };
}

/** A daily qaza plan (one Fajr per day unless overridden). */
export function buildQazaSchedule(overrides: Partial<QazaSchedule> = {}): QazaSchedule {
  return { targets: { fajr: 1 }, ...overrides };
}

/** Qaza made up on `2026-07-06` (nothing yet unless overridden). */
export function buildQazaDailyProgress(
  overrides: Partial<QazaDailyProgress> = {},
): QazaDailyProgress {
  return { date: "2026-07-06", completed: {}, ...overrides };
}
