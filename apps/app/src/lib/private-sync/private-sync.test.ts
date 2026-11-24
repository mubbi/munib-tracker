import AsyncStorage from "@react-native-async-storage/async-storage";
import { DB_KEYS } from "@/db/keys";
import { PrayerRepository } from "@/db/repositories/prayer-repository";
import { PreferencesRepository } from "@/db/repositories/preferences-repository";
import { readJSON, writeJSON } from "@/db/store";
import { deleteItem, getLiveItem, putItem } from "@/lib/vault/doc-merge";
import { setUpVaultSync, vault } from "@/lib/vault/vault";
import { resetVaultTestState, TEST_PASSPHRASE } from "@/test-support/mocks/vault";

import {
  EXCUSED_ACTIVE_ID,
  excusedDayId,
  type KhushuItem,
  reconcilePrivateMirrors,
  reconcileVaultMirror,
  UNKNOWN_LOCAL,
  type VaultMirror,
} from "./index";

jest.mock("react-native-quick-crypto", () => require("react-native-quick-crypto/jest"));
jest.mock(
  "@/lib/storage/safe-secure-store",
  () => require("@/test-support/mocks/safe-secure-store").safeSecureStoreMock,
);

const T0 = "2026-11-20T00:00:00.000Z";
const T1 = "2026-11-21T00:00:00.000Z";
const T2 = "2026-11-22T00:00:00.000Z";

type Item = { text: string };

/** In-memory local store behind a mirror of the `khushu` doc (the generic engine). */
function fakeMirror(initial: Record<string, Item | typeof UNKNOWN_LOCAL> = {}) {
  const local: Record<string, Item | typeof UNKNOWN_LOCAL> = { ...initial };
  const applied: Record<string, Item | null>[] = [];
  const mirror: VaultMirror<Item> = {
    docId: "khushu",
    readLocal: async () => ({ ...local }),
    applyToLocal: async (changes) => {
      applied.push(changes);
      for (const [id, value] of Object.entries(changes)) {
        if (value) local[id] = value;
        else delete local[id];
      }
    },
  };
  return { mirror, local, applied };
}

async function optIn(): Promise<void> {
  await setUpVaultSync(TEST_PASSPHRASE, T0);
}

beforeEach(resetVaultTestState);

describe("reconcileVaultMirror (D46 3-way mirror)", () => {
  it("does nothing while vault sync is off — the data stays on the device", async () => {
    const { mirror } = fakeMirror({ a: { text: "private" } });
    await expect(reconcileVaultMirror(mirror, T1)).resolves.toEqual({ pushed: 0, applied: 0 });
    expect(await readJSON(DB_KEYS.vaultKhushu, null)).toBeNull();
  });

  it("mirrors local items into the doc as ciphertext once opted in", async () => {
    await optIn();
    const { mirror } = fakeMirror({ a: { text: "private reflection" } });

    await expect(reconcileVaultMirror(mirror, T1)).resolves.toEqual({ pushed: 1, applied: 0 });

    const doc = await vault.read<Item>("khushu");
    expect(getLiveItem(doc, "a")).toMatchObject({ text: "private reflection", updatedAt: T1 });
    const stored = JSON.stringify(await readJSON(DB_KEYS.vaultKhushu, null));
    expect(stored).not.toContain("private reflection");
    // Nothing changed since: a second pass is a no-op.
    await expect(reconcileVaultMirror(mirror, T2)).resolves.toEqual({ pushed: 0, applied: 0 });
  });

  it("applies another device's edits and deletes, and pushes local deletes as tombstones", async () => {
    await optIn();
    const { mirror, local } = fakeMirror({ a: { text: "one" }, b: { text: "two" } });
    await reconcileVaultMirror(mirror, T1);

    // Another device edited `a` and deleted `b` (arrived through the vault merge).
    await vault.update<Item>("khushu", (doc) =>
      deleteItem(putItem(doc, "a", { text: "edited" }, T2), "b", T2),
    );
    await expect(reconcileVaultMirror(mirror, T2)).resolves.toEqual({ pushed: 0, applied: 2 });
    expect(local).toEqual({ a: { text: "edited" } });

    // This device deletes `a`.
    delete local.a;
    await expect(reconcileVaultMirror(mirror, T2)).resolves.toEqual({ pushed: 1, applied: 0 });
    expect((await vault.read<Item>("khushu")).items.a?.deletedAt).toBe(T2);
  });

  it("never deletes local data because the doc is missing (vault reset), it re-mirrors it", async () => {
    await optIn();
    const { mirror, local } = fakeMirror({ a: { text: "keep me" } });
    await reconcileVaultMirror(mirror, T1);
    await AsyncStorage.removeItem(DB_KEYS.vaultKhushu);

    await expect(reconcileVaultMirror(mirror, T2)).resolves.toEqual({ pushed: 1, applied: 0 });
    expect(local).toEqual({ a: { text: "keep me" } });
  });

  it("fills an unknown local value from the doc, and lets docWins resolve a double edit", async () => {
    await optIn();
    await vault.write("khushu", putItem({ v: 1, items: {} }, "a", { text: "from vault" }, T0), T0);
    const { mirror, local } = fakeMirror({ a: UNKNOWN_LOCAL });
    await reconcileVaultMirror(mirror, T1);
    expect(local.a).toEqual({ text: "from vault" });

    local.a = { text: "local edit" };
    await vault.update<Item>("khushu", (doc) => putItem(doc, "a", { text: "newer remote" }, T2));
    await reconcileVaultMirror({ ...mirror, docWins: () => true }, T2);
    expect(local.a).toEqual({ text: "newer remote" });
  });
});

describe("excused + khushu mirrors (vault round-trip)", () => {
  const LOG = {
    id: "p",
    prayerId: "fajr" as const,
    date: "2026-11-19",
    status: "pending" as const,
    isExcused: true,
    excusedReason: "nifas" as const,
    updatedAt: T0,
    source: "manual" as const,
  };
  const ENTRY = {
    id: "k1",
    date: "2026-11-19",
    prayerId: "fajr" as const,
    rating: 4,
    note: "private reflection",
    createdAt: T0,
    updatedAt: T0,
  };

  it("carries the excused period and journal through the vault and back", async () => {
    await PreferencesRepository.update({ activeExcusedReason: "hayd", updatedAt: T0 });
    await PrayerRepository.upsertLog(LOG);
    await writeJSON(DB_KEYS.khushuJournal, { "2026-11-19:fajr": ENTRY });
    await optIn();

    await expect(reconcilePrivateMirrors(T1)).resolves.toEqual({ pushed: 3, applied: 0 });
    const excused = await vault.read("excused");
    expect(getLiveItem(excused, EXCUSED_ACTIVE_ID)).toMatchObject({ reason: "hayd" });
    expect(getLiveItem(excused, excusedDayId("2026-11-19"))).toMatchObject({ reason: "nifas" });
    expect(getLiveItem<KhushuItem>(await vault.read("khushu"), "2026-11-19:fajr")?.entry).toEqual(
      ENTRY,
    );
    const ciphertext = JSON.stringify([
      await readJSON(DB_KEYS.vaultExcused, null),
      await readJSON(DB_KEYS.vaultKhushu, null),
    ]);
    for (const secret of ["hayd", "nifas", "private reflection"]) {
      expect(ciphertext).not.toContain(secret);
    }

    // Simulate a device whose plaintext sync delivered only the stripped data.
    await PreferencesRepository.patchLocal({ activeExcusedReason: undefined });
    await PrayerRepository.upsertLog({ ...LOG, excusedReason: undefined });
    await writeJSON(DB_KEYS.khushuJournal, {});
    await AsyncStorage.removeItem(DB_KEYS.vaultMirrorBase);
    const before = (await PreferencesRepository.get()).updatedAt;

    await expect(reconcilePrivateMirrors(T2)).resolves.toEqual({ pushed: 0, applied: 3 });

    const prefs = await PreferencesRepository.get();
    expect(prefs.activeExcusedReason).toBe("hayd");
    // Applied locally without stamping `updatedAt` (no preferences push is due).
    expect(prefs.updatedAt).toBe(before);
    await expect(PrayerRepository.getLog("fajr", "2026-11-19")).resolves.toMatchObject({
      excusedReason: "nifas",
      updatedAt: T0,
    });
    await expect(readJSON(DB_KEYS.khushuJournal, {})).resolves.toEqual({
      "2026-11-19:fajr": ENTRY,
    });
  });

  it("is device-only while vault sync is off", async () => {
    await PreferencesRepository.update({ activeExcusedReason: "sick", updatedAt: T0 });
    await expect(reconcilePrivateMirrors(T1)).resolves.toEqual({ pushed: 0, applied: 0 });
    expect(await readJSON(DB_KEYS.vaultExcused, null)).toBeNull();
  });
});
