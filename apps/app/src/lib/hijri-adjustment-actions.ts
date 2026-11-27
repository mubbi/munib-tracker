import type { HijriAdjustment, HijriOffsetDays } from "@munib-tracker/shared/types";

import { getHijriObserver, hijriBaseCalendar } from "@/lib/hijri";
import {
  type HijriAdjustmentMeta,
  hijriBasisFingerprint,
  withHijriBasis,
  withHijriMonthStart,
  withHijriOffset,
  withoutHijriMonthStarts,
} from "@/lib/hijri-adjustment";
import { rescheduleReminders } from "@/lib/notifications/reschedule";
import { locationStore } from "@/stores/location-store";
import { preferencesStore } from "@/stores/preferences-store";

/**
 * Writes for the Hijri date adjustment (D14). Every write goes through the
 * preferences store (synced blob) and then reschedules reminders — white days,
 * Ramadan, Friday and seasonal schedules are Hijri-derived. Widgets and live
 * surfaces refresh through `useWidgetSnapshotSync`, which depends on
 * `prefs.hijriAdjustment`.
 *
 * Settings registry (NF-3.0b) wiring: `sideEffects: ["reschedule-reminders"]`.
 */

/** Fingerprint of the method/location the current dates are predicted for. */
export function currentHijriBasis(): string {
  return hijriBasisFingerprint(getHijriObserver());
}

/** Display name of the current place, for "made for <place>". */
export function currentHijriBasisPlace(): string | undefined {
  const location = locationStore.getState().location;
  return location.city ?? location.label ?? undefined;
}

function currentMeta(): HijriAdjustmentMeta {
  return {
    basis: currentHijriBasis(),
    basisPlace: currentHijriBasisPlace(),
    updatedAt: new Date().toISOString(),
  };
}

function currentAdjustment(): HijriAdjustment | undefined {
  return preferencesStore.getState().prefs.hijriAdjustment;
}

/**
 * Persists the adjustment. A neutral value is stored explicitly (offset 0, no
 * corrections) instead of being deleted, so clearing syncs to other devices —
 * the remote merge spreads pulled fields over local ones.
 */
export async function saveHijriAdjustment(next: HijriAdjustment | undefined): Promise<void> {
  const value: HijriAdjustment = next ?? { offsetDays: 0, updatedAt: new Date().toISOString() };
  await preferencesStore.getState().update({ hijriAdjustment: value });
  try {
    await rescheduleReminders();
  } catch {
    // Reminders resync on next foreground; the date change itself is saved.
  }
}

export function setHijriOffsetDays(offsetDays: HijriOffsetDays): Promise<void> {
  return saveHijriAdjustment(withHijriOffset(currentAdjustment(), offsetDays, currentMeta()));
}

/** "This month started on `date`" — `null` clears this month's correction. */
export function setHijriMonthStart(
  year: number,
  month: number,
  date: string | null,
): Promise<void> {
  return saveHijriAdjustment(
    withHijriMonthStart(hijriBaseCalendar(), currentAdjustment(), year, month, date, currentMeta()),
  );
}

/** Clears every per-month correction (the offset stays). */
export function clearHijriMonthStarts(): Promise<void> {
  return saveHijriAdjustment(withoutHijriMonthStarts(currentAdjustment(), currentMeta()));
}

/** "Keep" on the moved-location card: corrections now belong to the current place. */
export function keepHijriCorrectionsForCurrentPlace(): Promise<void> {
  return saveHijriAdjustment(withHijriBasis(currentAdjustment(), currentMeta()));
}
