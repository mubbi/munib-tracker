import { getRegisteredTokenRefresher, isWebCookieSessionToken } from "@munib-tracker/api-client";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

import {
  cacheDirectoryUri,
  deletePath,
  downloadToUri,
  ensureDirectory,
  fileInfo,
} from "@/lib/native-file-store";

/**
 * Private attachments (`/user-media/:id/content`) need the session's credentials.
 * Handing the URL straight to `<Image>` breaks whenever the access token (native
 * Bearer) or cookie (web, 15 min) has expired: the image request gets a 401 and
 * nothing refreshes the session or retries. These helpers load the bytes through
 * an authenticated request that refreshes once on 401, then expose a local URI
 * (`blob:` on web, cache `file://` on native) that needs no headers.
 */

type Headers = Record<string, string> | undefined;

const WEB_CLIENT_HEADERS = {
  "x-munib-tracker-client": "web",
  "x-client-platform": "web",
} as const;

const resolved = new Map<string, Promise<string>>();

export function isRemoteUri(uri: string): boolean {
  return uri.startsWith("http://") || uri.startsWith("https://");
}

/** Rotate the session once; returns headers for the retry, or null when signed out. */
async function refreshedHeaders(headers: Headers): Promise<Headers | null> {
  const refresher = getRegisteredTokenRefresher();
  if (!refresher) return null;
  const token = await refresher();
  if (!token) return null;
  if (isWebCookieSessionToken(token)) return headers;
  return { ...headers, Authorization: `Bearer ${token}` };
}

async function fetchWebBlob(uri: string, headers: Headers): Promise<Blob> {
  const send = (extra: Headers) =>
    fetch(uri, { credentials: "include", headers: { ...WEB_CLIENT_HEADERS, ...extra } });

  let response = await send(headers);
  if (response.status === 401) {
    const retryHeaders = await refreshedHeaders(headers);
    if (retryHeaders !== null) response = await send(retryHeaders);
  }
  if (!response.ok) {
    throw new Error(`Failed to load attachment (${response.status})`);
  }
  return response.blob();
}

/**
 * Native: download a private attachment to `localUri`, refreshing the session
 * once on 401. Rejects (and removes the partial file) on any non-2xx status so
 * an error body is never mistaken for the attachment.
 */
export async function downloadAuthedFile(
  remoteUri: string,
  localUri: string,
  headers?: Record<string, string>,
): Promise<string> {
  let result = await downloadToUri(remoteUri, localUri, headers ?? {});
  if (result.status === 401) {
    const retryHeaders = await refreshedHeaders(headers);
    if (retryHeaders !== null) {
      result = await downloadToUri(remoteUri, localUri, retryHeaders ?? {});
    }
  }
  if (result.status < 200 || result.status >= 300) {
    try {
      deletePath(localUri);
    } catch {
      // Best-effort cleanup of a partial / error-body file.
    }
    throw new Error(`Failed to load attachment (${result.status})`);
  }
  return result.uri;
}

async function loadNative(uri: string, headers: Headers): Promise<string> {
  const cacheDirectory = cacheDirectoryUri();
  if (!cacheDirectory) throw new Error("No cache directory available");
  const dir = `${cacheDirectory}user-media/`;
  ensureDirectory(dir);
  const localUri = `${dir}${uri.replace(/[^a-z0-9]+/gi, "_").slice(-120)}`;

  const info = fileInfo(localUri);
  if (info.exists && info.size) return localUri;
  return downloadAuthedFile(uri, localUri, headers);
}

/**
 * Resolve an attachment URI to one that can be rendered without auth headers.
 * Local URIs are returned unchanged; remote ones are fetched once per session.
 */
export function loadAuthedMedia(uri: string, headers?: Record<string, string>): Promise<string> {
  if (!isRemoteUri(uri)) return Promise.resolve(uri);

  const cached = resolved.get(uri);
  if (cached) return cached;

  const pending =
    Platform.OS === "web"
      ? fetchWebBlob(uri, headers).then((blob) => URL.createObjectURL(blob))
      : loadNative(uri, headers);
  resolved.set(uri, pending);
  // Never cache a failure — the next mount should try again.
  pending.catch(() => {
    if (resolved.get(uri) === pending) resolved.delete(uri);
  });
  return pending;
}

/** Fetch a private attachment as a Blob (web only — e.g. open in a new tab). */
export function fetchAuthedBlob(uri: string, headers?: Record<string, string>): Promise<Blob> {
  return fetchWebBlob(uri, headers);
}

/**
 * Hook form of {@link loadAuthedMedia}. `uri` is null until a remote attachment
 * has loaded; local URIs resolve synchronously (no flicker for draft thumbs).
 */
export function useAuthedMediaUri(
  uri: string | null,
  headers?: Record<string, string>,
): { uri: string | null; failed: boolean } {
  const immediate = uri !== null && !isRemoteUri(uri) ? uri : null;
  const [state, setState] = useState<{
    source: string | null;
    uri: string | null;
    failed: boolean;
  }>({ source: uri, uri: immediate, failed: false });
  const authorization = headers?.Authorization;

  useEffect(() => {
    if (uri === null || !isRemoteUri(uri)) return;
    let cancelled = false;
    loadAuthedMedia(uri, authorization ? { Authorization: authorization } : undefined).then(
      (local) => {
        if (!cancelled) setState({ source: uri, uri: local, failed: false });
      },
      () => {
        if (!cancelled) setState({ source: uri, uri: null, failed: true });
      },
    );
    return () => {
      cancelled = true;
    };
  }, [uri, authorization]);

  if (immediate !== null) return { uri: immediate, failed: false };
  // Ignore a result that belongs to a previous `uri` prop.
  if (state.source !== uri) return { uri: null, failed: false };
  return { uri: state.uri, failed: state.failed };
}
