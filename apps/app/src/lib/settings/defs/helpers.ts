import type { NotificationPreferences, UserPreferences } from "@munib-tracker/shared/types";
import type { TFunction } from "i18next";

import { type DevicePreferences, setDevicePreferences } from "@/stores/device-preferences-store";
import { preferencesStore } from "@/stores/preferences-store";

import type { SettingDef, SettingsSnapshot } from "../types";

/** Shared summary for toggles: "On" / "Off". */
export function onOff(v: boolean, t: TFunction): string {
  return t(v ? "common.on" : "common.off");
}

/** Placeholder read/write for rows that hold no value (links, actions, info). */
export const NO_VALUE = {
  read: () => null,
  write: async () => {},
  defaultValue: null,
  resettable: false,
} as const;

export function updatePrefs(patch: Partial<UserPreferences>): Promise<void> {
  return preferencesStore.getState().update(patch);
}

export function setNotificationPrefs(patch: Partial<NotificationPreferences>): Promise<void> {
  return preferencesStore.getState().setNotificationPrefs(patch);
}

type BooleanPrefKey = {
  [K in keyof UserPreferences]-?: NonNullable<UserPreferences[K]> extends boolean ? K : never;
}[keyof UserPreferences];

/** Toggle backed by a top-level boolean in `UserPreferences`. */
export function prefToggle(
  def: Omit<SettingDef<boolean>, "control" | "read" | "write" | "defaultValue" | "fields"> & {
    key: BooleanPrefKey;
    /** Value when the optional field is unset. */
    fallback: boolean;
  },
): SettingDef<boolean> {
  const { key, fallback, ...rest } = def;
  return {
    summary: onOff,
    ...rest,
    control: { kind: "toggle" },
    read: (s: SettingsSnapshot) => (s.prefs[key] as boolean | undefined) ?? fallback,
    write: (v) => updatePrefs({ [key]: v } as Partial<UserPreferences>),
    defaultValue: fallback,
    fields: [`prefs.${key}`],
  };
}

type NotificationToggleKey = {
  [K in keyof NotificationPreferences]-?: NonNullable<NotificationPreferences[K]> extends boolean
    ? K
    : never;
}[keyof NotificationPreferences];

/** Toggle backed by `notificationPrefs.<key>` that reschedules reminders. */
export function notificationToggle(
  def: Omit<
    SettingDef<boolean>,
    "control" | "read" | "write" | "defaultValue" | "fields" | "group" | "scope"
  > & {
    key: NotificationToggleKey;
    fallback: boolean;
  },
): SettingDef<boolean> {
  const { key, fallback, ...rest } = def;
  return {
    summary: onOff,
    enabledWhen: (s) => s.prefs.notificationPrefs.masterEnabled,
    sideEffects: ["reschedule-reminders"],
    ...rest,
    group: "notifications",
    scope: "account",
    control: { kind: "toggle" },
    read: (s) => (s.prefs.notificationPrefs[key] as boolean | undefined) ?? fallback,
    write: (v) => setNotificationPrefs({ [key]: v }),
    defaultValue: fallback,
    fields: [`prefs.notificationPrefs.${key}`],
  };
}

type DeviceToggleKey =
  | "hapticsEnabled"
  | "cacheAudioLocally"
  | "cacheQuranEditionsLocally"
  | "cacheHadithLocally";

/**
 * Toggle backed by a device preference (B4, never synced). Reads the device
 * value first, then the legacy synced `UserPreferences` field it migrated from.
 */
export function deviceToggle(
  def: Omit<
    SettingDef<boolean>,
    "control" | "read" | "write" | "defaultValue" | "fields" | "scope"
  > & {
    key: DeviceToggleKey;
    fallback: boolean;
  },
): SettingDef<boolean> {
  const { key, fallback, ...rest } = def;
  return {
    summary: onOff,
    ...rest,
    scope: "device",
    control: { kind: "toggle" },
    read: (s: SettingsSnapshot) => s.device[key] ?? s.prefs[key] ?? fallback,
    write: (v) => setDevicePreferences({ [key]: v } as Partial<DevicePreferences>),
    defaultValue: fallback,
    fields: [`device.${key}`, `prefs.${key}`],
  };
}
