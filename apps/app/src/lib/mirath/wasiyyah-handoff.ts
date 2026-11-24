import type { MirathResult } from "@munib-tracker/shared/mirath";
import { mirathSnapshotShares } from "@munib-tracker/shared/mirath";
import type { MirathSnapshotRef } from "@munib-tracker/shared/types";

import { createId } from "@/db/id";

/**
 * Wasiyyah ↔ Mirath handoff (NF-3.9 section 7). The wasiyyah wizard opens
 * `/mirath?from=wasiyyah`; "Attach to my wasiyyah" parks an illustrative
 * snapshot here (memory only — never persisted outside the vault) and goes
 * back; the wizard takes it on focus and saves it in its own vault draft.
 */
let pending: MirathSnapshotRef | null = null;

/**
 * The snapshot always records the school its shares were computed under
 * (`result.school`) — also in all-views mode, where the user browses one school's
 * result — so the wasiyyah can say which school the shares follow (D9).
 */
export function buildMirathSnapshot(result: MirathResult, now = new Date()): MirathSnapshotRef {
  return {
    id: createId("ms"),
    createdAt: now.toISOString(),
    school: result.school,
    shares: mirathSnapshotShares(result),
  };
}

export function offerMirathSnapshot(snapshot: MirathSnapshotRef): void {
  pending = snapshot;
}

/** Returns and clears the pending snapshot (one consumer). */
export function takePendingMirathSnapshot(): MirathSnapshotRef | null {
  const out = pending;
  pending = null;
  return out;
}
