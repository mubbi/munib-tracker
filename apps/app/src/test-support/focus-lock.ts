import type { FocusLockPrefs } from "@munib-tracker/shared/types";

import type { FocusDayInput } from "@/lib/focus-lock/plan";
import { DEFAULT_FOCUS_LOCK_PREFS } from "@/lib/focus-lock/prefs";

/**
 * NF-3.13 focus-lock fixtures. Times are UTC instants (`Z`) so tests don't
 * depend on the runner's timezone; the planner only does absolute arithmetic.
 */

/** Enabled prefs with every prayer + Jumu'ah (overrides merged shallowly; `start`/`schedule` deep). */
export function makeFocusPrefs(overrides: Partial<FocusLockPrefs> = {}): FocusLockPrefs {
  return {
    ...DEFAULT_FOCUS_LOCK_PREFS,
    enabled: true,
    ...overrides,
    start: { ...DEFAULT_FOCUS_LOCK_PREFS.start, ...overrides.start },
    schedule: { ...DEFAULT_FOCUS_LOCK_PREFS.schedule, ...overrides.schedule },
  };
}

const at = (date: string, hhmm: string) => new Date(`${date}T${hhmm}:00.000Z`);

/** A day with typical mid-latitude times (Fajr 05:00, sunrise 06:30, … Isha 20:30 UTC). */
export function makeFocusDay(
  date: string,
  weekday: number,
  times: Partial<Record<"fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha", string>> = {},
  iqamah?: FocusDayInput["iqamah"],
): FocusDayInput {
  const t = {
    fajr: "05:00",
    sunrise: "06:30",
    dhuhr: "12:30",
    asr: "15:45",
    maghrib: "18:50",
    isha: "20:30",
    ...times,
  };
  return {
    date,
    weekday,
    sunrise: at(date, t.sunrise),
    adhan: {
      fajr: at(date, t.fajr),
      dhuhr: at(date, t.dhuhr),
      asr: at(date, t.asr),
      maghrib: at(date, t.maghrib),
      isha: at(date, t.isha),
    },
    ...(iqamah ? { iqamah } : {}),
  };
}

export { at as focusInstant };
