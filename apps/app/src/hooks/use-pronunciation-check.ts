import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AppState } from "react-native";

import { setTaggedKeepAwake } from "@/lib/audio-keep-awake";
import { isTV } from "@/lib/platform/is-tv";
import { alignPracticeWords } from "@/lib/quran-companion/align-words";
import { useRecitationCapture } from "@/lib/quran-companion/audio/capture";
import type { MicPermission } from "@/lib/quran-companion/audio/types";
import { reportPracticeError, toPracticeErrorCode } from "@/lib/quran-companion/error-codes";
import type { PracticeErrorCode } from "@/lib/quran-companion/types";
import { assessAyahDetailed, toStudyVerdicts } from "@/lib/quran-pronunciation/assess";
import { isPronunciationCheckAvailable } from "@/lib/quran-pronunciation/availability";
import { engineWordTexts, expectedAyah } from "@/lib/quran-pronunciation/ayah-tokens";
import {
  offsetFromCalibrationRead,
  PINNED_CALIBRATION,
} from "@/lib/quran-pronunciation/calibration";
import type { PronunciationRecorder } from "@/lib/quran-pronunciation/pipeline";
import {
  type CheckEvent,
  type CheckState,
  INITIAL_CHECK,
  isBusy,
  MIN_TAKE_MS,
  reduceCheck,
} from "@/lib/quran-pronunciation/session";
import type { StudyWordVerdict } from "@/lib/quran-pronunciation/types";
import { FASTCONFORMER_ENGINE } from "@/lib/speech/fastconformer";
import { voiceModelStatus } from "@/lib/tasbeeh-voice/model-status";
import { AudioContext } from "@/providers/audio-player-context";
import {
  pronunciationCalibrationStore,
  useEnsurePronunciationCalibrationLoaded,
} from "@/stores/pronunciation-calibration-store";
import { quranListenerStore, useListenerState } from "@/stores/quran-listener-store";

const KEEP_AWAKE_TAG = "quran-pronunciation";

function releaseKeepAwake(): void {
  void setTaggedKeepAwake(KEEP_AWAKE_TAG, false);
}

export type CheckStartResult =
  | "started"
  | "needs-model"
  | "needs-permission"
  | "denied"
  | "unavailable"
  | "error";

export type CheckTarget = {
  surah: number;
  ayah: number;
  /** Bundled ayah text (as shown). */
  arabic: string;
  /** Study words of the row on screen. */
  words: string[];
};

export type CalibrationResult = "saved" | "not-enough" | "no-fit" | "error";

export type PronunciationCheck = {
  available: boolean;
  state: CheckState;
  level: number;
  modelStatus: ReturnType<typeof voiceModelStatus>;
  permission: MicPermission | null;
  requestPermission: () => Promise<MicPermission>;
  /** Start a take of `target` (or a calibration read when `calibrate`). */
  start: (target: CheckTarget, options?: { calibrate?: boolean }) => Promise<CheckStartResult>;
  /** Finish the take and assess it. */
  stop: () => Promise<void>;
  /** Drop the take / result. */
  reset: () => void;
  /** Outcome of the last calibration read (null until one finishes). */
  calibration: CalibrationResult | null;
};

/**
 * One on-device pronunciation check at a time (NF-3.24). Owns the microphone
 * while listening (one owner, `lib/speech/mic-owner.ts`), pauses the app's audio
 * player, keeps the screen awake, and turns the take into per-word states with
 * the pinned FastConformer model — nothing leaves the device and nothing but word
 * states is kept. The model session is opened on the first take and released
 * when the screen unmounts.
 */
export function usePronunciationCheck(): PronunciationCheck {
  const capture = useRecitationCapture();
  const listenerState = useListenerState();
  const audio = useContext(AudioContext);
  useEnsurePronunciationCalibrationLoaded();

  const available = isPronunciationCheckAvailable(capture.available) && !isTV();
  const modelStatus = voiceModelStatus(listenerState);

  const [state, setState] = useState<CheckState>(INITIAL_CHECK);
  const stateRef = useRef(state);
  const send = useCallback((event: CheckEvent) => {
    stateRef.current = reduceCheck(stateRef.current, event);
    setState(stateRef.current);
  }, []);
  const [level, setLevel] = useState(0);
  const [permission, setPermission] = useState<MicPermission | null>(null);
  const [calibration, setCalibration] = useState<CalibrationResult | null>(null);
  const recorderRef = useRef<PronunciationRecorder | null>(null);
  const targetRef = useRef<{ target: CheckTarget; calibrate: boolean } | null>(null);
  const stopRef = useRef<(capped?: boolean) => Promise<void>>(async () => {});

  // Make sure the shared listener store knows what is installed.
  useEffect(() => {
    if (!available) return;
    const s = quranListenerStore.getState();
    if (!s.isReady) void s.load(s.listener.engine ?? FASTCONFORMER_ENGINE);
  }, [available]);

  useEffect(() => {
    if (!available) return;
    void capture.getPermission().then(setPermission);
  }, [available, capture]);

  const requestPermission = useCallback(async () => {
    let next = await capture.getPermission();
    if (next !== "granted") next = await capture.requestPermission();
    setPermission(next);
    return next;
  }, [capture]);

  const fail = useCallback(
    (error: unknown, fallback: PracticeErrorCode, phase: string) => {
      const code = toPracticeErrorCode(error, fallback);
      reportPracticeError(error, code, phase);
      send({ type: "failed", code });
      setLevel(0);
      releaseKeepAwake();
    },
    [send],
  );

  const start = useCallback(
    async (target: CheckTarget, options: { calibrate?: boolean } = {}) => {
      if (!available) return "unavailable" as const;
      if (isBusy(stateRef.current)) return "started" as const;
      if (voiceModelStatus(quranListenerStore.getState().listener) !== "ready") {
        return "needs-model" as const;
      }
      const current = await capture.getPermission();
      setPermission(current);
      if (current === "undetermined") return "needs-permission" as const;
      if (current !== "granted") return "denied" as const;

      targetRef.current = { target, calibrate: !!options.calibrate };
      if (options.calibrate) setCalibration(null);
      send({ type: "prepare" });
      // Recitation through the speaker would be heard as the take: pause the player.
      if (audio?.isPlaying) audio.toggle();
      void setTaggedKeepAwake(KEEP_AWAKE_TAG, true);
      try {
        if (!recorderRef.current) {
          // Loaded on first use: the runner and its ORT loader stay out of the route's startup graph.
          const { openPronunciationRecorder } = await import("@/lib/quran-pronunciation/pipeline");
          recorderRef.current = await openPronunciationRecorder();
        }
        if (stateRef.current.status !== "preparing") return "error" as const;
        await recorderRef.current.startTake(capture, {
          onLevel: setLevel,
          onInterrupted: () => void stopRef.current(),
          onCap: () => void stopRef.current(true),
        });
        send({ type: "listening", at: Date.now() });
        return "started" as const;
      } catch (error) {
        fail(error, "engine-init-failed", "pronunciation-start");
        return toPracticeErrorCode(error) === "mic-denied"
          ? ("denied" as const)
          : ("error" as const);
      }
    },
    [audio, available, capture, fail, send],
  );

  const stop = useCallback(
    async (capped = false) => {
      if (stateRef.current.status === "preparing") {
        send({ type: "stop" });
        await recorderRef.current?.cancelTake();
        return;
      }
      if (stateRef.current.status !== "listening") return;
      send({ type: "stop", capped });
      setLevel(0);
      releaseKeepAwake();
      const recorder = recorderRef.current;
      const job = targetRef.current;
      if (!recorder || !job) return;
      try {
        const matrix = await recorder.finishTake(MIN_TAKE_MS);
        if (!matrix) {
          send({ type: "no-fit", reason: "too-short" });
          return;
        }
        const expected = expectedAyah(job.target.surah, job.target.ayah, recorder.model.corpus);
        if (!expected) {
          send({ type: "no-fit", reason: "no-text" });
          return;
        }
        const offset = pronunciationCalibrationStore.getState().calibration?.offset ?? 0;
        const detail = assessAyahDetailed({
          matrix,
          expected,
          pieces: recorder.model.pieces,
          thresholds: PINNED_CALIBRATION.thresholds,
          mode: PINNED_CALIBRATION.mode,
          offset: job.calibrate ? 0 : offset,
        });
        if (detail.assessment.status === "no-fit") {
          if (job.calibrate) setCalibration("no-fit");
          send({ type: "no-fit", reason: detail.assessment.reason });
          return;
        }
        if (job.calibrate) {
          const outcome = offsetFromCalibrationRead(
            detail.scores.filter((_, i) => !expected.words[detail.engineWords[i]]?.optional),
          );
          if (outcome.ok) {
            await pronunciationCalibrationStore.getState().setOffset(outcome.offset);
            setCalibration("saved");
          } else setCalibration("not-enough");
        }
        const alignment = alignPracticeWords(
          job.target.arabic,
          job.target.words,
          engineWordTexts(expected),
        );
        const verdicts: StudyWordVerdict[] = toStudyVerdicts(
          detail.assessment,
          alignment.studyToEngine,
        );
        send({ type: "assessed", verdicts });
      } catch (error) {
        if (job.calibrate) setCalibration("error");
        fail(error, "engine-runtime", "pronunciation-assess");
      }
    },
    [fail, send],
  );
  stopRef.current = stop;

  const reset = useCallback(() => {
    if (isBusy(stateRef.current)) void recorderRef.current?.cancelTake();
    send({ type: "reset" });
    setLevel(0);
  }, [send]);

  // No background microphone (privacy, store review): drop the take.
  useEffect(() => {
    const sub = AppState.addEventListener("change", (next) => {
      if (next !== "active" && isBusy(stateRef.current)) {
        void recorderRef.current?.cancelTake();
        send({ type: "failed", code: "interrupted" });
        setLevel(0);
      }
    });
    return () => sub.remove();
  }, [send]);

  // Leaving the screen: stop the mic and release the model.
  useEffect(
    () => () => {
      const recorder = recorderRef.current;
      recorderRef.current = null;
      void recorder?.dispose();
      releaseKeepAwake();
    },
    [],
  );

  return useMemo(
    () => ({
      available,
      state,
      level,
      modelStatus,
      permission,
      requestPermission,
      start,
      stop: () => stop(false),
      reset,
      calibration,
    }),
    [
      available,
      state,
      level,
      modelStatus,
      permission,
      requestPermission,
      start,
      stop,
      reset,
      calibration,
    ],
  );
}
