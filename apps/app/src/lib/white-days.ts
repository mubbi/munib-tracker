/**
 * Shared White Days (Ayyām al-Bīḍ) helpers used by home, tracker, and the moon
 * sheet. The White Days are the 13th, 14th and 15th of each Hijri month; the
 * exact Gregorian dates are resolved from the app's Hijri engine (`hijri.ts`),
 * so they follow the same moon-sighting authority as the rest of the app.
 *
 * "White Day" here means a day a White Day fast may be suggested: the lunar
 * 13th–15th minus the days no voluntary fast can be logged on — 13 Dhul-Hijjah
 * is a day of Tashriq (prohibited, Muslim 1141) and Ramadan days belong to the
 * Ramadan log (`voluntaryFastBlockForHijri`, the same gate as `/fasting`). So the
 * tracker section, the home banner and the reminder never invite a blocked fast.
 */
import { WHITE_DAYS_CHECKLIST } from "@munib-tracker/shared/content/white-days-checklist";
import type { WhiteDaysChecklistItem } from "@munib-tracker/shared/types";
import { getLocalDateString, voluntaryFastBlockForHijri } from "@munib-tracker/shared/utils";

import { gregorianToHijri, type HijriDate, hijriToGregorian } from "@/lib/hijri";

/** Hijri days-of-month that make up the White Days. */
export const WHITE_DAYS_HIJRI = [13, 14, 15] as const;

/** `?focus=` key — scrolls the Tracker to the White Days checklist section. */
export const WHITE_DAYS_CHECKLIST_FOCUS = "white-days" as const;

/** The lunar 13th, 14th or 15th, whatever the month (no fasting rules applied). */
export function isLunarWhiteDayHijri(hijri: Pick<HijriDate, "day">): boolean {
  return hijri.day >= 13 && hijri.day <= 15;
}

/**
 * True when a White Day fast may be suggested: the 13th–15th, except 13
 * Dhul-Hijjah (Tashriq) and Ramadan.
 */
export function isWhiteDayHijri(hijri: HijriDate): boolean {
  return isLunarWhiteDayHijri(hijri) && voluntaryFastBlockForHijri(hijri) == null;
}

/** True when the given Gregorian date falls on a White Day. */
export function isWhiteDay(date: Date = new Date(), timeZone?: string): boolean {
  return isWhiteDayHijri(gregorianToHijri(date, timeZone));
}

/** Parse a local `YYYY-MM-DD` string and test whether that day is a White Day. */
export function isWhiteDayDateString(date: string, timeZone?: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  // Local noon avoids DST edge cases around midnight.
  return isWhiteDay(new Date(year, month - 1, day, 12, 0, 0), timeZone);
}

/** The lunar 13th–15th for a local `YYYY-MM-DD` (ignores fasting rules; e.g. Hijri correction checks). */
export function isLunarWhiteDayDateString(date: string, timeZone?: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) return false;
  const at = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12, 0, 0);
  return isLunarWhiteDayHijri(gregorianToHijri(at, timeZone));
}

/**
 * Stable key that scopes checklist progress to a Hijri month, e.g. "1448-2".
 * Derived from the Hijri date of the given day so all three White Days in a
 * month share one bucket.
 */
export function whiteDaysHijriMonthKey(date: Date = new Date(), timeZone?: string): string {
  const { year, month } = gregorianToHijri(date, timeZone);
  return `${year}-${month}`;
}

/** Hijri month key from a local `YYYY-MM-DD` string (empty when unparseable). */
export function whiteDaysHijriMonthKeyForDateString(date: string, timeZone?: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) return "";
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  return whiteDaysHijriMonthKey(new Date(year, month - 1, day, 12, 0, 0), timeZone);
}

/**
 * The three White Days of a Hijri month resolved to local `YYYY-MM-DD` strings,
 * paired with the Hijri day each represents.
 */
export function whiteDaysForHijriMonth(
  year: number,
  month: number,
): Array<{ hijriDay: number; date: string }> {
  return WHITE_DAYS_HIJRI.map((hijriDay) => ({
    hijriDay,
    date: getLocalDateString(hijriToGregorian(year, month, hijriDay)),
  }));
}

export interface WhiteDayFast {
  item: WhiteDaysChecklistItem;
  hijriDay: number;
  /** Local `YYYY-MM-DD` of the fast. */
  date: string;
}

/**
 * The White Day fasts that may be logged in a Hijri month (the checklist rows):
 * all three normally, only the 14th and 15th in Dhul-Hijjah, none in Ramadan.
 */
export function whiteDayFastsForHijriMonth(year: number, month: number): WhiteDayFast[] {
  return WHITE_DAYS_CHECKLIST.filter((item) =>
    isWhiteDayHijri({ year, month, day: item.hijriDay }),
  ).map((item) => ({
    item,
    hijriDay: item.hijriDay,
    date: getLocalDateString(hijriToGregorian(year, month, item.hijriDay)),
  }));
}

/** Tracker route that opens on the White Days checklist card. */
export function whiteDaysChecklistHref() {
  return `/tracker?focus=${WHITE_DAYS_CHECKLIST_FOCUS}` as const;
}
