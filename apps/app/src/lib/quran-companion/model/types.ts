import type { EngineId } from "../types";

/** Stored at `DB_KEYS.quranRecitationModel` (deviceLocal: not backed up, not synced). */
export type RecitationModelManifest = {
  engine: EngineId;
  /** Pinned @tilawa/core + asset revision (`RECITATION_MODELS[engine].version`). */
  version: string;
  files: { fileName: string; bytes: number; sha256: string; md5: string }[];
  downloadedAt: string;
};

export type DownloadProgress = { bytesDone: number; bytesTotal: number };

/** Loaded engine inputs. Native gives a model *path*; web gives the bytes. */
export type LoadedModelAssets = {
  /** Native: absolute file path (no `file://`). */
  modelPath?: string;
  /** Web: model bytes. */
  modelBytes?: ArrayBuffer;
  /** Parsed JSON files by file name (corpus, vocab, …). */
  json: Record<string, unknown>;
};

/** One interface, two implementations (`model-store.native.ts`, `model-store.web.ts`). */
export interface RecitationModelStore {
  /** Bytes on disk for the installed engine files (0 when none). */
  sizeOnDisk(): Promise<number>;
  /** True when every file in the manifest is present. */
  isPresent(manifest: RecitationModelManifest): Promise<boolean>;
  /** Download + verify every file of `engine`. Rejects with a `PracticeError`. */
  download(
    engine: EngineId,
    onProgress: (progress: DownloadProgress) => void,
    signal: { cancelled: boolean; onCancel?: () => void },
  ): Promise<RecitationModelManifest>;
  /** One automatic resume after an interruption (native only; web restarts). */
  canResume(): boolean;
  /** Remove every listener file. */
  deleteAll(): Promise<void>;
  /** Remove partial files and files the manifest does not reference. */
  cleanupOrphans(manifest: RecitationModelManifest | null): Promise<void>;
  /** Free space check; returns null when unknown. */
  freeBytes(): Promise<number | null>;
  load(manifest: RecitationModelManifest): Promise<LoadedModelAssets>;
}
