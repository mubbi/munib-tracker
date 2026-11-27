import { scryptAsync } from "@noble/hashes/scrypt.js";

import { utf8Encode } from "./encoding";
import { VaultError } from "./errors";
import type { VaultCryptoBackend } from "./types";

/**
 * Web vault crypto.
 *
 * - AES-256-GCM via WebCrypto (`crypto.subtle`).
 * - scrypt via `@noble/hashes` (audited pure JS; WebCrypto has no scrypt). The
 *   plan text says "wasm scrypt" — pure JS keeps the bundle free of a wasm
 *   loader and is fast enough on desktop/mobile browsers for N=2^15.
 * - Key custody: IndexedDB holds a **non-extractable** AES-GCM `CryptoKey`
 *   (the device key — script can use it but never read its bytes) plus the
 *   DEK wrapped under it. Wrapping, rather than storing the DEK itself as a
 *   non-extractable key, is what lets the DEK be re-wrapped under the
 *   passphrase / recovery code when the user opts in to sync: WebCrypto can't
 *   wrap a non-extractable key. Clearing site data destroys the device key, so
 *   the ciphertext in AsyncStorage (localStorage) becomes unreadable without
 *   the passphrase or code — the same guarantee as native.
 */

/** Minimal async key/value surface over IndexedDB, injectable for tests. */
export interface WebKeyStore {
  get(name: string): Promise<unknown>;
  put(name: string, value: unknown): Promise<void>;
  delete(name: string): Promise<void>;
}

const DB_NAME = "munib-vault";
const STORE = "keys";
const DEVICE_KEY = "device-key";
const WRAPPED_DEK = "wrapped-dek";
const DEVICE_AAD = utf8Encode("munib-vault:v1:device-dek");

function idbRequest<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new VaultError("vault-unavailable"));
  });
}

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  if (typeof indexedDB === "undefined") return Promise.reject(new VaultError("vault-unavailable"));
  const request = indexedDB.open(DB_NAME, 1);
  request.onupgradeneeded = () => {
    if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE);
  };
  dbPromise = idbRequest(request).catch((error) => {
    dbPromise = null;
    throw error;
  });
  return dbPromise;
}

async function withStore<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await openDb();
  return idbRequest(run(db.transaction(STORE, mode).objectStore(STORE)));
}

export const indexedDbKeyStore: WebKeyStore = {
  get: (name) => withStore("readonly", (store) => store.get(name)),
  put: async (name, value) => {
    await withStore("readwrite", (store) => store.put(value, name));
  },
  delete: async (name) => {
    await withStore("readwrite", (store) => store.delete(name));
  },
};

function subtle(): SubtleCrypto {
  const s = globalThis.crypto?.subtle;
  if (!s) throw new VaultError("vault-unavailable");
  return s;
}

/** Fresh ArrayBuffer-backed copy — WebCrypto's `BufferSource` rejects shared/offset views. */
function buf(bytes: Uint8Array): Uint8Array<ArrayBuffer> {
  return new Uint8Array(bytes);
}

async function importAesKey(raw: Uint8Array): Promise<CryptoKey> {
  return subtle().importKey("raw", buf(raw), { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
}

async function gcmEncryptWithKey(
  key: CryptoKey,
  iv: Uint8Array,
  plaintext: Uint8Array,
  aad: Uint8Array,
): Promise<Uint8Array> {
  const out = await subtle().encrypt(
    { name: "AES-GCM", iv: buf(iv), additionalData: buf(aad), tagLength: 128 },
    key,
    buf(plaintext),
  );
  return new Uint8Array(out);
}

async function gcmDecryptWithKey(
  key: CryptoKey,
  iv: Uint8Array,
  ciphertext: Uint8Array,
  aad: Uint8Array,
): Promise<Uint8Array> {
  const out = await subtle().decrypt(
    { name: "AES-GCM", iv: buf(iv), additionalData: buf(aad), tagLength: 128 },
    key,
    buf(ciphertext),
  );
  return new Uint8Array(out);
}

interface StoredWrappedDek {
  iv: Uint8Array;
  ct: Uint8Array;
}

function isStoredWrappedDek(value: unknown): value is StoredWrappedDek {
  return (
    value != null &&
    typeof value === "object" &&
    (value as StoredWrappedDek).iv instanceof Uint8Array &&
    (value as StoredWrappedDek).ct instanceof Uint8Array
  );
}

export function createWebVaultCrypto(
  keyStore: WebKeyStore = indexedDbKeyStore,
): VaultCryptoBackend {
  const randomBytes = (length: number): Uint8Array => {
    const c = globalThis.crypto;
    if (!c?.getRandomValues) throw new VaultError("vault-unavailable");
    return c.getRandomValues(new Uint8Array(length));
  };

  return {
    platform: "web",
    randomBytes,

    async aesGcmEncrypt(key, iv, plaintext, aad) {
      return gcmEncryptWithKey(await importAesKey(key), iv, plaintext, aad);
    },

    async aesGcmDecrypt(key, iv, ciphertext, aad) {
      return gcmDecryptWithKey(await importAesKey(key), iv, ciphertext, aad);
    },

    async scrypt(password, salt, params, keyLength) {
      return scryptAsync(password, salt, {
        N: params.N,
        r: params.r,
        p: params.p,
        dkLen: keyLength,
        // Yield to the event loop so the UI (spinner) keeps painting.
        asyncTick: 10,
      });
    },

    async loadDek() {
      const [deviceKey, wrapped] = await Promise.all([
        keyStore.get(DEVICE_KEY),
        keyStore.get(WRAPPED_DEK),
      ]);
      if (!(deviceKey instanceof CryptoKey) || !isStoredWrappedDek(wrapped)) return null;
      try {
        return await gcmDecryptWithKey(deviceKey, wrapped.iv, wrapped.ct, DEVICE_AAD);
      } catch {
        return null;
      }
    },

    async saveDek(dek) {
      try {
        let deviceKey = await keyStore.get(DEVICE_KEY);
        if (!(deviceKey instanceof CryptoKey)) {
          deviceKey = await subtle().generateKey({ name: "AES-GCM", length: 256 }, false, [
            "encrypt",
            "decrypt",
          ]);
          await keyStore.put(DEVICE_KEY, deviceKey);
        }
        const iv = randomBytes(12);
        const ct = await gcmEncryptWithKey(deviceKey as CryptoKey, iv, dek, DEVICE_AAD);
        await keyStore.put(WRAPPED_DEK, { iv, ct } satisfies StoredWrappedDek);
      } catch (error) {
        if (error instanceof VaultError) throw error;
        throw new VaultError("vault-unavailable");
      }
    },

    async deleteDek() {
      await Promise.all([keyStore.delete(WRAPPED_DEK), keyStore.delete(DEVICE_KEY)]);
    },
  };
}

export const vaultCrypto: VaultCryptoBackend = createWebVaultCrypto();
