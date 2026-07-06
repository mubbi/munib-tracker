import { ApiError, getApiBaseUrl, getRegisteredTokenRefresher } from "@munib-tracker/api-client";
import type {
  ContentReportDetail,
  ContentReportListResponse,
  CreateContentReportPayload,
} from "@munib-tracker/shared/types/content-report";
import { Platform } from "react-native";

export type ReportAttachmentInput = {
  uri: string;
  mimeType: string;
  filename: string;
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

export async function submitContentReport(
  accessToken: string,
  payload: CreateContentReportPayload,
  attachments: ReportAttachmentInput[] = [],
): Promise<ContentReportDetail> {
  const form = new FormData();
  form.append("payload", JSON.stringify(payload));

  for (const attachment of attachments) {
    if (Platform.OS === "web") {
      const blobResponse = await fetch(attachment.uri);
      const blob = await blobResponse.blob();
      form.append("attachments", blob, attachment.filename);
    } else {
      form.append("attachments", {
        uri: attachment.uri,
        name: attachment.filename,
        type: attachment.mimeType,
      } as unknown as Blob);
    }
  }

  return fetchWithAuth<ContentReportDetail>(
    "/content-reports",
    { method: "POST", body: form },
    accessToken,
  );
}

export async function listContentReports(
  accessToken: string,
  page = 1,
  limit = 20,
): Promise<ContentReportListResponse> {
  const query = new URLSearchParams({ page: String(page), limit: String(limit) });
  return fetchWithAuth<ContentReportListResponse>(
    `/content-reports?${query.toString()}`,
    { method: "GET", headers: { Accept: "application/json" } },
    accessToken,
  );
}

export async function getContentReport(
  accessToken: string,
  id: string,
): Promise<ContentReportDetail> {
  return fetchWithAuth<ContentReportDetail>(
    `/content-reports/${encodeURIComponent(id)}`,
    { method: "GET", headers: { Accept: "application/json" } },
    accessToken,
  );
}

export function isGuestReportError(error: unknown): boolean {
  return (
    error instanceof ApiError &&
    error.status === 403 &&
    typeof error.body === "object" &&
    error.body !== null &&
    "code" in error.body &&
    (error.body as { code?: string }).code === "GUEST_NOT_ALLOWED"
  );
}

export function isOfflineReportError(error: unknown): boolean {
  if (error instanceof TypeError) return true;
  if (error instanceof ApiError && error.status >= 500) return true;
  return false;
}
