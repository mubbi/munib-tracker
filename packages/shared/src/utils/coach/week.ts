import { addDays, parseLocalDateString } from "../date";

/** Friday — "after Jumu'ah" — unless the user picks another day (plan NF-3.14). */
export const COACH_DEFAULT_WEEKDAY = 5;

/** A stored weekday (0 = Sunday … 6 = Saturday), falling back to Friday. */
export function normalizeCoachWeekday(value: unknown): number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 6
    ? value
    : COACH_DEFAULT_WEEKDAY;
}

export interface CoachWeekWindow {
  /** The latest reflection day on or before `today`. */
  reportDate: string;
  /** The reviewed week: the 7 days before `reportDate`. */
  weekStart: string;
  weekEnd: string;
  /** The reflection day after this one. */
  nextReportDate: string;
}

/**
 * The week a reflection reviews. The report is stable from its reflection day
 * until the next one, so re-opening it never reshuffles the insights.
 */
export function coachWeekFor(today: string, weekday: number): CoachWeekWindow {
  const day = normalizeCoachWeekday(weekday);
  const back = (parseLocalDateString(today).getDay() - day + 7) % 7;
  const reportDate = addDays(today, -back);
  return {
    reportDate,
    weekStart: addDays(reportDate, -7),
    weekEnd: addDays(reportDate, -1),
    nextReportDate: addDays(reportDate, 7),
  };
}
