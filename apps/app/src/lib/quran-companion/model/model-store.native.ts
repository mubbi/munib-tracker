import {
  createDownloadResumable,
  type DownloadResumable,
  deleteAsync,
  documentDirectory,
  getFreeDiskStorageAsync,
  getInfoAsync,
  makeDirectoryAsync,
  moveAsync,
  readAsStringAsync,
  readDirectoryAsync,
} from "expo-file-system/legacy";

import { RECITATION_MODELS } from "@/constants/recitation-models";

import { PracticeError } from "../error-codes";
import type { EngineId } from "../types";
import type { RecitationModelStore } from "./types";

/**
 * Native listener files (§7 Model files): `${documentDirectory}recitation-models/`
 * via `expo-file-system/legacy` (the same import the audio cache uses). Downloads
 * go to `<name>.part` and are renamed only after size + MD5 pass — MD5 is computed
 * natively by `getInfoAsync(uri, { md5: true })`, so a 66 MB file is never read
 * into JS. Not inside `munib-audio/`, so clearing audio never touches it.
 */

export const MODEL_DIR = `${documentDirectory ?? ""}recitation-models/`;
const PART = ".part";

function stripScheme(uri: string): string {
  return uri.replace(/^file:\/\//, "");
}

async function ensureDir(): Promise<void> {
  const info = await getInfoAsync(MODEL_DIR);
  if (!info.exists) await makeDirectoryAsync(MODEL_DIR, { intermediates: true });
}

/** Resume data for the one automatic resume after an interruption (§7). */
let interrupted: { engine: EngineId; resumable: DownloadResumable } | null = null;

export function createRecitationModelStore(): RecitationModelStore {
  return {
    async sizeOnDisk() {
      try {
        const info = await getInfoAsync(MODEL_DIR);
        if (!info.exists) return 0;
        let total = 0;
        for (const name of await readDirectoryAsync(MODEL_DIR)) {
          const file = await getInfoAsync(MODEL_DIR + name);
          if (file.exists && !file.isDirectory) total += file.size ?? 0;
        }
        return total;
      } catch {
        return 0;
      }
    },

    async isPresent(manifest) {
      for (const f of manifest.files) {
        const info = await getInfoAsync(MODEL_DIR + f.fileName);
        if (!info.exists || (info.size ?? -1) !== f.bytes) return false;
      }
      return true;
    },

    async freeBytes() {
      try {
        return await getFreeDiskStorageAsync();
      } catch {
        return null;
      }
    },

    canResume() {
      return interrupted != null;
    },

    async download(engine, onProgress, signal) {
      const spec = RECITATION_MODELS[engine];
      const total = spec.files.reduce((sum, f) => sum + f.bytes, 0);
      const free = await this.freeBytes();
      if (free != null && free < total * 2) throw new PracticeError("not-enough-space");
      await ensureDir();

      let doneBefore = 0;
      for (const file of spec.files) {
        if (signal.cancelled) throw new PracticeError("download-cancelled");
        const target = MODEL_DIR + file.fileName;
        const existing = await getInfoAsync(target, { md5: true });
        if (existing.exists && existing.size === file.bytes && existing.md5 === file.md5) {
          doneBefore += file.bytes;
          onProgress({ bytesDone: doneBefore, bytesTotal: total });
          continue;
        }
        const partUri = target + PART;
        const resumable =
          interrupted?.engine === engine
            ? interrupted.resumable
            : createDownloadResumable(file.url, partUri, {}, (p) => {
                onProgress({
                  bytesDone: doneBefore + Math.min(p.totalBytesWritten, file.bytes),
                  bytesTotal: total,
                });
              });
        interrupted = null;
        signal.onCancel = () => {
          void resumable.cancelAsync().catch(() => {});
        };
        let result: { status: number } | undefined;
        try {
          result = (await resumable.downloadAsync()) ?? undefined;
        } catch (error) {
          if (signal.cancelled) {
            await deleteAsync(partUri, { idempotent: true }).catch(() => {});
            throw new PracticeError("download-cancelled");
          }
          // Keep the resumable for one automatic resume on the next foreground.
          interrupted = { engine, resumable };
          const message = (error as Error)?.message ?? "";
          throw new PracticeError(
            /network|connection|offline|timed out|host/i.test(message)
              ? "no-connection"
              : "download-failed",
            message,
          );
        }
        if (signal.cancelled) {
          await deleteAsync(partUri, { idempotent: true }).catch(() => {});
          throw new PracticeError("download-cancelled");
        }
        if (!result || result.status < 200 || result.status >= 300) {
          await deleteAsync(partUri, { idempotent: true }).catch(() => {});
          throw new PracticeError("download-failed", `HTTP ${result?.status ?? "?"}`);
        }
        const info = await getInfoAsync(partUri, { md5: true });
        if (!info.exists || info.size !== file.bytes || info.md5 !== file.md5) {
          await deleteAsync(partUri, { idempotent: true }).catch(() => {});
          throw new PracticeError("checksum-mismatch");
        }
        await deleteAsync(target, { idempotent: true }).catch(() => {});
        await moveAsync({ from: partUri, to: target });
        doneBefore += file.bytes;
        onProgress({ bytesDone: doneBefore, bytesTotal: total });
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
      interrupted = null;
      await deleteAsync(MODEL_DIR, { idempotent: true }).catch(() => {});
    },

    async cleanupOrphans(manifest) {
      try {
        const info = await getInfoAsync(MODEL_DIR);
        if (!info.exists) return;
        const keep = new Set(manifest?.files.map((f) => f.fileName) ?? []);
        for (const name of await readDirectoryAsync(MODEL_DIR)) {
          // A pending resume still owns its `.part` file.
          if (name.endsWith(PART) && interrupted) continue;
          if (!keep.has(name)) await deleteAsync(MODEL_DIR + name, { idempotent: true });
        }
      } catch {
        // best effort
      }
    },

    async load(manifest) {
      const spec = RECITATION_MODELS[manifest.engine];
      const json: Record<string, unknown> = {};
      let modelPath: string | undefined;
      for (const file of spec.files) {
        const uri = MODEL_DIR + file.fileName;
        if (file.kind === "model") {
          const info = await getInfoAsync(uri);
          if (!info.exists) throw new PracticeError("model-missing");
          modelPath = stripScheme(uri);
        } else if (file.kind === "json") {
          try {
            json[file.fileName] = JSON.parse(await readAsStringAsync(uri));
          } catch (error) {
            throw new PracticeError("model-missing", (error as Error)?.message);
          }
        }
      }
      return { modelPath, json };
    },
  };
}

/** Wipe helper for `wipeLocalDeviceData` (no store instance needed). */
export async function deleteRecitationModelFiles(): Promise<void> {
  interrupted = null;
  await deleteAsync(MODEL_DIR, { idempotent: true }).catch(() => {});
}

export async function recitationModelBytesOnDisk(): Promise<number> {
  return createRecitationModelStore().sizeOnDisk();
}
