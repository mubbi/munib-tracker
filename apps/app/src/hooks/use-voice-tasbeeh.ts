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
import type { Matrix } from "@/lib/tasbeeh-voice/dtw";
import { resolveTasbeehVoicePrefs, thresholdFor } from "@/lib/tasbeeh-voice/gate";
import {
  buildPattern,
  checkSample,
  MAX_TEMPLATES,
  type SampleCheck,
  sampleFeatures,
  type TaughtPattern,
} from "@/lib/tasbeeh-voice/matcher";
import { type SessionCountingMode, sessionCountingMode, usesModel } from "@/lib/tasbeeh-voice/mode";
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
import type { VoiceZikr } from "@/lib/tasbeeh-voice/voice-zikr";
import { AudioContext } from "@/providers/audio-player-context";
import { usePreferences } from "@/stores/preferences-store";
import { quranListenerStore, useListenerState } from "@/stores/quran-listener-store";
import {
  tasbeehVoiceCalibrationStore,
  useEnsureTasbeehVoiceCalibrationLoaded,
} from "@/stores/tasbeeh-voice-calibration-store";
import {
  tasbeehVoiceTemplatesStore,
  taughtPatternFor,
  useEnsureTasbeehVoiceTemplatesLoaded,
  useIsZikrTaught,
} from "@/stores/tasbeeh-voice-templates-store";

const KEEP_AWAKE_TAG = "tasbeeh-voice";
const TICK_MS = 1000;

export type VoiceStartResult =
  | "started"
  | "needs-model"
  | "needs-permission"
  | "denied"
  | "unavailable"
  | "error";

/** Teaching a zikr (D50): 1–3 samples, then counting starts. */
export type VoiceTeachState = {
  status: "idle" | "recording";
  /** Samples kept so far. */
  accepted: number;
  /** Samples asked for. */
  target: number;
  /** Why the last sample was not kept. */
  issue: Exclude<SampleCheck, "ok"> | null;
};

const IDLE_TEACH: VoiceTeachState = {
  status: "idle",
  accepted: 0,
  target: MAX_TEMPLATES,
  issue: null,
};

export type VoiceTasbeeh = {
  /** This platform can count by voice at all. */
  platformAvailable: boolean;
  /** Voice counting is possible for the current zikr. */
  available: boolean;
  /** What the counter listens for (null on a free counter until one is chosen). */
  zikr: VoiceZikr | null;
  /** Catalog phrase of the zikr (model spotter), if any. */
  phrase: PhraseKey | null;
  /** The zikr has a taught voice pattern (on this device, or for this session). */
  taught: boolean;
  /** How the current / last session counts. */
  countingMode: SessionCountingMode | null;
  session: VoiceSessionState;
  listening: boolean;
  preparing: boolean;
  /** 0–1 input level for the meter (listening or teaching). */
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
  /** Start counting: by the taught pattern when there is one, else by pauses. */
  start: (options?: { skipTeaching?: boolean }) => Promise<VoiceStartResult>;
  stop: (reason?: VoiceStopReason) => void;
  /** The shell is about to speak to a screen reader: ignore that audio. */
  muteFor: (durationMs: number) => void;
  teach: VoiceTeachState;
  /** Listen for teaching samples ("Say it once so only this zikr counts"). */
  startTeaching: () => Promise<VoiceStartResult>;
  /** Keep the samples heard so far (≥ 1) and start counting. */
  finishTeaching: () => Promise<VoiceStartResult>;
  cancelTeaching: () => void;
};

/** A counter without hands-free counting (no microphone plumbing mounted). */
export const NO_VOICE: VoiceTasbeeh = {
  platformAvailable: false,
  available: false,
  zikr: null,
  phrase: null,
  taught: false,
  countingMode: null,
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
  teach: IDLE_TEACH,
  startTeaching: async () => "unavailable",
  finishTeaching: async () => "unavailable",
  cancelTeaching: () => {},
};

type Options = {
  zikr: VoiceZikr | null;
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

/** Same zikr identity across renders (screens rebuild the object every render). */
function zikrIdentity(zikr: VoiceZikr | null): string {
  return zikr ? `${zikr.key ?? "other"}|${zikr.label ?? ""}` : "";
}

/**
 * Hands-free tasbeeh for one counter (NF-3.20, D48–D51). Owns the microphone
 * while listening or teaching, pauses the app's audio player, keeps the screen
 * awake, and turns each recognised repeat into exactly one `onVoiceCount()` —
 * the counter shell's `countOnce()`, so every face, haptic and the target limit
 * respond the same way as a tap. Everything runs on the device; the only thing
 * kept is a taught zikr's voice pattern (numbers, never audio, this device only).
 */
export function useVoiceTasbeeh({
  zikr,
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
  useEnsureTasbeehVoiceTemplatesLoaded();

  const phrase = zikr?.phrase ?? null;
  const zikrKey = zikr?.key ?? null;
  const identity = zikrIdentity(zikr);
  const storedTaught = useIsZikrTaught(zikrKey);
  // "Something else" (no key) is taught for this session only.
  const [sessionPattern, setSessionPattern] = useState<{
    identity: string;
    pattern: TaughtPattern;
  } | null>(null);
  const sessionTaught = sessionPattern != null && sessionPattern.identity === identity;
  const taught = zikr != null && (storedTaught || sessionTaught);

  const platformAvailable = isVoiceTasbeehPlatformAvailable(capture.available) && !isTV();
  const available = platformAvailable && isVoiceTasbeehAvailable(zikr, capture.available);
  // Only the model spotter needs a download; pause and taught counting don't.
  const modelStatus =
    usesModel() && phrase != null && !taught ? voiceModelStatus(listenerState) : "ready";

  const [{ session, counts }, dispatch] = useReducer(sessionReducer, {
    session: INITIAL_VOICE_SESSION,
    counts: 0,
  });
  const [level, setLevel] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [permission, setPermission] = useState<MicPermission | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [countingMode, setCountingMode] = useState<SessionCountingMode | null>(null);
  const [teach, setTeach] = useState<VoiceTeachState>(IDLE_TEACH);

  const pipelineRef = useRef<VoicePipeline | null>(null);
  const teachPipelineRef = useRef<VoicePipeline | null>(null);
  const teachSamplesRef = useRef<Matrix[]>([]);
  const teachingRef = useRef(false);
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
  const zikrRef = useRef(zikr);
  zikrRef.current = zikr;
  const sessionPatternRef = useRef(sessionPattern);
  sessionPatternRef.current = sessionPattern;

  // Make sure the shared listener store knows what is installed (spotter only).
  useEffect(() => {
    if (!platformAvailable || !usesModel()) return;
    const state = quranListenerStore.getState();
    if (!state.isReady) void state.load(state.listener.engine ?? FASTCONFORMER_ENGINE);
  }, [platformAvailable]);

  useEffect(() => {
    if (!platformAvailable) return;
    void capture.getPermission().then(setPermission);
  }, [platformAvailable, capture]);

  const stopTeachPipeline = useCallback(async () => {
    const pipeline = teachPipelineRef.current;
    teachPipelineRef.current = null;
    teachingRef.current = false;
    await pipeline?.stop();
  }, []);

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
    await stopTeachPipeline();
  }, [stopTeachPipeline]);

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

  /** Mic permission gate shared by counting and teaching. */
  const checkPermission = useCallback(async (): Promise<VoiceStartResult | null> => {
    const current = await capture.getPermission();
    setPermission(current);
    if (current === "undetermined") return "needs-permission";
    if (current !== "granted") return "denied";
    return null;
  }, [capture]);

  const start = useCallback(
    async (options?: { skipTeaching?: boolean }): Promise<VoiceStartResult> => {
      const current = zikrRef.current;
      if (!available || !current) return "unavailable";
      if (sessionRef.current.status === "listening" || sessionRef.current.status === "preparing") {
        return "started";
      }
      const pattern =
        taughtPatternFor(current.key) ??
        (sessionPatternRef.current?.identity === zikrIdentity(current)
          ? sessionPatternRef.current.pattern
          : null);
      const mode = sessionCountingMode({
        taught: pattern != null,
        skipTeaching: options?.skipTeaching,
        hasCatalogPhrase: current.phrase != null,
        spotterOn: usesModel(),
      });
      if (
        mode === "spotter" &&
        voiceModelStatus(quranListenerStore.getState().listener) !== "ready"
      ) {
        return "needs-model";
      }
      const blocked = await checkPermission();
      if (blocked) return blocked;

      await stopTeachPipeline();
      setTeach(IDLE_TEACH);
      setCountingMode(mode);
      send({ type: "prepare", at: Date.now() });
      // Recitation through the speaker would be counted: pause the app's player.
      if (audio?.isPlaying) audio.toggle();
      if (Platform.OS !== "web") void activateKeepAwakeAsync(KEEP_AWAKE_TAG).catch(() => {});
      try {
        // Loaded on first use: the pipeline and its DSP / ORT loaders stay out of
        // the counter screens' startup graph.
        const { startVoicePipeline } = await import("@/lib/tasbeeh-voice/pipeline");
        const spotterPhrase = current.phrase;
        pipelineRef.current = await startVoicePipeline({
          capture,
          mode,
          phrase: spotterPhrase,
          pattern,
          threshold: () =>
            spotterPhrase
              ? thresholdFor(
                  sensitivityRef.current,
                  tasbeehVoiceCalibrationStore.getState().calibration[spotterPhrase],
                )
              : 0,
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
        // Re-read: stop() may have run while the pipeline was starting.
        if (readStatus(sessionRef) !== "preparing") {
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
    },
    [audio, available, capture, checkPermission, send, stop, stopTeachPipeline, teardown],
  );

  const cancelTeaching = useCallback(() => {
    teachSamplesRef.current = [];
    setTeach(IDLE_TEACH);
    setLevel(0);
    setSpeaking(false);
    void stopTeachPipeline();
  }, [stopTeachPipeline]);

  const finishTeaching = useCallback(async (): Promise<VoiceStartResult> => {
    const current = zikrRef.current;
    const samples = teachSamplesRef.current;
    teachSamplesRef.current = [];
    await stopTeachPipeline();
    setTeach(IDLE_TEACH);
    setLevel(0);
    setSpeaking(false);
    if (!current || samples.length === 0) return "error";
    const pattern = buildPattern(samples);
    if (current.key) {
      await tasbeehVoiceTemplatesStore.getState().save(current.key, pattern);
    } else {
      const next = { identity: zikrIdentity(current), pattern };
      sessionPatternRef.current = next;
      setSessionPattern(next);
    }
    return start();
  }, [start, stopTeachPipeline]);

  const finishRef = useRef(finishTeaching);
  finishRef.current = finishTeaching;

  const startTeaching = useCallback(async (): Promise<VoiceStartResult> => {
    if (!available || !zikrRef.current) return "unavailable";
    if (teachingRef.current) return "started";
    const blocked = await checkPermission();
    if (blocked) return blocked;
    if (sessionRef.current.status === "listening" || sessionRef.current.status === "preparing") {
      stop("user");
    }
    await teardown();
    teachSamplesRef.current = [];
    teachingRef.current = true;
    setTeach({ ...IDLE_TEACH, status: "recording" });
    if (audio?.isPlaying) audio.toggle();
    try {
      const { startVoicePipeline } = await import("@/lib/tasbeeh-voice/pipeline");
      teachPipelineRef.current = await startVoicePipeline({
        capture,
        mode: "teach",
        onHit: () => {},
        onSample: (pcm) => {
          if (!teachingRef.current) return;
          const features = sampleFeatures(pcm);
          const verdict = checkSample(features, teachSamplesRef.current);
          if (verdict !== "ok" || !features) {
            setTeach((prev) => ({ ...prev, issue: verdict === "ok" ? "too-short" : verdict }));
            return;
          }
          teachSamplesRef.current = [...teachSamplesRef.current, features];
          const accepted = teachSamplesRef.current.length;
          setTeach((prev) => ({ ...prev, accepted, issue: null }));
          if (accepted >= MAX_TEMPLATES) void finishRef.current();
        },
        onTooLong: () => setTeach((prev) => ({ ...prev, issue: "too-long" })),
        onSpeech: setSpeaking,
        onLevel: (db) => setLevel(Math.max(0, Math.min(1, (db + 60) / 50))),
        onFailure: (code) => {
          reportPracticeError(new Error(code), code, "tasbeeh-voice-teach");
          cancelTeaching();
        },
        onInterrupted: () => cancelTeaching(),
      });
      if (!teachingRef.current) {
        // Cancelled (screen left / background) while the microphone was starting.
        await stopTeachPipeline();
        return "error";
      }
      return "started";
    } catch (error) {
      const code = toPracticeErrorCode(error, "capture-failed");
      reportPracticeError(error, code, "tasbeeh-voice-teach");
      cancelTeaching();
      return code === "mic-denied" ? "denied" : "error";
    }
  }, [
    audio,
    available,
    capture,
    checkPermission,
    cancelTeaching,
    stop,
    stopTeachPipeline,
    teardown,
  ]);

  const listening = session.status === "listening";
  const preparing = session.status === "preparing";
  const active = listening || preparing;
  const teaching = teach.status === "recording";

  // A different zikr: drop teaching in progress (a session-only pattern is keyed by identity).
  // biome-ignore lint/correctness/useExhaustiveDependencies: runs only when the identity changes.
  useEffect(() => {
    if (teachingRef.current) cancelTeaching();
  }, [identity]);

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
    if (!active && !teaching) return;
    const sub = AppState.addEventListener("change", (next) => {
      if (next === "active") return;
      if (teachingRef.current) cancelTeaching();
      else stop("background");
    });
    return () => sub.remove();
  }, [active, teaching, stop, cancelTeaching]);

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
      zikr,
      phrase,
      taught,
      countingMode,
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
      teach,
      startTeaching,
      finishTeaching,
      cancelTeaching,
    }),
    [
      platformAvailable,
      available,
      zikr,
      phrase,
      taught,
      countingMode,
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
      teach,
      startTeaching,
      finishTeaching,
      cancelTeaching,
    ],
  );
}
