import { gregorianToHijri } from "@/lib/hijri";
import {
  isWhiteDay,
  isWhiteDayDateString,
  isWhiteDayHijri,
  WHITE_DAYS_CHECKLIST_FOCUS,
  WHITE_DAYS_HIJRI,
  whiteDaysChecklistHref,
  whiteDaysForHijriMonth,
  whiteDaysHijriMonthKey,
  whiteDaysHijriMonthKeyForDateString,
} from "@/lib/white-days";

// Safar 1448 begins on 2026-07-15 (verified against ICU islamic-umalqura in
// hijri.test.ts), so its White Days are the 27th, 28th and 29th of July 2026.
const SAFAR_1448 = { year: 1448, month: 2 } as const;
const WHITE_DATES = ["2026-07-27", "2026-07-28", "2026-07-29"] as const;

describe("isWhiteDayHijri", () => {
  it.each([13, 14, 15])("is true on Hijri day %i", (day) => {
    expect(isWhiteDayHijri({ year: 1448, month: 2, day })).toBe(true);
  });

  it.each([1, 12, 16, 30])("is false on Hijri day %i", (day) => {
    expect(isWhiteDayHijri({ year: 1448, month: 2, day })).toBe(false);
  });
});

describe("isWhiteDay / isWhiteDayDateString", () => {
  it.each([...WHITE_DATES])("recognises %s as a White Day", (date) => {
    expect(isWhiteDayDateString(date)).toBe(true);
    const [y, m, d] = date.split("-").map(Number);
    expect(isWhiteDay(new Date(y, m - 1, d, 12))).toBe(true);
  });

  it.each(["2026-07-26", "2026-07-30", "2026-07-15"])("rejects the adjacent day %s", (date) => {
    expect(isWhiteDayDateString(date)).toBe(false);
  });

  it("returns false for an unparseable string", () => {
    expect(isWhiteDayDateString("not-a-date")).toBe(false);
    expect(isWhiteDayDateString("2026-7-1")).toBe(false);
  });
});

describe("whiteDaysForHijriMonth", () => {
  it("resolves the three Hijri days to Gregorian dates", () => {
    const days = whiteDaysForHijriMonth(SAFAR_1448.year, SAFAR_1448.month);
    expect(days.map((d) => d.hijriDay)).toEqual([...WHITE_DAYS_HIJRI]);
    expect(days.map((d) => d.date)).toEqual([...WHITE_DATES]);
  });

  it("round-trips each resolved date back to its Hijri day", () => {
    for (const { hijriDay, date } of whiteDaysForHijriMonth(SAFAR_1448.year, SAFAR_1448.month)) {
      const [y, m, d] = date.split("-").map(Number);
      const hijri = gregorianToHijri(new Date(y, m - 1, d, 12));
      expect(hijri.day).toBe(hijriDay);
      expect(hijri.month).toBe(SAFAR_1448.month);
      expect(hijri.year).toBe(SAFAR_1448.year);
    }
  });
});

describe("whiteDaysHijriMonthKey", () => {
  it("shares one month bucket across all three White Days", () => {
    const keys = WHITE_DATES.map((date) => whiteDaysHijriMonthKeyForDateString(date));
    expect(new Set(keys).size).toBe(1);
    expect(keys[0]).toBe(`${SAFAR_1448.year}-${SAFAR_1448.month}`);
  });

  it("derives the key from a Date the same way", () => {
    const key = whiteDaysHijriMonthKey(new Date(2026, 6, 27, 12));
    expect(key).toBe("1448-2");
  });

  it("returns an empty string for an unparseable date string", () => {
    expect(whiteDaysHijriMonthKeyForDateString("nope")).toBe("");
  });
});

describe("whiteDaysChecklistHref", () => {
  it("targets the tracker White Days focus", () => {
    expect(whiteDaysChecklistHref()).toBe(`/tracker?focus=${WHITE_DAYS_CHECKLIST_FOCUS}`);
    expect(WHITE_DAYS_CHECKLIST_FOCUS).toBe("white-days");
  });
});
