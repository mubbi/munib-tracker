import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { AppState, Platform } from "react-native";
import { isTV } from "@/lib/platform/is-tv";
import { useRecitationCapture } from "@/lib/quran-companion/audio/capture";
import type { MicPermission } from "@/lib/quran-companion/audio/types";
import { reportPracticeError, toPracticeErrorCode } from "@/lib/quran-companion/error-codes";
import { FASTCONFORMER_ENGINE } from "@/lib/speech/fastconformer";
import {
  isVoiceTasbeehAvailable,
  isVoiceTasbeehPlatformAvailable,
} from "@/lib/tasbeeh-voice/availability";
import { resolveTasbeehVoicePrefs, thresholdFor } from "@/lib/tasbeeh-voice/gate";
import { usesModel } from "@/lib/tasbeeh-voice/mode";
import { voiceModelStatus } from "@/lib/tasbeeh-voice/model-status";
import type { PhraseKey } from "@/lib/tasbeeh-voice/phrases";
import type { VoicePipeline } from "@/lib/tasbeeh-voice/pipeline";
import {
  INITIAL_VOICE_SESSION,
  isStuck,
  reduceVoiceSession,
  type VoiceSessionEvent,
  type VoiceSessionState,
  type VoiceStopReason,
} from "@/lib/tasbeeh-voice/session";
import { AudioContext } from "@/providers/audio-player-context";
import { usePreferences } from "@/stores/preferences-store";
import { quranListenerStore, useListenerState } from "@/stores/quran-listener-store";
import {
  tasbeehVoiceCalibrationStore,
  useEnsureTasbeehVoiceCalibrationLoaded,
} from "@/stores/tasbeeh-voice-calibration-store";

const KEEP_AWAKE_TAG = "tasbeeh-voice";
const TICK_MS = 1000;

export type VoiceStartResult =
  | "started"
  | "needs-model"
  | "needs-permission"
  | "denied"
  | "unavailable"
  | "error";

export type VoiceTasbeeh = {
  /** This platform can count by voice at all (any catalog phrase). */
  platformAvailable: boolean;
  /** Voice counting is possible for the current phrase. */
  available: boolean;
  phrase: PhraseKey | null;
  session: VoiceSessionState;
  listening: boolean;
  preparing: boolean;
  /** 0–1 input level for the meter (listening only). */
  level: number;
  speaking: boolean;
  /** "Say the phrase clearly, or tap to count". */
  stuck: boolean;
  /** Bumps on every voice count (soft ✓ flash). */
  flashKey: number;
  modelStatus: ReturnType<typeof voiceModelStatus>;
  permission: MicPermission | null;
  /** Ask for the mic (first-use sheet, after the explainer). */
  requestPermission: () => Promise<MicPermission>;
  start: () => Promise<VoiceStartResult>;
  stop: (reason?: VoiceStopReason) => void;
  /** The shell is about to speak to a screen reader: ignore that audio. */
  muteFor: (durationMs: number) => void;
};

/** A counter without hands-free counting (no microphone plumbing mounted). */
export const NO_VOICE: VoiceTasbeeh = {
  platformAvailable: false,
  available: false,
  phrase: null,
  session: INITIAL_VOICE_SESSION,
  listening: false,
  preparing: false,
  level: 0,
  speaking: false,
  stuck: false,
  flashKey: 0,
  modelStatus: "unsupported",
  permission: null,
  requestPermission: async () => "denied",
  start: async () => "unavailable",
  stop: () => {},
  muteFor: () => {},
};

type Options = {
  phrase: PhraseKey | null;
  /** True once the target is reached (the shell's limit). */
  atLimit: boolean;
  /** The shell's single counting path. Called once per recognised phrase. */
  onVoiceCount: () => void;
  /** Listening stopped on its own (silence, target, background, error…). */
  onAutoStop?: (reason: VoiceStopReason, errorCode: string | null) => void;
};

/** Read through a function so TypeScript does not keep an earlier narrowing across awaits. */
function readStatus(ref: { current: VoiceSessionState }): VoiceSessionState["status"] {
  return ref.current.status;
}

function sessionReducer(
  state: { session: VoiceSessionState; counts: number },
  event: VoiceSessionEvent,
) {
  const { state: session, count } = reduceVoiceSession(state.session, event);
  if (session === state.session && !count) return state;
  return { session, counts: state.counts + (count ? 1 : 0) };
}

/**
 * Hands-free tasbeeh for one counter (NF-3.20). Owns the microphone while
 * listening, pauses the app's audio player, keeps the screen awake, and turns
 * each recognised phrase into exactly one `onVoiceCount()` — the counter
 * shell's `countOnce()`, so every face, haptic and the target limit respond the
 * same way as a tap. Everything runs on the device; nothing is stored.
 */
export function useVoiceTasbeeh({
  phrase,
  atLimit,
  onVoiceCount,
  onAutoStop,
}: Options): VoiceTasbeeh {
  const capture = useRecitationCapture();
  const prefs = usePreferences();
  const voicePrefs = resolveTasbeehVoicePrefs(prefs.tasbeehVoice);
  const listenerState = useListenerState();
  const audio = useContext(AudioContext);
  useEnsureTasbeehVoiceCalibrationLoaded();

  const platformAvailable = isVoiceTasbeehPlatformAvailable(capture.available) && !isTV();
  const available = platformAvailable && isVoiceTasbeehAvailable(phrase, capture.available);
  // Pause-count fallback (D24) needs no model.
  const modelStatus = usesModel() ? voiceModelStatus(listenerState) : "ready";

  const [{ session, counts }, dispatch] = useReducer(sessionReducer, {
    session: INITIAL_VOICE_SESSION,
    counts: 0,
  });
  const [level, setLevel] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [permission, setPermission] = useState<MicPermission | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const pipelineRef = useRef<VoicePipeline | null>(null);
  const sessionRef = useRef(session);
  /**
   * The ref is the source of truth for event handlers (mic callbacks arrive
   * between renders); every event is reduced into it synchronously and also
   * dispatched so the UI re-renders with the same state.
   */
  const send = useCallback((event: VoiceSessionEvent) => {
    const result = reduceVoiceSession(sessionRef.current, event);
    sessionRef.current = result.state;
    dispatch(event);
    return result;
  }, []);
  const atLimitRef = useRef(atLimit);
  atLimitRef.current = atLimit;
  const countRef = useRef(onVoiceCount);
  countRef.current = onVoiceCount;
  const autoStopRef = useRef(onAutoStop);
  autoStopRef.current = onAutoStop;
  const sensitivityRef = useRef(voicePrefs.sensitivity);
  sensitivityRef.current = voicePrefs.sensitivity;
  const silenceRef = useRef(voicePrefs.silenceStopSec);
  silenceRef.current = voicePrefs.silenceStopSec;

  // Make sure the shared listener store knows what is installed.
  useEffect(() => {
    if (!platformAvailable) return;
    const state = quranListenerStore.getState();
    if (!state.isReady) void state.load(state.listener.engine ?? FASTCONFORMER_ENGINE);
  }, [platformAvailable]);

  useEffect(() => {
    if (!platformAvailable) return;
    void capture.getPermission().then(setPermission);
  }, [platformAvailable, capture]);

  const teardown = useCallback(async () => {
    const pipeline = pipelineRef.current;
    pipelineRef.current = null;
    setLevel(0);
    setSpeaking(false);
    if (Platform.OS !== "web") {
      try {
        await deactivateKeepAwake(KEEP_AWAKE_TAG);
      } catch {
        // not active
      }
    }
    await pipeline?.stop();
  }, []);

  const stop = useCallback(
    (reason: VoiceStopReason = "user", errorCode?: string) => {
      const wasActive =
        sessionRef.current.status === "listening" || sessionRef.current.status === "preparing";
      send({ type: "stop", at: Date.now(), reason, errorCode });
      void teardown();
      if (wasActive && reason !== "user" && reason !== "left") {
        autoStopRef.current?.(reason, errorCode ?? null);
      }
    },
    [send, teardown],
  );

  const requestPermission = useCallback(async () => {
    let next = await capture.getPermission();
    if (next !== "granted") next = await capture.requestPermission();
    setPermission(next);
    return next;
  }, [capture]);

  const start = useCallback(async (): Promise<VoiceStartResult> => {
    if (!available || !phrase) return "unavailable";
    if (sessionRef.current.status === "listening" || sessionRef.current.status === "preparing") {
      return "started";
    }
    if (usesModel() && voiceModelStatus(quranListenerStore.getState().listener) !== "ready") {
      return "needs-model";
    }
    const current = await capture.getPermission();
    setPermission(current);
    if (current === "undetermined") return "needs-permission";
    if (current !== "granted") return "denied";

    send({ type: "prepare", at: Date.now() });
    // Recitation through the speaker would be counted: pause the app's player.
    if (audio?.isPlaying) audio.toggle();
    if (Platform.OS !== "web") void activateKeepAwakeAsync(KEEP_AWAKE_TAG).catch(() => {});
    try {
      // Loaded on first use: the model runner and its ORT loader stay out of the
      // counter screens' startup graph.
      const { startVoicePipeline } = await import("@/lib/tasbeeh-voice/pipeline");
      pipelineRef.current = await startVoicePipeline({
        capture,
        phrase,
        threshold: () =>
          thresholdFor(
            sensitivityRef.current,
            tasbeehVoiceCalibrationStore.getState().calibration[phrase],
          ),
        onHit: () => {
          if (atLimitRef.current) {
            stop("target");
            return;
          }
          const { count } = send({ type: "hit", at: Date.now(), atLimit: false });
          if (count) countRef.current();
        },
        onSpeech: (active) => {
          setSpeaking(active);
          if (active) send({ type: "speech", at: Date.now() });
        },
        onLevel: (db) => setLevel(Math.max(0, Math.min(1, (db + 60) / 50))),
        onFailure: (code) => {
          reportPracticeError(new Error(code), code, "tasbeeh-voice-runtime");
          stop("error", code);
        },
        onInterrupted: () => stop("interrupted"),
      });
      // Re-read: stop() may have run while the model was loading.
      if (readStatus(sessionRef) !== "preparing") {
        // Stopped (screen left / background) while the model was loading.
        await teardown();
        return "error";
      }
      send({ type: "listening", at: Date.now() });
      return "started";
    } catch (error) {
      const code = toPracticeErrorCode(error, "engine-init-failed");
      reportPracticeError(error, code, "tasbeeh-voice-start");
      stop("error", code);
      return code === "mic-denied" ? "denied" : "error";
    }
  }, [audio, available, capture, phrase, send, stop, teardown]);

  const listening = session.status === "listening";
  const preparing = session.status === "preparing";
  const active = listening || preparing;

  // Silence auto-stop + stuck hint clock.
  useEffect(() => {
    if (!listening) return;
    const timer = setInterval(() => {
      const at = Date.now();
      setNow(at);
      const { state } = reduceVoiceSession(sessionRef.current, {
        type: "tick",
        at,
        silenceStopSec: silenceRef.current,
      });
      if (state.status === "stopped") stop("silence");
    }, TICK_MS);
    return () => clearInterval(timer);
  }, [listening, stop]);

  // Target reached → mic off (the shell plays the completion haptic).
  useEffect(() => {
    if (active && atLimit) stop("target");
  }, [active, atLimit, stop]);

  // No background microphone (privacy, store review).
  useEffect(() => {
    if (!active) return;
    const sub = AppState.addEventListener("change", (next) => {
      if (next !== "active") stop("background");
    });
    return () => sub.remove();
  }, [active, stop]);

  // Leaving the screen.
  useEffect(
    () => () => {
      void teardown();
    },
    [teardown],
  );

  const muteFor = useCallback(
    (durationMs: number) => {
      pipelineRef.current?.mute(durationMs);
      send({ type: "mute", at: Date.now(), durationMs });
    },
    [send],
  );

  return useMemo(
    () => ({
      platformAvailable,
      available,
      phrase,
      session,
      listening,
      preparing,
      level,
      speaking,
      stuck: isStuck(session, now),
      flashKey: counts,
      modelStatus,
      permission,
      requestPermission,
      start,
      stop,
      muteFor,
    }),
    [
      platformAvailable,
      available,
      phrase,
      session,
      listening,
      preparing,
      level,
      speaking,
      now,
      counts,
      modelStatus,
      permission,
      requestPermission,
      start,
      stop,
      muteFor,
    ],
  );
}
