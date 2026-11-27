import { describe, expect, it } from "vitest";

import {
  isHijriAdjustment,
  isHijriMonthKey,
  isHijriOffsetDays,
  isIsoCalendarDate,
  MAX_HIJRI_MONTH_CORRECTIONS,
  sanitizeHijriAdjustment,
} from "./hijri-adjustment";

const UPDATED_AT = "2026-11-23T10:00:00.000Z";

describe.concurrent("hijri adjustment validators", () => {
  it("accepts only whole offsets in −2…+2", () => {
    for (const value of [-2, -1, 0, 1, 2]) expect(isHijriOffsetDays(value)).toBe(true);
    for (const value of [-3, 3, 0.5, "1", null]) expect(isHijriOffsetDays(value)).toBe(false);
  });

  it("validates month keys and ISO calendar dates", () => {
    expect(isHijriMonthKey("1445-09")).toBe(true);
    expect(isHijriMonthKey("1445-13")).toBe(false);
    expect(isHijriMonthKey("1445-9")).toBe(false);
    expect(isIsoCalendarDate("2024-03-12")).toBe(true);
    expect(isIsoCalendarDate("2024-02-30")).toBe(false);
    expect(isIsoCalendarDate("2024-3-12")).toBe(false);
  });

  it("keeps a valid adjustment and drops only the invalid corrections", () => {
    const clean = sanitizeHijriAdjustment({
      offsetDays: 1,
      monthStarts: { "1445-09": "2024-03-12", "1445-13": "2024-03-12", "1445-10": "nope" },
      basis: "sighting:31,74",
      basisPlace: "Lahore",
      updatedAt: UPDATED_AT,
      extra: "ignored",
    });
    expect(clean).toEqual({
      offsetDays: 1,
      monthStarts: { "1445-09": "2024-03-12" },
      basis: "sighting:31,74",
      basisPlace: "Lahore",
      updatedAt: UPDATED_AT,
    });
  });

  it("rejects malformed blobs", () => {
    expect(sanitizeHijriAdjustment(null)).toBeUndefined();
    expect(sanitizeHijriAdjustment([])).toBeUndefined();
    expect(sanitizeHijriAdjustment({ offsetDays: 5, updatedAt: UPDATED_AT })).toBeUndefined();
    expect(sanitizeHijriAdjustment({ offsetDays: 0 })).toBeUndefined();
    expect(isHijriAdjustment({ offsetDays: 0, updatedAt: UPDATED_AT })).toBe(true);
  });
  it("keeps the latest month corrections in chronological order, capped", () => {
    const monthStarts: Record<string, string> = {
      "1448-09": "2027-02-08",
      "1447-12": "2026-05-18",
      "1448-01": "2026-06-16",
    };
    const sorted = sanitizeHijriAdjustment({ offsetDays: 0, updatedAt: UPDATED_AT, monthStarts });
    expect(Object.keys(sorted?.monthStarts ?? {})).toEqual(["1447-12", "1448-01", "1448-09"]);

    const many: Record<string, string> = {};
    for (let i = 0; i < MAX_HIJRI_MONTH_CORRECTIONS + 5; i += 1) {
      many[`${1300 + Math.floor(i / 12)}-${String((i % 12) + 1).padStart(2, "0")}`] = "2026-01-01";
    }
    const capped = sanitizeHijriAdjustment({
      offsetDays: 1,
      updatedAt: UPDATED_AT,
      monthStarts: many,
    });
    const keys = Object.keys(capped?.monthStarts ?? {});
    expect(keys).toHaveLength(MAX_HIJRI_MONTH_CORRECTIONS);
    // The oldest five are the ones dropped.
    expect(keys[0]).toBe("1300-06");
  });

  it("rejects a missing or unparseable updatedAt and drops an all-invalid month map", () => {
    expect(sanitizeHijriAdjustment({ offsetDays: 0 })).toBeUndefined();
    expect(sanitizeHijriAdjustment({ offsetDays: 0, updatedAt: "soon" })).toBeUndefined();
    const dropped = sanitizeHijriAdjustment({
      offsetDays: 0,
      updatedAt: UPDATED_AT,
      monthStarts: { nope: "2026-01-01", "1448-01": "not-a-date" },
    });
    expect(dropped).toEqual({ offsetDays: 0, updatedAt: UPDATED_AT });
  });
});
