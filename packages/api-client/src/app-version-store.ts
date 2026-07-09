/**
 * App version sent with API requests (X-App-Version, X-App-Platform) and
 * version meta read from response headers on every API call (web, iOS, Android).
 */

import { getApiBaseUrl } from "./api-base-url";
import { type AppPlatform, normalizeAppPlatform } from "./app-version-platform";
import { APP_VERSION_RESPONSE_HEADERS, getResponseHeader } from "./app-version-response-headers";

export type UpdateRequired = "none" | "soft" | "hard";

export type AppVersionMeta = {
  updateRequired: UpdateRequired;
  latestVersion: string;
  minSoftVersion: string;
  minHardVersion: string;
  message?: string | null;
  storeUrl?: string | null;
};

/** Background poll when logged out (or idle) — same on web, iOS, Android. */
export const APP_VERSION_BACKGROUND_POLL_MS = 30 * 60 * 1000;

let appVersion = "1.0.0";
let appPlatform: AppPlatform = "web";
let versionMetaCallback: ((meta: AppVersionMeta) => void) | null = null;

export function setAppVersionInfo(version: string, platform: string): void {
  appVersion = version?.trim() || "1.0.0";
  appPlatform = normalizeAppPlatform(platform);
}

export function getAppVersionInfo(): { version: string; platform: AppPlatform } {
  return { version: appVersion, platform: appPlatform };
}

/** Attached to every API request; API middleware returns matching response headers. */
export function getAppVersionHeaders(): Record<string, string> {
  return {
    "X-App-Version": appVersion,
    "X-App-Platform": appPlatform,
  };
}

export function setVersionMetaCallback(cb: ((meta: AppVersionMeta) => void) | null): void {
  versionMetaCallback = cb;
}

export function parseVersionMetaFromResponse(response: Response): AppVersionMeta | null {
  const updateRequired = getResponseHeader(
    response,
    APP_VERSION_RESPONSE_HEADERS.updateRequired,
  )?.toLowerCase();
  if (!updateRequired) return null;
  if (updateRequired !== "none" && updateRequired !== "soft" && updateRequired !== "hard") {
    return null;
  }
  const latestVersion =
    getResponseHeader(response, APP_VERSION_RESPONSE_HEADERS.latestVersion) ?? "";
  const minSoftVersion =
    getResponseHeader(response, APP_VERSION_RESPONSE_HEADERS.minSoftVersion)?.trim() ||
    latestVersion;
  const minHardVersion =
    getResponseHeader(response, APP_VERSION_RESPONSE_HEADERS.minHardVersion)?.trim() ||
    latestVersion;
  const message = getResponseHeader(response, APP_VERSION_RESPONSE_HEADERS.message);
  const storeUrl = getResponseHeader(response, APP_VERSION_RESPONSE_HEADERS.storeUrl);
  return {
    updateRequired: updateRequired as UpdateRequired,
    latestVersion,
    minSoftVersion,
    minHardVersion,
    message: message || null,
    storeUrl: storeUrl || null,
  };
}

export function notifyVersionMetaFromResponse(response: Response): void {
  const cb = versionMetaCallback;
  if (!cb) return;
  const meta = parseVersionMetaFromResponse(response);
  if (meta) cb(meta);
}

/**
 * Explicit version check (no auth). Used on launch, every 30 minutes, and on app refocus
 * when the user may not trigger other API calls (e.g. logged out).
 */
export async function fetchAppVersionMeta(accessToken?: string): Promise<AppVersionMeta | null> {
  const base = getApiBaseUrl().trim();
  if (!base) return null;
  const { version, platform } = getAppVersionInfo();
  const params = new URLSearchParams({ version, platform });
  const url = `${base.replace(/\/$/, "")}/version/meta?${params}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        ...getAppVersionHeaders(),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    });
    notifyVersionMetaFromResponse(response);
    if (!response.ok) return null;
    return (await response.json()) as AppVersionMeta;
  } catch {
    return null;
  }
}

/**
 * Merge version meta from multiple API responses in one session.
 * "none" always wins so upgrading the app clears a stale soft/hard flag from earlier responses.
 */
export function mergeAppVersionMeta(
  prev: AppVersionMeta | null,
  incoming: AppVersionMeta,
): AppVersionMeta {
  if (incoming.updateRequired === "none") return incoming;
  if (!prev || prev.updateRequired === "none") return incoming;
  const rank = (r: UpdateRequired) => (r === "hard" ? 2 : r === "soft" ? 1 : 0);
  if (rank(incoming.updateRequired) > rank(prev.updateRequired)) return incoming;
  if (rank(incoming.updateRequired) < rank(prev.updateRequired)) return prev;
  return incoming;
}
