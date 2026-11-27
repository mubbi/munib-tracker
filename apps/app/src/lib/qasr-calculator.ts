import {
  MADHHAB_IDS,
  type MadhhabId,
  type MadhhabRules,
  rulesForSchool,
} from "@munib-tracker/shared/fiqh";

/**
 * Qasr (shortening) calculator for `/travel` and the "turn on travel mode"
 * questions (NF-3.0a retrofit, plan §4.1.4). Pure: the caller passes the
 * resolved travel rules (custom `qasrDistanceKm` / `residencyDays` already
 * applied by `rulesFor`). Every output is a label for guidance, never an
 * automatic edit. Proof log: `docs/proofs/madhhab.md` ("Retrofit — calculators").
 */

export type DistanceUnit = "km" | "mi";

/** International mile. */
export const KM_PER_MILE = 1.609344;

export interface QasrInput {
  /** One-way trip distance in `unit`. */
  distance: number;
  unit: DistanceUnit;
  /** Days the traveller intends to stay at the destination. */
  stayDays: number;
  /** Hajj journey — Hanafi allows combining only at 'Arafah and Muzdalifah. */
  hajj?: boolean;
}

/** `differ`: the distance sits inside the school's conversion range of the classical measure. */
export type QasrTravellerVerdict = "yes" | "no" | "differ";

export type QasrJamVerdict = "allowed" | "hajj_only" | "not_allowed";

export interface QasrResult {
  distanceKm: number;
  traveller: QasrTravellerVerdict;
  /** Threshold range in km (`[x, x]` when a custom distance applies). */
  thresholdKm: readonly [number, number];
  /** Shorten 4 → 2 — labelled wajib / concession / sunnah. Meaningful when `traveller !== "no"`. */
  qasrStatus: MadhhabRules["travel"]["qasrStatus"];
  /** The intended stay makes the traveller resident at the destination (pray in full there). */
  residentOnArrival: boolean;
  residencyDays: number;
  residencyRule: MadhhabRules["travel"]["residencyRule"];
  /** The stay is counted in full days, not counting the arrival and departure days. */
  residencyExcludesTravelDays: boolean;
  /** Combining while travelling. Hanafi: `hajj_only` on a Hajj trip, otherwise `not_allowed`. */
  jam: QasrJamVerdict;
  rawatib: MadhhabRules["travel"]["rawatib"];
}

const finite = (n: number): number => (Number.isFinite(n) ? Math.max(0, n) : 0);

export function toKm(distance: number, unit: DistanceUnit): number {
  const d = finite(distance);
  return unit === "mi" ? d * KM_PER_MILE : d;
}

/** Below the range → no; at/above its upper end → yes; inside it → scholars differ. */
export function travellerVerdict(
  distanceKm: number,
  range: readonly [number, number],
): QasrTravellerVerdict {
  const [low, high] = range;
  if (distanceKm < low) return "no";
  if (distanceKm >= high) return "yes";
  return "differ";
}

/** `gte`: staying `residencyDays` or more ends travel; `gt`: only more than it. */
export function isResidentStay(
  stayDays: number,
  travel: Pick<MadhhabRules["travel"], "residencyDays" | "residencyRule">,
): boolean {
  const days = finite(stayDays);
  return travel.residencyRule === "gt" ? days > travel.residencyDays : days >= travel.residencyDays;
}

export function computeQasr(input: QasrInput, rules: MadhhabRules): QasrResult {
  const { travel } = rules;
  const distanceKm = toKm(input.distance, input.unit);
  return {
    distanceKm,
    traveller: travellerVerdict(distanceKm, travel.qasrDistanceKmRange),
    thresholdKm: travel.qasrDistanceKmRange,
    qasrStatus: travel.qasrStatus,
    residentOnArrival: isResidentStay(input.stayDays, travel),
    residencyDays: travel.residencyDays,
    residencyRule: travel.residencyRule,
    residencyExcludesTravelDays: travel.residencyExcludesTravelDays,
    jam: travel.jamTravel ? "allowed" : input.hajj ? "hajj_only" : "not_allowed",
    rawatib: travel.rawatib,
  };
}

/** All-views mode: one uncustomised result per school — never silently picks one. */
export function computeQasrAllSchools(
  input: QasrInput,
): ReadonlyArray<{ school: MadhhabId; result: QasrResult }> {
  return MADHHAB_IDS.map((school) => ({
    school,
    result: computeQasr(input, rulesForSchool(school)),
  }));
}

/** Format a km figure in the user's unit, rounded for display. */
export function formatDistance(km: number, unit: DistanceUnit): number {
  return Math.round(unit === "mi" ? km / KM_PER_MILE : km);
}
