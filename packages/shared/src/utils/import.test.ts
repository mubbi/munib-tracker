import { describe, expect, it } from "vitest";

import { parsePrayerImport } from "./import";

const TODAY = "2026-07-05";

describe("parsePrayerImport", () => {
  it("parses a valid JSON array and computes the date range", () => {
    const text = JSON.stringify([
      { date: "2026-07-01", prayerId: "fajr", status: "completed" },
      { date: "2026-07-02", prayerId: "isha", status: "missed" },
    ]);
    const result = parsePrayerImport(text, TODAY);

    expect(result.errors).toEqual([]);
    expect(result.rows).toHaveLength(2);
    expect(result.dateRange).toEqual({ from: "2026-07-01", to: "2026-07-02" });
  });

  it("parses CSV with a header row", () => {
    const text = [
      "date,prayerId,status",
      "2026-07-01,fajr,completed",
      "2026-07-01,dhuhr,qaza",
    ].join("\n");
    const result = parsePrayerImport(text, TODAY);

    expect(result.errors).toEqual([]);
    expect(result.rows).toHaveLength(2);
  });

  it("parses CSV without a header row", () => {
    const result = parsePrayerImport("2026-07-01,asr,delayed", TODAY);
    expect(result.rows).toEqual([{ date: "2026-07-01", prayerId: "asr", status: "delayed" }]);
  });

  it("rejects invalid dates, unknown prayers, and unknown statuses with per-row errors", () => {
    const text = JSON.stringify([
      { date: "2026-13-40", prayerId: "fajr", status: "completed" },
      { date: "2026-07-01", prayerId: "brunch", status: "completed" },
      { date: "2026-07-01", prayerId: "fajr", status: "napping" },
    ]);
    const result = parsePrayerImport(text, TODAY);

    expect(result.rows).toHaveLength(0);
    expect(result.errors).toHaveLength(3);
    expect(result.errors[0]?.message).toMatch(/date/i);
    expect(result.errors[1]?.message).toMatch(/prayer/i);
    expect(result.errors[2]?.message).toMatch(/status/i);
  });

  it("rejects future dates", () => {
    const text = JSON.stringify([{ date: "2026-07-06", prayerId: "fajr", status: "completed" }]);
    const result = parsePrayerImport(text, TODAY);
    expect(result.rows).toHaveLength(0);
    expect(result.errors[0]?.message).toMatch(/future/i);
  });

  it("dedupes duplicate (date, prayerId) rows, last one winning", () => {
    const text = JSON.stringify([
      { date: "2026-07-01", prayerId: "fajr", status: "completed" },
      { date: "2026-07-01", prayerId: "fajr", status: "missed" },
    ]);
    const result = parsePrayerImport(text, TODAY);

    expect(result.rows).toHaveLength(1);
    expect(result.rows[0]?.status).toBe("missed");
    expect(result.duplicates).toBe(1);
  });

  it("returns an empty result for blank input and an error for malformed JSON", () => {
    expect(parsePrayerImport("   ", TODAY).rows).toEqual([]);
    const bad = parsePrayerImport("{not json", TODAY);
    expect(bad.errors[0]?.message).toMatch(/json/i);
  });

  it("normalizes prayer/status casing and whitespace", () => {
    const result = parsePrayerImport("2026-07-01, Fajr , COMPLETED", TODAY);
    expect(result.rows).toEqual([{ date: "2026-07-01", prayerId: "fajr", status: "completed" }]);
  });
});
