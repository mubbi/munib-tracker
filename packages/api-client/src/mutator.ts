export type ApiFetchOptions = RequestInit & {
  accessToken?: string;
};

export type OrvalRequestConfig = {
  url: string;
  method: string;
  signal?: AbortSignal;
  headers?: HeadersInit;
  body?: BodyInit | null;
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
  const targetUrl = config.url.startsWith("http") ? config.url : `${getApiBaseUrl()}${config.url}`;

  const response = await fetch(targetUrl, {
    ...requestInit,
    method: config.method,
    body: config.body,
    signal: config.signal,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...config.headers,
      ...headers,
    },
  });

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
