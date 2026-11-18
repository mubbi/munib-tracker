import { describe, expect, it } from "@jest/globals";

import {
  dayKeyInTimeZone,
  formatDisplayDate,
  formatDisplayDateTime,
  formatDisplayHhMm,
  formatDisplayTime,
  formatHhMm,
  formatStoredTime,
  from12HourParts,
  getZonedParts,
  nextWallClockInTimeZone,
  parseHhMm,
  prayerDayAnchor,
  to12HourParts,
  usesHour12,
  wallClockInTimeZoneToDate,
} from "./time";

describe("formatHhMm", () => {
  it("zero-pads hours and minutes for storage", () => {
    expect(formatHhMm(5, 7)).toBe("05:07");
    expect(formatHhMm(22, 30)).toBe("22:30");
  });
});

describe("dayKeyInTimeZone", () => {
  it("returns the calendar day in the selected timezone", () => {
    const instant = new Date("2026-07-04T19:57:00.000Z");
    expect(dayKeyInTimeZone(instant, "America/New_York")).toBe("2026-07-04");
    expect(dayKeyInTimeZone(instant, "Asia/Karachi")).toBe("2026-07-05");
  });

  it("returns zero-padded local YYYY-MM-DD when timezone is omitted", () => {
    const local = new Date(2026, 5, 5, 12, 0, 0); // June 5 local
    expect(dayKeyInTimeZone(local)).toBe("2026-06-05");
  });
});

describe("prayerDayAnchor", () => {
  it("builds an adhan day anchor for the location timezone", () => {
    const anchor = prayerDayAnchor(new Date("2026-07-04T19:57:00.000Z"), "America/New_York");
    expect(anchor.getFullYear()).toBe(2026);
    expect(anchor.getMonth()).toBe(6);
    expect(anchor.getDate()).toBe(4);
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

describe("formatDisplayDateTime", () => {
  it("combines localized date and time", () => {
    const value = formatDisplayDateTime(new Date(2025, 5, 15, 14, 30, 0), "24", "en");
    expect(value).toContain("2025");
    expect(value).toContain("14:30");
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

describe("parseHhMm inputs", () => {
  it.each([
    ["06:45", undefined, { hour: 6, minute: 45 }],
    [undefined, undefined, { hour: 8, minute: 0 }],
    ["xx:yy", { hour: 5, minute: 30 }, { hour: 5, minute: 30 }],
    ["07", undefined, { hour: 7, minute: 0 }],
  ])("%p (fallback %p) → %p", (value, fallback, expected) => {
    expect(parseHhMm(value, fallback)).toEqual(expected);
  });
});

describe("usesHour12", () => {
  it.each([
    ["12", true],
    ["24", false],
  ] as const)("%s-hour → %p", (format, expected) => {
    expect(usesHour12(format)).toBe(expected);
  });
});

describe("getZonedParts", () => {
  const instant = new Date("2026-07-04T19:57:00.000Z");

  it("reads wall-clock parts in an IANA timezone", () => {
    expect(getZonedParts(instant, "Asia/Karachi")).toEqual({
      year: 2026,
      month: 7,
      day: 5,
      hour: 0,
      minute: 57,
    });
  });

  it("uses the device clock without a timezone", () => {
    const local = new Date(2026, 0, 2, 3, 4);
    expect(getZonedParts(local)).toEqual({ year: 2026, month: 1, day: 2, hour: 3, minute: 4 });
  });
});

describe("wallClockInTimeZoneToDate", () => {
  it("resolves a wall-clock time in a timezone to the absolute instant", () => {
    expect(wallClockInTimeZoneToDate(2026, 7, 4, 15, 30, "America/New_York").toISOString()).toBe(
      "2026-07-04T19:30:00.000Z",
    );
  });

  it("uses the device timezone when none is given", () => {
    expect(wallClockInTimeZoneToDate(2026, 7, 4, 15, 30)).toEqual(new Date(2026, 6, 4, 15, 30));
  });
});

describe("nextWallClockInTimeZone", () => {
  const now = new Date("2026-07-04T12:00:00.000Z"); // 08:00 in New York

  it("returns today's time when it is still ahead", () => {
    expect(nextWallClockInTimeZone(9, 0, "America/New_York", now).toISOString()).toBe(
      "2026-07-04T13:00:00.000Z",
    );
  });

  it("rolls over to tomorrow once the time has passed", () => {
    expect(nextWallClockInTimeZone(7, 0, "America/New_York", now).toISOString()).toBe(
      "2026-07-05T11:00:00.000Z",
    );
  });

  it("defaults to the current time", () => {
    expect(nextWallClockInTimeZone(0, 0).getTime()).toBeGreaterThan(Date.now());
  });
});

describe("formatter defaults", () => {
  const date = new Date(2026, 6, 4, 15, 5);

  it("formats a display date in English by default", () => {
    expect(formatDisplayDate(date)).toBe("Jul 4, 2026");
  });

  it("uses a 24-hour clock by default", () => {
    expect(formatDisplayTime(date)).toBe("15:05");
    expect(formatDisplayHhMm(15, 5)).toBe("15:05");
    expect(formatStoredTime("15:05")).toBe("15:05");
    expect(formatStoredTime(undefined)).toBe("08:00");
  });

  it("combines an English Gregorian date with a 24-hour time by default", () => {
    expect(formatDisplayDateTime(date)).toBe("Jul 4, 2026, 15:05");
  });
});
