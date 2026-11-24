import type { UserPreferences } from "@munib-tracker/shared/types";
import i18n from "@/i18n";
import { handleExternalCommand } from "@/lib/external-commands";
import { DEFAULT_LOCATION, type StoredLocation } from "@/lib/location";
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
import {
  isObligatoryPrayerId,
  MARK_ACTION_IDENTIFIER,
  markCommandFromReminderData,
  PRAYER_NOW_CATEGORY,
  type ReminderActionData,
  SNOOZE_ACTION_IDENTIFIER,
  SNOOZE_ID_PREFIX,
  SNOOZE_MINUTES,
} from "@/lib/notifications/reminder-actions";
import { collectReminderOptions } from "@/lib/notifications/reminder-options";
import { getWebNotificationBlockingReason } from "@/lib/notifications/web-environment";
import {
  armWebReminderTimer,
  cancelWebReminderTimers,
  scheduleWebReminderTimers,
} from "@/lib/notifications/web-reminder-scheduler";
import { captureAppException } from "@/lib/sentry";

export { MARK_ACTION_IDENTIFIER, PRAYER_NOW_CATEGORY, SNOOZE_ACTION_IDENTIFIER };

/**
 * Web build of the notification scheduler. Uses in-app timers + optional browser
 * notifications instead of expo-notifications (which is native-only).
 */

export async function configureNotifications(): Promise<void> {
  return;
}

export async function getPermissionStatus(): Promise<"granted" | "denied" | "undetermined"> {
  if (getWebNotificationBlockingReason()) return "denied";
  return readNotificationPermissionUiState();
}

export const requestPermission = requestNotificationPermission;

export async function cancelAll(): Promise<void> {
  cancelWebReminderTimers();
}

export async function rescheduleAll(
  prefs: UserPreferences,
  location: StoredLocation = DEFAULT_LOCATION,
): Promise<void> {
  // Preserve snooze:* timers — cancelWebReminderTimers inside schedule clears only
  // non-snooze ids when preserveSnoozes is set.
  if (!prefs.notificationPrefs.masterEnabled) {
    cancelWebReminderTimers({ preserveSnoozes: true });
    return;
  }

  try {
    const reminders = buildReminders(prefs, location, new Date(), await collectReminderOptions());
    scheduleWebReminderTimers(reminders);
  } catch (error) {
    // Callers fire-and-forget (provider effects, `requestReminderReschedule`); a
    // throw here would become an unhandledrejection (Sentry `M_ID` / crescent math).
    captureAppException(error, { tags: { area: "notifications", phase: "reschedule" } });
  }
}

type WebReminderData = ReminderActionData & {
  channelId?: string;
  reminderId?: string;
  route?: string;
};

/**
 * Re-arms a prayer-time reminder `SNOOZE_MINUTES` from now via the web timer
 * scheduler (browser Notification API has no action buttons without a SW).
 */
export async function snoozeNotification(response: {
  notification?: {
    request?: {
      content?: { title?: string | null; body?: string | null; data?: WebReminderData };
    };
  };
}): Promise<void> {
  const content = response.notification?.request?.content;
  const data = content?.data ?? {};
  const fireAt = new Date(Date.now() + SNOOZE_MINUTES * 60_000);
  const reminder: BuiltReminder = {
    id: `${SNOOZE_ID_PREFIX}${data.reminderId ?? data.prayerId ?? "prayer"}:${fireAt.getTime()}`,
    fireAt,
    title: content?.title ?? i18n.t("notif.defaultTitle"),
    body: content?.body ?? "",
    channelId: (data.channelId as BuiltReminder["channelId"]) ?? "prayer",
    repeat: "date",
    route: data.route ?? "/tracker",
    priority: 10,
    ...(isObligatoryPrayerId(data.prayerId)
      ? { prayerId: data.prayerId, prayerDateKey: data.prayerDate }
      : {}),
  };
  armWebReminderTimer(reminder, new Date());
}

/**
 * Marks the named Salah (or current obligatory) from a web prayer-time action.
 */
export async function markFromNotification(response: {
  notification?: { request?: { content?: { data?: ReminderActionData } } };
}): Promise<void> {
  await handleExternalCommand(
    markCommandFromReminderData(response.notification?.request?.content?.data),
  );
}

export async function listScheduled(
  prefs: UserPreferences,
  location: StoredLocation = DEFAULT_LOCATION,
): Promise<ScheduledReminderRow[]> {
  if (!prefs.notificationPrefs.masterEnabled) return [];
  try {
    return summarizeReminders(
      buildReminders(prefs, location, new Date(), await collectReminderOptions()),
      prefs.timeFormat,
      new Date(),
      location.timeZone,
    );
  } catch (error) {
    captureAppException(error, { tags: { area: "notifications", phase: "list" } });
    return [];
  }
}
