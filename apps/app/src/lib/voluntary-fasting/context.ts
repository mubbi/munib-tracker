import { resolveSchool } from "@munib-tracker/shared/fiqh/core";
import type { UserPreferences, VoluntaryFastingMap } from "@munib-tracker/shared/types";
import type { FastingCalendarContext, HijriDayParts } from "@munib-tracker/shared/utils";

import { gregorianToHijri } from "@/lib/hijri";

import { resolveVoluntaryFastingPrefs } from "./prefs";

/**
 * Store-free pieces of the voluntary fasting calendar (safe to import from the
 * notification builder): the app's Hijri engine — moon-sighting authority plus
 * the user's Hijri adjustment (D14) — and the classifier context.
 */

const DATE_KEY = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Local `YYYY-MM-DD` → Hijri via `lib/hijri.ts` (local noon avoids DST edges). */
export function hijriForDateKey(dateKey: string): HijriDayParts {
  const match = DATE_KEY.exec(dateKey);
  if (!match) throw new RangeError(`Invalid date key: ${dateKey}`);
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12);
  return gregorianToHijri(date);
}

export type FastingPrefsInput = Pick<
  UserPreferences,
  "voluntaryFasting" | "madhhab" | "madhhabOverrides" | "fiqhCustom"
>;

/** Classifier context: the user's fasting prefs, the school governing fasting, and the log. */
export function buildFastingContext(
  prefs: FastingPrefsInput,
  entries: VoluntaryFastingMap = {},
): FastingCalendarContext {
  return {
    toHijri: hijriForDateKey,
    prefs: resolveVoluntaryFastingPrefs(prefs.voluntaryFasting),
    school: resolveSchool(prefs, "fasting"),
    entries,
  };
}
