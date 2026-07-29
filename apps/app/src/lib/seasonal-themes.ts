import type { Href } from "expo-router";

import { gregorianToHijri } from "@/lib/hijri";

export type SeasonalThemeId =
  | "newYear"
  | "ashura"
  | "ramadan"
  | "lastTen"
  | "laylatQadr"
  | "eidFitr"
  | "hajj"
  | "arafah"
  | "eidAdha";

export interface SeasonalVisualPalette {
  gradientTop: string;
  gradientMid: string;
  gradientBottom: string;
  glow: string;
  artColor: string;
  starColor: string;
  /** Accent for eyebrow pill text on the banner. */
  accent: string;
}

export interface SeasonalThemeDef {
  id: SeasonalThemeId;
  hijriMonth: number;
  fromDay?: number;
  toDay?: number;
  /** Higher wins when multiple seasons match the same Hijri day. */
  priority: number;
  visual: SeasonalVisualPalette;
  route: Href;
  /** Scroll target on the destination screen (`?focus=` query param). */
  focusKey: string;
}

function matchesHijriWindow(
  season: Pick<SeasonalThemeDef, "hijriMonth" | "fromDay" | "toDay">,
  month: number,
  day: number,
): boolean {
  if (season.hijriMonth !== month) return false;
  if (season.fromDay != null && day < season.fromDay) return false;
  if (season.toDay != null && day > season.toDay) return false;
  return true;
}

/**
 * Seasonal home banners (NF-2.23). Shown automatically from the Hijri calendar.
 * Does not change the user's accent colour. When windows overlap, `priority`
 * picks the most specific banner (Eid beats month-long seasons, etc.).
 */
export const SEASONAL_THEMES: readonly SeasonalThemeDef[] = [
  {
    id: "newYear",
    hijriMonth: 1,
    fromDay: 1,
    toDay: 1,
    priority: 40,
    route: "/events",
    focusKey: "newYear",
    visual: {
      gradientTop: "#0F1F1A",
      gradientMid: "#1A3329",
      gradientBottom: "#0A1512",
      glow: "#4CAF82",
      artColor: "rgba(255, 255, 255, 0.2)",
      starColor: "rgba(255, 255, 255, 0.5)",
      accent: "#A8E6CF",
    },
  },
  {
    id: "ashura",
    hijriMonth: 1,
    fromDay: 9,
    toDay: 10,
    priority: 80,
    route: "/events",
    focusKey: "ashura",
    visual: {
      gradientTop: "#1A1520",
      gradientMid: "#2A2238",
      gradientBottom: "#100D16",
      glow: "#7E6B9E",
      artColor: "rgba(255, 255, 255, 0.18)",
      starColor: "rgba(200, 220, 255, 0.55)",
      accent: "#C4B5FD",
    },
  },
  {
    id: "ramadan",
    hijriMonth: 9,
    fromDay: 1,
    toDay: 20,
    priority: 50,
    route: "/ramadan",
    focusKey: "ramadan-times",
    visual: {
      gradientTop: "#1A0F3D",
      gradientMid: "#2A1860",
      gradientBottom: "#12082A",
      glow: "#7C4DFF",
      artColor: "rgba(255, 255, 255, 0.18)",
      starColor: "rgba(255, 255, 255, 0.55)",
      accent: "#C4B5FD",
    },
  },
  {
    id: "lastTen",
    hijriMonth: 9,
    fromDay: 21,
    toDay: 30,
    priority: 70,
    route: "/ramadan",
    focusKey: "ramadan-lastTen",
    visual: {
      gradientTop: "#12082A",
      gradientMid: "#1E1050",
      gradientBottom: "#080418",
      glow: "#9D7AFF",
      artColor: "rgba(255, 255, 255, 0.22)",
      starColor: "rgba(255, 255, 255, 0.7)",
      accent: "#DDD6FE",
    },
  },
  {
    id: "laylatQadr",
    hijriMonth: 9,
    fromDay: 27,
    toDay: 27,
    priority: 85,
    route: "/ramadan",
    focusKey: "ramadan-laylatQadr",
    visual: {
      gradientTop: "#0A0520",
      gradientMid: "#180A45",
      gradientBottom: "#040210",
      glow: "#B388FF",
      artColor: "rgba(255, 255, 255, 0.25)",
      starColor: "rgba(255, 255, 255, 0.85)",
      accent: "#E9D5FF",
    },
  },
  {
    id: "eidFitr",
    hijriMonth: 10,
    fromDay: 1,
    toDay: 3,
    priority: 100,
    route: "/events",
    focusKey: "eidFitr",
    visual: {
      gradientTop: "#0A2818",
      gradientMid: "#145A32",
      gradientBottom: "#061810",
      glow: "#34D399",
      artColor: "rgba(255, 255, 255, 0.22)",
      starColor: "rgba(255, 230, 150, 0.75)",
      accent: "#A7F3D0",
    },
  },
  {
    id: "hajj",
    hijriMonth: 12,
    fromDay: 1,
    toDay: 8,
    priority: 60,
    route: "/hajj",
    focusKey: "hajj-tarwiyah",
    visual: {
      gradientTop: "#1A1408",
      gradientMid: "#2D2210",
      gradientBottom: "#0F0C04",
      glow: "#C9A227",
      artColor: "rgba(255, 255, 255, 0.16)",
      starColor: "rgba(232, 197, 71, 0.45)",
      accent: "#FDE68A",
    },
  },
  {
    id: "arafah",
    hijriMonth: 12,
    fromDay: 9,
    toDay: 9,
    priority: 90,
    route: "/hajj",
    focusKey: "hajj-arafah-day",
    visual: {
      gradientTop: "#2A1808",
      gradientMid: "#4A3010",
      gradientBottom: "#140C04",
      glow: "#E8A838",
      artColor: "rgba(255, 255, 255, 0.2)",
      starColor: "rgba(255, 220, 150, 0.6)",
      accent: "#FCD34D",
    },
  },
  {
    id: "eidAdha",
    hijriMonth: 12,
    fromDay: 10,
    toDay: 13,
    priority: 100,
    route: "/events",
    focusKey: "eidAdha",
    visual: {
      gradientTop: "#1A1206",
      gradientMid: "#3D2A0A",
      gradientBottom: "#0C0802",
      glow: "#D4A017",
      artColor: "rgba(255, 255, 255, 0.2)",
      starColor: "rgba(255, 215, 100, 0.7)",
      accent: "#FEF3C7",
    },
  },
];

export function seasonalThemeById(id: SeasonalThemeId): SeasonalThemeDef {
  const season = SEASONAL_THEMES.find((entry) => entry.id === id);
  if (!season) throw new Error(`Unknown seasonal theme: ${id}`);
  return season;
}

/** Deep-link href that scrolls to and highlights the season's target on open. */
export function seasonalBannerHref(season: SeasonalThemeDef): Href {
  const base = typeof season.route === "string" ? season.route : season.route.pathname;
  return `${base}?focus=${encodeURIComponent(season.focusKey)}` as Href;
}

/** All seasons matching a Hijri month/day, highest priority first. */
export function seasonalThemesForHijri(month: number, day: number): SeasonalThemeDef[] {
  return SEASONAL_THEMES.filter((season) => matchesHijriWindow(season, month, day)).sort(
    (a, b) => b.priority - a.priority,
  );
}

/** The single highest-priority seasonal banner for a Hijri month/day, or null. */
export function seasonalThemeForHijri(month: number, day: number): SeasonalThemeDef | null {
  return seasonalThemesForHijri(month, day)[0] ?? null;
}

/** The seasonal banner active right now (or on `date`), or null when out of season. */
export function currentSeasonalTheme(
  date: Date = new Date(),
  timeZone?: string,
): SeasonalThemeDef | null {
  const hijri = gregorianToHijri(date, timeZone);
  return seasonalThemeForHijri(hijri.month, hijri.day);
}
