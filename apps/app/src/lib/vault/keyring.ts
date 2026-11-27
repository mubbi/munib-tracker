import { hkdf } from "@noble/hashes/hkdf.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { entropyToMnemonic, mnemonicToEntropy, validateMnemonic } from "@scure/bip39";
import { wordlist as englishWordlist } from "@scure/bip39/wordlists/english.js";

import { base64ToBytes, bytesToBase64, utf8Encode, wipeBytes } from "./encoding";
import { deriveKeyId, VAULT_IV_BYTES, VAULT_KEY_BYTES } from "./envelope";
import { VaultError } from "./errors";
import type { ScryptParams, VaultCryptoBackend, VaultKeyring, WrappedKey } from "./types";

/** Plan §4.2: scrypt N=2^15, r=8, p=1 with a 16-byte salt (≤ 1.5 s on a low-end Android). */
export const VAULT_SCRYPT_PARAMS: ScryptParams = { N: 2 ** 15, r: 8, p: 1 };
export const VAULT_SALT_BYTES = 16;
export const VAULT_MIN_PASSPHRASE_LENGTH = 10;
/** 24 BIP-39 words = 256 bits of entropy + 8-bit checksum. */
export const VAULT_RECOVERY_WORD_COUNT = 24;
const RECOVERY_ENTROPY_BYTES = 32;

/** NFKC so the same passphrase typed on two keyboards/OSes derives the same key. */
export function normalizePassphrase(passphrase: string): string {
  try {
    return passphrase.normalize("NFKC");
  } catch {
    return passphrase;
  }
}

/** Length in user-perceived characters (code points), after normalisation. */
export function passphraseLength(passphrase: string): number {
  return [...normalizePassphrase(passphrase)].length;
}

function wrapAad(kind: "passphrase" | "recovery", keyId: string): Uint8Array {
  return utf8Encode(`munib-vault:v1:wrap:${kind}:${keyId}`);
}

async function wrapDek(
  backend: VaultCryptoBackend,
  kek: Uint8Array,
  dek: Uint8Array,
  aad: Uint8Array,
): Promise<WrappedKey> {
  const iv = backend.randomBytes(VAULT_IV_BYTES);
  const ct = await backend.aesGcmEncrypt(kek, iv, dek, aad);
  return { iv: bytesToBase64(iv), ct: bytesToBase64(ct) };
}

/** Returns the DEK, or `null` when the KEK is wrong (GCM auth failure). */
async function unwrapDek(
  backend: VaultCryptoBackend,
  kek: Uint8Array,
  wrapped: WrappedKey,
  aad: Uint8Array,
): Promise<Uint8Array | null> {
  try {
    const dek = await backend.aesGcmDecrypt(
      kek,
      base64ToBytes(wrapped.iv),
      base64ToBytes(wrapped.ct),
      aad,
    );
    return dek.length === VAULT_KEY_BYTES ? dek : null;
  } catch {
    return null;
  }
}

export function derivePassphraseKek(
  backend: VaultCryptoBackend,
  passphrase: string,
  salt: Uint8Array,
  params: ScryptParams = VAULT_SCRYPT_PARAMS,
): Promise<Uint8Array> {
  return backend.scrypt(utf8Encode(normalizePassphrase(passphrase)), salt, params, VAULT_KEY_BYTES);
}

/** The recovery code already carries 256 bits of entropy, so HKDF (no stretching) suffices. */
function deriveRecoveryKek(entropy: Uint8Array, salt: Uint8Array): Uint8Array {
  return hkdf(sha256, entropy, salt, utf8Encode("munib-vault:v1:recovery-kek"), VAULT_KEY_BYTES);
}

/** Splits user input (spaces, new lines, commas, numbering) into lowercase words. */
export function parseRecoveryWords(input: string | readonly string[]): string[] {
  const text = typeof input === "string" ? input : input.join(" ");
  return text
    .toLowerCase()
    .replace(/\d+[.)]/g, " ")
    .split(/[\s,;]+/)
    .filter(Boolean);
}

function recoveryEntropy(words: readonly string[]): Uint8Array {
  const phrase = words.join(" ");
  if (words.length !== VAULT_RECOVERY_WORD_COUNT || !validateMnemonic(phrase, englishWordlist)) {
    throw new VaultError("vault-invalid-recovery-code");
  }
  return mnemonicToEntropy(phrase, englishWordlist);
}

/** True when the words form a checksum-valid 24-word code (UI enables "Unlock" on this). */
export function isRecoveryCodeWellFormed(input: string | readonly string[]): boolean {
  try {
    recoveryEntropy(parseRecoveryWords(input));
    return true;
  } catch {
    return false;
  }
}

async function buildRecovery(
  backend: VaultCryptoBackend,
  dek: Uint8Array,
  keyId: string,
): Promise<{ recovery: VaultKeyring["recovery"]; words: string[] }> {
  const entropy = backend.randomBytes(RECOVERY_ENTROPY_BYTES);
  const salt = backend.randomBytes(VAULT_SALT_BYTES);
  const kek = deriveRecoveryKek(entropy, salt);
  try {
    const wrapped = await wrapDek(backend, kek, dek, wrapAad("recovery", keyId));
    const words = entropyToMnemonic(entropy, englishWordlist).split(" ");
    return { recovery: { kdf: "hkdf-sha256", salt: bytesToBase64(salt), wrapped }, words };
  } finally {
    wipeBytes(kek);
    wipeBytes(entropy);
  }
}

async function buildPassphrase(
  backend: VaultCryptoBackend,
  dek: Uint8Array,
  keyId: string,
  passphrase: string,
): Promise<VaultKeyring["passphrase"]> {
  if (passphraseLength(passphrase) < VAULT_MIN_PASSPHRASE_LENGTH) {
    throw new VaultError("vault-weak-passphrase");
  }
  const salt = backend.randomBytes(VAULT_SALT_BYTES);
  const kek = await derivePassphraseKek(backend, passphrase, salt, VAULT_SCRYPT_PARAMS);
  try {
    const wrapped = await wrapDek(backend, kek, dek, wrapAad("passphrase", keyId));
    return {
      kdf: "scrypt",
      params: { ...VAULT_SCRYPT_PARAMS },
      salt: bytesToBase64(salt),
      wrapped,
    };
  } finally {
    wipeBytes(kek);
  }
}

/** Creates the sync keyring for `dek`; the recovery words are returned once and never stored. */
export async function createKeyring(
  backend: VaultCryptoBackend,
  dek: Uint8Array,
  passphrase: string,
  nowIso: string,
): Promise<{ keyring: VaultKeyring; recoveryWords: string[] }> {
  const keyId = deriveKeyId(dek);
  const passphraseCopy = await buildPassphrase(backend, dek, keyId, passphrase);
  const { recovery, words } = await buildRecovery(backend, dek, keyId);
  return {
    keyring: {
      v: 1,
      keyId,
      createdAt: nowIso,
      updatedAt: nowIso,
      passphrase: { ...passphraseCopy, updatedAt: nowIso },
      recovery: { ...recovery, updatedAt: nowIso },
    },
    recoveryWords: words,
  };
}

/** New passphrase copy (old one not needed — the caller already holds the DEK). */
export async function rewrapPassphrase(
  backend: VaultCryptoBackend,
  keyring: VaultKeyring,
  dek: Uint8Array,
  passphrase: string,
  nowIso: string,
): Promise<VaultKeyring> {
  assertKeyringMatches(keyring, dek);
  const passphraseCopy = await buildPassphrase(backend, dek, keyring.keyId, passphrase);
  return {
    ...keyring,
    passphrase: { ...passphraseCopy, updatedAt: nowIso },
    recovery: { ...keyring.recovery, updatedAt: partStamp(keyring, "recovery") },
    updatedAt: nowIso,
  };
}

/** Replaces the recovery copy; any previously shown code stops working. */
export async function regenerateRecoveryCode(
  backend: VaultCryptoBackend,
  keyring: VaultKeyring,
  dek: Uint8Array,
  nowIso: string,
): Promise<{ keyring: VaultKeyring; recoveryWords: string[] }> {
  assertKeyringMatches(keyring, dek);
  const { recovery, words } = await buildRecovery(backend, dek, keyring.keyId);
  return {
    keyring: {
      ...keyring,
      passphrase: { ...keyring.passphrase, updatedAt: partStamp(keyring, "passphrase") },
      recovery: { ...recovery, updatedAt: nowIso },
      updatedAt: nowIso,
    },
    recoveryWords: words,
  };
}

function assertKeyringMatches(keyring: VaultKeyring, dek: Uint8Array): void {
  if (keyring.keyId !== deriveKeyId(dek)) throw new VaultError("vault-key-mismatch");
}

/** Unwraps the DEK with the passphrase — `vault-wrong-passphrase` on failure. */
export async function unwrapWithPassphrase(
  backend: VaultCryptoBackend,
  keyring: VaultKeyring,
  passphrase: string,
): Promise<Uint8Array> {
  if (!isVaultKeyring(keyring)) throw new VaultError("vault-corrupt");
  const { params, salt, wrapped } = keyring.passphrase;
  const kek = await derivePassphraseKek(backend, passphrase, base64ToBytes(salt), params);
  try {
    const dek = await unwrapDek(backend, kek, wrapped, wrapAad("passphrase", keyring.keyId));
    if (!dek) throw new VaultError("vault-wrong-passphrase");
    if (deriveKeyId(dek) !== keyring.keyId) throw new VaultError("vault-corrupt");
    return dek;
  } finally {
    wipeBytes(kek);
  }
}

/**
 * Unwraps the DEK with the 24-word code — `vault-invalid-recovery-code` when the
 * words aren't a valid code, `vault-wrong-recovery-code` when it's another code.
 */
export async function unwrapWithRecoveryCode(
  backend: VaultCryptoBackend,
  keyring: VaultKeyring,
  input: string | readonly string[],
): Promise<Uint8Array> {
  if (!isVaultKeyring(keyring)) throw new VaultError("vault-corrupt");
  const entropy = recoveryEntropy(parseRecoveryWords(input));
  const kek = deriveRecoveryKek(entropy, base64ToBytes(keyring.recovery.salt));
  try {
    const dek = await unwrapDek(
      backend,
      kek,
      keyring.recovery.wrapped,
      wrapAad("recovery", keyring.keyId),
    );
    if (!dek) throw new VaultError("vault-wrong-recovery-code");
    if (deriveKeyId(dek) !== keyring.keyId) throw new VaultError("vault-corrupt");
    return dek;
  } finally {
    wipeBytes(kek);
    wipeBytes(entropy);
  }
}

function isWrappedKey(value: unknown): value is WrappedKey {
  return (
    value != null &&
    typeof value === "object" &&
    typeof (value as WrappedKey).iv === "string" &&
    typeof (value as WrappedKey).ct === "string"
  );
}

/** Shape check — mirrors the API's keyring validator. */
export function isVaultKeyring(value: unknown): value is VaultKeyring {
  if (value == null || typeof value !== "object" || Array.isArray(value)) return false;
  const k = value as VaultKeyring;
  const params = k.passphrase?.params;
  return (
    k.v === 1 &&
    typeof k.keyId === "string" &&
    /^[0-9a-f]{16}$/.test(k.keyId) &&
    typeof k.createdAt === "string" &&
    typeof k.updatedAt === "string" &&
    k.passphrase?.kdf === "scrypt" &&
    params != null &&
    // Bounded so a tampered keyring can't make unlock burn minutes / GBs.
    Number.isInteger(params.N) &&
    params.N >= 2 ** 14 &&
    params.N <= 2 ** 20 &&
    Number.isInteger(params.r) &&
    params.r >= 1 &&
    params.r <= 16 &&
    Number.isInteger(params.p) &&
    params.p >= 1 &&
    params.p <= 4 &&
    typeof k.passphrase.salt === "string" &&
    isWrappedKey(k.passphrase.wrapped) &&
    isOptionalStamp(k.passphrase.updatedAt) &&
    k.recovery?.kdf === "hkdf-sha256" &&
    typeof k.recovery.salt === "string" &&
    isWrappedKey(k.recovery.wrapped) &&
    isOptionalStamp(k.recovery.updatedAt)
  );
}

function isOptionalStamp(value: unknown): boolean {
  return value === undefined || typeof value === "string";
}

type KeyringPart = "passphrase" | "recovery";

/**
 * When one wrapped copy was made. Keyrings written before per-copy stamps fall
 * back to the keyring's `updatedAt`, an upper bound on the copy's age.
 */
function partStamp(keyring: VaultKeyring, part: KeyringPart): string {
  return keyring[part].updatedAt ?? keyring.updatedAt;
}

/** Deterministic tie-break for two copies with the same stamp. */
function partKey(keyring: VaultKeyring, part: KeyringPart): string {
  return `${keyring[part].salt}:${keyring[part].wrapped.iv}:${keyring[part].wrapped.ct}`;
}

function newerPart(l: VaultKeyring, r: VaultKeyring, part: KeyringPart): "l" | "r" {
  const sl = partStamp(l, part);
  const sr = partStamp(r, part);
  if (sl !== sr) return sl > sr ? "l" : "r";
  return partKey(l, part) >= partKey(r, part) ? "l" : "r";
}

/**
 * Converges two keyrings.
 *
 * Same DEK: the passphrase copy and the recovery copy each merge last-write-
 * wins on their own stamp. A recovery code regenerated on device A therefore
 * survives a later passphrase change on device B, even though B's keyring
 * still carried the old recovery copy. A whole-keyring last-write-wins would
 * have silently revived the old code. When one side wins both copies, that
 * object is returned as is.
 *
 * Different DEKs (two devices opted in before seeing each other): the older
 * keyring wins on every device, ties broken by keyId, so both sides agree.
 * The losing device then re-joins with the winning passphrase, and its
 * documents are re-encrypted and merged.
 */
export function mergeKeyrings(local: unknown, remote: unknown): VaultKeyring | null {
  const l = isVaultKeyring(local) ? local : null;
  const r = isVaultKeyring(remote) ? remote : null;
  if (!l || !r) return l ?? r;
  if (l.keyId === r.keyId) {
    const passphrase = newerPart(l, r, "passphrase");
    const recovery = newerPart(l, r, "recovery");
    if (passphrase === "l" && recovery === "l") return l;
    if (passphrase === "r" && recovery === "r") return r;
    const pick = (side: "l" | "r") => (side === "l" ? l : r);
    return {
      ...l,
      // ISO strings: sort order is time order.
      createdAt: [l.createdAt, r.createdAt].sort()[0] as string,
      updatedAt: [l.updatedAt, r.updatedAt].sort()[1] as string,
      passphrase: {
        ...pick(passphrase).passphrase,
        updatedAt: partStamp(pick(passphrase), "passphrase"),
      },
      recovery: { ...pick(recovery).recovery, updatedAt: partStamp(pick(recovery), "recovery") },
    };
  }
  if (l.createdAt !== r.createdAt) return l.createdAt < r.createdAt ? l : r;
  return l.keyId < r.keyId ? l : r;
}
