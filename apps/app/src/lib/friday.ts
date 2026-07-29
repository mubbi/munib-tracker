/** Shared Friday / Jumu'ah helpers used by home, tracker, and knowledge cards. */

/** `?focus=` key — scrolls the Tracker to the Jumu'ah checklist section. */
export const FRIDAY_CHECKLIST_FOCUS = "friday" as const;

export function isFriday(date: Date = new Date()): boolean {
  return date.getDay() === 5;
}

/** Parse a local `YYYY-MM-DD` string and test whether that calendar day is Friday. */
export function isFridayDateString(date: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  // Local noon avoids DST edge cases around midnight.
  return isFriday(new Date(year, month - 1, day, 12, 0, 0));
}

/** Tracker route that opens on the Jumu'ah checklist card. */
export function fridayChecklistHref() {
  return `/tracker?focus=${FRIDAY_CHECKLIST_FOCUS}` as const;
}
