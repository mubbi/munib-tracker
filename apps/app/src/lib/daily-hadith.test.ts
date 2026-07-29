import {
  dailyHadith,
  dailyHadithIndex,
  dailyHadithPoolSize,
  dayNumber,
  recentDailyHadith,
} from "@/lib/daily-hadith";

describe("daily hadith series (NF-2.10)", () => {
  it("ships a non-empty pool", () => {
    expect(dailyHadithPoolSize()).toBeGreaterThan(0);
  });

  it("is deterministic for a given date", () => {
    expect(dailyHadith("2026-07-06")?.id).toBe(dailyHadith("2026-07-06")?.id);
    expect(dailyHadithIndex("2026-07-06")).toBe(dailyHadithIndex("2026-07-06"));
  });

  it("keeps the index within the pool", () => {
    const size = dailyHadithPoolSize();
    for (const date of ["2026-01-01", "2026-06-15", "2026-12-31", "2027-03-20"]) {
      const idx = dailyHadithIndex(date);
      expect(idx).toBeGreaterThanOrEqual(0);
      expect(idx).toBeLessThan(size);
    }
  });

  it("spreads picks across the pool (not a fixed hadith every day)", () => {
    const ids = new Set<string>();
    for (let i = 0; i < 40; i += 1) {
      const date = `2026-07-${String((i % 28) + 1).padStart(2, "0")}`;
      ids.add(dailyHadith(date)?.id ?? "");
    }
    expect(ids.size).toBeGreaterThan(5);
  });

  it("builds a newest-first archive of the requested length", () => {
    const feed = recentDailyHadith("2026-07-06", 7);
    expect(feed).toHaveLength(7);
    expect(feed[0]?.date).toBe("2026-07-06");
    expect(feed[6]?.date).toBe("2026-06-30");
  });

  it("counts whole days from the epoch", () => {
    expect(dayNumber("1970-01-01")).toBe(0);
    expect(dayNumber("1970-01-02")).toBe(1);
  });
});
