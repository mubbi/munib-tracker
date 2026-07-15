import Constants from "expo-constants";
import { Platform } from "react-native";

import { SessionStore } from "@/auth/session-store";
import i18n from "@/i18n";
import { isNative, isWeb } from "@/lib/notifications/platform";
import { upsertPushToken } from "@/lib/notifications-api";

async function loadExpoNotifications() {
  return import("expo-notifications");
}

let lastRegisteredKey: string | null = null;
const pendingRegistrationKeys = new Set<string>();

function resolveExpoProjectId(): string | undefined {
  const easConfig = Constants.easConfig as { projectId?: string } | null;
  const extra = Constants.expoConfig?.extra as { eas?: { projectId?: string } } | undefined;
  return easConfig?.projectId ?? extra?.eas?.projectId;
}

/**
 * After notification permission is granted, register the Expo push token
 * with the API for linked accounts.
 */
export async function registerExpoPushTokenWithApi(accessToken: string | undefined): Promise<void> {
  if (!accessToken || !isNative) return;

  try {
    const Notifications = await loadExpoNotifications();
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") return;

    const projectId = resolveExpoProjectId();
    const tokenResult = projectId
      ? await Notifications.getExpoPushTokenAsync({ projectId })
      : await Notifications.getExpoPushTokenAsync();

    const token = tokenResult.data?.trim();
    if (!token) return;

    const deviceId = await SessionStore.getDeviceId();
    const session = await SessionStore.get();
    const registrationKey = [
      session?.userId ?? "unknown",
      token,
      deviceId,
      i18n.language,
      Platform.OS,
    ].join(":");
    if (registrationKey === lastRegisteredKey || pendingRegistrationKeys.has(registrationKey)) {
      return;
    }

    pendingRegistrationKeys.add(registrationKey);
    try {
      await upsertPushToken(accessToken, {
        token,
        deviceId,
        platform: "expo",
        locale: i18n.language,
        clientPlatform: Platform.OS,
      });
      lastRegisteredKey = registrationKey;
    } finally {
      pendingRegistrationKeys.delete(registrationKey);
    }
  } catch {
    // Push registration is best-effort (simulator / missing projectId).
  }
}

/** Web VAPID subscription registration is deferred until a service worker is wired. */
export function canRegisterWebPushToken(): boolean {
  return isWeb;
}
