import type { FocusLockPrayer, FocusLockPrefs } from "@munib-tracker/shared/types";
import type { NativeFocusConfig, NativeFocusTheme, NativeFocusWindow } from "./native";
import type { FocusWindow } from "./plan";
import { FOCUS_LOCK_BOUNDS } from "./prefs";

/** Deep link the shield / overlay "I've prayed" action opens (route `mark-current.tsx`). */
export const FOCUS_CONFIRM_URL = "munib-tracker://mark-current";

/** Minimal translate signature (adapts `useTranslation().t` and `i18n.t`, whose typed resources differ). */
export type Translate = (key: string, options?: Record<string, unknown>) => string;

/** Wraps any i18next `t` (hook or singleton) as a {@link Translate}. */
export function asTranslate(t: unknown): Translate {
  const call = t as (key: string, options?: Record<string, unknown>) => unknown;
  return (key, options) => String(options ? call(key, options) : call(key));
}

/** "Dhuhr", "Maghrib & Isha" — the localised name(s) of a window's prayers. */
export function windowPrayerLabel(prayers: readonly FocusLockPrayer[], t: Translate): string {
  const names = prayers.map((p) => (p === "jumuah" ? t("focusLock.jumuah") : t(`prayers.${p}`)));
  if (names.length === 0) return t("focusLock.testName");
  return names.join(t("focusLock.and"));
}

/** Native window records (ISO instants + localised shield copy). No user content leaves the app. */
export function toNativeWindows(
  windows: readonly FocusWindow[],
  t: Translate,
): NativeFocusWindow[] {
  return windows.map((w) => {
    const name = windowPrayerLabel(w.prayers, t);
    return {
      id: w.id,
      prayer: w.prayers.join(","),
      title: t("focusLock.shield.title", { prayer: name }),
      body: t("focusLock.shield.body"),
      start: w.start.toISOString(),
      end: w.end.toISOString(),
    };
  });
}

export function toNativeConfig(
  prefs: FocusLockPrefs,
  opts: { confirmNotification: boolean; theme: NativeFocusTheme },
  t: Translate,
): NativeFocusConfig {
  const emergency: string[] = [];
  for (let left = 0; left <= FOCUS_LOCK_BOUNDS.emergencyUnlocksPerDay.max; left++) {
    emergency.push(t("focusLock.shield.emergency", { count: left }));
  }
  return {
    unlockMode: prefs.unlockMode,
    emergencyPerDay: prefs.emergencyUnlocksPerDay,
    confirmNotification: opts.confirmNotification,
    confirmUrl: FOCUS_CONFIRM_URL,
    theme: opts.theme,
    labels: {
      prayed: t("focusLock.shield.prayed"),
      prayNow: t("focusLock.shield.prayNow"),
      holdHint: t("focusLock.shield.holdHint"),
      emergency,
      confirmTitle: t("focusLock.confirm.title"),
      confirmBody: t("focusLock.confirm.body"),
      ongoingTitle: t("focusLock.ongoing.title"),
      ongoingBody: t("focusLock.ongoing.body"),
      channelName: t("focusLock.ongoing.channel"),
      done: t("focusLock.shield.done"),
    },
  };
}
