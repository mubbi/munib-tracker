import {
  USER_MEDIA_ALLOWED_MIME_TYPES,
  USER_MEDIA_FILE_NAME_MAX,
  type UserMediaAllowedMimeType,
} from "@munib-tracker/shared/constants";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";

import {
  assertAllowedAttachmentMime,
  assertAttachmentSizeBytes,
  resolvePickedAttachmentMime,
  sniffAttachmentMime,
} from "@/lib/attachments/attachment-mime";
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
    return [
      "public.image",
      "public.jpeg",
      "public.png",
      "public.heic",
      "com.adobe.pdf",
      "public.data",
    ];
  }
  if (Platform.OS === "android") {
    return [...ATTACHMENT_PICKER_TYPES];
  }
  return [...ATTACHMENT_PICKER_TYPES, "*/*"];
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
    quality: 1,
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

async function readUriAsBytes(sourceUri: string): Promise<Uint8Array> {
  if (Platform.OS === "web" && sourceUri.startsWith("data:")) {
    const comma = sourceUri.indexOf(",");
    if (comma < 0) throw new Error("READ_FAILED");
    const meta = sourceUri.slice(0, comma);
    const payload = sourceUri.slice(comma + 1);
    if (meta.includes(";base64")) {
      const binary = atob(payload);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      return bytes;
    }
    return new TextEncoder().encode(decodeURIComponent(payload));
  }
  const response = await fetch(sourceUri);
  if (!response.ok) throw new Error("READ_FAILED");
  return new Uint8Array(await response.arrayBuffer());
}

/**
 * Validate picked bytes (size + magic-byte sniff) before upload. Returns the
 * authoritative mime/size so callers never trust picker metadata alone.
 */
export async function validatePickedAttachment(
  attachment: PickedAttachment,
): Promise<PickedAttachment> {
  assertAllowedAttachmentMime(attachment.mimeType);
  if (attachment.sizeBytes > 0) {
    assertAttachmentSizeBytes(attachment.sizeBytes);
  }

  const bytes = await readUriAsBytes(attachment.uri);
  assertAttachmentSizeBytes(bytes.length);

  const sniffed = sniffAttachmentMime(bytes);
  if (!sniffed || sniffed !== attachment.mimeType) {
    throw new Error("UNSUPPORTED_MIME");
  }

  return {
    ...attachment,
    sizeBytes: bytes.length,
  };
}
