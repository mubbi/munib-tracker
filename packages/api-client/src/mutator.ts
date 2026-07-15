import { resolveApiUrl } from "./api-base-url";
import { getAppVersionHeaders, notifyVersionMetaFromResponse } from "./app-version-store";
import {
  ApiBlockedError,
  beginApiRequest,
  endApiRequest,
  isAppReloadInProgress,
} from "./cloud-api-gate";
import { isWebCookieSessionToken } from "./web-cookie-session";

export type ApiFetchOptions = RequestInit & {
  accessToken?: string;
};

export type OrvalRequestConfig = {
  url: string;
  method: string;
  signal?: AbortSignal;
  headers?: HeadersInit;
  body?: BodyInit | null;
  /** Query parameters — orval-generated request functions pass these. */
  params?: Record<string, unknown>;
  /** JSON request body — orval-generated request functions pass this (vs `body`). */
  data?: unknown;
};

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Callback that mints a fresh access token when a request is rejected with 401
 * (e.g. an expired JWT). Registered by the app's auth layer via
 * {@link setTokenRefresher}. Returns the new access token, or `null` if the
 * session could not be refreshed. Keeping it here (rather than passing a refresh
 * fn per call) lets every `apiFetch` transparently recover from token expiry.
 */
type TokenRefresher = () => Promise<string | null>;
let tokenRefresher: TokenRefresher | null = null;

export function setTokenRefresher(refresher: TokenRefresher | null): void {
  tokenRefresher = refresher;
}

/** Returns the auth-layer refresher registered via {@link setTokenRefresher}. */
export function getRegisteredTokenRefresher(): TokenRefresher | null {
  return tokenRefresher;
}

export { getApiBaseUrl, resolveApiUrl } from "./api-base-url";
export { isWebCookieSessionToken, WEB_COOKIE_SESSION_TOKEN } from "./web-cookie-session";

function isWebRuntime(): boolean {
  return typeof document !== "undefined";
}

function isLikelyWebCookieSession(): boolean {
  return isWebRuntime();
}

function isFormDataBody(body: unknown): boolean {
  return typeof FormData !== "undefined" && body instanceof FormData;
}

function headersRecord(init?: HeadersInit): Record<string, string> {
  if (!init) return {};
  if (init instanceof Headers) {
    const out: Record<string, string> = {};
    init.forEach((value, key) => {
      out[key] = value;
    });
    return out;
  }
  if (Array.isArray(init)) {
    return Object.fromEntries(init);
  }
  return { ...init };
}

export async function apiFetch<T>(
  config: OrvalRequestConfig,
  options: ApiFetchOptions = {},
): Promise<T> {
  if (isAppReloadInProgress()) {
    throw new ApiBlockedError(config.method, config.url);
  }

  const { accessToken, headers, ...requestInit } = options;
  let targetUrl = resolveApiUrl(config.url);

  // orval-generated calls pass query params separately; append them to the URL.
  if (config.params) {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(config.params)) {
      if (value != null) query.append(key, String(value));
    }
    const queryString = query.toString();
    if (queryString) targetUrl += (targetUrl.includes("?") ? "&" : "?") + queryString;
  }

  // Accept both a raw `body` (hand-written callers) and orval's `data` (JSON body).
  const requestBody =
    config.body ?? (config.data != null ? JSON.stringify(config.data) : undefined);
  const formData = isFormDataBody(requestBody);

  const webHeaders: Record<string, string> = isWebRuntime()
    ? {
        "x-munib-tracker-client": "web",
        "x-client-platform": "web",
      }
    : {};

  const send = (token?: string) => {
    const requestHeaders: Record<string, string> = {
      // Let the runtime set multipart boundaries for FormData.
      ...(formData ? {} : { "Content-Type": "application/json" }),
      ...getAppVersionHeaders(),
      ...webHeaders,
      ...headersRecord(config.headers),
      ...headersRecord(headers),
    };
    if (formData) {
      // Orval often injects Content-Type: application/json — drop it for multipart.
      delete requestHeaders["Content-Type"];
      delete requestHeaders["content-type"];
    }
    // Web cookie sessions store the marker — never send it as Bearer.
    if (token && !isWebCookieSessionToken(token)) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }
    return fetch(targetUrl, {
      ...requestInit,
      method: config.method,
      body: requestBody,
      signal: config.signal,
      credentials: "include",
      headers: requestHeaders,
    });
  };

  beginApiRequest();
  try {
    let response = await send(accessToken);

    // Transparently recover from an expired access token: refresh once and retry.
    // Cookie sessions (no Bearer) also refresh on 401 when a refresher is registered.
    if (
      response.status === 401 &&
      tokenRefresher &&
      !isAppReloadInProgress() &&
      (accessToken || isLikelyWebCookieSession())
    ) {
      const refreshed = await tokenRefresher();
      if (refreshed && refreshed !== accessToken) {
        response = await send(isWebCookieSessionToken(refreshed) ? undefined : refreshed);
      } else if (isWebCookieSessionToken(refreshed) || (refreshed && !accessToken)) {
        response = await send(undefined);
      }
    }

    notifyVersionMetaFromResponse(response);

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
  } finally {
    endApiRequest();
  }
}
