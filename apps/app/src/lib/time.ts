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

/** Formats a Date for on-screen display according to the user's clock preference. */
export function formatDisplayTime(date: Date, format: TimeFormat = "24"): string {
  const hour12 = usesHour12(format);
  return date.toLocaleTimeString([], {
    hour: hour12 ? "numeric" : "2-digit",
    minute: "2-digit",
    hour12,
  });
}

/** Formats hour/minute for on-screen display according to the user's clock preference. */
export function formatDisplayHhMm(hour: number, minute: number, format: TimeFormat = "24"): string {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return formatDisplayTime(date, format);
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
