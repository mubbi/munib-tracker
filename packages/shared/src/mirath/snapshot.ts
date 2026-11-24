import type { HeirType } from "../types/heirs";
import { toFractionString } from "./rational";
import type { MirathResult } from "./types";

/**
 * Wasiyyah hook (NF-3.9 `MirathSnapshotRef.shares`): the inheriting heirs of a
 * result as `{ heir, count, fraction }` rows. Illustrative only — the actual
 * heirs are determined at death.
 */
export function mirathSnapshotShares(
  result: MirathResult,
): Array<{ heir: HeirType; count: number; fraction: string }> {
  return result.heirs
    .filter((h) => h.inherits)
    .map((h) => ({ heir: h.heir, count: h.count, fraction: toFractionString(h.share) }));
}
