/**
 * Wire + storage shapes for the vault (plan §4.2, decision D2). Every vault
 * document is stored at rest — and synced, when the user opts in — as a
 * {@link VaultEnvelope}: AES-256-GCM ciphertext under the device's data key
 * (DEK). The server only ever sees envelopes and the {@link VaultKeyring}.
 */

/** Ciphertext of one vault document (also the server's `data.value` for `vault_*` docs). */
export interface VaultEnvelope {
  v: 1;
  alg: "A256GCM";
  /** Fingerprint of the DEK that sealed this envelope ({@link deriveKeyId}). */
  keyId: string;
  /** Base64 12-byte random nonce. */
  iv: string;
  /** Base64 ciphertext with the 16-byte GCM tag appended. */
  ct: string;
  /** ISO time the plaintext was last written (whole-document watermark). */
  updatedAt: string;
}

/** A data key encrypted (wrapped) under a key-encryption key. */
export interface WrappedKey {
  /** Base64 12-byte nonce. */
  iv: string;
  /** Base64 AES-GCM(KEK, DEK) incl. tag. */
  ct: string;
}

export interface ScryptParams {
  N: number;
  r: number;
  p: number;
}

/**
 * The opt-in sync keyring (`vault_keyring` blob entity). Two wrapped copies of
 * the same DEK: one under the scrypt-stretched passphrase, one under a key
 * derived from the 24-word recovery code. Nothing in it is secret on its own.
 */
export interface VaultKeyring {
  v: 1;
  keyId: string;
  /** First time this DEK was put in a keyring — tie-breaker when two devices race. */
  createdAt: string;
  /** Bumped on passphrase change / recovery-code regeneration (LWW). */
  updatedAt: string;
  passphrase: {
    kdf: "scrypt";
    params: ScryptParams;
    /** Base64 16-byte salt. */
    salt: string;
    wrapped: WrappedKey;
    /** When this copy was made. Each copy merges last-write-wins on its own stamp. Missing on older keyrings, which fall back to the keyring `updatedAt`. */
    updatedAt?: string;
  };
  recovery: {
    kdf: "hkdf-sha256";
    /** Base64 16-byte salt. */
    salt: string;
    wrapped: WrappedKey;
    /** When this recovery code was issued (see `passphrase.updatedAt`). */
    updatedAt?: string;
  };
}

/**
 * Platform crypto primitives. `crypto.native.ts` uses react-native-quick-crypto
 * (native AES-GCM + scrypt) and expo-secure-store; `crypto.web.ts` uses
 * WebCrypto, a pure-JS scrypt (@noble/hashes) and IndexedDB.
 */
export interface VaultCryptoBackend {
  readonly platform: "native" | "web";
  randomBytes(length: number): Uint8Array;
  /** Returns ciphertext || 16-byte tag. */
  aesGcmEncrypt(
    key: Uint8Array,
    iv: Uint8Array,
    plaintext: Uint8Array,
    aad: Uint8Array,
  ): Promise<Uint8Array>;
  /** Rejects (any error) when authentication fails. */
  aesGcmDecrypt(
    key: Uint8Array,
    iv: Uint8Array,
    ciphertext: Uint8Array,
    aad: Uint8Array,
  ): Promise<Uint8Array>;
  scrypt(
    password: Uint8Array,
    salt: Uint8Array,
    params: ScryptParams,
    keyLength: number,
  ): Promise<Uint8Array>;
  /** Device-held DEK (SecureStore / IndexedDB). `null` when none is stored. */
  loadDek(): Promise<Uint8Array | null>;
  /** Throws `VaultError("vault-unavailable")` when the secure store refuses the write. */
  saveDek(dek: Uint8Array): Promise<void>;
  deleteDek(): Promise<void>;
}
