import type { FocusLockUnlockMode } from "@munib-tracker/shared/types";
import { requireOptionalNativeModule } from "expo";
import { Platform } from "react-native";

import { isTV } from "@/lib/platform/is-tv";

import type { AllowlistContext, LaunchableApp } from "./allowlist";

/**
 * JS ↔ native contract for NF-3.13 (plan §"JS ↔ native contract"), backed by the
 * local Expo module `modules/munib-focus-lock`:
 * - iOS: FamilyControls / ManagedSettings / DeviceActivity (+ monitor, shield
 *   configuration and shield action extensions in `targets/munib-tracker-focus-*`);
 * - Android: UsageStats + overlay + a `specialUse` foreground service armed by
 *   AlarmManager.
 *
 * The module is `null` on web, TV, visionOS, Expo Go and iOS builds without the
 * Family Controls entitlement (`EXPO_PUBLIC_FOCUS_LOCK_HARD_IOS` off — D17).
 * Every wrapper no-ops there and the app shows the soft in-app prompt instead.
 */

export type FocusAuthStatus = "granted" | "denied" | "notDetermined";

export interface NativeFocusWindow {
  id: string;
  /** Comma-separated focus prayers (`maghrib,isha`); empty for the test window. */
  prayer: string;
  /** Localised shield / overlay title, e.g. "It's time for Dhuhr". */
  title: string;
  body: string;
  /** ISO instants. */
  start: string;
  end: string;
}

export interface NativeFocusLabels {
  prayed: string;
  prayNow: string;
  holdHint: string;
  /** Index = emergency unlocks left (0…5), pre-formatted with plurals. */
  emergency: string[];
  confirmTitle: string;
  confirmBody: string;
  ongoingTitle: string;
  ongoingBody: string;
  channelName: string;
  done: string;
}

export interface NativeFocusTheme {
  accent: string;
  accentForeground: string;
  background: string;
  foreground: string;
  muted: string;
}

export interface NativeFocusConfig {
  unlockMode: FocusLockUnlockMode;
  emergencyPerDay: number;
  /** Post "Tap to confirm your salah" when "I've prayed" is tapped on the shield. */
  confirmNotification: boolean;
  /** Deep link the confirm action opens (`munib-tracker://mark-current`). */
  confirmUrl: string;
  labels: NativeFocusLabels;
  theme: NativeFocusTheme;
}

export interface NativeFocusStatus {
  active: boolean;
  windowId?: string | null;
  emergencyLeft: number;
  /** ISO times of emergency unlocks taken natively (JS merges them into its local log). */
  emergencyUnlocks?: string[];
  /** Window ids the native side ended (gentle hold, emergency). */
  endedIds?: string[];
}

export interface AndroidFocusPermissions {
  usageAccess: boolean;
  overlay: boolean;
  exactAlarm: boolean;
  notifications: boolean;
  /** True when the app is exempt from battery optimisation. */
  batteryUnrestricted: boolean;
}

export type AndroidFocusSettingsPage = "usageAccess" | "overlay" | "battery";

interface FocusLockNativeModule {
  isSupported(): boolean;
  authorizationStatus(): Promise<FocusAuthStatus>;
  requestAuthorization(): Promise<"granted" | "denied">;
  pickApps(): Promise<{ count: number }>;
  selectionCount(): Promise<number>;
  setPlan(windows: NativeFocusWindow[], cfg: NativeFocusConfig): Promise<void>;
  endWindowNow(id: string | null): Promise<void>;
  status(): Promise<NativeFocusStatus>;
  /** Clears the plan, the app selection and all native state (Reset app data). */
  reset(): Promise<void>;
  // Android only
  permissions?(): Promise<AndroidFocusPermissions>;
  openSettings?(page: AndroidFocusSettingsPage): Promise<void>;
  listLaunchableApps?(): Promise<{ apps: LaunchableApp[]; context: AllowlistContext }>;
  blockedPackages?(): Promise<string[]>;
  setBlockedPackages?(packages: string[]): Promise<{ count: number }>;
}

/**
 * iOS hard-block build flag. Apple granted the Family Controls (Distribution) entitlement on
 * 2026-11-24, so it defaults ON; `EXPO_PUBLIC_FOCUS_LOCK_HARD_IOS=0` builds the D17 soft prompt.
 * Must agree with `isHardIosEnabled` in `modules/munib-focus-lock/app.plugin.js`.
 */
export function isHardIosFlagOn(): boolean {
  const v = process.env.EXPO_PUBLIC_FOCUS_LOCK_HARD_IOS?.trim().toLowerCase();
  return v !== "0" && v !== "false";
}

function loadModule(): FocusLockNativeModule | null {
  if (isTV()) return null;
  if (Platform.OS === "android") {
    return requireOptionalNativeModule<FocusLockNativeModule>("MunibFocusLock");
  }
  if (Platform.OS === "ios" && isHardIosFlagOn()) {
    return requireOptionalNativeModule<FocusLockNativeModule>("MunibFocusLock");
  }
  return null;
}

const nativeModule = loadModule();

/** `hard` = the OS blocks the chosen apps; `soft` = in-app prompt only (web, TV, iOS without the entitlement). */
export type FocusLockCapability = "hard" | "soft";

export function focusLockCapability(): FocusLockCapability {
  try {
    return nativeModule?.isSupported() ? "hard" : "soft";
  } catch {
    return "soft";
  }
}

export function focusLockPlatform(): "ios" | "android" | null {
  if (!nativeModule) return null;
  return Platform.OS === "ios" ? "ios" : Platform.OS === "android" ? "android" : null;
}

export async function authorizationStatus(): Promise<FocusAuthStatus> {
  if (!nativeModule) return "denied";
  try {
    return await nativeModule.authorizationStatus();
  } catch {
    return "denied";
  }
}

/** iOS: Screen Time authorization (`.individual`). Android: granted once usage access + overlay are on. */
export async function requestAuthorization(): Promise<"granted" | "denied"> {
  if (!nativeModule) return "denied";
  try {
    return await nativeModule.requestAuthorization();
  } catch {
    return "denied";
  }
}

/** iOS: FamilyActivityPicker. Android: the JS list calls {@link setBlockedPackages} instead. */
export async function pickApps(): Promise<{ count: number }> {
  if (!nativeModule) return { count: 0 };
  try {
    return await nativeModule.pickApps();
  } catch {
    return { count: 0 };
  }
}

export async function selectionCount(): Promise<number> {
  if (!nativeModule) return 0;
  try {
    return await nativeModule.selectionCount();
  } catch {
    return 0;
  }
}

export async function setPlan(windows: NativeFocusWindow[], cfg: NativeFocusConfig): Promise<void> {
  if (!nativeModule) return;
  try {
    await nativeModule.setPlan(windows, cfg);
  } catch {
    /* Scheduling failed (permission revoked, OS limit) — the next re-plan retries. */
  }
}

/** Ends the running window (marking the salah completed anywhere calls this). */
export async function endWindowNow(id?: string): Promise<void> {
  if (!nativeModule) return;
  try {
    await nativeModule.endWindowNow(id ?? null);
  } catch {
    /* Already ended. */
  }
}

const IDLE_STATUS: NativeFocusStatus = { active: false, emergencyLeft: 0 };

export async function status(): Promise<NativeFocusStatus> {
  if (!nativeModule) return IDLE_STATUS;
  try {
    return await nativeModule.status();
  } catch {
    return IDLE_STATUS;
  }
}

/** Forgets the picked apps, the plan and the unlock log on this device (wipe path). */
export async function resetNative(): Promise<void> {
  if (!nativeModule) return;
  try {
    await nativeModule.reset();
  } catch {
    /* Nothing stored. */
  }
}

const NO_PERMISSIONS: AndroidFocusPermissions = {
  usageAccess: false,
  overlay: false,
  exactAlarm: false,
  notifications: false,
  batteryUnrestricted: false,
};

export async function androidPermissions(): Promise<AndroidFocusPermissions> {
  if (!nativeModule?.permissions) return NO_PERMISSIONS;
  try {
    return await nativeModule.permissions();
  } catch {
    return NO_PERMISSIONS;
  }
}

export async function openAndroidSettings(page: AndroidFocusSettingsPage): Promise<void> {
  if (!nativeModule?.openSettings) return;
  try {
    await nativeModule.openSettings(page);
  } catch {
    /* Settings page missing on this OEM build. */
  }
}

export async function listLaunchableApps(): Promise<{
  apps: LaunchableApp[];
  context: AllowlistContext | null;
}> {
  if (!nativeModule?.listLaunchableApps) return { apps: [], context: null };
  try {
    return await nativeModule.listLaunchableApps();
  } catch {
    return { apps: [], context: null };
  }
}

export async function blockedPackages(): Promise<string[]> {
  if (!nativeModule?.blockedPackages) return [];
  try {
    return await nativeModule.blockedPackages();
  } catch {
    return [];
  }
}

export async function setBlockedPackages(packages: string[]): Promise<{ count: number }> {
  if (!nativeModule?.setBlockedPackages) return { count: 0 };
  try {
    return await nativeModule.setBlockedPackages(packages);
  } catch {
    return { count: 0 };
  }
}
