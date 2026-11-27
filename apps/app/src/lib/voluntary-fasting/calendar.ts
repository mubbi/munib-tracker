import type { FastDayClassification, VoluntaryFastingMap } from "@munib-tracker/shared/types";
import {
  addDays,
  classifyFastDay,
  type FastingCalendarContext,
  getLocalDateString,
  isPlannedFastEntry,
} from "@munib-tracker/shared/utils";

import { preferencesStore } from "@/stores/preferences-store";
import { voluntaryFastingStore } from "@/stores/voluntary-fasting-store";

import { buildFastingContext, type FastingPrefsInput } from "./context";

export { type FastingPrefsInput, hijriForDateKey } from "./context";

/**
 * App-side voluntary fasting calendar: injects the app's Hijri engine (moon-
 * sighting authority + the user's Hijri adjustment, D14) into the pure shared
 * classifier, plus the user's madhhab and log.
 */

/** Builds the classifier context from preferences + the log (defaults: the live stores). */
export function fastingCalendarContext(
  prefs: FastingPrefsInput = preferencesStore.getState().prefs,
  entries: VoluntaryFastingMap = voluntaryFastingStore.getState().entries,
): FastingCalendarContext {
  return buildFastingContext(prefs, entries);
}

/** Classifies one local day against the user's prefs, school and log. */
export function classifyDate(
  dateKey: string,
  ctx: FastingCalendarContext = fastingCalendarContext(),
): FastDayClassification {
  return classifyFastDay(dateKey, ctx);
}

export interface FastingDay {
  date: string;
  classification: FastDayClassification;
}

/** Every day in the inclusive range `[from, to]` (local `YYYY-MM-DD`), capped at 400 days. */
export function fastingDaysForRange(
  from: string,
  to: string,
  ctx: FastingCalendarContext = fastingCalendarContext(),
): FastingDay[] {
  const out: FastingDay[] = [];
  for (let date = from, i = 0; date <= to && i < 400; date = addDays(date, 1), i += 1) {
    out.push({ date, classification: classifyFastDay(date, ctx) });
  }
  return out;
}

/** The next `days` days starting today (the hub's 30-day strip). */
export function upcomingFastingDays(
  days = 30,
  today = getLocalDateString(),
  ctx: FastingCalendarContext = fastingCalendarContext(),
): FastingDay[] {
  return fastingDaysForRange(today, addDays(today, days - 1), ctx);
}

/** True when the user has planned (intended) or kept a voluntary fast on this day. */
export function isIntendedFast(
  dateKey: string,
  entries: VoluntaryFastingMap = voluntaryFastingStore.getState().entries,
): boolean {
  return isPlannedFastEntry(entries[dateKey]);
}
