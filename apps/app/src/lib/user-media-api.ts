import { ApiError, apiFetch, getApiBaseUrl } from "@munib-tracker/api-client";
import { USER_MEDIA_MAX_BYTES, USER_MEDIA_MAX_PER_ENTITY } from "@munib-tracker/shared/constants";

import { apiAuthOptions } from "@/api/auth-options";
import { appendUploadFile } from "@/lib/attachments/multipart-file-part";

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
  // One file per request: five attachments at the 1 MiB cap would not fit in a
  // single serverless request body (Vercel rejects bodies over 4.5 MB).
  const uploaded: UserMediaDto[] = [];
  try {
    for (const file of files) {
      const form = new FormData();
      await appendUploadFile(form, "files", file);
      const result = await apiFetch<{ items: UserMediaDto[] }>(
        { url: "/user-media", method: "POST", body: form },
        apiAuthOptions(accessToken),
      );
      uploaded.push(...result.items);
    }
  } catch (error) {
    // Do not strand the files that did upload when a later one fails.
    await deleteUserMediaMany(
      accessToken,
      uploaded.map((item) => item.id),
    );
    throw error;
  }
  return uploaded;
}

export async function deleteUserMedia(
  accessToken: string | undefined,
  mediaId: string,
): Promise<void> {
  await apiFetch(
    { url: `/user-media/${encodeURIComponent(mediaId)}`, method: "DELETE" },
    apiAuthOptions(accessToken),
  );
}

export async function deleteUserMediaMany(
  accessToken: string | undefined,
  mediaIds: string[],
): Promise<void> {
  const unique = [...new Set(mediaIds.filter(Boolean))];
  if (unique.length === 0) return;
  // Prefer success for every id; ignore 404 (already gone) so deletes stay idempotent.
  await Promise.all(
    unique.map(async (id) => {
      try {
        await deleteUserMedia(accessToken, id);
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) return;
        // Best-effort: continue other ids; caller may still remove the local adhkar.
      }
    }),
  );
}

/** Media ids attached to a custom adhkar (Cloudinary / user-media rows). */
export function customAdhkarMediaIds(
  images: Array<{ mediaId?: string }> | undefined | null,
): string[] {
  if (!images?.length) return [];
  return [
    ...new Set(images.map((image) => image.mediaId).filter((id): id is string => Boolean(id))),
  ];
}

/**
 * Delete private attachments for a custom adhkar from the API (and Cloudinary).
 * No-op when there are no media ids.
 */
export async function purgeCustomAdhkarAttachments(
  accessToken: string | undefined,
  images: Array<{ mediaId?: string }> | undefined | null,
): Promise<void> {
  await deleteUserMediaMany(accessToken, customAdhkarMediaIds(images));
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
