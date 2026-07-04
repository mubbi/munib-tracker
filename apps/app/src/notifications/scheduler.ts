import type { UserPreferences } from "@munib-tracker/shared/types";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import i18n from "@/i18n";
import type { StoredLocation } from "@/lib/location";
import {
  type BuiltReminder,
  buildReminders,
  type ScheduledReminderRow,
  summarizeReminders,
} from "@/lib/notifications/build-reminders";
import {
  readNotificationPermissionUiState,
  requestNotificationPermission,
} from "@/lib/notifications/permissions";
import { isLocalNotificationSupported } from "@/lib/notifications/platform";
import { formatDisplayHhMm } from "@/lib/time";

const isNative = Platform.OS === "ios" || Platform.OS === "android";

/** Serializes reschedule passes so overlapping calls cannot stack duplicate OS notifications. */
let rescheduleTail: Promise<void> = Promise.resolve();

function enqueueReschedule(task: () => Promise<void>): Promise<void> {
  const run = rescheduleTail.then(task, task);
  rescheduleTail = run.catch(() => {});
  return run;
}

type ChannelId = "prayer" | "zikr" | "qaza";

const CHANNEL_IDS: ChannelId[] = ["prayer", "zikr", "qaza"];

/** Category + action wiring so reminders can be snoozed from the notification. */
const REMINDER_CATEGORY = "reminder";
export const SNOOZE_ACTION_IDENTIFIER = "snooze";
const SNOOZE_MINUTES = 10;

/** Sets the foreground handler and Android channels. Call once at startup. */
export async function configureNotifications(): Promise<void> {
  if (!isNative) return;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
  await Notifications.setNotificationCategoryAsync(REMINDER_CATEGORY, [
    {
      identifier: SNOOZE_ACTION_IDENTIFIER,
      buttonTitle: i18n.t("notif.snooze", { minutes: SNOOZE_MINUTES }),
      options: { opensAppToForeground: false },
    },
  ]);
  if (Platform.OS === "android") {
    for (const id of CHANNEL_IDS) {
      await Notifications.setNotificationChannelAsync(id, {
        name: i18n.t(`notif.channels.${id}`),
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
  }
}

export async function getPermissionStatus(): Promise<"granted" | "denied" | "undetermined"> {
  return readNotificationPermissionUiState();
}

export { requestNotificationPermission as requestPermission };

export async function cancelAll(): Promise<void> {
  if (!isNative) return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}

async function scheduleReminder(reminder: BuiltReminder): Promise<void> {
  const content = {
    title: reminder.title,
    body: reminder.body,
    categoryIdentifier: REMINDER_CATEGORY,
    data: { channelId: reminder.channelId, reminderId: reminder.id, route: reminder.route },
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
  if (!isNative) return;
  return enqueueReschedule(async () => {
    await cancelAll();
    if (!prefs.notificationPrefs.masterEnabled) return;
    if (!isLocalNotificationSupported()) return;
    if ((await getPermissionStatus()) !== "granted") return;

    const reminders = buildReminders(prefs, location);
    for (const reminder of reminders) {
      await scheduleReminder(reminder);
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
  if (!isNative) return;
  const { content } = response.notification.request;
  const channelId = (content.data?.channelId as ChannelId | undefined) ?? "prayer";
  await Notifications.scheduleNotificationAsync({
    content: {
      title: content.title ?? i18n.t("notif.defaultTitle"),
      body: content.body ?? "",
      categoryIdentifier: REMINDER_CATEGORY,
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

export async function listScheduled(
  prefs: UserPreferences,
  location: StoredLocation,
): Promise<ScheduledReminderRow[]> {
  if (!isNative) {
    if (!prefs.notificationPrefs.masterEnabled) return [];
    return summarizeReminders(buildReminders(prefs, location), prefs.timeFormat);
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
    }[] = [];

    for (const item of scheduled) {
      const trigger = item.trigger as {
        hour?: number;
        minute?: number;
        date?: number | string;
      } | null;
      let time: string | undefined;
      let atMs = Number.MAX_SAFE_INTEGER;
      if (trigger && typeof trigger.hour === "number") {
        const next = new Date();
        next.setHours(trigger.hour, trigger.minute ?? 0, 0, 0);
        if (next.getTime() <= now) next.setDate(next.getDate() + 1);
        atMs = next.getTime();
        time = formatDisplayHhMm(trigger.hour, trigger.minute ?? 0, prefs.timeFormat);
      } else if (trigger?.date != null) {
        const date = new Date(trigger.date);
        atMs = date.getTime();
        time = formatDisplayHhMm(date.getHours(), date.getMinutes(), prefs.timeFormat);
      }

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
      });
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
        fireAt: new Date(item.atMs).toISOString(),
        time: item.time,
        route: item.route,
      });
    }

    return rows.sort((a, b) => a.fireAt.localeCompare(b.fireAt));
  }

  if (!prefs.notificationPrefs.masterEnabled) return [];
  return summarizeReminders(buildReminders(prefs, location), prefs.timeFormat);
}
