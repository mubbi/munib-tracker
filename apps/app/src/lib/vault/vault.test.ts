import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";
import {
  mockGetSecureItem,
  mockSecureStore,
  mockSetSecureItem,
} from "@/test-support/mocks/safe-secure-store";
import {
  OTHER_PASSPHRASE,
  resetVaultTestState,
  switchToFreshDevice,
  TEST_PASSPHRASE,
  tamperBase64,
} from "@/test-support/mocks/vault";

import { VAULT_DEK_SECURE_KEY } from "./crypto.native";
import { liveItems, putItem, type VaultDoc } from "./doc-merge";
import { isVaultError } from "./errors";
import { mergeKeyrings } from "./keyring";
import { readVaultSyncState, stashVaultRecord } from "./sync-state";
import type { VaultEnvelope, VaultKeyring } from "./types";
import {
  changeVaultPassphrase,
  deleteVaultKey,
  forgetVaultKeyCache,
  getVaultStatus,
  mergeDocEnvelopes,
  regenerateVaultRecoveryCode,
  resetVaultOnDevice,
  setUpVaultSync,
  unlockVault,
  vault,
  verifyVaultPassphrase,
} from "./vault";

jest.mock("react-native-quick-crypto", () => require("react-native-quick-crypto/jest"));
jest.mock(
  "@/lib/storage/safe-secure-store",
  () => require("@/test-support/mocks/safe-secure-store").safeSecureStoreMock,
);

type Entry = { amount: number; note: string };
const T0 = "2026-11-20T10:00:00.000Z";
const T1 = "2026-11-21T10:00:00.000Z";
const T2 = "2026-11-22T10:00:00.000Z";

function docWith(...entries: [string, Entry, string][]): VaultDoc<Entry> {
  return entries.reduce<VaultDoc<Entry>>((doc, [id, value, at]) => putItem(doc, id, value, at), {
    v: 1,
    items: {},
  });
}

async function expectVaultError(promise: Promise<unknown>, code: string): Promise<void> {
  const error = await promise.then(
    () => null,
    (e: unknown) => e,
  );
  expect(isVaultError(error)).toBe(true);
  expect((error as { code: string }).code).toBe(code);
}

beforeEach(resetVaultTestState);

describe("vault at rest", () => {
  it("round-trips a document through AES-256-GCM and never stores plaintext", async () => {
    const doc = docWith(["a", { amount: 150, note: "owed to Bilal" }, T0]);
    await vault.write("debts", doc, T0);

    const stored = await readJSON<VaultEnvelope | null>(DB_KEYS.vaultDebts, null);
    expect(stored).toMatchObject({ v: 1, alg: "A256GCM", updatedAt: T0 });
    expect(JSON.stringify(stored)).not.toContain("Bilal");
    expect(mockSecureStore.has(VAULT_DEK_SECURE_KEY)).toBe(true);

    expect(await vault.read<Entry>("debts")).toEqual(doc);
  });

  it("reads an empty document before anything is written", async () => {
    expect(await vault.read("muhasabah")).toEqual({ v: 1, items: {} });
  });

  it("surfaces tampered ciphertext as vault-corrupt (GCM auth failure)", async () => {
    await vault.write("wasiyyah", docWith(["main", { amount: 0, note: "x" }, T0]), T0);
    const stored = (await readJSON<VaultEnvelope | null>(
      DB_KEYS.vaultWasiyyah,
      null,
    )) as VaultEnvelope;
    await writeJSON(DB_KEYS.vaultWasiyyah, { ...stored, ct: tamperBase64(stored.ct) });

    await expectVaultError(vault.read("wasiyyah"), "vault-corrupt");
  });

  it("rejects an envelope moved to another document (AAD binding)", async () => {
    await vault.write("debts", docWith(["a", { amount: 1, note: "n" }, T0]), T0);
    await writeJSON(DB_KEYS.vaultRelatives, await readJSON(DB_KEYS.vaultDebts, null));
    await expectVaultError(vault.read("relatives"), "vault-corrupt");
  });

  it("reports locked (not empty) when ciphertext exists without a DEK", async () => {
    await vault.write("debts", docWith(["a", { amount: 1, note: "n" }, T0]), T0);
    switchToFreshDevice();

    expect((await getVaultStatus()).state).toBe("locked");
    await expectVaultError(vault.read("debts"), "vault-locked");
    // Never silently mints a second key over existing ciphertext.
    await expectVaultError(vault.write("debts", { v: 1, items: {} }), "vault-locked");
  });

  it("notifies subscribers of the written document only", async () => {
    const debts = jest.fn();
    const muhasabah = jest.fn();
    const off = vault.subscribe("debts", debts);
    vault.subscribe("muhasabah", muhasabah);
    await vault.update<Entry>("debts", (doc) => putItem(doc, "a", { amount: 2, note: "" }, T0));
    off();
    expect(debts).toHaveBeenCalledTimes(1);
    expect(muhasabah).not.toHaveBeenCalled();
  });
});

describe("opt-in sync keys", () => {
  it("sets up sync with a passphrase and a 24-word recovery code", async () => {
    const { recoveryWords } = await setUpVaultSync(TEST_PASSPHRASE, T0);
    expect(recoveryWords).toHaveLength(24);
    const keyring = await readJSON<VaultKeyring | null>(DB_KEYS.vaultKeyring, null);
    expect(keyring?.passphrase.params).toEqual({ N: 32768, r: 8, p: 1 });
    expect(JSON.stringify(keyring)).not.toContain(recoveryWords.join(" "));
    expect((await readVaultSyncState()).enabled).toBe(true);
    expect(await getVaultStatus()).toMatchObject({
      state: "ready",
      syncEnabled: true,
      hasKeyring: true,
    });
  });

  it("rejects a passphrase under 10 characters", async () => {
    await expectVaultError(setUpVaultSync("short pw", T0), "vault-weak-passphrase");
  });

  it("wrong passphrase → typed vault-wrong-passphrase error", async () => {
    await vault.write("debts", docWith(["a", { amount: 1, note: "n" }, T0]), T0);
    await setUpVaultSync(TEST_PASSPHRASE, T0);
    switchToFreshDevice();

    await expectVaultError(unlockVault({ passphrase: OTHER_PASSPHRASE }), "vault-wrong-passphrase");
    expect(await verifyVaultPassphrase(TEST_PASSPHRASE).catch(() => "no")).toBe(true);
  });

  it("unlocks a new device (restored ciphertext) with the passphrase", async () => {
    const doc = docWith(["a", { amount: 9, note: "zakat" }, T0]);
    await vault.write("debts", doc, T0);
    await setUpVaultSync(TEST_PASSPHRASE, T0);
    switchToFreshDevice();

    await unlockVault({ passphrase: TEST_PASSPHRASE });
    expect(await vault.read<Entry>("debts")).toEqual(doc);
    expect((await getVaultStatus()).state).toBe("ready");
  });

  it("unlocks with the recovery code and rejects malformed or foreign codes", async () => {
    const doc = docWith(["a", { amount: 3, note: "r" }, T0]);
    await vault.write("relatives", doc, T0);
    const { recoveryWords } = await setUpVaultSync(TEST_PASSPHRASE, T0);
    switchToFreshDevice();

    await expectVaultError(
      unlockVault({ recoveryCode: recoveryWords.slice(0, 23).join(" ") }),
      "vault-invalid-recovery-code",
    );
    // A different, checksum-valid code.
    const foreign = "abandon ".repeat(23).concat("art");
    await expectVaultError(unlockVault({ recoveryCode: foreign }), "vault-wrong-recovery-code");

    await unlockVault({ recoveryCode: `  ${recoveryWords.join("\n").toUpperCase()} ` });
    expect(await vault.read<Entry>("relatives")).toEqual(doc);
  });

  it("changes the passphrase and regenerates the recovery code", async () => {
    await vault.write("debts", docWith(["a", { amount: 1, note: "n" }, T0]), T0);
    const first = await setUpVaultSync(TEST_PASSPHRASE, T0);
    await changeVaultPassphrase(OTHER_PASSPHRASE, T1);
    const second = await regenerateVaultRecoveryCode(T2);
    expect(second.recoveryWords).not.toEqual(first.recoveryWords);
    switchToFreshDevice();

    await expectVaultError(unlockVault({ passphrase: TEST_PASSPHRASE }), "vault-wrong-passphrase");
    await expectVaultError(
      unlockVault({ recoveryCode: first.recoveryWords }),
      "vault-wrong-recovery-code",
    );
    await unlockVault({ recoveryCode: second.recoveryWords });
    expect((await getVaultStatus()).state).toBe("ready");
  });
});

describe("merge", () => {
  it("merges two diverged documents per item with tombstones, then re-encrypts", async () => {
    // Device A writes the base, syncs; device B takes the same DEK via the passphrase.
    const base = docWith(
      ["keep", { amount: 1, note: "base" }, T0],
      ["edit", { amount: 2, note: "base" }, T0],
      ["gone", { amount: 3, note: "base" }, T0],
    );
    await vault.write("debts", base, T0);
    await setUpVaultSync(TEST_PASSPHRASE, T0);

    // Local (A): edits "edit" late, adds "a-only".
    await vault.update<Entry>("debts", (doc) =>
      putItem(
        putItem(doc, "edit", { amount: 20, note: "A" }, T2),
        "a-only",
        { amount: 5, note: "A" },
        T1,
      ),
    );
    const localRaw = await readJSON<VaultEnvelope | null>(DB_KEYS.vaultDebts, null);

    // Remote (B): edits "edit" earlier, deletes "gone", adds "b-only".
    await vault.update<Entry>("debts", () => {
      let doc = putItem(base, "edit", { amount: 99, note: "B" }, T1);
      doc = {
        ...doc,
        items: { ...doc.items, gone: { id: "gone", updatedAt: T1, deletedAt: T1 } as never },
      };
      return putItem(doc, "b-only", { amount: 7, note: "B" }, T1);
    });
    const remoteRaw = await readJSON<VaultEnvelope | null>(DB_KEYS.vaultDebts, null);

    const outcome = await mergeDocEnvelopes("debts", localRaw, remoteRaw, T2);
    expect(outcome.kind).toBe("merged");
    const merged = outcome.value as VaultEnvelope;
    expect(merged.ct).not.toBe(localRaw?.ct);
    expect(merged.ct).not.toBe(remoteRaw?.ct);

    await writeJSON(DB_KEYS.vaultDebts, merged);
    const doc = await vault.read<Entry>("debts");
    const live = Object.fromEntries(liveItems(doc).map((item) => [item.id, item.amount]));
    expect(live).toEqual({ keep: 1, edit: 20, "a-only": 5, "b-only": 7 });
    expect(doc.items.gone?.deletedAt).toBe(T1);
  });

  it("returns the remote envelope untouched when it already contains the local state", async () => {
    await vault.write("debts", docWith(["a", { amount: 1, note: "n" }, T0]), T0);
    await setUpVaultSync(TEST_PASSPHRASE, T0);
    const localRaw = await readJSON(DB_KEYS.vaultDebts, null);
    await vault.update<Entry>("debts", (doc) => putItem(doc, "b", { amount: 2, note: "m" }, T1));
    const remoteRaw = await readJSON(DB_KEYS.vaultDebts, null);

    expect(await mergeDocEnvelopes("debts", localRaw, remoteRaw, T2)).toEqual({
      kind: "merged",
      value: remoteRaw,
    });
  });

  it("parks a remote sealed by another device's key instead of failing", async () => {
    await vault.write("debts", docWith(["a", { amount: 1, note: "n" }, T0]), T0);
    const foreign = {
      ...((await readJSON(DB_KEYS.vaultDebts, null)) as VaultEnvelope),
      keyId: "0123456789abcdef",
    };
    const localRaw = await readJSON(DB_KEYS.vaultDebts, null);
    expect(await mergeDocEnvelopes("debts", localRaw, foreign, T1)).toEqual({
      kind: "unreadable-remote",
      value: localRaw,
    });
  });

  it("converges two keyrings created independently on the older one", () => {
    const base = {
      v: 1,
      passphrase: {
        kdf: "scrypt",
        params: { N: 32768, r: 8, p: 1 },
        salt: "AAAA",
        wrapped: { iv: "AAAA", ct: "AAAA" },
      },
      recovery: { kdf: "hkdf-sha256", salt: "AAAA", wrapped: { iv: "AAAA", ct: "AAAA" } },
    };
    const older = { ...base, keyId: "bbbbbbbbbbbbbbbb", createdAt: T0, updatedAt: T2 };
    const newer = { ...base, keyId: "aaaaaaaaaaaaaaaa", createdAt: T1, updatedAt: T1 };
    expect(mergeKeyrings(older, newer)).toBe(older);
    expect(mergeKeyrings(newer, older)).toBe(older);
    const rotated = { ...older, updatedAt: "2026-11-23T00:00:00.000Z" };
    expect(mergeKeyrings(older, rotated)).toBe(rotated);
  });

  it("joins another device's vault: adopts its key, re-encrypts and merges local docs", async () => {
    // Device A: own vault, synced.
    await vault.write("debts", docWith(["a", { amount: 1, note: "A" }, T0]), T0);
    await setUpVaultSync(TEST_PASSPHRASE, T0);
    const keyringA = await readJSON(DB_KEYS.vaultKeyring, null);
    const debtsA = await readJSON(DB_KEYS.vaultDebts, null);

    // Device B: separate install with its own local-only vault.
    await resetVaultOnDevice();
    await vault.write("debts", docWith(["b", { amount: 2, note: "B" }, T1]), T1);
    // A's records arrive while B hasn't opted in → parked, not applied.
    await stashVaultRecord("vault_keyring", keyringA, T0);
    await stashVaultRecord("vault_debts", debtsA, T0);
    expect((await getVaultStatus()).syncAvailableFromOtherDevice).toBe(true);

    await unlockVault({ passphrase: TEST_PASSPHRASE }, { enableSync: true });

    const doc = await vault.read<Entry>("debts");
    expect(
      liveItems(doc)
        .map((i) => i.id)
        .sort(),
    ).toEqual(["a", "b"]);
    expect((await readVaultSyncState()).inbox).toEqual({});
    expect(await getVaultStatus()).toMatchObject({ state: "ready", syncEnabled: true });
  });
});

describe("keyring merge: each wrapped copy is last-write-wins on its own", () => {
  const T3 = "2026-11-23T10:00:00.000Z";

  it("keeps a newer recovery code when another device later changes the passphrase", async () => {
    await vault.write("debts", docWith(["a", { amount: 1, note: "n" }, T0]), T0);
    const first = await setUpVaultSync(TEST_PASSPHRASE, T0);
    const original = (await readJSON<VaultKeyring | null>(
      DB_KEYS.vaultKeyring,
      null,
    )) as VaultKeyring;

    // Device A issues a new recovery code.
    const second = await regenerateVaultRecoveryCode(T1);
    const onA = (await readJSON<VaultKeyring | null>(DB_KEYS.vaultKeyring, null)) as VaultKeyring;
    // Device B never saw it and changes the passphrase later, still carrying the old code.
    await writeJSON(DB_KEYS.vaultKeyring, original);
    await changeVaultPassphrase(OTHER_PASSPHRASE, T3);
    const onB = (await readJSON<VaultKeyring | null>(DB_KEYS.vaultKeyring, null)) as VaultKeyring;

    const merged = mergeKeyrings(onA, onB) as VaultKeyring;
    expect(mergeKeyrings(onB, onA)).toEqual(merged);
    expect(merged.recovery.wrapped).toEqual(onA.recovery.wrapped);
    expect(merged.passphrase.wrapped).toEqual(onB.passphrase.wrapped);
    expect(merged.updatedAt).toBe(T3);
    // Converged: merging again changes nothing.
    expect(mergeKeyrings(merged, onB)).toEqual(merged);
    expect(mergeKeyrings(merged, onA)).toEqual(merged);

    // The merged keyring opens with the newest passphrase and the newest code only.
    await writeJSON(DB_KEYS.vaultKeyring, merged);
    switchToFreshDevice();
    await expectVaultError(
      unlockVault({ recoveryCode: first.recoveryWords }),
      "vault-wrong-recovery-code",
    );
    await unlockVault({ recoveryCode: second.recoveryWords });
    switchToFreshDevice();
    await unlockVault({ passphrase: OTHER_PASSPHRASE });
    expect((await getVaultStatus()).state).toBe("ready");
  });

  it("falls back to whole-keyring last-write-wins for keyrings without per-copy stamps", async () => {
    await setUpVaultSync(TEST_PASSPHRASE, T0);
    const k = (await readJSON<VaultKeyring | null>(DB_KEYS.vaultKeyring, null)) as VaultKeyring;
    const strip = (keyring: VaultKeyring, at: string, ct: string): VaultKeyring => {
      const { updatedAt: _p, ...passphrase } = keyring.passphrase;
      const { updatedAt: _r, ...recovery } = keyring.recovery;
      return {
        ...keyring,
        updatedAt: at,
        passphrase: { ...passphrase, wrapped: { ...passphrase.wrapped, ct } },
        recovery,
      };
    };
    const older = strip(k, T1, k.passphrase.wrapped.ct);
    const newer = strip(k, T2, `${k.passphrase.wrapped.ct.slice(0, -4)}AAAA`);
    expect(mergeKeyrings(older, newer)).toBe(newer);
    expect(mergeKeyrings(newer, older)).toBe(newer);
  });
});

describe("key store temporarily locked (M5)", () => {
  const keychainLocked = () => new Error("User interaction is not allowed.");

  it("reports key-unavailable (never 'no key') and recovers on the next access", async () => {
    await vault.write("debts", docWith(["a", { amount: 1, note: "n" }, T0]), T0);
    forgetVaultKeyCache();
    mockGetSecureItem.mockRejectedValueOnce(keychainLocked());

    const status = await getVaultStatus();
    expect(status).toMatchObject({ state: "unavailable", lockReason: "key-unavailable" });
    expect(status.state).not.toBe("locked");

    // Nothing was cached: the next access reads the key again and works.
    expect(await getVaultStatus()).toMatchObject({ state: "ready", lockReason: null });
    expect(liveItems(await vault.read<Entry>("debts")).map((i) => i.id)).toEqual(["a"]);
  });

  it("a read while the keychain is locked fails as transient, not as vault-locked", async () => {
    await vault.write("debts", docWith(["a", { amount: 1, note: "n" }, T0]), T0);
    forgetVaultKeyCache();
    mockGetSecureItem.mockRejectedValueOnce(keychainLocked());
    await expectVaultError(vault.read("debts"), "vault-key-unavailable");
    expect(liveItems(await vault.read<Entry>("debts"))).toHaveLength(1);
  });

  it("never mints a new data key while the keychain is locked", async () => {
    mockGetSecureItem.mockRejectedValue(keychainLocked());
    await expectVaultError(
      vault.write("debts", docWith(["a", { amount: 1, note: "n" }, T0]), T0),
      "vault-key-unavailable",
    );
    expect(mockSetSecureItem).not.toHaveBeenCalled();
    expect(await readJSON(DB_KEYS.vaultDebts, null)).toBeNull();
  });
});

describe("wipe", () => {
  it("deleteVaultKey removes the DEK from secure storage", async () => {
    await vault.write("debts", docWith(["a", { amount: 1, note: "n" }, T0]), T0);
    expect(mockSecureStore.has(VAULT_DEK_SECURE_KEY)).toBe(true);
    await deleteVaultKey();
    expect(mockSecureStore.has(VAULT_DEK_SECURE_KEY)).toBe(false);
    await expectVaultError(vault.read("debts"), "vault-locked");
  });

  it("resetVaultOnDevice removes documents, keyring, sync state and key", async () => {
    await vault.write("debts", docWith(["a", { amount: 1, note: "n" }, T0]), T0);
    await setUpVaultSync(TEST_PASSPHRASE, T0);
    await resetVaultOnDevice();
    expect(await readJSON(DB_KEYS.vaultDebts, null)).toBeNull();
    expect(await readJSON(DB_KEYS.vaultKeyring, null)).toBeNull();
    expect(mockSecureStore.size).toBe(0);
    expect(await getVaultStatus()).toMatchObject({
      state: "ready",
      hasKeyring: false,
      syncEnabled: false,
    });
  });
});
