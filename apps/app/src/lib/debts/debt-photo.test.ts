import { DB_KEYS } from "@/db/keys";
import { readJSON } from "@/db/store";
import { vaultCrypto } from "@/lib/vault/crypto";
import { bytesToBase64 } from "@/lib/vault/encoding";
import { deriveKeyId, openBytes, sealBytes, sealedBytesKeyId } from "@/lib/vault/envelope";
import { deleteVaultKey, putVaultFile, readVaultFile, resetVaultOnDevice } from "@/lib/vault/vault";
import { reencryptVaultFiles, VAULT_MAX_FILE_BYTES } from "@/lib/vault/vault-files";
import { resetVaultTestState } from "@/test-support/mocks/vault";
import {
  resetVaultFileStoreMock,
  vaultFileStoreContents,
  vaultFileStoreMock,
} from "@/test-support/mocks/vault-file-store";

import {
  DEBT_PHOTO_MAX_BYTES,
  debtPhotoRef,
  loadDebtPhoto,
  parseDebtPhotoRef,
  storeDebtPhoto,
} from "./debt-photo";
import { debtEntries } from "./debts";
import { debtsActions, debtsVault } from "./debts-store";

jest.mock("react-native-quick-crypto", () => require("react-native-quick-crypto/jest"));
jest.mock(
  "@/lib/storage/safe-secure-store",
  () => require("@/test-support/mocks/safe-secure-store").safeSecureStoreMock,
);
jest.mock(
  "@/lib/vault/vault-file-store",
  () => require("@/test-support/mocks/vault-file-store").vaultFileStoreMock,
);
jest.mock(
  "@/lib/quran-companion/reschedule",
  () => require("@/test-support/mocks/reminder-reschedule").reminderRescheduleMock,
);

/** A tiny "JPEG" (SOI marker + payload) — content is irrelevant to the vault. */
const JPEG = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
const idle = { isReady: false, items: [], doc: { v: 1, items: {} }, status: "idle" } as never;

beforeEach(async () => {
  await resetVaultTestState();
  resetVaultFileStoreMock();
  debtsVault.store.setState(idle);
});

describe("debt document photo — encrypted at rest, device-only (NF-3.8)", () => {
  it("round-trips through AES-GCM and stores only ciphertext", async () => {
    const ref = await storeDebtPhoto("dphoto_a", JPEG, "image/jpeg");
    expect(ref).toBe(debtPhotoRef("dphoto_a", "image/jpeg"));
    const sealed = vaultFileStoreContents().get("dphoto_a");
    expect(sealed).toBeDefined();
    expect(Buffer.from(sealed ?? []).includes(Buffer.from(JPEG.slice(4)))).toBe(false);
    expect(await loadDebtPhoto(ref)).toBe(`data:image/jpeg;base64,${bytesToBase64(JPEG)}`);
  });

  it("rejects a tampered or swapped file", async () => {
    await putVaultFile("dphoto_a", JPEG);
    const sealed = new Uint8Array(vaultFileStoreContents().get("dphoto_a") ?? []);
    sealed[sealed.length - 1] ^= 1;
    await vaultFileStoreMock.putFile("dphoto_a", sealed);
    await expect(readVaultFile("dphoto_a")).rejects.toMatchObject({ code: "vault-corrupt" });

    // Same ciphertext under another id fails authentication (AAD binds the id).
    await putVaultFile("dphoto_b", JPEG);
    const other = vaultFileStoreContents().get("dphoto_b") ?? new Uint8Array();
    await vaultFileStoreMock.putFile("dphoto_c", other);
    await expect(readVaultFile("dphoto_c")).rejects.toMatchObject({ code: "vault-corrupt" });
  });

  it("refuses oversized files and returns null for a photo added on another device", async () => {
    await expect(
      putVaultFile("dphoto_big", new Uint8Array(VAULT_MAX_FILE_BYTES + 1)),
    ).rejects.toMatchObject({ code: "vault-too-large" });
    await expect(
      storeDebtPhoto("dphoto_big", new Uint8Array(DEBT_PHOTO_MAX_BYTES + 1), "image/jpeg"),
    ).rejects.toThrow();
    await putVaultFile("dphoto_seed", JPEG); // creates the key
    expect(await loadDebtPhoto(debtPhotoRef("dphoto_missing", "image/png"))).toBeNull();
    expect(await loadDebtPhoto("https://example.com/x.jpg")).toBeNull();
  });

  it("is wiped on app reset (key deleted) and on vault reset", async () => {
    await putVaultFile("dphoto_a", JPEG);
    await deleteVaultKey();
    expect(vaultFileStoreContents().size).toBe(0);

    await putVaultFile("dphoto_b", JPEG);
    await resetVaultOnDevice();
    expect(vaultFileStoreContents().size).toBe(0);
  });

  it("re-encrypts files when the vault adopts another key", async () => {
    const oldKey = vaultCrypto.randomBytes(32);
    const newKey = vaultCrypto.randomBytes(32);
    await vaultFileStoreMock.putFile(
      "dphoto_a",
      await sealBytes(vaultCrypto, oldKey, "dphoto_a", JPEG),
    );
    await reencryptVaultFiles(vaultCrypto, oldKey, newKey, deriveKeyId(newKey));
    const sealed = vaultFileStoreContents().get("dphoto_a") ?? new Uint8Array();
    expect(sealedBytesKeyId(sealed)).toBe(deriveKeyId(newKey));
    expect(await openBytes(vaultCrypto, newKey, "dphoto_a", sealed)).toEqual(JPEG);
  });

  it("attaches to a debt by reference only, and deleting the debt deletes the file", async () => {
    await debtsVault.actions.load();
    const id = await debtsActions.saveDebt({
      direction: "i_owe",
      counterparty: "Yusuf",
      amount: 10,
      currency: "USD",
      createdOn: "2026-11-01",
      payments: [],
      status: "open",
    });
    await debtsActions.setDocumentPhoto(id, JPEG, "image/jpeg");
    const [debt] = debtEntries(debtsVault.store.getState().items);
    const ref = parseDebtPhotoRef(debt?.documentUri);
    expect(ref?.mimeType).toBe("image/jpeg");
    expect(vaultFileStoreContents().has(ref?.fileId ?? "")).toBe(true);
    // The synced document carries the reference, never the image.
    const envelope = JSON.stringify(await readJSON(DB_KEYS.vaultDebts, null));
    expect(envelope.length).toBeLessThan(4000);

    // Replacing deletes the old file.
    await debtsActions.setDocumentPhoto(id, JPEG, "image/jpeg");
    expect(vaultFileStoreContents().size).toBe(1);

    await debtsActions.deleteDebt(id);
    expect(vaultFileStoreContents().size).toBe(0);
  });

  it("removes the photo from a debt", async () => {
    await debtsVault.actions.load();
    const id = await debtsActions.saveDebt({
      direction: "trust_held",
      counterparty: "Bilal",
      createdOn: "2026-11-01",
      payments: [],
      status: "open",
    });
    await debtsActions.setDocumentPhoto(id, JPEG, "image/png");
    await debtsActions.removeDocumentPhoto(id);
    expect(debtEntries(debtsVault.store.getState().items)[0]?.documentUri).toBeUndefined();
    expect(vaultFileStoreContents().size).toBe(0);
  });
});
