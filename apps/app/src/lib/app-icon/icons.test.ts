import { existsSync } from "node:fs";
import { join } from "node:path";

import en from "@/i18n/en.json";
import { hijriToGregorian } from "@/lib/hijri";
import { SEASONAL_THEMES } from "@/lib/seasonal-themes";

import {
  APP_ICON_IDS,
  APP_ICON_PREFERENCES,
  APP_ICON_SEASONS,
  appIconPreferenceLabelKey,
  isAppIconPreference,
  nextSeasonalAppIcon,
  resolveAppIcon,
  seasonalAppIconForHijri,
} from "./icons";
import { defaultAppIconPreference, resolveAppIconPreference } from "./preference";

const { ALTERNATE_ICONS } = jest.requireActual("../../../modules/munib-app-icon/app.plugin.js") as {
  ALTERNATE_ICONS: string[];
};

const APP_ROOT = join(__dirname, "..", "..", "..");

function lookup(path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>((node, key) => (node as Record<string, unknown>)?.[key], en);
}

/** Noon of the Gregorian day that starts Hijri `year/month/day` (avoids midnight edges). */
function onHijri(year: number, month: number, day: number): Date {
  const d = hijriToGregorian(year, month, day);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12);
}

describe("seasonal app icons (NF-2.23b)", () => {
  it("lists the same icons, in the same order, as the native config plugin", () => {
    expect([...APP_ICON_IDS]).toEqual(ALTERNATE_ICONS);
    expect(APP_ICON_SEASONS.map((s) => s.id).sort()).toEqual([...APP_ICON_IDS].sort());
  });

  it.each([...APP_ICON_IDS, "classic"])("ships a picker preview for %s", (id) => {
    expect(existsSync(join(APP_ROOT, "assets/images/app-icons", id, "preview.png"))).toBe(true);
  });

  it("labels every choice with an existing English string", () => {
    for (const pref of APP_ICON_PREFERENCES) {
      expect(typeof lookup(appIconPreferenceLabelKey(pref))).toBe("string");
    }
  });

  it("never overlaps two icon seasons", () => {
    for (let month = 1; month <= 12; month += 1) {
      for (let day = 1; day <= 30; day += 1) {
        const matches = APP_ICON_SEASONS.filter(
          (s) => s.hijriMonth === month && day >= s.fromDay && day <= s.toDay,
        );
        expect(matches.length).toBeLessThanOrEqual(1);
      }
    }
  });

  it("covers every home seasonal banner (D75)", () => {
    for (const theme of SEASONAL_THEMES) {
      expect(seasonalAppIconForHijri(theme.hijriMonth, theme.fromDay ?? 1)).not.toBeNull();
    }
  });

  it.each([
    [9, 1, "ramadan"],
    [9, 20, "ramadan"],
    [9, 21, "lastTen"],
    [9, 27, "lastTen"],
    [10, 1, "eidFitr"],
    [10, 4, null],
    [12, 9, "hajj"],
    [12, 10, "eidAdha"],
    [12, 14, null],
    [1, 1, "newYear"],
    [1, 8, "newYear"],
    [1, 9, "ashura"],
    [1, 10, "ashura"],
    [1, 11, null],
    [3, 12, null],
  ])("Hijri %i/%i → %s", (month, day, expected) => {
    expect(seasonalAppIconForHijri(month, day)).toBe(expected);
  });

  it("resolves seasonal mode through the Hijri calendar", () => {
    expect(resolveAppIcon("seasonal", onHijri(1448, 9, 5))).toBe("ramadan");
    expect(resolveAppIcon("seasonal", onHijri(1448, 10, 2))).toBe("eidFitr");
    expect(resolveAppIcon("seasonal", onHijri(1448, 5, 15))).toBeNull();
  });

  it("keeps a fixed choice all year and classic means the primary icon", () => {
    const outOfSeason = onHijri(1448, 5, 15);
    expect(resolveAppIcon("hajj", outOfSeason)).toBe("hajj");
    expect(resolveAppIcon("classic", onHijri(1448, 9, 5))).toBeNull();
  });

  it("finds the next seasonal icon, skipping the one showing now", () => {
    const midRamadan = onHijri(1448, 9, 5);
    const next = nextSeasonalAppIcon(midRamadan);
    expect(next?.id).toBe("lastTen");
    expect(next?.date.getTime()).toBe(
      new Date(onHijri(1448, 9, 21).setHours(0, 0, 0, 0)).getTime(),
    );
    expect(nextSeasonalAppIcon(onHijri(1448, 10, 2))?.id).toBe("hajj");
    expect(nextSeasonalAppIcon(onHijri(1448, 5, 15))?.id).toBe("ramadan");
  });

  it("defaults to seasonal on iOS and opt-in on Android", () => {
    expect(defaultAppIconPreference("ios")).toBe("seasonal");
    expect(defaultAppIconPreference("android")).toBe("classic");
    expect(resolveAppIconPreference(undefined, "ios")).toBe("seasonal");
    expect(resolveAppIconPreference("eidAdha", "android")).toBe("eidAdha");
    expect(resolveAppIconPreference("mawlid", "android")).toBe("classic");
    expect(isAppIconPreference("lastTen")).toBe(true);
    expect(isAppIconPreference(42)).toBe(false);
  });
});
