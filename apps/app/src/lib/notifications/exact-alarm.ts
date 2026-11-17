import { Platform } from "react-native";

import { isTV } from "@/lib/platform/is-tv";

/**
 * Android exact-alarm permission for "Precise Adhan timing" (Expo SDK 58
 * `delivery: "alarmClock"`). Android 14+ denies it by default for new installs;
 * below Android 12 it is always granted. Other platforms don't need it.
 */
export function supportsPreciseAdhan(): boolean {
  return Platform.OS === "android" && !isTV();
}

export async function hasExactAlarmPermission(): Promise<boolean> {
  if (!supportsPreciseAdhan()) return false;
  try {
    const Notifications = await import("expo-notifications");
    const response = await Notifications.getExactAlarmPermissionsAsync();
    return response.granted;
  } catch {
    return false;
  }
}

/**
 * Opens the system "Alarms & reminders" screen when needed and resolves with the
 * result once the user returns. Resolves `true` immediately when already granted.
 */
export async function requestExactAlarmPermission(): Promise<boolean> {
  if (!supportsPreciseAdhan()) return false;
  try {
    const Notifications = await import("expo-notifications");
    const current = await Notifications.getExactAlarmPermissionsAsync();
    if (current.granted) return true;
    const response = await Notifications.requestExactAlarmPermissionsAsync();
    return response.granted;
  } catch {
    return false;
  }
}
