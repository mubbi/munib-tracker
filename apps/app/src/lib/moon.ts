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

/** Unix milliseconds → Julian Day Number. */
function toJulianDay(date: Date): number {
  return date.getTime() / 86_400_000 + 2440587.5;
}

/**
 * Maps cycle position + illumination to one of the eight named phases.
 * Uses illumination thresholds for new/full (the mean-month model can sit
 * slightly off 0.25/0.5/0.75) and a tight band around 50% for the quarters.
 */
export function moonPhaseName(
  _fraction: number,
  illumination: number,
  waxing: boolean,
): MoonPhaseName {
  if (illumination < 0.03) return "new";
  if (illumination > 0.97) return "full";

  if (illumination >= 0.45 && illumination <= 0.55) {
    return waxing ? "firstQuarter" : "lastQuarter";
  }

  if (waxing) {
    return illumination < 0.5 ? "waxingCrescent" : "waxingGibbous";
  }
  return illumination < 0.5 ? "waningCrescent" : "waningGibbous";
}

export type MoonIconGeometry = {
  /** Lit hemisphere on the right when true (Northern Hemisphere convention). */
  litOnRight: boolean;
  /** True when less than half the disc is lit — shadow ellipse carves a crescent. */
  isCrescent: boolean;
  /** Horizontal scale of the terminator ellipse, 0 (half moon) → 1 (new/full). */
  terminatorScaleX: number;
};

/**
 * Pure geometry for {@link MoonPhaseIcon}: which side is lit, crescent vs gibbous,
 * and how wide the terminator ellipse is. Flip `southernHemisphere` below the equator.
 */
export function moonIconGeometry(
  fraction: number,
  waxing: boolean,
  southernHemisphere = false,
): MoonIconGeometry {
  const cos = Math.cos(2 * Math.PI * fraction);
  const litOnRight = southernHemisphere ? !waxing : waxing;
  return {
    litOnRight,
    // cos > 0 ⇒ crescent, but treat |cos| ≈ 0 (quarter moons) as half-lit, not crescent.
    isCrescent: cos > 0 && Math.abs(cos) > 1e-6,
    terminatorScaleX: Math.abs(cos),
  };
}

/** Computes the moon phase for a given instant. */
export function moonPhase(date: Date): MoonPhase {
  const days = toJulianDay(date) - REFERENCE_NEW_MOON_JD;
  let fraction = (days % SYNODIC_MONTH) / SYNODIC_MONTH;
  if (fraction < 0) fraction += 1;

  // Illuminated fraction follows a raised cosine over the cycle.
  const illumination = (1 - Math.cos(2 * Math.PI * fraction)) / 2;
  const waxing = fraction < 0.5;
  const name = moonPhaseName(fraction, illumination, waxing);

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
