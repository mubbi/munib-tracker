import { sha256 } from "@noble/hashes/sha2.js";

import { base64ToBytes, bytesToBase64, bytesToHex, utf8Decode, utf8Encode } from "./encoding";
import { VaultError } from "./errors";
import type { VaultCryptoBackend, VaultEnvelope } from "./types";

/** AES-256 key and GCM nonce sizes. */
export const VAULT_KEY_BYTES = 32;
export const VAULT_IV_BYTES = 12;

/**
 * Sync cap per vault record (server enforces the same number on `data`). The
 * envelope must leave room for the `{ "value": … }` wrapper.
 */
export const VAULT_MAX_RECORD_BYTES = 256 * 1024;
const VAULT_MAX_ENVELOPE_BYTES = VAULT_MAX_RECORD_BYTES - 64;

/**
 * Stable, non-secret fingerprint of a DEK: the first 64 bits of
 * SHA-256(domain ‖ DEK), hex. Lets every envelope and keyring say which key
 * sealed it without storing an extra id next to the key.
 */
export function deriveKeyId(dek: Uint8Array): string {
  const domain = utf8Encode("munib-vault:v1:key-id");
  const input = new Uint8Array(domain.length + dek.length);
  input.set(domain, 0);
  input.set(dek, domain.length);
  return bytesToHex(sha256(input).subarray(0, 8));
}

/** Associated data binds each ciphertext to its document, so envelopes can't be swapped. */
function docAad(docId: string): Uint8Array {
  return utf8Encode(`munib-vault:v1:doc:${docId}`);
}

const ISO_RE = /^\d{4}-\d{2}-\d{2}T/;
const B64_RE = /^[A-Za-z0-9+/]*={0,2}$/;

/** Shape check only (no crypto) — mirrors the API's `VaultEnvelope` validator. */
export function isVaultEnvelope(value: unknown): value is VaultEnvelope {
  if (value == null || typeof value !== "object" || Array.isArray(value)) return false;
  const e = value as Record<string, unknown>;
  return (
    e.v === 1 &&
    e.alg === "A256GCM" &&
    typeof e.keyId === "string" &&
    /^[0-9a-f]{16}$/.test(e.keyId) &&
    typeof e.iv === "string" &&
    B64_RE.test(e.iv) &&
    typeof e.ct === "string" &&
    e.ct.length > 0 &&
    B64_RE.test(e.ct) &&
    typeof e.updatedAt === "string" &&
    ISO_RE.test(e.updatedAt)
  );
}

/** Encrypts a JSON-serialisable document under the DEK. */
export async function sealDocument(
  backend: VaultCryptoBackend,
  dek: Uint8Array,
  docId: string,
  value: unknown,
  updatedAt: string,
): Promise<VaultEnvelope> {
  const iv = backend.randomBytes(VAULT_IV_BYTES);
  const ct = await backend.aesGcmEncrypt(dek, iv, utf8Encode(JSON.stringify(value)), docAad(docId));
  const envelope: VaultEnvelope = {
    v: 1,
    alg: "A256GCM",
    keyId: deriveKeyId(dek),
    iv: bytesToBase64(iv),
    ct: bytesToBase64(ct),
    updatedAt,
  };
  if (JSON.stringify(envelope).length > VAULT_MAX_ENVELOPE_BYTES) {
    throw new VaultError("vault-too-large");
  }
  return envelope;
}

/**
 * Decrypts an envelope. Malformed envelopes and GCM authentication failures
 * (tampering, truncation, bit rot) surface as `vault-corrupt`; an envelope
 * sealed by a different DEK surfaces as `vault-key-mismatch`.
 */
export async function openDocument<T>(
  backend: VaultCryptoBackend,
  dek: Uint8Array,
  docId: string,
  envelope: unknown,
): Promise<T> {
  if (!isVaultEnvelope(envelope)) throw new VaultError("vault-corrupt");
  if (envelope.keyId !== deriveKeyId(dek)) throw new VaultError("vault-key-mismatch");
  let plaintext: Uint8Array;
  try {
    const iv = base64ToBytes(envelope.iv);
    if (iv.length !== VAULT_IV_BYTES) throw new VaultError("vault-corrupt");
    plaintext = await backend.aesGcmDecrypt(dek, iv, base64ToBytes(envelope.ct), docAad(docId));
  } catch (error) {
    if (error instanceof VaultError && error.code === "vault-unavailable") throw error;
    throw new VaultError("vault-corrupt");
  }
  try {
    return JSON.parse(utf8Decode(plaintext)) as T;
  } catch {
    throw new VaultError("vault-corrupt");
  }
}

// ── Binary attachments (device-only files, e.g. a debt's document photo) ────

/** "MVF1" — marks a sealed vault file (format version 1). */
const FILE_MAGIC = utf8Encode("MVF1");
const FILE_KEY_ID_BYTES = 8;
const FILE_HEADER_BYTES = FILE_MAGIC.length + FILE_KEY_ID_BYTES + VAULT_IV_BYTES;

/** Associated data binds a sealed file to its id, so two files can't be swapped on disk. */
function fileAad(fileId: string): Uint8Array {
  return utf8Encode(`munib-vault:v1:file:${fileId}`);
}

function hexToBytes(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}

/**
 * Encrypts raw bytes under the DEK (AES-256-GCM). Layout:
 * `"MVF1" ‖ keyId (8 bytes) ‖ iv (12) ‖ ciphertext ‖ tag (16)`.
 */
export async function sealBytes(
  backend: VaultCryptoBackend,
  dek: Uint8Array,
  fileId: string,
  plaintext: Uint8Array,
): Promise<Uint8Array> {
  const iv = backend.randomBytes(VAULT_IV_BYTES);
  const ct = await backend.aesGcmEncrypt(dek, iv, plaintext, fileAad(fileId));
  const out = new Uint8Array(FILE_HEADER_BYTES + ct.length);
  out.set(FILE_MAGIC, 0);
  out.set(hexToBytes(deriveKeyId(dek)), FILE_MAGIC.length);
  out.set(iv, FILE_MAGIC.length + FILE_KEY_ID_BYTES);
  out.set(ct, FILE_HEADER_BYTES);
  return out;
}

/** The key fingerprint a sealed file was written under, or `null` when it isn't one. */
export function sealedBytesKeyId(sealed: Uint8Array): string | null {
  if (sealed.length <= FILE_HEADER_BYTES + 16) return null;
  for (let i = 0; i < FILE_MAGIC.length; i++) if (sealed[i] !== FILE_MAGIC[i]) return null;
  return bytesToHex(sealed.subarray(FILE_MAGIC.length, FILE_MAGIC.length + FILE_KEY_ID_BYTES));
}

/** Decrypts {@link sealBytes} output (`vault-corrupt` / `vault-key-mismatch` like documents). */
export async function openBytes(
  backend: VaultCryptoBackend,
  dek: Uint8Array,
  fileId: string,
  sealed: Uint8Array,
): Promise<Uint8Array> {
  const keyId = sealedBytesKeyId(sealed);
  if (!keyId) throw new VaultError("vault-corrupt");
  if (keyId !== deriveKeyId(dek)) throw new VaultError("vault-key-mismatch");
  // Copies (not views): some native backends ignore a subarray's byte offset.
  const iv = sealed.slice(FILE_MAGIC.length + FILE_KEY_ID_BYTES, FILE_HEADER_BYTES);
  try {
    return await backend.aesGcmDecrypt(dek, iv, sealed.slice(FILE_HEADER_BYTES), fileAad(fileId));
  } catch (error) {
    if (error instanceof VaultError && error.code === "vault-unavailable") throw error;
    throw new VaultError("vault-corrupt");
  }
}
