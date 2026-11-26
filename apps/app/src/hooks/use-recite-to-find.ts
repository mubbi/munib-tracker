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
 * pause after a confirmed match, silence once anything was heard, a hard time
 * cap, backgrounding, another mic owner, or unmount — and every path releases
 * the mic, the stream and the audio mode. Unmount also disposes the engine.
 *
 * Takes never overlap: each has an id, so events a slow engine flush sends
 * after its take ended are dropped; a start waits for the previous stop; each
 * teardown step is time-bounded so a stuck flush can't wedge the mic.
 */

/** Ends a take this long after the last new evidence once an ayah is confirmed. */
export const RECITE_SETTLE_MS = 3500;
/** Hard cap for one take (battery, and a forgotten open mic). */
export const RECITE_MAX_LISTEN_MS = 30_000;
/** Once any ayah is a candidate, this much silence (mic level) ends the take. */
export const RECITE_SILENCE_STOP_MS = 2500;
/** Chunk level (see {@link chunkLevel}) at or above which the mic counts as hearing a voice. */
export const RECITE_SILENCE_LEVEL = 0.2;
const RECITE_SILENCE_POLL_MS = 250;
/**
 * Bound for each teardown step (capture stop, audio mode, the engine's tail
 * flush): past it the take is forced idle so the next tap always works.
 */
export const RECITE_STOP_FLUSH_MS = 2000;

/** Resolves `true` when `promise` settled within `ms`, `false` on timeout (never rejects). */
async function settleWithin(promise: Promise<unknown> | null, ms: number): Promise<boolean> {
  if (!promise) return true;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<false>((resolve) => {
    timer = setTimeout(() => resolve(false), ms);
  });
  try {
    return await Promise.race([
      promise.then(
        () => true,
        () => true,
      ),
      timeout,
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

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
  /** 0..1 smoothed input loudness while listening (drives the pulse and level bar). */
  level: SharedValue<number>;
  /** The engine's word list for an ayah (aligns `state.live.matched` onto the text). */
  engineWords: (surah: number, ayah: number) => string[];
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
  const [micPermission, setMicPermission] = useState<MicPermission | null>(null);

  /** Id of the newest take (monotonic per mount). */
  const takeRef = useRef(0);
  /** The take whose engine events are accepted (`null` between takes: tails are dropped). */
  const acceptingTakeRef = useRef<number | null>(null);
  /** In-flight `start()` / `stopTake()` — a stop waits for the start, a start for the stop. */
  const startPromiseRef = useRef<Promise<void> | null>(null);
  const stopPromiseRef = useRef<Promise<void> | null>(null);
  /** A previous take's `engine.stop()` that outlived its flush bound. */
  const engineStopRef = useRef<Promise<void> | null>(null);
  /**
   * Takes whose flush outlived its bound, oldest first. Engine events are
   * ordered, so until such a take's `completed` (or its flush settling) shows
   * up, whatever arrives is that take's tail and is dropped.
   */
  const staleTakesRef = useRef<number[]>([]);
  /** Last time (ms) the mic heard more than silence (drives the silence auto-stop). */
  const lastVoiceAtRef = useRef(0);

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
    (_reason: StopReason): Promise<void> => {
      if (stopPromiseRef.current) return stopPromiseRef.current;
      const current = micRef.current;
      if (current !== "listening" && current !== "starting") return Promise.resolve();
      // Synchronous: a start still awaiting a step sees this and backs out.
      setMic("settling");
      releaseMicrophone(onMicPreempted);
      const run = (async () => {
        // Let a half-done start finish its current step first, so nothing it
        // does (record mode, capture) lands after the teardown below.
        await settleWithin(startPromiseRef.current, RECITE_STOP_FLUSH_MS);
        await settleWithin(
          captureRef.current.stop().catch(() => {}),
          RECITE_STOP_FLUSH_MS,
        );
        level.value = 0;
        await settleWithin(
          restorePlaybackMode().catch(() => {}),
          RECITE_STOP_FLUSH_MS,
        );
        const engine = engineRef.current;
        const take = takeRef.current;
        if (engine) {
          // Flushes the tail: the last matches and the final sequence arrive here.
          // Bounded — a stuck flush must never leave the mic "finishing up".
          const flush = engine.stop().catch((error: unknown) => {
            reportPracticeError(error, toPracticeErrorCode(error, "engine-runtime"), "recite-stop");
          });
          const flushed = await settleWithin(flush, RECITE_STOP_FLUSH_MS);
          if (flushed) {
            engineStopRef.current = null;
          } else {
            engineStopRef.current = flush;
            staleTakesRef.current.push(take);
            void flush.finally(() => {
              if (engineStopRef.current === flush) engineStopRef.current = null;
              staleTakesRef.current = staleTakesRef.current.filter((id) => id !== take);
            });
          }
        }
        // Anything the engine still sends belongs to a finished take.
        acceptingTakeRef.current = null;
        dispatch({ type: "finish" });
        setMic("idle");
      })();
      const tracked = run.finally(() => {
        if (stopPromiseRef.current === tracked) stopPromiseRef.current = null;
      });
      stopPromiseRef.current = tracked;
      return tracked;
    },
    [level, onMicPreempted, setMic],
  );
  stopRef.current = stopTake;

  // Engine events → reducer, tagged with the accepting take (a stale tail drops).
  // A failure also closes the mic.
  useEffect(() => {
    const engine = engineStatus === "ready" ? engineRef.current : null;
    if (!engine) return;
    return engine.subscribe((event: CompanionEvent) => {
      if (event.type === "failed") {
        releaseMicrophone(onMicPreempted);
        void captureRef.current.stop().catch(() => {});
        void restorePlaybackMode();
        level.value = 0;
        acceptingTakeRef.current = null;
        setMic("idle");
        dispatch({ type: "event", event });
        return;
      }
      // A timed-out flush's tail is still arriving: it ends with `completed`.
      if (staleTakesRef.current.length > 0) {
        if (event.type === "completed") staleTakesRef.current = staleTakesRef.current.slice(1);
        return;
      }
      const take = acceptingTakeRef.current;
      if (take == null) return;
      dispatch({ type: "event", event, take });
    });
  }, [engineStatus, level, onMicPreempted, setMic]);

  const start = useCallback((): Promise<void> => {
    if (startPromiseRef.current) return startPromiseRef.current;
    const run = (async () => {
      // Never overlap the previous take's teardown (iOS audio session race).
      if (stopPromiseRef.current) await stopPromiseRef.current;
      await settleWithin(engineStopRef.current, RECITE_STOP_FLUSH_MS);
      const engine = engineRef.current;
      const cap = captureRef.current;
      if (!engine || engineStatus !== "ready" || !cap.available) return;
      if (micRef.current !== "idle") return;
      let permission = await cap.getPermission().catch(() => "undetermined" as const);
      if (permission !== "granted") permission = await cap.requestPermission();
      setMicPermission(permission);
      if (permission !== "granted") {
        dispatch({ type: "fail", code: "mic-denied" });
        return;
      }
      if (micRef.current !== "idle") return;
      const take = takeRef.current + 1;
      takeRef.current = take;
      // Stopped (tap, background, call, unmount) while a step below was awaited.
      const aborted = () => takeRef.current !== take || micRef.current !== "starting";
      setMic("starting");
      dispatch({ type: "start", take });
      acceptingTakeRef.current = take;
      lastVoiceAtRef.current = Date.now();
      await claimMicrophone("recite-to-find", onMicPreempted);
      if (aborted()) return;
      await enterRecordMode();
      if (aborted()) return;
      try {
        // Free recitation ignores the passage; the adapter runs a whole-Qur'an lookup.
        await engine.start({ surah: 1, ayahStart: 1, ayahEnd: 1 }, "tracking");
        if (aborted()) return;
        await cap.start(
          (pcm) => {
            if (acceptingTakeRef.current !== take) return;
            engine.feed(pcm);
            const chunk = chunkLevel(pcm);
            if (chunk >= RECITE_SILENCE_LEVEL) lastVoiceAtRef.current = Date.now();
            level.value = level.value * 0.6 + chunk * 0.4;
          },
          (status) => {
            if (status.interrupted) void stopRef.current("interrupted");
          },
        );
        if (aborted()) return;
        lastVoiceAtRef.current = Date.now();
        setMic("listening");
      } catch (error) {
        // A stop already tears this take down.
        if (aborted()) return;
        const code = toPracticeErrorCode(error, "capture-failed");
        if (code === "mic-denied") setMicPermission("denied");
        reportPracticeError(error, code, "recite-start");
        releaseMicrophone(onMicPreempted);
        acceptingTakeRef.current = null;
        await cap.stop().catch(() => {});
        await restorePlaybackMode();
        level.value = 0;
        dispatch({ type: "fail", code });
        setMic("idle");
      }
    })();
    const tracked = run.finally(() => {
      if (startPromiseRef.current === tracked) startPromiseRef.current = null;
    });
    startPromiseRef.current = tracked;
    return tracked;
  }, [engineStatus, level, onMicPreempted, setMic]);

  const toggle = useCallback(async () => {
    const current = micRef.current;
    if (current === "listening" || current === "starting") {
      await stopTake("user");
      return;
    }
    // While finishing up a tap is never dead: the next take starts right after.
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

  // Silence once something was heard ends the take (measured from the mic level).
  const hasCandidates = state.candidates.length > 0;
  useEffect(() => {
    if (mic !== "listening" || !hasCandidates) return;
    const timer = setInterval(() => {
      if (Date.now() - lastVoiceAtRef.current >= RECITE_SILENCE_STOP_MS) {
        void stopRef.current("auto");
      }
    }, RECITE_SILENCE_POLL_MS);
    return () => clearInterval(timer);
  }, [hasCandidates, mic]);

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
      takeRef.current += 1;
      acceptingTakeRef.current = null;
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

  const engineWords = useCallback((surah: number, ayah: number): string[] => {
    try {
      return engineRef.current?.engineWords(surah, ayah) ?? [];
    } catch {
      return [];
    }
  }, []);

  return {
    state,
    engineStatus,
    engineError,
    mic,
    micPermission,
    level,
    engineWords,
    canListen: usable && capture.available,
    toggle,
    stop,
    reset,
  };
}

/** Why a take ended (kept for readability at call sites; all end the same way). */
type StopReason = "user" | "auto" | "background" | "interrupted";
