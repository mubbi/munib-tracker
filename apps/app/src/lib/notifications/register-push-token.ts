import { apiFetch } from "@munib-tracker/api-client";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { apiAuthOptions } from "@/api/auth-options";
import { SessionStore } from "@/auth/session-store";
import i18n from "@/i18n";
import {
  detectWebPwaBrowserMatrix,
  detectWebRuntimeFeatures,
  isStandalonePwa,
} from "@/lib/notifications/browser-capabilities";
import { isNative, isWeb } from "@/lib/notifications/platform";
import { upsertPushToken } from "@/lib/notifications-api";

async function loadExpoNotifications() {
  return import("expo-notifications");
}

let lastRegisteredKey: string | null = null;
const pendingRegistrationKeys = new Set<string>();
let lastWebSubscriptionKey: string | null = null;

function resolveExpoProjectId(): string | undefined {
  const easConfig = Constants.easConfig as { projectId?: string } | null;
  const extra = Constants.expoConfig?.extra as { eas?: { projectId?: string } } | undefined;
  return easConfig?.projectId ?? extra?.eas?.projectId;
}

export async function getExpoPushToken(): Promise<string | null> {
  if (!isNative) return null;
  const Notifications = await loadExpoNotifications();
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") return null;

  const projectId = resolveExpoProjectId();
  const result = projectId
    ? await Notifications.getExpoPushTokenAsync({ projectId })
    : await Notifications.getExpoPushTokenAsync();
  return result.data?.trim() || null;
}

/**
 * After notification permission is granted, register the Expo push token
 * with the API for linked and guest accounts.
 */
export async function registerExpoPushTokenWithApi(accessToken: string | undefined): Promise<void> {
  if (!accessToken || !isNative) return;

  try {
    const token = await getExpoPushToken();
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

/** True when this browser can subscribe to Web Push (feature detection + iOS install rule). */
export function canRegisterWebPushToken(): boolean {
  if (!isWeb) return false;
  const runtime = detectWebRuntimeFeatures();
  if (!runtime.secureContext || !runtime.serviceWorker || !runtime.notifications) return false;
  if (typeof window === "undefined" || !("PushManager" in window)) return false;
  const matrix = detectWebPwaBrowserMatrix();
  if (matrix?.isIosWebKit && !isStandalonePwa()) return false;
  return true;
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) {
    output[i] = raw.charCodeAt(i);
  }
  return output;
}

async function fetchVapidPublicKey(accessToken: string): Promise<string | null> {
  try {
    const result = await apiFetch<{ publicKey: string | null }>(
      { url: "/notifications/vapid-public-key", method: "GET" },
      apiAuthOptions(accessToken),
    );
    return result.publicKey?.trim() || null;
  } catch {
    const extra = Constants.expoConfig?.extra as { vapidPublicKey?: string } | undefined;
    return extra?.vapidPublicKey?.trim() || null;
  }
}

/**
 * Subscribe to Web Push and upsert the subscription JSON on the API.
 * Must run from a user gesture on Safari/iOS.
 */
export async function registerWebPushSubscriptionWithApi(
  accessToken: string | undefined,
): Promise<PushSubscriptionJSON | null> {
  if (!accessToken || !canRegisterWebPushToken()) return null;
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return null;

  try {
    const permission = typeof Notification !== "undefined" ? Notification.permission : "default";
    if (permission !== "granted") return null;

    const registration = await navigator.serviceWorker.ready;
    if (!registration.pushManager) return null;

    const vapidKey = await fetchVapidPublicKey(accessToken);
    if (!vapidKey) return null;

    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey) as BufferSource,
      });
    }

    const json = subscription.toJSON();
    if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) return null;

    const deviceId = await SessionStore.getDeviceId();
    const session = await SessionStore.get();
    const registrationKey = [
      session?.userId ?? "unknown",
      json.endpoint,
      deviceId,
      i18n.language,
    ].join(":");
    if (registrationKey === lastWebSubscriptionKey) return json;

    await upsertPushToken(accessToken, {
      token: JSON.stringify({
        endpoint: json.endpoint,
        expirationTime: json.expirationTime ?? null,
        keys: { p256dh: json.keys.p256dh, auth: json.keys.auth },
      }),
      deviceId,
      platform: "web",
      locale: i18n.language,
      clientPlatform: "web",
    });
    lastWebSubscriptionKey = registrationKey;
    return json;
  } catch {
    return null;
  }
}

/** Unsubscribe the browser subscription and clear the local cache key. */
export async function unsubscribeWebPushSubscription(): Promise<void> {
  if (!isWeb || typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager?.getSubscription();
    await subscription?.unsubscribe();
  } catch {
    /* best-effort */
  }
  lastWebSubscriptionKey = null;
}
