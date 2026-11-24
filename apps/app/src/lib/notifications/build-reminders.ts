import type { ObligatoryPrayer, TimeFormat, UserPreferences } from "@munib-tracker/shared/types";

import i18n from "@/i18n";
import { type CoachReminderInput, pushCoachReminders } from "@/lib/coach/reminders";
import type { FamilyTiesReminderInput } from "@/lib/family-ties/model";
import { buildFamilyTiesReminders } from "@/lib/family-ties/reminders";
import type { StoredLocation } from "@/lib/location";
import { buildMuhasabahReminders, type MuhasabahReminderInput } from "@/lib/muhasabah/reminders";
import {
  pushAcceptanceHourReminders,
  pushFridayReminder,
  pushQuranRevisionReminders,
  pushWhiteDaysReminders,
} from "@/lib/notifications/calendar-reminders";
import {
  type DhulHijjahReminderInput,
  dedupeArafahEveNudges,
  pushDhulHijjahReminders,
} from "@/lib/notifications/dhul-hijjah-reminders";
import {
  type IqamahReminderInput,
  pushIqamahReminders,
} from "@/lib/notifications/iqamah-reminders";
import { pushPrayerReminders, zikrRoute } from "@/lib/notifications/prayer-reminders";
import { pushPreferredTimeReminders } from "@/lib/notifications/preferred-time-reminders";
import {
  pushRawatibNudgeReminders,
  type RawatibReminderInput,
} from "@/lib/notifications/rawatib-reminders";
import { normalizedBudgetPriority, priorityForKind } from "@/lib/notifications/reminder-budget";
import { isPastFireTime, nextDailyFireAt } from "@/lib/notifications/reminder-clock";
import {
  beforeSleepBodyWithHabits,
  pushSunnahHabitsReminders,
  type SunnahHabitsReminderInput,
} from "@/lib/notifications/sunnah-habits-reminders";
import {
  pushVaultRecordReminders,
  type VaultReminderOptions,
} from "@/lib/notifications/vault-reminders";
import { formatDisplayHhMm, getZonedParts } from "@/lib/time";
import {
  pushVoluntaryFastingReminders,
  type VoluntaryFastingReminderInput,
} from "@/lib/voluntary-fasting/reminders";

// §11 budget tiers — new reminder kinds take `priority: priorityForKind("<kind>")`.
export {
  budgetPriority,
  priorityForKind,
  REMINDER_BUDGET_TIER,
  type ReminderBudgetKind,
  type ReminderBudgetTier,
  reminderBudgetTier,
} from "@/lib/notifications/reminder-budget";

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
   * Android OS channel override. Set with {@link sound} on adhan reminders to the
   * selected style's channel (`adhan-<styleId>`), since Android channel sounds are
   * fixed at creation. `channelId` stays the logical kind (`prayerAdhan`).
   */
  androidChannelId?: string;
  /**
   * Scheduling priority — lower numbers keep a slot when we trim to the iOS
   * pending-notification budget (~64). §11 tiers: `budgetPriority(tier, rank)`
   * / `priorityForKind(kind)` from `reminder-budget.ts` (a bare tier 1–5 also works).
   */
  priority: number;
  /**
   * Obligatory prayer id for Mark-from-notification actions (fard main reminders only).
   * Paired with {@link prayerDateKey} so the handler can enqueue `mark-prayer`.
   */
  prayerId?: ObligatoryPrayer;
  /** YYYY-MM-DD prayer-day key matching {@link prayerId} when set. */
  prayerDateKey?: string;
};

/**
 * Prayer times shift daily, so they must use DATE triggers. Keep the window short
 * and refresh on foreground (`rescheduleAll`) so we stay under the iOS cap of 64
 * pending local notifications per app.
 * https://developer.apple.com/documentation/usernotifications/unusernotificationcenter/add(_:withcompletionhandler:)
 */
export const SCHEDULE_DAYS_AHEAD = 2;

/**
 * Leave headroom for snooze / achievement one-shots. iOS keeps only the 64
 * soonest-firing pending local notifications and silently drops the rest.
 */
export const MAX_PENDING_REMINDERS = 60;

/**
 * §11 budget priorities (`tier × 100 + rank`, see `reminder-budget.ts`) of the
 * kinds built here. Lower keeps its slot when we trim to the OS budget; the
 * in-tier ranks preserve the pre-§11 order of every existing kind. Salah and
 * calendar nudges keep theirs next to their builders.
 */
const PRIORITY = {
  morningZikr: priorityForKind("salahZikr", 76),
  eveningZikr: priorityForKind("salahZikr", 77),
  beforeSleep: priorityForKind("salahZikr", 78),
  qaza: priorityForKind("qaza", 70),
  dailyContent: priorityForKind("dailyNudge", 80),
  /** NF-3.7 family-ties weekly digest + parent nudge (§11 tier 5). */
  familyTies: priorityForKind("familyTies", 10),
  /** NF-3.6 nightly muhasabah (§11 tier 5). */
  muhasabah: priorityForKind("muhasabah", 20),
  /** NF-3.8 "A payment is due" (§11 tier 4). */
  debtsDue: priorityForKind("debtsDue", 10),
  /** NF-3.9 wasiyyah review (§11 tier 4). */
  wasiyyahReview: priorityForKind("wasiyyahReview", 20),
} as const;

type DailyReminderSpec = Pick<BuiltReminder, "id" | "title" | "body" | "channelId" | "route"> & {
  /** Wall-clock `HH:mm` in the location's timezone. */
  time: string;
  priority: number;
};

/**
 * One DAILY repeating notification for a fixed wall-clock time. Uses a single
 * OS slot instead of one DATE copy per day (critical for the iOS pending budget).
 */
function dailyReminder(
  spec: DailyReminderSpec,
  location: StoredLocation,
  now: Date,
): BuiltReminder {
  const { time, ...rest } = spec;
  return { ...rest, fireAt: nextDailyFireAt(time, now, location), repeat: "daily" };
}

/**
 * Keep reminders within the OS pending budget (§11): drop the lowest tier first
 * (5 → 2; tier 1 Salah/Adhan/Qaza is kept longest), then the highest in-tier
 * rank, then the latest fire time. The kept set is returned in fire order.
 */
export function trimRemindersToBudget(
  reminders: BuiltReminder[],
  max = MAX_PENDING_REMINDERS,
): BuiltReminder[] {
  if (reminders.length <= max) return reminders;
  return [...reminders]
    .sort(
      (a, b) =>
        normalizedBudgetPriority(a.priority) - normalizedBudgetPriority(b.priority) ||
        a.fireAt.getTime() - b.fireAt.getTime(),
    )
    .slice(0, Math.max(0, max))
    .sort((a, b) => a.fireAt.getTime() - b.fireAt.getTime());
}

/** True when the user still owes make-up Salah and/or fasting. */
export function hasOutstandingQazaDebt(
  counters: { remaining: number }[],
  roza: { remaining: number },
): boolean {
  return counters.some((counter) => counter.remaining > 0) || roza.remaining > 0;
}

/** Stable reminder ids used for the daily Qaza nudge (`qaza` or `qaza:YYYY-MM-DD`). */
export function isQazaReminderId(id: string): boolean {
  return id === "qaza" || id.startsWith("qaza:");
}

export type BuildRemindersOptions = {
  /** Qur'an practice: the revision reminder toggle (lives in practice prefs, not UserPreferences). */
  revisionReminderEnabled?: boolean;
  /** Qur'an practice: local day key (YYYY-MM-DD) → ayahs due on or before that day. */
  revisionDueByDay?: Record<string, number>;
  /** NF-3.15: local day key → a tajweed coaching item is due (adds a line to the revision reminder). */
  revisionTajweedDueByDay?: Record<string, boolean>;
  /**
   * When false, the daily Qaza nudge is omitted even if the preference is on.
   * Defaults to false so empty/cleared debt never schedules a make-up reminder.
   */
  hasQazaDebt?: boolean;
  /** NF-3.6 muhasabah reminder inputs (vault-derived; time + reviewed nights, no text). */
  muhasabah?: MuhasabahReminderInput;
  /** NF-3.7 family-ties inputs (vault-derived; due dates only, never names). */
  familyTies?: FamilyTiesReminderInput;
} & VoluntaryFastingReminderInput &
  VaultReminderOptions &
  SunnahHabitsReminderInput &
  CoachReminderInput &
  DhulHijjahReminderInput &
  RawatibReminderInput &
  IqamahReminderInput;

export function buildReminders(
  prefs: UserPreferences,
  location: StoredLocation,
  now = new Date(),
  options: BuildRemindersOptions = {},
): BuiltReminder[] {
  const n = prefs.notificationPrefs;
  const reminders: BuiltReminder[] = [];
  const excused = prefs.activeExcusedReason != null;

  // Default Makkah coords are a display fallback only — never schedule Salah/Adhan
  // against them or users who skipped location get wrong-time alerts.
  if (location.source !== "default") {
    for (let offset = 0; offset < SCHEDULE_DAYS_AHEAD; offset += 1) {
      pushPrayerReminders(reminders, prefs, location, now, offset);
    }
  }

  const daily: [enabled: boolean, spec: () => DailyReminderSpec][] = [
    [
      n.morningZikr,
      () => ({
        id: "morningZikr",
        time: "07:00",
        title: i18n.t("notif.reminders.morningZikrTitle"),
        body: i18n.t("notif.reminders.morningZikrBody"),
        channelId: "zikr",
        route: zikrRoute("morning"),
        priority: PRIORITY.morningZikr,
      }),
    ],
    [
      n.eveningZikr,
      () => ({
        id: "eveningZikr",
        time: "17:30",
        title: i18n.t("notif.reminders.eveningZikrTitle"),
        body: i18n.t("notif.reminders.eveningZikrBody"),
        channelId: "zikr",
        route: zikrRoute("evening"),
        priority: PRIORITY.eveningZikr,
      }),
    ],
    [
      n.beforeSleep,
      () => ({
        id: "beforeSleep",
        time: prefs.bedtime ?? "22:30",
        title: i18n.t("notif.reminders.beforeSleepTitle"),
        // NF-3.5: bedtime sunnah habits fold into this text — no extra slot.
        body: beforeSleepBodyWithHabits(options),
        channelId: "zikr",
        route: zikrRoute("before_sleep"),
        priority: PRIORITY.beforeSleep,
      }),
    ],
    [
      n.qaza && options.hasQazaDebt === true,
      () => ({
        id: "qaza",
        time: "20:00",
        title: i18n.t("notif.reminders.qazaTitle"),
        body: i18n.t("notif.reminders.qazaBody"),
        channelId: "qaza",
        route: "/qaza",
        priority: PRIORITY.qaza,
      }),
    ],
    [
      n.dailyContent,
      () => ({
        id: "dailyContent",
        time: "09:00",
        title: i18n.t("notif.reminders.dailyContentTitle"),
        body: i18n.t("notif.reminders.dailyContentBody"),
        channelId: "zikr",
        // Land the daily-content nudge on the curated daily-hadith archive (NF-2.10).
        route: "/hadith/daily",
        priority: PRIORITY.dailyContent,
      }),
    ],
  ];
  for (const [enabled, spec] of daily) {
    if (enabled) reminders.push(dailyReminder(spec(), location, now));
  }

  // Jumu'ah nudge — next Friday only; refreshed on reschedule.
  pushFridayReminder(reminders, location, now, n.friday);
  // Hour of acceptance — Asr + mid-window on the next Friday (needs location).
  pushAcceptanceHourReminders(reminders, location, now, n.friday);
  // White Days fasting — morning of each upcoming Hijri 13–15. A fast invite, so
  // an excused period pauses it (rule 5 / D31; M2).
  pushWhiteDaysReminders(reminders, location, now, n.whiteDays === true && !excused);
  // Qur'an revision — 09:00 on days with ayahs due (opt-in, practice prefs).
  pushQuranRevisionReminders(reminders, location, now, SCHEDULE_DAYS_AHEAD, options, excused);
  // NF-3.2 voluntary fasting — night-before intent, Arafah/Ashura 2-day nudge, suhoor (§11 tiers 2–3).
  pushVoluntaryFastingReminders(reminders, prefs, location, now, SCHEDULE_DAYS_AHEAD, options);
  // NF-3.3 Dhul-Hijjah — eve of the ten, daily card, Arafah eve, opt-in takbir (§11 tier 3).
  pushDhulHijjahReminders(reminders, prefs, location, now, SCHEDULE_DAYS_AHEAD, options);
  // 8 Dhul-Hijjah evening: one "intend the Arafah fast" nudge, not two (L6).
  dedupeArafahEveNudges(reminders);
  // NF-3.5 Sunnah habits — one opt-in evening nudge (§11 tier 5).
  pushSunnahHabitsReminders(reminders, prefs, location, now, options);
  // NF-3.14 weekly coach — one generic "reflection is ready" note on the coach day (§11 tier 5).
  pushCoachReminders(reminders, prefs, location, now, options);
  // NF-3.1 rawatib — opt-in one-off nudge after a marked fard (§11 tier 5).
  pushRawatibNudgeReminders(reminders, prefs, now, options);
  // NF-3.11 iqamah "leave now" for the home masjid — opt-in, only with iqamah times (§11 tier 2).
  pushIqamahReminders(reminders, prefs, location, now, SCHEDULE_DAYS_AHEAD, options);
  // D40 school's preferred-time reminder — opt-in, after Salah/iqamah so it never duplicates them (§11 tier 2).
  pushPreferredTimeReminders(reminders, prefs, location, now, SCHEDULE_DAYS_AHEAD);
  // NF-3.6 nightly muhasabah — opt-in, generic text, skips nights already reviewed.
  if (n.muhasabah === true && options.muhasabah) {
    reminders.push(
      ...buildMuhasabahReminders({
        location,
        now,
        bedtime: prefs.bedtime,
        reminder: options.muhasabah,
        priority: PRIORITY.muhasabah,
      }),
    );
  }
  // NF-3.7 family ties — weekly digest (count only) + one parent nudge; on unless turned off.
  if (n.familyTies !== false && options.familyTies) {
    reminders.push(
      ...buildFamilyTiesReminders({
        location,
        now,
        reminder: options.familyTies,
        excused,
        priority: PRIORITY.familyTies,
      }),
    );
  }

  // NF-3.8 debts due + NF-3.9 wasiyyah review — vault-derived dates, generic text (§11 tier 4).
  pushVaultRecordReminders(reminders, {
    prefs,
    location,
    now,
    options,
    priority: { debts: PRIORITY.debtsDue, wasiyyahReview: PRIORITY.wasiyyahReview },
  });

  // Drop reminders whose fire time has already passed (DATE only; daily uses next slot).
  const upcoming = reminders.filter((reminder) => !isPastFireTime(reminder.fireAt, now));
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
