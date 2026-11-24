import {
  FOCUS_LOCK_PRAYERS,
  FOCUS_LOCK_UNLOCK_MODES,
  type FocusLockPrayer,
  type FocusLockPrefs,
  type FocusLockUnlockMode,
} from "@munib-tracker/shared/types";

import { sanitizeWeekendDays } from "./weekend";

/**
 * NF-3.13 focus-lock preference defaults and bounds. `resolveFocusLockPrefs`
 * is the single reader: every caller (planner, settings, native payload) sees
 * a clamped, valid object no matter what an older client or a sync merge wrote.
 */
export const FOCUS_LOCK_BOUNDS = {
  durationMin: { min: 5, max: 60, step: 5 },
  /** Jumu'ah window (D38): khutbah + Salah need longer than the daily window. */
  jumuahDurationMin: { min: 5, max: 120, step: 5 },
  /** Minutes relative to the anchor (negative = before the adhan/iqamah). */
  offsetMin: { min: -15, max: 60, step: 5 },
  emergencyUnlocksPerDay: { min: 0, max: 5 },
  /** Most quiet dates kept (older ones are dropped first). */
  quietDates: 60,
} as const;

/**
 * Length of the hold on "I'll pray now" before a gentle unlock (plan: 10 s) —
 * Android overlay and in-app prompt. The iOS shield has no press-and-hold, so
 * there one tap lifts it (D39).
 */
export const GENTLE_HOLD_MS = 10_000;

export const DEFAULT_FOCUS_LOCK_PREFS: FocusLockPrefs = {
  enabled: false,
  prayers: [...FOCUS_LOCK_PRAYERS],
  start: { anchor: "adhan", offsetMin: 0 },
  durationMin: 20,
  jumuahDurationMin: 60,
  unlockMode: "gentle",
  emergencyUnlocksPerDay: 2,
  pauseWhileExcused: true,
  schedule: {},
};

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function clampInt(value: unknown, min: number, max: number, fallback: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.round(value)));
}

/** Smallest emergency allowance a mode permits: 0 only in `strict` (plan). */
export function minEmergencyUnlocks(mode: FocusLockUnlockMode): number {
  return mode === "strict" ? 0 : 1;
}

/** Valid, clamped prefs from whatever is stored (unset ⇒ defaults, feature off). */
export function resolveFocusLockPrefs(raw: unknown): FocusLockPrefs {
  if (!raw || typeof raw !== "object") return DEFAULT_FOCUS_LOCK_PREFS;
  const v = raw as Partial<FocusLockPrefs>;
  const d = DEFAULT_FOCUS_LOCK_PREFS;

  const prayers = Array.isArray(v.prayers)
    ? FOCUS_LOCK_PRAYERS.filter((p) => (v.prayers as unknown[]).includes(p))
    : d.prayers;
  const unlockMode = FOCUS_LOCK_UNLOCK_MODES.includes(v.unlockMode as FocusLockUnlockMode)
    ? (v.unlockMode as FocusLockUnlockMode)
    : d.unlockMode;
  const anchor = v.start?.anchor === "iqamah" ? "iqamah" : "adhan";
  const { durationMin, jumuahDurationMin, offsetMin, emergencyUnlocksPerDay } = FOCUS_LOCK_BOUNDS;

  const quiet = Array.isArray(v.schedule?.quietDates)
    ? [...new Set(v.schedule.quietDates.filter((s) => typeof s === "string" && DATE_RE.test(s)))]
        .sort()
        .slice(-FOCUS_LOCK_BOUNDS.quietDates)
    : [];

  const weekendDays = sanitizeWeekendDays(v.schedule?.weekendDays);

  return {
    enabled: v.enabled === true,
    prayers,
    start: {
      anchor,
      offsetMin: clampInt(v.start?.offsetMin, offsetMin.min, offsetMin.max, d.start.offsetMin),
    },
    durationMin: clampInt(v.durationMin, durationMin.min, durationMin.max, d.durationMin),
    jumuahDurationMin: clampInt(
      v.jumuahDurationMin,
      jumuahDurationMin.min,
      jumuahDurationMin.max,
      d.jumuahDurationMin,
    ),
    unlockMode,
    emergencyUnlocksPerDay: clampInt(
      v.emergencyUnlocksPerDay,
      minEmergencyUnlocks(unlockMode),
      emergencyUnlocksPerDay.max,
      d.emergencyUnlocksPerDay,
    ),
    pauseWhileExcused: v.pauseWhileExcused !== false,
    schedule: {
      // Pre-D37 blobs carry only `weekdaysOnly`; they stay valid and now skip the region's weekend.
      ...(v.schedule?.weekdaysOnly === true ? { weekdaysOnly: true } : {}),
      ...(weekendDays ? { weekendDays } : {}),
      ...(quiet.length > 0 ? { quietDates: quiet } : {}),
    },
  };
}

/** Applies a partial edit and re-validates (e.g. switching to `firm` lifts 0 emergency unlocks to 1). */
export function patchFocusLockPrefs(
  current: FocusLockPrefs,
  patch: Partial<FocusLockPrefs>,
): FocusLockPrefs {
  return resolveFocusLockPrefs({
    ...current,
    ...patch,
    start: { ...current.start, ...patch.start },
    schedule: { ...current.schedule, ...patch.schedule },
  });
}

/** Adds or removes `date` from the quiet dates ("Pause today"). */
export function toggleQuietDate(
  prefs: FocusLockPrefs,
  date: string,
  quiet: boolean,
): FocusLockPrefs {
  const set = new Set(prefs.schedule.quietDates ?? []);
  if (quiet) set.add(date);
  else set.delete(date);
  return patchFocusLockPrefs(prefs, { schedule: { ...prefs.schedule, quietDates: [...set] } });
}

export function toggleFocusPrayer(
  prefs: FocusLockPrefs,
  prayer: FocusLockPrayer,
  on: boolean,
): FocusLockPrefs {
  const set = new Set(prefs.prayers);
  if (on) set.add(prayer);
  else set.delete(prayer);
  return patchFocusLockPrefs(prefs, { prayers: [...set] });
}

/**
 * Adds or removes a weekend day (D37). `current` is what the user sees (their
 * choice or the region default); the result is always an explicit choice.
 * At least one working day is kept.
 */
export function toggleWeekendDay(
  prefs: FocusLockPrefs,
  current: readonly number[],
  day: number,
  on: boolean,
): FocusLockPrefs {
  const set = new Set(current);
  if (on) set.add(day);
  else set.delete(day);
  if (set.size >= 7) return prefs;
  return patchFocusLockPrefs(prefs, {
    schedule: { ...prefs.schedule, weekendDays: [...set] },
  });
}

/** Drops the explicit weekend days so the region default applies again. */
export function resetWeekendDays(prefs: FocusLockPrefs): FocusLockPrefs {
  const { weekendDays: _drop, ...schedule } = prefs.schedule;
  return resolveFocusLockPrefs({ ...prefs, schedule });
}
