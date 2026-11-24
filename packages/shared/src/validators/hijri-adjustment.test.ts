import { describe, expect, it } from "vitest";

import {
  isHijriAdjustment,
  isHijriMonthKey,
  isHijriOffsetDays,
  isIsoCalendarDate,
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
});
