import {
  deleteAsync,
  documentDirectory,
  downloadAsync,
  getFreeDiskStorageAsync,
  getInfoAsync,
  makeDirectoryAsync,
  readDirectoryAsync,
} from "expo-file-system/legacy";
import { Platform } from "react-native";
import { classifyOssAudioUri } from "@/lib/classify-oss-audio-uri";
import { reportOssContentDownloadFailure } from "@/lib/report-oss-content-download-failure";
import { preferencesStore } from "@/stores/preferences-store";

/**
 * Centralized offline store for streamed audio (Qur'an recitation & translation,
 * duas, adhkar, duroods, the 99 Names, adhan). Every content type funnels its
 * remote MP3 through {@link resolveCachedAudioUri} before playback, so caching is
 * transparent to callers.
 *
 * Native: downloads once into a persistent app-documents folder and replays the
 * local file forever — it is never evicted automatically, only when the user
 * clears it from Settings → Offline data ({@link clearAudioCache}).
 *
 * Web: caches the full clip in the Cache Storage API (bucket `munib-audio-v1`,
 * shared with `public/expo-service-worker.js`) and replays it from a `blob:`
 * object URL. Because the object URL is backed by an in-memory Blob, the media
 * element serves every byte (and every seek `Range`) locally — it never hits the
 * network again. This runs entirely in the app, so it works identically in dev
 * and production and does not depend on the service worker controlling the page.
 */

function reportAudioDownloadFailure(
  remoteUri: string,
  input: {
    errorCode?: "http_error" | "network_error" | "empty_payload" | "download_failed";
    errorMessage: string;
    httpStatus?: number;
    error?: unknown;
  },
): void {
  const classified = classifyOssAudioUri(remoteUri);
  reportOssContentDownloadFailure({
    ...classified,
    sourceUrl: remoteUri,
    errorCode: input.errorCode ?? (input.httpStatus != null ? "http_error" : "download_failed"),
    errorMessage: input.errorMessage,
    httpStatus: input.httpStatus,
    error: input.error,
  });
}

// Persistent (documents) rather than the OS-evictable cache directory, so a
// downloaded recitation keeps replaying locally until the user clears it.
const AUDIO_CACHE_DIR = `${documentDirectory ?? ""}munib-audio/`;

/** Dedupe concurrent downloads of the same remote URL (native). */
const inflight = new Map<string, Promise<string>>();

function localPathFor(remoteUri: string): string {
  const safe = encodeURIComponent(remoteUri).replace(/%/g, "_");
  return `${AUDIO_CACHE_DIR}${safe}.mp3`;
}

/** Whether the native file store is usable (false on web / before FS is ready). */
function nativeStoreAvailable(): boolean {
  return Platform.OS !== "web" && Boolean(documentDirectory);
}

/**
 * Keep this much free disk (bytes) before persisting any more audio. Below it we
 * stop writing new clips and stream from the network instead, so a nearly-full
 * device is never pushed over the edge by the offline cache.
 */
const MIN_FREE_DISK_BYTES = 250 * 1024 * 1024; // 250 MB
/** Native disk reads aren't free — reuse the last reading for a short window. */
const FREE_DISK_TTL_MS = 15_000;
let cachedFreeDisk: { bytes: number; at: number } | null = null;

/**
 * Whether there's enough headroom to persist another clip on device. Defaults to
 * `true` whenever free space can't be determined (API unavailable or throwing),
 * so caching keeps working everywhere — we only *skip* it when we positively
 * know the disk is low, degrading gracefully to streaming the remote URL.
 */
async function hasRoomToCacheNative(): Promise<boolean> {
  if (typeof getFreeDiskStorageAsync !== "function") return true;
  const now = Date.now();
  if (cachedFreeDisk && now - cachedFreeDisk.at < FREE_DISK_TTL_MS) {
    return cachedFreeDisk.bytes >= MIN_FREE_DISK_BYTES;
  }
  try {
    const free = await getFreeDiskStorageAsync();
    cachedFreeDisk = { bytes: free, at: now };
    return free >= MIN_FREE_DISK_BYTES;
  } catch {
    return true;
  }
}

// ── Web (Cache Storage + blob URLs) ──────────────────────────────────────────

/** Shared with the service worker so Settings size/clear stays consistent. */
const WEB_AUDIO_CACHE = "munib-audio-v1";
/** Cap resident object URLs so long sessions don't leak Blob memory. Sized above
 *  the largest surah (Al-Baqarah, 286 ayahs) so the playing clip is never evicted
 *  mid-queue. */
const MAX_WEB_OBJECT_URLS = 512;

/** remoteUri → `blob:` object URL for clips resolved this session (LRU-ordered). */
const webObjectUrls = new Map<string, string>();
/** Dedupe concurrent resolves of the same remote URL (web). */
const webInflight = new Map<string, Promise<string>>();

/**
 * Whether the user allows saving streamed audio to on-device storage. Defaults
 * to true when unset so existing installs keep caching until they opt out.
 */
export function isAudioLocalCacheEnabled(): boolean {
  return preferencesStore.getState().prefs.cacheAudioLocally !== false;
}

/** Whether the Cache Storage + fetch APIs needed for the web cache exist. */
function webCacheAvailable(): boolean {
  return (
    Platform.OS === "web" &&
    typeof caches !== "undefined" &&
    typeof fetch !== "undefined" &&
    typeof URL !== "undefined" &&
    typeof URL.createObjectURL === "function"
  );
}

/** Return (and refresh the LRU position of) a resolved object URL, or null. */
function touchObjectUrl(remoteUri: string): string | null {
  const url = webObjectUrls.get(remoteUri);
  if (url == null) return null;
  webObjectUrls.delete(remoteUri);
  webObjectUrls.set(remoteUri, url);
  return url;
}

/** Record an object URL, revoking the oldest entries once over the cap. */
function rememberObjectUrl(remoteUri: string, objectUrl: string): void {
  webObjectUrls.set(remoteUri, objectUrl);
  while (webObjectUrls.size > MAX_WEB_OBJECT_URLS) {
    const oldest = webObjectUrls.keys().next().value;
    if (oldest === undefined) break;
    const stale = webObjectUrls.get(oldest);
    webObjectUrls.delete(oldest);
    if (stale) {
      try {
        URL.revokeObjectURL(stale);
      } catch {
        // Best-effort revoke.
      }
    }
  }
}

/**
 * Synchronous peek at the session object URL for a clip (web only). Lets the
 * player start a replay inside the user's tap gesture without awaiting the cache.
 * Returns null when the clip hasn't been resolved to a local blob yet.
 */
export function peekCachedAudioUri(remoteUri: string): string | null {
  if (Platform.OS !== "web") return null;
  return touchObjectUrl(remoteUri);
}

/** Resolve a remote clip to a local `blob:` object URL, caching the bytes. */
async function resolveWebCachedAudioUri(remoteUri: string): Promise<string> {
  if (!webCacheAvailable()) return remoteUri;

  const existing = touchObjectUrl(remoteUri);
  if (existing) return existing;

  // User opted out of local storage — stream without downloading new bytes.
  if (!isAudioLocalCacheEnabled()) return remoteUri;

  const pending = webInflight.get(remoteUri);
  if (pending) return pending;

  const task = (async () => {
    try {
      const cache = await caches.open(WEB_AUDIO_CACHE);
      let cached = (await cache.match(remoteUri, { ignoreVary: true })) ?? undefined;
      // Opaque cross-origin bodies read back as empty blobs — refetch with CORS.
      if (cached && cached.type === "opaque") cached = undefined;

      if (!cached) {
        const net = await fetch(remoteUri, { mode: "cors", credentials: "omit" });
        if (!net.ok) {
          reportAudioDownloadFailure(remoteUri, {
            httpStatus: net.status,
            errorMessage: `HTTP ${net.status} for ${remoteUri}`,
          });
          return remoteUri;
        }
        try {
          await cache.put(remoteUri, net.clone());
        } catch {
          // Quota/opaque put failure — still play from the fetched response.
        }
        cached = net;
      }

      const blob = await cached.blob();
      if (blob.size === 0) {
        reportAudioDownloadFailure(remoteUri, {
          errorCode: "empty_payload",
          errorMessage: `Empty audio blob for ${remoteUri}`,
        });
        return remoteUri;
      }
      const objectUrl = URL.createObjectURL(blob);
      rememberObjectUrl(remoteUri, objectUrl);
      return objectUrl;
    } catch (error) {
      reportAudioDownloadFailure(remoteUri, {
        errorCode: "network_error",
        errorMessage: error instanceof Error ? error.message : String(error),
        error,
      });
      return remoteUri;
    } finally {
      webInflight.delete(remoteUri);
    }
  })();

  webInflight.set(remoteUri, task);
  return task;
}

/** Bytes + file count held in the web Cache Storage audio bucket. */
async function getWebAudioCacheInfo(): Promise<{ bytes: number; count: number }> {
  if (!webCacheAvailable()) return { bytes: 0, count: 0 };
  try {
    const cache = await caches.open(WEB_AUDIO_CACHE);
    const requests = await cache.keys();
    let bytes = 0;
    for (const req of requests) {
      const res = await cache.match(req);
      if (!res) continue;
      const len = res.headers.get("content-length");
      if (len) {
        bytes += Number.parseInt(len, 10) || 0;
      } else if (res.type !== "opaque") {
        try {
          bytes += (await res.clone().arrayBuffer()).byteLength;
        } catch {
          // Unreadable — counted, size unknown.
        }
      }
    }
    return { bytes, count: requests.length };
  } catch {
    return { bytes: 0, count: 0 };
  }
}

// ── Native (documents file store) ────────────────────────────────────────────

/** @internal Test helper — reset in-flight download dedupe state. */
export function clearAudioCacheInflight(): void {
  inflight.clear();
  webInflight.clear();
  cachedFreeDisk = null;
}

/**
 * Resolve a remote audio URI to a locally-cached URI when possible. Downloads on
 * first access; subsequent calls return the cached copy without hitting the
 * network (native: a `file://` path; web: a `blob:` object URL).
 */
export async function resolveCachedAudioUri(remoteUri: string): Promise<string> {
  if (!remoteUri.startsWith("http")) return remoteUri;
  if (Platform.OS === "web") return resolveWebCachedAudioUri(remoteUri);
  if (!nativeStoreAvailable()) return remoteUri;

  const localUri = localPathFor(remoteUri);
  try {
    const info = await getInfoAsync(localUri);
    if (info.exists) return localUri;
  } catch {
    return remoteUri;
  }

  // User opted out — don't write new files; stream from the network instead.
  if (!isAudioLocalCacheEnabled()) return remoteUri;

  // Not cached yet: only download when there's disk headroom. When space is low
  // we stream the remote URL instead of writing to an (almost) full device.
  if (!(await hasRoomToCacheNative())) return remoteUri;

  const pending = inflight.get(remoteUri);
  if (pending) return pending;

  const task = (async () => {
    try {
      await makeDirectoryAsync(AUDIO_CACHE_DIR, { intermediates: true });
      const result = await downloadAsync(remoteUri, localUri);
      return result.uri;
    } catch (error) {
      reportAudioDownloadFailure(remoteUri, {
        errorMessage: error instanceof Error ? error.message : String(error),
        error,
      });
      return remoteUri;
    } finally {
      inflight.delete(remoteUri);
    }
  })();

  inflight.set(remoteUri, task);
  return task;
}

/**
 * Prefetch an audio file so a later {@link resolveCachedAudioUri} (or, on web,
 * {@link peekCachedAudioUri}) is served entirely from the local cache with no
 * network round-trip — used to warm upcoming tracks for gapless auto-advance.
 *
 * Native: downloads the clip into the documents store.
 * Web: fully resolves the clip to a `blob:` object URL (not just Cache Storage),
 * so the next play reads it locally — the HTML media element cannot read from
 * Cache Storage on its own, so warming the cache alone would still re-download.
 */
export function prefetchAudioUri(remoteUri: string): void {
  if (!remoteUri.startsWith("http")) return;
  if (!isAudioLocalCacheEnabled()) return;
  if (Platform.OS === "web") {
    if (webCacheAvailable() && !webObjectUrls.has(remoteUri)) {
      void resolveWebCachedAudioUri(remoteUri).catch(() => {});
    }
    return;
  }
  if (!nativeStoreAvailable()) return;
  void resolveCachedAudioUri(remoteUri);
}

/** On-device size + file count of downloaded audio (native files or web cache). */
export async function getAudioCacheInfo(): Promise<{ bytes: number; count: number }> {
  if (Platform.OS === "web") return getWebAudioCacheInfo();
  if (!nativeStoreAvailable()) return { bytes: 0, count: 0 };
  try {
    const dirInfo = await getInfoAsync(AUDIO_CACHE_DIR);
    if (!dirInfo.exists) return { bytes: 0, count: 0 };
    const files = await readDirectoryAsync(AUDIO_CACHE_DIR);
    let total = 0;
    for (const name of files) {
      try {
        const info = await getInfoAsync(`${AUDIO_CACHE_DIR}${name}`);
        if (info.exists && typeof info.size === "number") total += info.size;
      } catch {
        // Skip an entry we can't stat; keep summing the rest.
      }
    }
    return { bytes: total, count: files.length };
  } catch {
    return { bytes: 0, count: 0 };
  }
}

/**
 * Total bytes of downloaded audio held on device (native files or web cache).
 */
export async function getAudioCacheSize(): Promise<number> {
  return (await getAudioCacheInfo()).bytes;
}

/**
 * Delete every cached audio clip (native files or the web Cache Storage bucket).
 * Also drops in-flight download promises and revokes web object URLs so a
 * subsequent play re-downloads/re-resolves cleanly.
 */
export async function clearAudioCache(): Promise<void> {
  inflight.clear();
  webInflight.clear();
  cachedFreeDisk = null;

  if (Platform.OS === "web") {
    for (const url of webObjectUrls.values()) {
      try {
        URL.revokeObjectURL(url);
      } catch {
        // Best-effort revoke.
      }
    }
    webObjectUrls.clear();
    if (typeof caches !== "undefined") {
      try {
        await caches.delete(WEB_AUDIO_CACHE);
      } catch {
        // Best-effort — nothing to clean up if the bucket was already gone.
      }
    }
    return;
  }

  if (!nativeStoreAvailable()) return;
  try {
    await deleteAsync(AUDIO_CACHE_DIR, { idempotent: true });
  } catch {
    // Best-effort — nothing to clean up if the folder was already gone.
  }
}
