/** Private custom-adhkar attachments — shared by API and app. */

export const USER_MEDIA_MAX_PER_ENTITY = 5;

/** Max single file size (1 MiB). */
export const USER_MEDIA_MAX_BYTES = 1 * 1024 * 1024;

export const USER_MEDIA_ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
] as const;

export type UserMediaAllowedMimeType = (typeof USER_MEDIA_ALLOWED_MIME_TYPES)[number];

export const USER_MEDIA_FILE_NAME_MAX = 255;

const ALLOWED = new Set<string>(USER_MEDIA_ALLOWED_MIME_TYPES);

/**
 * Detect the real content type from magic bytes (independent of spoofable MIME /
 * extension). Returns null when the signature is not an allowed type.
 */
export function sniffUserMediaMime(bytes: Uint8Array): UserMediaAllowedMimeType | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return "image/png";
  }
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "image/webp";
  }
  if (
    bytes.length >= 5 &&
    bytes[0] === 0x25 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x44 &&
    bytes[3] === 0x46 &&
    bytes[4] === 0x2d
  ) {
    return "application/pdf";
  }
  return null;
}

export function normalizeUserMediaMime(mimeType: string): UserMediaAllowedMimeType | null {
  const normalized = mimeType.split(";")[0]?.trim().toLowerCase() ?? "";
  if (!ALLOWED.has(normalized)) return null;
  return normalized as UserMediaAllowedMimeType;
}
