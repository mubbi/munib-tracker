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

/**
 * Join {@link getApiBaseUrl} with a relative path or absolute URL.
 *
 * Orval emits paths like `/api/v1/auth/me` while `EXPO_PUBLIC_API_URL` already
 * includes `/api/v1` — strip the duplicate prefix so callers don't 404.
 * Hand-written wrappers use short paths (`/auth/me`) and stay unchanged.
 */
export function resolveApiUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  const base = getApiBaseUrl().replace(/\/$/, "");
  let path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;

  if (base.endsWith("/api/v1") && (path === "/api/v1" || path.startsWith("/api/v1/"))) {
    path = path.slice("/api/v1".length) || "/";
  }

  return `${base}${path === "/" ? "" : path}`;
}
