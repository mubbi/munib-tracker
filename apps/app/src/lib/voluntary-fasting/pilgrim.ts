import type { VoluntaryFastingPrefs } from "@munib-tracker/shared/types";
import { hajjSeasonHijriYear, isPilgrimInHijriYear } from "@munib-tracker/shared/utils";

import { gregorianToHijri } from "@/lib/hijri";

import { resolveVoluntaryFastingPrefs } from "./prefs";

/**
 * "Performing Hajj this year" (NF-3.2 / NF-3.3). The answer is stored with the
 * Hijri year of the Hajj it refers to, so it expires by itself after that
 * Dhul-Hijjah (13th) and never silences Arafah in a later year.
 */

/** Hijri year of the current / next Hajj season on `now` (rolls over after 13 Dhul-Hijjah). */
export function currentHajjSeasonYear(now: Date = new Date()): number {
  return hajjSeasonHijriYear(gregorianToHijri(now));
}

/** Prefs patch for the pilgrim toggle: on = this season's Hijri year; off = cleared. */
export function pilgrimPrefsPatch(
  on: boolean,
  now: Date = new Date(),
): Pick<VoluntaryFastingPrefs, "isPilgrimThisYear" | "pilgrimHijriYear"> {
  return on
    ? { isPilgrimThisYear: true, pilgrimHijriYear: currentHajjSeasonYear(now) }
    : { isPilgrimThisYear: false, pilgrimHijriYear: null };
}

/** The pilgrim answer applies to `hijriYear` (raw / synced prefs accepted). */
export function isPilgrimForHijriYear(rawPrefs: unknown, hijriYear: number): boolean {
  return isPilgrimInHijriYear(resolveVoluntaryFastingPrefs(rawPrefs), hijriYear);
}

/** The pilgrim answer applies to the current / next Hajj season (the settings toggle's state). */
export function isPilgrimThisSeason(rawPrefs: unknown, now: Date = new Date()): boolean {
  return isPilgrimForHijriYear(rawPrefs, currentHajjSeasonYear(now));
}
