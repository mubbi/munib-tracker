import { DEFAULT_LOCATION } from "@/lib/location";
import { getFastingLogHijriYear, getRamadanInfo } from "@/lib/ramadan";

describe("getRamadanInfo", () => {
  it("reports a non-Ramadan day with no fasting day and Maghrib after Fajr", () => {
    const info = getRamadanInfo(DEFAULT_LOCATION, new Date("2026-07-05T12:00:00.000Z"));
    expect(info.isRamadan).toBe(false);
    expect(info.day).toBe(0);
    expect([29, 30]).toContain(info.totalDays);
    // Suhoor ends at Fajr; iftar is at Maghrib — later the same day.
    expect(info.iftar.getTime()).toBeGreaterThan(info.suhoorEnds.getTime());
  });

  it("detects Ramadan from a Gregorian date inside the 9th Hijri month", () => {
    // 1 Ramadan 1447 AH falls on 2026-02-18 (Umm al-Qura); mid-month is safely inside.
    const info = getRamadanInfo(DEFAULT_LOCATION, new Date("2026-02-25T12:00:00.000Z"));
    expect(info.isRamadan).toBe(true);
    expect(info.day).toBeGreaterThanOrEqual(1);
    expect(info.day).toBeLessThanOrEqual(info.totalDays);
    expect(info.fastingLogHijriYear).toBe(info.hijriYear);
  });

  it("points the fasting log at the last completed Ramadan before the next one starts", () => {
    const info = getRamadanInfo(DEFAULT_LOCATION, new Date("2026-07-05T12:00:00.000Z"));
    expect(info.isRamadan).toBe(false);
    expect(info.fastingLogHijriYear).toBe(info.hijriYear - 1);
    expect(info.fastingLogTotalDays).toBeGreaterThanOrEqual(29);
  });
});

describe("getFastingLogHijriYear", () => {
  it("uses the current year during and after Ramadan", () => {
    expect(getFastingLogHijriYear({ year: 1447, month: 9 })).toBe(1447);
    expect(getFastingLogHijriYear({ year: 1447, month: 10 })).toBe(1447);
    expect(getFastingLogHijriYear({ year: 1447, month: 12 })).toBe(1447);
  });

  it("uses the previous year before Ramadan in the same Hijri year", () => {
    expect(getFastingLogHijriYear({ year: 1448, month: 1 })).toBe(1447);
    expect(getFastingLogHijriYear({ year: 1448, month: 8 })).toBe(1447);
  });
});
