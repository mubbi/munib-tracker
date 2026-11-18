import { RECITATION_MODELS } from "@/constants/recitation-models";

import type { EngineId, PracticeErrorCode } from "../types";
import type { RecitationModelManifest } from "./types";

/**
 * Listener state machine (§9.5 Card 1):
 * not-downloaded → downloading → verifying → ready
 *                       ↘ failed ("Needs another try")
 * ready + pinned version changed → update-available (old file keeps working).
 * Pure so Jest covers every transition.
 */
export type ListenerStatus =
  | "unsupported"
  | "not-downloaded"
  | "downloading"
  | "verifying"
  | "ready"
  | "update-available"
  | "failed";

export type ListenerState = {
  status: ListenerStatus;
  engine: EngineId;
  manifest: RecitationModelManifest | null;
  bytesDone: number;
  bytesTotal: number;
  error: PracticeErrorCode | null;
};

export type ListenerAction =
  | { type: "loaded"; manifest: RecitationModelManifest | null; present: boolean; engine: EngineId }
  | { type: "unsupported" }
  | { type: "start"; engine: EngineId; bytesTotal: number }
  | { type: "progress"; bytesDone: number; bytesTotal: number }
  | { type: "verifying" }
  | { type: "done"; manifest: RecitationModelManifest }
  | { type: "failed"; code: PracticeErrorCode }
  | { type: "cancelled" }
  | { type: "deleted" };

export function initialListenerState(engine: EngineId): ListenerState {
  return {
    status: "not-downloaded",
    engine,
    manifest: null,
    bytesDone: 0,
    bytesTotal: 0,
    error: null,
  };
}

/** True when the installed files are older than the pinned constants. */
export function isUpdateAvailable(manifest: RecitationModelManifest | null): boolean {
  if (!manifest) return false;
  return RECITATION_MODELS[manifest.engine]?.version !== manifest.version;
}

export function listenerReducer(state: ListenerState, action: ListenerAction): ListenerState {
  switch (action.type) {
    case "unsupported":
      return { ...state, status: "unsupported" };
    case "loaded": {
      if (!action.manifest || !action.present) {
        // Evicted by the browser or never downloaded: plain "not downloaded", no error.
        return { ...initialListenerState(action.engine), status: "not-downloaded" };
      }
      return {
        ...state,
        engine: action.manifest.engine,
        manifest: action.manifest,
        status: isUpdateAvailable(action.manifest) ? "update-available" : "ready",
        error: null,
        bytesDone: 0,
        bytesTotal: 0,
      };
    }
    case "start":
      return {
        ...state,
        status: "downloading",
        engine: action.engine,
        bytesDone: 0,
        bytesTotal: action.bytesTotal,
        error: null,
      };
    case "progress":
      if (state.status !== "downloading") return state;
      return { ...state, bytesDone: action.bytesDone, bytesTotal: action.bytesTotal };
    case "verifying":
      return { ...state, status: "verifying" };
    case "done":
      return {
        ...state,
        status: "ready",
        manifest: action.manifest,
        engine: action.manifest.engine,
        bytesDone: action.manifest.files.reduce((s, f) => s + f.bytes, 0),
        error: null,
      };
    case "failed":
      // A failed update leaves the old file in place and usable.
      if (state.manifest && action.code !== "checksum-mismatch") {
        return { ...state, status: "update-available", error: action.code };
      }
      return { ...state, status: "failed", error: action.code };
    case "cancelled":
      if (state.manifest) {
        return {
          ...state,
          status: isUpdateAvailable(state.manifest) ? "update-available" : "ready",
        };
      }
      return { ...initialListenerState(state.engine) };
    case "deleted":
      return { ...initialListenerState(state.engine) };
    default:
      return state;
  }
}

/** True when the engine can run right now (an update-available file still works). */
export function isListenerUsable(state: ListenerState): boolean {
  return (
    (state.status === "ready" || state.status === "update-available") && state.manifest != null
  );
}

export function downloadPercent(state: ListenerState): number {
  if (!state.bytesTotal) return 0;
  return Math.max(0, Math.min(100, Math.floor((state.bytesDone / state.bytesTotal) * 100)));
}
