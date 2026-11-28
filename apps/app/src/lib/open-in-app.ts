import {
  OFFICIAL_ANDROID_PACKAGE,
  OFFICIAL_ANDROID_PLAY_STORE_URL,
  OFFICIAL_IOS_APP_STORE_URL,
} from "@munib-tracker/shared/constants";
import { Platform } from "react-native";

import { APP_SCHEME, buildAppUrl, buildHttpsAppUrl } from "@/lib/app-links";
import { REFERRER_LINK_KEY } from "@/lib/deferred-invite";
import { isStandalonePwa } from "@/lib/notifications/browser-capabilities";

/**
 * "Open in the app" for shared / QR links that landed in a phone browser.
 *
 * App Links (Android) and Universal Links (iOS) normally open the native app
 * before the browser ever loads. They don't fire everywhere — in-app browsers
 * (Instagram, Facebook, some mail apps), a link typed or pasted into the
 * address bar, or a device whose App Link verification failed — so the web
 * screen offers an explicit hand-off:
 *
 * - Android: an `intent://` URL pinned to our package. Chrome opens the app if
 *   it is installed, otherwise follows `S.browser_fallback_url` (Play listing).
 * - iOS: the custom scheme. If the page is still visible a moment later, the
 *   app isn't installed, so we go to the App Store listing instead.
 */

export type MobileWebOs = "ios" | "android";

type NavigatorLike = { userAgent?: string; platform?: string; maxTouchPoints?: number };

/** Phone / tablet OS from browser hints (iPadOS 13+ reports a Mac UA with touch). */
export function detectMobileWebOs(nav: NavigatorLike): MobileWebOs | null {
  const ua = nav.userAgent ?? "";
  if (/android/i.test(ua)) return "android";
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (nav.platform === "MacIntel" && (nav.maxTouchPoints ?? 0) > 1) return "ios";
  return null;
}

/**
 * The mobile OS when this is a phone/tablet browser tab the native app could take
 * over; `null` on native, desktop, during the static export, and in an installed PWA.
 */
export function nativeAppCandidateOs(): MobileWebOs | null {
  if (Platform.OS !== "web" || typeof window === "undefined" || typeof navigator === "undefined") {
    return null;
  }
  if (isStandalonePwa()) return null;
  return detectMobileWebOs(navigator);
}

/** `intent://…#Intent;scheme=munib-tracker;package=…;S.browser_fallback_url=…;end` */
export function androidIntentUrl(path: string, fallbackUrl: string): string {
  const target = buildAppUrl(path).slice(`${APP_SCHEME}://`.length);
  return (
    `intent://${target}#Intent;scheme=${APP_SCHEME};package=${OFFICIAL_ANDROID_PACKAGE};` +
    `S.browser_fallback_url=${encodeURIComponent(fallbackUrl)};end`
  );
}

/**
 * Play listing that remembers `path` through the install: the Install Referrer
 * API hands `mt_link=<path>` to the app's first launch (`lib/deferred-invite.ts`).
 */
export function playStoreUrlWithLink(path: string): string {
  const referrer = `${REFERRER_LINK_KEY}=${encodeURIComponent(path)}`;
  return `${OFFICIAL_ANDROID_PLAY_STORE_URL}&referrer=${encodeURIComponent(referrer)}`;
}

/** iOS: how long the page may stay visible before we assume the app isn't installed. */
export const IOS_APP_OPEN_TIMEOUT_MS = 1600;

export type OpenInAppEnv = {
  navigate: (url: string) => void;
  /** Best-effort clipboard write (must run inside the tap). */
  copyText: (text: string) => void;
  isHidden: () => boolean;
  onHide: (listener: () => void) => () => void;
  setTimer: (fn: () => void, ms: number) => unknown;
  clearTimer: (handle: unknown) => void;
};

function browserEnv(): OpenInAppEnv {
  return {
    navigate: (url) => window.location.assign(url),
    copyText: (text) => {
      void navigator.clipboard?.writeText(text).catch(() => {});
    },
    isHidden: () => document.visibilityState === "hidden",
    onHide: (listener) => {
      const onVisibility = () => {
        if (document.visibilityState === "hidden") listener();
      };
      document.addEventListener("visibilitychange", onVisibility);
      window.addEventListener("pagehide", listener);
      return () => {
        document.removeEventListener("visibilitychange", onVisibility);
        window.removeEventListener("pagehide", listener);
      };
    },
    setTimer: (fn, ms) => setTimeout(fn, ms),
    clearTimer: (handle) => clearTimeout(handle as ReturnType<typeof setTimeout>),
  };
}

/**
 * Open `path` (an Expo Router path, query included) in the native app; when the
 * app isn't installed, continue to its store listing. Call from a tap — browsers
 * block app hand-offs that don't come from a user gesture.
 */
export function openInNativeApp(
  path: string,
  os: MobileWebOs,
  env: OpenInAppEnv = browserEnv(),
): void {
  if (os === "android") {
    env.navigate(androidIntentUrl(path, playStoreUrlWithLink(path)));
    return;
  }
  // No install referrer on iOS: copy the link now (only a tap may write the
  // clipboard) so the freshly installed app can offer to paste it.
  env.copyText(buildHttpsAppUrl(path));
  let timer: unknown;
  // The app took over (page hidden): drop the store fallback.
  const stopListening = env.onHide(() => {
    env.clearTimer(timer);
    stopListening();
  });
  timer = env.setTimer(() => {
    stopListening();
    if (!env.isHidden()) env.navigate(OFFICIAL_IOS_APP_STORE_URL);
  }, IOS_APP_OPEN_TIMEOUT_MS);
  env.navigate(buildAppUrl(path));
}
