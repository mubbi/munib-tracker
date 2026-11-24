import { openBytes, sealBytes, sealedBytesKeyId } from "./envelope";
import type { VaultCryptoBackend } from "./types";
import { deleteFile, getFile, listFiles, putFile, wipeFiles } from "./vault-file-store";

/**
 * Device-only encrypted files (e.g. a debt's document photo, NF-3.8). Bytes are
 * sealed under the vault DEK ({@link sealBytes}) and written to the app's
 * documents directory (native) / IndexedDB (web). Unlike vault documents they
 * are **never synced or backed up** — a record only keeps the file id, so
 * another device sees "photo on another device". They follow the DEK: a key
 * change re-encrypts them ({@link reencryptVaultFiles}) and deleting the key
 * wipes them ({@link wipeVaultFiles}).
 *
 * The DEK-holding entry points (`putVaultFile` / `readVaultFile` /
 * `deleteVaultFile`) live in `vault.ts`.
 */

/** Plaintext cap per file (after the picker's compression / web downscale). */
export const VAULT_MAX_FILE_BYTES = 3 * 1024 * 1024;

export async function writeSealedFile(
  backend: VaultCryptoBackend,
  dek: Uint8Array,
  fileId: string,
  bytes: Uint8Array,
): Promise<void> {
  await putFile(fileId, await sealBytes(backend, dek, fileId, bytes));
}

/** `null` when the file isn't on this device. */
export async function readSealedFile(
  backend: VaultCryptoBackend,
  dek: Uint8Array,
  fileId: string,
): Promise<Uint8Array | null> {
  const sealed = await getFile(fileId);
  return sealed ? openBytes(backend, dek, fileId, sealed) : null;
}

export async function removeSealedFile(fileId: string): Promise<void> {
  await deleteFile(fileId);
}

/** Re-seals every file written under `previous` with `next` (files neither key opens are left). */
export async function reencryptVaultFiles(
  backend: VaultCryptoBackend,
  previous: Uint8Array,
  next: Uint8Array,
  nextKeyId: string,
): Promise<void> {
  let names: string[];
  try {
    names = await listFiles();
  } catch {
    return;
  }
  for (const fileId of names) {
    try {
      const sealed = await getFile(fileId);
      if (!sealed || sealedBytesKeyId(sealed) === nextKeyId) continue;
      const plain = await openBytes(backend, previous, fileId, sealed);
      await putFile(fileId, await sealBytes(backend, next, fileId, plain));
    } catch {
      // Unreadable under the old key too — leave it (shown as unavailable).
    }
  }
}

/** Deletes every sealed file on this device (reset / vault key deleted). */
export async function wipeVaultFiles(): Promise<void> {
  try {
    await wipeFiles();
  } catch {
    // Storage unavailable — nothing to wipe.
  }
}
