import { DB_KEYS } from "@/db/keys";
import { readJSON } from "@/db/store";
import { isTV } from "@/lib/platform/is-tv";
import { type HeldMerge, heldMerge } from "@/sync/blob-hold";

import { isVaultEnvelope, VAULT_MAX_RECORD_BYTES } from "./envelope";
import { isVaultKeyring, mergeKeyrings } from "./keyring";
import {
  hasParkedVaultRecord,
  isVaultSyncEnabled,
  releaseVaultRecord,
  stashVaultRecord,
} from "./sync-state";
import {
  canSyncVaultDocs,
  getVaultStatus,
  mergeDocEnvelopes,
  notifyVaultChange,
  processVaultInbox,
} from "./vault";
import {
  VAULT_DOC_IDS,
  VAULT_DOC_STORAGE_KEYS,
  VAULT_KEYRING_ENTITY,
  type VaultDocId,
  type VaultSyncEntity,
  vaultDocEntity,
} from "./vault-docs";

/**
 * Vault entities for the generic blob sync (`sync/blob-sync.ts`).
 *
 * They are only **active** once the user opts in (`gate`): until then nothing
 * is pushed, and pulled records are parked in the device-local inbox
 * (`stash`) so a later opt-in / unlock can still apply them even though the
 * pull cursor moved on. Document merges decrypt both envelopes, run the
 * document's domain merge (per-item LWW + tombstones by default) and
 * re-encrypt; the server only ever handles ciphertext.
 */
export interface VaultBlobEntity {
  entity: VaultSyncEntity;
  storageKey: string;
  reload: () => Promise<void>;
  /** Sync is allowed for this entity right now (opted in, and for docs: the keyring is ours). */
  gate: () => Promise<boolean>;
  /** Parks a pulled value that the gate refused, or that a merge held back. */
  stash: (value: unknown, updatedAt: string) => Promise<void>;
  /** Returns a `HeldMerge` (keep local, park the remote) when the remote can't be merged yet. */
  merge: (local: unknown, remote: unknown) => Promise<unknown | HeldMerge>;
  /** Documents: retries the parked record, then reports whether pushes must still pause. */
  pushPaused?: () => Promise<boolean>;
  /** Documents: drops a parked record no newer than `upTo` (a newer one merged cleanly). */
  releaseHold?: (upTo: string) => Promise<void>;
  /**
   * Mirrors the server's 256 KB per-record cap, so one oversized record is
   * skipped, not the batch. Also refuses anything that isn't an envelope /
   * keyring (D2: only ciphertext ever leaves the device, even if the stored
   * value was replaced, e.g. by a hand-edited backup).
   */
  validatePush: (value: unknown) => boolean;
}

/** Same rule as the API's `isValidVaultPayload` size check (ciphertext is ASCII). */
export function fitsVaultRecordCap(value: unknown): boolean {
  try {
    return JSON.stringify({ value }).length <= VAULT_MAX_RECORD_BYTES;
  } catch {
    return false;
  }
}

/** A document push: an AES-GCM envelope (or `null`) within the cap. */
export function isPushableVaultDoc(value: unknown): boolean {
  return (value == null || isVaultEnvelope(value)) && fitsVaultRecordCap(value);
}

/** A keyring push: wrapped keys only (or `null`) within the cap. */
export function isPushableVaultKeyring(value: unknown): boolean {
  return (value == null || isVaultKeyring(value)) && fitsVaultRecordCap(value);
}

function docEntity(docId: VaultDocId): VaultBlobEntity {
  const entity = vaultDocEntity(docId);
  return {
    entity,
    storageKey: VAULT_DOC_STORAGE_KEYS[docId],
    reload: async () => notifyVaultChange(docId),
    gate: canSyncVaultDocs,
    // The sync layer passes the record's own `updatedAt` (never "now"), so a
    // newer pull always replaces an older parked one (M4).
    stash: async (value, updatedAt) => {
      await stashVaultRecord(entity, value, updatedAt);
      notifyVaultChange("status");
    },
    merge: async (local, remote) => {
      const outcome = await mergeDocEnvelopes(docId, local, remote);
      if (outcome.kind === "merged") return outcome.value;
      // M4: the remote is sealed by a key this device doesn't hold yet, or (H2)
      // the merge would be over the cap. Keep local untouched, park the
      // remote, and pause pushes. Pushing now would overwrite (or null) a
      // server copy this device can't read.
      return heldMerge(outcome.value, outcome.kind === "too-large" ? "overflow" : "error");
    },
    pushPaused: async () => {
      if (!(await hasParkedVaultRecord(entity))) return false;
      // Retry: the key may have arrived (unlock) or the user made room.
      await processVaultInbox(undefined, entity);
      const held = await hasParkedVaultRecord(entity);
      if (!held) notifyVaultChange("status");
      return held;
    },
    releaseHold: async (upTo) => {
      if (await releaseVaultRecord(entity, upTo)) notifyVaultChange("status");
    },
    validatePush: isPushableVaultDoc,
  };
}

const keyringEntity: VaultBlobEntity = {
  entity: VAULT_KEYRING_ENTITY,
  storageKey: DB_KEYS.vaultKeyring,
  // A keyring for another key flips the status to locked/key-mismatch.
  reload: async () => notifyVaultChange("status"),
  gate: isVaultSyncEnabled,
  stash: async (value, updatedAt) => {
    await stashVaultRecord(VAULT_KEYRING_ENTITY, value, updatedAt);
    notifyVaultChange("status");
  },
  // Same key: the passphrase and recovery copies merge LWW separately, so a
  // newer recovery code is never reverted. Another device's older keyring wins everywhere, which
  // locks this device (status `key-mismatch`) until the user unlocks with that
  // passphrase — `unlockVault` then re-encrypts and merges the local documents.
  merge: async (local, remote) => mergeKeyrings(local, remote) ?? local,
  validatePush: isPushableVaultKeyring,
};

/** Keyring first: it must land before the documents it unlocks. */
export const VAULT_BLOB_ENTITIES: readonly VaultBlobEntity[] = [
  keyringEntity,
  ...VAULT_DOC_IDS.map(docEntity),
];

/** For the settings row / sync-status UI. */
export async function describeVaultSync(): Promise<{
  enabled: boolean;
  needsUnlock: boolean;
}> {
  const status = await getVaultStatus();
  return { enabled: status.syncEnabled, needsUnlock: status.state === "locked" };
}

/** Whether any vault ciphertext exists locally (drives "you have private journals" copy). */
export async function hasLocalVaultData(): Promise<boolean> {
  for (const docId of VAULT_DOC_IDS) {
    if ((await readJSON<unknown>(VAULT_DOC_STORAGE_KEYS[docId], null)) != null) return true;
  }
  return false;
}

/** Vault sync UI is hidden on TV (no text entry for passphrases / recovery codes). */
export function isVaultSyncAvailable(): boolean {
  return !isTV();
}
