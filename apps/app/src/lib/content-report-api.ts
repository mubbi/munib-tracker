import { ApiError, apiFetch } from "@munib-tracker/api-client";
import type {
  ContentReportDetail,
  ContentReportListResponse,
  CreateContentReportPayload,
} from "@munib-tracker/shared/types/content-report";
import { Platform } from "react-native";

import { apiAuthOptions } from "@/api/auth-options";

export type ReportAttachmentInput = {
  uri: string;
  mimeType: string;
  filename: string;
};

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

  return apiFetch<ContentReportDetail>(
    { url: "/content-reports", method: "POST", body: form },
    apiAuthOptions(accessToken),
  );
}

export async function listContentReports(
  accessToken: string,
  page = 1,
  limit = 20,
): Promise<ContentReportListResponse> {
  const query = new URLSearchParams({ page: String(page), limit: String(limit) });
  return apiFetch<ContentReportListResponse>(
    {
      url: `/content-reports?${query.toString()}`,
      method: "GET",
      headers: { Accept: "application/json" },
    },
    apiAuthOptions(accessToken),
  );
}

export async function getContentReport(
  accessToken: string,
  id: string,
): Promise<ContentReportDetail> {
  return apiFetch<ContentReportDetail>(
    {
      url: `/content-reports/${encodeURIComponent(id)}`,
      method: "GET",
      headers: { Accept: "application/json" },
    },
    apiAuthOptions(accessToken),
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
