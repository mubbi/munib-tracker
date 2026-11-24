import { BACKUP_KEYS, DB_KEYS, RESET_KEYS } from "@/db/keys";
import { readJSON } from "@/db/store";
import { exportBackup } from "@/lib/backup";
import { wipeLocalDeviceData } from "@/lib/wipe-local-data";
import { mockSecureStore } from "@/test-support/mocks/safe-secure-store";
import { resetVaultTestState, TEST_PASSPHRASE } from "@/test-support/mocks/vault";

import { VAULT_DEK_SECURE_KEY } from "./crypto.native";
import { putItem } from "./doc-merge";
import { getVaultStatus, setUpVaultSync, vault } from "./vault";
import { VAULT_DOC_STORAGE_KEYS } from "./vault-docs";

jest.mock("react-native-quick-crypto", () => require("react-native-quick-crypto/jest"));
jest.mock(
  "@/lib/storage/safe-secure-store",
  () => require("@/test-support/mocks/safe-secure-store").safeSecureStoreMock,
);
jest.mock("@/lib/cache-manager", () => ({
  clearDownloadedAudio: jest.fn(async () => undefined),
  clearDownloadedQcfFonts: jest.fn(async () => undefined),
}));
jest.mock("@/lib/appSurfaces/widgets/snapshotStorage", () => ({
  emptyWidgetSnapshot: () => ({ version: 1 }),
  writeWidgetSnapshot: jest.fn(async () => undefined),
}));
jest.mock("@/stores/quran-listener-store", () => {
  const remove = jest.fn(async () => undefined);
  return { quranListenerStore: { getState: () => ({ remove }) } };
});
jest.mock("@/stores/quran-pronunciation-store", () => ({
  wipePronunciationModels: jest.fn(async () => undefined),
}));
jest.mock("@/stores/reload-all-stores", () => ({
  reloadAllStores: jest.fn(async () => undefined),
}));

const T0 = "2026-11-20T00:00:00.000Z";

beforeEach(resetVaultTestState);

describe("vault wipe + backup plumbing", () => {
  it("classifies vault ciphertext + keyring as backed-up userData and wipes them on reset", () => {
    for (const key of [...Object.values(VAULT_DOC_STORAGE_KEYS), DB_KEYS.vaultKeyring]) {
      expect(BACKUP_KEYS).toContain(key);
      expect(RESET_KEYS).toContain(key);
    }
    expect(BACKUP_KEYS).not.toContain(DB_KEYS.vaultSyncState);
    expect(RESET_KEYS).toContain(DB_KEYS.vaultSyncState);
  });

  it("exports vault documents into a backup as ciphertext only", async () => {
    await vault.write("debts", putItem({ v: 1, items: {} }, "a", { note: "private" }, T0), T0);
    const backup = await exportBackup(T0);
    expect(backup).toContain(DB_KEYS.vaultDebts);
    expect(backup).not.toContain("private");
  });

  it("wipeLocalDeviceData deletes the DEK from secure storage and the ciphertext", async () => {
    await vault.write("debts", putItem({ v: 1, items: {} }, "a", { note: "x" }, T0), T0);
    await setUpVaultSync(TEST_PASSPHRASE, T0);
    expect(mockSecureStore.has(VAULT_DEK_SECURE_KEY)).toBe(true);

    await wipeLocalDeviceData();

    expect(mockSecureStore.has(VAULT_DEK_SECURE_KEY)).toBe(false);
    expect(await readJSON(DB_KEYS.vaultDebts, null)).toBeNull();
    expect(await readJSON(DB_KEYS.vaultKeyring, null)).toBeNull();
    expect(await getVaultStatus()).toMatchObject({ state: "ready", hasKeyring: false });
  });
});
