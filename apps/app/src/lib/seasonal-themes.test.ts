import { hijriToGregorian } from "@/lib/hijri";
import {
  currentSeasonalTheme,
  SEASONAL_THEMES,
  seasonalBannerHref,
  seasonalThemeById,
  seasonalThemeForHijri,
  seasonalThemesForHijri,
} from "@/lib/seasonal-themes";

describe("seasonal themes (NF-2.23)", () => {
  it("maps Ramadan to days 1–20 of the ninth month", () => {
    expect(seasonalThemeForHijri(9, 1)?.id).toBe("ramadan");
    expect(seasonalThemeForHijri(9, 20)?.id).toBe("ramadan");
    expect(seasonalThemeForHijri(9, 21)?.id).toBe("lastTen");
  });

  it("shows last ten nights for Ramadan 21–30", () => {
    expect(seasonalThemeForHijri(9, 25)?.id).toBe("lastTen");
    expect(seasonalThemeForHijri(9, 30)?.id).toBe("lastTen");
  });

  it("prioritises Laylat al-Qadr on Ramadan 27", () => {
    expect(seasonalThemeForHijri(9, 27)?.id).toBe("laylatQadr");
    const matches = seasonalThemesForHijri(9, 27);
    expect(matches.map((s) => s.id)).toEqual(["laylatQadr", "lastTen"]);
  });

  it("shows Eid al-Fitr for Shawwal 1–3", () => {
    expect(seasonalThemeForHijri(10, 1)?.id).toBe("eidFitr");
    expect(seasonalThemeForHijri(10, 3)?.id).toBe("eidFitr");
    expect(seasonalThemeForHijri(10, 4)).toBeNull();
  });

  it("applies Hajj, Arafah, and Eid al-Adha windows in Dhul-Hijjah", () => {
    expect(seasonalThemeForHijri(12, 1)?.id).toBe("hajj");
    expect(seasonalThemeForHijri(12, 8)?.id).toBe("hajj");
    expect(seasonalThemeForHijri(12, 9)?.id).toBe("arafah");
    expect(seasonalThemeForHijri(12, 10)?.id).toBe("eidAdha");
    expect(seasonalThemeForHijri(12, 13)?.id).toBe("eidAdha");
    expect(seasonalThemeForHijri(12, 14)).toBeNull();
  });

  it("shows Ashura for Muharram 9–10", () => {
    expect(seasonalThemeForHijri(1, 9)?.id).toBe("ashura");
    expect(seasonalThemeForHijri(1, 10)?.id).toBe("ashura");
  });

  it("shows Islamic New Year on Muharram 1", () => {
    expect(seasonalThemeForHijri(1, 1)?.id).toBe("newYear");
  });

  it("returns null out of season", () => {
    expect(seasonalThemeForHijri(6, 15)).toBeNull();
  });

  it("defines visual palettes, routes, and focus keys for each season", () => {
    for (const season of SEASONAL_THEMES) {
      expect(season.hijriMonth).toBeGreaterThanOrEqual(1);
      expect(season.hijriMonth).toBeLessThanOrEqual(12);
      expect(season.visual.gradientTop).toMatch(/^#/);
      expect(season.priority).toBeGreaterThan(0);
      expect(season.focusKey.length).toBeGreaterThan(0);
      expect(String(season.route).startsWith("/")).toBe(true);
    }
  });

  it("builds deep links with a focus query for scroll targets", () => {
    const season = seasonalThemeById("eidFitr");
    expect(seasonalBannerHref(season)).toBe("/events?focus=eidFitr");
  });

  it("looks up themes by id", () => {
    expect(seasonalThemeById("eidFitr").route).toBe("/events");
  });

  it("detects the active season from a Gregorian date (round-trip)", () => {
    const midRamadan = hijriToGregorian(1447, 9, 15);
    expect(currentSeasonalTheme(midRamadan)?.id).toBe("ramadan");

    const laylat = hijriToGregorian(1447, 9, 27);
    expect(currentSeasonalTheme(laylat)?.id).toBe("laylatQadr");

    const eidFitr = hijriToGregorian(1447, 10, 1);
    expect(currentSeasonalTheme(eidFitr)?.id).toBe("eidFitr");

    const midDhulHijjah = hijriToGregorian(1447, 12, 5);
    expect(currentSeasonalTheme(midDhulHijjah)?.id).toBe("hajj");

    const outOfSeason = hijriToGregorian(1447, 6, 15);
    expect(currentSeasonalTheme(outOfSeason)).toBeNull();
  });
});
