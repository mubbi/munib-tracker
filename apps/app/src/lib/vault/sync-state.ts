import { DB_KEYS } from "@/db/keys";
import { readJSON, withKeyLock, writeJSON } from "@/db/store";

import type { VaultSyncEntity } from "./vault-docs";

/** A pulled vault record that couldn't be applied yet (sync off, or locked to another key). */
export interface VaultInboxEntry {
  value: unknown;
  updatedAt: string;
}

/**
 * Device-local vault sync state (`DB_KEYS.vaultSyncState`, `deviceLocal`).
 *
 * Pulls are cursor-based, so a vault record pulled while this device can't use
 * it would otherwise be skipped forever. Instead it's parked in `inbox` (still
 * ciphertext) and applied when the user opts in or unlocks.
 */
export interface VaultSyncState {
  enabled: boolean;
  inbox: Partial<Record<VaultSyncEntity, VaultInboxEntry>>;
}

const EMPTY: VaultSyncState = { enabled: false, inbox: {} };

export async function readVaultSyncState(): Promise<VaultSyncState> {
  const stored = await readJSON<Partial<VaultSyncState> | null>(DB_KEYS.vaultSyncState, null);
  return {
    enabled: stored?.enabled === true,
    inbox: stored?.inbox && typeof stored.inbox === "object" ? stored.inbox : {},
  };
}

export function updateVaultSyncState(
  update: (state: VaultSyncState) => VaultSyncState,
): Promise<VaultSyncState> {
  return withKeyLock(DB_KEYS.vaultSyncState, async () => {
    const next = update(await readVaultSyncState());
    await writeJSON(DB_KEYS.vaultSyncState, next);
    return next;
  });
}

export async function isVaultSyncEnabled(): Promise<boolean> {
  return (await readVaultSyncState()).enabled;
}

/** Parks a pulled record, keeping only the newest per entity. */
export function stashVaultRecord(
  entity: VaultSyncEntity,
  value: unknown,
  updatedAt: string,
): Promise<VaultSyncState> {
  return updateVaultSyncState((state) => {
    const current = state.inbox[entity];
    if (current && current.updatedAt > updatedAt) return state;
    return { ...state, inbox: { ...state.inbox, [entity]: { value, updatedAt } } };
  });
}

/**
 * Drops a parked record that a newer pulled record has superseded. That newer
 * record has already merged, so the server no longer holds the parked one.
 */
export async function releaseVaultRecord(entity: VaultSyncEntity, upTo: string): Promise<boolean> {
  let released = false;
  await updateVaultSyncState((state) => {
    const current = state.inbox[entity];
    if (!current || current.updatedAt > upTo) return state;
    const { [entity]: _dropped, ...inbox } = state.inbox;
    released = true;
    return { ...state, inbox };
  });
  return released;
}

/** True while a pulled record for `entity` is parked (its pushes pause). */
export async function hasParkedVaultRecord(entity: VaultSyncEntity): Promise<boolean> {
  return (await readVaultSyncState()).inbox[entity] != null;
}

export { EMPTY as EMPTY_VAULT_SYNC_STATE };
