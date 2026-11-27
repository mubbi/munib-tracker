import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";
import { resetVaultTestState, switchToFreshDevice } from "@/test-support/mocks/vault";

import { putItem } from "./doc-merge";
import { vault } from "./vault";
import {
  clearVaultUnlockSession,
  isVaultSessionUnlocked,
  markVaultUnlocked,
  shouldPromptVaultUnlock,
  VAULT_UNLOCK_GRACE_MS,
  vaultLockPrefStore,
} from "./vault-lock";
import { createVaultStore, reloadVaultStores } from "./vault-store";

jest.mock("react-native-quick-crypto", () => require("react-native-quick-crypto/jest"));
jest.mock(
  "@/lib/storage/safe-secure-store",
  () => require("@/test-support/mocks/safe-secure-store").safeSecureStoreMock,
);

type Relative = { name: string };
const relatives = createVaultStore<Relative>("relatives");

beforeEach(async () => {
  await resetVaultTestState();
  relatives.store.setState({ isReady: false, items: [], doc: { v: 1, items: {} }, status: "idle" });
});

describe("createVaultStore", () => {
  it("returns the same store for the same document", () => {
    expect(createVaultStore("relatives")).toBe(relatives);
  });

  it("puts, removes (tombstone) and persists encrypted", async () => {
    await relatives.actions.load();
    await relatives.actions.put("r1", { name: "Aunt Khadijah" });
    await relatives.actions.put("r2", { name: "Cousin Yusuf" });
    await relatives.actions.remove("r1");

    expect(relatives.store.getState().items.map((i) => i.name)).toEqual(["Cousin Yusuf"]);
    expect(JSON.stringify(await readJSON(DB_KEYS.vaultRelatives, null))).not.toContain("Yusuf");
    expect((await vault.read<Relative>("relatives")).items.r1?.deletedAt).toBeTruthy();
  });

  it("reloads when the document changes underneath (sync merge / restore)", async () => {
    await relatives.actions.load();
    await vault.write(
      "relatives",
      putItem({ v: 1, items: {} }, "x", { name: "From sync" }, "2026-11-23T00:00:00.000Z"),
    );
    await reloadVaultStores();
    expect(relatives.store.getState().items.map((i) => i.name)).toEqual(["From sync"]);
  });

  it("surfaces a locked vault as status 'locked' instead of throwing on load", async () => {
    await relatives.actions.put("r1", { name: "x" });
    switchToFreshDevice();
    relatives.store.setState({ isReady: false });
    await relatives.actions.load();
    expect(relatives.store.getState()).toMatchObject({ status: "locked", error: "vault-locked" });
  });
});

describe("vault lock", () => {
  it("prompts only when the pref is on, a PIN exists and the session is locked", () => {
    expect(
      shouldPromptVaultUnlock({ lockJournals: true, pinEnabled: true, sessionUnlocked: false }),
    ).toBe(true);
    expect(
      shouldPromptVaultUnlock({ lockJournals: false, pinEnabled: true, sessionUnlocked: false }),
    ).toBe(false);
    expect(
      shouldPromptVaultUnlock({ lockJournals: true, pinEnabled: false, sessionUnlocked: false }),
    ).toBe(false);
    expect(
      shouldPromptVaultUnlock({ lockJournals: true, pinEnabled: true, sessionUnlocked: true }),
    ).toBe(false);
  });

  it("keeps an unlock session for the grace period only", () => {
    markVaultUnlocked(1_000);
    expect(isVaultSessionUnlocked(1_000 + VAULT_UNLOCK_GRACE_MS - 1)).toBe(true);
    expect(isVaultSessionUnlocked(1_000 + VAULT_UNLOCK_GRACE_MS)).toBe(false);
    clearVaultUnlockSession();
    expect(isVaultSessionUnlocked(1_001)).toBe(false);
  });

  it("persists the device-local 'Lock private journals' pref", async () => {
    await vaultLockPrefStore.getState().setLockJournals(true);
    expect(await readJSON(DB_KEYS.vaultLockJournals, false)).toBe(true);
    await writeJSON(DB_KEYS.vaultLockJournals, false);
    await vaultLockPrefStore.getState().load();
    expect(vaultLockPrefStore.getState().lockJournals).toBe(false);
  });
});
