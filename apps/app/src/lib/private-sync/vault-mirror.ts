import { DB_KEYS } from "@/db/keys";
import { readJSON, withKeyLock, writeJSON } from "@/db/store";
import { deleteItem, putItem, type VaultDoc, type VaultRecord } from "@/lib/vault/doc-merge";
import { canSyncVaultDocs, read as readVaultDoc, write as writeVaultDoc } from "@/lib/vault/vault";
import type { VaultDocId } from "@/lib/vault/vault-docs";

/**
 * D46: private data that keeps a fast, synchronous **plaintext local store**
 * (preferences, prayer logs, the khushu journal) but must sync only through the
 * E2E vault. A mirror keeps one vault document in step with that local store:
 *
 * - The local store stays the source of truth for every reader.
 * - Only while vault sync is on (and the keyring is this device's key) does a
 *   reconcile run; otherwise the data simply stays on the device.
 * - Reconcile is a per-item 3-way merge against the last agreed fingerprint
 *   (`DB_KEYS.vaultMirrorBase`, device-local):
 *   - local and doc agree → nothing to do;
 *   - the doc lacks the item (never mirrored, or the vault was reset) → local
 *     is written into the doc (a missing doc item never deletes local data);
 *   - local changed since the base → local wins (put, or tombstone on delete);
 *   - otherwise the doc changed (another device, via the vault merge) → it is
 *     applied to local (set, or delete on a tombstone).
 * - The doc then travels as the `vault_<docId>` blob entity, ciphertext only.
 */

/** Returned by `readLocal` for an item whose local value is unknown (e.g. a pulled log without its reason). */
export const UNKNOWN_LOCAL = Symbol("unknown-local");

export interface VaultMirror<T> {
  docId: VaultDocId;
  /** Current local items keyed by mirror item id (absent = no item). */
  readLocal: () => Promise<Record<string, T | typeof UNKNOWN_LOCAL>>;
  /** Applies doc-side changes: `value` null deletes the local item. */
  applyToLocal: (changes: Record<string, T | null>) => Promise<void>;
  /** Optional: true when the doc's copy should beat a locally changed one (both edited). */
  docWins?: (local: T, doc: T) => boolean;
}

type MirrorBase = Partial<Record<VaultDocId, Record<string, string>>>;

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value) ?? "null";
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const obj = value as Record<string, unknown>;
  return `{${Object.keys(obj)
    .filter((key) => obj[key] !== undefined)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(obj[key])}`)
    .join(",")}}`;
}

/** Content fingerprint of an item's payload (vault metadata excluded). */
export function itemFingerprint(value: unknown): string {
  if (value == null || typeof value !== "object") return stableStringify(value);
  const { id: _id, updatedAt: _u, deletedAt: _d, ...rest } = value as Record<string, unknown>;
  return stableStringify(rest);
}

function payloadOf<T>(record: VaultRecord<T>): T {
  const {
    id: _id,
    updatedAt: _u,
    deletedAt: _d,
    ...rest
  } = record as VaultRecord<T> & Record<string, unknown>;
  return rest as T;
}

export interface ReconcileOutcome {
  /** Items written into (or tombstoned in) the vault doc. */
  pushed: number;
  /** Items applied to the local store. */
  applied: number;
}

const SKIPPED: ReconcileOutcome = { pushed: 0, applied: 0 };

/**
 * Runs one reconcile for `mirror`. A no-op (and never throws) while vault sync
 * is off, locked to another key, or the document can't be decrypted.
 */
export async function reconcileVaultMirror<T>(
  mirror: VaultMirror<T>,
  nowIso: string = new Date().toISOString(),
): Promise<ReconcileOutcome> {
  if (!(await canSyncVaultDocs().catch(() => false))) return SKIPPED;
  return withKeyLock(`${DB_KEYS.vaultMirrorBase}/${mirror.docId}`, async () => {
    let doc: VaultDoc<T>;
    try {
      doc = await readVaultDoc<T>(mirror.docId);
    } catch {
      return SKIPPED;
    }
    const allBases = await readJSON<MirrorBase>(DB_KEYS.vaultMirrorBase, {});
    const base = allBases[mirror.docId] ?? {};
    const local = await mirror.readLocal();

    let nextDoc = doc;
    const toLocal: Record<string, T | null> = {};
    const nextBase: Record<string, string> = {};
    let pushed = 0;

    const ids = new Set([...Object.keys(local), ...Object.keys(doc.items), ...Object.keys(base)]);
    for (const id of ids) {
      const record = doc.items[id];
      const docLive = record && !record.deletedAt ? payloadOf(record) : undefined;
      const docFp = docLive === undefined ? undefined : itemFingerprint(docLive);
      const localValue = local[id];

      if (localValue === UNKNOWN_LOCAL) {
        // Local can't tell (e.g. its row arrived without the private field):
        // take the doc's value when it has one.
        if (docLive !== undefined) toLocal[id] = docLive;
        if (docFp !== undefined) nextBase[id] = docFp;
        else if (base[id] !== undefined) nextBase[id] = base[id];
        continue;
      }

      const localFp = localValue === undefined ? undefined : itemFingerprint(localValue);
      if (localFp === docFp) {
        if (localFp !== undefined) nextBase[id] = localFp;
        continue;
      }

      const docMissing = record === undefined;
      const localChanged = localFp !== base[id];
      const docPreferred =
        localValue !== undefined &&
        docLive !== undefined &&
        mirror.docWins?.(localValue, docLive) === true;

      if (docMissing || (localChanged && !docPreferred)) {
        // Local wins: mirror it into the doc.
        if (localValue !== undefined) {
          nextDoc = putItem(nextDoc, id, localValue, nowIso);
          nextBase[id] = localFp as string;
          pushed += 1;
        } else if (record && !record.deletedAt) {
          nextDoc = deleteItem(nextDoc, id, nowIso);
          pushed += 1;
        }
        continue;
      }

      // The doc changed (another device): apply it here.
      toLocal[id] = docLive ?? null;
      if (docFp !== undefined) nextBase[id] = docFp;
    }

    if (pushed > 0) await writeVaultDoc(mirror.docId, nextDoc, nowIso);
    const applied = Object.keys(toLocal).length;
    if (applied > 0) await mirror.applyToLocal(toLocal);

    await withKeyLock(DB_KEYS.vaultMirrorBase, async () => {
      const latest = await readJSON<MirrorBase>(DB_KEYS.vaultMirrorBase, {});
      await writeJSON<MirrorBase>(DB_KEYS.vaultMirrorBase, { ...latest, [mirror.docId]: nextBase });
    });
    return { pushed, applied };
  });
}
