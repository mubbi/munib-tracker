import { describe, expect, it } from "vitest";
import { makePrayerLog as log } from "../test-support/factories";
import {
  aggregateByDate,
  buildDayActivity,
  countPerfectDays,
  dailyCompletionSeries,
  sumPrayerTotals,
} from "./history";

describe.concurrent("buildDayActivity", () => {
  it("counts obligatory statuses for a date", () => {
    const logs = [
      log("2026-07-03", "fajr", "completed"),
      log("2026-07-03", "dhuhr", "completed"),
      log("2026-07-03", "asr", "missed"),
      log("2026-07-03", "isha", "qaza"),
      log("2026-07-03", "duha", "completed"), // sunnah, ignored
      log("2026-07-02", "fajr", "completed"), // other day
    ];
    const activity = buildDayActivity(logs, "2026-07-03");
    expect(activity.completed).toBe(2);
    expect(activity.missed).toBe(1);
    expect(activity.qaza).toBe(1);
    expect(activity.total).toBe(5);
    expect(activity.level).toBeCloseTo(2 / 5);
  });
});

describe.concurrent("sumPrayerTotals", () => {
  it("sums within an inclusive range", () => {
    const logs = [
      log("2026-07-01", "fajr", "completed"),
      log("2026-07-02", "dhuhr", "missed"),
      log("2026-07-05", "asr", "completed"), // outside range
    ];
    const totals = sumPrayerTotals(logs, "2026-07-01", "2026-07-03");
    expect(totals.completed).toBe(1);
    expect(totals.missed).toBe(1);
  });
});

describe.concurrent("aggregateByDate", () => {
  it("produces one activity record per date with activity", () => {
    const logs = [
      log("2026-07-01", "fajr", "completed"),
      log("2026-07-01", "dhuhr", "missed"),
      log("2026-07-03", "asr", "completed"),
    ];
    const map = aggregateByDate(logs);
    expect(map.size).toBe(2);
    expect(map.get("2026-07-01")?.completed).toBe(1);
    expect(map.get("2026-07-01")?.missed).toBe(1);
    expect(map.get("2026-07-03")?.completed).toBe(1);
  });
});

describe.concurrent("dailyCompletionSeries", () => {
  it("returns one bucket per day, oldest first", () => {
    const logs = [log("2026-07-03", "fajr", "completed")];
    const series = dailyCompletionSeries(logs, 3, "2026-07-03");
    expect(series).toHaveLength(3);
    expect(series[0]?.date).toBe("2026-07-01");
    expect(series[2]?.date).toBe("2026-07-03");
    expect(series[2]?.completed).toBe(1);
  });
});

const MIXED_DAY = [
  log("2026-07-03", "fajr", "completed"),
  log("2026-07-03", "dhuhr", "delayed"),
  log("2026-07-03", "asr", "pending"),
  log("2026-07-03", "maghrib", "qaza"),
  log("2026-07-03", "isha", "missed"),
  log("2026-07-03", "tahajjud", "completed"),
];

const PERFECT_DAY = (["fajr", "dhuhr", "asr", "maghrib", "isha"] as const).map((prayer) =>
  log("2026-07-01", prayer, "completed"),
);

describe.concurrent("history status coverage", () => {
  it("buildDayActivity counts delayed and ignores pending and sunnah logs", () => {
    expect(buildDayActivity(MIXED_DAY, "2026-07-03")).toEqual({
      date: "2026-07-03",
      completed: 1,
      missed: 1,
      qaza: 1,
      delayed: 1,
      total: 5,
      level: 0.2,
    });
  });

  it("buildDayActivity reports level 0 for a zero total", () => {
    expect(buildDayActivity(MIXED_DAY, "2026-07-03", 0).level).toBe(0);
  });

  it("sumPrayerTotals counts every status and skips sunnah and out-of-range dates", () => {
    const logs = [...MIXED_DAY, log("2026-06-30", "fajr", "completed")];

    expect(sumPrayerTotals(logs, "2026-07-01", "2026-07-03")).toEqual({
      completed: 1,
      missed: 1,
      qaza: 1,
      delayed: 1,
    });
  });

  it.each([
    ["a perfect and a mixed day", [...PERFECT_DAY, ...MIXED_DAY], undefined, 1],
    ["a custom total of one", MIXED_DAY, 1, 1],
    ["no logs", [], undefined, 0],
  ])("countPerfectDays with %s", (_label, logs, total, expected) => {
    expect(countPerfectDays(logs, total)).toBe(expected);
  });

  it("dailyCompletionSeries returns nothing for zero days", () => {
    expect(dailyCompletionSeries(MIXED_DAY, 0)).toEqual([]);
  });

  it("dailyCompletionSeries defaults to today", () => {
    const series = dailyCompletionSeries([], 2);

    expect(series).toHaveLength(2);
    expect(series.every((day) => day.completed === 0)).toBe(true);
  });
});
