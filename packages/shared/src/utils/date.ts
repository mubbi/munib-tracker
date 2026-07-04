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

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Parses a YYYY-MM-DD string into a local Date at midnight.
 * Throws on malformed input so bugs fail loudly instead of silently yielding an
 * Invalid Date that propagates as NaN through downstream date math.
 */
export function parseLocalDateString(value: string): Date {
  if (!DATE_PATTERN.test(value)) {
    throw new RangeError(`Invalid date string: "${value}" (expected YYYY-MM-DD)`);
  }
  const [year, month, day] = value.split("-").map((part) => Number.parseInt(part, 10)) as [
    number,
    number,
    number,
  ];
  const date = new Date(year, month - 1, day);
  // The regex accepts out-of-range fields (e.g. "2026-13-45"); the Date
  // constructor would silently roll those over into a valid-but-wrong day.
  // Verify each field round-trips so genuinely invalid calendar dates throw.
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    throw new RangeError(`Invalid date string: "${value}" (out-of-range calendar date)`);
  }
  return date;
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
