import { focusInstant as at } from "@/test-support/focus-lock";

import { testWindow } from "./plan";
import {
  canUnlock,
  emergencyCountLastWeek,
  emergencyLeftToday,
  IDLE_SESSION,
  mergeEmergencyLog,
  reduceFocusSession,
} from "./state";

describe("canUnlock", () => {
  it.each([
    ["gentle", "holdPrayNow", 0, true],
    ["firm", "holdPrayNow", 2, false],
    ["strict", "holdPrayNow", 2, false],
    ["gentle", "markedPrayed", 0, true],
    ["firm", "markedPrayed", 0, true],
    ["strict", "markedPrayed", 0, true],
    ["strict", "emergency", 1, true],
    ["firm", "emergency", 0, false],
  ] as const)("%s + %s (left %i) → %s", (mode, action, left, expected) => {
    expect(canUnlock(mode, action, left)).toBe(expected);
  });
});

describe("reduceFocusSession", () => {
  const w = testWindow(at("2026-11-26", "12:30"), 20);

  it("locks when a window starts and goes idle when it ends", () => {
    const locked = reduceFocusSession(IDLE_SESSION, { type: "tick", active: w });
    expect(locked).toEqual({ phase: "locked", windowId: w.id, endsAt: w.end.getTime() });
    expect(reduceFocusSession(locked, { type: "tick", active: null })).toBe(IDLE_SESSION);
  });

  it("unlocks only when the mode allows it, and stays unlocked for that window", () => {
    const locked = reduceFocusSession(IDLE_SESSION, { type: "tick", active: w });
    const denied = reduceFocusSession(locked, {
      type: "unlock",
      action: "holdPrayNow",
      mode: "firm",
      emergencyLeft: 2,
    });
    expect(denied).toBe(locked);
    const unlocked = reduceFocusSession(locked, {
      type: "unlock",
      action: "emergency",
      mode: "firm",
      emergencyLeft: 1,
    });
    expect(unlocked).toMatchObject({ phase: "unlocked", reason: "emergency" });
    expect(reduceFocusSession(unlocked, { type: "tick", active: w })).toBe(unlocked);
  });

  it("follows a re-plan that moved the running window's end", () => {
    const locked = reduceFocusSession(IDLE_SESSION, { type: "tick", active: w });
    const longer = { ...w, end: new Date(w.end.getTime() + 60_000) };
    expect(reduceFocusSession(locked, { type: "tick", active: longer })).toMatchObject({
      phase: "locked",
      endsAt: longer.end.getTime(),
    });
  });
});

describe("emergency log", () => {
  const now = at("2026-11-26", "12:00");

  it("counts per local day and over the last week (neutral count)", () => {
    const log = [now.toISOString(), new Date(now.getTime() - 3 * 86_400_000).toISOString()];
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    expect(emergencyLeftToday(log, 2, today)).toBe(1);
    expect(emergencyLeftToday([...log, now.toISOString()], 1, today)).toBe(0);
    expect(emergencyCountLastWeek(log, now)).toBe(2);
  });

  it("merges native times: dedupes, sorts and keeps 35 days", () => {
    const old = new Date(now.getTime() - 40 * 86_400_000).toISOString();
    const a = new Date(now.getTime() - 1000).toISOString();
    expect(mergeEmergencyLog([now.toISOString(), old], [a, now.toISOString()], now)).toEqual([
      a,
      now.toISOString(),
    ]);
  });
});
