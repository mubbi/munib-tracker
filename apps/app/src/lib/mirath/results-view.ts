import type { MadhhabId } from "@munib-tracker/shared/fiqh";
import {
  HEIR_TYPES,
  type HeirType,
  type MirathHeirShare,
  type MirathResult,
  toFractionString,
} from "@munib-tracker/shared/mirath";

/** Results-table rows: inheriting heirs first, then the excluded (blocked) ones. */
export function partitionHeirs(result: MirathResult): {
  inheriting: MirathHeirShare[];
  excluded: MirathHeirShare[];
} {
  return {
    inheriting: result.heirs.filter((h) => h.inherits),
    excluded: result.heirs.filter((h) => !h.inherits),
  };
}

/** Funeral + debts exceed the gross estate — nothing is left to divide. */
export function debtsExceedEstate(result: MirathResult): boolean {
  return result.issues.some((i) => i.code === "debts_exceed_estate");
}

/** Share-bar width (%): clamped to 1–100 so a tiny share still shows a sliver. */
export function heirBarWidthPercent(percent: number): number {
  return Math.min(100, Math.max(1, percent));
}

/**
 * The money line under an heir row: a single amount, a group total with the
 * per-head amount, or a per-head range when the cents don't divide evenly.
 */
export type HeirAmountLine =
  | { kind: "total"; amount: number }
  | { kind: "each"; amount: number; each: number }
  | { kind: "range"; amount: number; low: number; high: number };

/** `null` when the heir gets nothing or no estate amount was entered. */
export function heirAmountLine(heir: MirathHeirShare): HeirAmountLine | null {
  if (heir.amount == null || !heir.inherits) return null;
  if (heir.count <= 1) return { kind: "total", amount: heir.amount };
  const low = heir.perHeadAmount ?? 0;
  if (heir.perHeadAmountMax != null && heir.perHeadAmountMax !== heir.perHeadAmount) {
    return { kind: "range", amount: heir.amount, low, high: heir.perHeadAmountMax };
  }
  return { kind: "each", amount: heir.amount, each: low };
}

/**
 * Heir rows of the four-school table, in canonical order. Every school is run
 * on the same heir counts, so the Hanafi result lists the same heirs as the rest.
 */
export function compareTableHeirs(results: Record<MadhhabId, MirathResult>): HeirType[] {
  return HEIR_TYPES.filter((h) => results.hanafi.heirs.some((x) => x.heir === h));
}

/** Head count of `heir` (for the "Daughter × 2" label); 1 when absent. */
export function compareRowCount(results: Record<MadhhabId, MirathResult>, heir: HeirType): number {
  return results.hanafi.heirs.find((x) => x.heir === heir)?.count ?? 1;
}

/** One table cell: the school's fraction for `heir`, or an em dash when it gets nothing. */
export function compareCell(
  results: Record<MadhhabId, MirathResult>,
  school: MadhhabId,
  heir: HeirType,
): string {
  const share = results[school].heirs.find((x) => x.heir === heir);
  return share?.inherits ? toFractionString(share.share) : "—";
}
