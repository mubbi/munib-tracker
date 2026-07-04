import { OBLIGATORY_PRAYER_SET, OBLIGATORY_PRAYERS } from "@munib-tracker/shared/constants";
import type { PrayerId, SunnahPrayer, UserPreferences } from "@munib-tracker/shared/types";

/** Sunnah prayers with a fixed daily reminder time. */
export const SUNNAH_ALERTABLE_PRAYERS = [
  "tahajjud",
  "ishraq",
  "duha",
] as const satisfies readonly SunnahPrayer[];

const SCHEDULABLE_PRAYERS: PrayerId[] = [...OBLIGATORY_PRAYERS, ...SUNNAH_ALERTABLE_PRAYERS];

/** Prayers that can receive a timed local notification. */
export const ALERTABLE_PRAYERS = SCHEDULABLE_PRAYERS;

export function isPrayerAlertEnabled(prefs: UserPreferences, prayerId: PrayerId): boolean {
  const override = prefs.prayerAlerts?.[prayerId];
  if (override !== undefined) return override;

  if (OBLIGATORY_PRAYER_SET.has(prayerId)) return prefs.notificationPrefs.prayer;
  return prefs.notificationPrefs.sunnahPrayer;
}
