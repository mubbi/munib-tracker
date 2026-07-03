import { describe, expect, it } from "vitest";
import { makePrayerLog as log } from "../test-support/factories";
import { buildDailySummary, computeStreak } from "./streak";

describe.concurrent("computeStreak", () => {
  it("returns 0 with no qualifying activity", () => {
    expect(computeStreak([], true, "2026-07-03")).toBe(0);
    expect(computeStreak([log("2026-07-03", "fajr", "missed")], true, "2026-07-03")).toBe(0);
  });

  it("counts consecutive completed days ending today", () => {
    const logs = [
      log("2026-07-01", "fajr", "completed"),
      log("2026-07-02", "dhuhr", "completed"),
      log("2026-07-03", "asr", "completed"),
    ];
    expect(computeStreak(logs, true, "2026-07-03")).toBe(3);
  });

  it("resets when a day is missed", () => {
    const logs = [
      log("2026-07-01", "fajr", "completed"),
      // 2026-07-02 has no completion
      log("2026-07-03", "asr", "completed"),
    ];
    expect(computeStreak(logs, true, "2026-07-03")).toBe(1);
  });

  it("keeps yesterday's streak when today has no activity yet (grace period)", () => {
    const logs = [log("2026-07-01", "fajr", "completed"), log("2026-07-02", "dhuhr", "completed")];
    expect(computeStreak(logs, true, "2026-07-03")).toBe(2);
  });

  it("counts qaza performed as an active day", () => {
    const logs = [log("2026-07-03", "fajr", "qaza")];
    expect(computeStreak(logs, true, "2026-07-03")).toBe(1);
  });

  it("ignores sunnah prayers when obligatoryOnly is true", () => {
    const logs = [log("2026-07-03", "duha", "completed")];
    expect(computeStreak(logs, true, "2026-07-03")).toBe(0);
    expect(computeStreak(logs, false, "2026-07-03")).toBe(1);
  });
});

describe.concurrent("buildDailySummary", () => {
  it("aggregates prayers, zikr, and qaza for a date", () => {
    const summary = buildDailySummary({
      date: "2026-07-03",
      prayerLogs: [
        log("2026-07-03", "fajr", "completed"),
        log("2026-07-03", "dhuhr", "completed"),
        log("2026-07-03", "asr", "qaza"),
        log("2026-07-02", "isha", "completed"), // other day, excluded
      ],
      zikrProgress: [
        {
          id: "z1",
          zikrId: "morning-1",
          date: "2026-07-03",
          count: 33,
          target: 33,
          completed: true,
        },
        {
          id: "z2",
          zikrId: "evening-1",
          date: "2026-07-03",
          count: 5,
          target: 33,
          completed: false,
        },
      ],
      qazaCounters: [
        { prayerId: "fajr", remaining: 10, completed: 2 },
        { prayerId: "dhuhr", remaining: 5, completed: 0 },
      ],
      streakDays: 4,
    });

    expect(summary.salahCompleted).toBe(2);
    expect(summary.salahTotal).toBe(6);
    expect(summary.qazaCompletedToday).toBe(1);
    expect(summary.zikrCompleted).toBe(1);
    expect(summary.zikrTotal).toBe(2);
    expect(summary.qazaRemaining).toBe(15);
    expect(summary.streakDays).toBe(4);
  });
});
