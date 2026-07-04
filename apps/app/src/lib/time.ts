import type { TimeFormat } from "@munib-tracker/shared/types";

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

export function localeToBcp47(locale: string): string {
  if (locale === "ar") return "ar";
  if (locale === "ur") return "ur";
  return "en-US";
}

/** Calendar Y-M-D key in an IANA timezone (device local when omitted). */
export function dayKeyInTimeZone(now: Date, timeZone?: string): string {
  if (!timeZone) {
    return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
  }
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/**
 * Date whose local Y/M/D components match the calendar day in `timeZone`.
 * adhan reads getFullYear/getMonth/getDate — pass this when computing prayer
 * times for a manually-selected city in another timezone than the device.
 */
export function prayerDayAnchor(now: Date, timeZone?: string): Date {
  if (!timeZone) return now;
  const [year, month, day] = dayKeyInTimeZone(now, timeZone).split("-").map(Number);
  return new Date(year, month - 1, day);
}

/** Shifts a prayer-day anchor by whole calendar days. */
export function shiftPrayerDay(anchor: Date, days: number): Date {
  const next = new Date(anchor);
  next.setDate(next.getDate() + days);
  return next;
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
): string {
  const datePart = formatDisplayDate(date, locale);
  const timePart = formatDisplayTime(date, timeFormat);
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
