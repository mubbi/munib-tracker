import type { UserPreferences } from "@munib-tracker/shared/types";

import { DEFAULT_LOCATION, type StoredLocation } from "@/lib/location";
import {
  buildReminders,
  hasOutstandingQazaDebt,
  summarizeReminders,
} from "@/lib/notifications/build-reminders";
import {
  readNotificationPermissionUiState,
  requestNotificationPermission,
} from "@/lib/notifications/permissions";
import { getWebNotificationBlockingReason } from "@/lib/notifications/web-environment";
import {
  cancelWebReminderTimers,
  scheduleWebReminderTimers,
} from "@/lib/notifications/web-reminder-scheduler";
import { trackerStore } from "@/stores/tracker-store";

/**
 * Web build of the notification scheduler. Uses in-app timers + optional browser
 * notifications instead of expo-notifications (which is native-only).
 */

export const MARK_ACTION_IDENTIFIER = "markcurrent";
export const SNOOZE_ACTION_IDENTIFIER = "snooze";

function buildReminderOptions() {
  const { qazaCounters, roza } = trackerStore.getState();
  return { hasQazaDebt: hasOutstandingQazaDebt(qazaCounters, roza) };
}

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
  cancelWebReminderTimers();
  if (!prefs.notificationPrefs.masterEnabled) return;

  const reminders = buildReminders(prefs, location, new Date(), buildReminderOptions());
  scheduleWebReminderTimers(reminders);
}

export async function snoozeNotification(_response: unknown): Promise<void> {
  return;
}

export async function markFromNotification(_response: unknown): Promise<void> {
  return;
}

export async function listScheduled(
  prefs: UserPreferences,
  location: StoredLocation = DEFAULT_LOCATION,
): Promise<
  { id: string; title: string; body: string; time?: string; fireAt: string; route?: string }[]
> {
  if (!prefs.notificationPrefs.masterEnabled) return [];
  return summarizeReminders(
    buildReminders(prefs, location, new Date(), buildReminderOptions()),
    prefs.timeFormat,
    new Date(),
    location.timeZone,
  );
}
