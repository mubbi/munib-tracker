import { describe, expect, it } from "@jest/globals";
import type { CalendarMode } from "@munib-tracker/shared/types";

import {
  formatCalendarDate,
  formatCalendarDateFromIso,
  formatCompactGridDateFromIso,
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
