import {
  addQuranReading,
  firstReadingLogDate,
  mergeQuranReadingLog,
  pruneQuranReadingLog,
  QURAN_READING_LOG_KEEP_DAYS,
  type QuranReadingLog,
  readingDaysBetween,
  sanitizeQuranReadingLog,
} from "@/lib/quran-reading-log";

const day = (seconds: number, ayahs = 0, pages = 0) => ({ seconds, ayahs, pages });

describe("quran reading log (D40)", () => {
  it("sanitizes stored/pulled values: bad dates, negatives, empty days, non-objects", () => {
    expect(sanitizeQuranReadingLog(null)).toEqual({});
    expect(sanitizeQuranReadingLog([1, 2])).toEqual({});
    expect(
      sanitizeQuranReadingLog({
        "2026-11-20": { seconds: 61.7, ayahs: 3, pages: -2 },
        "2026-11-21": { seconds: 0, ayahs: 0, pages: 0 },
        "not-a-date": { seconds: 10 },
        "2026-11-22": "x",
        "2026-11-23": { seconds: 1e9 },
      }),
    ).toEqual({ "2026-11-20": day(61, 3, 0), "2026-11-23": day(86_400) });
  });

  it("adds deltas per day and returns the same object when nothing changes", () => {
    const one = addQuranReading({}, "2026-11-20", { seconds: 30, ayahs: 4 });
    const two = addQuranReading(one, "2026-11-20", { seconds: 15, pages: 1 });
    expect(two["2026-11-20"]).toEqual(day(45, 4, 1));
    expect(addQuranReading(two, "2026-11-20", {})).toBe(two);
    expect(addQuranReading(two, "bad", { seconds: 5 })).toBe(two);
  });

  it(`prunes to the last ${QURAN_READING_LOG_KEEP_DAYS} days`, () => {
    const log: QuranReadingLog = {
      "2025-10-19": day(10), // 401 days before 2026-11-23 → dropped
      "2025-10-20": day(10), // day 400 → kept
      "2026-11-23": day(10),
    };
    expect(Object.keys(pruneQuranReadingLog(log, "2026-11-23")).sort()).toEqual([
      "2025-10-20",
      "2026-11-23",
    ]);
    const kept = { "2026-11-23": day(1) };
    expect(pruneQuranReadingLog(kept, "2026-11-23")).toBe(kept);
    // addQuranReading prunes relative to `today`.
    expect(addQuranReading(log, "2026-11-23", { seconds: 1 }, "2026-11-23")).not.toHaveProperty(
      "2025-10-19",
    );
  });

  it("merges as a union of dates with a per-field max (idempotent and commutative)", () => {
    const local = { "2026-11-20": day(100, 2, 0), "2026-11-21": day(5) };
    const remote = { "2026-11-20": day(40, 9, 1), "2026-11-19": day(30) };
    const merged = mergeQuranReadingLog(local, remote);
    expect(merged).toEqual({
      "2026-11-19": day(30),
      "2026-11-20": day(100, 9, 1),
      "2026-11-21": day(5),
    });
    expect(mergeQuranReadingLog(remote, local)).toEqual(merged);
    expect(mergeQuranReadingLog(merged, remote)).toEqual(merged);
    expect(mergeQuranReadingLog(null, remote)).toEqual(remote);
    expect(mergeQuranReadingLog(local, "garbage")).toEqual(local);
  });

  it("finds the first logged day and the reading days in a range", () => {
    const log = { "2026-11-20": day(10), "2026-11-12": day(0, 1), "2026-11-25": day(3) };
    expect(firstReadingLogDate(log)).toBe("2026-11-12");
    expect(firstReadingLogDate({})).toBeNull();
    expect(readingDaysBetween(log, "2026-11-13", "2026-11-25")).toEqual([
      "2026-11-20",
      "2026-11-25",
    ]);
  });
});
