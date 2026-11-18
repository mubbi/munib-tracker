import { getLocalDateString } from "@munib-tracker/shared/utils";
import {
  buildHijriMonthGrid,
  buildMonthGrid,
  buildWeekContainingDate,
  localizedMonthLabel,
  localizedMonthNames,
  localizedWeekdayInitials,
  monthLabel,
  WEEKDAYS,
} from "@/lib/calendar";

import { gregorianToHijri, hijriMonthLength } from "@/lib/hijri";

describe("buildHijriMonthGrid", () => {
  it("covers exactly the requested Hijri month with Gregorian-keyed cells", () => {
    const hYear = 1447;
    const hMonth = 9; // Ramadan
    const weeks = buildHijriMonthGrid(hYear, hMonth, "2020-01-01");

    // Sunday-first, whole weeks.
    for (const week of weeks) {
      expect(week).toHaveLength(7);
    }

    const inMonth = weeks.flat().filter((d) => d.inMonth);
    expect(inMonth).toHaveLength(hijriMonthLength(hYear, hMonth));

    // Every in-month cell really belongs to that Hijri month, and its `date`
    // stays a Gregorian ISO string (so activity lookups keep working).
    for (const day of inMonth) {
      expect(day.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      const h = gregorianToHijri(new Date(`${day.date}T00:00:00`));
      expect(h.month).toBe(hMonth);
      expect(h.year).toBe(hYear);
      expect(day.day).toBe(h.day);
    }
  });

  it("marks today when it falls inside the month", () => {
    // Find the Hijri month containing a known Gregorian day.
    const today = "2023-03-25"; // within Ramadan 1444
    const h = gregorianToHijri(new Date("2023-03-25T00:00:00"));
    const weeks = buildHijriMonthGrid(h.year, h.month, today);
    const todays = weeks.flat().filter((d) => d.isToday);
    expect(todays).toHaveLength(1);
    expect(todays[0].date).toBe(today);
  });
});

describe("buildWeekContainingDate", () => {
  it("returns seven Sunday-first days containing the anchor", () => {
    const week = buildWeekContainingDate("2026-07-08", "2026-07-06"); // Wed in week Sun Jul 5 – Sat Jul 11
    expect(week).toHaveLength(7);
    expect(week[0].date).toBe("2026-07-05");
    expect(week[3].date).toBe("2026-07-08");
    expect(week[6].date).toBe("2026-07-11");
    expect(week[3].isToday).toBe(false);
    expect(week[1].isToday).toBe(true);
  });
});

describe("buildMonthGrid", () => {
  // July 2026 starts on a Wednesday and has 31 days → 5 Sunday-first weeks.
  const grid = buildMonthGrid(2026, 6, "2026-07-15");

  it("pads the first week with the previous month", () => {
    expect(grid).toHaveLength(5);
    expect(grid[0].slice(0, 4).map((d) => [d.date, d.inMonth])).toEqual([
      ["2026-06-28", false],
      ["2026-06-29", false],
      ["2026-06-30", false],
      ["2026-07-01", true],
    ]);
  });

  it("marks today and future days", () => {
    const days = grid.flat();
    expect(days.filter((d) => d.isToday).map((d) => d.date)).toEqual(["2026-07-15"]);
    expect(days.find((d) => d.date === "2026-07-14")?.isFuture).toBe(false);
    expect(days.find((d) => d.date === "2026-07-16")?.isFuture).toBe(true);
  });

  it("defaults today to the local date", () => {
    const now = new Date();
    const current = buildMonthGrid(now.getFullYear(), now.getMonth()).flat();
    expect(current.filter((d) => d.isToday)).toHaveLength(1);
  });
});

describe("month and weekday labels", () => {
  it("formats an English month label", () => {
    expect(monthLabel(2026, 0)).toBe("January 2026");
  });

  it("localizes month names, labels and weekday initials", () => {
    expect(localizedMonthNames("en")[0]).toBe("Jan");
    expect(localizedMonthLabel(2026, 6, "en")).toBe("July 2026");
    expect(localizedWeekdayInitials("en").map((d) => d.label)).toEqual([
      "S",
      "M",
      "T",
      "W",
      "T",
      "F",
      "S",
    ]);
  });

  describe("without a working Intl.DateTimeFormat", () => {
    beforeEach(() => {
      jest.spyOn(Intl, "DateTimeFormat").mockImplementation(() => {
        throw new RangeError("unsupported locale");
      });
    });
    afterEach(() => jest.restoreAllMocks());

    it("falls back to English short month names", () => {
      expect(localizedMonthNames("xx").slice(0, 2)).toEqual(["Jan", "Feb"]);
    });

    it("falls back to the English month label", () => {
      expect(localizedMonthLabel(2026, 1, "xx")).toBe("February 2026");
    });

    it("falls back to the static weekday initials", () => {
      expect(localizedWeekdayInitials("xx")).toBe(WEEKDAYS);
    });
  });
});

describe("default today", () => {
  it.each([
    ["buildWeekContainingDate", () => buildWeekContainingDate(getLocalDateString())],
    [
      "buildHijriMonthGrid",
      () => {
        const h = gregorianToHijri(new Date());
        return buildHijriMonthGrid(h.year, h.month).flat();
      },
    ],
  ])("%s marks the local date as today", (_label, build) => {
    expect(
      build()
        .filter((d) => d.isToday)
        .map((d) => d.date),
    ).toEqual([getLocalDateString()]);
  });
});
