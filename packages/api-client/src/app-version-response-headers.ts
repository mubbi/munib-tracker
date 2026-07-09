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

export function getResponseHeader(response: Response, headerName: string): string | null {
  const value = response.headers.get(headerName);
  return value?.trim() ? value.trim() : null;
}
