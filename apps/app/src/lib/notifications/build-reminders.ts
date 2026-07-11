import { ADHAN_PRAYER_SET, clampPrayerReminderOffset } from "@munib-tracker/shared/constants";
import type {
  ObligatoryPrayer,
  PrayerId,
  TimeFormat,
  UserPreferences,
} from "@munib-tracker/shared/types";
import i18n from "@/i18n";
import { afterSalahAdhkarHref } from "@/lib/after-salah-adhkar-reminder";
import { locationCalcExtras, type StoredLocation } from "@/lib/location";
import { isPrayerAlertEnabled, SUNNAH_ALERTABLE_PRAYERS } from "@/lib/prayer-alerts";
import { computePrayerTimes, prayerReminderTime, witrTime } from "@/lib/prayer-times";
import {
  formatDisplayHhMm,
  getZonedParts,
  parseHhMm,
  prayerDayAnchor,
  shiftPrayerDay,
  wallClockInTimeZoneToDate,
} from "@/lib/time";

export type ReminderChannelId = "prayer" | "prayerAdhan" | "zikr" | "qaza";

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
  /**
   * Registered custom notification sound to play (iOS uses the file name; Android
   * plays it via the reminder's channel). Only set on obligatory-prayer reminders
   * when the adhan option is on.
   */
  sound?: string;
  /**
   * Scheduling priority — lower numbers keep a slot when we trim to the iOS
   * pending-notification budget (~64). Fard prayers win over optional nudges.
   */
  priority: number;
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

/**
 * Prayer times shift daily, so they must use DATE triggers. Keep the window short
 * and refresh on foreground (`rescheduleAll`) so we stay under the iOS ~64 cap.
 */
export const SCHEDULE_DAYS_AHEAD = 2;

/**
 * Leave headroom for snooze / achievement one-shots. iOS silently drops locals
 * past ~64 pending notifications.
 */
export const MAX_PENDING_REMINDERS = 60;

const PRIORITY = {
  fard: 10,
  witr: 20,
  sunnah: 30,
  afterAzan: 40,
  beforePrayer: 50,
  afterPrayer: 55,
  morningZikr: 60,
  eveningZikr: 61,
  beforeSleep: 62,
  qaza: 70,
  dailyContent: 80,
  friday: 85,
} as const;

/** Registered adhan sound file (see the `sounds` array in `app.json`). */
export const ADHAN_NOTIFICATION_SOUND = "adhan.mp3";

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
  const extras = locationCalcExtras(location);

  const times = computePrayerTimes(
    { latitude: location.latitude, longitude: location.longitude },
    day,
    location.method,
    location.madhab,
    extras,
  );

  const tomorrow = shiftPrayerDay(day, 1);
  const tomorrowTimes = computePrayerTimes(
    { latitude: location.latitude, longitude: location.longitude },
    tomorrow,
    location.method,
    location.madhab,
    extras,
  );
  const yesterday = shiftPrayerDay(day, -1);
  const yesterdayTimes = computePrayerTimes(
    { latitude: location.latitude, longitude: location.longitude },
    yesterday,
    location.method,
    location.madhab,
    extras,
  );

  const slots: ReminderPrayerSlot[] = [...FARD_SLOTS, ...WITR_SLOTS, ...SUNNAH_SLOTS];
  const n = prefs.notificationPrefs;

  for (const slot of slots) {
    if (!isPrayerAlertEnabled(prefs, slot as PrayerId)) continue;

    const at = prayerDate(times, slot, tomorrowTimes.fajr, yesterdayTimes.maghrib, day);
    const label = i18n.t(`prayers.${slot}`);
    const dayKey = day.toISOString().slice(0, 10);
    const isFard = FARD_SLOTS.includes(slot as (typeof FARD_SLOTS)[number]);
    const isWitr = slot === "witr";

    // The adhan plays only for the obligatory prayers, and only when the user
    // opted in. Sunnah/witr and the surrounding zikr nudges stay silent.
    const playAdhan = isFard && n.playAdhanOnPrayer;

    // Per-prayer offset shifts only the main obligatory reminder; the
    // before/after/azan nudges stay anchored to the true prayer time.
    const offset = isFard
      ? clampPrayerReminderOffset(prefs.prayerReminderOffsets?.[slot as PrayerId] ?? 0)
      : 0;
    const mainFireAt = addMinutes(at, offset);

    reminders.push({
      id: `prayer:${slot}:${dayKey}`,
      fireAt: mainFireAt,
      title: i18n.t("notif.reminders.prayerTitle", { prayer: label }),
      body: isFard
        ? i18n.t("notif.reminders.prayerBodyObligatory")
        : i18n.t("notif.reminders.prayerBodySunnah"),
      channelId: playAdhan ? "prayerAdhan" : "prayer",
      repeat: "date",
      route: "/tracker",
      priority: isFard ? PRIORITY.fard : isWitr ? PRIORITY.witr : PRIORITY.sunnah,
      ...(playAdhan ? { sound: ADHAN_NOTIFICATION_SOUND } : {}),
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
        priority: PRIORITY.afterAzan,
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
        priority: PRIORITY.beforePrayer,
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
        route: afterSalahAdhkarHref(slot as ObligatoryPrayer),
        priority: PRIORITY.afterPrayer,
      });
    }
  }
}

/**
 * One DAILY repeating notification for a fixed wall-clock time. Uses a single
 * OS slot instead of 7 DATE copies (critical for the iOS pending budget).
 */
function pushDailyReminder(
  reminders: BuiltReminder[],
  when: string,
  id: string,
  title: string,
  body: string,
  channelId: ReminderChannelId,
  route: string,
  enabled: boolean,
  location: StoredLocation,
  now: Date,
  priority: number,
): void {
  if (!enabled) return;
  const { hour, minute } = parseHhMm(when);
  const parts = getZonedParts(now, location.timeZone);
  let fireAt = wallClockInTimeZoneToDate(
    parts.year,
    parts.month,
    parts.day,
    hour,
    minute,
    location.timeZone,
  );
  // If today's occurrence already passed, point fireAt at tomorrow so the OS
  // daily trigger's first fire and the UI "next at" row stay aligned.
  if (fireAt.getTime() <= now.getTime() - 60_000) {
    const tomorrow = shiftPrayerDay(prayerDayAnchor(now, location.timeZone), 1);
    fireAt = wallClockInTimeZoneToDate(
      tomorrow.getFullYear(),
      tomorrow.getMonth() + 1,
      tomorrow.getDate(),
      hour,
      minute,
      location.timeZone,
    );
  }

  reminders.push({
    id,
    fireAt,
    title,
    body,
    channelId,
    repeat: "daily",
    route,
    priority,
  });
}

/** Next Friday (or today if still upcoming) — single DATE, refreshed on reschedule. */
function pushFridayReminder(
  reminders: BuiltReminder[],
  location: StoredLocation,
  now: Date,
  enabled: boolean,
): void {
  if (!enabled) return;
  const { hour, minute } = parseHhMm("11:00");
  const anchor = prayerDayAnchor(now, location.timeZone);

  for (let offset = 0; offset <= 7; offset += 1) {
    const day = shiftPrayerDay(anchor, offset);
    if (day.getDay() !== 5) continue;

    const fireAt = wallClockInTimeZoneToDate(
      day.getFullYear(),
      day.getMonth() + 1,
      day.getDate(),
      hour,
      minute,
      location.timeZone,
    );
    if (fireAt.getTime() <= now.getTime() - 60_000) continue;

    const dayKey = `${day.getFullYear()}-${`${day.getMonth() + 1}`.padStart(2, "0")}-${`${day.getDate()}`.padStart(2, "0")}`;
    reminders.push({
      id: `friday:${dayKey}`,
      fireAt,
      title: i18n.t("notif.reminders.fridayTitle"),
      body: i18n.t("notif.reminders.fridayBody"),
      channelId: "zikr",
      repeat: "date",
      route: "/quran/18",
      priority: PRIORITY.friday,
    });
    return;
  }
}

/** Keep the highest-priority reminders within the OS pending budget. */
export function trimRemindersToBudget(
  reminders: BuiltReminder[],
  max = MAX_PENDING_REMINDERS,
): BuiltReminder[] {
  if (reminders.length <= max) return reminders;
  return [...reminders]
    .sort((a, b) => a.priority - b.priority || a.fireAt.getTime() - b.fireAt.getTime())
    .slice(0, max)
    .sort((a, b) => a.fireAt.getTime() - b.fireAt.getTime());
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
    location,
    now,
    PRIORITY.morningZikr,
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
    location,
    now,
    PRIORITY.eveningZikr,
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
    location,
    now,
    PRIORITY.beforeSleep,
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
    location,
    now,
    PRIORITY.qaza,
  );
  pushDailyReminder(
    reminders,
    "09:00",
    "dailyContent",
    i18n.t("notif.reminders.dailyContentTitle"),
    i18n.t("notif.reminders.dailyContentBody"),
    "zikr",
    // Land the daily-content nudge on the curated daily-hadith archive (NF-2.10).
    "/hadith/daily",
    n.dailyContent,
    location,
    now,
    PRIORITY.dailyContent,
  );

  // Jumu'ah nudge — next Friday only; refreshed on reschedule.
  pushFridayReminder(reminders, location, now, n.friday);

  // Drop reminders whose fire time has already passed (DATE only; daily uses next slot).
  const upcoming = reminders.filter(
    (reminder) => reminder.fireAt.getTime() > now.getTime() - 60_000,
  );
  return trimRemindersToBudget(upcoming);
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
  timeZone?: string,
): ScheduledReminderRow[] {
  const sorted = [...reminders].sort((a, b) => a.fireAt.getTime() - b.fireAt.getTime());
  const seen = new Set<string>();
  const rows: ScheduledReminderRow[] = [];

  for (const reminder of sorted) {
    const key = reminderTemplateKey(reminder.title, reminder.body);
    if (seen.has(key)) continue;
    seen.add(key);

    if (reminder.fireAt.getTime() <= now.getTime()) continue;

    const clock = getZonedParts(reminder.fireAt, timeZone);
    rows.push({
      id: reminder.id,
      title: reminder.title,
      body: reminder.body,
      fireAt: reminder.fireAt.toISOString(),
      time: formatDisplayHhMm(clock.hour, clock.minute, timeFormat),
      route: reminder.route,
    });
  }

  return rows.sort((a, b) => a.fireAt.localeCompare(b.fireAt));
}
