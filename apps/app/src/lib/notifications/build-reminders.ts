import { ADHAN_PRAYER_SET, clampPrayerReminderOffset } from "@munib-tracker/shared/constants";
import type {
  ObligatoryPrayer,
  PrayerId,
  TimeFormat,
  UserPreferences,
} from "@munib-tracker/shared/types";
import { getLocalDateString } from "@munib-tracker/shared/utils";
import i18n from "@/i18n";
import { ACCEPTANCE_HOUR_ROUTE, acceptanceHourMidpoint } from "@/lib/acceptance-hour";
import { afterSalahAdhkarHref } from "@/lib/after-salah-adhkar-reminder";
import { type CoachReminderInput, pushCoachReminders } from "@/lib/coach/reminders";
import type { FamilyTiesReminderInput } from "@/lib/family-ties/model";
import { buildFamilyTiesReminders } from "@/lib/family-ties/reminders";
import { locationCalcExtras, type StoredLocation } from "@/lib/location";
import { buildMuhasabahReminders, type MuhasabahReminderInput } from "@/lib/muhasabah/reminders";
import { adhanChannelId, adhanNotificationSound } from "@/lib/notifications/adhan-sounds";
import {
  type DhulHijjahReminderInput,
  dedupeArafahEveNudges,
  pushDhulHijjahReminders,
} from "@/lib/notifications/dhul-hijjah-reminders";
import {
  type IqamahReminderInput,
  pushIqamahReminders,
} from "@/lib/notifications/iqamah-reminders";
import { pushPreferredTimeReminders } from "@/lib/notifications/preferred-time-reminders";
import {
  pushRawatibNudgeReminders,
  type RawatibReminderInput,
} from "@/lib/notifications/rawatib-reminders";
import { normalizedBudgetPriority, priorityForKind } from "@/lib/notifications/reminder-budget";
import {
  beforeSleepBodyWithHabits,
  pushSunnahHabitsReminders,
  type SunnahHabitsReminderInput,
} from "@/lib/notifications/sunnah-habits-reminders";
import {
  pushVaultRecordReminders,
  type VaultReminderOptions,
} from "@/lib/notifications/vault-reminders";
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
import {
  pushVoluntaryFastingReminders,
  type VoluntaryFastingReminderInput,
} from "@/lib/voluntary-fasting/reminders";
import { isWhiteDay, whiteDaysChecklistHref } from "@/lib/white-days";

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

/**
 * §11 budget priorities (`tier × 100 + rank`, see `reminder-budget.ts`). Lower
 * keeps its slot when we trim to the OS budget; the in-tier ranks preserve the
 * pre-§11 order of every existing kind.
 */
const PRIORITY = {
  fard: priorityForKind("prayer", 10),
  witr: priorityForKind("prayer", 20),
  sunnah: priorityForKind("prayer", 30),
  // Zikr nudges are §11 tier 3 (only Salah, Adhan and Qaza are tier 1), after the
  // named fast-intent / seasonal kinds and before the other daily nudges (M3).
  afterAzan: priorityForKind("salahZikr", 73),
  beforePrayer: priorityForKind("salahZikr", 74),
  afterPrayer: priorityForKind("salahZikr", 75),
  morningZikr: priorityForKind("salahZikr", 76),
  eveningZikr: priorityForKind("salahZikr", 77),
  beforeSleep: priorityForKind("salahZikr", 78),
  qaza: priorityForKind("qaza", 70),
  dailyContent: priorityForKind("dailyNudge", 80),
  friday: priorityForKind("dailyNudge", 85),
  /** Hour of acceptance (Asr + mid-window) — slightly ahead of Kahf nudge. */
  acceptanceHour: priorityForKind("dailyNudge", 83),
  /** White Days fasting — morning of Hijri 13–15. */
  whiteDays: priorityForKind("dailyNudge", 86),
  /** Qur'an practice revision — last of the daily nudges: a full budget drops it before any Salah alert. */
  quranRevision: priorityForKind("dailyNudge", 90),
  /** NF-3.7 family-ties weekly digest + parent nudge (§11 tier 5). */
  familyTies: priorityForKind("familyTies", 10),
  /** NF-3.6 nightly muhasabah (§11 tier 5). */
  muhasabah: priorityForKind("muhasabah", 20),
  /** NF-3.8 "A payment is due" (§11 tier 4). */
  debtsDue: priorityForKind("debtsDue", 10),
  /** NF-3.9 wasiyyah review (§11 tier 4). */
  wasiyyahReview: priorityForKind("wasiyyahReview", 20),
} as const;

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
    // Local calendar day — never UTC (`toISOString`), or Mark fails east of UTC.
    const dayKey = getLocalDateString(day);
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
      // B2: the selected adhan style's registered sound + its own Android channel.
      ...(playAdhan
        ? {
            sound: adhanNotificationSound(prefs.adhanStyleId),
            androidChannelId: adhanChannelId(prefs.adhanStyleId),
          }
        : {}),
      ...(isFard ? { prayerId: slot as ObligatoryPrayer, prayerDateKey: dayKey } : {}),
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

/**
 * Qur'an practice revision reminder (§10): a dated row per day in the schedule
 * horizon with ayahs due, at 09:00 local. Never names the ayah — only the count.
 */
function pushQuranRevisionReminders(
  reminders: BuiltReminder[],
  location: StoredLocation,
  now: Date,
  options: BuildRemindersOptions,
  excused = false,
): void {
  if (!options.revisionReminderEnabled || !options.revisionDueByDay) return;
  const { hour, minute } = parseHhMm("09:00");
  const anchor = prayerDayAnchor(now, location.timeZone);
  for (let offset = 0; offset < SCHEDULE_DAYS_AHEAD; offset += 1) {
    const day = shiftPrayerDay(anchor, offset);
    const dayKey = `${day.getFullYear()}-${`${day.getMonth() + 1}`.padStart(2, "0")}-${`${day.getDate()}`.padStart(2, "0")}`;
    const count = options.revisionDueByDay[dayKey] ?? 0;
    if (count <= 0) continue;
    const fireAt = wallClockInTimeZoneToDate(
      day.getFullYear(),
      day.getMonth() + 1,
      day.getDate(),
      hour,
      minute,
      location.timeZone,
    );
    if (fireAt.getTime() <= now.getTime() - 60_000) continue;
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

/**
 * White Days (Ayyām al-Bīḍ) fasting nudge — DATE triggers at 05:30 local on
 * each upcoming Hijri 13th/14th/15th within the next ~16 days (covers the next
 * month's White Days when the current set has already passed). Routes into the
 * Tracker checklist. Opt-in via `notificationPrefs.whiteDays`.
 */
function pushWhiteDaysReminders(
  reminders: BuiltReminder[],
  location: StoredLocation,
  now: Date,
  enabled: boolean,
): void {
  if (!enabled) return;
  const { hour, minute } = parseHhMm("05:30");
  const anchor = prayerDayAnchor(now, location.timeZone);
  const route = whiteDaysChecklistHref();

  for (let offset = 0; offset <= 16; offset += 1) {
    const day = shiftPrayerDay(anchor, offset);
    // `day` already carries the location's Y/M/D — no second re-zoning (M1).
    if (!isWhiteDay(day)) continue;

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
      id: `whiteDays:${dayKey}`,
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
 * Friday hour of acceptance — DATE triggers at Asr and mid Asr→Maghrib.
 * Requires a real location (same guard as Salah alerts). Shares the Friday
 * notification preference with the Kahf morning nudge.
 */
function pushAcceptanceHourReminders(
  reminders: BuiltReminder[],
  location: StoredLocation,
  now: Date,
  enabled: boolean,
): void {
  if (!enabled || location.source === "default") return;

  const anchor = prayerDayAnchor(now, location.timeZone);
  const extras = locationCalcExtras(location);

  for (let offset = 0; offset <= 7; offset += 1) {
    const day = shiftPrayerDay(anchor, offset);
    if (day.getDay() !== 5) continue;

    const times = computePrayerTimes(
      { latitude: location.latitude, longitude: location.longitude },
      day,
      location.method,
      location.madhab,
      extras,
    );
    const asrAt = times.asr;
    const midAt = acceptanceHourMidpoint(times.asr, times.maghrib);
    const dayKey = `${day.getFullYear()}-${`${day.getMonth() + 1}`.padStart(2, "0")}-${`${day.getDate()}`.padStart(2, "0")}`;

    const slots: { kind: "asr" | "mid"; fireAt: Date }[] = [
      { kind: "asr", fireAt: asrAt },
      { kind: "mid", fireAt: midAt },
    ];

    let scheduledAny = false;
    for (const slot of slots) {
      if (slot.fireAt.getTime() <= now.getTime() - 60_000) continue;
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
  const hasQazaDebt = options.hasQazaDebt === true;

  // Default Makkah coords are a display fallback only — never schedule Salah/Adhan
  // against them or users who skipped location get wrong-time alerts.
  if (location.source !== "default") {
    for (let offset = 0; offset < SCHEDULE_DAYS_AHEAD; offset += 1) {
      pushPrayerReminders(reminders, prefs, location, offset);
    }
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
    // NF-3.5: bedtime sunnah habits fold into this text — no extra slot.
    beforeSleepBodyWithHabits(options),
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
    n.qaza && hasQazaDebt,
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
  // Hour of acceptance — Asr + mid-window on the next Friday (needs location).
  pushAcceptanceHourReminders(reminders, location, now, n.friday);
  // White Days fasting — morning of each upcoming Hijri 13–15. A fast invite, so
  // an excused period pauses it (rule 5 / D31; M2).
  pushWhiteDaysReminders(
    reminders,
    location,
    now,
    n.whiteDays === true && prefs.activeExcusedReason == null,
  );
  // Qur'an revision — 09:00 on days with ayahs due (opt-in, practice prefs).
  pushQuranRevisionReminders(reminders, location, now, options, prefs.activeExcusedReason != null);
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
        excused: prefs.activeExcusedReason != null,
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
