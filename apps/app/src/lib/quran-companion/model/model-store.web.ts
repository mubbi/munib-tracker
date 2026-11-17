import { RECITATION_MODELS, webModelUrl } from "@/constants/recitation-models";

import { PracticeError } from "../error-codes";
import type { EngineId } from "../types";
import type { RecitationModelStore } from "./types";

/**
 * Web listener files (§7, decision D4): Cache Storage bucket
 * `munib-recitation-model-v1` — deliberately NOT `munib-audio-v1`, which Offline
 * data → Clear audio deletes whole. Fetched with a stream reader for progress,
 * verified with `crypto.subtle` SHA-256, then `cache.put`. The browser may evict
 * the bucket; the store then reports Not downloaded without an error.
 */

export const MODEL_CACHE = "munib-recitation-model-v1";
const KEY_PREFIX = "https://munib.local/recitation-models/";

function cacheKey(fileName: string): string {
  return KEY_PREFIX + fileName;
}

function hasCacheStorage(): boolean {
  return typeof caches !== "undefined" && typeof crypto !== "undefined" && !!crypto.subtle;
}

async function sha256Hex(buffer: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function fetchWithProgress(
  url: string,
  expectedBytes: number,
  onBytes: (done: number) => void,
  signal: { cancelled: boolean; onCancel?: () => void },
): Promise<ArrayBuffer> {
  const controller = new AbortController();
  signal.onCancel = () => controller.abort();
  let response: Response;
  try {
    response = await fetch(url, { signal: controller.signal, cache: "no-store" });
  } catch (error) {
    if (signal.cancelled) throw new PracticeError("download-cancelled");
    throw new PracticeError("no-connection", (error as Error)?.message);
  }
  if (!response.ok || !response.body) {
    throw new PracticeError("download-failed", `HTTP ${response.status}`);
  }
  const reader = response.body.getReader();
  const out = new Uint8Array(expectedBytes);
  let done = 0;
  try {
    for (;;) {
      const { value, done: finished } = await reader.read();
      if (finished) break;
      if (signal.cancelled) throw new PracticeError("download-cancelled");
      if (done + value.length > out.length) throw new PracticeError("checksum-mismatch");
      out.set(value, done);
      done += value.length;
      onBytes(done);
    }
  } catch (error) {
    if (error instanceof PracticeError) throw error;
    if (signal.cancelled) throw new PracticeError("download-cancelled");
    throw new PracticeError("no-connection", (error as Error)?.message);
  }
  if (done !== expectedBytes) throw new PracticeError("checksum-mismatch");
  return out.buffer;
}

export function createRecitationModelStore(): RecitationModelStore {
  return {
    async sizeOnDisk() {
      if (!hasCacheStorage()) return 0;
      try {
        const cache = await caches.open(MODEL_CACHE);
        let total = 0;
        for (const request of await cache.keys()) {
          const res = await cache.match(request);
          const len = Number(res?.headers.get("content-length") ?? 0);
          total += Number.isFinite(len) ? len : 0;
        }
        return total;
      } catch {
        return 0;
      }
    },

    async isPresent(manifest) {
      if (!hasCacheStorage()) return false;
      try {
        const cache = await caches.open(MODEL_CACHE);
        for (const f of manifest.files) {
          if (!(await cache.match(cacheKey(f.fileName)))) return false;
        }
        return true;
      } catch {
        return false;
      }
    },

    async freeBytes() {
      try {
        const estimate = await navigator.storage?.estimate?.();
        if (estimate?.quota == null || estimate.usage == null) return null;
        return estimate.quota - estimate.usage;
      } catch {
        return null;
      }
    },

    canResume() {
      return false;
    },

    async download(engine: EngineId, onProgress, signal) {
      if (!hasCacheStorage()) throw new PracticeError("runtime-unsupported");
      const spec = RECITATION_MODELS[engine];
      if (!spec.webHosted) throw new PracticeError("runtime-unsupported");
      const total = spec.files.reduce((sum, f) => sum + f.bytes, 0);
      const free = await this.freeBytes();
      if (free != null && free < total * 2) throw new PracticeError("not-enough-space");
      const cache = await caches.open(MODEL_CACHE);
      let doneBefore = 0;
      for (const file of spec.files) {
        if (signal.cancelled) throw new PracticeError("download-cancelled");
        if (await cache.match(cacheKey(file.fileName))) {
          doneBefore += file.bytes;
          onProgress({ bytesDone: doneBefore, bytesTotal: total });
          continue;
        }
        // Same-origin copy: GitHub release assets send no CORS headers (see constants).
        const buffer = await fetchWithProgress(
          webModelUrl(engine, file),
          file.bytes,
          (bytes) => onProgress({ bytesDone: doneBefore + bytes, bytesTotal: total }),
          signal,
        );
        if ((await sha256Hex(buffer)) !== file.sha256) throw new PracticeError("checksum-mismatch");
        try {
          await cache.put(
            cacheKey(file.fileName),
            new Response(buffer, {
              headers: {
                "content-type":
                  file.kind === "model" ? "application/octet-stream" : "application/json",
                "content-length": String(file.bytes),
              },
            }),
          );
        } catch (error) {
          throw new PracticeError("not-enough-space", (error as Error)?.message);
        }
        doneBefore += file.bytes;
        onProgress({ bytesDone: doneBefore, bytesTotal: total });
      }
      try {
        await navigator.storage?.persist?.();
      } catch {
        // A refusal is fine — the browser may still keep it.
      }
      return {
        engine,
        version: spec.version,
        files: spec.files.map(({ fileName, bytes, sha256, md5 }) => ({
          fileName,
          bytes,
          sha256,
          md5,
        })),
        downloadedAt: new Date().toISOString(),
      };
    },

    async deleteAll() {
      if (!hasCacheStorage()) return;
      try {
        await caches.delete(MODEL_CACHE);
      } catch {
        // best effort
      }
    },

    async cleanupOrphans(manifest) {
      if (!hasCacheStorage()) return;
      try {
        const cache = await caches.open(MODEL_CACHE);
        const keep = new Set(manifest?.files.map((f) => cacheKey(f.fileName)) ?? []);
        for (const request of await cache.keys()) {
          if (!keep.has(request.url)) await cache.delete(request);
        }
      } catch {
        // best effort
      }
    },

    async load(manifest) {
      const cache = await caches.open(MODEL_CACHE);
      const spec = RECITATION_MODELS[manifest.engine];
      const json: Record<string, unknown> = {};
      let modelBytes: ArrayBuffer | undefined;
      for (const file of spec.files) {
        const res = await cache.match(cacheKey(file.fileName));
        if (!res) throw new PracticeError("model-missing");
        if (file.kind === "model") modelBytes = await res.arrayBuffer();
        else if (file.kind === "json") json[file.fileName] = await res.json();
      }
      return { modelBytes, json };
    },
  };
}

export async function deleteRecitationModelFiles(): Promise<void> {
  if (!hasCacheStorage()) return;
  try {
    await caches.delete(MODEL_CACHE);
  } catch {
    // best effort
  }
}

export async function recitationModelBytesOnDisk(): Promise<number> {
  return createRecitationModelStore().sizeOnDisk();
}
