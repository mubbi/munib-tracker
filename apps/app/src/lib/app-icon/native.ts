import { requireOptionalNativeModule } from "expo";
import { Platform } from "react-native";

import { isTV } from "@/lib/platform/is-tv";

import { type AppIconId, isAppIconId } from "./icons";

/**
 * JS ↔ native contract for seasonal app icons (NF-2.23b), backed by the local Expo
 * module `modules/munib-app-icon`:
 *
 * - **iOS** — `UIApplication.setAlternateIconName`. Applies at once (foreground
 *   only) and iOS confirms it with a system alert.
 * - **Android** — launcher `activity-alias` swap, deferred by the module until the
 *   app is in the background; `getIconName()` reports the pending icon meanwhile.
 *
 * The module is `null` on web, Apple TV / Android TV (excluded from TV autolinking),
 * Expo Go and binaries built before it existed — every wrapper is a safe no-op
 * there and the setting is hidden.
 */
interface MunibAppIconModule {
  isSupported(): Promise<boolean>;
  /** Active (or, on Android, pending) alternate icon id; null = primary icon. */
  getIconName(): Promise<string | null>;
  /** Resolves true when the icon changed (iOS) or a change was queued (Android). */
  setIconName(name: string | null): Promise<boolean>;
}

const native: MunibAppIconModule | null =
  Platform.OS === "web" || isTV()
    ? null
    : requireOptionalNativeModule<MunibAppIconModule>("MunibAppIcon");

/** True when this binary can switch its launcher icon at all. */
export function isAppIconModuleAvailable(): boolean {
  return native != null;
}

/** False on devices that refuse alternate icons (e.g. MDM-restricted iOS). */
export async function appIconSupported(): Promise<boolean> {
  if (!native) return false;
  try {
    return await native.isSupported();
  } catch {
    return false;
  }
}

/** The icon the launcher shows (or will show), null for the classic icon. */
export async function getAppIcon(): Promise<AppIconId | null> {
  if (!native) return null;
  const name = await native.getIconName();
  return isAppIconId(name) ? name : null;
}

/** Switches the launcher icon; resolves false when it already was `id`. */
export async function setAppIcon(id: AppIconId | null): Promise<boolean> {
  if (!native) return false;
  return native.setIconName(id);
}

/** True where a change only lands once the user leaves the app (Android). */
export function appIconAppliesInBackground(): boolean {
  return native != null && Platform.OS === "android";
}
