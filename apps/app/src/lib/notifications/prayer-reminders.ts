import {
  ADHAN_PRAYER_SET,
  clampPrayerReminderOffset,
  OBLIGATORY_PRAYER_SET,
} from "@munib-tracker/shared/constants";
import type { ObligatoryPrayer, PrayerId, UserPreferences } from "@munib-tracker/shared/types";
import { getLocalDateString } from "@munib-tracker/shared/utils";

import i18n from "@/i18n";
import { afterSalahAdhkarHref } from "@/lib/after-salah-adhkar-reminder";
import { computeLocationPrayerTimes, type StoredLocation } from "@/lib/location";
import { adhanChannelId, adhanNotificationSound } from "@/lib/notifications/adhan-sounds";
import type { BuiltReminder } from "@/lib/notifications/build-reminders";
import { priorityForKind } from "@/lib/notifications/reminder-budget";
import { addMinutes } from "@/lib/notifications/reminder-clock";
import { isPrayerAlertEnabled, SUNNAH_ALERTABLE_PRAYERS } from "@/lib/prayer-alerts";
import { prayerReminderTime, witrTime } from "@/lib/prayer-times";
import { prayerDayAnchor, shiftPrayerDay } from "@/lib/time";

/**
 * Salah / Adhan reminders (§11 tier 1) and the zikr nudges anchored to each fard
 * (after the adhan, before and after Salah — tier 3). DATE triggers, because the
 * times move every day; `buildReminders` arms `SCHEDULE_DAYS_AHEAD` days of them.
 */

const FARD_SLOTS = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;
type ReminderPrayerSlot = ObligatoryPrayer | "witr" | (typeof SUNNAH_ALERTABLE_PRAYERS)[number];
/** Fard first, then Witr, then the alertable sunnah — the in-tier budget order. */
const SLOTS: readonly ReminderPrayerSlot[] = [...FARD_SLOTS, "witr", ...SUNNAH_ALERTABLE_PRAYERS];

const BEFORE_PRAYER_MINUTES = 10;
const AFTER_PRAYER_MINUTES = 10;
const AFTER_AZAN_MINUTES = 2;

const PRIORITY = {
  fard: priorityForKind("prayer", 10),
  witr: priorityForKind("prayer", 20),
  sunnah: priorityForKind("prayer", 30),
  // Zikr nudges are §11 tier 3 (only Salah, Adhan and Qaza are tier 1), after the
  // named fast-intent / seasonal kinds and before the other daily nudges (M3).
  afterAzan: priorityForKind("salahZikr", 73),
  beforePrayer: priorityForKind("salahZikr", 74),
  afterPrayer: priorityForKind("salahZikr", 75),
} as const;

/** Deep-link a zikr category collection screen. */
export const zikrRoute = (category: string): string => `/zikr/${category}`;

function isFardSlot(slot: ReminderPrayerSlot): slot is ObligatoryPrayer {
  return OBLIGATORY_PRAYER_SET.has(slot);
}

/** Pushes one prayer day's Salah reminders, `dayOffset` days after `now`'s prayer day. */
export function pushPrayerReminders(
  reminders: BuiltReminder[],
  prefs: UserPreferences,
  location: StoredLocation,
  now: Date,
  dayOffset: number,
): void {
  const day = shiftPrayerDay(prayerDayAnchor(now, location.timeZone), dayOffset);
  const times = computeLocationPrayerTimes(location, day);
  const tomorrowFajr = computeLocationPrayerTimes(location, shiftPrayerDay(day, 1)).fajr;
  const yesterdayMaghrib = computeLocationPrayerTimes(location, shiftPrayerDay(day, -1)).maghrib;
  // Local calendar day — never UTC (`toISOString`), or Mark fails east of UTC.
  const dayKey = getLocalDateString(day);
  const n = prefs.notificationPrefs;

  for (const slot of SLOTS) {
    if (!isPrayerAlertEnabled(prefs, slot as PrayerId)) continue;

    const at =
      prayerReminderTime(slot as PrayerId, times, tomorrowFajr, yesterdayMaghrib, day) ??
      (slot === "witr"
        ? witrTime(times.isha)
        : ((isFardSlot(slot) ? times.timeForPrayer(slot) : null) ?? times.fajr));
    const label = i18n.t(`prayers.${slot}`);
    const isFard = isFardSlot(slot);

    // The adhan plays only for the obligatory prayers, and only when the user
    // opted in. Sunnah/witr and the surrounding zikr nudges stay silent.
    const playAdhan = isFard && n.playAdhanOnPrayer;

    // Per-prayer offset shifts only the main obligatory reminder; the
    // before/after/azan nudges stay anchored to the true prayer time.
    const offset = isFard ? clampPrayerReminderOffset(prefs.prayerReminderOffsets?.[slot] ?? 0) : 0;

    reminders.push({
      id: `prayer:${slot}:${dayKey}`,
      fireAt: addMinutes(at, offset),
      title: i18n.t("notif.reminders.prayerTitle", { prayer: label }),
      body: isFard
        ? i18n.t("notif.reminders.prayerBodyObligatory")
        : i18n.t("notif.reminders.prayerBodySunnah"),
      channelId: playAdhan ? "prayerAdhan" : "prayer",
      repeat: "date",
      route: "/tracker",
      priority: isFard ? PRIORITY.fard : slot === "witr" ? PRIORITY.witr : PRIORITY.sunnah,
      // B2: the selected adhan style's registered sound + its own Android channel.
      ...(playAdhan
        ? {
            sound: adhanNotificationSound(prefs.adhanStyleId),
            androidChannelId: adhanChannelId(prefs.adhanStyleId),
          }
        : {}),
      ...(isFard ? { prayerId: slot, prayerDateKey: dayKey } : {}),
    });

    if (!isFard) continue;

    if (n.afterAzan && ADHAN_PRAYER_SET.has(slot)) {
      reminders.push({
        id: `afterAzan:${slot}:${dayKey}`,
        fireAt: addMinutes(at, AFTER_AZAN_MINUTES),
        title: i18n.t("notif.reminders.afterAdhanTitle", { prayer: label }),
        body: i18n.t("notif.reminders.afterAdhanBody"),
        channelId: "zikr",
        repeat: "date",
        route: zikrRoute("after_azan"),
        priority: PRIORITY.afterAzan,
      });
    }

    if (n.beforePrayer) {
      reminders.push({
        id: `beforePrayer:${slot}:${dayKey}`,
        fireAt: addMinutes(at, -BEFORE_PRAYER_MINUTES),
        title: i18n.t("notif.reminders.beforePrayerTitle", { prayer: label }),
        body: i18n.t("notif.reminders.beforePrayerBody"),
        channelId: "zikr",
        repeat: "date",
        route: zikrRoute("before_prayer"),
        priority: PRIORITY.beforePrayer,
      });
    }

    if (n.afterPrayer) {
      reminders.push({
        id: `afterPrayer:${slot}:${dayKey}`,
        fireAt: addMinutes(at, AFTER_PRAYER_MINUTES),
        title: i18n.t("notif.reminders.afterPrayerTitle", { prayer: label }),
        body: i18n.t("notif.reminders.afterPrayerBody"),
        channelId: "zikr",
        repeat: "date",
        route: afterSalahAdhkarHref(slot),
        priority: PRIORITY.afterPrayer,
      });
    }
  }
}
