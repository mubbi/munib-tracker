import {
  formatHijriDate,
  gregorianToHijri,
  hijriMonthLabel,
  hijriMonthLength,
  hijriMonthName,
  hijriMonthProgress,
  hijriToGregorian,
} from "@/lib/hijri";

describe("gregorianToHijri", () => {
  // Reference dates from the official Umm al-Qura calendar (matches ICU's
  // `islamic-umalqura` and mainstream Hijri converters exactly).
  it.each([
    ["2023-03-23", { year: 1444, month: 9, day: 1 }], // start of Ramadan 1444
    ["2000-01-01", { year: 1420, month: 9, day: 24 }],
    ["2026-07-03", { year: 1448, month: 1, day: 18 }],
    ["2026-07-15", { year: 1448, month: 2, day: 1 }], // start of Safar 1448
    ["2026-07-18", { year: 1448, month: 2, day: 4 }],
  ])("converts %s", (input, expected) => {
    const [y, m, d] = input.split("-").map(Number);
    expect(gregorianToHijri(new Date(y, m - 1, d))).toEqual(expected);
  });

  it("matches ICU's islamic-umalqura calendar exactly", () => {
    const fmt = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
    const icuHijri = (date: Date) => {
      const parts = fmt.formatToParts(date);
      const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
      return { year: get("year"), month: get("month"), day: get("day") };
    };
    // Every day across 2024–2030, plus a sparse sweep over the full
    // 1300–1600 AH table (every 97 days from 1883 to 2174).
    const cursor = new Date(2024, 0, 1);
    for (let i = 0; i < 2557; i += 1) {
      expect(gregorianToHijri(cursor)).toEqual(
        icuHijri(new Date(Date.UTC(cursor.getFullYear(), cursor.getMonth(), cursor.getDate(), 12))),
      );
      cursor.setDate(cursor.getDate() + 1);
    }
    const sweep = new Date(1883, 0, 15);
    while (sweep.getFullYear() < 2174) {
      expect(gregorianToHijri(sweep)).toEqual(
        icuHijri(new Date(Date.UTC(sweep.getFullYear(), sweep.getMonth(), sweep.getDate(), 12))),
      );
      sweep.setDate(sweep.getDate() + 97);
    }
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

  it("round-trips outside the Umm al-Qura table via the tabular fallback", () => {
    // 1850 predates the table (starts 1882-11-12 / 1300 AH).
    const cursor = new Date(1850, 0, 1);
    for (let i = 0; i < 366; i += 1) {
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

describe("hijriMonthProgress", () => {
  it("reports days remaining from the Hijri day, not the astronomical cycle", () => {
    // 2026-07-14 → 29 Muharram 1448 (29-day month in Umm al-Qura) → last day.
    const hijri = gregorianToHijri(new Date(2026, 6, 14));
    expect(hijri).toEqual({ year: 1448, month: 1, day: 29 });
    expect(hijriMonthProgress(hijri)).toEqual({
      length: 29,
      daysRemaining: 0,
      nextMonth: 2,
      nextYear: 1448,
    });
  });

  it("reports zero days remaining on the last day of the month", () => {
    const progress = hijriMonthProgress({ year: 1448, month: 1, day: 30 });
    expect(progress.daysRemaining).toBe(0);
    expect(progress.nextMonth).toBe(2);
  });

  it("rolls next month into the next Hijri year after Dhul-Hijjah", () => {
    const progress = hijriMonthProgress({ year: 1448, month: 12, day: 20 });
    expect(progress.nextMonth).toBe(1);
    expect(progress.nextYear).toBe(1449);
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
