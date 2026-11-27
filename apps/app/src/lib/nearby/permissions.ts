import { Linking, PermissionsAndroid, Platform } from "react-native";

import { nearbyAuthorizationStatus, requestNearbyAuthorization } from "./native";

/**
 * Runtime permission for one nearby role (NF-3.25). The in-app rationale is
 * always shown before {@link requestNearbyPermission} triggers the OS prompt.
 *
 * - iOS: one Bluetooth permission (`CBManager.authorization`); after a denial iOS
 *   never prompts again → `blocked` (Settings only).
 * - Android 12+ (API 31): `BLUETOOTH_ADVERTISE` (host) / `BLUETOOTH_SCAN` (joiner,
 *   declared `neverForLocation`).
 * - Android ≤ 11: advertising needs no runtime permission; scanning needs
 *   `ACCESS_FINE_LOCATION` (the platform's BLE-scan rule — results are never
 *   used for location).
 */
export type NearbyRole = "advertise" | "scan";

export type NearbyPermissionState = "granted" | "notDetermined" | "denied" | "blocked";

const ANDROID_12 = 31;

function androidApiLevel(): number {
  return typeof Platform.Version === "number" ? Platform.Version : Number(Platform.Version) || 0;
}

/** The Android runtime permission a role needs, or `null` when none is required. */
export function androidNearbyPermission(
  role: NearbyRole,
  apiLevel: number = androidApiLevel(),
): string | null {
  if (apiLevel >= ANDROID_12) {
    return role === "advertise"
      ? PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE
      : PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN;
  }
  return role === "scan" ? PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION : null;
}

/** True on Android ≤ 11, where scans also need location services switched on. */
export function nearbyScanNeedsLocationServices(apiLevel: number = androidApiLevel()): boolean {
  return Platform.OS === "android" && apiLevel < ANDROID_12;
}

export async function checkNearbyPermission(role: NearbyRole): Promise<NearbyPermissionState> {
  if (Platform.OS === "ios") {
    const status = nearbyAuthorizationStatus();
    return status === "granted"
      ? "granted"
      : status === "notDetermined"
        ? "notDetermined"
        : "blocked";
  }
  if (Platform.OS !== "android") return "blocked";
  const permission = androidNearbyPermission(role);
  if (!permission) return "granted";
  try {
    // Android can't tell "never asked" from "denied" without asking: treat as askable.
    return (await PermissionsAndroid.check(permission as never)) ? "granted" : "notDetermined";
  } catch {
    return "notDetermined";
  }
}

/** Shows the OS prompt (call after the rationale). */
export async function requestNearbyPermission(role: NearbyRole): Promise<NearbyPermissionState> {
  if (Platform.OS === "ios") {
    return (await requestNearbyAuthorization()) === "granted" ? "granted" : "blocked";
  }
  if (Platform.OS !== "android") return "blocked";
  const permission = androidNearbyPermission(role);
  if (!permission) return "granted";
  try {
    const result = await PermissionsAndroid.request(permission as never);
    if (result === PermissionsAndroid.RESULTS.GRANTED) return "granted";
    return result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ? "blocked" : "denied";
  } catch {
    return "denied";
  }
}

/** App settings (permission was blocked). */
export async function openNearbyPermissionSettings(): Promise<void> {
  try {
    await Linking.openSettings();
  } catch {
    // No settings app (simulator edge cases) — the copy already explains where to go.
  }
}

/**
 * Android: the system Bluetooth screen (no BLUETOOTH_CONNECT needed, unlike the
 * enable-request intent). iOS has no public deep link to Bluetooth settings —
 * the copy points to Control Center instead.
 */
export async function openBluetoothSettings(): Promise<boolean> {
  if (Platform.OS !== "android") return false;
  try {
    await Linking.sendIntent("android.settings.BLUETOOTH_SETTINGS");
    return true;
  } catch {
    return false;
  }
}

/** Android ≤ 11: location settings (scans return nothing while location is off). */
export async function openLocationSettings(): Promise<void> {
  if (Platform.OS !== "android") return;
  try {
    await Linking.sendIntent("android.settings.LOCATION_SOURCE_SETTINGS");
  } catch {
    await openNearbyPermissionSettings();
  }
}
