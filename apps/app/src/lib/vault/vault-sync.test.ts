import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";
import { applyRemoteBlob, buildBlobRecords, isBlobEntity } from "@/sync/blob-sync";
import { resetVaultTestState, TEST_PASSPHRASE } from "@/test-support/mocks/vault";

import { deleteItem, liveItems, mergeVaultDocs, putItem, type VaultDoc } from "./doc-merge";
import { readVaultSyncState } from "./sync-state";
import type { VaultEnvelope } from "./types";
import { getVaultStatus, setUpVaultSync, unlockVault, vault } from "./vault";
import { registerVaultDocMerge, VAULT_SYNC_ENTITIES } from "./vault-docs";
import { isPushableVaultDoc, isPushableVaultKeyring } from "./vault-sync";

jest.mock("react-native-quick-crypto", () => require("react-native-quick-crypto/jest"));
jest.mock(
  "@/lib/storage/safe-secure-store",
  () => require("@/test-support/mocks/safe-secure-store").safeSecureStoreMock,
);

type Note = { text: string };
const T0 = "2026-11-20T00:00:00.000Z";
const T1 = "2026-11-21T00:00:00.000Z";
const NOW = "2026-11-23T00:00:00.000Z";

const vaultEntities = (records: Awaited<ReturnType<typeof buildBlobRecords>>) =>
  records.filter((r) => r.entity.startsWith("vault_")).map((r) => r.entity);

beforeEach(resetVaultTestState);

describe("vault blob sync", () => {
  it("registers the vault entities", () => {
    expect(VAULT_SYNC_ENTITIES).toEqual([
      "vault_keyring",
      "vault_muhasabah",
      "vault_debts",
      "vault_wasiyyah",
      "vault_relatives",
      "vault_excused",
      "vault_khushu",
    ]);
    for (const entity of VAULT_SYNC_ENTITIES) expect(isBlobEntity(entity)).toBe(true);
  });

  it("pushes nothing until the user opts in, then ciphertext only", async () => {
    await vault.write("debts", putItem({ v: 1, items: {} }, "a", { text: "secret" }, T0), T0);
    expect(vaultEntities(await buildBlobRecords(NOW))).toEqual([]);

    await setUpVaultSync(TEST_PASSPHRASE, T0);
    const records = await buildBlobRecords(NOW);
    expect(vaultEntities(records).sort()).toEqual(["vault_debts", "vault_keyring"]);
    expect(JSON.stringify(records)).not.toContain("secret");
  });

  it("D2: never pushes a vault value that isn't ciphertext", async () => {
    await vault.write("debts", putItem({ v: 1, items: {} }, "a", { text: "x" }, T0), T0);
    await setUpVaultSync(TEST_PASSPHRASE, T0);
    const envelope = await readJSON<VaultEnvelope | null>(DB_KEYS.vaultDebts, null);
    expect(isPushableVaultDoc(envelope)).toBe(true);
    expect(isPushableVaultDoc(null)).toBe(true);
    expect(isPushableVaultKeyring(await readJSON(DB_KEYS.vaultKeyring, null))).toBe(true);

    // Plaintext under a vault key (e.g. a hand-edited backup) stays on the device.
    const plaintext = { v: 1, items: { a: { id: "a", text: "owed to Bilal" } } };
    expect(isPushableVaultDoc(plaintext)).toBe(false);
    expect(isPushableVaultKeyring(plaintext)).toBe(false);
    await writeJSON(DB_KEYS.vaultDebts, plaintext);
    const records = await buildBlobRecords(NOW);
    expect(vaultEntities(records)).not.toContain("vault_debts");
    expect(JSON.stringify(records)).not.toContain("Bilal");
  });

  it("parks pulled records while not opted in, and applies them on unlock", async () => {
    // Device A syncs a vault.
    await vault.write("muhasabah", putItem({ v: 1, items: {} }, "d1", { text: "A" }, T0), T0);
    await setUpVaultSync(TEST_PASSPHRASE, T0);
    const pushed = await buildBlobRecords(NOW);

    // Device B (fresh install) pulls A's records before opting in.
    await resetVaultTestState();
    for (const record of pushed) {
      const applied = await applyRemoteBlob(
        record.entity,
        record.data as Record<string, unknown>,
        record.updatedAt,
      );
      if (record.entity.startsWith("vault_")) expect(applied).toBe(false);
    }
    expect(await readJSON(DB_KEYS.vaultMuhasabah, null)).toBeNull();
    expect(Object.keys((await readVaultSyncState()).inbox).sort()).toEqual([
      "vault_keyring",
      "vault_muhasabah",
    ]);
    expect((await getVaultStatus()).syncAvailableFromOtherDevice).toBe(true);

    await unlockVault({ passphrase: TEST_PASSPHRASE }, { enableSync: true });
    expect(liveItems(await vault.read<Note>("muhasabah")).map((i) => i.text)).toEqual(["A"]);
  });

  it("merges a pulled document into the local one when opted in", async () => {
    await vault.write("debts", putItem({ v: 1, items: {} }, "a", { text: "A" }, T0), T0);
    await setUpVaultSync(TEST_PASSPHRASE, T0);
    const local = await readJSON<VaultEnvelope | null>(DB_KEYS.vaultDebts, null);
    await buildBlobRecords(NOW); // track the local state

    // Another device (same key) adds an item.
    await vault.update<Note>("debts", (doc) => putItem(doc, "b", { text: "B" }, T1));
    const remote = await readJSON<VaultEnvelope | null>(DB_KEYS.vaultDebts, null);
    // Roll local back to before that edit, then pull the remote.
    await vault.update<Note>("debts", (doc) => ({ ...doc, items: { a: doc.items.a } }) as never);
    expect(await applyRemoteBlob("vault_debts", { value: remote }, T1)).toBe(true);

    const ids = liveItems(await vault.read<Note>("debts"))
      .map((i) => i.id)
      .sort();
    expect(ids).toEqual(["a", "b"]);
    expect(local).not.toBeNull();
  });

  it("locks a device whose keyring lost to another device's older vault", async () => {
    // Device A (older keyring).
    await vault.write("debts", putItem({ v: 1, items: {} }, "a", { text: "A" }, T0), T0);
    await setUpVaultSync(TEST_PASSPHRASE, T0);
    const fromA = await buildBlobRecords(NOW);

    // Device B opts in later with its own key.
    await resetVaultTestState();
    await vault.write("debts", putItem({ v: 1, items: {} }, "b", { text: "B" }, T1), T1);
    await setUpVaultSync("device b passphrase", T1);

    for (const record of fromA) {
      await applyRemoteBlob(
        record.entity,
        record.data as Record<string, unknown>,
        record.updatedAt,
      );
    }
    expect(await getVaultStatus()).toMatchObject({ state: "locked", lockReason: "key-mismatch" });
    // Gate closed: B no longer pushes its documents over A's.
    expect(vaultEntities(await buildBlobRecords(NOW))).not.toContain("vault_debts");

    // B unlocks with A's passphrase: its doc is re-encrypted under A's key and merged.
    await unlockVault({ passphrase: TEST_PASSPHRASE });
    expect((await getVaultStatus()).state).toBe("ready");
    expect(
      liveItems(await vault.read<Note>("debts"))
        .map((i) => i.id)
        .sort(),
    ).toEqual(["a", "b"]);
    expect(vaultEntities(await buildBlobRecords(NOW))).toContain("vault_debts");
  });

  it("H1: a local edit saved while a pull is merging is kept and pushed", async () => {
    await vault.write("wasiyyah", putItem({ v: 1, items: {} }, "a", { text: "A" }, T0), T0);
    await setUpVaultSync(TEST_PASSPHRASE, T0);
    await buildBlobRecords(NOW);
    // Another device (same key) adds "b"; roll local back before pulling it.
    await vault.update<Note>("wasiyyah", (doc) => putItem(doc, "b", { text: "B" }, T1));
    const remote = await readJSON<VaultEnvelope | null>(DB_KEYS.vaultWasiyyah, null);
    await vault.update<Note>("wasiyyah", (doc) => ({ ...doc, items: { a: doc.items.a } }) as never);

    // The user saves "c" while the (async decrypt → merge → re-encrypt) pull runs.
    let edit: Promise<unknown> | null = null;
    registerVaultDocMerge("wasiyyah", (local, incoming) => {
      edit ??= vault.update<Note>("wasiyyah", (doc) => putItem(doc, "c", { text: "C" }, T1));
      return mergeVaultDocs(local, incoming);
    });
    try {
      await applyRemoteBlob("vault_wasiyyah", { value: remote }, T1);
      await edit;
    } finally {
      registerVaultDocMerge("wasiyyah", mergeVaultDocs);
    }

    const ids = (doc: VaultDoc<Note>) =>
      liveItems(doc)
        .map((i) => i.id)
        .sort();
    expect(ids(await vault.read<Note>("wasiyyah"))).toEqual(["a", "b", "c"]);
    // …and the edit is pushed, not masked by the tracker.
    const pushed = (await buildBlobRecords("2026-11-24T00:00:00.000Z")).find(
      (r) => r.entity === "vault_wasiyyah",
    );
    expect(pushed?.updatedAt).toBe("2026-11-24T00:00:00.000Z");
  });

  it("M4: never pushes over (or nulls) a remote document this device can't decrypt", async () => {
    // Device A's ciphertext.
    await vault.write("debts", putItem({ v: 1, items: {} }, "a", { text: "A" }, T0), T0);
    await setUpVaultSync(TEST_PASSPHRASE, T0);
    const fromA = (await buildBlobRecords(NOW)).find((r) => r.entity === "vault_debts");
    expect(fromA).toBeDefined();

    // Device B: its own key + keyring (gate open), no debts document of its own.
    await resetVaultTestState();
    await vault.write("muhasabah", putItem({ v: 1, items: {} }, "m", { text: "M" }, T1), T1);
    await setUpVaultSync("device b passphrase", T1);
    await buildBlobRecords(NOW);

    const recordAt = "2026-11-22T08:00:00.000Z";
    expect(
      await applyRemoteBlob("vault_debts", fromA?.data as Record<string, unknown>, recordAt),
    ).toBe(false);
    expect(await readJSON(DB_KEYS.vaultDebts, null)).toBeNull();
    // Parked with the record's own timestamp (not "now"), and pushes pause.
    expect((await readVaultSyncState()).inbox.vault_debts?.updatedAt).toBe(recordAt);
    const later = await buildBlobRecords("2026-11-24T00:00:00.000Z");
    expect(vaultEntities(later)).not.toContain("vault_debts");
    expect((await getVaultStatus()).heldDocs).toEqual(["debts"]);
  });

  it("H2: a merged document over the 256 KB cap is parked, never thrown, and retried after cleanup", async () => {
    const big = (tag: string) => ({ text: tag.repeat(110_000) });
    await vault.write("debts", putItem({ v: 1, items: {} }, "a", big("a"), T0), T0);
    await setUpVaultSync(TEST_PASSPHRASE, T0);
    await buildBlobRecords(NOW);
    // Same key, another device: a different large item.
    await vault.update<Note>("debts", (doc) => putItem({ ...doc, items: {} }, "b", big("b"), T1));
    const remote = await readJSON<VaultEnvelope | null>(DB_KEYS.vaultDebts, null);
    await vault.write("debts", putItem({ v: 1, items: {} }, "a", big("a"), T0), T0);
    const localBefore = await readJSON<VaultEnvelope | null>(DB_KEYS.vaultDebts, null);

    await expect(applyRemoteBlob("vault_debts", { value: remote }, T1)).resolves.toBe(false);
    expect(await readJSON(DB_KEYS.vaultDebts, null)).toEqual(localBefore);
    expect((await readVaultSyncState()).inbox.vault_debts).toBeDefined();
    expect(vaultEntities(await buildBlobRecords(NOW))).not.toContain("vault_debts");

    // The user makes room; the next push merges the parked copy and resumes.
    await vault.update<Note>("debts", (doc) => deleteItem(doc, "a", T1));
    const records = await buildBlobRecords("2026-11-24T00:00:00.000Z");
    expect(vaultEntities(records)).toContain("vault_debts");
    expect((await readVaultSyncState()).inbox.vault_debts).toBeUndefined();
    expect(liveItems(await vault.read<Note>("debts")).map((i) => i.id)).toEqual(["b"]);
  });
});
