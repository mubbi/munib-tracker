import type { UserPreferences } from "@munib-tracker/shared/types";

/**
 * Web build of the notification scheduler. Local notifications aren't available
 * on web, and merely importing `expo-notifications` there triggers its
 * push-token auto-registration ("Listening to push token changes is not yet
 * fully supported on web") warning. This platform-specific stub avoids the
 * dependency entirely so every operation is a safe no-op, mirroring the native
 * module's public surface.
 */

export const SNOOZE_ACTION_IDENTIFIER = "snooze";

export async function configureNotifications(): Promise<void> {
  return;
}

export async function getPermissionStatus(): Promise<"granted" | "denied" | "undetermined"> {
  return "denied";
}

export async function requestPermission(): Promise<boolean> {
  return false;
}

export async function cancelAll(): Promise<void> {
  return;
}

export async function rescheduleAll(_prefs: UserPreferences): Promise<void> {
  return;
}

export async function snoozeNotification(_response: unknown): Promise<void> {
  return;
}

export async function listScheduled(): Promise<
  { id: string; title: string; body: string; time?: string }[]
> {
  return [];
}
