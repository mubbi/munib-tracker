import type { MadhhabId } from "@munib-tracker/shared/fiqh";
import { rescheduleReminders } from "@/lib/notifications/reschedule";
import type { MadhabKey } from "@/lib/prayer-times";
import { locationStore } from "@/stores/location-store";
import { preferencesStore } from "@/stores/preferences-store";

/**
 * NF-3.0a — the ONE way to set "My madhhab" (onboarding step, home card, lazy
 * sheet and Settings › Fiqh & madhhab all call this). It only changes the
 * preference: no logged data is touched, and the Asr calculation is never
 * changed automatically — the caller offers it (plan §4.1.1).
 */

/** A school choice, or `null` = "Show all views". */
export type MadhhabChoice = MadhhabId | null;

/** The Asr `MadhabKey` a school uses by default: Hanafi → `hanafi`, the others → `shafi`. */
export function asrKeyForMadhhab(school: MadhhabId): MadhabKey {
  return school === "hanafi" ? "hanafi" : "shafi";
}

/** The Asr key to offer after picking `choice`, or `null` when it already matches (or all views). */
export function asrOfferFor(choice: MadhhabChoice, currentAsr: MadhabKey): MadhabKey | null {
  if (choice == null) return null;
  const target = asrKeyForMadhhab(choice);
  return target === currentAsr ? null : target;
}

/** True when a chosen school's default Asr differs from the device's Asr setting (neutral hint). */
export function hasAsrMismatch(
  school: MadhhabId | null | undefined,
  currentAsr: MadhabKey,
): school is MadhhabId {
  return school != null && asrKeyForMadhhab(school) !== currentAsr;
}

export interface SetMadhhabResult {
  /** The preference actually changed (false when re-picking the same value). */
  changed: boolean;
  /** Asr calculation to offer ("Also use … Asr time?"), or `null`. */
  asrOffer: MadhabKey | null;
}

async function rescheduleQuietly(): Promise<void> {
  try {
    await rescheduleReminders();
  } catch {
    // Scheduling is best-effort (web / TV no-op); the preference is already saved.
  }
}

/**
 * Saves the global school. Reminders are rebuilt because preferred-time
 * reminder offsets may follow the school (plan §4.1.5 item 5).
 */
export async function setMadhhab(choice: MadhhabChoice): Promise<SetMadhhabResult> {
  const before = preferencesStore.getState().prefs.madhhab;
  const changed = before !== choice;
  if (changed) {
    await preferencesStore.getState().update({ madhhab: choice });
    await rescheduleQuietly();
  }
  return { changed, asrOffer: asrOfferFor(choice, locationStore.getState().location.madhab) };
}

/** The user accepted the Asr offer: switch the calculation and rebuild reminders. */
export async function acceptAsrOffer(key: MadhabKey): Promise<void> {
  await locationStore.getState().setMadhab(key);
  await rescheduleQuietly();
}

/**
 * The user dismissed a "choose your madhhab" prompt without choosing: record
 * "Show all views" so the prompt never returns. No-op once a choice exists.
 */
export async function dismissMadhhabPrompt(): Promise<void> {
  if (preferencesStore.getState().prefs.madhhab !== undefined) return;
  await preferencesStore.getState().update({ madhhab: null });
}
