import {
  ayahsRemaining,
  dailyAyahTarget,
  dailyPageTarget,
  dailyTargetForPlan,
  daysElapsed,
  expectedAyahsBeforeToday,
  expectedAyahsByToday,
  khatmPace,
  khatmPercentComplete,
  khatmTodayProgress,
  khatmTotalForUnit,
  pagesRemaining,
  parseKhatmLogAmount,
  parseKhatmLogPages,
  parseKhatmPlanDays,
  parseKhatmTotalAyahs,
  parseKhatmTotalPages,
  QURAN_TOTAL_AYAHS,
  QURAN_TOTAL_PAGES,
  scheduleGap,
} from "@/lib/khatm";

const plan = { days: 30, startDate: "2026-07-01" };

describe("khatm plan math", () => {
  it("computes a daily ayah target that covers the whole Qur'an", () => {
    expect(dailyAyahTarget(30)).toBe(Math.ceil(QURAN_TOTAL_AYAHS / 30));
    expect(dailyAyahTarget(0)).toBe(QURAN_TOTAL_AYAHS); // guards against divide-by-zero
  });

  it("tracks days elapsed and expected progress", () => {
    expect(daysElapsed(plan, "2026-07-01")).toBe(0);
    expect(daysElapsed(plan, "2026-07-11")).toBe(10);
    // Day 11 (index 10 + 1) × 208/day, capped at the total.
    expect(expectedAyahsByToday(plan, "2026-07-11")).toBe(dailyAyahTarget(30) * 11);
  });

  it("classifies pace relative to the schedule", () => {
    expect(khatmPace(plan, QURAN_TOTAL_AYAHS, "2026-07-05")).toBe("done");
    expect(khatmPace(plan, 0, "2026-07-11")).toBe("behind");
    expect(khatmPace(plan, QURAN_TOTAL_AYAHS - 1, "2026-07-02")).toBe("ahead");
  });

  it("computes completion helpers", () => {
    expect(khatmPercentComplete(0)).toBe(0);
    expect(khatmPercentComplete(QURAN_TOTAL_AYAHS)).toBe(100);
    expect(ayahsRemaining(100)).toBe(QURAN_TOTAL_AYAHS - 100);
    expect(scheduleGap(plan, 0, "2026-07-11")).toBeLessThan(0);
  });

  it("parses custom plan day counts", () => {
    expect(parseKhatmPlanDays("45")).toBe(45);
    expect(parseKhatmPlanDays(" 120 ")).toBe(120);
    expect(parseKhatmPlanDays("")).toBeNull();
    expect(parseKhatmPlanDays("0")).toBeNull();
    expect(parseKhatmPlanDays("366")).toBeNull();
    expect(parseKhatmPlanDays("abc")).toBeNull();
  });

  it("parses log amounts and manual totals", () => {
    expect(parseKhatmLogAmount("50", 200)).toBe(50);
    expect(parseKhatmLogAmount("6036", 200)).toBe(6036);
    expect(parseKhatmLogAmount("6037", 200)).toBeNull();
    expect(parseKhatmLogAmount("0", 0)).toBeNull();
    expect(parseKhatmTotalAyahs("208")).toBe(208);
    expect(parseKhatmTotalAyahs("6236")).toBe(6236);
    expect(parseKhatmTotalAyahs("6237")).toBeNull();
  });

  it("derives today's quota from cumulative reading", () => {
    const daily = dailyAyahTarget(30);
    expect(expectedAyahsBeforeToday(plan, "2026-07-01")).toBe(0);
    expect(expectedAyahsBeforeToday(plan, "2026-07-11")).toBe(daily * 10);

    const day1Behind = khatmTodayProgress(plan, 0, "2026-07-01");
    expect(day1Behind).toMatchObject({
      target: daily,
      done: 0,
      complete: false,
      dayNumber: 1,
      pace: "behind",
    });

    const day1OnTrack = khatmTodayProgress(plan, daily, "2026-07-01");
    expect(day1OnTrack.done).toBe(daily);
    expect(day1OnTrack.complete).toBe(true);
    expect(day1OnTrack.pace).toBe("onTrack");

    // Ahead from earlier days fills today's quota without a fresh log.
    const day11Ahead = khatmTodayProgress(plan, daily * 12, "2026-07-11");
    expect(day11Ahead.done).toBe(daily);
    expect(day11Ahead.complete).toBe(true);
    expect(day11Ahead.pace).toBe("ahead");
  });
});

describe("khatm page-unit plans and parsers", () => {
  const pagePlan = { days: 30, startDate: "2026-07-01", unit: "page" as const };

  it("targets pages per day and totals by unit", () => {
    expect(dailyPageTarget(30)).toBe(Math.ceil(QURAN_TOTAL_PAGES / 30));
    expect(dailyPageTarget(0)).toBe(QURAN_TOTAL_PAGES);
    expect(khatmTotalForUnit()).toBe(QURAN_TOTAL_AYAHS);
    expect(khatmTotalForUnit("page")).toBe(QURAN_TOTAL_PAGES);
    expect(dailyTargetForPlan(pagePlan)).toBe(dailyPageTarget(30));
    expect(dailyTargetForPlan(plan)).toBe(dailyAyahTarget(30));
    expect(khatmPercentComplete(QURAN_TOTAL_PAGES / 2, "page")).toBe(50);
  });

  it("parses page logs within the remaining range", () => {
    expect(parseKhatmLogPages(" 5 ", 0)).toBe(5);
    expect(parseKhatmLogPages("", 0)).toBeNull();
    expect(parseKhatmLogPages("abc", 0)).toBeNull();
    expect(parseKhatmLogPages("0", 0)).toBeNull();
    expect(parseKhatmLogPages("3", QURAN_TOTAL_PAGES - 2)).toBeNull();
    expect(parseKhatmLogPages("2", QURAN_TOTAL_PAGES - 2)).toBe(2);
  });

  it("parses absolute page totals", () => {
    expect(parseKhatmTotalPages("0")).toBe(0);
    expect(parseKhatmTotalPages(String(QURAN_TOTAL_PAGES))).toBe(QURAN_TOTAL_PAGES);
    expect(parseKhatmTotalPages(String(QURAN_TOTAL_PAGES + 1))).toBeNull();
    expect(parseKhatmTotalPages("-1")).toBeNull();
    expect(parseKhatmTotalPages("  ")).toBeNull();
    expect(parseKhatmTotalPages("x")).toBeNull();
  });

  it("counts remaining pages without going negative", () => {
    expect(pagesRemaining(0)).toBe(QURAN_TOTAL_PAGES);
    expect(pagesRemaining(QURAN_TOTAL_PAGES + 10)).toBe(0);
  });

  it("returns zero elapsed days for invalid dates", () => {
    expect(daysElapsed({ days: 30, startDate: "bad" }, "2026-07-03")).toBe(0);
    expect(daysElapsed(plan, "nope")).toBe(0);
  });

  it("tracks a page plan's day progress and completion", () => {
    const daily = dailyPageTarget(30);
    const day3 = "2026-07-03";
    expect(expectedAyahsBeforeToday(pagePlan, day3)).toBe(daily * 2);
    const progress = khatmTodayProgress(pagePlan, daily * 2 + 1, day3);
    expect(progress).toEqual(
      expect.objectContaining({ target: daily, done: 1, complete: false, dayNumber: 3 }),
    );
    expect(khatmPace(pagePlan, QURAN_TOTAL_PAGES, day3)).toBe("done");
    const finished = khatmTodayProgress(pagePlan, QURAN_TOTAL_PAGES, day3);
    expect(finished).toEqual(
      expect.objectContaining({ done: daily, complete: true, pace: "done", percent: 100 }),
    );
  });

  it("uses the default local date when today is omitted", () => {
    const todayPlan = { days: 10, startDate: "2000-01-01" };
    expect(daysElapsed(todayPlan)).toBeGreaterThan(0);
    expect(expectedAyahsByToday(todayPlan)).toBe(QURAN_TOTAL_AYAHS);
    expect(expectedAyahsBeforeToday(todayPlan)).toBe(dailyAyahTarget(10) * 9);
    expect(khatmPace(todayPlan, 0)).toBe("behind");
    expect(scheduleGap(todayPlan, 0)).toBe(-QURAN_TOTAL_AYAHS);
    expect(khatmTodayProgress(todayPlan, 0).dayNumber).toBe(10);
  });
});
