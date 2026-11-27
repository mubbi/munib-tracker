import type { ObligatoryPrayer } from "./prayer";

/**
 * NF-3.13 Salah focus lock (D4, D17). Chosen apps are blocked during a
 * user-configured window around each salah until the user prays or the window
 * ends. These preferences are account-synced; the app selection itself is
 * **device-local** (iOS tokens are opaque and device-bound) and never syncs.
 */

/** A window the user can opt into: the five fard plus Jumu'ah (replaces Dhuhr on Fridays). */
export type FocusLockPrayer = ObligatoryPrayer | "jumuah";

export const FOCUS_LOCK_PRAYERS: readonly FocusLockPrayer[] = [
  "fajr",
  "dhuhr",
  "asr",
  "maghrib",
  "isha",
  "jumuah",
];

/**
 * - `gentle`: "I'll pray now" unlocks — after a 10 s hold on Android and in the
 *   in-app prompt; on iOS the shield has no press-and-hold, so one tap lifts it (D39).
 * - `firm`: unlocks only when the salah is marked completed in the app.
 * - `strict`: fixed until the window ends (marking the salah prayed ends it early).
 */
export type FocusLockUnlockMode = "gentle" | "firm" | "strict";

export const FOCUS_LOCK_UNLOCK_MODES: readonly FocusLockUnlockMode[] = ["gentle", "firm", "strict"];

export type FocusLockAnchor = "adhan" | "iqamah";

export interface FocusLockPrefs {
  enabled: boolean;
  /** Default: all five fard + Jumu'ah. */
  prayers: FocusLockPrayer[];
  /**
   * Window start. `iqamah` is offered only when the home masjid has iqamah times
   * (private or public, NF-3.11); without them the adhan is used.
   */
  start: { anchor: FocusLockAnchor; offsetMin: number };
  /** Window length in minutes (5–60, default 20). */
  durationMin: number;
  /**
   * Jumu'ah window length in minutes (D38; 5–120, default 60), measured from the
   * masjid's Jumu'ah time when known, else the Dhuhr adhan. Fridays only.
   */
  jumuahDurationMin: number;
  unlockMode: FocusLockUnlockMode;
  /** Emergency unlocks per local day (default 2); 0 is allowed only in `strict`. */
  emergencyUnlocksPerDay: number;
  /** Pause every window while an excused period (hayd/nifas/sick/travel) is active. */
  pauseWhileExcused: boolean;
  schedule: {
    /** Skip the user's weekend days ({@link weekendDays}) (D37). */
    weekdaysOnly?: boolean;
    /**
     * The days `weekdaysOnly` skips, 0 = Sunday … 6 = Saturday (D37). Unset ⇒
     * the default for the user's region (e.g. Friday + Saturday in Saudi Arabia,
     * Saturday + Sunday elsewhere), resolved on the device from the location.
     */
    weekendDays?: number[];
    /** Local dates (`YYYY-MM-DD`) with no windows at all. */
    quietDates?: string[];
  };
}
