import type { Response } from "express";
import type { VersionMetaResponseDto } from "../dto/version.dto";

/** Request headers the client sends. */
export const APP_VERSION_REQUEST_HEADERS = {
  version: "x-app-version",
  platform: "x-app-platform",
} as const;

/** Response headers on every /api/v1 request when X-App-Version is present. */
export const APP_VERSION_RESPONSE_HEADERS = {
  updateRequired: "x-app-update-required",
  latestVersion: "x-app-latest-version",
  minSoftVersion: "x-app-min-soft-version",
  minHardVersion: "x-app-min-hard-version",
  message: "x-app-update-message",
  storeUrl: "x-app-store-url",
} as const;

/** Must be listed in CORS `exposedHeaders` so browsers can read them on cross-origin fetch. */
export const APP_VERSION_CORS_EXPOSED_HEADERS = Object.values(APP_VERSION_RESPONSE_HEADERS);

export function setAppVersionResponseHeaders(res: Response, meta: VersionMetaResponseDto): void {
  res.setHeader(APP_VERSION_RESPONSE_HEADERS.updateRequired, meta.updateRequired);
  res.setHeader(APP_VERSION_RESPONSE_HEADERS.latestVersion, meta.latestVersion);
  res.setHeader(APP_VERSION_RESPONSE_HEADERS.minSoftVersion, meta.minSoftVersion);
  res.setHeader(APP_VERSION_RESPONSE_HEADERS.minHardVersion, meta.minHardVersion);
  if (meta.message) {
    res.setHeader(APP_VERSION_RESPONSE_HEADERS.message, meta.message);
  }
  if (meta.storeUrl) {
    res.setHeader(APP_VERSION_RESPONSE_HEADERS.storeUrl, meta.storeUrl);
  }
}
