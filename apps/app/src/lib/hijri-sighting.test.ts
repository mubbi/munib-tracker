import {
  getHijriObserver,
  gregorianToHijri,
  hijriMonthLength,
  hijriToGregorian,
  setHijriObserver,
} from "@/lib/hijri";
import { resetSightingCacheForTests, sightingAvailable } from "@/lib/hijri-sighting";

/**
 * Location-aware Hijri dates from crescent visibility. Fixtures are official
 * regional announcements:
 * - Pakistan (Central Ruet-e-Hilal Committee): 1 Safar 1448 = July 16, 2026;
 *   1 Ramadan 1444 = March 23, 2023; Eid al-Fitr 1444 = April 22, 2023.
 * - USA (most communities): 1 Ramadan 1446 = March 1, 2025.
 */

const KARACHI = { latitude: 24.8607, longitude: 67.0011 };
const NEW_YORK = { latitude: 40.7128, longitude: -74.006 };

afterEach(() => {
  setHijriObserver(null);
  resetSightingCacheForTests();
});

describe("sightingAvailable", () => {
  it("rejects polar latitudes and accepts inhabited ones", () => {
    expect(sightingAvailable(24.86)).toBe(true);
    expect(sightingAvailable(-33.9)).toBe(true);
    expect(sightingAvailable(71.0)).toBe(false);
  });

  it("setHijriObserver ignores polar observers", () => {
    setHijriObserver({ latitude: 78.2, longitude: 15.6 });
    expect(getHijriObserver()).toBeNull();
  });
});

describe("gregorianToHijri with a location observer", () => {
  it("matches Pakistan's announced Safar 1448 start in Karachi", () => {
    setHijriObserver(KARACHI);
    expect(gregorianToHijri(new Date(2026, 6, 16))).toEqual({ year: 1448, month: 2, day: 1 });
    expect(gregorianToHijri(new Date(2026, 6, 18))).toEqual({ year: 1448, month: 2, day: 3 });
    // Pakistan's Muharram 1448 began June 17 and ran 29 days.
    expect(gregorianToHijri(new Date(2026, 6, 15))).toEqual({ year: 1448, month: 1, day: 29 });
  });

  it("matches Pakistan's announced Ramadan and Eid al-Fitr 1444 in Karachi", () => {
    setHijriObserver(KARACHI);
    expect(gregorianToHijri(new Date(2023, 2, 23))).toEqual({ year: 1444, month: 9, day: 1 });
    expect(gregorianToHijri(new Date(2023, 3, 22))).toEqual({ year: 1444, month: 10, day: 1 });
  });

  it("matches the US Ramadan 1446 start in New York", () => {
    setHijriObserver(NEW_YORK);
    expect(gregorianToHijri(new Date(2025, 2, 1))).toEqual({ year: 1446, month: 9, day: 1 });
  });

  it("differs from Umm al-Qura only in the day, never the month numbering", () => {
    setHijriObserver(KARACHI);
    const sighted = gregorianToHijri(new Date(2026, 6, 20));
    setHijriObserver(null);
    const umalqura = gregorianToHijri(new Date(2026, 6, 20));
    expect(sighted.year).toBe(umalqura.year);
    expect(sighted.month).toBe(umalqura.month);
    expect(Math.abs(sighted.day - umalqura.day)).toBeLessThanOrEqual(2);
  });
});

describe("hijriToGregorian with a location observer", () => {
  it("is the exact inverse of gregorianToHijri across a full year", () => {
    setHijriObserver(KARACHI);
    const cursor = new Date(2026, 0, 1);
    for (let i = 0; i < 366; i += 1) {
      const h = gregorianToHijri(cursor);
      expect(h.day).toBeGreaterThanOrEqual(1);
      expect(h.day).toBeLessThanOrEqual(30);
      const back = hijriToGregorian(h.year, h.month, h.day);
      expect([back.getFullYear(), back.getMonth(), back.getDate()]).toEqual([
        cursor.getFullYear(),
        cursor.getMonth(),
        cursor.getDate(),
      ]);
      cursor.setDate(cursor.getDate() + 1);
    }
  });

  it("resolves the announced Gregorian day for a sighted Hijri date", () => {
    setHijriObserver(KARACHI);
    const safar1 = hijriToGregorian(1448, 2, 1);
    expect([safar1.getFullYear(), safar1.getMonth() + 1, safar1.getDate()]).toEqual([2026, 7, 16]);
  });
});

describe("hijriMonthLength with a location observer", () => {
  it("returns only 29- or 30-day months across 1448 AH", () => {
    setHijriObserver(KARACHI);
    for (let month = 1; month <= 12; month += 1) {
      const length = hijriMonthLength(1448, month);
      expect(length === 29 || length === 30).toBe(true);
    }
  });

  it("agrees with the gap between consecutive sighted month starts", () => {
    setHijriObserver(KARACHI);
    const start = hijriToGregorian(1448, 2, 1);
    const next = hijriToGregorian(1448, 3, 1);
    const days = Math.round((next.getTime() - start.getTime()) / 86_400_000);
    expect(hijriMonthLength(1448, 2)).toBe(days);
  });
});
