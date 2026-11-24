import { File } from "expo-file-system";
import { Platform } from "react-native";

import {
  deletePath,
  documentDirectoryUri,
  downloadToUri,
  ensureDirectory,
  fileInfo,
} from "@/lib/native-file-store";

import { MorphologyError, QAC_MORPHOLOGY } from "./source";

/**
 * Where the unmodified corpus file lives on the device (D22: kept verbatim,
 * never bundled, never synced or backed up):
 *
 * - native: `<documents>/munib-quran-morphology/quranic-corpus-morphology-0.4.txt`
 * - web: Cache Storage bucket `munib-quran-morphology-v1` (separate from the audio
 *   bucket so "Clear audio" never drops it). The browser may evict it; the
 *   feature then simply asks to download again.
 *
 * Listed (and cleared) under Settings → Data & storage → Offline data.
 */
export const WEB_MORPHOLOGY_CACHE = "munib-quran-morphology-v1";
const WEB_KEY = `https://munib.local/quran-morphology/${QAC_MORPHOLOGY.fileName}`;
const NATIVE_DIR = "munib-quran-morphology/";

export type DownloadProgress = { bytesDone: number; bytesTotal: number };
export type CancelSignal = { cancelled: boolean; onCancel?: () => void };

function isWeb(): boolean {
  return Platform.OS === "web";
}

function hasCacheStorage(): boolean {
  return typeof caches !== "undefined";
}

function nativeDir(): string | null {
  const base = documentDirectoryUri();
  return base ? `${base}${NATIVE_DIR}` : null;
}

function nativeFileUri(): string | null {
  const dir = nativeDir();
  return dir ? `${dir}${QAC_MORPHOLOGY.fileName}` : null;
}

/** The stored file's text (exactly as downloaded), or null when not on the device. */
export async function readStoredMorphology(): Promise<string | null> {
  try {
    if (isWeb()) {
      if (!hasCacheStorage()) return null;
      const cache = await caches.open(WEB_MORPHOLOGY_CACHE);
      const res = await cache.match(WEB_KEY);
      return res ? await res.text() : null;
    }
    const uri = nativeFileUri();
    if (!uri || !fileInfo(uri).exists) return null;
    return await new File(uri).text();
  } catch {
    return null;
  }
}

/** Bytes the stored file takes (0 when absent). */
export async function storedMorphologyBytes(): Promise<number> {
  try {
    if (isWeb()) {
      if (!hasCacheStorage()) return 0;
      const cache = await caches.open(WEB_MORPHOLOGY_CACHE);
      const res = await cache.match(WEB_KEY);
      if (!res) return 0;
      const len = Number(res.headers.get("content-length") ?? 0);
      return Number.isFinite(len) && len > 0 ? len : QAC_MORPHOLOGY.bytes;
    }
    const uri = nativeFileUri();
    if (!uri) return 0;
    const info = fileInfo(uri);
    return info.exists ? (info.size ?? 0) : 0;
  } catch {
    return 0;
  }
}

/** Remove the stored file (hash mismatch, Offline data → Clear, reset). */
export async function deleteStoredMorphology(): Promise<void> {
  try {
    if (isWeb()) {
      if (hasCacheStorage()) await caches.delete(WEB_MORPHOLOGY_CACHE);
      return;
    }
    const dir = nativeDir();
    if (dir) deletePath(dir);
  } catch {
    // best effort — a leftover file is re-verified before any use
  }
}

async function fetchWebText(
  url: string,
  onProgress: (p: DownloadProgress) => void,
  signal: CancelSignal,
): Promise<string> {
  const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
  signal.onCancel = () => controller?.abort();
  let res: Response;
  try {
    res = await fetch(url, { signal: controller?.signal, cache: "no-store" });
  } catch (error) {
    if (signal.cancelled) throw new MorphologyError("download-cancelled");
    throw new MorphologyError("no-connection", (error as Error)?.message);
  }
  if (!res.ok) throw new MorphologyError("download-failed", `HTTP ${res.status}`);
  const total = Number(res.headers.get("content-length") ?? 0) || QAC_MORPHOLOGY.bytes;
  if (!res.body?.getReader) {
    const text = await res.text();
    onProgress({ bytesDone: total, bytesTotal: total });
    return text;
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let text = "";
  let done = 0;
  try {
    for (;;) {
      const chunk = await reader.read();
      if (chunk.done) break;
      if (signal.cancelled) throw new MorphologyError("download-cancelled");
      done += chunk.value.length;
      text += decoder.decode(chunk.value, { stream: true });
      onProgress({ bytesDone: done, bytesTotal: Math.max(total, done) });
    }
  } catch (error) {
    if (error instanceof MorphologyError) throw error;
    if (signal.cancelled) throw new MorphologyError("download-cancelled");
    throw new MorphologyError("no-connection", (error as Error)?.message);
  }
  return text + decoder.decode();
}

/**
 * Download one mirror and store it unmodified. Returns the stored text; the
 * caller verifies the hash and calls {@link deleteStoredMorphology} on mismatch.
 */
export async function downloadMorphologyFrom(
  url: string,
  onProgress: (p: DownloadProgress) => void,
  signal: CancelSignal,
): Promise<string> {
  if (isWeb()) {
    const text = await fetchWebText(url, onProgress, signal);
    if (signal.cancelled) throw new MorphologyError("download-cancelled");
    if (hasCacheStorage()) {
      try {
        const cache = await caches.open(WEB_MORPHOLOGY_CACHE);
        await cache.put(
          WEB_KEY,
          new Response(text, {
            headers: {
              "content-type": "text/plain; charset=utf-8",
              "content-length": String(text.length),
            },
          }),
        );
      } catch {
        // Quota or private mode: keep working in memory for this session.
      }
    }
    return text;
  }

  const dir = nativeDir();
  const uri = nativeFileUri();
  if (!dir || !uri) throw new MorphologyError("storage-failed");
  try {
    ensureDirectory(dir);
  } catch (error) {
    throw new MorphologyError("storage-failed", (error as Error)?.message);
  }
  onProgress({ bytesDone: 0, bytesTotal: QAC_MORPHOLOGY.bytes });
  let status: number;
  try {
    ({ status } = await downloadToUri(url, uri));
  } catch (error) {
    if (signal.cancelled) throw new MorphologyError("download-cancelled");
    throw new MorphologyError("no-connection", (error as Error)?.message);
  }
  if (signal.cancelled) {
    deletePath(uri);
    throw new MorphologyError("download-cancelled");
  }
  if (status < 200 || status >= 300) {
    deletePath(uri);
    throw new MorphologyError("download-failed", `HTTP ${status}`);
  }
  const size = fileInfo(uri).size ?? QAC_MORPHOLOGY.bytes;
  onProgress({ bytesDone: size, bytesTotal: size });
  try {
    return await new File(uri).text();
  } catch (error) {
    throw new MorphologyError("storage-failed", (error as Error)?.message);
  }
}
