import { File, Paths } from "expo-file-system";

import { RECITATION_MODELS } from "@/constants/recitation-models";
import {
  deletePath,
  directoryExists,
  documentDirectoryUri,
  ensureDirectory,
  fileInfo,
  httpStatusFromDownloadError,
  listDirectory,
  moveFile,
} from "@/lib/native-file-store";

import { PracticeError } from "../error-codes";
import type { EngineId } from "../types";
import type { RecitationModelStore } from "./types";

/**
 * Native listener files (§7 Model files): `<documents>/recitation-models/` via
 * `native-file-store.ts` (the same helpers the audio cache uses). Downloads go to
 * `<name>.part` and are renamed only after size + MD5 pass — MD5 is computed
 * natively by `File.digest("MD5")` (lowercase hex, the same format the legacy
 * `getInfoAsync(uri, { md5: true })` returned), so a 66 MB file is never read
 * into JS. Not inside `munib-audio/`, so clearing audio never touches it.
 */

export const MODEL_DIR = `${documentDirectoryUri() ?? ""}recitation-models/`;
const PART = ".part";

function stripScheme(uri: string): string {
  return uri.replace(/^file:\/\//, "");
}

function ensureDir(): void {
  ensureDirectory(MODEL_DIR);
}

function deleteQuietly(uri: string): void {
  try {
    deletePath(uri);
  } catch {
    // best effort
  }
}

/** Size + MD5 check against the pinned manifest values (lowercase hex). */
async function matchesSpec(uri: string, spec: { bytes: number; md5: string }): Promise<boolean> {
  const info = fileInfo(uri);
  if (!info.exists || info.size !== spec.bytes) return false;
  const md5 = await new File(uri).digest("MD5");
  return md5.toLowerCase() === spec.md5.toLowerCase();
}

/**
 * Marker for the one automatic resume after an interruption (§7). The legacy
 * `DownloadResumable.downloadAsync()` retry never had pause data (the store
 * never pauses), so it re-requested the file into the same `.part`; a fresh
 * download task does exactly that.
 */
let interrupted: { engine: EngineId } | null = null;

export function createRecitationModelStore(): RecitationModelStore {
  return {
    async sizeOnDisk() {
      try {
        if (!directoryExists(MODEL_DIR)) return 0;
        let total = 0;
        for (const entry of listDirectory(MODEL_DIR)) {
          if (!entry.isDirectory) total += entry.size ?? 0;
        }
        return total;
      } catch {
        return 0;
      }
    },

    async isPresent(manifest) {
      for (const f of manifest.files) {
        const info = fileInfo(MODEL_DIR + f.fileName);
        if (!info.exists || (info.size ?? -1) !== f.bytes) return false;
      }
      return true;
    },

    async freeBytes() {
      try {
        // Space the app can actually use (excludes system-reserved blocks).
        const free = Paths.availableDiskSpace;
        return typeof free === "number" && Number.isFinite(free) ? free : null;
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
      ensureDir();

      let doneBefore = 0;
      for (const file of spec.files) {
        if (signal.cancelled) throw new PracticeError("download-cancelled");
        const target = MODEL_DIR + file.fileName;
        if (await matchesSpec(target, file)) {
          doneBefore += file.bytes;
          onProgress({ bytesDone: doneBefore, bytesTotal: total });
          continue;
        }
        const partUri = target + PART;
        const task = File.createDownloadTask(file.url, new File(partUri), {
          onProgress: (p) => {
            // SDK 58 native delivers the Int64 counter as a BigInt despite the
            // `number` typing; Math.min(BigInt, number) throws a TypeError.
            const written = Number(p.bytesWritten);
            onProgress({
              bytesDone: doneBefore + Math.min(written, file.bytes),
              bytesTotal: total,
            });
          },
        });
        interrupted = null;
        signal.onCancel = () => {
          try {
            task.cancel();
          } catch {
            // Already settled.
          }
        };
        let result: { status: number } | undefined;
        try {
          // Resolves null only when paused, which this store never does.
          result = (await task.downloadAsync()) ? { status: 200 } : undefined;
        } catch (error) {
          if (signal.cancelled) {
            deleteQuietly(partUri);
            throw new PracticeError("download-cancelled");
          }
          // The class-based API rejects on a non-2xx response instead of
          // resolving with its status; keep the legacy "HTTP <status>" failure.
          const status = httpStatusFromDownloadError(error);
          if (status == null) {
            // Keep the marker for one automatic resume on the next foreground.
            interrupted = { engine };
            const message = (error as Error)?.message ?? "";
            throw new PracticeError(
              /network|connection|offline|timed out|host/i.test(message)
                ? "no-connection"
                : "download-failed",
              message,
            );
          }
          result = { status };
        } finally {
          task.release();
        }
        if (signal.cancelled) {
          deleteQuietly(partUri);
          throw new PracticeError("download-cancelled");
        }
        if (!result || result.status < 200 || result.status >= 300) {
          deleteQuietly(partUri);
          throw new PracticeError("download-failed", `HTTP ${result?.status ?? "?"}`);
        }
        if (!(await matchesSpec(partUri, file))) {
          deleteQuietly(partUri);
          throw new PracticeError("checksum-mismatch");
        }
        deleteQuietly(target);
        await moveFile(partUri, target);
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
      deleteQuietly(MODEL_DIR);
    },

    async cleanupOrphans(manifest) {
      try {
        if (!directoryExists(MODEL_DIR)) return;
        const keep = new Set(manifest?.files.map((f) => f.fileName) ?? []);
        for (const { name } of listDirectory(MODEL_DIR)) {
          // A pending resume still owns its `.part` file.
          if (name.endsWith(PART) && interrupted) continue;
          if (!keep.has(name)) deletePath(MODEL_DIR + name);
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
          if (!fileInfo(uri).exists) throw new PracticeError("model-missing");
          modelPath = stripScheme(uri);
        } else if (file.kind === "json") {
          try {
            json[file.fileName] = JSON.parse(await new File(uri).text());
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
  deleteQuietly(MODEL_DIR);
}

export async function recitationModelBytesOnDisk(): Promise<number> {
  return createRecitationModelStore().sizeOnDisk();
}
