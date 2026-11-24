import { webcrypto } from "node:crypto";

import { TEST_PASSPHRASE } from "@/test-support/mocks/vault";

import { vaultCrypto as nativeCrypto } from "./crypto.native";
import { createWebVaultCrypto, type WebKeyStore } from "./crypto.web";
import { utf8Encode } from "./encoding";
import { openDocument, sealDocument } from "./envelope";
import { createKeyring, unwrapWithPassphrase, unwrapWithRecoveryCode } from "./keyring";

jest.mock("react-native-quick-crypto", () => require("react-native-quick-crypto/jest"));
jest.mock(
  "@/lib/storage/safe-secure-store",
  () => require("@/test-support/mocks/safe-secure-store").safeSecureStoreMock,
);

// Jest's environment may not expose WebCrypto globals; use Node's implementation.
if (!globalThis.crypto?.subtle) {
  Object.defineProperty(globalThis, "crypto", { value: webcrypto, configurable: true });
}
if (typeof globalThis.CryptoKey === "undefined") {
  Object.defineProperty(globalThis, "CryptoKey", {
    value: (webcrypto as unknown as { CryptoKey: unknown }).CryptoKey,
    configurable: true,
  });
}

/** In-memory stand-in for IndexedDB (structured clone keeps CryptoKey objects as-is). */
function memoryKeyStore(): WebKeyStore & { map: Map<string, unknown> } {
  const map = new Map<string, unknown>();
  return {
    map,
    get: async (name) => map.get(name),
    put: async (name, value) => {
      map.set(name, value);
    },
    delete: async (name) => {
      map.delete(name);
    },
  };
}

const NOW = "2026-11-23T00:00:00.000Z";

describe("web vault crypto", () => {
  it("keeps the DEK behind a non-extractable device key and round-trips it", async () => {
    const store = memoryKeyStore();
    const web = createWebVaultCrypto(store);
    const dek = web.randomBytes(32);

    await web.saveDek(dek);
    const deviceKey = store.map.get("device-key") as CryptoKey;
    expect(deviceKey.extractable).toBe(false);
    const wrapped = store.map.get("wrapped-dek") as { ct: Uint8Array };
    expect(wrapped.ct).toHaveLength(48);
    expect(wrapped.ct.subarray(0, 32)).not.toEqual(dek);
    expect(await web.loadDek()).toEqual(dek);

    await web.deleteDek();
    expect(store.map.size).toBe(0);
    expect(await web.loadDek()).toBeNull();
  });

  it("interoperates with the native backend (same AES-GCM framing and scrypt)", async () => {
    const web = createWebVaultCrypto(memoryKeyStore());
    const dek = web.randomBytes(32);
    const envelope = await sealDocument(web, dek, "debts", { hello: "world" }, NOW);
    expect(await openDocument(nativeCrypto, dek, "debts", envelope)).toEqual({ hello: "world" });

    const salt = utf8Encode("0123456789abcdef");
    const params = { N: 1024, r: 8, p: 1 };
    const password = utf8Encode(TEST_PASSPHRASE);
    expect(await web.scrypt(password, salt, params, 32)).toEqual(
      await nativeCrypto.scrypt(password, salt, params, 32),
    );
  });

  it("unlocks on native a keyring created on web (passphrase and recovery code)", async () => {
    const web = createWebVaultCrypto(memoryKeyStore());
    const dek = web.randomBytes(32);
    const { keyring, recoveryWords } = await createKeyring(web, dek, TEST_PASSPHRASE, NOW);

    expect(await unwrapWithPassphrase(nativeCrypto, keyring, TEST_PASSPHRASE)).toEqual(dek);
    expect(await unwrapWithRecoveryCode(nativeCrypto, keyring, recoveryWords)).toEqual(dek);
  });
});
