import { DB_KEYS } from "@/db/keys";

import { mergeVaultDocs, type VaultDoc } from "./doc-merge";

/**
 * The vault's documents. Adding one = a `DB_KEYS.vault*` key (classified
 * `userData`), a row here, the `vault_<id>` entity in the API's
 * `SYNC_ENTITIES`, and nothing else — blob sync, wipe, backup and store
 * reloads all iterate this table.
 */
export const VAULT_DOC_IDS = ["muhasabah", "debts", "wasiyyah", "relatives"] as const;

export type VaultDocId = (typeof VAULT_DOC_IDS)[number];

export const VAULT_DOC_STORAGE_KEYS: Record<VaultDocId, string> = {
  muhasabah: DB_KEYS.vaultMuhasabah,
  debts: DB_KEYS.vaultDebts,
  wasiyyah: DB_KEYS.vaultWasiyyah,
  relatives: DB_KEYS.vaultRelatives,
};

export const VAULT_KEYRING_ENTITY = "vault_keyring";

export type VaultDocEntity = `vault_${VaultDocId}`;
export type VaultSyncEntity = VaultDocEntity | typeof VAULT_KEYRING_ENTITY;

export function vaultDocEntity(docId: VaultDocId): VaultDocEntity {
  return `vault_${docId}`;
}

/** All five sync entities, keyring first (it must be applied before the documents). */
export const VAULT_SYNC_ENTITIES: readonly VaultSyncEntity[] = [
  VAULT_KEYRING_ENTITY,
  ...VAULT_DOC_IDS.map(vaultDocEntity),
];

export function isVaultDocId(value: string): value is VaultDocId {
  return (VAULT_DOC_IDS as readonly string[]).includes(value);
}

/** Domain merge for a document's decrypted plaintext. Must be pure and deterministic. */
export type VaultDocMerge = (
  local: VaultDoc<unknown>,
  remote: VaultDoc<unknown>,
) => VaultDoc<unknown>;

const mergeHooks = new Map<VaultDocId, VaultDocMerge>();

/**
 * Overrides the default per-item LWW merge for one document (e.g. debts that
 * must sum partial repayments). Built-in domain merges are registered eagerly
 * by `register-merges.ts` (imported from `vault.ts`); `createVaultStore`'s
 * `merge` option re-registers the same function.
 */
export function registerVaultDocMerge(docId: VaultDocId, merge: VaultDocMerge): void {
  mergeHooks.set(docId, merge);
}

export function vaultDocMerge(docId: VaultDocId): VaultDocMerge {
  return mergeHooks.get(docId) ?? mergeVaultDocs;
}
