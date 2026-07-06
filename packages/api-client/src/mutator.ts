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

export function getApiBaseUrl(): string {
  if (typeof process !== "undefined") {
    if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL;
    }

    if (process.env.EXPO_PUBLIC_API_URL) {
      return process.env.EXPO_PUBLIC_API_URL;
    }
  }

  return "http://localhost:3001/api/v1";
}

export async function apiFetch<T>(
  config: OrvalRequestConfig,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { accessToken, headers, ...requestInit } = options;
  let targetUrl = config.url.startsWith("http") ? config.url : `${getApiBaseUrl()}${config.url}`;

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

  const send = (token?: string) =>
    fetch(targetUrl, {
      ...requestInit,
      method: config.method,
      body: requestBody,
      signal: config.signal,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...config.headers,
        ...headers,
      },
    });

  let response = await send(accessToken);

  // Transparently recover from an expired access token: refresh once and retry.
  // Only attempts a retry when the caller supplied a token and a refresher is
  // registered, so unauthenticated 401s still surface immediately.
  if (response.status === 401 && accessToken && tokenRefresher) {
    const refreshed = await tokenRefresher();
    if (refreshed && refreshed !== accessToken) {
      response = await send(refreshed);
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
