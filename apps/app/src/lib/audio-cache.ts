import {
  cacheDirectory,
  downloadAsync,
  getInfoAsync,
  makeDirectoryAsync,
} from "expo-file-system/legacy";
import { Platform } from "react-native";

/**
 * Offline cache for streamed Qur'an recitation / audio-translation MP3s.
 * Native: downloads once to the app cache directory and reuses the local file.
 * Web: relies on the browser HTTP cache (no FileSystem on web).
 */

const AUDIO_CACHE_DIR = `${cacheDirectory ?? ""}munib-audio/`;

/** Dedupe concurrent downloads of the same remote URL. */
const inflight = new Map<string, Promise<string>>();

function localPathFor(remoteUri: string): string {
  const safe = encodeURIComponent(remoteUri).replace(/%/g, "_");
  return `${AUDIO_CACHE_DIR}${safe}.mp3`;
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
  if (Platform.OS === "web") return remoteUri;
  if (!cacheDirectory) return remoteUri;

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
  if (!remoteUri.startsWith("http") || Platform.OS === "web") return;
  void resolveCachedAudioUri(remoteUri);
}
