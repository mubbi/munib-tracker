import {
  ossContentFailuresControllerReport,
  type ReportOssContentDownloadFailureDto,
} from "@munib-tracker/api-client";

import { apiAuthOptions } from "@/api/auth-options";

export type ReportOssContentDownloadFailurePayload = ReportOssContentDownloadFailureDto;

/** POST a CDN / OSS download failure to the API (fire-and-forget from callers). */
export async function submitOssContentDownloadFailure(
  accessToken: string,
  payload: ReportOssContentDownloadFailurePayload,
): Promise<void> {
  await ossContentFailuresControllerReport(payload, apiAuthOptions(accessToken));
}
