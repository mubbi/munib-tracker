import {
  sniffUserMediaMime,
  USER_MEDIA_ALLOWED_MIME_TYPES,
  USER_MEDIA_MAX_BYTES,
  type UserMediaAllowedMimeType,
} from "@munib-tracker/shared/constants";

const ALLOWED = new Set<string>(USER_MEDIA_ALLOWED_MIME_TYPES);

const EXT_TO_MIME: Record<string, UserMediaAllowedMimeType> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  pdf: "application/pdf",
};

export type AttachmentPickErrorCode =
  | "UNSUPPORTED_MIME"
  | "FILE_TOO_LARGE"
  | "READ_FAILED"
  | "PERMISSION_DENIED"
  | "UNKNOWN";

export function attachmentPickErrorFromUnknown(err: unknown): AttachmentPickErrorCode {
  const code =
    err instanceof Error && typeof err.message === "string" ? err.message : String(err ?? "");
  if (
    code === "UNSUPPORTED_MIME" ||
    code === "FILE_TOO_LARGE" ||
    code === "READ_FAILED" ||
    code === "PERMISSION_DENIED"
  ) {
    return code;
  }
  return "UNKNOWN";
}

export function inferMimeFromFileName(fileName: string): UserMediaAllowedMimeType | null {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  return EXT_TO_MIME[ext] ?? null;
}

export function resolvePickedAttachmentMime(
  assetMime: string | undefined,
  fileName: string,
): UserMediaAllowedMimeType {
  if (assetMime) {
    try {
      return assertAllowedAttachmentMime(assetMime);
    } catch {
      // Platforms often report application/octet-stream for valid files.
    }
  }
  const inferred = inferMimeFromFileName(fileName);
  if (!inferred) throw new Error("UNSUPPORTED_MIME");
  return inferred;
}

export function assertAllowedAttachmentMime(mimeType: string): UserMediaAllowedMimeType {
  const normalized = mimeType.split(";")[0]?.trim().toLowerCase() ?? "";
  if (!ALLOWED.has(normalized)) {
    throw new Error("UNSUPPORTED_MIME");
  }
  return normalized as UserMediaAllowedMimeType;
}

export function assertAttachmentSizeBytes(sizeBytes: number): void {
  if (!Number.isFinite(sizeBytes) || sizeBytes < 1 || sizeBytes > USER_MEDIA_MAX_BYTES) {
    throw new Error("FILE_TOO_LARGE");
  }
}

export function sniffAttachmentMime(bytes: Uint8Array): UserMediaAllowedMimeType | null {
  return sniffUserMediaMime(bytes);
}

export function isImageMime(mimeType: string): boolean {
  return mimeType.startsWith("image/");
}

export function isPdfMime(mimeType: string): boolean {
  return mimeType === "application/pdf";
}
