import {
  type RequestPermissionResult,
  requestNotificationPermission,
  type WebPermissionRequest,
} from "@/lib/notifications/permissions";
import { isWeb } from "@/lib/notifications/platform";
import {
  registerExpoPushTokenWithApi,
  registerWebPushSubscriptionWithApi,
} from "@/lib/notifications/register-push-token";
import { isTV } from "@/lib/platform/is-tv";
import { clearRecentSearches } from "@/lib/search-history";
import { clearDuaRecents } from "@/stores/dua-recents-store";
import { preferencesStore } from "@/stores/preferences-store";
import { toursStore } from "@/stores/tours-store";

import { rescheduleReminders } from "./side-effects";

export interface EnableNotificationsOptions {
  /**
   * The caller already ran (and won) the OS permission flow — e.g. the
   * permission banner's Allow button — so don't prompt again.
   */
  permissionGranted?: boolean;
  /** Web: the permission promise started synchronously inside the user gesture. */
  webPermissionRequest?: WebPermissionRequest | null;
  /** Signed-in / guest session token: registers the push token or Web Push subscription. */
  accessToken?: string | null;
}

/**
 * The ONE way to turn reminders on (settings master switch, inbox "Enable",
 * permission banner, onboarding): asks for permission, sets the master switch,
 * reschedules, and registers the push token. Callers own their toast copy.
 */
export async function enableNotifications(
  options: EnableNotificationsOptions = {},
): Promise<RequestPermissionResult> {
  if (isTV()) return { granted: false, reason: "unsupported" };
  const permission: RequestPermissionResult = options.permissionGranted
    ? { granted: true }
    : await requestNotificationPermission({ webPermissionRequest: options.webPermissionRequest });
  if (!permission.granted) return permission;

  await preferencesStore.getState().setNotificationPrefs({ masterEnabled: true });
  await rescheduleReminders();
  const token = options.accessToken ?? undefined;
  if (token) {
    if (isWeb) void registerWebPushSubscriptionWithApi(token);
    else void registerExpoPushTokenWithApi(token);
  }
  return { granted: true };
}

/** Master switch off: clears every scheduled reminder. */
export async function disableNotifications(): Promise<void> {
  await preferencesStore.getState().setNotificationPrefs({ masterEnabled: false });
  await rescheduleReminders();
}

/** Device history (Privacy & security): recent duas + recent searches. Keeps favourites. */
export async function clearDeviceHistory(): Promise<void> {
  await Promise.all([clearDuaRecents(), clearRecentSearches()]);
}

/** Help & about → "Reset tour hints": every feature tour can auto-run again. */
export async function resetTourHints(): Promise<void> {
  await toursStore.getState().reset();
}
