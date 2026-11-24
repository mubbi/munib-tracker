import type { IqamahTimetable } from "@munib-tracker/shared/masjid/osm";

/**
 * Pluggable public iqamah timetable sources (NF-3.11, D12/D26).
 *
 * A source may be registered here **only after a licence review** recorded in
 * `docs/proofs/masjid-finder.md` confirms redistribution in the app is allowed
 * (open licence or written permission). No scraping of sites whose terms forbid
 * it. As of 2026-11-23 **no candidate feed passed review**, so the registry is
 * empty and only OpenStreetMap data plus the user's private times are shown.
 */
export interface TimetableSource {
  id: string;
  name: string;
  licence: string;
  attribution: string;
  homepage: string;
  fetch(masjid: {
    osmId: string;
    lat: number;
    lon: number;
    name: string;
  }): Promise<IqamahTimetable | null>;
}

export const TIMETABLE_SOURCES: readonly TimetableSource[] = [];

/** Nest injection token for the registry (tests inject fakes). */
export const TIMETABLE_SOURCES_TOKEN = Symbol("TIMETABLE_SOURCES");

/** Minimum name similarity and maximum distance for a non-id match (plan §NF-3.11). */
export const MATCH_MIN_NAME_SIMILARITY = 0.9;
export const MATCH_MAX_DISTANCE_M = 75;

function normalizeName(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/\p{M}+/gu, "")
    .toLowerCase()
    .replace(/\b(masjid|mosque|jami|jamia|al)\b/g, " ")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

/** 1 − normalised Levenshtein distance over folded names (0…1). */
export function nameSimilarity(a: string, b: string): number {
  const x = normalizeName(a);
  const y = normalizeName(b);
  if (!x || !y) return 0;
  if (x === y) return 1;
  const prev = Array.from({ length: y.length + 1 }, (_, i) => i);
  for (let i = 1; i <= x.length; i += 1) {
    let diag = prev[0] ?? 0;
    prev[0] = i;
    for (let j = 1; j <= y.length; j += 1) {
      const up = prev[j] ?? 0;
      prev[j] = Math.min(up + 1, (prev[j - 1] ?? 0) + 1, diag + (x[i - 1] === y[j - 1] ? 0 : 1));
      diag = up;
    }
  }
  return 1 - (prev[y.length] ?? 0) / Math.max(x.length, y.length);
}

/**
 * Never guess a match: an explicit id link wins; otherwise both the name
 * similarity (≥ 0.9) and the distance (≤ 75 m) must pass.
 */
export function isConfidentMatch(input: {
  explicitIdLink?: boolean;
  nameA?: string;
  nameB?: string;
  distanceMeters?: number;
}): boolean {
  if (input.explicitIdLink) return true;
  if (!input.nameA || !input.nameB || input.distanceMeters == null) return false;
  return (
    input.distanceMeters <= MATCH_MAX_DISTANCE_M &&
    nameSimilarity(input.nameA, input.nameB) >= MATCH_MIN_NAME_SIMILARITY
  );
}
