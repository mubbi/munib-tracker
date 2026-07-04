import { describe, expect, it } from "vitest";
import {
  breakDownDayDuration,
  computeLifetimeMissedPrayers,
  computeMissedFasts,
  computeQazaEta,
  sumQazaDailyProgress,
  sumQazaScheduleTargets,
} from "./qaza";

describe.concurrent("computeLifetimeMissedPrayers", () => {
  it("multiplies missed years by the lunar year length", () => {
    const result = computeLifetimeMissedPrayers({
      currentAge: 30,
      pubertyAge: 15,
      yearsPrayedConsistently: 5,
    });
    expect(result.missedYears).toBe(10);
    expect(result.missedDays).toBe(3540); // 10 * 354
    expect(result.byPrayer.fajr).toBe(3540);
    expect(result.byPrayer.witr).toBe(3540);
  });

  it("supports the solar year", () => {
    const result = computeLifetimeMissedPrayers({
      currentAge: 25,
      pubertyAge: 15,
      yearsPrayedConsistently: 0,
      useLunarYear: false,
    });
    expect(result.missedDays).toBe(3650); // 10 * 365
  });

  it("subtracts annual exempt days", () => {
    const result = computeLifetimeMissedPrayers({
      currentAge: 25,
      pubertyAge: 15,
      yearsPrayedConsistently: 0,
      annualExemptDays: 54, // ~ menstruation days/year
    });
    expect(result.missedDays).toBe(3000); // 10*354 - 54*10
  });

  it("never returns negative counts", () => {
    const result = computeLifetimeMissedPrayers({
      currentAge: 20,
      pubertyAge: 15,
      yearsPrayedConsistently: 10,
    });
    expect(result.missedYears).toBe(0);
    expect(result.missedDays).toBe(0);
  });
});

describe.concurrent("breakDownDayDuration", () => {
  it("splits days into years, months, and days", () => {
    expect(breakDownDayDuration(7007)).toEqual({ years: 19, months: 2, days: 12 });
    expect(breakDownDayDuration(45)).toEqual({ years: 0, months: 1, days: 15 });
    expect(breakDownDayDuration(12)).toEqual({ years: 0, months: 0, days: 12 });
    expect(breakDownDayDuration(400)).toEqual({ years: 1, months: 1, days: 5 });
  });
});

describe.concurrent("computeQazaEta", () => {
  it("computes days and completion date", () => {
    const eta = computeQazaEta(100, 10, "2026-07-03");
    expect(eta?.days).toBe(10);
    expect(eta?.date).toBe("2026-07-13");
  });

  it("returns null for a non-positive daily target", () => {
    expect(computeQazaEta(100, 0)).toBeNull();
    expect(computeQazaEta(0, 5)).toBeNull();
  });
});

describe.concurrent("sumQazaScheduleTargets", () => {
  it("sums per-prayer targets", () => {
    expect(sumQazaScheduleTargets({ targets: { fajr: 2, dhuhr: 1 } })).toBe(3);
    expect(sumQazaScheduleTargets({ targets: {} })).toBe(0);
  });
});

describe.concurrent("sumQazaDailyProgress", () => {
  it("sums per-prayer completions for a day", () => {
    expect(sumQazaDailyProgress({ date: "2026-07-03", completed: { fajr: 2, asr: 1 } })).toBe(3);
  });
});

describe.concurrent("computeMissedFasts", () => {
  it("estimates from whole years", () => {
    expect(computeMissedFasts(3)).toBe(90);
    expect(computeMissedFasts(2, 29)).toBe(58);
  });
});
