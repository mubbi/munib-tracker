import type { AppVersionMeta } from "@munib-tracker/api-client";
import {
  buildLocalizedAndroidPlayStoreUrl,
  buildLocalizedIosAppStoreUrl,
} from "@munib-tracker/shared/constants";
import Constants from "expo-constants";
import { Linking, Platform } from "react-native";
import { markWebSoftUpdateDismissedSync } from "@/lib/app/app-update-dismiss";

const TRUSTED_STORE_HOSTS = ["play.google.com", "apps.apple.com", "testflight.apple.com"];

function isTrustedStoreUrl(url: string): boolean {
  try {
    const { hostname, protocol } = new URL(url);
    if (protocol !== "https:") return false;
    return TRUSTED_STORE_HOSTS.some((h) => hostname === h || hostname.endsWith(`.${h}`));
  } catch {
    return false;
  }
}

/** Prefer cache-busted navigation so browsers load a fresh JS bundle. */
export function reloadWebWithCacheBust(): void {
  if (typeof window === "undefined") return;
  try {
    const url = new URL(window.location.href);
    url.searchParams.set("_cb", String(Date.now()));
    window.location.assign(url.toString());
  } catch {
    window.location.reload();
  }
}

export function resolveStoreUrl(meta: AppVersionMeta, locale?: string): string | null {
  if (meta.storeUrl && isTrustedStoreUrl(meta.storeUrl)) {
    return meta.storeUrl;
  }
  if (Platform.OS === "android") {
    const pkg = Constants.expoConfig?.android?.package;
    if (pkg) {
      return buildLocalizedAndroidPlayStoreUrl(locale);
    }
  }
  if (Platform.OS === "ios") {
    return buildLocalizedIosAppStoreUrl(locale);
  }
  return null;
}

/** Open store (native) or reload with cache bust (web). */
export function performAppUpdate(
  meta: AppVersionMeta,
  options?: { isHard?: boolean; locale?: string },
): void {
  const storeUrl = resolveStoreUrl(meta, options?.locale);
  if (storeUrl) {
    Linking.openURL(storeUrl).catch(() => {});
    return;
  }
  if (Platform.OS === "web") {
    if (!options?.isHard && meta.latestVersion) {
      markWebSoftUpdateDismissedSync(meta.latestVersion);
    }
    reloadWebWithCacheBust();
  }
}

export function isWebPlatform(): boolean {
  return Platform.OS === "web";
}
