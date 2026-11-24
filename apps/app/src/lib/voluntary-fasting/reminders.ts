import {
  type UserPreferences,
  type VoluntaryFastingMap,
  WEEKLY_FAST_KINDS,
} from "@munib-tracker/shared/types";
import {
  addDays,
  classifyFastDay,
  getLocalDateString,
  isLiveFastEntry,
  matchesEnabledKinds,
} from "@munib-tracker/shared/utils";

import i18n from "@/i18n";
import { locationCalcExtras, type StoredLocation } from "@/lib/location";
import type { BuiltReminder } from "@/lib/notifications/build-reminders";
import { priorityForKind } from "@/lib/notifications/reminder-budget";
import { computePrayerTimes } from "@/lib/prayer-times";
import { parseHhMm, prayerDayAnchor, shiftPrayerDay, wallClockInTimeZoneToDate } from "@/lib/time";

import { buildFastingContext } from "./context";
import { headlineKind } from "./kinds";
import { parseIntentTime, resolveFastingNotificationPrefs } from "./prefs";

/**
 * Voluntary fasting reminders (NF-3.2, §11 budget):
 *
 * - `fastIntent` (tier 3) the night before a recommended day the user follows,
 *   only when that day has no entry yet. Weekly (Mon/Thu-only) days follow
 *   `notificationPrefs.voluntaryFasting.weekly`; every other kind `seasonal`.
 * - Arafah / Ashura get an extra seasonal nudge two days ahead (tier 3).
 * - `suhoor` (tier 2) at Fajr − 45 min on days marked `intended` (opt-in
 *   `voluntaryFasting.suhoorAlarm`, needs a real location).
 *
 * Any excused period (hayd / sick / travel) pauses all of them. Copy never
 * names a private state — only the day ("Tomorrow is the Day of Arafah").
 */

export const SUHOOR_MINUTES_BEFORE_FAJR = 45;
const DEFAULT_INTENT_FALLBACK = "21:00";
/**
 * §11 tier 2, ranked ahead of iqamah (10) and the D40 preferred time (30): a
 * missed suhoor alarm can cost the fast itself, so a full budget drops it last
 * within the tier.
 */
export const PRIORITY_SUHOOR = priorityForKind("suhoor", 5);
const PRIORITY_INTENT = priorityForKind("fastIntent", 70);
const PRIORITY_SEASONAL = priorityForKind("seasonal", 72);

export interface VoluntaryFastingReminderInput {
  /** The voluntary fasting log (read straight from storage by the scheduler). */
  voluntaryFastingEntries?: VoluntaryFastingMap;
}

function fireAtClock(day: Date, hhmm: string, timeZone: string | undefined): Date {
  const { hour, minute } = parseHhMm(hhmm);
  return wallClockInTimeZoneToDate(
    day.getFullYear(),
    day.getMonth() + 1,
    day.getDate(),
    hour,
    minute,
    timeZone,
  );
}

function timesFor(location: StoredLocation, day: Date) {
  return computePrayerTimes(
    { latitude: location.latitude, longitude: location.longitude },
    day,
    location.method,
    location.madhab,
    locationCalcExtras(location),
  );
}

/** Evening fire time on `day` for the intent reminder (`HH:mm` or Isha + N min). */
function intentFireAt(prefsTime: string, day: Date, location: StoredLocation): Date {
  const parsed = parseIntentTime(prefsTime);
  if (parsed.kind === "clock") return fireAtClock(day, parsed.hhmm, location.timeZone);
  if (location.source === "default") {
    return fireAtClock(day, DEFAULT_INTENT_FALLBACK, location.timeZone);
  }
  return new Date(timesFor(location, day).isha.getTime() + parsed.minutes * 60_000);
}

export function pushVoluntaryFastingReminders(
  reminders: BuiltReminder[],
  prefs: UserPreferences,
  location: StoredLocation,
  now: Date,
  daysAhead: number,
  input: VoluntaryFastingReminderInput = {},
): void {
  // Excused periods pause every fasting nudge (hayd, illness, travel).
  if (prefs.activeExcusedReason) return;
  const toggles = resolveFastingNotificationPrefs(prefs.notificationPrefs);
  const entries = input.voluntaryFastingEntries ?? {};
  const ctx = buildFastingContext(prefs, entries);
  const fastingPrefs = ctx.prefs;
  if (!fastingPrefs) return;
  const anchor = prayerDayAnchor(now, location.timeZone);
  const cutoff = now.getTime() - 60_000;

  const hasEntry = (date: string) => isLiveFastEntry(entries[date]);

  for (let offset = 0; offset < daysAhead; offset += 1) {
    const evening = shiftPrayerDay(anchor, offset);
    const eveningKey = getLocalDateString(evening);

    // Night-before intent.
    const target = addDays(eveningKey, 1);
    const day = classifyFastDay(target, ctx);
    if (!day.blocking && matchesEnabledKinds(day, fastingPrefs) && !hasEntry(target)) {
      const followed = day.kinds.filter(
        (kind) => kind === "dawud" || fastingPrefs.enabledKinds.includes(kind),
      );
      const weeklyOnly = followed.every((kind) => WEEKLY_FAST_KINDS.includes(kind));
      // White Days already have their own morning nudge when that is on.
      const coveredByWhiteDays =
        prefs.notificationPrefs.whiteDays &&
        followed.every((kind) => kind === "white_day" || WEEKLY_FAST_KINDS.includes(kind)) &&
        followed.includes("white_day");
      const allowed = weeklyOnly ? toggles.weekly : toggles.seasonal && !coveredByWhiteDays;
      const fireAt = intentFireAt(fastingPrefs.intentReminderTime, evening, location);
      if (allowed && fireAt.getTime() > cutoff) {
        const kind = headlineKind(followed) ?? "other";
        reminders.push({
          id: `fastIntent:${target}`,
          fireAt,
          title: i18n.t("voluntaryFasting.notif.intentTitle"),
          body: i18n.t("voluntaryFasting.notif.intentBody", {
            day: i18n.t(`voluntaryFasting.kind.${kind}`),
          }),
          channelId: "zikr",
          repeat: "date",
          route: `/fasting?date=${target}`,
          priority: PRIORITY_INTENT,
        });
      }
    }

    // Arafah / Ashura: an extra nudge two days ahead (so Tasu'a can be added too).
    const ahead = addDays(eveningKey, 2);
    const aheadDay = classifyFastDay(ahead, ctx);
    const seasonalKind = (["arafah", "ashura"] as const).find(
      (kind) => aheadDay.kinds.includes(kind) && fastingPrefs.enabledKinds.includes(kind),
    );
    if (seasonalKind && toggles.seasonal && !aheadDay.blocking && !hasEntry(ahead)) {
      const fireAt = intentFireAt(fastingPrefs.intentReminderTime, evening, location);
      if (fireAt.getTime() > cutoff) {
        reminders.push({
          id: `fastSeasonal:${ahead}`,
          fireAt,
          title: i18n.t(`voluntaryFasting.notif.${seasonalKind}AheadTitle`),
          body: i18n.t(`voluntaryFasting.notif.${seasonalKind}AheadBody`),
          channelId: "zikr",
          repeat: "date",
          route: `/fasting?date=${ahead}`,
          priority: PRIORITY_SEASONAL,
        });
      }
    }
  }

  // Suhoor alarm on intended days (today and the schedule horizon).
  if (!fastingPrefs.suhoorAlarm || location.source === "default") return;
  for (let offset = 0; offset <= daysAhead; offset += 1) {
    const day = shiftPrayerDay(anchor, offset);
    const key = getLocalDateString(day);
    const entry = entries[key];
    if (!isLiveFastEntry(entry) || entry.status !== "intended") continue;
    const fireAt = new Date(
      timesFor(location, day).fajr.getTime() - SUHOOR_MINUTES_BEFORE_FAJR * 60_000,
    );
    if (fireAt.getTime() <= cutoff) continue;
    reminders.push({
      id: `suhoor:${key}`,
      fireAt,
      title: i18n.t("voluntaryFasting.notif.suhoorTitle"),
      body: i18n.t("voluntaryFasting.notif.suhoorBody"),
      channelId: "zikr",
      repeat: "date",
      route: `/fasting?date=${key}`,
      priority: PRIORITY_SUHOOR,
    });
  }
}
