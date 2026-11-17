import { getNetworkStateAsync, NetworkStateType } from "expo-network";
import { useEffect } from "react";
import { AppState } from "react-native";

import { engineDownloadBytes } from "@/constants/recitation-models";
import { DB_KEYS } from "@/db/keys";
import { readJSON, removeKey, writeJSON } from "@/db/store";
import { isPracticeAvailable } from "@/lib/quran-companion/availability";
import { isEngineRuntimeSupported } from "@/lib/quran-companion/engine/tilawa";
import {
  PracticeError,
  reportPracticeError,
  toPracticeErrorCode,
} from "@/lib/quran-companion/error-codes";
import {
  initialListenerState,
  type ListenerAction,
  type ListenerState,
  listenerReducer,
} from "@/lib/quran-companion/model/download-job";
import { createRecitationModelStore } from "@/lib/quran-companion/model/model-store";
import type { RecitationModelManifest } from "@/lib/quran-companion/model/types";
import type { EngineId } from "@/lib/quran-companion/types";

import { createStore, useStore } from "./create-store";

/**
 * The on-device listener (§7 Model files, §9.5 Card 1). The download job lives
 * here, so leaving the hub or settings never cancels it; both screens read the
 * same progress. The manifest is `deviceLocal` (not backed up, not synced) — a
 * second device downloads its own copy.
 */

const modelStore = createRecitationModelStore();

export type DownloadRequest = "started" | "needs-cellular-confirm" | "busy";

interface ListenerStoreState {
  listener: ListenerState;
  isReady: boolean;
  /** Bytes on disk (Offline data's read-only row). */
  bytesOnDisk: number;
  load: (engine: EngineId) => Promise<void>;
  download: (
    engine: EngineId,
    options: { wifiOnly: boolean; allowCellular?: boolean },
  ) => Promise<DownloadRequest>;
  cancel: () => void;
  remove: () => Promise<void>;
  /** One automatic resume after an interruption, on the next foreground (§7). */
  resumeIfInterrupted: () => Promise<void>;
}

let cancelSignal: { cancelled: boolean; onCancel?: () => void } | null = null;
let lastEngine: EngineId = "tilawa-zipformer";

async function readManifest(): Promise<RecitationModelManifest | null> {
  return readJSON<RecitationModelManifest | null>(DB_KEYS.quranRecitationModel, null);
}

/** Wi-Fi or Ethernet. Cellular, unknown, or a failed read → false (§7). */
async function isUnmetered(): Promise<boolean> {
  try {
    const state = await getNetworkStateAsync();
    return state.type === NetworkStateType.WIFI || state.type === NetworkStateType.ETHERNET;
  } catch {
    return false;
  }
}

export const quranListenerStore = createStore<ListenerStoreState>((set, get) => {
  const dispatch = (action: ListenerAction) => {
    set({ listener: listenerReducer(get().listener, action) });
  };

  return {
    listener: initialListenerState("tilawa-zipformer"),
    isReady: false,
    bytesOnDisk: 0,

    async load(engine) {
      lastEngine = engine;
      armForegroundResume();
      if (!isPracticeAvailable() || !isEngineRuntimeSupported()) {
        dispatch({ type: "unsupported" });
        set({ isReady: true });
        return;
      }
      // Never interrupt a running job with a reload.
      if (get().listener.status === "downloading" || get().listener.status === "verifying") {
        set({ isReady: true });
        return;
      }
      const manifest = await readManifest();
      const present = manifest ? await modelStore.isPresent(manifest) : false;
      if (manifest && !present) await removeKey(DB_KEYS.quranRecitationModel);
      await modelStore.cleanupOrphans(present ? manifest : null);
      dispatch({ type: "loaded", manifest: present ? manifest : null, present, engine });
      set({ isReady: true, bytesOnDisk: await modelStore.sizeOnDisk() });
    },

    async download(engine, { wifiOnly, allowCellular }) {
      const status = get().listener.status;
      if (status === "downloading" || status === "verifying") return "busy";
      if (wifiOnly && !allowCellular && !(await isUnmetered())) return "needs-cellular-confirm";
      lastEngine = engine;
      const signal: { cancelled: boolean; onCancel?: () => void } = { cancelled: false };
      cancelSignal = signal;
      dispatch({ type: "start", engine, bytesTotal: engineDownloadBytes(engine) });
      void (async () => {
        try {
          const previous = get().listener.manifest;
          // One model file at a time: switching engines removes the other first.
          if (previous && previous.engine !== engine) {
            await modelStore.deleteAll();
            await removeKey(DB_KEYS.quranRecitationModel);
          }
          const manifest = await modelStore.download(
            engine,
            (p) => dispatch({ type: "progress", bytesDone: p.bytesDone, bytesTotal: p.bytesTotal }),
            signal,
          );
          dispatch({ type: "verifying" });
          await writeJSON(DB_KEYS.quranRecitationModel, manifest);
          await modelStore.cleanupOrphans(manifest);
          dispatch({ type: "done", manifest });
          set({ bytesOnDisk: await modelStore.sizeOnDisk() });
        } catch (error) {
          const code = toPracticeErrorCode(error, "download-failed");
          if (code === "download-cancelled" || signal.cancelled) {
            dispatch({ type: "cancelled" });
          } else {
            reportPracticeError(error, code, "download");
            dispatch({ type: "failed", code });
          }
          set({ bytesOnDisk: await modelStore.sizeOnDisk() });
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

    async remove() {
      get().cancel();
      await modelStore.deleteAll();
      await removeKey(DB_KEYS.quranRecitationModel);
      dispatch({ type: "deleted" });
      set({ bytesOnDisk: 0 });
    },

    async resumeIfInterrupted() {
      const listener = get().listener;
      if (listener.status !== "failed" || !modelStore.canResume()) return;
      await get().download(lastEngine, { wifiOnly: false, allowCellular: true });
    },
  };
});

let resumeArmed = false;

/**
 * §7: a download the OS suspended is resumed once on the next return to the
 * foreground (native only — `canResume()` is false on web). Armed lazily, the
 * first time a practice surface loads the listener.
 */
function armForegroundResume(): void {
  if (resumeArmed) return;
  resumeArmed = true;
  AppState.addEventListener("change", (next) => {
    if (next === "active") void quranListenerStore.getState().resumeIfInterrupted();
  });
}

/** Load the listener's model files for a session. Throws a `PracticeError`. */
export async function loadInstalledModel() {
  const manifest = quranListenerStore.getState().listener.manifest ?? (await readManifest());
  if (!manifest) throw new PracticeError("model-missing");
  try {
    return { manifest, assets: await modelStore.load(manifest) };
  } catch (error) {
    throw new PracticeError(toPracticeErrorCode(error, "model-missing"), (error as Error)?.message);
  }
}

export function useEnsureListenerLoaded(engine: EngineId, ready: boolean): void {
  useEffect(() => {
    if (!ready) return;
    const state = quranListenerStore.getState();
    if (!state.isReady || state.listener.engine !== engine) void state.load(engine);
  }, [engine, ready]);
}

export function useListenerState(): ListenerState {
  return useStore(quranListenerStore, (s) => s.listener);
}

export function useListenerBytesOnDisk(): number {
  return useStore(quranListenerStore, (s) => s.bytesOnDisk);
}
