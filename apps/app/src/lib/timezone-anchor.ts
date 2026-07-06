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
