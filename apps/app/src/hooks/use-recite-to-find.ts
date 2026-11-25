import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { AppState } from "react-native";
import { type SharedValue, useSharedValue } from "react-native-reanimated";

import { isTV } from "@/lib/platform/is-tv";
import { enterRecordMode, restorePlaybackMode } from "@/lib/quran-companion/audio/audio-mode";
import { useRecitationCapture } from "@/lib/quran-companion/audio/capture";
import type { MicPermission, RecitationCapture } from "@/lib/quran-companion/audio/types";
import type { RecitationEngine } from "@/lib/quran-companion/engine/types";
import { reportPracticeError, toPracticeErrorCode } from "@/lib/quran-companion/error-codes";
import type { ListenerState } from "@/lib/quran-companion/model/download-job";
import { isListenerUsable } from "@/lib/quran-companion/model/download-job";
import type { LoadedModelAssets } from "@/lib/quran-companion/model/types";
import type { CompanionEvent, EngineId, PracticeErrorCode } from "@/lib/quran-companion/types";
import { isReciteToFindAvailable } from "@/lib/recite-to-find/availability";
import {
  createReciteState,
  hasConfirmedMatch,
  type ReciteState,
  reciteReducer,
} from "@/lib/recite-to-find/reducer";
import { claimMicrophone, releaseMicrophone } from "@/lib/speech/mic-owner";
import {
  quranCompanionPrefsStore,
  useCompanionPrefs,
  useCompanionPrefsReady,
} from "@/stores/quran-companion-prefs-store";
import {
  loadInstalledModel,
  useEnsureListenerLoaded,
  useListenerState,
} from "@/stores/quran-listener-store";

/**
 * Recite to find (D68): listen to a recitation with the on-device Qur'an
 * listener and say which ayah it is. Audio stays on the device — capture feeds
 * the engine in memory and nothing is recorded or uploaded.
 *
 * Lifecycle: the engine loads while the Recite panel is mounted and the
 * listener is installed; a take claims the mic (`mic-owner`), enters the record
 * audio mode, and streams 16 kHz PCM into the engine. The take ends on a tap, a
 * pause after a confirmed match, a hard time cap, backgrounding, another mic
 * owner, or unmount — and every path releases the mic, the stream and the
 * audio mode. Unmount also disposes the engine.
 */

/** Ends a take this long after the last new evidence once an ayah is confirmed. */
export const RECITE_SETTLE_MS = 3500;
/** Hard cap for one take (battery, and a forgotten open mic). */
export const RECITE_MAX_LISTEN_MS = 30_000;

export type ReciteEngineFactory = (
  engine: EngineId,
  assets: LoadedModelAssets,
) => Promise<RecitationEngine>;

/** Lazy: the adapter (and `@tilawa/core`) load only when Recite is opened. */
const defaultCreateEngine: ReciteEngineFactory = async (engineId, assets) => {
  const [{ createTilawaEngine }, { enginePlatform }] = await Promise.all([
    import("@/lib/quran-companion/engine/tilawa-adapter"),
    import("@/lib/quran-companion/engine/tilawa"),
  ]);
  return createTilawaEngine(engineId, assets, enginePlatform, { freeRecitation: true });
};

export type ReciteEngineStatus = "idle" | "loading" | "ready" | "failed";
export type ReciteMicState = "idle" | "starting" | "listening" | "settling";

export type UseReciteToFindResult = {
  state: ReciteState;
  engineStatus: ReciteEngineStatus;
  engineError: PracticeErrorCode | null;
  mic: ReciteMicState;
  micPermission: MicPermission | null;
  /** 0..1 smoothed input loudness while listening (drives the pulse). */
  level: SharedValue<number>;
  /** The listener is installed and this device can capture audio. */
  canListen: boolean;
  toggle: () => Promise<void>;
  stop: () => Promise<void>;
  /** Clear the results (back to idle). */
  reset: () => void;
};

/** Root-mean-square of a chunk mapped to a 0..1 meter value. */
export function chunkLevel(pcm: Float32Array): number {
  if (!pcm.length) return 0;
  let sum = 0;
  for (let i = 0; i < pcm.length; i++) sum += pcm[i] * pcm[i];
  const rms = Math.sqrt(sum / pcm.length);
  return Math.min(1, Math.sqrt(rms) * 2);
}

/**
 * Loads practice prefs and the listener state for recite entry points, and says
 * whether to offer the Recite mode on this device.
 */
export function useReciteToFindAvailability(): {
  available: boolean;
  listener: ListenerState;
  engineChoice: EngineId;
  wifiOnlyDownload: boolean;
} {
  const platformOk = isReciteToFindAvailable();
  // Practice prefs are lazy (§19): only load them where Recite can be offered.
  useEffect(() => {
    if (platformOk && !quranCompanionPrefsStore.getState().isReady) {
      void quranCompanionPrefsStore.getState().load();
    }
  }, [platformOk]);
  const prefsReady = useCompanionPrefsReady();
  const prefs = useCompanionPrefs();
  useEnsureListenerLoaded(prefs.engineChoice, prefsReady && platformOk);
  const listener = useListenerState();
  return {
    available: isReciteToFindAvailable(listener),
    listener,
    engineChoice: prefs.engineChoice,
    wifiOnlyDownload: prefs.wifiOnlyDownload,
  };
}

export function useReciteToFind(
  options: { enabled?: boolean; createEngine?: ReciteEngineFactory } = {},
): UseReciteToFindResult {
  const { enabled = true, createEngine = defaultCreateEngine } = options;
  const listener = useListenerState();
  const usable = enabled && !isTV() && isListenerUsable(listener);
  const capture = useRecitationCapture();
  const captureRef = useRef<RecitationCapture>(capture);
  captureRef.current = capture;
  const createEngineRef = useRef(createEngine);
  createEngineRef.current = createEngine;

  const [state, dispatch] = useReducer(reciteReducer, undefined, createReciteState);
  const stateRef = useRef(state);
  stateRef.current = state;
  const level = useSharedValue(0);

  // ── Engine ────────────────────────────────────────────────────────────────
  const engineRef = useRef<RecitationEngine | null>(null);
  const [engineStatus, setEngineStatus] = useState<ReciteEngineStatus>("idle");
  const [engineError, setEngineError] = useState<PracticeErrorCode | null>(null);

  useEffect(() => {
    if (!usable || !captureRef.current.available) {
      setEngineStatus("idle");
      return;
    }
    let cancelled = false;
    let loaded: RecitationEngine | null = null;
    setEngineStatus("loading");
    setEngineError(null);
    void (async () => {
      try {
        const { manifest, assets } = await loadInstalledModel();
        const engine = await createEngineRef.current(manifest.engine, assets);
        if (cancelled) {
          await engine.dispose().catch(() => {});
          return;
        }
        loaded = engine;
        engineRef.current = engine;
        setEngineStatus("ready");
      } catch (error) {
        if (cancelled) return;
        const code = toPracticeErrorCode(error, "engine-init-failed");
        reportPracticeError(error, code, "recite-init");
        setEngineError(code);
        setEngineStatus("failed");
      }
    })();
    return () => {
      cancelled = true;
      if (loaded && engineRef.current === loaded) engineRef.current = null;
      void loaded?.dispose().catch(() => {});
    };
  }, [usable]);

  // ── Mic + take ────────────────────────────────────────────────────────────
  const [mic, setMicState] = useState<ReciteMicState>("idle");
  const micRef = useRef<ReciteMicState>("idle");
  const setMic = useCallback((next: ReciteMicState) => {
    micRef.current = next;
    setMicState(next);
  }, []);
  const isStarting = useCallback(() => micRef.current === "starting", []);
  const [micPermission, setMicPermission] = useState<MicPermission | null>(null);

  useEffect(() => {
    if (!enabled) return;
    void captureRef.current
      .getPermission()
      .then(setMicPermission)
      .catch(() => {});
  }, [enabled]);

  // Preemption by another mic owner: stable identity for the whole mount.
  const stopRef = useRef<(reason: StopReason) => Promise<void>>(async () => {});
  const onMicPreempted = useCallback(() => stopRef.current("interrupted"), []);

  const stopTake = useCallback(
    async (_reason: StopReason) => {
      const current = micRef.current;
      if (current !== "listening" && current !== "starting") return;
      setMic("settling");
      releaseMicrophone(onMicPreempted);
      try {
        await captureRef.current.stop();
      } catch {
        // already stopped
      }
      level.value = 0;
      await restorePlaybackMode();
      const engine = engineRef.current;
      if (engine) {
        try {
          // Flushes the tail: the last matches and the final sequence arrive here.
          await engine.stop();
        } catch (error) {
          reportPracticeError(error, toPracticeErrorCode(error, "engine-runtime"), "recite-stop");
        }
      }
      dispatch({ type: "finish" });
      setMic("idle");
    },
    [level, onMicPreempted, setMic],
  );
  stopRef.current = stopTake;

  // Engine events → reducer. A failure also closes the mic.
  useEffect(() => {
    const engine = engineStatus === "ready" ? engineRef.current : null;
    if (!engine) return;
    return engine.subscribe((event: CompanionEvent) => {
      if (event.type === "failed") {
        releaseMicrophone(onMicPreempted);
        void captureRef.current.stop().catch(() => {});
        void restorePlaybackMode();
        level.value = 0;
        setMic("idle");
      }
      dispatch({ type: "event", event });
    });
  }, [engineStatus, level, onMicPreempted, setMic]);

  const start = useCallback(async () => {
    const engine = engineRef.current;
    const cap = captureRef.current;
    if (!engine || engineStatus !== "ready" || !cap.available) return;
    let permission = await cap.getPermission().catch(() => "undetermined" as const);
    if (permission !== "granted") permission = await cap.requestPermission();
    setMicPermission(permission);
    if (permission !== "granted") {
      dispatch({ type: "fail", code: "mic-denied" });
      return;
    }
    setMic("starting");
    dispatch({ type: "start" });
    await claimMicrophone("recite-to-find", onMicPreempted);
    await enterRecordMode();
    try {
      // Free recitation ignores the passage; the adapter runs a whole-Qur'an lookup.
      await engine.start({ surah: 1, ayahStart: 1, ayahEnd: 1 }, "tracking");
      await cap.start(
        (pcm) => {
          engine.feed(pcm);
          level.value = level.value * 0.6 + chunkLevel(pcm) * 0.4;
        },
        (status) => {
          if (status.interrupted) void stopRef.current("interrupted");
        },
      );
      if (!isStarting()) {
        // Stopped while starting (background, a call, another listener).
        releaseMicrophone(onMicPreempted);
        await cap.stop().catch(() => {});
        return;
      }
      setMic("listening");
    } catch (error) {
      const code = toPracticeErrorCode(error, "capture-failed");
      if (code === "mic-denied") setMicPermission("denied");
      reportPracticeError(error, code, "recite-start");
      releaseMicrophone(onMicPreempted);
      await cap.stop().catch(() => {});
      await restorePlaybackMode();
      level.value = 0;
      dispatch({ type: "fail", code });
      setMic("idle");
    }
  }, [engineStatus, isStarting, level, onMicPreempted, setMic]);

  const toggle = useCallback(async () => {
    if (micRef.current === "listening" || micRef.current === "starting") {
      await stopTake("user");
      return;
    }
    if (micRef.current === "settling") return;
    await start();
  }, [start, stopTake]);

  const stop = useCallback(() => stopTake("user"), [stopTake]);
  const reset = useCallback(() => {
    if (micRef.current !== "idle") return;
    dispatch({ type: "reset" });
  }, []);

  // A pause after a confirmed match ends the take (new evidence resets the wait).
  const confirmed = hasConfirmedMatch(state);
  // biome-ignore lint/correctness/useExhaustiveDependencies: new candidates restart the wait on purpose
  useEffect(() => {
    if (mic !== "listening" || !confirmed) return;
    const timer = setTimeout(() => void stopRef.current("auto"), RECITE_SETTLE_MS);
    return () => clearTimeout(timer);
  }, [confirmed, mic, state.candidates]);

  // Hard cap per take.
  useEffect(() => {
    if (mic !== "listening") return;
    const timer = setTimeout(() => void stopRef.current("auto"), RECITE_MAX_LISTEN_MS);
    return () => clearTimeout(timer);
  }, [mic]);

  // Background or a call: stop and keep what was found; never auto-restart.
  useEffect(() => {
    const sub = AppState.addEventListener("change", (next) => {
      if (next !== "active") void stopRef.current("background");
    });
    return () => sub.remove();
  }, []);

  // Leaving the screen (or switching away from Recite): release the mic + stream.
  useEffect(() => {
    return () => {
      const wasActive = micRef.current !== "idle";
      micRef.current = "idle";
      releaseMicrophone(onMicPreempted);
      if (!wasActive) return;
      void (async () => {
        for (const step of [() => captureRef.current.stop(), restorePlaybackMode]) {
          try {
            await step();
          } catch {
            // the screen is gone; nothing left to report to
          }
        }
      })();
    };
  }, [onMicPreempted]);

  return {
    state,
    engineStatus,
    engineError,
    mic,
    micPermission,
    level,
    canListen: usable && capture.available,
    toggle,
    stop,
    reset,
  };
}

/** Why a take ended (kept for readability at call sites; all end the same way). */
type StopReason = "user" | "auto" | "background" | "interrupted";
