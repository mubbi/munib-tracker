import { OBLIGATORY_PRAYERS } from "@munib-tracker/shared/constants";
import type {
  FocusLockPrefs,
  ObligatoryPrayer,
  UserPreferences,
} from "@munib-tracker/shared/types";
import { getLocalDateString } from "@munib-tracker/shared/utils";

import i18n from "@/i18n";
import type { StoredLocation } from "@/lib/location";
import { iqamahFor } from "@/lib/masjid/home-masjid";
import { focusLockStore } from "@/stores/focus-lock-store";
import { locationStore } from "@/stores/location-store";
import { preferencesStore } from "@/stores/preferences-store";
import { trackerStore } from "@/stores/tracker-store";

import { buildFocusDays, hasIqamahTimes, type IqamahLookup } from "./inputs";
import * as native from "./native";
import { asTranslate, type Translate, toNativeConfig, toNativeWindows } from "./payload";
import {
  activeWindowAt,
  type FocusDayInput,
  type FocusWindow,
  fardFor,
  planFocusWindows,
} from "./plan";
import { resolveFocusLockPrefs } from "./prefs";
import { emergencyLeftToday } from "./state";
import { effectiveWeekendDays, weekendRegionFor } from "./weekend";

/**
 * Glue between the stores and the pure planner / native module. The planner
 * itself is pure (`plan.ts`); this file only reads the current store state and
 * pushes the result to the native schedulers.
 */

export interface FocusPlanSnapshot {
  prefs: FocusLockPrefs;
  windows: FocusWindow[];
  days: FocusDayInput[];
  /** The home masjid has iqamah times, so the iqamah anchor may be offered. */
  iqamahAvailable: boolean;
}

/** Iqamah lookup from the NF-3.11 masjid layer; any failure ⇒ adhan fallback. */
const homeIqamah: IqamahLookup = (date, prayer) => {
  try {
    return iqamahFor(date, prayer);
  } catch {
    return null;
  }
};

export function completedFromStatus(
  date: string,
  status: Record<string, string>,
): Record<string, Partial<Record<ObligatoryPrayer, boolean>>> {
  const day: Partial<Record<ObligatoryPrayer, boolean>> = {};
  for (const p of OBLIGATORY_PRAYERS) if (status[p] === "completed") day[p] = true;
  return { [date]: day };
}

export function computeFocusPlan(
  input: {
    prefs: UserPreferences;
    location: StoredLocation;
    trackerDate: string;
    prayerStatus: Record<string, string>;
    endedIds: readonly string[];
    iqamah?: IqamahLookup | null;
  },
  now: Date = new Date(),
): FocusPlanSnapshot {
  const prefs = resolveFocusLockPrefs(input.prefs.focusLock);
  const days = buildFocusDays(input.location, now, input.iqamah ?? null);
  const windows = planFocusWindows({
    prefs,
    days,
    now,
    completed: completedFromStatus(input.trackerDate, input.prayerStatus),
    excused: Boolean(input.prefs.activeExcusedReason),
    reminderOffsets: input.prefs.prayerReminderOffsets,
    endedIds: input.endedIds,
    weekendDays: effectiveWeekendDays(prefs.schedule, weekendRegionFor(input.location)),
  });
  return { prefs, windows, days, iqamahAvailable: hasIqamahTimes(days) };
}

/** The plan from the live stores. */
export function currentFocusPlan(now: Date = new Date()): FocusPlanSnapshot {
  const tracker = trackerStore.getState();
  return computeFocusPlan(
    {
      prefs: preferencesStore.getState().prefs,
      location: locationStore.getState().location,
      trackerDate: tracker.date,
      prayerStatus: tracker.prayerStatus,
      endedIds: focusLockStore.getState().endedIds,
      iqamah: homeIqamah,
    },
    now,
  );
}

/**
 * Re-plans and hands the windows to the native scheduler (hard block only).
 * Called on foreground, prefs / location / tracker changes and day rollover.
 * Clears the native plan when the feature is off or setup isn't finished.
 */
export async function syncNativePlan(
  theme: native.NativeFocusTheme,
  extraWindows: readonly FocusWindow[] = [],
): Promise<FocusPlanSnapshot> {
  const snapshot = currentFocusPlan();
  if (native.focusLockCapability() !== "hard") return snapshot;
  const device = focusLockStore.getState();
  const prefs = preferencesStore.getState().prefs;
  const armed = snapshot.prefs.enabled && device.setupDone ? snapshot.windows : [];
  const t: Translate = asTranslate(i18n.t.bind(i18n));
  await native.setPlan(
    toNativeWindows([...extraWindows, ...armed], t),
    toNativeConfig(
      snapshot.prefs,
      { confirmNotification: prefs.notificationPrefs.focusLock !== false, theme },
      t,
    ),
  );
  return snapshot;
}

/**
 * Marking a salah completed anywhere (app, widget, Siri, Watch → tracker store)
 * ends the window holding it. Returns the ended window id, if any.
 */
export async function endWindowIfPrayed(
  snapshotBefore: readonly FocusWindow[],
): Promise<string | null> {
  const active = activeWindowAt(snapshotBefore, new Date());
  if (!active) return null;
  const status = trackerStore.getState().prayerStatus;
  const isPrayed = (p: FocusWindow["prayers"][number]) => status[fardFor(p)] === "completed";
  if (!active.prayers.some(isPrayed)) return null;
  // Only a fully prayed window is recorded as ended. Marking Maghrib in a merged
  // `maghrib+isha` window ends it now, but the re-plan must still lock for Isha
  // (an ended merged id also covers its parts — see `planFocusWindows`).
  if (active.prayers.every(isPrayed)) await focusLockStore.getState().markEnded(active.id);
  await native.endWindowNow(active.id);
  return active.id;
}

/** Pulls unlocks taken natively into the local log + ended ids. */
export async function drainNativeStatus(): Promise<native.NativeFocusStatus> {
  const s = await native.status();
  const store = focusLockStore.getState();
  if (s.emergencyUnlocks?.length) await store.recordEmergency(s.emergencyUnlocks);
  for (const id of s.endedIds ?? []) await store.markEnded(id);
  return s;
}

export function emergencyLeftNow(prefs: FocusLockPrefs, now: Date = new Date()): number {
  return emergencyLeftToday(
    focusLockStore.getState().emergencyLog,
    prefs.emergencyUnlocksPerDay,
    getLocalDateString(now),
  );
}
