import { getLocalDateString } from "@munib-tracker/shared/utils";

import i18n from "@/i18n";
import { ACCEPTANCE_HOUR_ROUTE, acceptanceHourMidpoint } from "@/lib/acceptance-hour";
import { computeLocationPrayerTimes, type StoredLocation } from "@/lib/location";
import type { BuildRemindersOptions, BuiltReminder } from "@/lib/notifications/build-reminders";
import { priorityForKind } from "@/lib/notifications/reminder-budget";
import { isPastFireTime, wallClockOnDay } from "@/lib/notifications/reminder-clock";
import { prayerDayAnchor, shiftPrayerDay } from "@/lib/time";
import { isWhiteDay, whiteDaysChecklistHref } from "@/lib/white-days";

/**
 * Dated nudges tied to the calendar rather than to each Salah: Jumu'ah (Kahf
 * morning + the hour of acceptance), the White Days fast and the Qur'an practice
 * revision. Each is a one-off DATE trigger re-armed on every reschedule pass.
 */

const PRIORITY = {
  /** Hour of acceptance (Asr + mid-window) — slightly ahead of the Kahf nudge. */
  acceptanceHour: priorityForKind("dailyNudge", 83),
  friday: priorityForKind("dailyNudge", 85),
  /** White Days fasting — morning of Hijri 13–15. */
  whiteDays: priorityForKind("dailyNudge", 86),
  /** Qur'an practice revision — last of the daily nudges: a full budget drops it before any Salah alert. */
  quranRevision: priorityForKind("dailyNudge", 90),
} as const;

const FRIDAY = 5;
const KAHF_TIME = "11:00";
const WHITE_DAYS_TIME = "05:30";
const REVISION_TIME = "09:00";
/** Hijri 13–15 of the current or the next month always fall within this many days. */
const WHITE_DAYS_LOOKAHEAD_DAYS = 16;

/** Prayer-day anchors for the next `count` days, starting today in the location's zone. */
function upcomingDays(now: Date, location: StoredLocation, count: number): Date[] {
  const anchor = prayerDayAnchor(now, location.timeZone);
  return Array.from({ length: count }, (_, offset) => shiftPrayerDay(anchor, offset));
}

/** Kahf nudge on the next Friday (or today, while still upcoming). */
export function pushFridayReminder(
  reminders: BuiltReminder[],
  location: StoredLocation,
  now: Date,
  enabled: boolean,
): void {
  if (!enabled) return;
  for (const day of upcomingDays(now, location, 8)) {
    if (day.getDay() !== FRIDAY) continue;
    const fireAt = wallClockOnDay(day, KAHF_TIME, location.timeZone);
    if (isPastFireTime(fireAt, now)) continue;
    reminders.push({
      id: `friday:${getLocalDateString(day)}`,
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

/**
 * White Days (Ayyām al-Bīḍ) fasting nudge — 05:30 local on each upcoming Hijri
 * 13th/14th/15th (covers next month's set once this month's has passed). Routes
 * into the Tracker checklist. Opt-in via `notificationPrefs.whiteDays`.
 */
export function pushWhiteDaysReminders(
  reminders: BuiltReminder[],
  location: StoredLocation,
  now: Date,
  enabled: boolean,
): void {
  if (!enabled) return;
  const route = whiteDaysChecklistHref();
  for (const day of upcomingDays(now, location, WHITE_DAYS_LOOKAHEAD_DAYS + 1)) {
    // `day` already carries the location's Y/M/D — no second re-zoning (M1).
    if (!isWhiteDay(day)) continue;
    const fireAt = wallClockOnDay(day, WHITE_DAYS_TIME, location.timeZone);
    if (isPastFireTime(fireAt, now)) continue;
    reminders.push({
      id: `whiteDays:${getLocalDateString(day)}`,
      fireAt,
      title: i18n.t("notif.reminders.whiteDaysTitle"),
      body: i18n.t("notif.reminders.whiteDaysBody"),
      channelId: "zikr",
      repeat: "date",
      route,
      priority: PRIORITY.whiteDays,
    });
  }
}

/**
 * Friday hour of acceptance — at Asr and mid Asr→Maghrib on the nearest Friday
 * with an upcoming fire. Needs a real location (same guard as Salah alerts) and
 * shares the Friday preference with the Kahf nudge.
 */
export function pushAcceptanceHourReminders(
  reminders: BuiltReminder[],
  location: StoredLocation,
  now: Date,
  enabled: boolean,
): void {
  if (!enabled || location.source === "default") return;
  for (const day of upcomingDays(now, location, 8)) {
    if (day.getDay() !== FRIDAY) continue;
    const times = computeLocationPrayerTimes(location, day);
    const dayKey = getLocalDateString(day);
    const slots = [
      { kind: "asr", fireAt: times.asr },
      { kind: "mid", fireAt: acceptanceHourMidpoint(times.asr, times.maghrib) },
    ] as const;

    let scheduledAny = false;
    for (const slot of slots) {
      if (isPastFireTime(slot.fireAt, now)) continue;
      if (slot.fireAt.getTime() >= times.maghrib.getTime()) continue;
      reminders.push({
        id: `fridayAcceptance:${slot.kind}:${dayKey}`,
        fireAt: slot.fireAt,
        title: i18n.t("notif.reminders.acceptanceHourTitle"),
        body:
          slot.kind === "asr"
            ? i18n.t("notif.reminders.acceptanceHourBodyAsr")
            : i18n.t("notif.reminders.acceptanceHourBodyMid"),
        channelId: "zikr",
        repeat: "date",
        route: ACCEPTANCE_HOUR_ROUTE,
        priority: PRIORITY.acceptanceHour,
      });
      scheduledAny = true;
    }
    // Prefer the nearest Friday that still has at least one upcoming fire.
    if (scheduledAny) return;
  }
}

/**
 * Qur'an practice revision reminder (§10): one dated row per day in the schedule
 * horizon with ayahs due, at 09:00 local. Never names the ayah — only the count.
 */
export function pushQuranRevisionReminders(
  reminders: BuiltReminder[],
  location: StoredLocation,
  now: Date,
  daysAhead: number,
  options: BuildRemindersOptions,
  excused: boolean,
): void {
  if (!options.revisionReminderEnabled || !options.revisionDueByDay) return;
  for (const day of upcomingDays(now, location, daysAhead)) {
    const dayKey = getLocalDateString(day);
    const count = options.revisionDueByDay[dayKey] ?? 0;
    if (count <= 0) continue;
    const fireAt = wallClockOnDay(day, REVISION_TIME, location.timeZone);
    if (isPastFireTime(fireAt, now)) continue;
    // NF-3.15: an optional line for a due tajweed coaching sound (same reminder,
    // no extra notification; generic text; paused during excused periods).
    const withTajweed = !excused && options.revisionTajweedDueByDay?.[dayKey] === true;
    reminders.push({
      id: `quran-revision:${dayKey}`,
      fireAt,
      title: i18n.t("quranCompanion.reminder.title"),
      body: withTajweed
        ? i18n.t("tajweedCoaching.reminder.body", { count })
        : i18n.t("quranCompanion.reminder.body", { count }),
      channelId: "zikr",
      repeat: "date",
      route: "/quran/revision",
      priority: PRIORITY.quranRevision,
    });
  }
}
