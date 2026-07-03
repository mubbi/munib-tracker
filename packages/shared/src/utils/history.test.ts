import { describe, expect, it } from "vitest";
import { makePrayerLog as log } from "../test-support/factories";
import {
  aggregateByDate,
  buildDayActivity,
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
    expect(activity.total).toBe(6);
    expect(activity.level).toBeCloseTo(2 / 6);
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
