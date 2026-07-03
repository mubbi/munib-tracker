import { PRAYER_LABELS } from "@munib-tracker/shared/constants";
import type { NotificationPreferences, UserPreferences } from "@munib-tracker/shared/types";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { PRAYER_TIME_HINTS } from "@/lib/prayer-ui";
import { parseHhMm } from "@/lib/time";

const isNative = Platform.OS === "ios" || Platform.OS === "android";

type ChannelId = "prayer" | "zikr" | "qaza";

const CHANNELS: { id: ChannelId; name: string }[] = [
  { id: "prayer", name: "Prayer reminders" },
  { id: "zikr", name: "Zikr reminders" },
  { id: "qaza", name: "Qaza reminders" },
];

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
  if (!isNative) return "denied";
  const { status } = await Notifications.getPermissionsAsync();
  return status;
}

export async function requestPermission(): Promise<boolean> {
  if (!isNative) return false;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

type Reminder = {
  when: string;
  title: string;
  body: string;
  channelId: ChannelId;
  enabled: (n: NotificationPreferences) => boolean;
};

function buildReminders(prefs: UserPreferences): Reminder[] {
  const n = prefs.notificationPrefs;
  const reminders: Reminder[] = [];

  for (const [prayerId, time] of Object.entries(PRAYER_TIME_HINTS)) {
    if (!time) continue;
    reminders.push({
      when: time,
      title: `${PRAYER_LABELS[prayerId as keyof typeof PRAYER_LABELS]} time`,
      body: "It's time to pray. May Allah accept it from you.",
      channelId: "prayer",
      enabled: (np) => np.prayer,
    });
  }

  reminders.push({
    when: "07:00",
    title: "Morning adhkar",
    body: "Begin your day in remembrance of Allah.",
    channelId: "zikr",
    enabled: (np) => np.morningZikr,
  });
  reminders.push({
    when: "17:30",
    title: "Evening adhkar",
    body: "Take a moment for your evening dhikr.",
    channelId: "zikr",
    enabled: (np) => np.eveningZikr,
  });
  reminders.push({
    when: prefs.bedtime ?? "22:30",
    title: "Before-sleep adhkar",
    body: "Recite your before-sleep supplications.",
    channelId: "zikr",
    enabled: (np) => np.beforeSleep,
  });
  reminders.push({
    when: "20:00",
    title: "Qaza reminder",
    body: "Make up a missed prayer or fast today.",
    channelId: "qaza",
    enabled: (np) => np.qaza,
  });

  return reminders.filter((reminder) => reminder.enabled(n));
}

export async function cancelAll(): Promise<void> {
  if (!isNative) return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/** Cancels existing reminders and schedules the set implied by preferences. */
export async function rescheduleAll(prefs: UserPreferences): Promise<void> {
  if (!isNative) return;
  await cancelAll();
  if (!prefs.notificationPrefs.masterEnabled) return;
  if ((await getPermissionStatus()) !== "granted") return;

  for (const reminder of buildReminders(prefs)) {
    const { hour, minute } = parseHhMm(reminder.when);
    await Notifications.scheduleNotificationAsync({
      content: { title: reminder.title, body: reminder.body },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
        channelId: reminder.channelId,
      },
    });
  }
}

export async function listScheduled(): Promise<
  { id: string; title: string; body: string; time?: string }[]
> {
  if (!isNative) return [];
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  return scheduled.map((item) => {
    const trigger = item.trigger as { hour?: number; minute?: number } | null;
    const time =
      trigger && typeof trigger.hour === "number"
        ? `${`${trigger.hour}`.padStart(2, "0")}:${`${trigger.minute ?? 0}`.padStart(2, "0")}`
        : undefined;
    return {
      id: item.identifier,
      title: item.content.title ?? "Reminder",
      body: item.content.body ?? "",
      time,
    };
  });
}
