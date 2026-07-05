import { describe, expect, it } from "vitest";
import { makePrayerLog as log } from "../test-support/factories";
import {
  buildDailySummary,
  computePrayerStreak,
  computeStreak,
  longestPrayerStreak,
} from "./streak";

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

  it("freezes the streak across excused (hayd/sick/travel) days (NF-1.2)", () => {
    // Completed on the 1st, excused on the 2nd, completed on the 3rd — the excused
    // day is transparent, so the streak is 2 (not reset by the gap) and counts the
    // two active days.
    const logs = [
      log("2026-07-01", "fajr", "completed"),
      log("2026-07-02", "fajr", "pending", { isExcused: true, excusedReason: "hayd" }),
      log("2026-07-03", "fajr", "completed"),
    ];
    expect(computeStreak(logs, true, "2026-07-03")).toBe(2);
  });

  it("does not count an excused day itself toward the streak", () => {
    const logs = [log("2026-07-03", "fajr", "pending", { isExcused: true })];
    expect(computeStreak(logs, true, "2026-07-03")).toBe(0);
  });
});

describe.concurrent("computePrayerStreak (NF-2.13)", () => {
  it("returns 0 when the prayer was never completed", () => {
    expect(computePrayerStreak([], "tahajjud", "2026-07-03")).toBe(0);
    expect(
      computePrayerStreak([log("2026-07-03", "tahajjud", "pending")], "tahajjud", "2026-07-03"),
    ).toBe(0);
  });

  it("counts consecutive nights the prayer was kept, ending today", () => {
    const logs = [
      log("2026-07-01", "tahajjud", "completed"),
      log("2026-07-02", "tahajjud", "completed"),
      log("2026-07-03", "tahajjud", "completed"),
      log("2026-07-03", "fajr", "completed"), // other prayer, ignored
    ];
    expect(computePrayerStreak(logs, "tahajjud", "2026-07-03")).toBe(3);
  });

  it("gives today grace when tonight is not logged yet", () => {
    const logs = [
      log("2026-07-01", "tahajjud", "completed"),
      log("2026-07-02", "tahajjud", "completed"),
    ];
    expect(computePrayerStreak(logs, "tahajjud", "2026-07-03")).toBe(2);
  });

  it("does not pass through excused days for a voluntary prayer", () => {
    const logs = [
      log("2026-07-01", "tahajjud", "completed"),
      log("2026-07-02", "tahajjud", "pending", { isExcused: true }),
      log("2026-07-03", "tahajjud", "completed"),
    ];
    // The gap on the 2nd ends the run, so only the 3rd counts.
    expect(computePrayerStreak(logs, "tahajjud", "2026-07-03")).toBe(1);
  });

  it("finds the longest run across history", () => {
    const logs = [
      log("2026-07-01", "tahajjud", "completed"),
      log("2026-07-02", "tahajjud", "completed"),
      log("2026-07-03", "tahajjud", "completed"),
      // gap on the 4th
      log("2026-07-05", "tahajjud", "completed"),
      log("2026-07-06", "tahajjud", "completed"),
    ];
    expect(longestPrayerStreak(logs, "tahajjud")).toBe(3);
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
      qazaSchedule: { targets: { fajr: 2, dhuhr: 1 } },
      qazaDailyProgress: { date: "2026-07-03", completed: { asr: 1 } },
      streakDays: 4,
    });

    expect(summary.salahCompleted).toBe(2);
    expect(summary.salahTotal).toBe(5);
    expect(summary.qazaCompletedToday).toBe(1);
    expect(summary.qazaTargetToday).toBe(3);
    expect(summary.zikrCompleted).toBe(1);
    expect(summary.zikrTotal).toBe(2);
    expect(summary.qazaRemaining).toBe(15);
    expect(summary.streakDays).toBe(4);
  });
});
