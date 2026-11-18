import {
  USER_MEDIA_ALLOWED_MIME_TYPES,
  USER_MEDIA_FILE_NAME_MAX,
  USER_MEDIA_MAX_BYTES,
  type UserMediaAllowedMimeType,
} from "@munib-tracker/shared/constants";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";

import {
  assertAllowedAttachmentMime,
  assertAttachmentSizeBytes,
  isImageMime,
  resolvePickedAttachmentMime,
  sniffAttachmentMime,
} from "@/lib/attachments/attachment-mime";
import { readUriAsBytes } from "@/lib/attachments/read-uri-bytes";
import { shrinkImageForUpload } from "@/lib/attachments/shrink-image";
import { isTV } from "@/lib/platform/is-tv";

export const ATTACHMENT_PICKER_TYPES = [...USER_MEDIA_ALLOWED_MIME_TYPES] as const;

export type PickedAttachment = {
  uri: string;
  fileName: string;
  mimeType: UserMediaAllowedMimeType;
  sizeBytes: number;
};

export type AttachmentPickSource = "camera" | "gallery" | "document";

export type AttachmentPickOutcome =
  | { kind: "picked"; attachment: PickedAttachment }
  | { kind: "canceled" }
  | { kind: "permission_denied"; canAskAgain: boolean };

function sanitizeFileName(fileName: string): string {
  const base = fileName.replace(/[/\\?%*:|"<>]/g, "_").trim() || "attachment";
  return base.slice(0, USER_MEDIA_FILE_NAME_MAX);
}

/** Cross-platform document-picker types (UTIs on iOS, MIME on Android/web). */
function attachmentDocumentPickerTypes(): string | string[] {
  if (Platform.OS === "ios") {
    // Only types we can sniff + upload — avoid HEIC / generic public.image which
    // fail later as UNSUPPORTED_MIME after the user already picked a file.
    return ["public.jpeg", "public.png", "com.adobe.pdf"];
  }
  if (Platform.OS === "android") {
    return [...ATTACHMENT_PICKER_TYPES];
  }
  return [...ATTACHMENT_PICKER_TYPES];
}

function assetFromImagePicker(
  asset: ImagePicker.ImagePickerAsset,
  fallbackName: string,
): PickedAttachment {
  const fileName = sanitizeFileName(asset.fileName ?? fallbackName);
  const mimeType = resolvePickedAttachmentMime(asset.mimeType ?? undefined, fileName);
  return {
    uri: asset.uri,
    fileName,
    mimeType,
    sizeBytes: asset.fileSize ?? 0,
  };
}

async function ensureImagePickerPermission(
  request: () => Promise<ImagePicker.PermissionResponse>,
): Promise<AttachmentPickOutcome | null> {
  const permission = await request();
  if (permission.granted) return null;
  return {
    kind: "permission_denied",
    canAskAgain: permission.canAskAgain !== false,
  };
}

/** Capture a photo with the device camera. */
export async function pickAttachmentFromCamera(): Promise<AttachmentPickOutcome> {
  if (isTV()) return { kind: "canceled" };
  const denied = await ensureImagePickerPermission(ImagePicker.requestCameraPermissionsAsync);
  if (denied) return denied;

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ["images"],
    quality: 0.85,
    exif: false,
  });
  if (result.canceled || !result.assets?.[0]) return { kind: "canceled" };
  return { kind: "picked", attachment: assetFromImagePicker(result.assets[0], "photo.jpg") };
}

/** Pick a photo from the photo library. */
export async function pickAttachmentFromGallery(): Promise<AttachmentPickOutcome> {
  if (isTV()) return { kind: "canceled" };
  // Android uses the system photo picker (PickVisualMedia) — no READ_MEDIA_* permission.
  if (Platform.OS !== "android") {
    const denied = await ensureImagePickerPermission(
      ImagePicker.requestMediaLibraryPermissionsAsync,
    );
    if (denied) return denied;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    // Match content-report — full-res phone photos often exceed the 1 MB cap.
    quality: 0.7,
    exif: false,
    allowsMultipleSelection: false,
  });
  if (result.canceled || !result.assets?.[0]) return { kind: "canceled" };
  return { kind: "picked", attachment: assetFromImagePicker(result.assets[0], "photo.jpg") };
}

/** Pick a single image or PDF from downloads / documents / file manager. */
export async function pickAttachmentFromDocument(): Promise<PickedAttachment | null> {
  if (isTV()) return null;
  const result = await DocumentPicker.getDocumentAsync({
    type: attachmentDocumentPickerTypes(),
    copyToCacheDirectory: true,
    multiple: false,
  });
  if (result.canceled || !result.assets?.[0]) return null;

  const asset = result.assets[0];
  const fileName = sanitizeFileName(asset.name ?? "attachment");
  const mimeType = resolvePickedAttachmentMime(asset.mimeType ?? undefined, fileName);

  return {
    uri: asset.uri,
    fileName,
    mimeType,
    sizeBytes: asset.size ?? 0,
  };
}

export async function pickAttachmentFromSource(
  source: AttachmentPickSource,
): Promise<AttachmentPickOutcome> {
  switch (source) {
    case "camera":
      return pickAttachmentFromCamera();
    case "gallery":
      return pickAttachmentFromGallery();
    default: {
      const picked = await pickAttachmentFromDocument();
      if (!picked) return { kind: "canceled" };
      return { kind: "picked", attachment: picked };
    }
  }
}

/** Refuse to buffer absurdly large picks in memory before validating them. */
const MAX_READABLE_BYTES = 40 * 1024 * 1024;

function withJpegExtension(fileName: string): string {
  const stem = fileName.replace(/\.[^.]+$/, "") || "photo";
  return `${stem}.jpg`;
}

/**
 * Validate picked bytes (size + magic-byte sniff) before upload. Returns the
 * authoritative mime/size so callers never trust picker metadata alone.
 *
 * Oversized images are downscaled on web (browsers hand over the original
 * multi-MB photo); the returned `uri` then points at the re-encoded JPEG.
 */
export async function validatePickedAttachment(
  attachment: PickedAttachment,
): Promise<PickedAttachment> {
  assertAllowedAttachmentMime(attachment.mimeType);
  if (attachment.sizeBytes > MAX_READABLE_BYTES) {
    throw new Error("FILE_TOO_LARGE");
  }

  const bytes = await readUriAsBytes(attachment.uri);

  // Magic bytes are authoritative — picker MIME / extension can disagree
  // (octet-stream, wrong extension, JPEG reported as PNG, etc.).
  const sniffed = sniffAttachmentMime(bytes);
  if (!sniffed) {
    throw new Error("UNSUPPORTED_MIME");
  }

  if (bytes.length > USER_MEDIA_MAX_BYTES && isImageMime(sniffed)) {
    const shrunk = await shrinkImageForUpload(bytes, sniffed, USER_MEDIA_MAX_BYTES);
    if (shrunk) {
      return {
        uri: shrunk.uri,
        fileName: withJpegExtension(attachment.fileName),
        mimeType: shrunk.mimeType,
        sizeBytes: shrunk.bytes.length,
      };
    }
  }

  assertAttachmentSizeBytes(bytes.length);

  return {
    ...attachment,
    mimeType: sniffed,
    sizeBytes: bytes.length,
  };
}
