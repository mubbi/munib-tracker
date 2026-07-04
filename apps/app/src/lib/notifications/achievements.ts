import type { UserPreferences } from "@munib-tracker/shared/types";
import i18n from "@/i18n";
import { readNotificationPermissionUiState } from "@/lib/notifications/permissions";
import { isLocalNotificationSupported } from "@/lib/notifications/platform";

/** Fires an immediate OS notification when achievement alerts are enabled. */
export async function notifyAchievementUnlocked(
  title: string,
  prefs: UserPreferences,
): Promise<void> {
  if (!prefs.notificationPrefs.masterEnabled || !prefs.notificationPrefs.achievements) return;
  if (!isLocalNotificationSupported()) return;
  if ((await readNotificationPermissionUiState()) !== "granted") return;

  const Notifications = await import("expo-notifications");
  await Notifications.scheduleNotificationAsync({
    content: {
      title: i18n.t("notif.reminders.achievementTitle"),
      body: title,
      data: { channelId: "zikr", route: "/tracker" },
    },
    trigger: null,
  });
}
