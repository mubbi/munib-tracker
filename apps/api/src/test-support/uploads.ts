import { type Mock, vi } from "vitest";
import type { AttachmentStorageService } from "../common/attachment-storage.service";

/** Minimal magic-byte payloads that `sniffUserMediaMime` recognises. */
export const JPEG_BYTES = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46]);
export const PNG_BYTES = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00]);
export const WEBP_BYTES = Buffer.from([
  0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50,
]);
export const PDF_BYTES = Buffer.from("%PDF-1.4 mock");

/** Shape services accept after controllers unwrap Multer files. */
export type UploadedFileLike = {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
};

/** A PNG upload; `size` follows `buffer` unless overridden. */
export function buildUpload(overrides: Partial<UploadedFileLike> = {}): UploadedFileLike {
  const buffer = overrides.buffer ?? PNG_BYTES;
  return {
    buffer,
    mimetype: "image/png",
    originalname: "proof.png",
    size: buffer.length,
    ...overrides,
  };
}

/** The Multer file a `FilesInterceptor` hands to a controller. */
export function buildMulterFile(overrides: Partial<UploadedFileLike> = {}): Express.Multer.File {
  return { fieldname: "files", encoding: "7bit", ...buildUpload(overrides) } as Express.Multer.File;
}

export type MockAttachmentStorage = {
  save: Mock;
  saveUserMedia: Mock;
  read: Mock;
  remove: Mock;
  asService: () => AttachmentStorageService;
};

/** Storage double: saves resolve to `/disk/{folder}/{filename}`, reads return empty bytes. */
export function buildMockAttachmentStorage(): MockAttachmentStorage {
  const toPath = async (folder: string, filename: string) => ({
    storagePath: `/disk/${folder}/${filename}`,
  });
  const storage = {
    save: vi.fn(toPath),
    saveUserMedia: vi.fn(toPath),
    read: vi.fn().mockResolvedValue(Buffer.alloc(0)),
    remove: vi.fn().mockResolvedValue(undefined),
  };
  return { ...storage, asService: () => storage as unknown as AttachmentStorageService };
}
