import { describe, expect, it } from "vitest";
import { addDays, diffInDays, getLocalDateString, parseLocalDateString } from "./date";

describe.concurrent("date utils", () => {
  it("formats a local date as YYYY-MM-DD", () => {
    const date = new Date(2026, 6, 3); // 3 Jul 2026, local
    expect(getLocalDateString(date)).toBe("2026-07-03");
  });

  it("zero-pads month and day", () => {
    expect(getLocalDateString(new Date(2026, 0, 9))).toBe("2026-01-09");
  });

  it("round-trips through parseLocalDateString", () => {
    const parsed = parseLocalDateString("2026-07-03");
    expect(getLocalDateString(parsed)).toBe("2026-07-03");
    expect(parsed.getHours()).toBe(0);
  });

  it("adds and subtracts days across month boundaries", () => {
    expect(addDays("2026-07-31", 1)).toBe("2026-08-01");
    expect(addDays("2026-01-01", -1)).toBe("2025-12-31");
  });

  it("computes whole-day differences", () => {
    expect(diffInDays("2026-07-03", "2026-07-01")).toBe(2);
    expect(diffInDays("2026-07-01", "2026-07-03")).toBe(-2);
  });

  it("throws on malformed date strings instead of silently defaulting", () => {
    expect(() => parseLocalDateString("not-a-date")).toThrow();
    expect(() => parseLocalDateString("2026-7-3")).toThrow();
    expect(() => parseLocalDateString("")).toThrow();
  });
});
