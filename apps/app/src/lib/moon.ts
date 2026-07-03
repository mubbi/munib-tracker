/**
 * Offline lunar-phase calculation.
 *
 * The Islamic calendar is lunar, so the hero shows the moon's current shape.
 * Phase is derived from the mean synodic month since a known new moon — precise
 * enough for a decorative crescent/gibbous glyph, with zero network or native
 * deps (pure JS, works identically on iOS/Android/Web).
 */

export type MoonPhaseName =
  | "new"
  | "waxingCrescent"
  | "firstQuarter"
  | "waxingGibbous"
  | "full"
  | "waningGibbous"
  | "lastQuarter"
  | "waningCrescent";

export interface MoonPhase {
  /** Position in the synodic cycle, 0 (new) → 0.5 (full) → 1 (new again). */
  fraction: number;
  /** Illuminated fraction of the disc, 0 (new) → 1 (full). */
  illumination: number;
  /** Whether the moon is waxing (growing) — lit on the right in the north. */
  waxing: boolean;
  /** The named phase bucket. */
  name: MoonPhaseName;
}

/** Mean length of a synodic month (new moon → new moon), in days. */
const SYNODIC_MONTH = 29.530588853;

/** A reference new moon: 2000-01-06 18:14 UTC, as a Julian Day Number. */
const REFERENCE_NEW_MOON_JD = 2451550.1;

const PHASE_NAMES: MoonPhaseName[] = [
  "new",
  "waxingCrescent",
  "firstQuarter",
  "waxingGibbous",
  "full",
  "waningGibbous",
  "lastQuarter",
  "waningCrescent",
];

/** Unix milliseconds → Julian Day Number. */
function toJulianDay(date: Date): number {
  return date.getTime() / 86_400_000 + 2440587.5;
}

/** Computes the moon phase for a given instant. */
export function moonPhase(date: Date): MoonPhase {
  const days = toJulianDay(date) - REFERENCE_NEW_MOON_JD;
  let fraction = (days % SYNODIC_MONTH) / SYNODIC_MONTH;
  if (fraction < 0) fraction += 1;

  // Illuminated fraction follows a raised cosine over the cycle.
  const illumination = (1 - Math.cos(2 * Math.PI * fraction)) / 2;
  const waxing = fraction < 0.5;

  // Bucket into the eight named phases (each spans 1/8 of the cycle).
  const name = PHASE_NAMES[Math.round(fraction * 8) % 8];

  return { fraction, illumination, waxing, name };
}

/** The moon's age — days elapsed since the last new moon. */
export function moonAgeDays(fraction: number): number {
  return fraction * SYNODIC_MONTH;
}

/** Days remaining until the next new moon (the start of the next lunar month). */
export function daysUntilNewMoon(fraction: number): number {
  return (1 - fraction) * SYNODIC_MONTH;
}

/** Days remaining until the next full moon. */
export function daysUntilFullMoon(fraction: number): number {
  const forward = (((0.5 - fraction) % 1) + 1) % 1;
  return forward * SYNODIC_MONTH;
}
