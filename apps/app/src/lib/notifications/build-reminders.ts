import { PRAYER_LABELS } from "@munib-tracker/shared/constants";
import type { NotificationPreferences, UserPreferences } from "@munib-tracker/shared/types";

import type { StoredLocation } from "@/lib/location";
import { computePrayerTimes } from "@/lib/prayer-times";
import { formatHhMm, parseHhMm } from "@/lib/time";

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

const PRAYER_SLOTS = ["fajr", "dhuhr", "asr", "maghrib", "isha", "witr"] as const;
type ReminderPrayerSlot = (typeof PRAYER_SLOTS)[number];
const BEFORE_PRAYER_MINUTES = 10;
const AFTER_PRAYER_MINUTES = 10;
const AFTER_AZAN_MINUTES = 2;
const WITR_AFTER_ISHA_MINUTES = 20;
const SCHEDULE_DAYS_AHEAD = 7;

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
}

function witrTime(isha: Date): Date {
  return addMinutes(isha, WITR_AFTER_ISHA_MINUTES);
}

function prayerDate(times: ReturnType<typeof computePrayerTimes>, slot: ReminderPrayerSlot): Date {
  if (slot === "witr") return witrTime(times.isha);
  return times.timeForPrayer(slot) ?? times.fajr;
}

function pushPrayerReminders(
  reminders: BuiltReminder[],
  prefs: NotificationPreferences,
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

  const slots = PRAYER_SLOTS;

  for (const slot of slots) {
    const at = prayerDate(times, slot);
    const label = PRAYER_LABELS[slot];
    const dayKey = day.toISOString().slice(0, 10);

    if (prefs.prayer) {
      reminders.push({
        id: `prayer:${slot}:${dayKey}`,
        fireAt: at,
        title: `${label} time`,
        body: "It's time to pray. May Allah accept it from you.",
        channelId: "prayer",
        repeat: "date",
      });
    }

    if (prefs.afterAzan) {
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

    if (prefs.beforePrayer) {
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

    if (prefs.afterPrayer) {
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
    pushPrayerReminders(reminders, n, location, offset);
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
      time:
        reminder.repeat === "daily"
          ? formatHhMm(reminder.fireAt.getHours(), reminder.fireAt.getMinutes())
          : formatHhMm(reminder.fireAt.getHours(), reminder.fireAt.getMinutes()),
    });
  }

  return rows.sort((a, b) => (a.time ?? "").localeCompare(b.time ?? ""));
}
