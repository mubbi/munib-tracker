import { getLocalDateString } from "@munib-tracker/shared/utils";

import { gregorianToHijri, hijriMonthLength, hijriToGregorian } from "@/lib/hijri";

export interface CalendarDay {
  date: string;
  day: number;
  inMonth: boolean;
  isToday: boolean;
  isFuture: boolean;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const WEEKDAYS = [
  { key: "sun", label: "S" },
  { key: "mon", label: "M" },
  { key: "tue", label: "T" },
  { key: "wed", label: "W" },
  { key: "thu", label: "T" },
  { key: "fri", label: "F" },
  { key: "sat", label: "S" },
];

function toDateString(year: number, month: number, day: number): string {
  const m = `${month + 1}`.padStart(2, "0");
  const d = `${day}`.padStart(2, "0");
  return `${year}-${m}-${d}`;
}

/** Builds a Sunday-first grid of weeks covering the given month, with adjacent-month padding. */
export function buildMonthGrid(
  year: number,
  month: number,
  today: string = getLocalDateString(),
): CalendarDay[][] {
  const startWeekday = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weekCount = Math.ceil((startWeekday + daysInMonth) / 7);

  const weeks: CalendarDay[][] = [];
  const cursor = new Date(year, month, 1 - startWeekday);

  for (let week = 0; week < weekCount; week += 1) {
    const days: CalendarDay[] = [];
    for (let i = 0; i < 7; i += 1) {
      const date = toDateString(cursor.getFullYear(), cursor.getMonth(), cursor.getDate());
      days.push({
        date,
        day: cursor.getDate(),
        inMonth: cursor.getMonth() === month,
        isToday: date === today,
        isFuture: date > today,
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(days);
  }

  return weeks;
}

/** Sunday-first week row containing the given ISO date (Gregorian-keyed cells). */
export function buildWeekContainingDate(
  anchorDate: string,
  today: string = getLocalDateString(),
): CalendarDay[] {
  const anchor = new Date(`${anchorDate}T00:00:00`);
  const cursor = new Date(anchor);
  cursor.setDate(cursor.getDate() - anchor.getDay());

  const days: CalendarDay[] = [];
  for (let i = 0; i < 7; i += 1) {
    const date = toDateString(cursor.getFullYear(), cursor.getMonth(), cursor.getDate());
    days.push({
      date,
      day: cursor.getDate(),
      inMonth: true,
      isToday: date === today,
      isFuture: date > today,
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  return days;
}

export function monthLabel(year: number, month: number): string {
  return `${MONTH_NAMES[month]} ${year}`;
}

/** Maps an app locale ("en"|"ar"|"ur") to a BCP-47 tag for Intl formatting. */
function localeToBcp47(locale: string): string {
  const base = locale.split("-")[0];
  if (base === "ar") return "ar";
  if (base === "ur") return "ur";
  return "en-US";
}

/**
 * Localized "Month YYYY" label for a Gregorian month via `Intl`, e.g.
 * "July 2026" (en), "يوليو ٢٠٢٦" (ar). Falls back to the English label if
 * `Intl.DateTimeFormat` is unavailable.
 */
/** How many years before/after the anchor year the month picker exposes. */
export const CALENDAR_YEAR_LOOKBACK = 50;
export const CALENDAR_YEAR_LOOKAHEAD = 1;

/** Localized short month names for a Gregorian year grid (Jan–Dec). */
export function localizedMonthNames(locale: string): string[] {
  return Array.from({ length: 12 }, (_, month) => {
    try {
      return new Intl.DateTimeFormat(localeToBcp47(locale), { month: "short" }).format(
        new Date(2024, month, 1),
      );
    } catch {
      return MONTH_NAMES[month].slice(0, 3);
    }
  });
}

export function localizedMonthLabel(year: number, month: number, locale: string): string {
  const date = new Date(year, month, 1);
  try {
    return new Intl.DateTimeFormat(localeToBcp47(locale), {
      month: "long",
      year: "numeric",
    }).format(date);
  } catch {
    return monthLabel(year, month);
  }
}

/**
 * Sunday-first array of localized weekday initials for the active locale, e.g.
 * ["S","M","T","W","T","F","S"] (en). Returns a stable `key` per slot so callers
 * can key list items without relying on (possibly duplicate) labels.
 */
export function localizedWeekdayInitials(locale: string): { key: string; label: string }[] {
  try {
    const formatter = new Intl.DateTimeFormat(localeToBcp47(locale), { weekday: "narrow" });
    // 2023-01-01 is a Sunday; walk seven consecutive days.
    return WEEKDAYS.map((weekday, index) => ({
      key: weekday.key,
      label: formatter.format(new Date(2023, 0, 1 + index)),
    }));
  } catch {
    return WEEKDAYS;
  }
}

/**
 * Builds a Sunday-first grid of weeks covering the given **Hijri** month. Each
 * cell keeps its Gregorian `date` (so activity lookups and day navigation work
 * unchanged) but its `day` is the Hijri day-of-month, and `inMonth` marks cells
 * inside the requested Hijri month.
 */
export function buildHijriMonthGrid(
  hijriYear: number,
  hijriMonth: number,
  today: string = getLocalDateString(),
): CalendarDay[][] {
  const firstDay = hijriToGregorian(hijriYear, hijriMonth, 1);
  const daysInMonth = hijriMonthLength(hijriYear, hijriMonth);
  const startWeekday = firstDay.getDay(); // 0 = Sunday
  const weekCount = Math.ceil((startWeekday + daysInMonth) / 7);

  const weeks: CalendarDay[][] = [];
  const cursor = new Date(firstDay);
  cursor.setDate(cursor.getDate() - startWeekday);

  for (let week = 0; week < weekCount; week += 1) {
    const days: CalendarDay[] = [];
    for (let i = 0; i < 7; i += 1) {
      const date = toDateString(cursor.getFullYear(), cursor.getMonth(), cursor.getDate());
      const hijri = gregorianToHijri(cursor);
      days.push({
        date,
        day: hijri.day,
        inMonth: hijri.month === hijriMonth && hijri.year === hijriYear,
        isToday: date === today,
        isFuture: date > today,
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(days);
  }

  return weeks;
}
