import { PRAYER_LABELS } from "@munib-tracker/shared/constants";
import type { PrayerId, TimeFormat, UserPreferences } from "@munib-tracker/shared/types";
import type { StoredLocation } from "@/lib/location";
import { isPrayerAlertEnabled, SUNNAH_ALERTABLE_PRAYERS } from "@/lib/prayer-alerts";
import { computePrayerTimes, prayerReminderTime, witrTime } from "@/lib/prayer-times";
import { formatDisplayHhMm, formatHhMm, parseHhMm } from "@/lib/time";

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
};

const OBLIGATORY_SLOTS = ["fajr", "dhuhr", "asr", "maghrib", "isha", "witr"] as const;
const SUNNAH_SLOTS = SUNNAH_ALERTABLE_PRAYERS;
type ReminderPrayerSlot = (typeof OBLIGATORY_SLOTS)[number] | (typeof SUNNAH_SLOTS)[number];
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
  const day = new Date();
  day.setHours(12, 0, 0, 0);
  day.setDate(day.getDate() + dayOffset);

  const times = computePrayerTimes(
    { latitude: location.latitude, longitude: location.longitude },
    day,
    location.method,
    location.madhab,
  );

  const tomorrow = new Date(day);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowTimes = computePrayerTimes(
    { latitude: location.latitude, longitude: location.longitude },
    tomorrow,
    location.method,
    location.madhab,
  );
  const yesterday = new Date(day);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayTimes = computePrayerTimes(
    { latitude: location.latitude, longitude: location.longitude },
    yesterday,
    location.method,
    location.madhab,
  );

  const slots: ReminderPrayerSlot[] = [...OBLIGATORY_SLOTS, ...SUNNAH_SLOTS];
  const n = prefs.notificationPrefs;

  for (const slot of slots) {
    if (!isPrayerAlertEnabled(prefs, slot as PrayerId)) continue;

    const at = prayerDate(times, slot, tomorrowTimes.fajr, yesterdayTimes.maghrib, day);
    const label = PRAYER_LABELS[slot as PrayerId];
    const dayKey = day.toISOString().slice(0, 10);
    const isObligatory = OBLIGATORY_SLOTS.includes(slot as (typeof OBLIGATORY_SLOTS)[number]);

    reminders.push({
      id: `prayer:${slot}:${dayKey}`,
      fireAt: at,
      title: `${label} time`,
      body: isObligatory
        ? "It's time to pray. May Allah accept it from you."
        : "A sunnah prayer window is here. May Allah accept it from you.",
      channelId: "prayer",
      repeat: "date",
    });

    if (!isObligatory) continue;

    if (n.afterAzan) {
      const azanAt = addMinutes(at, AFTER_AZAN_MINUTES);
      reminders.push({
        id: `afterAzan:${slot}:${dayKey}`,
        fireAt: azanAt,
        title: `After ${label} adhan`,
        body: "Recite the supplication after the call to prayer.",
        channelId: "zikr",
        repeat: "date",
      });
    }

    if (n.beforePrayer) {
      const beforeAt = addMinutes(at, -BEFORE_PRAYER_MINUTES);
      reminders.push({
        id: `beforePrayer:${slot}:${dayKey}`,
        fireAt: beforeAt,
        title: `${label} soon`,
        body: "Prepare your heart — prayer is approaching.",
        channelId: "zikr",
        repeat: "date",
      });
    }

    if (n.afterPrayer) {
      const afterAt = addMinutes(at, AFTER_PRAYER_MINUTES);
      reminders.push({
        id: `afterPrayer:${slot}:${dayKey}`,
        fireAt: afterAt,
        title: `After ${label}`,
        body: "Take a moment for tasbih and dhikr.",
        channelId: "zikr",
        repeat: "date",
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
  enabled: boolean,
): void {
  if (!enabled) return;
  const { hour, minute } = parseHhMm(when);
  const fireAt = new Date();
  fireAt.setHours(hour, minute, 0, 0);
  reminders.push({ id, fireAt, title, body, channelId, repeat: "daily" });
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
    "Morning adhkar",
    "Begin your day in remembrance of Allah.",
    "zikr",
    n.morningZikr,
  );
  pushDailyReminder(
    reminders,
    "17:30",
    "eveningZikr",
    "Evening adhkar",
    "Take a moment for your evening dhikr.",
    "zikr",
    n.eveningZikr,
  );
  pushDailyReminder(
    reminders,
    prefs.bedtime ?? "22:30",
    "beforeSleep",
    "Before-sleep adhkar",
    "Recite your before-sleep supplications.",
    "zikr",
    n.beforeSleep,
  );
  pushDailyReminder(
    reminders,
    "20:00",
    "qaza",
    "Qaza reminder",
    "Make up a missed prayer or fast today.",
    "qaza",
    n.qaza,
  );

  // Drop reminders that already passed (date-based only).
  return reminders.filter((reminder) => {
    if (reminder.repeat === "daily") return true;
    return reminder.fireAt.getTime() > now.getTime() - 60_000;
  });
}

/** Human-readable schedule rows for the notification centre. */
export function summarizeReminders(
  reminders: BuiltReminder[],
  timeFormat: TimeFormat = "24",
): { id: string; title: string; body: string; time?: string }[] {
  const seen = new Set<string>();
  const rows: { id: string; title: string; body: string; time?: string }[] = [];

  for (const reminder of reminders) {
    const key =
      reminder.repeat === "daily"
        ? reminder.id
        : `${reminder.id}:${formatHhMm(reminder.fireAt.getHours(), reminder.fireAt.getMinutes())}`;
    if (seen.has(key)) continue;
    seen.add(key);

    rows.push({
      id: reminder.id,
      title: reminder.title,
      body: reminder.body,
      time: formatDisplayHhMm(reminder.fireAt.getHours(), reminder.fireAt.getMinutes(), timeFormat),
    });
  }

  return rows.sort((a, b) => (a.time ?? "").localeCompare(b.time ?? ""));
}
