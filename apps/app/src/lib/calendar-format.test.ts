import { describe, expect, it } from "@jest/globals";
import type { CalendarMode } from "@munib-tracker/shared/types";

import {
  formatCalendarDate,
  formatCalendarDateFromIso,
  formatCompactGridDateFromIso,
  formatDualCalendarDate,
} from "./calendar-format";

describe("formatCalendarDate", () => {
  const date = new Date(2023, 2, 23);

  it("formats Hijri dates", () => {
    expect(formatCalendarDate(date, "hijri", "en")).toBe("Ramadan 1, 1444 AH");
  });

  it("formats Gregorian dates", () => {
    const value = formatCalendarDate(date, "gregorian", "en", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    expect(value).toContain("2023");
    expect(value).toContain("March");
    expect(value).toContain("23");
  });
});

describe("formatDualCalendarDate", () => {
  const date = new Date(2023, 2, 23);

  it("puts Hijri first when it is the preferred calendar", () => {
    const value = formatDualCalendarDate(date, "hijri", "en");
    expect(value.primary).toBe("Ramadan 1, 1444 AH");
    expect(value.secondary).toContain("2023");
    expect(value.secondary).toContain("March");
  });

  it("puts Gregorian first when it is the preferred calendar", () => {
    const value = formatDualCalendarDate(date, "gregorian", "en");
    expect(value.primary).toContain("2023");
    expect(value.primary).toContain("March");
    expect(value.secondary).toBe("Ramadan 1, 1444 AH");
  });
});

describe("formatCalendarDateFromIso", () => {
  it("parses ISO dates before formatting", () => {
    for (const calendar of ["hijri", "gregorian"] as CalendarMode[]) {
      expect(formatCalendarDateFromIso("2023-03-23", calendar, "en").length).toBeGreaterThan(0);
    }
  });
});

describe("formatCompactGridDateFromIso", () => {
  it("includes month and day for Gregorian dates", () => {
    const label = formatCompactGridDateFromIso("2026-07-06", "gregorian", "en");
    expect(label).toContain("6");
    expect(label).toMatch(/Jul/i);
  });

  it("includes month and day for Hijri dates", () => {
    const label = formatCompactGridDateFromIso("2026-07-06", "hijri", "en");
    expect(label).toMatch(/\d+/);
    expect(label.length).toBeLessThan(12);
  });
});
