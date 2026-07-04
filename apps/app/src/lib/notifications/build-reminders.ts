import { ADHAN_PRAYER_SET } from "@munib-tracker/shared/constants";
import type { PrayerId, TimeFormat, UserPreferences } from "@munib-tracker/shared/types";
import i18n from "@/i18n";
import type { StoredLocation } from "@/lib/location";
import { isPrayerAlertEnabled, SUNNAH_ALERTABLE_PRAYERS } from "@/lib/prayer-alerts";
import { computePrayerTimes, prayerReminderTime, witrTime } from "@/lib/prayer-times";
import { formatDisplayHhMm, parseHhMm, prayerDayAnchor, shiftPrayerDay } from "@/lib/time";

export type ReminderChannelId = "prayer" | "zikr" | "qaza";

export type BuiltReminder = {
  /** Stable id for deduplication across reschedule passes. */
  id: string;
  fireAt: Date;
  title: string;
  body: string;
  channelId: ReminderChannelId;
  /** `daily` repeats at the same clock time; `date` fires once at an exact instant. */
  repeat: "daily" | "date";
  /**
   * In-app route to open when the notification is tapped, so the user lands
   * directly on the relevant collection (e.g. the after-salah adhkar) rather
   * than the generic notification centre.
   */
  route: string;
};

/** Deep-link a zikr category collection screen. */
const zikrRoute = (category: string): string => `/zikr/${category}`;

const FARD_SLOTS = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;
const WITR_SLOTS = ["witr"] as const;
const SUNNAH_SLOTS = SUNNAH_ALERTABLE_PRAYERS;
type ReminderPrayerSlot =
  | (typeof FARD_SLOTS)[number]
  | (typeof WITR_SLOTS)[number]
  | (typeof SUNNAH_SLOTS)[number];
const BEFORE_PRAYER_MINUTES = 10;
const AFTER_PRAYER_MINUTES = 10;
const AFTER_AZAN_MINUTES = 2;
const SCHEDULE_DAYS_AHEAD = 7;

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
}

function prayerDate(
  times: ReturnType<typeof computePrayerTimes>,
  slot: ReminderPrayerSlot,
  tomorrowFajr: Date,
  yesterdayMaghrib: Date,
  now: Date,
): Date {
  const at = prayerReminderTime(slot as PrayerId, times, tomorrowFajr, yesterdayMaghrib, now);
  if (at) return at;
  if (slot === "witr") return witrTime(times.isha);
  return times.timeForPrayer(slot as "fajr" | "dhuhr" | "asr" | "maghrib" | "isha") ?? times.fajr;
}

function pushPrayerReminders(
  reminders: BuiltReminder[],
  prefs: UserPreferences,
  location: StoredLocation,
  dayOffset: number,
): void {
  const day = shiftPrayerDay(prayerDayAnchor(new Date(), location.timeZone), dayOffset);

  const times = computePrayerTimes(
    { latitude: location.latitude, longitude: location.longitude },
    day,
    location.method,
    location.madhab,
  );

  const tomorrow = shiftPrayerDay(day, 1);
  const tomorrowTimes = computePrayerTimes(
    { latitude: location.latitude, longitude: location.longitude },
    tomorrow,
    location.method,
    location.madhab,
  );
  const yesterday = shiftPrayerDay(day, -1);
  const yesterdayTimes = computePrayerTimes(
    { latitude: location.latitude, longitude: location.longitude },
    yesterday,
    location.method,
    location.madhab,
  );

  const slots: ReminderPrayerSlot[] = [...FARD_SLOTS, ...WITR_SLOTS, ...SUNNAH_SLOTS];
  const n = prefs.notificationPrefs;

  for (const slot of slots) {
    if (!isPrayerAlertEnabled(prefs, slot as PrayerId)) continue;

    const at = prayerDate(times, slot, tomorrowTimes.fajr, yesterdayTimes.maghrib, day);
    const label = i18n.t(`prayers.${slot}`);
    const dayKey = day.toISOString().slice(0, 10);
    const isFard = FARD_SLOTS.includes(slot as (typeof FARD_SLOTS)[number]);

    reminders.push({
      id: `prayer:${slot}:${dayKey}`,
      fireAt: at,
      title: i18n.t("notif.reminders.prayerTitle", { prayer: label }),
      body: isFard
        ? i18n.t("notif.reminders.prayerBodyObligatory")
        : i18n.t("notif.reminders.prayerBodySunnah"),
      channelId: "prayer",
      repeat: "date",
      route: "/tracker",
    });

    if (!isFard) continue;

    if (n.afterAzan && ADHAN_PRAYER_SET.has(slot)) {
      const azanAt = addMinutes(at, AFTER_AZAN_MINUTES);
      reminders.push({
        id: `afterAzan:${slot}:${dayKey}`,
        fireAt: azanAt,
        title: i18n.t("notif.reminders.afterAdhanTitle", { prayer: label }),
        body: i18n.t("notif.reminders.afterAdhanBody"),
        channelId: "zikr",
        repeat: "date",
        route: zikrRoute("after_azan"),
      });
    }

    if (n.beforePrayer) {
      const beforeAt = addMinutes(at, -BEFORE_PRAYER_MINUTES);
      reminders.push({
        id: `beforePrayer:${slot}:${dayKey}`,
        fireAt: beforeAt,
        title: i18n.t("notif.reminders.beforePrayerTitle", { prayer: label }),
        body: i18n.t("notif.reminders.beforePrayerBody"),
        channelId: "zikr",
        repeat: "date",
        route: zikrRoute("before_prayer"),
      });
    }

    if (n.afterPrayer) {
      const afterAt = addMinutes(at, AFTER_PRAYER_MINUTES);
      reminders.push({
        id: `afterPrayer:${slot}:${dayKey}`,
        fireAt: afterAt,
        title: i18n.t("notif.reminders.afterPrayerTitle", { prayer: label }),
        body: i18n.t("notif.reminders.afterPrayerBody"),
        channelId: "zikr",
        repeat: "date",
        route: zikrRoute("after_prayer"),
      });
    }
  }
}

function pushDailyReminder(
  reminders: BuiltReminder[],
  when: string,
  id: string,
  title: string,
  body: string,
  channelId: ReminderChannelId,
  route: string,
  enabled: boolean,
): void {
  if (!enabled) return;
  const { hour, minute } = parseHhMm(when);
  const fireAt = new Date();
  fireAt.setHours(hour, minute, 0, 0);
  reminders.push({ id, fireAt, title, body, channelId, repeat: "daily", route });
}

export function buildReminders(
  prefs: UserPreferences,
  location: StoredLocation,
  now = new Date(),
): BuiltReminder[] {
  const n = prefs.notificationPrefs;
  const reminders: BuiltReminder[] = [];

  for (let offset = 0; offset < SCHEDULE_DAYS_AHEAD; offset += 1) {
    pushPrayerReminders(reminders, prefs, location, offset);
  }

  pushDailyReminder(
    reminders,
    "07:00",
    "morningZikr",
    i18n.t("notif.reminders.morningZikrTitle"),
    i18n.t("notif.reminders.morningZikrBody"),
    "zikr",
    zikrRoute("morning"),
    n.morningZikr,
  );
  pushDailyReminder(
    reminders,
    "17:30",
    "eveningZikr",
    i18n.t("notif.reminders.eveningZikrTitle"),
    i18n.t("notif.reminders.eveningZikrBody"),
    "zikr",
    zikrRoute("evening"),
    n.eveningZikr,
  );
  pushDailyReminder(
    reminders,
    prefs.bedtime ?? "22:30",
    "beforeSleep",
    i18n.t("notif.reminders.beforeSleepTitle"),
    i18n.t("notif.reminders.beforeSleepBody"),
    "zikr",
    zikrRoute("before_sleep"),
    n.beforeSleep,
  );
  pushDailyReminder(
    reminders,
    "20:00",
    "qaza",
    i18n.t("notif.reminders.qazaTitle"),
    i18n.t("notif.reminders.qazaBody"),
    "qaza",
    "/qaza",
    n.qaza,
  );

  // Drop reminders that already passed (date-based only).
  return reminders.filter((reminder) => {
    if (reminder.repeat === "daily") return true;
    return reminder.fireAt.getTime() > now.getTime() - 60_000;
  });
}

export type ScheduledReminderRow = {
  id: string;
  title: string;
  body: string;
  /** ISO-8601 instant for the next fire time. */
  fireAt: string;
  time?: string;
  /** Deep link to open when the row is tapped. */
  route?: string;
};

/** One centre row per reminder template (title + body), keeping the nearest upcoming. */
function reminderTemplateKey(title: string, body: string): string {
  return `${title}\0${body}`;
}

/** Human-readable schedule rows for the notification centre. */
export function summarizeReminders(
  reminders: BuiltReminder[],
  timeFormat: TimeFormat = "24",
  now = new Date(),
): ScheduledReminderRow[] {
  const sorted = [...reminders].sort((a, b) => a.fireAt.getTime() - b.fireAt.getTime());
  const seen = new Set<string>();
  const rows: ScheduledReminderRow[] = [];

  for (const reminder of sorted) {
    const key = reminderTemplateKey(reminder.title, reminder.body);
    if (seen.has(key)) continue;
    seen.add(key);

    let fireAt = reminder.fireAt;
    if (reminder.repeat === "daily" && fireAt.getTime() <= now.getTime()) {
      fireAt = new Date(fireAt);
      fireAt.setDate(fireAt.getDate() + 1);
    }

    rows.push({
      id: reminder.id,
      title: reminder.title,
      body: reminder.body,
      fireAt: fireAt.toISOString(),
      time: formatDisplayHhMm(fireAt.getHours(), fireAt.getMinutes(), timeFormat),
      route: reminder.route,
    });
  }

  return rows.sort((a, b) => a.fireAt.localeCompare(b.fireAt));
}
