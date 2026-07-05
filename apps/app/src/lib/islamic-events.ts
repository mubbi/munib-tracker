import { getLocalDateString } from "@munib-tracker/shared/utils";

import { gregorianToHijri, hijriToGregorian } from "./hijri";

/**
 * Fixed-date Islamic events (NF-2.1), by Hijri month/day. Dates are calculated
 * (Umm al-Qura) estimates — the actual day depends on local moon-sighting, so the
 * UI carries a disclaimer. Recurring White Days (13–15 monthly) are surfaced by
 * the moon sheet instead of here.
 */
export interface IslamicEventDef {
  id: string;
  /** Hijri month, 1–12. */
  month: number;
  /** Hijri day, 1–30. */
  day: number;
}

export const ISLAMIC_EVENTS: IslamicEventDef[] = [
  { id: "newYear", month: 1, day: 1 },
  { id: "ashura", month: 1, day: 10 },
  { id: "mawlid", month: 3, day: 12 },
  { id: "isra", month: 7, day: 27 },
  { id: "ramadan", month: 9, day: 1 },
  { id: "laylatQadr", month: 9, day: 27 },
  { id: "eidFitr", month: 10, day: 1 },
  { id: "arafah", month: 12, day: 9 },
  { id: "eidAdha", month: 12, day: 10 },
];

export interface UpcomingEvent {
  id: string;
  /** Gregorian ISO date YYYY-MM-DD of the next occurrence. */
  date: string;
  daysUntil: number;
  hijriYear: number;
}

/** The next `count` upcoming Islamic events from `today`, soonest first. */
export function getUpcomingEvents(
  today: string = getLocalDateString(),
  count = 8,
): UpcomingEvent[] {
  const todayMs = new Date(`${today}T00:00:00`).getTime();
  const currentHijri = gregorianToHijri(new Date(`${today}T00:00:00`));
  const results: UpcomingEvent[] = [];

  // Look at this Hijri year and the next so we always have a full upcoming list.
  for (const year of [currentHijri.year, currentHijri.year + 1]) {
    for (const event of ISLAMIC_EVENTS) {
      const iso = getLocalDateString(hijriToGregorian(year, event.month, event.day));
      if (iso < today) continue;
      const daysUntil = Math.round((new Date(`${iso}T00:00:00`).getTime() - todayMs) / 86_400_000);
      results.push({ id: event.id, date: iso, daysUntil, hijriYear: year });
    }
  }

  return results.sort((a, b) => a.date.localeCompare(b.date)).slice(0, count);
}
