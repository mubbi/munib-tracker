import type { CalendarMode, TimeFormat } from "@munib-tracker/shared/types";

import { formatCalendarDate } from "./calendar-format";
import { localeToBcp47, toAppLocale } from "./locale-bcp47";
import { prayerDayAnchor, shiftPrayerDay } from "./timezone-anchor";

export { localeToBcp47 } from "./locale-bcp47";
export { dayKeyInTimeZone, prayerDayAnchor, shiftPrayerDay } from "./timezone-anchor";

/** Parses an "HH:mm" string into hour/minute, with a safe fallback. */
export function parseHhMm(
  value: string | undefined,
  fallback: { hour: number; minute: number } = { hour: 8, minute: 0 },
): { hour: number; minute: number } {
  const [h, m] = (value ?? "").split(":").map((part) => Number.parseInt(part, 10));
  return {
    hour: Number.isFinite(h) ? (h as number) : fallback.hour,
    minute: Number.isFinite(m) ? (m as number) : fallback.minute,
  };
}

/** Formats hour/minute as a zero-padded "HH:mm" string (internal storage). */
export function formatHhMm(hour: number, minute: number): string {
  return `${`${hour}`.padStart(2, "0")}:${`${minute}`.padStart(2, "0")}`;
}

export function usesHour12(format: TimeFormat): boolean {
  return format === "12";
}

type ZonedParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};

/** Calendar + clock parts for an instant in an IANA timezone. */
export function getZonedParts(date: Date, timeZone?: string): ZonedParts {
  if (!timeZone) {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
    };
  }
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const pick = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);
  return {
    year: pick("year"),
    month: pick("month"),
    day: pick("day"),
    hour: pick("hour"),
    minute: pick("minute"),
  };
}

/**
 * Absolute instant for a wall-clock HH:mm on a calendar day in `timeZone`.
 * Matches the hero banner's location-timezone semantics.
 */
export function wallClockInTimeZoneToDate(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone?: string,
): Date {
  if (!timeZone) {
    return new Date(year, month - 1, day, hour, minute, 0, 0);
  }

  let candidate = new Date(Date.UTC(year, month - 1, day, hour, minute, 0, 0));
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const parts = getZonedParts(candidate, timeZone);
    const desired = Date.UTC(year, month - 1, day, hour, minute);
    const actual = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute);
    const deltaMinutes = (desired - actual) / 60_000;
    if (Math.abs(deltaMinutes) < 1) break;
    candidate = new Date(candidate.getTime() + deltaMinutes * 60_000);
  }
  return candidate;
}

/** Next future instant for HH:mm in a location timezone (today or tomorrow). */
export function nextWallClockInTimeZone(
  hour: number,
  minute: number,
  timeZone?: string,
  now = new Date(),
): Date {
  const anchor = prayerDayAnchor(now, timeZone);
  const y = anchor.getFullYear();
  const m = anchor.getMonth() + 1;
  const d = anchor.getDate();
  let candidate = wallClockInTimeZoneToDate(y, m, d, hour, minute, timeZone);
  if (candidate.getTime() <= now.getTime()) {
    const tomorrow = shiftPrayerDay(anchor, 1);
    candidate = wallClockInTimeZoneToDate(
      tomorrow.getFullYear(),
      tomorrow.getMonth() + 1,
      tomorrow.getDate(),
      hour,
      minute,
      timeZone,
    );
  }
  return candidate;
}

/** Formats a calendar date for on-screen display. */
export function formatDisplayDate(
  date: Date,
  locale = "en",
  options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" },
): string {
  return date.toLocaleDateString(localeToBcp47(locale), options);
}

/**
 * Formats a Date for on-screen display according to the user's clock preference.
 * Pass `timeZone` (an IANA id) to render the instant in a specific city's clock —
 * e.g. a manually-selected location in a different timezone than the device.
 */
export function formatDisplayTime(
  date: Date,
  format: TimeFormat = "24",
  timeZone?: string,
): string {
  const hour12 = usesHour12(format);
  return date.toLocaleTimeString([], {
    hour: hour12 ? "numeric" : "2-digit",
    minute: "2-digit",
    hour12,
    timeZone,
  });
}

/** Formats hour/minute for on-screen display according to the user's clock preference. */
export function formatDisplayHhMm(hour: number, minute: number, format: TimeFormat = "24"): string {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return formatDisplayTime(date, format);
}

/** Formats a full date and time for notification timestamps. */
export function formatDisplayDateTime(
  date: Date,
  timeFormat: TimeFormat = "24",
  locale = "en",
  timeZone?: string,
  calendar: CalendarMode = "gregorian",
): string {
  const appLocale = toAppLocale(locale);
  const datePart = formatCalendarDate(
    date,
    calendar,
    appLocale,
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
    timeZone,
  );
  const timePart = formatDisplayTime(date, timeFormat, timeZone);
  return `${datePart}, ${timePart}`;
}

/** Formats a stored "HH:mm" value for display. */
export function formatStoredTime(
  hhMm: string | undefined,
  format: TimeFormat = "24",
  fallback: { hour: number; minute: number } = { hour: 8, minute: 0 },
): string {
  const { hour, minute } = parseHhMm(hhMm, fallback);
  return formatDisplayHhMm(hour, minute, format);
}

export type DayPeriod = "AM" | "PM";

/** Converts 24-hour clock to 12-hour display parts. */
export function to12HourParts(hour24: number): { hour: number; period: DayPeriod } {
  const period: DayPeriod = hour24 >= 12 ? "PM" : "AM";
  const hour = hour24 % 12 || 12;
  return { hour, period };
}

/** Converts 12-hour display parts to 24-hour clock. */
export function from12HourParts(hour12: number, period: DayPeriod): number {
  if (period === "AM") return hour12 === 12 ? 0 : hour12;
  return hour12 === 12 ? 12 : hour12 + 12;
}
