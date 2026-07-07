import type { AppLocale, CalendarMode } from "@munib-tracker/shared/types";

import { formatHijriDate, formatHijriDateCompact } from "./hijri";
import { localeToBcp47 } from "./locale-bcp47";

const COMPACT_GRID_DATE: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
};

/** Hero date line — month, day, and year without the weekday to save space. */
const HERO_GREGORIAN_DATE: Intl.DateTimeFormatOptions = {
  month: "long",
  day: "numeric",
  year: "numeric",
};

const FULL_DATE: Intl.DateTimeFormatOptions = {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
};

/** Formats a calendar date for on-screen display in the user's preferred calendar. */
export function formatCalendarDate(
  date: Date,
  calendar: CalendarMode,
  locale: AppLocale,
  options: Intl.DateTimeFormatOptions = FULL_DATE,
  timeZone?: string,
): string {
  if (calendar === "hijri") {
    return formatHijriDate(date, locale, timeZone);
  }
  return date.toLocaleDateString(localeToBcp47(locale), { ...options, timeZone });
}

export type DualCalendarDates = {
  /** Preferred calendar (from settings) on the first line. */
  primary: string;
  /** The other calendar on the second line. */
  secondary: string;
};

/**
 * Home hero only: Hijri and Gregorian on separate lines, preferred calendar first.
 * Everywhere else should use {@link formatCalendarDate} with the user's default.
 */
export function formatDualCalendarDate(
  date: Date,
  preferredCalendar: CalendarMode,
  locale: AppLocale,
  timeZone?: string,
): DualCalendarDates {
  const hijri = formatHijriDate(date, locale, timeZone);
  const gregorian = date.toLocaleDateString(localeToBcp47(locale), {
    ...HERO_GREGORIAN_DATE,
    timeZone,
  });
  return preferredCalendar === "hijri"
    ? { primary: hijri, secondary: gregorian }
    : { primary: gregorian, secondary: hijri };
}

/** Formats an ISO YYYY-MM-DD date string in the user's preferred calendar. */
export function formatCalendarDateFromIso(
  iso: string,
  calendar: CalendarMode,
  locale: AppLocale,
  options?: Intl.DateTimeFormatOptions,
): string {
  return formatCalendarDate(new Date(`${iso}T00:00:00`), calendar, locale, options);
}

/** Short month+day label for streak grids (e.g. "Jul 6", "Ram 17"). */
export function formatCompactGridDateFromIso(
  iso: string,
  calendar: CalendarMode,
  locale: AppLocale,
): string {
  const date = new Date(`${iso}T00:00:00`);
  if (calendar === "hijri") {
    return formatHijriDateCompact(date, locale);
  }
  return date.toLocaleDateString(localeToBcp47(locale), COMPACT_GRID_DATE);
}
