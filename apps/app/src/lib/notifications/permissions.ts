import { Linking } from "react-native";

import { isLocalNotificationSupported, isNative, isWeb } from "@/lib/notifications/platform";
import {
  getWebNotificationBlockingReason,
  isWebNotificationApiAvailable,
  type NotificationFailureReason,
  readWebNotificationPermission,
} from "@/lib/notifications/web-environment";

export type NotificationPermissionUiState = "granted" | "denied" | "undetermined";

export type WebPermissionRequest = Promise<NotificationPermission> | NotificationPermission;

export type RequestPermissionResult =
  | { granted: true }
  | { granted: false; reason: NotificationFailureReason };

async function loadExpoNotifications() {
  return import("expo-notifications");
}

export async function readNotificationPermissionUiState(): Promise<NotificationPermissionUiState> {
  try {
    if (isWeb) {
      const blocked = getWebNotificationBlockingReason();
      if (blocked) return "undetermined";
      const permission = readWebNotificationPermission();
      if (permission === "granted") return "granted";
      if (permission === "denied") return "denied";
      return "undetermined";
    }
    if (isNative) {
      const Notifications = await loadExpoNotifications();
      const { status } = await Notifications.getPermissionsAsync();
      if (status === "granted") return "granted";
      if (status === "denied") return "denied";
      return "undetermined";
    }
  } catch {
    return "undetermined";
  }
  return "undetermined";
}

async function resolveWebPermissionRequest(
  started?: WebPermissionRequest | null,
): Promise<RequestPermissionResult> {
  const blocked = getWebNotificationBlockingReason();
  if (blocked) return { granted: false, reason: blocked };

  const initial = readWebNotificationPermission();
  if (initial === "granted") return { granted: true };
  if (initial === "denied") return { granted: false, reason: "permission_denied" };

  try {
    let outcome: NotificationPermission;
    if (started != null) {
      outcome = started instanceof Promise ? await started : started;
    } else if (isWebNotificationApiAvailable()) {
      const pending = Notification.requestPermission();
      outcome = pending instanceof Promise ? await pending : pending;
    } else {
      return { granted: false, reason: "unsupported" };
    }

    const after = readWebNotificationPermission();
    if (outcome === "granted" || after === "granted") return { granted: true };
    if (outcome === "denied" || after === "denied") {
      return { granted: false, reason: "permission_denied" };
    }
    return { granted: false, reason: "permission_dismissed" };
  } catch {
    const after = readWebNotificationPermission();
    if (after === "granted") return { granted: true };
    if (after === "denied") return { granted: false, reason: "permission_denied" };
    return { granted: false, reason: "permission_dismissed" };
  }
}

export async function requestNotificationPermission(options?: {
  webPermissionRequest?: WebPermissionRequest | null;
}): Promise<RequestPermissionResult> {
  if (!isLocalNotificationSupported() && !isWeb) {
    return { granted: false, reason: "unsupported" };
  }

  if (isWeb) {
    return resolveWebPermissionRequest(options?.webPermissionRequest);
  }

  try {
    const Notifications = await loadExpoNotifications();
    const current = await Notifications.getPermissionsAsync();
    if (current.status !== "granted") {
      const requested = await Notifications.requestPermissionsAsync();
      if (requested.status !== "granted") {
        return {
          granted: false,
          reason: requested.status === "denied" ? "permission_denied" : "permission_dismissed",
        };
      }
    }
    return { granted: true };
  } catch {
    return { granted: false, reason: "unsupported" };
  }
}

export function openNotificationSettings(): void {
  void Linking.openSettings();
}

/**
 * Whether OS reminders can actually be scheduled + delivered here. Only native
 * dev/production builds qualify — the web build has no service-worker push
 * backend, so reminders are surfaced through the in-app inbox instead.
 */
export function canEnableLocalReminders(): boolean {
  return isLocalNotificationSupported();
}
