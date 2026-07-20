import type { ObligatoryPrayer, UserPreferences } from "@munib-tracker/shared/types";

import { handleExternalCommand } from "@/lib/external-commands";
import { DEFAULT_LOCATION, type StoredLocation } from "@/lib/location";
import {
  type BuiltReminder,
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
  armWebReminderTimer,
  cancelWebReminderTimers,
  scheduleWebReminderTimers,
} from "@/lib/notifications/web-reminder-scheduler";
import { trackerStore } from "@/stores/tracker-store";

/**
 * Web build of the notification scheduler. Uses in-app timers + optional browser
 * notifications instead of expo-notifications (which is native-only).
 */

export const PRAYER_NOW_CATEGORY = "prayer_now";
export const MARK_ACTION_IDENTIFIER = "markcurrent";
export const SNOOZE_ACTION_IDENTIFIER = "snooze";
const SNOOZE_MINUTES = 10;

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

type ReminderActionData = {
  prayerId?: string;
  prayerDate?: string;
  channelId?: string;
  reminderId?: string;
  route?: string;
  title?: string;
  body?: string;
};

const OBLIGATORY_IDS = new Set(["fajr", "dhuhr", "asr", "maghrib", "isha"]);

/**
 * Re-arms a prayer-time reminder `SNOOZE_MINUTES` from now via the web timer
 * scheduler (browser Notification API has no action buttons without a SW).
 */
export async function snoozeNotification(response: {
  notification?: {
    request?: {
      content?: { title?: string | null; body?: string | null; data?: ReminderActionData };
    };
  };
}): Promise<void> {
  const content = response.notification?.request?.content;
  const data = content?.data ?? {};
  const fireAt = new Date(Date.now() + SNOOZE_MINUTES * 60_000);
  const reminder: BuiltReminder = {
    id: `snooze:${data.reminderId ?? data.prayerId ?? "prayer"}:${fireAt.getTime()}`,
    fireAt,
    title: content?.title ?? "Reminder",
    body: content?.body ?? "",
    channelId: (data.channelId as BuiltReminder["channelId"]) ?? "prayer",
    repeat: "date",
    route: data.route ?? "/tracker",
    priority: 10,
    ...(data.prayerId && OBLIGATORY_IDS.has(data.prayerId)
      ? {
          prayerId: data.prayerId as ObligatoryPrayer,
          prayerDateKey: data.prayerDate,
        }
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
  const data = response.notification?.request?.content?.data ?? {};
  const prayerId = data.prayerId;
  const prayerDate = data.prayerDate;
  if (prayerId && prayerDate && OBLIGATORY_IDS.has(prayerId)) {
    await handleExternalCommand({
      type: "mark-prayer",
      prayerId: prayerId as ObligatoryPrayer,
      date: prayerDate,
      source: "notification",
    });
    return;
  }
  await handleExternalCommand({
    type: "mark-current-obligatory",
    source: "notification",
  });
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
