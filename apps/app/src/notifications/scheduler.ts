import type { UserPreferences } from "@munib-tracker/shared/types";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import i18n from "@/i18n";
import { coachReminderOptions } from "@/lib/coach/reminder-options";
import { nativeEnqueueCommand } from "@/lib/external-commands/native-bridge";
import { familyTiesReminderOptions } from "@/lib/family-ties/reminder-options";
import type { StoredLocation } from "@/lib/location";
import { iqamahReminderOptions } from "@/lib/masjid/iqamah-reminder-options";
import { muhasabahReminderOptions } from "@/lib/muhasabah/reminder-options";
import {
  adhanChannelId,
  adhanNotificationSound,
  isAdhanChannelId,
} from "@/lib/notifications/adhan-sounds";
import {
  type BuiltReminder,
  buildReminders,
  hasOutstandingQazaDebt,
  type ScheduledReminderRow,
  summarizeReminders,
} from "@/lib/notifications/build-reminders";
import { dhulHijjahReminderOptions } from "@/lib/notifications/dhul-hijjah-reminder-options";
import {
  parseScheduledTriggerAtMs,
  type RawScheduledTrigger,
  scheduledFireAtIso,
} from "@/lib/notifications/parse-scheduled-trigger";
import {
  readNotificationPermissionUiState,
  requestNotificationPermission,
} from "@/lib/notifications/permissions";
import { isLocalNotificationSupported } from "@/lib/notifications/platform";
import { sunnahHabitsReminderOptions } from "@/lib/notifications/sunnah-habits-reminder-options";
import { vaultReminderOptions } from "@/lib/notifications/vault-reminder-options";
import { quranRevisionReminderOptions } from "@/lib/quran-companion/reminder-options";
import { rawatibNudgeOptions } from "@/lib/rawatib-nudge";
import { captureAppException } from "@/lib/sentry";
import { formatDisplayHhMm } from "@/lib/time";
import { voluntaryFastingReminderOptions } from "@/lib/voluntary-fasting/reminder-options";
import { trackerStore } from "@/stores/tracker-store";

/** Snapshot current Qaza/roza debt for reminder builds. */
/**
 * Async: also reads the Qur'an practice revision-reminder inputs straight from
 * their repositories (the practice stores are lazy and usually not loaded at launch).
 */
async function buildReminderOptions() {
  const { qazaCounters, roza } = trackerStore.getState();
  return {
    hasQazaDebt: hasOutstandingQazaDebt(qazaCounters, roza),
    ...(await quranRevisionReminderOptions()),
    ...(await voluntaryFastingReminderOptions()),
    // NF-3.5 habits (selected / bedtime counts) + NF-3.3 udhiyah intention flags.
    ...(await sunnahHabitsReminderOptions()),
    ...(await dhulHijjahReminderOptions()),
    // NF-3.1 opt-in after-fard rawatib nudge (today's unlogged after-rows).
    ...(await rawatibNudgeOptions()),
    // NF-3.11 home-masjid iqamah reminders (private/public times only).
    ...(await iqamahReminderOptions()),
    muhasabah: await muhasabahReminderOptions(),
    familyTies: await familyTiesReminderOptions(),
    // NF-3.14 weekly coach (recent-activity flag only).
    ...(await coachReminderOptions()),
    // NF-3.8 / NF-3.9: debts due + wasiyyah review (vault dates only).
    ...(await vaultReminderOptions()),
  };
}

/** Serializes reschedule passes so overlapping calls cannot stack duplicate OS notifications. */
let rescheduleTail: Promise<void> = Promise.resolve();

function enqueueReschedule(task: () => Promise<void>): Promise<void> {
  const run = rescheduleTail.then(task, task);
  rescheduleTail = run.catch((error) => {
    captureAppException(error, { tags: { area: "notifications", phase: "reschedule" } });
  });
  return run;
}

type ChannelId = "prayer" | "prayerAdhan" | "zikr" | "qaza";

/**
 * Channels created up front. The adhan channel is per style (`adhan-<styleId>`,
 * see `lib/notifications/adhan-sounds.ts`) and is synced by {@link syncAdhanChannel}.
 */
const STATIC_CHANNEL_IDS: Exclude<ChannelId, "prayerAdhan">[] = ["prayer", "zikr", "qaza"];

/** Android channel currently carrying the adhan sound (selected style). */
let activeAdhanChannelId = adhanChannelId(undefined);
/** `${channelId}|${locale}` last synced, so reschedules skip redundant channel work. */
let syncedAdhanChannelKey: string | null = null;

/**
 * OS (Android) channel for a reminder: an explicit per-style override first, then
 * the logical id — with the logical `prayerAdhan` mapped to the active style channel
 * (covers snoozes scheduled before per-style channels existed).
 */
function osChannelId(channelId: ChannelId, androidChannelId?: string): string {
  if (androidChannelId) return androidChannelId;
  return channelId === "prayerAdhan" ? activeAdhanChannelId : channelId;
}

/**
 * Android: make sure the selected adhan style's channel exists with that style's
 * sound (HIGH importance so it isn't silenced) and delete every other adhan
 * channel — channel sounds are immutable after creation, so switching style
 * switches channel (B2). Callers reschedule afterwards so pending adhan
 * reminders move to the new channel. No-op elsewhere.
 */
export async function syncAdhanChannel(adhanStyleId?: string | null): Promise<void> {
  if (Platform.OS !== "android" || !isLocalNotificationSupported()) return;
  const channelId = adhanChannelId(adhanStyleId);
  const key = `${channelId}|${i18n.language}`;
  activeAdhanChannelId = channelId;
  if (syncedAdhanChannelKey === key) return;
  await Notifications.setNotificationChannelAsync(channelId, {
    name: i18n.t("notif.channels.prayerAdhan"),
    importance: Notifications.AndroidImportance.HIGH,
    sound: adhanNotificationSound(adhanStyleId),
  });
  try {
    const existing = await Notifications.getNotificationChannelsAsync();
    for (const channel of existing) {
      if (channel.id !== channelId && isAdhanChannelId(channel.id)) {
        await Notifications.deleteNotificationChannelAsync(channel.id);
      }
    }
  } catch (error) {
    captureAppException(error, { tags: { area: "notifications", phase: "adhan-channel" } });
  }
  syncedAdhanChannelKey = key;
}

/**
 * Category for obligatory prayer-time-now reminders only — Mark + Snooze.
 * Prep / zikr / qaza nudges omit this so they don't offer a premature Mark.
 */
export const PRAYER_NOW_CATEGORY = "prayer_now";
/** Mark is listed first so Apple Watch Double Tap invokes the nondestructive Mark action. */
export const MARK_ACTION_IDENTIFIER = "markcurrent";
export const SNOOZE_ACTION_IDENTIFIER = "snooze";
const SNOOZE_MINUTES = 10;
const SNOOZE_ID_PREFIX = "snooze:";
/**
 * Expo iOS DATE triggers become `UNTimeIntervalNotificationTrigger(timeIntervalSinceNow)`
 * with the timestamp truncated to whole seconds. Intervals ≤ 0 throw
 * `ERR_NOTIFICATIONS_FAILED_TO_SCHEDULE` (native reason often just "undefined reason").
 * Keep a 2s lead so truncation and scheduling latency cannot go non-positive.
 */
export const MIN_DATE_TRIGGER_LEAD_MS = 2_000;
/** Match `buildReminders`: still deliver a DATE reminder that fired up to 60s ago. */
const JUST_MISSED_WINDOW_MS = 60_000;

type PendingSnooze = {
  identifier: string;
  content: Notifications.NotificationContentInput;
  seconds: number;
  channelId: string;
};

async function collectPendingSnoozes(): Promise<PendingSnooze[]> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const now = Date.now();
  const out: PendingSnooze[] = [];
  for (const item of scheduled) {
    if (!item.identifier.startsWith(SNOOZE_ID_PREFIX)) continue;
    const fireAtMs = parseScheduledTriggerAtMs(item.trigger as RawScheduledTrigger);
    if (fireAtMs == null || fireAtMs <= now) continue;
    const data = item.content.data as {
      channelId?: ChannelId;
      androidChannelId?: string;
    } | null;
    const channelId = osChannelId(data?.channelId ?? "prayer", data?.androidChannelId);
    out.push({
      identifier: item.identifier,
      content: {
        title: item.content.title ?? i18n.t("notif.defaultTitle"),
        body: item.content.body ?? "",
        categoryIdentifier: PRAYER_NOW_CATEGORY,
        data: item.content.data ?? {},
        ...(item.content.sound ? { sound: item.content.sound } : {}),
      },
      seconds: Math.max(1, Math.round((fireAtMs - now) / 1000)),
      channelId,
    });
  }
  return out;
}

async function restoreSnoozes(snoozes: PendingSnooze[]): Promise<void> {
  for (const snooze of snoozes) {
    try {
      await Notifications.scheduleNotificationAsync({
        identifier: snooze.identifier,
        content: snooze.content,
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: snooze.seconds,
          channelId: snooze.channelId,
          repeats: false,
        },
      });
    } catch (error) {
      captureAppException(error, {
        tags: { area: "notifications", phase: "restore-snooze" },
        extra: { identifier: snooze.identifier },
      });
    }
  }
}

/** Stable extras for Sentry — never throws on Invalid Date. */
function reminderScheduleExtra(reminder: BuiltReminder): Record<string, string> {
  const fireAtMs = reminder.fireAt.getTime();
  return {
    reminderId: reminder.id,
    repeat: reminder.repeat,
    fireAt: Number.isFinite(fireAtMs) ? new Date(fireAtMs).toISOString() : "invalid",
  };
}

export type ReminderTriggerOptions = {
  /**
   * "Precise Adhan timing" (Android): schedule Adhan-channel reminders with
   * `delivery: "alarmClock"` (AlarmManager.setAlarmClock) so battery optimisation
   * can't defer them. Without the exact-alarm permission Android falls back to
   * best-effort delivery on its own.
   */
  preciseAdhan?: boolean;
};

/**
 * Native trigger for one reminder. Returns `null` when the OS would reject it
 * (invalid clock, or DATE more than a minute in the past).
 */
export function osTriggerForReminder(
  reminder: BuiltReminder,
  nowMs = Date.now(),
  { preciseAdhan = false }: ReminderTriggerOptions = {},
): Notifications.NotificationTriggerInput | null {
  const fireAtMs = reminder.fireAt.getTime();
  if (!Number.isFinite(fireAtMs)) return null;
  const alarmClock =
    preciseAdhan && Platform.OS === "android" && reminder.channelId === "prayerAdhan"
      ? ({ delivery: "alarmClock" } as const)
      : null;

  if (reminder.repeat === "daily") {
    const hour = reminder.fireAt.getHours();
    const minute = reminder.fireAt.getMinutes();
    if (!Number.isInteger(hour) || hour < 0 || hour > 23) return null;
    if (!Number.isInteger(minute) || minute < 0 || minute > 59) return null;
    return {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
      channelId: osChannelId(reminder.channelId, reminder.androidChannelId),
      ...alarmClock,
    };
  }

  const delayMs = fireAtMs - nowMs;
  if (delayMs < MIN_DATE_TRIGGER_LEAD_MS) {
    if (delayMs < -JUST_MISSED_WINDOW_MS) return null;
    return {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 1,
      channelId: osChannelId(reminder.channelId, reminder.androidChannelId),
      repeats: false,
    };
  }

  return {
    type: Notifications.SchedulableTriggerInputTypes.DATE,
    date: reminder.fireAt,
    channelId: osChannelId(reminder.channelId, reminder.androidChannelId),
    ...alarmClock,
  };
}

/**
 * Sets the foreground handler and Android channels. Call at startup and on locale
 * change (channel names are localised). `adhanStyleId` picks the adhan channel.
 */
export async function configureNotifications(adhanStyleId?: string | null): Promise<void> {
  if (!isLocalNotificationSupported()) return;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
  await Notifications.setNotificationCategoryAsync(PRAYER_NOW_CATEGORY, [
    {
      identifier: MARK_ACTION_IDENTIFIER,
      buttonTitle: i18n.t("notif.markPrayed"),
      options: { opensAppToForeground: false },
    },
    {
      identifier: SNOOZE_ACTION_IDENTIFIER,
      buttonTitle: i18n.t("notif.snooze", { minutes: SNOOZE_MINUTES }),
      options: { opensAppToForeground: false },
    },
  ]);
  if (Platform.OS === "android") {
    // Non-adhan channels keep the default notification tone.
    for (const id of STATIC_CHANNEL_IDS) {
      await Notifications.setNotificationChannelAsync(id, {
        name: i18n.t(`notif.channels.${id}`),
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
    // The adhan channel carries the selected style's call-to-prayer sound
    // (Android plays channel-level sounds). Force a resync so it's renamed too.
    syncedAdhanChannelKey = null;
    await syncAdhanChannel(adhanStyleId);
  }
}

export async function getPermissionStatus(): Promise<"granted" | "denied" | "undetermined"> {
  return readNotificationPermissionUiState();
}

export { requestNotificationPermission as requestPermission };

export async function cancelAll(): Promise<void> {
  if (!isLocalNotificationSupported()) return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}

async function scheduleReminder(
  reminder: BuiltReminder,
  options: ReminderTriggerOptions = {},
): Promise<void> {
  const trigger = osTriggerForReminder(reminder, Date.now(), options);
  if (!trigger) return;

  // Mark + Snooze only when this is a fard prayer-time reminder (has prayerId).
  const isPrayerNow = Boolean(reminder.prayerId && reminder.prayerDateKey);
  const content = {
    title: reminder.title,
    body: reminder.body,
    ...(isPrayerNow ? { categoryIdentifier: PRAYER_NOW_CATEGORY } : {}),
    // Stack related reminders (Salah / Adhan / Zikr / Qaza) together: Android group
    // key and iOS notification-centre thread (expo-notifications 58).
    threadIdentifier: reminder.channelId,
    // iOS plays the per-notification sound; Android takes it from the channel.
    ...(reminder.sound ? { sound: reminder.sound } : {}),
    data: {
      channelId: reminder.channelId,
      ...(reminder.androidChannelId ? { androidChannelId: reminder.androidChannelId } : {}),
      reminderId: reminder.id,
      route: reminder.route,
      ...(reminder.prayerId ? { prayerId: reminder.prayerId } : {}),
      ...(reminder.prayerDateKey ? { prayerDate: reminder.prayerDateKey } : {}),
    },
  };

  await Notifications.scheduleNotificationAsync({
    identifier: reminder.id,
    content,
    trigger,
  });
}

/** Cancels existing reminders and schedules the set implied by preferences + location. */
export async function rescheduleAll(
  prefs: UserPreferences,
  location: StoredLocation,
): Promise<void> {
  if (!isLocalNotificationSupported()) return;
  return enqueueReschedule(async () => {
    // Preserve snoozes across cancel/rebuild so foreground reschedule doesn't
    // erase an intentional deferral.
    // Select (or create) the chosen adhan style's channel before arming reminders.
    await syncAdhanChannel(prefs.adhanStyleId).catch((error) => {
      captureAppException(error, { tags: { area: "notifications", phase: "adhan-channel" } });
    });
    const snoozes = await collectPendingSnoozes();
    const nextReminders =
      prefs.notificationPrefs.masterEnabled && (await getPermissionStatus()) === "granted"
        ? buildReminders(prefs, location, new Date(), await buildReminderOptions())
        : [];
    const now = Date.now();
    const toSchedule = nextReminders.filter(
      (reminder) => reminder.fireAt.getTime() > now - JUST_MISSED_WINDOW_MS,
    );

    // Cancel only after we know what to arm. Schedule each reminder independently —
    // one iOS DATE reject must not leave the user with an empty pending set.
    await cancelAll();
    for (const reminder of toSchedule) {
      try {
        await scheduleReminder(reminder, {
          preciseAdhan: prefs.notificationPrefs.preciseAdhan === true,
        });
      } catch (error) {
        captureAppException(error, {
          tags: { area: "notifications", phase: "schedule" },
          extra: reminderScheduleExtra(reminder),
        });
      }
    }
    await restoreSnoozes(snoozes);
  });
}

/**
 * Re-fires a reminder `SNOOZE_MINUTES` from now. Called when the user taps the
 * notification's Snooze action.
 */
export async function snoozeNotification(
  response: Notifications.NotificationResponse,
): Promise<void> {
  if (!isLocalNotificationSupported()) return;
  const { content } = response.notification.request;
  const channelId = osChannelId(
    (content.data?.channelId as ChannelId | undefined) ?? "prayer",
    content.data?.androidChannelId as string | undefined,
  );
  const baseId =
    (content.data?.reminderId as string | undefined) ??
    (content.data?.prayerId as string | undefined) ??
    "prayer";
  const identifier = `${SNOOZE_ID_PREFIX}${baseId}`;
  await Notifications.scheduleNotificationAsync({
    identifier,
    content: {
      title: content.title ?? i18n.t("notif.defaultTitle"),
      body: content.body ?? "",
      // Snooze is only offered on prayer-time-now reminders — keep Mark + Snooze.
      categoryIdentifier: PRAYER_NOW_CATEGORY,
      data: content.data ?? {},
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: SNOOZE_MINUTES * 60,
      channelId,
      repeats: false,
    },
  });
}

type ReminderActionData = {
  prayerId?: string;
  prayerDate?: string;
};

const OBLIGATORY_IDS = new Set(["fajr", "dhuhr", "asr", "maghrib", "isha"]);

/**
 * Enqueues a mark command from the notification Mark action (no UI navigation).
 * Prefer named `mark-prayer` when the reminder carried prayerId + date.
 */
export async function markFromNotification(
  response: Notifications.NotificationResponse,
): Promise<void> {
  if (!isLocalNotificationSupported()) return;
  const data = (response.notification.request.content.data ?? {}) as ReminderActionData;
  const prayerId = data.prayerId;
  const prayerDate = data.prayerDate;
  if (prayerId && prayerDate && OBLIGATORY_IDS.has(prayerId)) {
    await nativeEnqueueCommand({
      type: "mark-prayer",
      prayerId: prayerId as "fajr" | "dhuhr" | "asr" | "maghrib" | "isha",
      date: prayerDate,
      source: "notification",
    });
    return;
  }
  await nativeEnqueueCommand({
    type: "mark-current-obligatory",
    source: "notification",
  });
}

export async function listScheduled(
  prefs: UserPreferences,
  location: StoredLocation,
): Promise<ScheduledReminderRow[]> {
  const options = await buildReminderOptions();
  if (!isLocalNotificationSupported()) {
    if (!prefs.notificationPrefs.masterEnabled) return [];
    return summarizeReminders(
      buildReminders(prefs, location, new Date(), options),
      prefs.timeFormat,
      new Date(),
      location.timeZone,
    );
  }

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  if (scheduled.length > 0) {
    const now = Date.now();
    const parsed: {
      id: string;
      title: string;
      body: string;
      time?: string;
      atMs: number;
      route?: string;
      fireAt: string;
    }[] = [];

    for (const item of scheduled) {
      const trigger = item.trigger as RawScheduledTrigger;
      const atMs = parseScheduledTriggerAtMs(trigger, now);
      if (atMs == null) continue;

      const fireAt = scheduledFireAtIso(atMs);
      if (!fireAt) continue;

      const date = new Date(atMs);
      const time = formatDisplayHhMm(date.getHours(), date.getMinutes(), prefs.timeFormat);

      const title = item.content.title ?? i18n.t("notif.defaultTitle");
      const body = item.content.body ?? "";
      const route = (item.content.data as { route?: string } | undefined)?.route;
      parsed.push({
        id: item.identifier,
        title,
        body,
        time,
        atMs,
        route,
        fireAt,
      });
    }

    if (parsed.length === 0) {
      if (!prefs.notificationPrefs.masterEnabled) return [];
      return summarizeReminders(
        buildReminders(prefs, location, new Date(), options),
        prefs.timeFormat,
        new Date(),
        location.timeZone,
      );
    }

    parsed.sort((a, b) => a.atMs - b.atMs);

    const seen = new Set<string>();
    const rows: ScheduledReminderRow[] = [];
    for (const item of parsed) {
      const dedupeKey = `${item.title}\0${item.body}`;
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);
      rows.push({
        id: item.id,
        title: item.title,
        body: item.body,
        fireAt: item.fireAt,
        time: item.time,
        route: item.route,
      });
    }

    return rows.sort((a, b) => a.fireAt.localeCompare(b.fireAt));
  }

  if (!prefs.notificationPrefs.masterEnabled) return [];
  return summarizeReminders(
    buildReminders(prefs, location, new Date(), options),
    prefs.timeFormat,
    new Date(),
    location.timeZone,
  );
}
