import { describe, expect, it } from "vitest";

import { SYNC_ENTITIES } from "./sync.dto";
import {
  isValidVaultPayload,
  VAULT_ENTITIES,
  VAULT_MAX_RECORD_BYTES,
} from "./vault-payload.validator";

const NOW = "2026-11-23T00:00:00.000Z";

const envelope = {
  v: 1,
  alg: "A256GCM",
  keyId: "0123456789abcdef",
  iv: "AAAAAAAAAAAAAAAA",
  ct: "c2VjcmV0IGNpcGhlcnRleHQ=",
  updatedAt: NOW,
};

const wrapped = { iv: "AAAAAAAAAAAAAAAA", ct: "A".repeat(64) };
const keyring = {
  v: 1,
  keyId: "0123456789abcdef",
  createdAt: NOW,
  updatedAt: NOW,
  passphrase: { kdf: "scrypt", params: { N: 32768, r: 8, p: 1 }, salt: "A".repeat(24), wrapped },
  recovery: { kdf: "hkdf-sha256", salt: "A".repeat(24), wrapped },
};

/** Per-record payload check: SyncService.push skips (never stores) a record that fails it. */
function push(entity: string, data: unknown): string[] {
  return isValidVaultPayload(entity, data) ? [] : ["vaultPayload"];
}

describe("vault sync payload validation", () => {
  it("whitelists the five vault entities", () => {
    for (const entity of VAULT_ENTITIES) expect(SYNC_ENTITIES).toContain(entity);
  });

  it("accepts a VaultEnvelope for documents and a keyring for vault_keyring", () => {
    expect(push("vault_debts", { value: envelope })).toHaveLength(0);
    expect(push("vault_keyring", { value: keyring })).toHaveLength(0);
    // A cleared vault propagates as null.
    expect(push("vault_muhasabah", { value: null })).toHaveLength(0);
  });

  it("rejects plaintext or malformed envelopes", () => {
    expect(
      push("vault_debts", { value: { items: { a: { note: "plaintext" } } } }),
    ).not.toHaveLength(0);
    expect(push("vault_debts", { value: { ...envelope, alg: "none" } })).not.toHaveLength(0);
    expect(push("vault_debts", { value: { ...envelope, extra: "leak" } })).not.toHaveLength(0);
    expect(push("vault_debts", { value: { ...envelope, keyId: "XYZ" } })).not.toHaveLength(0);
    expect(push("vault_debts", { value: envelope, other: 1 })).not.toHaveLength(0);
    // A document entity can't carry a keyring and vice versa.
    expect(push("vault_debts", { value: keyring })).not.toHaveLength(0);
    expect(push("vault_keyring", { value: envelope })).not.toHaveLength(0);
  });

  it("rejects keyrings with abusive scrypt parameters", () => {
    const params = (p: object) => ({
      value: { ...keyring, passphrase: { ...keyring.passphrase, params: p } },
    });
    expect(isValidVaultPayload("vault_keyring", params({ N: 2 ** 22, r: 8, p: 1 }))).toBe(false);
    expect(isValidVaultPayload("vault_keyring", params({ N: 30000, r: 8, p: 1 }))).toBe(false);
    expect(isValidVaultPayload("vault_keyring", params({ N: 32768, r: 8, p: 9 }))).toBe(false);
  });

  it("caps a vault record at 256 KB", () => {
    const big = "A".repeat(VAULT_MAX_RECORD_BYTES);
    expect(push("vault_relatives", { value: { ...envelope, ct: big } })).not.toHaveLength(0);
    const fits = "A".repeat(VAULT_MAX_RECORD_BYTES - 1024);
    expect(push("vault_relatives", { value: { ...envelope, ct: fits } })).toHaveLength(0);
  });

  it("accepts per-copy stamps on the keyring's passphrase and recovery copies", () => {
    const stamped = {
      ...keyring,
      passphrase: { ...keyring.passphrase, updatedAt: NOW },
      recovery: { ...keyring.recovery, updatedAt: NOW },
    };
    expect(push("vault_keyring", { value: stamped })).toHaveLength(0);
    const bad = { ...keyring, recovery: { ...keyring.recovery, updatedAt: "yesterday" } };
    expect(push("vault_keyring", { value: bad })).not.toHaveLength(0);
  });

  it("leaves non-vault entities unaffected", () => {
    expect(push("fasting", { value: { "2026-03-01": "fasted" } })).toHaveLength(0);
  });
});
