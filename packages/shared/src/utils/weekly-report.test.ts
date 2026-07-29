import { describe, expect, it } from "vitest";

import { makePrayerLog as log } from "../test-support/factories";
import { buildWeeklyReport, shouldDeliverWeeklyReport } from "./weekly-report";

const TODAY = "2026-07-07";

describe("buildWeeklyReport", () => {
  it("counts completed prayers, perfect days, qaza cleared and zikr sessions in the last 7 days", () => {
    const prayerLogs = [
      // A perfect day (all five fard) on 2026-07-06.
      ...(["fajr", "dhuhr", "asr", "maghrib", "isha"] as const).map((p) =>
        log("2026-07-06", p, "completed"),
      ),
      log("2026-07-05", "fajr", "completed"),
      // Outside the window — must be excluded.
      log("2026-06-01", "fajr", "completed"),
    ];
    const report = buildWeeklyReport({
      today: TODAY,
      prayerLogs,
      zikrProgress: [
        { id: "z1", zikrId: "m1", date: "2026-07-06", count: 33, target: 33, completed: true },
        { id: "z2", zikrId: "m2", date: "2026-05-01", count: 1, target: 1, completed: true },
      ],
      qazaDailyProgress: {
        "2026-07-04": { date: "2026-07-04", completed: { fajr: 2, isha: 1 } },
      },
    });

    expect(report.from).toBe("2026-07-01");
    expect(report.to).toBe(TODAY);
    expect(report.prayersCompleted).toBe(6);
    expect(report.perfectDays).toBe(1);
    expect(report.qazaCleared).toBe(3);
    expect(report.zikrSessions).toBe(1);
  });
});

describe("shouldDeliverWeeklyReport", () => {
  it("delivers when never sent or 7+ days elapsed, otherwise waits", () => {
    expect(shouldDeliverWeeklyReport(undefined, TODAY)).toBe(true);
    expect(shouldDeliverWeeklyReport("2026-06-30T00:00:00.000Z", TODAY)).toBe(true);
    expect(shouldDeliverWeeklyReport("2026-07-05T00:00:00.000Z", TODAY)).toBe(false);
  });
});
