import type { PrayerId, PrayerLog, PrayerStatus } from "@munib-tracker/shared/types";

import {
  averageLevel,
  dailyPoints,
  indexPrayerDays,
  monthlyPoints,
  periodRange,
  projectQazaFinish,
  salahBreakdown,
  salahExtremes,
  strongestWeekday,
  summarizePeriod,
  summarizeQuranReading,
  sumQazaMadeUp,
} from "./statistics";

const FARD: PrayerId[] = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

function log(
  date: string,
  prayerId: PrayerId,
  status: PrayerStatus,
  extra: Partial<PrayerLog> = {},
): PrayerLog {
  return {
    id: `${prayerId}-${date}`,
    prayerId,
    date,
    status,
    updatedAt: `${date}T00:00:00.000Z`,
    source: "manual",
    ...extra,
  };
}

/** A day with every fard set to one status. */
function day(date: string, status: PrayerStatus, extra: Partial<PrayerLog> = {}): PrayerLog[] {
  return FARD.map((p) => log(date, p, status, extra));
}

describe("periodRange", () => {
  it("builds rolling week and month windows with the previous window before them", () => {
    expect(periodRange("week", "2026-11-23")).toEqual({
      from: "2026-11-17",
      to: "2026-11-23",
      previousFrom: "2026-11-10",
      previousTo: "2026-11-16",
    });
    const month = periodRange("month", "2026-11-23");
    expect(month.from).toBe("2026-10-25");
    expect(month.previousTo).toBe("2026-10-24");
    expect(month.previousFrom).toBe("2026-09-25");
  });

  it("uses the calendar year to date, compared with the same span last year", () => {
    expect(periodRange("year", "2026-11-23")).toEqual({
      from: "2026-01-01",
      to: "2026-11-23",
      previousFrom: "2025-01-01",
      previousTo: "2025-11-23",
    });
    expect(periodRange("year", "2028-02-29").previousTo).toBe("2027-02-28");
  });
});

describe("daily points and averages", () => {
  const logs = [
    ...day("2026-11-20", "completed"),
    ...day("2026-11-21", "pending", { isExcused: true, excusedReason: "sick" }),
    log("2026-11-22", "fajr", "completed"),
    log("2026-11-22", "dhuhr", "missed"),
  ];
  const index = indexPrayerDays(logs);

  it("records the first logged date and per-day tallies in one pass", () => {
    expect(index.firstDate).toBe("2026-11-20");
    expect(index.days.get("2026-11-20")?.completed).toBe(5);
    expect(index.days.get("2026-11-21")?.excused).toBe(true);
  });

  it("skips days before tracking began, excused days and an unlogged today", () => {
    const points = dailyPoints(index, "2026-11-18", "2026-11-23", "2026-11-23");
    expect(points.map((p) => p.beforeStart)).toEqual([true, true, false, false, false, false]);
    // Counted: 20th (1.0), 22nd (0.2) — the 23rd is an unlogged today, 21st excused,
    // and the empty 18th/19th predate the first log.
    expect(averageLevel(points)).toBeCloseTo(0.6);
  });

  it("counts a fully unlogged past day as zero once tracking started", () => {
    const points = dailyPoints(index, "2026-11-20", "2026-11-24", "2026-11-25");
    // 20th 1.0, 22nd 0.2, 23rd 0, 24th 0 (21st excused)
    expect(averageLevel(points)).toBeCloseTo(1.2 / 4);
  });

  it("returns null with nothing to average", () => {
    expect(
      averageLevel(dailyPoints(indexPrayerDays([]), "2026-11-01", "2026-11-07", "2026-11-07")),
    ).toBeNull();
  });
});

describe("summarizePeriod", () => {
  it("tallies statuses, perfect days, excused days and the best perfect run", () => {
    const logs = [
      ...day("2026-11-01", "completed"),
      ...day("2026-11-02", "pending", { isExcused: true, excusedReason: "travel" }),
      ...day("2026-11-03", "completed"),
      ...day("2026-11-04", "completed"),
      log("2026-11-05", "fajr", "delayed"),
      log("2026-11-05", "dhuhr", "qaza"),
      log("2026-11-05", "asr", "missed"),
    ];
    const index = indexPrayerDays(logs);
    const summary = summarizePeriod(
      index,
      dailyPoints(index, "2026-11-01", "2026-11-06", "2026-11-07"),
    );
    expect(summary).toMatchObject({
      completed: 15,
      delayed: 1,
      qaza: 1,
      missed: 1,
      perfectDays: 3,
      activeDays: 4,
      excusedDays: 1,
      countedDays: 5,
      // The excused day doesn't break the run of perfect days.
      bestPerfectRun: 3,
      // 5th: 2 fard never logged; 6th: all 5 unlogged.
      unlogged: 7,
    });
  });
});

describe("monthlyPoints", () => {
  it("averages each elapsed month and marks the rest of the year as future", () => {
    const logs = [...day("2026-01-01", "completed"), ...day("2026-02-10", "completed")];
    const months = monthlyPoints(indexPrayerDays(logs), "2026-02-10");
    expect(months[0]?.level).toBeCloseTo(1 / 31);
    expect(months[1]).toMatchObject({ isCurrent: true, future: false });
    expect(months[1]?.level).toBeCloseTo(1 / 10);
    expect(months[2]).toMatchObject({ future: true, level: null });
  });
});

describe("salahBreakdown", () => {
  const logs = [
    log("2026-11-20", "fajr", "missed"),
    log("2026-11-20", "isha", "completed"),
    log("2026-11-21", "fajr", "completed"),
    log("2026-11-21", "isha", "completed"),
    log("2026-11-22", "fajr", "delayed"),
  ];
  const index = indexPrayerDays(logs);
  const points = dailyPoints(index, "2026-11-20", "2026-11-22", "2026-11-22");

  it("rates each salah over its countable days, today only once logged", () => {
    const [fajr, isha] = salahBreakdown(index, points, ["fajr", "isha"]);
    expect(fajr).toMatchObject({ completed: 1, delayed: 1, missed: 1, days: 3 });
    expect(fajr?.onTimeRate).toBeCloseTo(1 / 3);
    // Isha isn't logged today yet — today is left out of its denominator.
    expect(isha).toMatchObject({ completed: 2, days: 2, onTimeRate: 1 });
  });

  it("names the strongest and weakest fard", () => {
    const rows = salahBreakdown(index, points, ["fajr", "isha"]);
    const { strongest, weakest } = salahExtremes(rows);
    expect(strongest?.prayerId).toBe("isha");
    expect(weakest?.prayerId).toBe("fajr");
  });

  it("has no extremes when every salah is equal", () => {
    const even = indexPrayerDays(day("2026-11-20", "completed"));
    const rows = salahBreakdown(
      even,
      dailyPoints(even, "2026-11-20", "2026-11-20", "2026-11-21"),
      FARD,
    );
    expect(salahExtremes(rows)).toEqual({ strongest: null, weakest: null });
  });
});

describe("strongestWeekday", () => {
  it("picks the weekday with the best average across at least two samples", () => {
    // 2026-11-06 and 2026-11-13 are Fridays.
    const logs = [
      ...day("2026-11-06", "completed"),
      ...day("2026-11-13", "completed"),
      log("2026-11-07", "fajr", "completed"),
      log("2026-11-14", "fajr", "completed"),
    ];
    const index = indexPrayerDays(logs);
    expect(strongestWeekday(dailyPoints(index, "2026-11-06", "2026-11-19", "2026-11-20"))).toBe(5);
  });

  it("returns null for a flat or too-short period", () => {
    const index = indexPrayerDays(day("2026-11-06", "completed"));
    expect(
      strongestWeekday(dailyPoints(index, "2026-11-06", "2026-11-08", "2026-11-09")),
    ).toBeNull();
  });
});

describe("qaza", () => {
  const progress = {
    "2026-11-20": { date: "2026-11-20", completed: { fajr: 2, isha: 1 } },
    "2026-11-01": { date: "2026-11-01", completed: { fajr: 3 } },
  };

  it("sums qaza made up in a range", () => {
    expect(sumQazaMadeUp(progress, "2026-11-10", "2026-11-23")).toBe(3);
    expect(sumQazaMadeUp(progress, "2026-11-01", "2026-11-23")).toBe(6);
  });

  it("projects the finish date from the 30-day pace", () => {
    const projection = projectQazaFinish(60, progress, undefined, "2026-11-23");
    // 6 made up in 30 days → 0.2/day → 300 days.
    expect(projection).toMatchObject({ basis: "pace", days: 300, finishDate: "2027-09-19" });
  });

  it("falls back to the daily plan, and is null with no pace or plan or no debt", () => {
    expect(projectQazaFinish(10, {}, { targets: { fajr: 2 } }, "2026-11-23")).toMatchObject({
      basis: "plan",
      days: 5,
    });
    expect(projectQazaFinish(10, {}, undefined, "2026-11-23")).toBeNull();
    expect(projectQazaFinish(0, progress, undefined, "2026-11-23")).toBeNull();
  });
});

describe("summarizeQuranReading", () => {
  it("counts ayahs read and completed surahs, clamping to the surah length", () => {
    const surahs = [
      { number: 1, ayahCount: 7 },
      { number: 2, ayahCount: 286 },
      { number: 112, ayahCount: 4 },
    ];
    expect(
      summarizeQuranReading({ 1: { furthestAyah: 9 }, 2: { furthestAyah: 100 } }, surahs),
    ).toEqual({ ayahsRead: 107, totalAyahs: 297, surahsStarted: 2, surahsCompleted: 1 });
  });
});
