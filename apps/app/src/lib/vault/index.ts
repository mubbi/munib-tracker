/**
 * Public vault API (plan §4.2, D2). Feature code should need only this barrel:
 *
 * - `createVaultStore<T>(docId)` — the reactive store for one encrypted document.
 * - `vault.read<T>` / `vault.write` / `vault.update` / `vault.subscribe` — the
 *   lower-level typed document API.
 * - `registerVaultDocMerge` — override the default per-item LWW merge.
 * - Opt-in sync & keys: `setUpVaultSync`, `unlockVault`, `resumeVaultSync`,
 *   `disableVaultSync`, `changeVaultPassphrase`, `regenerateVaultRecoveryCode`,
 *   `getVaultStatus` / `useVaultStatus`.
 * - Lock: `useVaultLockJournals`, `useVaultLockActions` (+ `useRequireVaultUnlock`
 *   / `VaultLockGate` in `components/vault`).
 */
export {
  deleteItem,
  emptyVaultDoc,
  getLiveItem,
  liveItems,
  mergeVaultDocs,
  putItem,
  type VaultDoc,
  type VaultItemMeta,
  type VaultRecord,
} from "./doc-merge";
export {
  isVaultError,
  VAULT_ERROR_CODES,
  VaultError,
  type VaultErrorCode,
  vaultErrorI18nKey,
} from "./errors";
export {
  isRecoveryCodeWellFormed,
  parseRecoveryWords,
  VAULT_MIN_PASSPHRASE_LENGTH,
  VAULT_RECOVERY_WORD_COUNT,
} from "./keyring";
export { assessPassphrase, type PassphraseAssessment } from "./passphrase-strength";
export type { VaultEnvelope, VaultKeyring } from "./types";
export {
  changeVaultPassphrase,
  disableVaultSync,
  getVaultStatus,
  regenerateVaultRecoveryCode,
  resetVaultOnDevice,
  resumeVaultSync,
  setUpVaultSync,
  unlockVault,
  type VaultSecret,
  type VaultStatus,
  vault,
  verifyVaultPassphrase,
} from "./vault";
export {
  registerVaultDocMerge,
  VAULT_DOC_IDS,
  type VaultDocId,
  type VaultDocMerge,
} from "./vault-docs";
export {
  clearVaultUnlockSession,
  isVaultSessionUnlocked,
  markVaultUnlocked,
  shouldPromptVaultUnlock,
  useVaultLockActions,
  useVaultLockJournals,
} from "./vault-lock";
export {
  createVaultStore,
  useVaultStatus,
  type VaultStore,
  type VaultStoreState,
  vaultStatusStore,
} from "./vault-store";
