import { getAppVersionInfo } from "@munib-tracker/api-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

/** Single key for soft-update dismissal (AsyncStorage / localStorage on web). */
export const SOFT_UPDATE_DISMISSED_KEY = "@munib_tracker_soft_update_dismissed";

function dismissKey(latestVersion: string): string {
  const { platform } = getAppVersionInfo();
  return `${platform}:${latestVersion}`;
}

function parseDismissRecord(raw: string | null): Record<string, string> {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}

function readDismissalsSync(): Record<string, string> {
  if (Platform.OS !== "web" || typeof localStorage === "undefined") return {};
  return parseDismissRecord(localStorage.getItem(SOFT_UPDATE_DISMISSED_KEY));
}

function writeDismissalsSync(parsed: Record<string, string>): void {
  if (Platform.OS !== "web" || typeof localStorage === "undefined") return;
  localStorage.setItem(SOFT_UPDATE_DISMISSED_KEY, JSON.stringify(parsed));
}

/** Web: persist dismissal synchronously before location.reload. */
export function markWebSoftUpdateDismissedSync(latestVersion: string): void {
  if (!latestVersion || Platform.OS !== "web") return;
  const parsed = readDismissalsSync();
  parsed[dismissKey(latestVersion)] = "1";
  writeDismissalsSync(parsed);
}

export function isSoftUpdateDismissedSync(latestVersion: string): boolean {
  if (!latestVersion) return false;
  const parsed = readDismissalsSync();
  return parsed[dismissKey(latestVersion)] === "1";
}

export async function isSoftUpdateDismissed(latestVersion: string): Promise<boolean> {
  if (!latestVersion) return false;
  if (isSoftUpdateDismissedSync(latestVersion)) return true;
  try {
    const raw = await AsyncStorage.getItem(SOFT_UPDATE_DISMISSED_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as Record<string, string>;
    return parsed[dismissKey(latestVersion)] === "1";
  } catch {
    return false;
  }
}

export async function dismissSoftUpdate(latestVersion: string): Promise<void> {
  if (!latestVersion) return;
  markWebSoftUpdateDismissedSync(latestVersion);
  try {
    const raw = await AsyncStorage.getItem(SOFT_UPDATE_DISMISSED_KEY);
    const parsed: Record<string, string> = raw ? (JSON.parse(raw) as Record<string, string>) : {};
    parsed[dismissKey(latestVersion)] = "1";
    await AsyncStorage.setItem(SOFT_UPDATE_DISMISSED_KEY, JSON.stringify(parsed));
  } catch {
    /* non-critical */
  }
}
