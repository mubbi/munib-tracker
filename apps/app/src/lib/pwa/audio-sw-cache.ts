import { Platform } from "react-native";

/**
 * Web-only bridge to the audio cache owned by `public/expo-service-worker.js`.
 * The service worker caches every audio request (cache-first) so the PWA replays
 * recitations from local storage; these helpers let Settings → Offline data read
 * that cache's size and clear it. No-ops on native (the file store there is owned
 * by `lib/audio-cache.ts`) and whenever no service worker controls the page.
 */

const MSG_CLEAR = "CLEAR_AUDIO_CACHE";
const MSG_SIZE = "GET_AUDIO_CACHE_SIZE";

/** Never let Settings hang if the worker is slow/unavailable. */
const REPLY_TIMEOUT_MS = 4000;

export interface WebAudioCacheInfo {
  /** Bytes of readable (CORS) cached clips; opaque cross-origin clips are counted, not sized. */
  bytes: number;
  /** Number of cached audio files (includes opaque clips with unknown size). */
  count: number;
}

function activeController(): ServiceWorker | null {
  if (Platform.OS !== "web") return null;
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return null;
  return navigator.serviceWorker.controller ?? null;
}

/** Round-trip a message to the SW and await its reply on a dedicated port. */
function requestFromWorker<T>(type: string, fallback: T): Promise<T> {
  const worker = activeController();
  if (!worker || typeof MessageChannel === "undefined") return Promise.resolve(fallback);

  return new Promise<T>((resolve) => {
    let settled = false;
    const finish = (value: T) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };

    const channel = new MessageChannel();
    const timer = setTimeout(() => finish(fallback), REPLY_TIMEOUT_MS);
    channel.port1.onmessage = (event) => {
      clearTimeout(timer);
      finish((event.data as T) ?? fallback);
    };

    try {
      worker.postMessage({ type }, [channel.port2]);
    } catch {
      clearTimeout(timer);
      finish(fallback);
    }
  });
}

/** Size + file count of the web audio cache (zeros when no SW controls the page). */
export async function getWebAudioCacheSize(): Promise<WebAudioCacheInfo> {
  const result = await requestFromWorker<Partial<WebAudioCacheInfo>>(MSG_SIZE, {});
  return { bytes: result.bytes ?? 0, count: result.count ?? 0 };
}

/** Delete every cached audio clip held by the service worker. */
export async function clearWebAudioCache(): Promise<void> {
  await requestFromWorker<unknown>(MSG_CLEAR, null);
}
