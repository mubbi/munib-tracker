import { rulesFor } from "@munib-tracker/shared/fiqh/core";
import type { UserPreferences } from "@munib-tracker/shared/types";
import { getLocalDateString } from "@munib-tracker/shared/utils";

import i18n from "@/i18n";
import { computeLocationPrayerTimes, type StoredLocation } from "@/lib/location";
import type { BuiltReminder } from "@/lib/notifications/build-reminders";
import { priorityForKind } from "@/lib/notifications/reminder-budget";
import { isPrayerAlertEnabled } from "@/lib/prayer-alerts";
import {
  PREFERRED_WINDOW_PRAYERS,
  type PreferredWindowPrayer,
  type PreferredWindowTimes,
  preferredWindowFor,
} from "@/lib/salah-phase/preferred-window";
import { prayerDayAnchor, shiftPrayerDay } from "@/lib/time";

/**
 * D40 "preferred-time reminders": an optional, off-by-default reminder at the
 * START of the user's school's preferred (mustahabb) band — exactly the band
 * `preferred-window.ts` draws for the home hero:
 *
 * - Hanafi Fajr isfar, Hanafi Asr "delay, before the sun yellows", Hanafi and
 *   Hanbali Isha "delay to a third of the night" ⇒ one reminder at the band start.
 * - Taghlis / "early" (Shafi'i, Maliki, and the others where they apply) ⇒ the
 *   preferred time IS the start of the time, which the normal Salah reminder
 *   already covers, so nothing extra is scheduled.
 *
 * Never in all-views mode (no school ⇒ no band to point at; the setting is
 * hidden there too), paused during an excused period, only for prayers whose
 * Salah alert is on, and never within {@link PREFERRED_TIME_DEDUP_MINUTES} of a
 * reminder the user already gets for that prayer (their own offset, the
 * before/after nudges, iqamah) — so it can never feel like a duplicate.
 * Text is generic ("The preferred time for Asr has begun"): no school name.
 */

/** Skip the preferred-time reminder when another reminder for that prayer fires this close. */
export const PREFERRED_TIME_DEDUP_MINUTES = 15;

/**
 * §11 budget tier 2 (between the tier-1 Salah/Adhan alerts and the tier-3
 * seasonal/daily nudges), ranked after iqamah. It is prayer-adjacent like the
 * iqamah "leave now" alert — it helps the user pray a fard at a better time on
 * that day — but it is an optional extra on top of the Salah alert itself, so a
 * full budget must drop it before any tier-1 Salah, Adhan or Qaza reminder and
 * before iqamah/suhoor (which carry a hard real-world deadline).
 */
export const PREFERRED_TIME_PRIORITY = priorityForKind("preferredTime", 30);

export const PREFERRED_TIME_ROUTE = "/tracker";

const MIN = 60_000;

/** True when the user opted in, chose a school for Salah, and nothing pauses reminders. */
export function preferredTimeRemindersActive(prefs: UserPreferences): boolean {
  const n = prefs.notificationPrefs;
  if (!n.masterEnabled || n.preferredTime !== true) return false;
  if (prefs.activeExcusedReason != null) return false;
  return rulesFor(prefs, "salah") != null;
}

/**
 * When the preferred band for `prayer` starts LATER than the prayer's own start
 * time, that instant; otherwise (early/taghlis, all views, no band) `null`.
 */
export function preferredTimeFireAt(
  prayer: PreferredWindowPrayer,
  times: PreferredWindowTimes,
  rules: Parameters<typeof preferredWindowFor>[2],
): Date | null {
  const window = preferredWindowFor(prayer, times, rules);
  if (window?.kind !== "band") return null;
  const prayerStart = times[prayer].getTime();
  // Under a minute after the start ⇒ the "preferred" time is the start itself.
  if (window.start.getTime() - prayerStart < MIN) return null;
  return window.start;
}

function hasNearbyReminder(
  reminders: readonly BuiltReminder[],
  prayer: PreferredWindowPrayer,
  dayKey: string,
  fireAt: Date,
): boolean {
  const window = PREFERRED_TIME_DEDUP_MINUTES * MIN;
  return reminders.some((reminder) => {
    const [, slot] = reminder.id.split(":");
    if (slot !== prayer) return false;
    // Same prayer-day ids (`prayer:asr:2026-11-24`, `iqamah:asr:2026-11-24`, …).
    if (!reminder.id.endsWith(dayKey)) return false;
    return Math.abs(reminder.fireAt.getTime() - fireAt.getTime()) < window;
  });
}

/**
 * Appends one preferred-time reminder per eligible prayer and day. Must run
 * AFTER the Salah (and iqamah) reminders are built so it can avoid duplicates.
 */
export function pushPreferredTimeReminders(
  reminders: BuiltReminder[],
  prefs: UserPreferences,
  location: StoredLocation,
  now: Date,
  daysAhead: number,
): void {
  if (location.source === "default") return;
  if (!preferredTimeRemindersActive(prefs)) return;
  const rules = rulesFor(prefs, "salah");
  if (!rules) return;
  const anchor = prayerDayAnchor(now, location.timeZone);

  for (let offset = 0; offset < daysAhead; offset += 1) {
    const day = shiftPrayerDay(anchor, offset);
    const today = computeLocationPrayerTimes(location, day);
    const tomorrow = computeLocationPrayerTimes(location, shiftPrayerDay(day, 1));
    const times: PreferredWindowTimes = {
      fajr: today.fajr,
      sunrise: today.sunrise,
      asr: today.asr,
      maghrib: today.maghrib,
      isha: today.isha,
      nextFajr: tomorrow.fajr,
    };
    const dayKey = getLocalDateString(day);

    for (const prayer of PREFERRED_WINDOW_PRAYERS) {
      if (!isPrayerAlertEnabled(prefs, prayer)) continue;
      const fireAt = preferredTimeFireAt(prayer, times, rules);
      if (!fireAt || fireAt.getTime() <= now.getTime()) continue;
      if (hasNearbyReminder(reminders, prayer, dayKey, fireAt)) continue;
      const label = i18n.t(`prayers.${prayer}`);
      reminders.push({
        id: `preferredTime:${prayer}:${dayKey}`,
        fireAt,
        title: i18n.t("preferredTimeReminder.title", { prayer: label }),
        body: i18n.t("preferredTimeReminder.body", { prayer: label }),
        channelId: "prayer",
        repeat: "date",
        route: PREFERRED_TIME_ROUTE,
        priority: PREFERRED_TIME_PRIORITY,
      });
    }
  }
}
