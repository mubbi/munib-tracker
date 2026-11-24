import { readUriAsBytes } from "@/lib/attachments/read-uri-bytes";
import { shrinkImageForUpload } from "@/lib/attachments/shrink-image";
import { bytesToBase64 } from "@/lib/vault/encoding";
import { deleteVaultFile, putVaultFile, readVaultFile } from "@/lib/vault/vault";

/**
 * Debt document photo (NF-3.8 `documentUri`): an optional picture of a signed
 * note or receipt. The image bytes are encrypted under the vault key and kept
 * **only on this device** (`lib/vault/vault-files.ts`); the debt record — which
 * does sync — stores just a `vault-file:` reference. Hidden on TV.
 */

const REF_PREFIX = "vault-file:";
/** Photos larger than this (after the picker's compression / the web downscale) are refused. */
export const DEBT_PHOTO_MAX_BYTES = 2 * 1024 * 1024;
const PHOTO_MIME = ["image/jpeg", "image/png"] as const;
export type DebtPhotoMime = (typeof PHOTO_MIME)[number];

export interface DebtPhotoRef {
  fileId: string;
  mimeType: DebtPhotoMime;
}

/** `vault-file:<fileId>#<mime>` — what `DebtRecord.documentUri` holds. */
export function debtPhotoRef(fileId: string, mimeType: DebtPhotoMime): string {
  return `${REF_PREFIX}${fileId}#${mimeType}`;
}

export function parseDebtPhotoRef(uri: string | undefined): DebtPhotoRef | null {
  if (!uri?.startsWith(REF_PREFIX)) return null;
  const [fileId, mime] = uri.slice(REF_PREFIX.length).split("#");
  if (!fileId || !/^[\w-]{1,80}$/.test(fileId)) return null;
  const mimeType = (PHOTO_MIME as readonly string[]).includes(mime ?? "")
    ? (mime as DebtPhotoMime)
    : "image/jpeg";
  return { fileId, mimeType };
}

export type PreparedPhoto =
  | { ok: true; bytes: Uint8Array; mimeType: DebtPhotoMime }
  | { ok: false; reason: "too-large" | "unsupported" | "read-failed" };

function sniffMime(bytes: Uint8Array): DebtPhotoMime | null {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47)
    return "image/png";
  return null;
}

/**
 * Reads a picked image and enforces the size cap. Native pickers already
 * compress at pick time (no image-manipulation dep is bundled); on web an
 * oversized image is downscaled/re-encoded with a canvas first.
 */
export async function preparePickedPhoto(uri: string): Promise<PreparedPhoto> {
  let bytes: Uint8Array;
  try {
    bytes = await readUriAsBytes(uri);
  } catch {
    return { ok: false, reason: "read-failed" };
  }
  let mimeType = sniffMime(bytes);
  if (!mimeType) return { ok: false, reason: "unsupported" };
  if (bytes.length > DEBT_PHOTO_MAX_BYTES) {
    const shrunk = await shrinkImageForUpload(bytes, mimeType, DEBT_PHOTO_MAX_BYTES);
    if (!shrunk) return { ok: false, reason: "too-large" };
    bytes = shrunk.bytes;
    mimeType = shrunk.mimeType;
  }
  return { ok: true, bytes, mimeType };
}

/** Encrypts and stores the photo; returns the `documentUri` reference to save on the debt. */
export async function storeDebtPhoto(
  fileId: string,
  bytes: Uint8Array,
  mimeType: DebtPhotoMime,
): Promise<string> {
  if (bytes.length > DEBT_PHOTO_MAX_BYTES) throw new Error("too-large");
  await putVaultFile(fileId, bytes);
  return debtPhotoRef(fileId, mimeType);
}

/**
 * A `data:` URI for `<Image>`, or `null` when the photo isn't on this device
 * (added on another device, or wiped). Rejects when it can't be decrypted.
 */
export async function loadDebtPhoto(uri: string | undefined): Promise<string | null> {
  const ref = parseDebtPhotoRef(uri);
  if (!ref) return null;
  const bytes = await readVaultFile(ref.fileId);
  if (!bytes) return null;
  return `data:${ref.mimeType};base64,${bytesToBase64(bytes)}`;
}

/** Deletes the encrypted file behind a reference (no-op for anything else). */
export async function deleteDebtPhoto(uri: string | undefined): Promise<void> {
  const ref = parseDebtPhotoRef(uri);
  if (ref) await deleteVaultFile(ref.fileId).catch(() => {});
}
