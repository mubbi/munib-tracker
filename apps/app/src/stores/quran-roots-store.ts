import { getNetworkStateAsync, NetworkStateType } from "expo-network";
import { useEffect } from "react";

import {
  type DownloadProgress,
  fetchMorphology,
  readCachedMorphology,
} from "@/api/quran-morphology";
import { DB_KEYS } from "@/db/keys";
import { readJSON, removeKeyTree, storageShardKey, writeJSON } from "@/db/store";
import {
  buildRootIndex,
  isRootIndexCurrent,
  type RootIndex,
} from "@/lib/quran-morphology/build-index";
import { deleteStoredMorphology, storedMorphologyBytes } from "@/lib/quran-morphology/raw-store";
import {
  MorphologyError,
  type MorphologyErrorCode,
  QAC_MORPHOLOGY,
  toMorphologyErrorCode,
} from "@/lib/quran-morphology/source";
import { runWhenIdle } from "@/lib/run-when-idle";

import { createStore, useStore } from "./create-store";

/**
 * NF-3.22 root data: the corpus file (raw-store) and the on-device root index
 * (`DB_KEYS.quranRootIndex`, cache class). State machine:
 *
 *   idle → checking → ready                      (index cached for this hash)
 *                   → building → ready            (file cached, index missing/stale)
 *                   → needs-download → downloading → verifying → building → ready
 *                                                  ↘ failed (typed code; retry)
 *
 * The job lives here so leaving the screen never cancels it.
 */
export type RootDataStatus =
  | "idle"
  | "checking"
  | "needs-download"
  | "downloading"
  | "verifying"
  | "building"
  | "ready"
  | "failed";

export type DownloadRequest = "started" | "needs-cellular-confirm" | "busy";

type IndexMeta = Pick<RootIndex, "v" | "sourceHash" | "counts" | "align" | "stats">;

interface RootsState {
  status: RootDataStatus;
  /** 0–1 for the current phase (download bytes or build lines). */
  progress: number;
  error: MorphologyErrorCode | null;
  index: RootIndex | null;
  ensure: () => Promise<void>;
  download: (options: { wifiOnly: boolean; allowCellular?: boolean }) => Promise<DownloadRequest>;
  cancel: () => void;
  /** Offline data → Clear: drop the file and the index (re-downloads on next use). */
  clear: () => Promise<void>;
}

const metaKey = storageShardKey(DB_KEYS.quranRootIndex, "meta");
const rootsKey = storageShardKey(DB_KEYS.quranRootIndex, "roots");
const formsKey = storageShardKey(DB_KEYS.quranRootIndex, "forms");

/** Yield to the UI between work chunks (idle callback on every platform). */
export function yieldToUi(): Promise<void> {
  return new Promise((resolve) => {
    runWhenIdle(resolve);
  });
}

/** Persisted index for the pinned file, or null (missing, other hash, other version). */
export async function readPersistedRootIndex(): Promise<RootIndex | null> {
  const meta = await readJSON<IndexMeta | null>(metaKey, null);
  if (!meta || !isRootIndexCurrent(meta as RootIndex, QAC_MORPHOLOGY.sha256)) return null;
  const roots = await readJSON<RootIndex["roots"] | null>(rootsKey, null);
  const forms = await readJSON<RootIndex["forms"] | null>(formsKey, null);
  if (!roots || !forms) return null;
  return { ...meta, roots, forms };
}

export async function writePersistedRootIndex(index: RootIndex): Promise<void> {
  const { roots, forms, ...meta } = index;
  await writeJSON(rootsKey, roots);
  await writeJSON(formsKey, forms);
  // Meta last: a half-written index never looks current.
  await writeJSON(metaKey, meta);
}

async function loadSurahArabic(surah: number): Promise<Record<string, string>> {
  const { getSurahAyahs } = await import("@/lib/quran");
  const out: Record<string, string> = {};
  for (const ayah of getSurahAyahs(surah)) out[String(ayah.ayah)] = ayah.arabic;
  return out;
}

/** Wi-Fi or Ethernet. Cellular, unknown, or a failed read → false. */
async function isUnmetered(): Promise<boolean> {
  try {
    const state = await getNetworkStateAsync();
    return state.type === NetworkStateType.WIFI || state.type === NetworkStateType.ETHERNET;
  } catch {
    return false;
  }
}

let cancelSignal: { cancelled: boolean; onCancel?: () => void } | null = null;
let ensureInflight: Promise<void> | null = null;

export const quranRootsStore = createStore<RootsState>((set, get) => {
  const build = async (text: string) => {
    set({ status: "building", progress: 0, error: null });
    const index = await buildRootIndex(text, {
      sourceHash: QAC_MORPHOLOGY.sha256,
      loadSurahArabic,
      yieldToUi,
      onProgress: (p) => set({ progress: p.total ? p.done / p.total : 0 }),
    });
    try {
      await writePersistedRootIndex(index);
    } catch {
      // Storage full: the index still works for this session and rebuilds next time.
    }
    set({ status: "ready", progress: 1, index, error: null });
  };

  return {
    status: "idle",
    progress: 0,
    error: null,
    index: null,

    ensure() {
      const status = get().status;
      // A failed download keeps its typed error until the person taps Retry.
      if (
        status === "ready" ||
        status === "downloading" ||
        status === "verifying" ||
        status === "failed"
      ) {
        return Promise.resolve();
      }
      if (status === "building" && ensureInflight) return ensureInflight;
      if (ensureInflight) return ensureInflight;
      ensureInflight = (async () => {
        set({ status: "checking", error: null });
        try {
          const persisted = await readPersistedRootIndex();
          if (persisted) {
            set({ status: "ready", index: persisted, progress: 1 });
            return;
          }
          const text = await readCachedMorphology(yieldToUi);
          if (text == null) {
            set({ status: "needs-download", progress: 0 });
            return;
          }
          await build(text);
        } catch (error) {
          const code = toMorphologyErrorCode(error);
          // A bad cached copy was deleted: offer the download again with the reason.
          set({ status: code === "morphology-hash" ? "failed" : "needs-download", error: code });
        } finally {
          ensureInflight = null;
        }
      })();
      return ensureInflight;
    },

    async download({ wifiOnly, allowCellular }) {
      const status = get().status;
      if (status === "downloading" || status === "verifying" || status === "building") {
        return "busy";
      }
      if (wifiOnly && !allowCellular && !(await isUnmetered())) return "needs-cellular-confirm";
      const signal: { cancelled: boolean; onCancel?: () => void } = { cancelled: false };
      cancelSignal = signal;
      set({ status: "downloading", progress: 0, error: null });
      void (async () => {
        try {
          const text = await fetchMorphology({
            yieldToUi,
            signal,
            onProgress: (p: DownloadProgress) =>
              set({ progress: p.bytesTotal ? Math.min(1, p.bytesDone / p.bytesTotal) : 0 }),
            onVerifying: () => set({ status: "verifying" }),
          });
          if (signal.cancelled) throw new MorphologyError("download-cancelled");
          await build(text);
        } catch (error) {
          const code = toMorphologyErrorCode(error);
          if (code === "download-cancelled" || signal.cancelled) {
            set({ status: "needs-download", progress: 0, error: null });
          } else {
            set({ status: "failed", error: code });
          }
        } finally {
          if (cancelSignal === signal) cancelSignal = null;
        }
      })();
      return "started";
    },

    cancel() {
      if (!cancelSignal) return;
      cancelSignal.cancelled = true;
      cancelSignal.onCancel?.();
    },

    async clear() {
      get().cancel();
      await deleteStoredMorphology();
      await removeKeyTree(DB_KEYS.quranRootIndex);
      set({ status: "needs-download", index: null, progress: 0, error: null });
    },
  };
});

/** Load (or build from the cached file) the root index on mount; never downloads. */
export function useEnsureRootIndex(enabled = true): void {
  useEffect(() => {
    if (enabled) void quranRootsStore.getState().ensure();
  }, [enabled]);
}

export function useRootIndex(): RootIndex | null {
  return useStore(quranRootsStore, (s) => s.index);
}

export function useRootDataStatus(): {
  status: RootDataStatus;
  progress: number;
  error: MorphologyErrorCode | null;
} {
  const status = useStore(quranRootsStore, (s) => s.status);
  const progress = useStore(quranRootsStore, (s) => s.progress);
  const error = useStore(quranRootsStore, (s) => s.error);
  return { status, progress, error };
}

/** Bytes on the device: the raw file (the index is counted by its DB_KEYS tree). */
export function rootDataFileBytes(): Promise<number> {
  return storedMorphologyBytes();
}

/** Forget the in-memory index after a data reset (reload-all-stores). */
export function resetQuranRootsStore(): void {
  quranRootsStore.getState().cancel();
  quranRootsStore.setState({ status: "idle", index: null, progress: 0, error: null });
}
