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
  /** Celestial glow colour (sun by day, moon by night); placed by {@link celestialPosition}. */
  glow: string;
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

/** Which body is above the horizon, if any (neither during dawn/dusk twilight). */
export type CelestialBody = "sun" | "moon";

export interface CelestialPosition {
  /** `null` in twilight: the sun is below the horizon and only its glow shows. */
  body: CelestialBody | null;
  /** Centre of the body / glow as a % of the hero, in a fixed (never mirrored) sky. */
  x: number;
  y: number;
}

/** Horizontal sweep of the sky arc: rises on the left, sets on the right. */
const ARC_START_X = 14;
const ARC_END_X = 86;
/** Vertical extent: where a body sits at the horizon vs at its highest point. */
const ARC_HORIZON_Y = 62;
const ARC_PEAK_Y = 16;
/** Twilight glow hugs the horizon, a little below where a risen body would be. */
const TWILIGHT_Y = 80;

const DAY_MS = 24 * 60 * 60 * 1000;

function fraction(start: number, end: number, t: number): number {
  if (end <= start) return 0;
  return Math.min(1, Math.max(0, (t - start) / (end - start)));
}

function arcPoint(f: number): { x: number; y: number } {
  return {
    x: ARC_START_X + (ARC_END_X - ARC_START_X) * f,
    y: ARC_HORIZON_Y - (ARC_HORIZON_Y - ARC_PEAK_Y) * Math.sin(Math.PI * f),
  };
}

/**
 * Where the sun or moon sits in the hero sky right now. The sun travels one
 * continuous arc from sunrise to maghrib (so it visibly moves through the day
 * instead of jumping between phases); the moon does the same from isha to fajr.
 * In twilight no body is shown and the glow rests on the matching horizon.
 * The night span is approximated from today's markers (±24h), which is accurate
 * to a minute or two — far finer than the arc can show.
 */
export function celestialPosition(now: Date, markers: SkyMarkers): CelestialPosition {
  const t = now.getTime();
  const fajr = markers.fajr.getTime();
  const sunrise = markers.sunrise.getTime();
  const maghrib = markers.maghrib.getTime();
  const isha = markers.isha.getTime();

  if (t < fajr) return { body: "moon", ...arcPoint(fraction(isha - DAY_MS, fajr, t)) };
  if (t < sunrise) return { body: null, x: ARC_START_X, y: TWILIGHT_Y };
  if (t < maghrib) return { body: "sun", ...arcPoint(fraction(sunrise, maghrib, t)) };
  if (t < isha) return { body: null, x: ARC_END_X, y: TWILIGHT_Y };
  return { body: "moon", ...arcPoint(fraction(isha, fajr + DAY_MS, t)) };
}

/**
 * How far along the prayer row "now" is, as a 0..1 fraction of the row width.
 * The six markers sit at the centres of six equal columns, so a time between two
 * markers lands proportionally between their columns. The night (isha → fajr)
 * wraps around the ends: its first half runs from Isha's column to the trailing
 * edge, its second half from the leading edge up to Fajr's column.
 */
export function dayTimelinePosition(now: Date, markers: SkyMarkers): number {
  const t = now.getTime();
  const times = [
    markers.fajr,
    markers.sunrise,
    markers.dhuhr,
    markers.asr,
    markers.maghrib,
    markers.isha,
  ].map((d) => d.getTime());
  const n = times.length;
  const first = times[0];
  const last = times[n - 1];

  if (t < first) {
    const f = fraction(last - DAY_MS, first, t);
    return Math.max(0, f - 0.5) / n;
  }
  if (t >= last) {
    const f = fraction(last, first + DAY_MS, t);
    return Math.min(1, (n - 0.5 + Math.min(f, 0.5)) / n);
  }
  let i = 0;
  while (i < n - 2 && t >= times[i + 1]) i += 1;
  return (i + 0.5 + fraction(times[i], times[i + 1], t)) / n;
}
