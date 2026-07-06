import {
  deleteAsync,
  documentDirectory,
  downloadAsync,
  getInfoAsync,
  makeDirectoryAsync,
  readDirectoryAsync,
} from "expo-file-system/legacy";
import { Platform } from "react-native";

/**
 * Centralized offline store for streamed audio (Qur'an recitation & translation,
 * duas, adhkar, duroods, the 99 Names, adhan). Every content type funnels its
 * remote MP3 through {@link resolveCachedAudioUri} before playback, so caching is
 * transparent to callers.
 *
 * Native: downloads once into a persistent app-documents folder and replays the
 * local file forever — it is never evicted automatically, only when the user
 * clears it from Settings → Offline data ({@link clearAudioCache}).
 * Web: this module is a no-op — the service worker (`public/expo-service-worker.js`)
 * caches audio requests instead (FileSystem is unavailable on web).
 */

// Persistent (documents) rather than the OS-evictable cache directory, so a
// downloaded recitation keeps replaying locally until the user clears it.
const AUDIO_CACHE_DIR = `${documentDirectory ?? ""}munib-audio/`;

/** Dedupe concurrent downloads of the same remote URL. */
const inflight = new Map<string, Promise<string>>();

function localPathFor(remoteUri: string): string {
  const safe = encodeURIComponent(remoteUri).replace(/%/g, "_");
  return `${AUDIO_CACHE_DIR}${safe}.mp3`;
}

/** Whether the native file store is usable (false on web / before FS is ready). */
function nativeStoreAvailable(): boolean {
  return Platform.OS !== "web" && Boolean(documentDirectory);
}

/** @internal Test helper — reset in-flight download dedupe state. */
export function clearAudioCacheInflight(): void {
  inflight.clear();
}

/**
 * Resolve a remote audio URI to a local file path when cached (native only).
 * Downloads on first access; subsequent calls return the cached file without
 * hitting the network.
 */
export async function resolveCachedAudioUri(remoteUri: string): Promise<string> {
  if (!remoteUri.startsWith("http")) return remoteUri;
  if (!nativeStoreAvailable()) return remoteUri;

  const localUri = localPathFor(remoteUri);
  try {
    const info = await getInfoAsync(localUri);
    if (info.exists) return localUri;
  } catch {
    return remoteUri;
  }

  const pending = inflight.get(remoteUri);
  if (pending) return pending;

  const task = (async () => {
    try {
      await makeDirectoryAsync(AUDIO_CACHE_DIR, { intermediates: true });
      const result = await downloadAsync(remoteUri, localUri);
      return result.uri;
    } catch {
      return remoteUri;
    } finally {
      inflight.delete(remoteUri);
    }
  })();

  inflight.set(remoteUri, task);
  return task;
}

/** Prefetch an audio file into the on-device cache (no-op on web). */
export function prefetchAudioUri(remoteUri: string): void {
  if (!remoteUri.startsWith("http") || !nativeStoreAvailable()) return;
  void resolveCachedAudioUri(remoteUri);
}

/**
 * Total bytes of downloaded audio held on device. Returns 0 on web (the service
 * worker owns the web audio cache) or before the file store exists.
 */
export async function getAudioCacheSize(): Promise<number> {
  if (!nativeStoreAvailable()) return 0;
  try {
    const dirInfo = await getInfoAsync(AUDIO_CACHE_DIR);
    if (!dirInfo.exists) return 0;
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
    return total;
  } catch {
    return 0;
  }
}

/**
 * Delete every downloaded audio file (no-op on web). Also drops any in-flight
 * download promises so a subsequent play re-downloads cleanly.
 */
export async function clearAudioCache(): Promise<void> {
  inflight.clear();
  if (!nativeStoreAvailable()) return;
  try {
    await deleteAsync(AUDIO_CACHE_DIR, { idempotent: true });
  } catch {
    // Best-effort — nothing to clean up if the folder was already gone.
  }
}
