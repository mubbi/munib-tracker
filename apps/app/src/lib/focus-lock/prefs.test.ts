import { FOCUS_LOCK_PRAYERS } from "@munib-tracker/shared/types";

import { makeFocusPrefs } from "@/test-support/focus-lock";

import {
  DEFAULT_FOCUS_LOCK_PREFS,
  minEmergencyUnlocks,
  patchFocusLockPrefs,
  resetWeekendDays,
  resolveFocusLockPrefs,
  toggleFocusPrayer,
  toggleQuietDate,
  toggleWeekendDay,
} from "./prefs";

describe("resolveFocusLockPrefs", () => {
  it("defaults to off with all five fard + Jumu'ah, adhan + 0, 20 min, gentle, 2 unlocks", () => {
    expect(resolveFocusLockPrefs(undefined)).toEqual(DEFAULT_FOCUS_LOCK_PREFS);
    expect(DEFAULT_FOCUS_LOCK_PREFS).toMatchObject({
      enabled: false,
      prayers: [...FOCUS_LOCK_PRAYERS],
      start: { anchor: "adhan", offsetMin: 0 },
      durationMin: 20,
      jumuahDurationMin: 60,
      unlockMode: "gentle",
      emergencyUnlocksPerDay: 2,
      pauseWhileExcused: true,
    });
  });

  it("clamps out-of-range numbers and drops unknown values", () => {
    const out = resolveFocusLockPrefs({
      enabled: true,
      prayers: ["isha", "bogus", "fajr"],
      start: { anchor: "sunset", offsetMin: 999 },
      durationMin: 2,
      jumuahDurationMin: 500,
      unlockMode: "nope",
      emergencyUnlocksPerDay: 50,
      schedule: {
        quietDates: ["2026-11-24", "bad", "2026-11-24"],
        weekdaysOnly: true,
        weekendDays: [6, 5, 5, 9, -1, 2.5, "0"],
      },
    });
    expect(out).toEqual({
      enabled: true,
      prayers: ["fajr", "isha"],
      start: { anchor: "adhan", offsetMin: 60 },
      durationMin: 5,
      jumuahDurationMin: 120,
      unlockMode: "gentle",
      emergencyUnlocksPerDay: 5,
      pauseWhileExcused: true,
      schedule: { weekdaysOnly: true, weekendDays: [5, 6], quietDates: ["2026-11-24"] },
    });
  });

  it("keeps pre-D37 / pre-D38 blobs valid (weekdaysOnly only, no Jumu'ah length)", () => {
    const legacy = {
      enabled: true,
      prayers: ["dhuhr", "jumuah"],
      start: { anchor: "adhan", offsetMin: 0 },
      durationMin: 30,
      unlockMode: "firm",
      emergencyUnlocksPerDay: 1,
      pauseWhileExcused: true,
      schedule: { weekdaysOnly: true },
    };
    const out = resolveFocusLockPrefs(legacy);
    // No explicit days ⇒ the region default applies (resolved by the caller).
    expect(out.schedule).toEqual({ weekdaysOnly: true });
    expect(out.jumuahDurationMin).toBe(60);
    expect(out.durationMin).toBe(30);
  });

  it("drops a weekend that covers every day (and non-arrays)", () => {
    expect(
      resolveFocusLockPrefs({ schedule: { weekendDays: [0, 1, 2, 3, 4, 5, 6] } }).schedule,
    ).toEqual({});
    expect(resolveFocusLockPrefs({ schedule: { weekendDays: "fri" } }).schedule).toEqual({});
    // An explicit empty choice ("no weekend") is kept.
    expect(resolveFocusLockPrefs({ schedule: { weekendDays: [] } }).schedule).toEqual({
      weekendDays: [],
    });
  });

  it("allows 0 emergency unlocks only in strict mode", () => {
    expect(minEmergencyUnlocks("strict")).toBe(0);
    expect(
      resolveFocusLockPrefs(makeFocusPrefs({ unlockMode: "strict", emergencyUnlocksPerDay: 0 })),
    ).toMatchObject({ emergencyUnlocksPerDay: 0 });
    expect(
      resolveFocusLockPrefs(makeFocusPrefs({ unlockMode: "firm", emergencyUnlocksPerDay: 0 })),
    ).toMatchObject({ emergencyUnlocksPerDay: 1 });
  });
});

describe("prefs edits", () => {
  it("re-validates on patch (strict → firm lifts 0 unlocks to 1)", () => {
    const strict = makeFocusPrefs({ unlockMode: "strict", emergencyUnlocksPerDay: 0 });
    expect(patchFocusLockPrefs(strict, { unlockMode: "firm" }).emergencyUnlocksPerDay).toBe(1);
  });

  it("toggles quiet dates and prayers", () => {
    const p = makeFocusPrefs();
    const paused = toggleQuietDate(p, "2026-11-24", true);
    expect(paused.schedule.quietDates).toEqual(["2026-11-24"]);
    expect(toggleQuietDate(paused, "2026-11-24", false).schedule.quietDates).toBeUndefined();
    expect(toggleFocusPrayer(p, "jumuah", false).prayers).not.toContain("jumuah");
    expect(toggleFocusPrayer(makeFocusPrefs({ prayers: [] }), "asr", true).prayers).toEqual([
      "asr",
    ]);
  });
});

describe("weekend days (D37)", () => {
  it("turns the shown default into an explicit choice and resets back to it", () => {
    const p = makeFocusPrefs({ schedule: { weekdaysOnly: true } });
    const gulf = toggleWeekendDay(p, [5, 6], 4, true);
    expect(gulf.schedule).toEqual({ weekdaysOnly: true, weekendDays: [4, 5, 6] });
    expect(toggleWeekendDay(gulf, [4, 5, 6], 4, false).schedule.weekendDays).toEqual([5, 6]);
    expect(resetWeekendDays(gulf).schedule).toEqual({ weekdaysOnly: true });
  });

  it("always keeps at least one working day", () => {
    const p = makeFocusPrefs({ schedule: { weekendDays: [0, 1, 2, 3, 4, 5] } });
    expect(toggleWeekendDay(p, [0, 1, 2, 3, 4, 5], 6, true)).toBe(p);
  });
});
