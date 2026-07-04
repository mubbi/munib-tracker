import {
  detectWebPwaBrowserMatrix,
  getWebPwaTier,
  isIosWebKitBrowserTab,
  isStandalonePwa,
  type WebPwaTier,
} from "@/lib/notifications/browser-capabilities";
import { isWeb } from "@/lib/notifications/platform";

export type NotificationFailureReason =
  | "unsupported"
  | "permission_denied"
  | "permission_dismissed"
  | "ios_requires_pwa"
  | "service_worker_unavailable";

export function isSecureWebContext(): boolean {
  if (typeof window === "undefined") return false;
  return window.isSecureContext !== false;
}

export function isWebNotificationApiAvailable(): boolean {
  return isWeb && typeof window !== "undefined" && "Notification" in window;
}

export function isServiceWorkerSupported(): boolean {
  return isWeb && typeof navigator !== "undefined" && "serviceWorker" in navigator;
}

export type { WebPwaTier } from "@/lib/notifications/browser-capabilities";
export { getWebPwaTier, isStandalonePwa } from "@/lib/notifications/browser-capabilities";

/**
 * Returns a blocking reason when browser notifications cannot work here, or null
 * when the environment supports them. Uses Bowser-based classification so desktop
 * Chrome/Edge/Firefox are never mislabelled as iOS.
 */
export function getWebNotificationBlockingReason(): NotificationFailureReason | null {
  if (!isWeb) return null;

  // iOS WebKit (Safari + Chrome/Firefox shells): OS notifications only from an
  // installed Home-Screen PWA. In a plain tab, the Notification API is absent.
  if (isIosWebKitBrowserTab()) return "ios_requires_pwa";

  if (!isSecureWebContext()) return "unsupported";
  if (!isWebNotificationApiAvailable()) return "unsupported";
  return null;
}

/**
 * Guidance descriptor for the current web environment, used to render the right
 * banner copy/CTAs without leaking Bowser internals into UI components.
 */
export type WebNotificationGuidance = {
  tier: WebPwaTier | null;
  isIos: boolean;
  isInstalledPwa: boolean;
  needsSafariForInstall: boolean;
  blockingReason: NotificationFailureReason | null;
};

export function getWebNotificationGuidance(): WebNotificationGuidance {
  const matrix = detectWebPwaBrowserMatrix();
  return {
    tier: matrix?.tier ?? getWebPwaTier(),
    isIos: matrix?.isIosWebKit ?? false,
    isInstalledPwa: matrix?.isInstalledPwa ?? isStandalonePwa(),
    needsSafariForInstall: matrix?.needsSafariForInstall ?? false,
    blockingReason: getWebNotificationBlockingReason(),
  };
}

/** True when the browser can show the native permission prompt (Chromium / iOS installed PWA). */
export function canRequestWebNotificationPermission(): boolean {
  if (!isWeb) return false;
  if (getWebNotificationBlockingReason() != null) return false;
  if (!isWebNotificationApiAvailable()) return false;
  return readWebNotificationPermission() === "default";
}

/**
 * Start the browser permission prompt synchronously (call directly from onPress
 * so Safari accepts it as a user gesture). Returns null when not started.
 */
export function beginWebNotificationPermissionRequest():
  | Promise<NotificationPermission>
  | NotificationPermission
  | null {
  if (!isWebNotificationApiAvailable()) return null;
  if (Notification.permission !== "default") return null;
  try {
    const pending = Notification.requestPermission();
    return pending instanceof Promise ? pending : pending;
  } catch {
    return null;
  }
}

export function readWebNotificationPermission(): NotificationPermission | null {
  if (!isWebNotificationApiAvailable()) return null;
  return Notification.permission;
}
