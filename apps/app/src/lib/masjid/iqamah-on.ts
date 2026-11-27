import {
  type IqamahTimetable,
  iqamahTimeFor,
  jumuahIqamahTimes,
} from "@munib-tracker/shared/masjid";
import type { ObligatoryPrayer } from "@munib-tracker/shared/types";

/** `YYYY-MM-DD` local date key from calendar parts. */
export function dateKeyOf(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function isFridayKey(date: string): boolean {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1)).getUTCDay() === 5;
}

/**
 * Pure iqamah lookup for one local date. On Fridays Dhuhr resolves to the
 * earliest Jumu'ah iqamah (or nothing — a weekday Dhuhr time is never reused
 * for Jumu'ah). Null ⇒ no times; callers fall back to the adhan time.
 */
export function iqamahOn(
  date: string,
  prayer: ObligatoryPrayer,
  timetable: IqamahTimetable | null | undefined,
): string | null {
  if (!timetable) return null;
  if (prayer === "dhuhr" && isFridayKey(date)) {
    return jumuahIqamahTimes(timetable)[0] ?? null;
  }
  return iqamahTimeFor(timetable, date, prayer);
}
