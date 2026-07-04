import { describe, expect, it } from "@jest/globals";

import {
  formatDisplayHhMm,
  formatDisplayTime,
  formatHhMm,
  formatStoredTime,
  from12HourParts,
  parseHhMm,
  to12HourParts,
} from "./time";

describe("formatHhMm", () => {
  it("zero-pads hours and minutes for storage", () => {
    expect(formatHhMm(5, 7)).toBe("05:07");
    expect(formatHhMm(22, 30)).toBe("22:30");
  });
});

describe("formatDisplayTime", () => {
  it("formats 24-hour clock with zero-padded hours", () => {
    expect(formatDisplayTime(new Date(2025, 5, 15, 5, 7, 0), "24")).toBe("05:07");
    expect(formatDisplayTime(new Date(2025, 5, 15, 14, 30, 0), "24")).toBe("14:30");
  });

  it("formats 12-hour clock with AM/PM", () => {
    expect(formatDisplayTime(new Date(2025, 5, 15, 5, 7, 0), "12")).toMatch(/5:07 AM/);
    expect(formatDisplayTime(new Date(2025, 5, 15, 14, 30, 0), "12")).toMatch(/2:30 PM/);
  });
});

describe("formatDisplayHhMm", () => {
  it("formats stored hour/minute pairs for display", () => {
    expect(formatDisplayHhMm(22, 30, "24")).toBe("22:30");
    expect(formatDisplayHhMm(22, 30, "12")).toMatch(/10:30 PM/);
  });
});

describe("formatStoredTime", () => {
  it("parses HH:mm and formats for display", () => {
    expect(formatStoredTime("22:30", "24")).toBe("22:30");
    expect(formatStoredTime("22:30", "12")).toMatch(/10:30 PM/);
  });
});

describe("12-hour conversions", () => {
  it("round-trips through 12-hour parts", () => {
    for (const hour24 of [0, 1, 11, 12, 13, 23]) {
      const parts = to12HourParts(hour24);
      expect(from12HourParts(parts.hour, parts.period)).toBe(hour24);
    }
  });

  it("maps noon and midnight correctly", () => {
    expect(to12HourParts(0)).toEqual({ hour: 12, period: "AM" });
    expect(to12HourParts(12)).toEqual({ hour: 12, period: "PM" });
  });
});

describe("parseHhMm", () => {
  it("falls back when value is missing", () => {
    expect(parseHhMm(undefined, { hour: 8, minute: 15 })).toEqual({ hour: 8, minute: 15 });
  });
});
