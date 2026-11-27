import type { VoluntaryFastKind } from "@munib-tracker/shared/types";

/** Kinds that headline a day, most specific first. */
const HEADLINE_ORDER: readonly VoluntaryFastKind[] = [
  "arafah",
  "ashura",
  "tasua",
  "white_day",
  "shawwal_six",
  "dhul_hijjah_nine",
  "dawud",
  "monday",
  "thursday",
  "muharram",
  "shaban",
];

export function headlineKind(kinds: readonly VoluntaryFastKind[]): VoluntaryFastKind | null {
  return HEADLINE_ORDER.find((kind) => kinds.includes(kind)) ?? null;
}
