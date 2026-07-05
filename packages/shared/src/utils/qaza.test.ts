import { describe, expect, it } from "vitest";
import {
  breakDownDayDuration,
  buildUniformQazaTargets,
  classifyQazaSustainability,
  computeLifetimeMissedPrayers,
  computeMissedFasts,
  computeQazaEta,
  estimateQazaDailyMinutes,
  matchQazaPlanPreset,
  suggestDailyQazaTargets,
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

describe.concurrent("suggestDailyQazaTargets", () => {
  it("spreads each prayer's debt over the horizon and omits zero-debt prayers", () => {
    const targets = suggestDailyQazaTargets(
      [
        { prayerId: "fajr", remaining: 100 },
        { prayerId: "dhuhr", remaining: 50 },
        { prayerId: "asr", remaining: 0 },
      ],
      30,
    );
    expect(targets.fajr).toBe(4); // ceil(100/30)
    expect(targets.dhuhr).toBe(2); // ceil(50/30)
    expect(targets.asr).toBeUndefined();
  });

  it("clamps the horizon to at least one day", () => {
    expect(suggestDailyQazaTargets([{ prayerId: "isha", remaining: 7 }], 0).isha).toBe(7);
  });
});

describe.concurrent("buildUniformQazaTargets", () => {
  it("applies the same per-prayer target only where debt remains", () => {
    expect(
      buildUniformQazaTargets(
        [
          { prayerId: "fajr", remaining: 100 },
          { prayerId: "asr", remaining: 0 },
        ],
        3,
      ),
    ).toEqual({ fajr: 3 });
  });
});

describe.concurrent("classifyQazaSustainability", () => {
  it("maps daily totals to sustainability tiers", () => {
    expect(classifyQazaSustainability(0)).toBeNull();
    expect(classifyQazaSustainability(6)).toBe("easy");
    expect(classifyQazaSustainability(18)).toBe("moderate");
    expect(classifyQazaSustainability(36)).toBe("challenging");
    expect(classifyQazaSustainability(90)).toBe("intensive");
  });
});

describe.concurrent("estimateQazaDailyMinutes", () => {
  it("estimates minutes from the daily total", () => {
    expect(estimateQazaDailyMinutes(30)).toBe(75);
    expect(estimateQazaDailyMinutes(0)).toBe(0);
  });
});

describe.concurrent("matchQazaPlanPreset", () => {
  it("matches uniform presets and falls back to custom", () => {
    const counters = [
      { prayerId: "fajr" as const, remaining: 10 },
      { prayerId: "dhuhr" as const, remaining: 5 },
    ];
    expect(matchQazaPlanPreset({ fajr: 3, dhuhr: 3 }, counters)).toBe("balanced");
    expect(matchQazaPlanPreset({ fajr: 3, dhuhr: 5 }, counters)).toBe("custom");
    expect(matchQazaPlanPreset({}, counters)).toBe("custom");
  });
});
