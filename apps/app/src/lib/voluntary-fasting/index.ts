/**
 * Public API of the voluntary fasting tracker (NF-3.2). Other features (e.g.
 * Dhul-Hijjah mode, NF-3.3, linking days 1–9) should import from here:
 *
 *   isIntendedFast("2027-05-08")              // planned or kept that day?
 *   await markFast("2027-05-08", "intended")  // validated; returns { ok, reason? }
 *   fastingDaysForRange(from, to)             // classified days (kinds + ruling)
 *
 * Hijri dates always come from `lib/hijri.ts` (sighting authority + the user's
 * adjustment), and the ruling follows the user's madhhab for the fasting domain.
 */
export {
  blockReasonFor,
  clearFast,
  excusedReasonForFastDate,
  type MarkFastBlockReason,
  type MarkFastResult,
  markFast,
  setFastAsQaza,
} from "./actions";
export {
  classifyDate,
  type FastingDay,
  type FastingPrefsInput,
  fastingCalendarContext,
  fastingDaysForRange,
  hijriForDateKey,
  isIntendedFast,
  upcomingFastingDays,
} from "./calendar";
export { buildFastingContext } from "./context";
export { headlineKind } from "./kinds";
export {
  currentHajjSeasonYear,
  isPilgrimForHijriYear,
  isPilgrimThisSeason,
  pilgrimPrefsPatch,
} from "./pilgrim";
export {
  FASTING_INTENT_TIMES,
  type FastingIntentTime,
  FOLLOWABLE_FAST_KINDS,
  intentTimeChoice,
  parseIntentTime,
  resolveFastingNotificationPrefs,
  resolveVoluntaryFastingPrefs,
  toggleEnabledKind,
} from "./prefs";
export {
  computeVoluntaryFastingStats,
  DHUL_HIJJAH_TARGET,
  fastingHistory,
  SHAWWAL_SIX_TARGET,
  type VoluntaryFastingStats,
} from "./stats";

/** Hub route; `?date=YYYY-MM-DD` opens that day's sheet. */
export const VOLUNTARY_FASTING_ROUTE = "/fasting" as const;

export function voluntaryFastingHref(date?: string): string {
  return date ? `${VOLUNTARY_FASTING_ROUTE}?date=${date}` : VOLUNTARY_FASTING_ROUTE;
}
