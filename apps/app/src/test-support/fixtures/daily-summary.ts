import type { DailySummary } from "@munib-tracker/shared/types";

/** A day with some Salah/zikr done and a qaza target set, unless overridden. */
export function buildDailySummary(overrides: Partial<DailySummary> = {}): DailySummary {
  return {
    date: "2026-07-06",
    salahCompleted: 3,
    salahTotal: 5,
    zikrCompleted: 1,
    zikrTotal: 2,
    qazaRemaining: 10,
    qazaTargetToday: 4,
    qazaCompletedToday: 2,
    streakDays: 5,
    ...overrides,
  };
}

/** A day with nothing tracked and nothing scheduled. */
export function buildEmptyDailySummary(overrides: Partial<DailySummary> = {}): DailySummary {
  return buildDailySummary({
    salahCompleted: 0,
    salahTotal: 0,
    zikrCompleted: 0,
    zikrTotal: 0,
    qazaRemaining: 0,
    qazaTargetToday: 0,
    qazaCompletedToday: 0,
    streakDays: 0,
    ...overrides,
  });
}
