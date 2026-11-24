import {
  deleteSecureItem,
  getSecureItem,
  isSecureStoreAccessDeniedError,
  setSecureItem,
} from "@/lib/storage/safe-secure-store";

import { base64ToBytes, bytesToBase64 } from "./encoding";
import { VaultError } from "./errors";
import type { ScryptParams, VaultCryptoBackend } from "./types";

/**
 * Native vault crypto (iOS / Android / tvOS / Android TV).
 *
 * - AES-256-GCM and scrypt run in C++ through `react-native-quick-crypto`
 *   (Nitro module, already autolinked for the PIN-lock PBKDF2 polyfill — see
 *   `lib/crypto/ensure-web-crypto.ts`; not in `TV_EXCLUDED_PACKAGES`).
 * - The 256-bit DEK lives in the Keychain / Keystore via `safe-secure-store`
 *   (`WHEN_UNLOCKED_THIS_DEVICE_ONLY`, so it never leaves the device in an OS
 *   backup — restoring ciphertext on a new phone needs the passphrase or code).
 *
 * quick-crypto is required lazily so app start-up never pays for the Nitro
 * hybrid objects unless the vault is used. Jest maps it to node:crypto via the
 * package's own `react-native-quick-crypto/jest` mock.
 */

export const VAULT_DEK_SECURE_KEY = "munib_tracker_vault_dek_v1";

/** The slice of quick-crypto's node-compatible API the vault uses (also what node:crypto offers). */
interface GcmCipher {
  setAAD(aad: Uint8Array): unknown;
  update(data: Uint8Array): Uint8Array;
  final(): Uint8Array;
  getAuthTag(): Uint8Array;
}
interface GcmDecipher {
  setAAD(aad: Uint8Array): unknown;
  setAuthTag(tag: Uint8Array): unknown;
  update(data: Uint8Array): Uint8Array;
  final(): Uint8Array;
}
interface QuickCrypto {
  randomBytes(length: number): Uint8Array;
  createCipheriv(algorithm: "aes-256-gcm", key: Uint8Array, iv: Uint8Array): GcmCipher;
  createDecipheriv(algorithm: "aes-256-gcm", key: Uint8Array, iv: Uint8Array): GcmDecipher;
  scrypt(
    password: Uint8Array,
    salt: Uint8Array,
    keyLength: number,
    options: ScryptParams & { maxmem: number },
    callback: (error: Error | null, derived?: Uint8Array) => void,
  ): void;
}

let quickCrypto: QuickCrypto | null = null;

function qc(): QuickCrypto {
  if (quickCrypto) return quickCrypto;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- lazy native module
    quickCrypto = require("react-native-quick-crypto") as unknown as QuickCrypto;
    return quickCrypto;
  } catch {
    throw new VaultError("vault-unavailable");
  }
}

/** Plain `Uint8Array` copy (quick-crypto / node return Buffer subclasses). */
function toBytes(value: ArrayBufferView | ArrayBuffer): Uint8Array {
  const view =
    value instanceof ArrayBuffer
      ? new Uint8Array(value)
      : new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
  return Uint8Array.from(view);
}

const TAG_BYTES = 16;
/** 128·N·r = 32 MiB for N=2^15, r=8 — quick-crypto/node reject it at their 32 MiB default. */
const SCRYPT_MAXMEM = 64 * 1024 * 1024;

export const vaultCrypto: VaultCryptoBackend = {
  platform: "native",

  randomBytes(length) {
    return toBytes(qc().randomBytes(length));
  },

  async aesGcmEncrypt(key, iv, plaintext, aad) {
    const cipher = qc().createCipheriv("aes-256-gcm", key, iv);
    cipher.setAAD(aad);
    const head = toBytes(cipher.update(plaintext));
    const tail = toBytes(cipher.final());
    const tag = toBytes(cipher.getAuthTag());
    const out = new Uint8Array(head.length + tail.length + tag.length);
    out.set(head, 0);
    out.set(tail, head.length);
    out.set(tag, head.length + tail.length);
    return out;
  },

  async aesGcmDecrypt(key, iv, ciphertext, aad) {
    if (ciphertext.length < TAG_BYTES) throw new VaultError("vault-corrupt");
    const decipher = qc().createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAAD(aad);
    decipher.setAuthTag(ciphertext.subarray(ciphertext.length - TAG_BYTES));
    const head = toBytes(decipher.update(ciphertext.subarray(0, ciphertext.length - TAG_BYTES)));
    const tail = toBytes(decipher.final());
    const out = new Uint8Array(head.length + tail.length);
    out.set(head, 0);
    out.set(tail, head.length);
    return out;
  },

  scrypt(password, salt, params, keyLength) {
    return new Promise((resolve, reject) => {
      qc().scrypt(
        password,
        salt,
        keyLength,
        { N: params.N, r: params.r, p: params.p, maxmem: SCRYPT_MAXMEM },
        (error, derived) => {
          if (error || !derived) reject(error ?? new VaultError("vault-unavailable"));
          else resolve(toBytes(derived));
        },
      );
    });
  },

  async loadDek() {
    let stored: string | null;
    try {
      stored = await getSecureItem(VAULT_DEK_SECURE_KEY, { throwOnAccessDenied: true });
    } catch (error) {
      // A locked Keychain is not "no key": report it as transient (M5).
      if (isSecureStoreAccessDeniedError(error)) throw new VaultError("vault-key-unavailable");
      throw error;
    }
    if (!stored) return null;
    try {
      const bytes = base64ToBytes(stored);
      return bytes.length === 32 ? bytes : null;
    } catch {
      return null;
    }
  },

  async saveDek(dek) {
    const ok = await setSecureItem(VAULT_DEK_SECURE_KEY, bytesToBase64(dek));
    if (!ok) throw new VaultError("vault-unavailable");
  },

  async deleteDek() {
    await deleteSecureItem(VAULT_DEK_SECURE_KEY);
  },
};
