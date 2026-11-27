import { addDays, getLocalDateString, parseLocalDateString } from "@munib-tracker/shared/utils";

/**
 * Calendar-day helpers for the private records forms (debts, repayments,
 * wasiyyah). Days are stored as `YYYY-MM-DD`; typing is forgiving so a person
 * writing `2026/1/5` or Eastern Arabic / Persian digits isn't told "invalid".
 */

const ARABIC_INDIC_ZERO = 0x0660;
const PERSIAN_ZERO = 0x06f0;

/** Converts Arabic-Indic and Persian digits to ASCII. */
function asciiDigits(value: string): string {
  return value.replace(/[٠-٩۰-۹]/g, (d) => {
    const code = d.charCodeAt(0);
    return String(code - (code >= PERSIAN_ZERO ? PERSIAN_ZERO : ARABIC_INDIC_ZERO));
  });
}

/** True for a real calendar day in `YYYY-MM-DD` form. */
export function isValidDay(value: string): boolean {
  try {
    parseLocalDateString(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Normalises a typed day to `YYYY-MM-DD`: native digits → ASCII, `/` `.` and
 * spaces as separators, single-digit month/day padded. `null` when it isn't a
 * real calendar day (e.g. `2026-02-30`) or isn't year-first.
 */
export function normalizeDayInput(raw: string): string | null {
  const match = asciiDigits(raw.trim()).match(/^(\d{4})[-/. ](\d{1,2})[-/. ](\d{1,2})$/);
  if (!match) return null;
  const [, year, month, day] = match as unknown as [string, string, string, string];
  const iso = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  return isValidDay(iso) ? iso : null;
}

/** `day` plus whole months, clamped to the last day of a shorter month (31 Jan + 1 → 28/29 Feb). */
export function addMonthsToDay(day: string, months: number): string {
  const date = parseLocalDateString(day);
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  target.setDate(Math.min(date.getDate(), lastDay));
  return getLocalDateString(target);
}

export type DayPresetId = "week" | "month" | "threeMonths";

/** Quick due-date choices offered under a due-date field. */
export function dueDayPresets(today: string): Array<{ id: DayPresetId; day: string }> {
  return [
    { id: "week", day: addDays(today, 7) },
    { id: "month", day: addMonthsToDay(today, 1) },
    { id: "threeMonths", day: addMonthsToDay(today, 3) },
  ];
}
