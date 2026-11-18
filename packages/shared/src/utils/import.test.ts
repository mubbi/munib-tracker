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

  it("accepts a single JSON object", () => {
    const result = parsePrayerImport(
      JSON.stringify({ date: "2026-07-01", prayerId: "witr", status: "qaza" }),
      TODAY,
    );

    expect(result.rows).toEqual([{ date: "2026-07-01", prayerId: "witr", status: "qaza" }]);
  });

  it("reports null rows and non-string fields as invalid dates", () => {
    const result = parsePrayerImport(
      JSON.stringify([null, { date: 20260701, prayerId: 1, status: true }]),
      TODAY,
    );

    expect(result.rows).toEqual([]);
    expect(result.dateRange).toBeNull();
    expect(result.errors).toEqual([
      { row: 1, message: 'Invalid date ""', raw: ",," },
      { row: 2, message: 'Invalid date ""', raw: ",," },
    ]);
  });

  it.each(["2026-00-10", "2026-13-10", "2026-02-00", "2026-02-32", "2026-02-30", "2026-7-1"])(
    "rejects impossible calendar date %s",
    (date) => {
      expect(parsePrayerImport(`${date},fajr,completed`, TODAY).errors[0]?.message).toBe(
        `Invalid date "${date}"`,
      );
    },
  );

  it("rejects pending status", () => {
    expect(parsePrayerImport("2026-07-01,fajr,pending", TODAY).errors).toEqual([
      { row: 1, message: 'Unknown status "pending"', raw: "2026-07-01,fajr,pending" },
    ]);
  });

  it("handles short CSV lines, CRLF, blank lines and a header naming prayer in column two", () => {
    const text = "Date,Prayer\r\n\r\n2026-07-01,fajr\n2026-07-02\n2026-07-03,asr,delayed";

    const result = parsePrayerImport(text, TODAY);

    expect(result.rows).toEqual([{ date: "2026-07-03", prayerId: "asr", status: "delayed" }]);
    expect(result.errors.map((error) => error.row)).toEqual([1, 2]);
  });

  it.each([
    ["a header-like line after data", "2026-07-01,fajr,completed\ndate,prayer,status", 2],
    ["a first line without a prayer column", "date,x,y\n2026-07-01,fajr,completed", 1],
  ])("treats %s as a data row", (_label, text, row) => {
    const result = parsePrayerImport(text, TODAY);

    expect(result.rows).toHaveLength(1);
    expect(result.errors).toEqual([
      expect.objectContaining({ row, message: 'Invalid date "date"' }),
    ]);
  });

  it("sorts rows by date then prayer id", () => {
    const result = parsePrayerImport(
      "2026-07-02,isha,completed\n2026-07-01,maghrib,completed\n2026-07-01,asr,completed",
      TODAY,
    );

    expect(result.rows.map((row) => `${row.date}:${row.prayerId}`)).toEqual([
      "2026-07-01:asr",
      "2026-07-01:maghrib",
      "2026-07-02:isha",
    ]);
  });

  it("defaults today to the current UTC day", () => {
    expect(parsePrayerImport("2999-01-01,fajr,completed").errors[0]?.message).toBe(
      'Future date "2999-01-01" is not allowed',
    );
  });
});
