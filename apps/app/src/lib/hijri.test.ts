import {
  formatHijriDate,
  gregorianToHijri,
  hijriMonthLabel,
  hijriMonthLength,
  hijriMonthName,
  hijriToGregorian,
} from "@/lib/hijri";

describe("gregorianToHijri", () => {
  // Reference dates cross-checked against the Umm al-Qura calendar (tabular
  // conversion stays within a day of it).
  it.each([
    ["2023-03-23", { year: 1444, month: 9, day: 1 }], // start of Ramadan 1444
    ["2000-01-01", { year: 1420, month: 9, day: 24 }],
    ["2026-07-03", { year: 1448, month: 1, day: 17 }],
  ])("converts %s", (input, expected) => {
    const [y, m, d] = input.split("-").map(Number);
    expect(gregorianToHijri(new Date(y, m - 1, d))).toEqual(expected);
  });

  it("produces months in 1..12 and days in 1..30", () => {
    const { month, day } = gregorianToHijri(new Date(2025, 5, 15));
    expect(month).toBeGreaterThanOrEqual(1);
    expect(month).toBeLessThanOrEqual(12);
    expect(day).toBeGreaterThanOrEqual(1);
    expect(day).toBeLessThanOrEqual(30);
  });
});

describe("hijriToGregorian", () => {
  it("is the exact inverse of gregorianToHijri", () => {
    // Walk every day across ~10 years and require a perfect round-trip.
    const cursor = new Date(2020, 0, 1);
    for (let i = 0; i < 3653; i += 1) {
      const h = gregorianToHijri(cursor);
      const back = hijriToGregorian(h.year, h.month, h.day);
      expect(back.getFullYear()).toBe(cursor.getFullYear());
      expect(back.getMonth()).toBe(cursor.getMonth());
      expect(back.getDate()).toBe(cursor.getDate());
      cursor.setDate(cursor.getDate() + 1);
    }
  });
});

describe("hijriMonthLength", () => {
  it("returns 29 or 30 days", () => {
    for (let month = 1; month <= 12; month += 1) {
      const length = hijriMonthLength(1448, month);
      expect(length === 29 || length === 30).toBe(true);
    }
  });

  it("agrees with the day count between month starts", () => {
    const start = hijriToGregorian(1447, 9, 1);
    const nextStart = hijriToGregorian(1447, 10, 1);
    const days = Math.round((nextStart.getTime() - start.getTime()) / 86_400_000);
    expect(hijriMonthLength(1447, 9)).toBe(days);
  });
});

describe("hijriMonthLabel", () => {
  it("labels a month with year and era suffix", () => {
    expect(hijriMonthLabel(1448, 9, "en")).toBe("Ramadan 1448 AH");
    expect(hijriMonthLabel(1448, 9, "ar")).toBe("رمضان 1448 هـ");
  });
});

describe("hijriMonthName", () => {
  it("localizes month names", () => {
    expect(hijriMonthName(9, "en")).toBe("Ramadan");
    expect(hijriMonthName(9, "ar")).toBe("رمضان");
  });

  it("clamps out-of-range months instead of throwing", () => {
    expect(hijriMonthName(0, "en")).toBe("Muharram");
    expect(hijriMonthName(13, "en")).toBe("Dhul-Hijjah");
  });
});

describe("formatHijriDate", () => {
  it("formats English month-first with an AH suffix", () => {
    expect(formatHijriDate(new Date(2023, 2, 23), "en")).toBe("Ramadan 1, 1444 AH");
  });

  it("formats Arabic day-first", () => {
    expect(formatHijriDate(new Date(2023, 2, 23), "ar")).toBe("1 رمضان 1444 هـ");
  });
});
