import { excusedMirror } from "./excused-mirror";
import { khushuMirror } from "./khushu-mirror";
import { type ReconcileOutcome, reconcileVaultMirror, type VaultMirror } from "./vault-mirror";

export { EXCUSED_ACTIVE_ID, type ExcusedItem, excusedDayId, excusedMirror } from "./excused-mirror";
export { type KhushuItem, khushuMirror } from "./khushu-mirror";
export {
  itemFingerprint,
  type MirrorReconcilePlan,
  planMirrorReconcile,
  type ReconcileOutcome,
  reconcileVaultMirror,
  UNKNOWN_LOCAL,
  type VaultMirror,
} from "./vault-mirror";

/** D46: every plaintext local store that syncs only through a vault document. */
export const PRIVATE_VAULT_MIRRORS = [excusedMirror, khushuMirror] as const;

/**
 * Reconciles every private mirror with its vault document. Called by the sync
 * engine before building the push (local edits → vault doc) and after the pull
 * (vault doc merged from another device → local store). A no-op while vault
 * sync is off; one failing mirror never blocks the others or the sync.
 */
export async function reconcilePrivateMirrors(
  nowIso: string = new Date().toISOString(),
): Promise<ReconcileOutcome> {
  const total: ReconcileOutcome = { pushed: 0, applied: 0 };
  for (const mirror of PRIVATE_VAULT_MIRRORS) {
    try {
      const outcome = await reconcileVaultMirror(mirror as unknown as VaultMirror<unknown>, nowIso);
      total.pushed += outcome.pushed;
      total.applied += outcome.applied;
    } catch {
      // A mirror that can't run now retries on the next sync.
    }
  }
  return total;
}
