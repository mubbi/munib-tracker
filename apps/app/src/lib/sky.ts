/**
 * Time-of-day "sky" theming for the prayer hero.
 *
 * The hero background shifts through the day so it feels alive and grounded in
 * the current moment: a little dark-and-sunny at dawn, bright at noon, a calm
 * warm light in the evening, and a deep shiny blue at night. The phase is
 * derived from the day's own sun markers (fajr → sunrise → dhuhr → asr →
 * maghrib → isha) rather than a fixed clock, so it stays correct at any
 * latitude and season. Pure + framework-free so it is trivially testable.
 */

export type SkyPhase = "night" | "dawn" | "morning" | "noon" | "afternoon" | "dusk";

/** The sun markers the phase boundaries are read from (a subset of prayer times). */
export interface SkyMarkers {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
}

export interface SkyPalette {
  /** Base vertical gradient stops, top → middle → bottom. */
  top: string;
  mid: string;
  bottom: string;
  /** Celestial glow (sun by day, moon by night) colour + center, as % of the hero. */
  glow: string;
  glowX: number;
  glowY: number;
  /** Warm/cool wash near the horizon for extra depth. */
  horizon: string;
  /** Mosque silhouette fill for this time of day. */
  silhouette: string;
  /** Accent for the active prayer, location pin, and countdown. */
  accent: string;
  /** Whether to sprinkle a faint starfield (night only). */
  stars: boolean;
}

/**
 * Picks the sky phase for `now` from the day's sun markers. Boundaries are
 * inclusive of the start marker (e.g. exactly at maghrib → "dusk"). Anything
 * before fajr or at/after isha is night.
 */
export function skyPhaseForTime(now: Date, markers: SkyMarkers): SkyPhase {
  const t = now.getTime();
  if (t < markers.fajr.getTime()) return "night";
  if (t < markers.sunrise.getTime()) return "dawn";
  if (t < markers.dhuhr.getTime()) return "morning";
  if (t < markers.asr.getTime()) return "noon";
  if (t < markers.maghrib.getTime()) return "afternoon";
  if (t < markers.isha.getTime()) return "dusk";
  return "night";
}

/** Soft brand-gold accent that reads on every sky. */
const GOLD = "#E4CE9E";

/**
 * The six palettes. Bottoms are kept deep and text stays cream so the clock,
 * countdown, and prayer row remain legible across every phase.
 */
export const SKY_PALETTES: Record<SkyPhase, SkyPalette> = {
  // Deep, shiny indigo with cool moonlight and a scatter of stars.
  night: {
    top: "#1B2A4A",
    mid: "#141F38",
    bottom: "#0A1222",
    glow: "#5C7FC0",
    glowX: 78,
    glowY: 20,
    horizon: "#25386240",
    silhouette: "#060B18",
    accent: GOLD,
    stars: true,
  },
  // Little dark, little sunny — dusky blue-violet lifting to a rose horizon.
  dawn: {
    top: "#243150",
    mid: "#4A466E",
    bottom: "#8A5A66",
    glow: "#E8A56A",
    glowX: 28,
    glowY: 74,
    horizon: "#C97B5A55",
    silhouette: "#1A2136",
    accent: "#F0D9A8",
    stars: false,
  },
  // Fresh brightening teal as the sun climbs.
  morning: {
    top: "#1E708A",
    mid: "#218098",
    bottom: "#0F4C61",
    glow: "#FCE6A8",
    glowX: 66,
    glowY: 38,
    horizon: "#7FC9D64D",
    silhouette: "#0B3A49",
    accent: GOLD,
    stars: false,
  },
  // Sunny bright — open sky blue with a strong warm sun high overhead.
  noon: {
    top: "#2E9BC0",
    mid: "#1E86AE",
    bottom: "#115E7B",
    glow: "#FFE7A6",
    glowX: 50,
    glowY: 22,
    horizon: "#9BD8E44D",
    silhouette: "#0E4A5E",
    accent: "#FFDD99",
    stars: false,
  },
  // Golden hour — warm amber sinking over a calm green-teal.
  afternoon: {
    top: "#3E6E74",
    mid: "#8A8A50",
    bottom: "#B57E44",
    glow: "#F5C877",
    glowX: 72,
    glowY: 64,
    horizon: "#E0A85C55",
    silhouette: "#2A3A2E",
    accent: "#F2D9A0",
    stars: false,
  },
  // Calm evening light — muted purple settling into a warm coral sunset.
  dusk: {
    top: "#3A2C58",
    mid: "#7A4A6C",
    bottom: "#B06A5C",
    glow: "#F0966A",
    glowX: 30,
    glowY: 70,
    horizon: "#E08A6A55",
    silhouette: "#231830",
    accent: "#F0C9A0",
    stars: false,
  },
};

/** The palette for a given phase. */
export function skyPalette(phase: SkyPhase): SkyPalette {
  return SKY_PALETTES[phase];
}
