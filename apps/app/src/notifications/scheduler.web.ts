import type { UserPreferences } from "@munib-tracker/shared/types";

import { DEFAULT_LOCATION, type StoredLocation } from "@/lib/location";
import { buildReminders, summarizeReminders } from "@/lib/notifications/build-reminders";
import {
  readNotificationPermissionUiState,
  requestNotificationPermission,
} from "@/lib/notifications/permissions";
import { getWebNotificationBlockingReason } from "@/lib/notifications/web-environment";

/**
 * Web build of the notification scheduler. Local notifications aren't available
 * on web, and merely importing `expo-notifications` there triggers its
 * push-token auto-registration warning. This platform-specific stub avoids the
 * dependency entirely while still exposing permission state and planned reminders.
 */

export const SNOOZE_ACTION_IDENTIFIER = "snooze";

export async function configureNotifications(): Promise<void> {
  return;
}

export async function getPermissionStatus(): Promise<"granted" | "denied" | "undetermined"> {
  if (getWebNotificationBlockingReason()) return "denied";
  return readNotificationPermissionUiState();
}

export const requestPermission = requestNotificationPermission;

export async function cancelAll(): Promise<void> {
  return;
}

export async function rescheduleAll(
  prefs: UserPreferences,
  location: StoredLocation = DEFAULT_LOCATION,
): Promise<void> {
  void prefs;
  void location;
  return;
}

export async function snoozeNotification(_response: unknown): Promise<void> {
  return;
}

export async function listScheduled(
  prefs: UserPreferences,
  location: StoredLocation = DEFAULT_LOCATION,
): Promise<{ id: string; title: string; body: string; time?: string }[]> {
  if (!prefs.notificationPrefs.masterEnabled) return [];
  return summarizeReminders(buildReminders(prefs, location), prefs.timeFormat);
}
