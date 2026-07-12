import { ApiError, getApiBaseUrl, getRegisteredTokenRefresher } from "@munib-tracker/api-client";
import { USER_MEDIA_MAX_BYTES, USER_MEDIA_MAX_PER_ENTITY } from "@munib-tracker/shared/constants";
import { Platform } from "react-native";

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

async function fetchWithAuth<T>(path: string, init: RequestInit, accessToken: string): Promise<T> {
  const url = `${getApiBaseUrl()}${path}`;
  const send = (token: string) =>
    fetch(url, {
      ...init,
      headers: {
        ...(init.headers ?? {}),
        Authorization: `Bearer ${token}`,
      },
    });

  let response = await send(accessToken);

  if (response.status === 401) {
    const refresher = getRegisteredTokenRefresher();
    if (refresher) {
      const refreshed = await refresher();
      if (refreshed && refreshed !== accessToken) {
        response = await send(refreshed);
      }
    }
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const body = await response.json().catch(() => undefined);
  if (!response.ok) {
    throw new ApiError(
      typeof body === "object" && body && "message" in body
        ? String((body as { message: string }).message)
        : `Request failed with status ${response.status}`,
      response.status,
      body,
    );
  }

  return body as T;
}

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

  const result = await fetchWithAuth<{ items: UserMediaDto[] }>(
    "/user-media",
    { method: "POST", body: form },
    accessToken,
  );
  return result.items;
}

export async function deleteUserMedia(accessToken: string, mediaId: string): Promise<void> {
  await fetchWithAuth<void>(
    `/user-media/${encodeURIComponent(mediaId)}`,
    { method: "DELETE" },
    accessToken,
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
