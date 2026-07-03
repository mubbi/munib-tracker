import { useNotificationPermissions } from "@/hooks/use-notification-permissions";
import { useInAppNotifications } from "@/providers/in-app-notifications-provider";
import { usePreferences } from "@/stores/preferences-store";

/**
 * Badge count for the notification bell: unread in-app items, plus a nudge when
 * reminders are enabled but OS permission is missing.
 */
export function useNotificationBadgeCount(): number {
  const { unreadCount } = useInAppNotifications();
  const { permission, canEnableLocalReminders } = useNotificationPermissions();
  const prefs = usePreferences();

  let count = unreadCount;
  if (
    prefs.notificationPrefs.masterEnabled &&
    canEnableLocalReminders &&
    permission !== "granted"
  ) {
    count += 1;
  }
  return count;
}
