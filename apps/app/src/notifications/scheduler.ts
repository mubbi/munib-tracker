import type { UserPreferences } from "@munib-tracker/shared/types";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import i18n from "@/i18n";
import { nativeEnqueueCommand } from "@/lib/external-commands/native-bridge";
import type { StoredLocation } from "@/lib/location";
import {
  ADHAN_NOTIFICATION_SOUND,
  type BuiltReminder,
  buildReminders,
  hasOutstandingQazaDebt,
  type ScheduledReminderRow,
  summarizeReminders,
} from "@/lib/notifications/build-reminders";
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
import { captureAppException } from "@/lib/sentry";
import { formatDisplayHhMm } from "@/lib/time";
import { trackerStore } from "@/stores/tracker-store";

/** Snapshot current Qaza/roza debt for reminder builds. */
function buildReminderOptions() {
  const { qazaCounters, roza } = trackerStore.getState();
  return { hasQazaDebt: hasOutstandingQazaDebt(qazaCounters, roza) };
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

const CHANNEL_IDS: ChannelId[] = ["prayer", "prayerAdhan", "zikr", "qaza"];

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

type PendingSnooze = {
  identifier: string;
  content: Notifications.NotificationContentInput;
  seconds: number;
  channelId: ChannelId;
};

async function collectPendingSnoozes(): Promise<PendingSnooze[]> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const now = Date.now();
  const out: PendingSnooze[] = [];
  for (const item of scheduled) {
    if (!item.identifier.startsWith(SNOOZE_ID_PREFIX)) continue;
    const fireAtMs = parseScheduledTriggerAtMs(item.trigger as RawScheduledTrigger);
    if (fireAtMs == null || fireAtMs <= now) continue;
    const channelId =
      ((item.content.data as { channelId?: ChannelId } | null)?.channelId as
        | ChannelId
        | undefined) ?? "prayer";
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
  }
}

/** Sets the foreground handler and Android channels. Call once at startup. */
export async function configureNotifications(): Promise<void> {
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
    for (const id of CHANNEL_IDS) {
      // The adhan channel carries the custom call-to-prayer sound (Android plays
      // channel-level sounds) at HIGH importance so it isn't silenced; the rest
      // keep the default notification tone.
      const isAdhan = id === "prayerAdhan";
      await Notifications.setNotificationChannelAsync(id, {
        name: i18n.t(`notif.channels.${id}`),
        importance: isAdhan
          ? Notifications.AndroidImportance.HIGH
          : Notifications.AndroidImportance.DEFAULT,
        ...(isAdhan ? { sound: ADHAN_NOTIFICATION_SOUND } : {}),
      });
    }
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

async function scheduleReminder(reminder: BuiltReminder): Promise<void> {
  // Mark + Snooze only when this is a fard prayer-time reminder (has prayerId).
  const isPrayerNow = Boolean(reminder.prayerId && reminder.prayerDateKey);
  const content = {
    title: reminder.title,
    body: reminder.body,
    ...(isPrayerNow ? { categoryIdentifier: PRAYER_NOW_CATEGORY } : {}),
    // iOS plays the per-notification sound; Android takes it from the channel.
    ...(reminder.sound ? { sound: reminder.sound } : {}),
    data: {
      channelId: reminder.channelId,
      reminderId: reminder.id,
      route: reminder.route,
      ...(reminder.prayerId ? { prayerId: reminder.prayerId } : {}),
      ...(reminder.prayerDateKey ? { prayerDate: reminder.prayerDateKey } : {}),
    },
  };

  if (reminder.repeat === "daily") {
    await Notifications.scheduleNotificationAsync({
      identifier: reminder.id,
      content,
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: reminder.fireAt.getHours(),
        minute: reminder.fireAt.getMinutes(),
        channelId: reminder.channelId,
      },
    });
    return;
  }

  await Notifications.scheduleNotificationAsync({
    identifier: reminder.id,
    content,
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: reminder.fireAt,
      channelId: reminder.channelId,
    },
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
    const snoozes = await collectPendingSnoozes();
    const nextReminders =
      prefs.notificationPrefs.masterEnabled && (await getPermissionStatus()) === "granted"
        ? buildReminders(prefs, location, new Date(), buildReminderOptions())
        : [];
    const now = Date.now();
    const toSchedule = nextReminders.filter((reminder) => reminder.fireAt.getTime() > now - 60_000);

    // Build the replacement set first; only cancel after we know what to arm.
    // If scheduling throws mid-loop, restore snoozes and report — user may briefly
    // lack some reminders until the next successful reschedule.
    await cancelAll();
    try {
      for (const reminder of toSchedule) {
        await scheduleReminder(reminder);
      }
      await restoreSnoozes(snoozes);
    } catch (error) {
      captureAppException(error, { tags: { area: "notifications", phase: "schedule" } });
      try {
        await restoreSnoozes(snoozes);
      } catch (restoreError) {
        captureAppException(restoreError, {
          tags: { area: "notifications", phase: "restore-snooze" },
        });
      }
      throw error;
    }
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
  const channelId = (content.data?.channelId as ChannelId | undefined) ?? "prayer";
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
  const options = buildReminderOptions();
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
