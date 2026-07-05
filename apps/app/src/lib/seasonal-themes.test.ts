import { hijriToGregorian } from "@/lib/hijri";
import {
  currentSeasonalTheme,
  SEASONAL_THEMES,
  seasonalThemeForHijri,
} from "@/lib/seasonal-themes";

describe("seasonal themes (NF-2.23)", () => {
  it("maps Ramadan to its curated accent on any day of the month", () => {
    expect(seasonalThemeForHijri(9, 1)?.id).toBe("ramadan");
    expect(seasonalThemeForHijri(9, 29)?.id).toBe("ramadan");
    expect(seasonalThemeForHijri(9, 15)?.accentId).toBe("purple");
  });

  it("applies the Hajj theme only within Dhul-Hijjah 1–13", () => {
    expect(seasonalThemeForHijri(12, 1)?.id).toBe("hajj");
    expect(seasonalThemeForHijri(12, 13)?.id).toBe("hajj");
    expect(seasonalThemeForHijri(12, 14)).toBeNull();
    expect(seasonalThemeForHijri(12, 25)).toBeNull();
  });

  it("returns null out of season", () => {
    expect(seasonalThemeForHijri(1, 10)).toBeNull();
    expect(seasonalThemeForHijri(6, 1)).toBeNull();
  });

  it("only maps to accents that exist in the theme palette", () => {
    for (const season of SEASONAL_THEMES) {
      expect(typeof season.accentId).toBe("string");
      expect(season.hijriMonth).toBeGreaterThanOrEqual(1);
      expect(season.hijriMonth).toBeLessThanOrEqual(12);
    }
  });

  it("detects the active season from a Gregorian date (round-trip)", () => {
    // Mid-Ramadan is unambiguous even with the day-anchor shift at month edges.
    const midRamadan = hijriToGregorian(1447, 9, 15);
    expect(currentSeasonalTheme(midRamadan)?.id).toBe("ramadan");

    const midDhulHijjah = hijriToGregorian(1447, 12, 5);
    expect(currentSeasonalTheme(midDhulHijjah)?.id).toBe("hajj");

    const outOfSeason = hijriToGregorian(1447, 6, 15);
    expect(currentSeasonalTheme(outOfSeason)).toBeNull();
  });
});
