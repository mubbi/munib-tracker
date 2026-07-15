import { ApiError, apiFetch, getApiBaseUrl } from "@munib-tracker/api-client";
import { USER_MEDIA_MAX_BYTES, USER_MEDIA_MAX_PER_ENTITY } from "@munib-tracker/shared/constants";
import { Platform } from "react-native";

import { apiAuthOptions } from "@/api/auth-options";

/** @deprecated Prefer USER_MEDIA_MAX_PER_ENTITY from shared constants. */
export const CUSTOM_ADHKAR_MAX_IMAGES = USER_MEDIA_MAX_PER_ENTITY;
/** @deprecated Prefer USER_MEDIA_MAX_BYTES from shared constants. */
export const CUSTOM_ADHKAR_MAX_IMAGE_BYTES = USER_MEDIA_MAX_BYTES;

export type UserMediaUploadInput = {
  uri: string;
  mimeType: string;
  filename: string;
};

export type UserMediaDto = {
  id: string;
  mimeType: string;
  filename: string;
  sizeBytes: number;
  contentPath: string;
  createdAt: string;
};

export function userMediaContentUrl(mediaId: string): string {
  return `${getApiBaseUrl()}/user-media/${encodeURIComponent(mediaId)}/content`;
}

export async function uploadUserMedia(
  accessToken: string,
  files: UserMediaUploadInput[],
): Promise<UserMediaDto[]> {
  const form = new FormData();

  for (const file of files) {
    if (Platform.OS === "web") {
      const blobResponse = await fetch(file.uri);
      const blob = await blobResponse.blob();
      form.append("files", blob, file.filename);
    } else {
      form.append("files", {
        uri: file.uri,
        name: file.filename,
        type: file.mimeType,
      } as unknown as Blob);
    }
  }

  const result = await apiFetch<{ items: UserMediaDto[] }>(
    { url: "/user-media", method: "POST", body: form },
    apiAuthOptions(accessToken),
  );
  return result.items;
}

export async function deleteUserMedia(accessToken: string, mediaId: string): Promise<void> {
  await apiFetch(
    { url: `/user-media/${encodeURIComponent(mediaId)}`, method: "DELETE" },
    apiAuthOptions(accessToken),
  );
}

export async function deleteUserMediaMany(accessToken: string, mediaIds: string[]): Promise<void> {
  await Promise.all(mediaIds.map((id) => deleteUserMedia(accessToken, id).catch(() => undefined)));
}

export function isGuestUserMediaError(error: unknown): boolean {
  return (
    error instanceof ApiError &&
    error.status === 403 &&
    typeof error.body === "object" &&
    error.body !== null &&
    "code" in error.body &&
    (error.body as { code?: string }).code === "GUEST_NOT_ALLOWED"
  );
}
