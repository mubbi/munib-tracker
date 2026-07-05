import {
  ayahsRemaining,
  dailyAyahTarget,
  daysElapsed,
  expectedAyahsByToday,
  khatmPace,
  khatmPercentComplete,
  parseKhatmLogAmount,
  parseKhatmPlanDays,
  parseKhatmTotalAyahs,
  QURAN_TOTAL_AYAHS,
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
});
