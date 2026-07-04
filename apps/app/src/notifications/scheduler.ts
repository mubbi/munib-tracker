import type { UserPreferences } from "@munib-tracker/shared/types";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import type { StoredLocation } from "@/lib/location";
import {
  type BuiltReminder,
  buildReminders,
  summarizeReminders,
} from "@/lib/notifications/build-reminders";
import {
  readNotificationPermissionUiState,
  requestNotificationPermission,
} from "@/lib/notifications/permissions";
import { isLocalNotificationSupported } from "@/lib/notifications/platform";
import { formatDisplayHhMm } from "@/lib/time";

const isNative = Platform.OS === "ios" || Platform.OS === "android";

type ChannelId = "prayer" | "zikr" | "qaza";

const CHANNELS: { id: ChannelId; name: string }[] = [
  { id: "prayer", name: "Prayer reminders" },
  { id: "zikr", name: "Zikr reminders" },
  { id: "qaza", name: "Qaza reminders" },
];

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
      buttonTitle: `Snooze ${SNOOZE_MINUTES} min`,
      options: { opensAppToForeground: false },
    },
  ]);
  if (Platform.OS === "android") {
    for (const channel of CHANNELS) {
      await Notifications.setNotificationChannelAsync(channel.id, {
        name: channel.name,
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
    data: { channelId: reminder.channelId, reminderId: reminder.id },
  };

  if (reminder.repeat === "daily") {
    await Notifications.scheduleNotificationAsync({
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
  await cancelAll();
  if (!prefs.notificationPrefs.masterEnabled) return;
  if (!isLocalNotificationSupported()) return;
  if ((await getPermissionStatus()) !== "granted") return;

  const reminders = buildReminders(prefs, location);
  for (const reminder of reminders) {
    await scheduleReminder(reminder);
  }
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
      title: content.title ?? "Reminder",
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
): Promise<{ id: string; title: string; body: string; time?: string }[]> {
  if (!isNative) {
    if (!prefs.notificationPrefs.masterEnabled) return [];
    return summarizeReminders(buildReminders(prefs, location), prefs.timeFormat);
  }

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  if (scheduled.length > 0) {
    return scheduled.map((item) => {
      const trigger = item.trigger as {
        hour?: number;
        minute?: number;
        date?: number | string;
      } | null;
      let time: string | undefined;
      if (trigger && typeof trigger.hour === "number") {
        time = formatDisplayHhMm(trigger.hour, trigger.minute ?? 0, prefs.timeFormat);
      } else if (trigger?.date != null) {
        const date = new Date(trigger.date);
        time = formatDisplayHhMm(date.getHours(), date.getMinutes(), prefs.timeFormat);
      }
      return {
        id: item.identifier,
        title: item.content.title ?? "Reminder",
        body: item.content.body ?? "",
        time,
      };
    });
  }

  if (!prefs.notificationPrefs.masterEnabled) return [];
  return summarizeReminders(buildReminders(prefs, location), prefs.timeFormat);
}
