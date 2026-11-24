import { rulesFor } from "@munib-tracker/shared/fiqh";
import type { ObligatoryPrayer, UserPreferences } from "@munib-tracker/shared/types";
import { addDays, getLocalDateString } from "@munib-tracker/shared/utils";

import i18n from "@/i18n";
import {
  DHUL_HIJJAH_MONTH,
  DHUL_QADAH_MONTH,
  MODE_LAST_DAY,
  tashriqSlots,
  tashriqSlotsAllViews,
} from "@/lib/dhul-hijjah";
import { gregorianToHijri } from "@/lib/hijri";
import { computeLocationPrayerTimes, type StoredLocation } from "@/lib/location";
import type { BuiltReminder } from "@/lib/notifications/build-reminders";
import { priorityForKind } from "@/lib/notifications/reminder-budget";
import { addMinutes, isPastFireTime, wallClockOnDay } from "@/lib/notifications/reminder-clock";
import { prayerDayAnchor, shiftPrayerDay } from "@/lib/time";
import { isPilgrimForHijriYear } from "@/lib/voluntary-fasting/pilgrim";

/**
 * Dhul-Hijjah mode reminders (NF-3.3, §11 tier 3 "seasonal"):
 *
 * - the evening before 12/1: "The ten days begin tomorrow" (with the udhiyah
 *   prompt while no intention is set);
 * - a morning card on each day 12/1–12/13;
 * - the eve of Arafah (evening of 12/8);
 * - Takbir al-Tashriq after each fard in the window — only when the user turned
 *   on `notificationPrefs.takbirTashriq` (default off).
 *
 * The seasonal ones follow `notificationPrefs.dhulHijjah` (default on). Any
 * excused period pauses all of them (§2.5). Copy never mentions private state.
 * For someone performing Hajj that year the Arafah copy drops the fast nudge.
 */

export const DHUL_HIJJAH_ROUTE = "/dhul-hijjah";
const EVE_TIME = "20:00";
const MORNING_TIME = "07:30";
/** Takbir reminder offset after the fard's start time. */
export const TAKBIR_AFTER_FARD_MINUTES = 10;

const PRIORITY = {
  eve: priorityForKind("seasonal", 60),
  arafahEve: priorityForKind("seasonal", 61),
  morning: priorityForKind("seasonal", 65),
  takbir: priorityForKind("seasonal", 68),
} as const;

export interface DhulHijjahReminderInput {
  dhulHijjah?: {
    /** Hijri year → whether "I intend udhiyah" is already set. */
    intendsUdhiyahByYear: Record<string, boolean>;
  };
}

type MorningVariant = "ten" | "arafah" | "eid" | "tashriq";

function morningVariant(day: number): MorningVariant {
  if (day <= 8) return "ten";
  if (day === 9) return "arafah";
  if (day === 10) return "eid";
  return "tashriq";
}

export function pushDhulHijjahReminders(
  reminders: BuiltReminder[],
  prefs: UserPreferences,
  location: StoredLocation,
  now: Date,
  daysAhead: number,
  options: DhulHijjahReminderInput,
): void {
  const n = prefs.notificationPrefs;
  const seasonal = n.dhulHijjah !== false;
  const takbir = n.takbirTashriq === true;
  if (!seasonal && !takbir) return;
  if (prefs.activeExcusedReason != null) return;

  const tz = location.timeZone;
  const anchor = prayerDayAnchor(now, tz);
  const push = (reminder: BuiltReminder) => {
    if (!isPastFireTime(reminder.fireAt, now)) reminders.push(reminder);
  };

  for (let offset = 0; offset < daysAhead; offset += 1) {
    const day = shiftPrayerDay(anchor, offset);
    const key = getLocalDateString(day);
    // `day` is already the location's calendar day (device-local midnight with the
    // location's Y/M/D) — convert it as-is; passing `tz` would re-zone it (M1).
    const hijri = gregorianToHijri(day);
    const next = gregorianToHijri(shiftPrayerDay(day, 1));

    if (seasonal && hijri.month === DHUL_QADAH_MONTH && next.month === DHUL_HIJJAH_MONTH) {
      const intends = options.dhulHijjah?.intendsUdhiyahByYear[String(next.year)] === true;
      push({
        id: `dhulHijjah:eve:${key}`,
        fireAt: wallClockOnDay(day, EVE_TIME, tz),
        title: i18n.t("dhulHijjah.reminder.eveTitle"),
        body: intends
          ? i18n.t("dhulHijjah.reminder.eveBody")
          : i18n.t("dhulHijjah.reminder.eveBodyUdhiyah"),
        channelId: "zikr",
        repeat: "date",
        route: DHUL_HIJJAH_ROUTE,
        priority: PRIORITY.eve,
      });
    }

    if (hijri.month !== DHUL_HIJJAH_MONTH || hijri.day > MODE_LAST_DAY) continue;

    if (seasonal) {
      const variant = morningVariant(hijri.day);
      const pilgrim = isPilgrimForHijriYear(prefs.voluntaryFasting, hijri.year);
      push({
        id: `dhulHijjah:day:${key}`,
        fireAt: wallClockOnDay(day, MORNING_TIME, tz),
        title: i18n.t(`dhulHijjah.reminder.morningTitle.${variant}`, { day: hijri.day }),
        body:
          variant === "arafah" && pilgrim
            ? i18n.t("dhulHijjah.reminder.morningBodyArafahPilgrim")
            : i18n.t(`dhulHijjah.reminder.morningBody.${variant}`),
        channelId: "zikr",
        repeat: "date",
        route: DHUL_HIJJAH_ROUTE,
        priority: PRIORITY.morning,
      });
      if (hijri.day === 8) {
        push({
          id: `dhulHijjah:arafahEve:${key}`,
          fireAt: wallClockOnDay(day, EVE_TIME, tz),
          title: i18n.t("dhulHijjah.reminder.arafahEveTitle"),
          body: pilgrim
            ? i18n.t("dhulHijjah.reminder.arafahEveBodyPilgrim")
            : i18n.t("dhulHijjah.reminder.arafahEveBody"),
          channelId: "zikr",
          repeat: "date",
          route: `${DHUL_HIJJAH_ROUTE}?focus=arafah`,
          priority: PRIORITY.arafahEve,
        });
      }
    }

    // Takbir needs real Salah times — never the default Makkah fallback.
    if (takbir && location.source !== "default") {
      const rules = rulesFor(prefs, "salah");
      const slots = rules ? tashriqSlots(rules, hijri.year) : tashriqSlotsAllViews(hijri.year);
      const prayers = slots.filter((s) => s.date === key).map((s) => s.prayer);
      if (prayers.length === 0) continue;
      const times = computeLocationPrayerTimes(location, day);
      for (const prayer of prayers) {
        const start = times.timeForPrayer(prayer as ObligatoryPrayer);
        if (!start) continue;
        push({
          id: `takbirTashriq:${key}:${prayer}`,
          fireAt: addMinutes(start, TAKBIR_AFTER_FARD_MINUTES),
          title: i18n.t("dhulHijjah.reminder.takbirTitle"),
          body: i18n.t("dhulHijjah.reminder.takbirBody", { prayer: i18n.t(`prayers.${prayer}`) }),
          channelId: "zikr",
          repeat: "date",
          route: `${DHUL_HIJJAH_ROUTE}?focus=tashriq`,
          priority: PRIORITY.takbir,
        });
      }
    }
  }
}

/**
 * On the evening of 8 Dhul-Hijjah both the Arafah eve card and the voluntary
 * fasting "Fast tomorrow?" intent (`fastIntent:<9 DH>`) would ask the same thing
 * at about the same time. Keep the Arafah eve card (it is pilgrim-aware and
 * also covers the duas) and drop the duplicate intent nudge. Mutates in place.
 */
export function dedupeArafahEveNudges(reminders: BuiltReminder[]): void {
  const arafahDays = new Set<string>();
  for (const reminder of reminders) {
    if (!reminder.id.startsWith("dhulHijjah:arafahEve:")) continue;
    const eveKey = reminder.id.slice("dhulHijjah:arafahEve:".length);
    arafahDays.add(addDays(eveKey, 1));
  }
  if (arafahDays.size === 0) return;
  for (let i = reminders.length - 1; i >= 0; i -= 1) {
    const id = reminders[i]?.id ?? "";
    if (id.startsWith("fastIntent:") && arafahDays.has(id.slice("fastIntent:".length))) {
      reminders.splice(i, 1);
    }
  }
}
