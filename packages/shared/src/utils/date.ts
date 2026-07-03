/**
 * Returns a local calendar date string (YYYY-MM-DD) for the given date,
 * using the runtime's local timezone (not UTC).
 */
export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Parses a YYYY-MM-DD string into a local Date at midnight. */
export function parseLocalDateString(value: string): Date {
  const [year, month, day] = value.split("-").map((part) => Number.parseInt(part, 10));
  return new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1);
}

/** Returns a new YYYY-MM-DD string offset by `days` from the given date string. */
export function addDays(dateString: string, days: number): string {
  const date = parseLocalDateString(dateString);
  date.setDate(date.getDate() + days);
  return getLocalDateString(date);
}

/** Whole-day difference (a - b). Positive when a is after b. */
export function diffInDays(a: string, b: string): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  const da = parseLocalDateString(a).getTime();
  const db = parseLocalDateString(b).getTime();
  return Math.round((da - db) / msPerDay);
}

/** Formats a YYYY-MM-DD string as e.g. "Mon, Jul 3". */
export function formatShortDate(dateString: string): string {
  const date = parseLocalDateString(dateString);
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
