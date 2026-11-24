import {
  type FiqhDifference,
  MADHHAB_IDS,
  type MadhhabId,
  otherSchools,
} from "@munib-tracker/shared/fiqh";

/** Schools that hold the same position on one difference (they share its summary text). */
export interface PositionGroup {
  schools: MadhhabId[];
  summaryKey: string;
}

/**
 * Groups schools by position so a comparison reads "Shafi'i · Maliki · Hanbali —
 * Sunnah mu'akkadah" once instead of repeating the same text three times.
 * Catalog order is kept (a group sits where its first school would).
 */
export function groupPositions(
  diff: Pick<FiqhDifference, "positions">,
  schools: readonly MadhhabId[] = MADHHAB_IDS,
): PositionGroup[] {
  const groups: PositionGroup[] = [];
  for (const school of schools) {
    const summaryKey = diff.positions[school].summaryKey;
    const group = groups.find((g) => g.summaryKey === summaryKey);
    if (group) group.schools.push(school);
    else groups.push({ schools: [school], summaryKey });
  }
  return groups;
}

/**
 * For a selected school: the other schools that share its view, and the
 * differing views (grouped). The "Other views" disclosure lists only the latter.
 */
export function otherPositions(
  diff: Pick<FiqhDifference, "positions">,
  school: MadhhabId,
): { sameView: MadhhabId[]; differing: PositionGroup[] } {
  const own = diff.positions[school].summaryKey;
  const others = otherSchools(school);
  return {
    sameView: others.filter((s) => diff.positions[s].summaryKey === own),
    differing: groupPositions(diff, others).filter((g) => g.summaryKey !== own),
  };
}
