import { DB_KEYS } from "@/db/keys";
import { readJSON, withKeyLock, writeJSON } from "@/db/store";

/**
 * Parked ("held") remote blob records. Kept apart from `blob-sync.ts` so stores
 * and UI can read the state without importing every synced store.
 *
 * A pulled record is held when its entity's merge can't take all of it yet.
 * Examples: ayah notes whose union would be over the 1 MB sync cap, or a merge
 * that threw. The pull cursor has already moved past the record, so the value
 * is parked here (device-local, never synced or backed up). While an entity is
 * held, this device doesn't push it, because the push would overwrite the
 * server copy that the parked value came from. Each push retries the merge
 * first (`blob-sync.ts`), so the hold clears as soon as it fits.
 *
 * Only the newest parked record per entity is kept. A newer remote that merges
 * cleanly supersedes an older parked one (`clearBlobHold(entity, upTo)`). The
 * older one's author device still has its own content and re-pushes it on its
 * next sync, so nothing is lost.
 */

export type BlobHoldReason =
  /** The merged value would be over the entity's size cap (notes "full"). */
  | "overflow"
  /** The merge threw (e.g. an unexpected shape); retried on the next push. */
  | "error";

export interface BlobHoldEntry {
  value: unknown;
  updatedAt: string;
  reason: BlobHoldReason;
  /** Remote items that didn't fit (overflow only), for the UI. */
  pending?: number;
}

type BlobHoldState = Record<string, BlobHoldEntry>;

type HoldListener = (entity: string) => void;
const listeners = new Set<HoldListener>();

/** Fires whenever an entity is parked or released. */
export function onBlobHoldChange(listener: HoldListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notify(entity: string): void {
  for (const listener of [...listeners]) {
    try {
      listener(entity);
    } catch {
      // a faulty subscriber must not break sync
    }
  }
}

function asState(value: unknown): BlobHoldState {
  return value != null && typeof value === "object" && !Array.isArray(value)
    ? (value as BlobHoldState)
    : {};
}

export async function readBlobHold(entity: string): Promise<BlobHoldEntry | null> {
  const state = asState(await readJSON<unknown>(DB_KEYS.blobSyncHold, {}));
  return state[entity] ?? null;
}

/** Parks `entry`. An existing hold that is newer than it is kept instead. */
export async function setBlobHold(entity: string, entry: BlobHoldEntry): Promise<void> {
  const changed = await withKeyLock(DB_KEYS.blobSyncHold, async () => {
    const state = asState(await readJSON<unknown>(DB_KEYS.blobSyncHold, {}));
    const current = state[entity];
    if (current && current.updatedAt > entry.updatedAt) return false;
    await writeJSON(DB_KEYS.blobSyncHold, { ...state, [entity]: entry });
    return true;
  });
  if (changed) notify(entity);
}

/**
 * Releases the hold for `entity`. With `upTo`, only a hold no newer than that
 * timestamp is released. Use this when a newer remote merged cleanly.
 */
export async function clearBlobHold(entity: string, upTo?: string): Promise<void> {
  const changed = await withKeyLock(DB_KEYS.blobSyncHold, async () => {
    const state = asState(await readJSON<unknown>(DB_KEYS.blobSyncHold, {}));
    const current = state[entity];
    if (!current) return false;
    if (upTo != null && current.updatedAt > upTo) return false;
    const { [entity]: _released, ...rest } = state;
    await writeJSON(DB_KEYS.blobSyncHold, rest);
    return true;
  });
  if (changed) notify(entity);
}

// ── Merge outcome marker ────────────────────────────────────────────────────

/**
 * Returned by a blob merge that could not take all of the remote. `value` is
 * what to keep locally: the local value, or local plus whatever fitted. The
 * caller parks the remote and pauses pushes for the entity.
 */
export interface HeldMerge {
  readonly __held: true;
  readonly value: unknown;
  readonly reason: BlobHoldReason;
  readonly pending?: number;
}

export function heldMerge(
  value: unknown,
  reason: BlobHoldReason = "overflow",
  pending?: number,
): HeldMerge {
  return { __held: true, value, reason, pending };
}

export function isHeldMerge(value: unknown): value is HeldMerge {
  return (
    value != null && typeof value === "object" && (value as Partial<HeldMerge>).__held === true
  );
}
