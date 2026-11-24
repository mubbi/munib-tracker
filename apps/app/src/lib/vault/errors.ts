/**
 * Typed vault failures. Messages are the bare code — never user content, key
 * material or ciphertext — so a `VaultError` is safe to report as a Sentry tag
 * (same rule as `lib/quran-companion/error-codes.ts`). UI maps the code to an
 * i18n string with {@link vaultErrorI18nKey}.
 */
export const VAULT_ERROR_CODES = [
  /** GCM authentication failed or the envelope is malformed: tampered or damaged ciphertext. */
  "vault-corrupt",
  /** The passphrase did not unwrap the data key. */
  "vault-wrong-passphrase",
  /** The 24 words are a valid recovery code but not the one for this vault. */
  "vault-wrong-recovery-code",
  /** The words are not a valid 24-word recovery code (typo, wrong count, bad checksum). */
  "vault-invalid-recovery-code",
  /** Passphrase shorter than the 10-character minimum. */
  "vault-weak-passphrase",
  /** Encrypted documents exist but this device has no data key; unlock with passphrase or code. */
  "vault-locked",
  /** The document was encrypted with a different data key than the one on this device. */
  "vault-key-mismatch",
  /** No keyring (passphrase copy) exists locally or from sync. */
  "vault-no-keyring",
  /** Secure key storage or crypto is not available on this platform/session. */
  "vault-unavailable",
  /**
   * The key store is there but can't be read right now (iOS Keychain while the
   * device is locked, a background or pre-warm launch). This is transient: it is
   * never cached, never treated as "no key", and never leads to "Start fresh".
   */
  "vault-key-unavailable",
  /** The encrypted document exceeds the 256 KB sync cap. */
  "vault-too-large",
] as const;

export type VaultErrorCode = (typeof VAULT_ERROR_CODES)[number];

export class VaultError extends Error {
  readonly code: VaultErrorCode;

  constructor(code: VaultErrorCode) {
    super(code);
    this.name = "VaultError";
    this.code = code;
  }
}

export function isVaultError(error: unknown, code?: VaultErrorCode): error is VaultError {
  return error instanceof VaultError && (code == null || error.code === code);
}

/** The i18n key (`vault.errors.*`) for a code; unknown errors map to `vault-unavailable`. */
export function vaultErrorI18nKey(error: unknown): string {
  const code = error instanceof VaultError ? error.code : "vault-unavailable";
  return `vault.errors.${code.replace(/^vault-/, "").replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())}`;
}
