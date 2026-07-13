import { useSpeechRecognitionEvent } from "expo-speech-recognition";
import { useCallback, useEffect, useRef, useState } from "react";
import { type SharedValue, useSharedValue, withTiming } from "react-native-reanimated";

import {
  abortStt,
  classifySttError,
  isSttAvailable,
  mergeSttTranscript,
  normalizeSttVolume,
  requestSttPermissions,
  resolveSttLang,
  type SttErrorKind,
  startStt,
  stopStt,
} from "@/lib/stt";

export type UseSpeechToTextOptions = {
  /** Called with the merged field value on each interim/final result. */
  onTranscript: (text: string) => void;
  /** Called when recognition fails (never for user abort). */
  onError?: (kind: SttErrorKind) => void;
  /** UI locale used for non-Arabic fields. */
  uiLocale: string;
};

export type UseSpeechToTextResult = {
  available: boolean;
  listening: boolean;
  /** Active field key while listening, otherwise null. */
  activeField: string | null;
  /** 0→1 smoothed input loudness for the mic beat visualizer. */
  level: SharedValue<number>;
  transcript: string;
  /** Start (or restart) listening for a draft field. */
  start: (field: string, currentValue: string, kind: "arabic" | "other") => Promise<boolean>;
  stop: () => void;
  abort: () => void;
};

/**
 * Speech-to-text for form fields. One active field at a time; continuous mode
 * keeps the mic open until the user stops so longer dictation is possible.
 * Interim results replace the in-flight segment; finals append.
 *
 * Loudness is smoothed into `level` the same way as the sample project's
 * `useVoiceCapture` → VoiceRainbowVisualizer pipeline.
 */
export function useSpeechToText(options: UseSpeechToTextOptions): UseSpeechToTextResult {
  const { onTranscript, onError, uiLocale } = options;
  const [available, setAvailable] = useState(false);
  const [listening, setListening] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [transcript, setTranscript] = useState("");
  const level = useSharedValue(0);

  const baseRef = useRef("");
  /** Finalized segments committed during this listen session (beyond `baseRef`). */
  const committedRef = useRef("");
  const listeningRef = useRef(false);
  const abortedRef = useRef(false);
  const onTranscriptRef = useRef(onTranscript);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    setAvailable(isSttAvailable());
  }, []);

  const resetLevel = useCallback(() => {
    level.value = withTiming(0, { duration: 160 });
  }, [level]);

  useSpeechRecognitionEvent("start", () => {
    listeningRef.current = true;
    setListening(true);
  });

  useSpeechRecognitionEvent("end", () => {
    listeningRef.current = false;
    setListening(false);
    setActiveField(null);
    resetLevel();
  });

  useSpeechRecognitionEvent("result", (event) => {
    const next = event.results[0]?.transcript ?? "";
    if (event.isFinal) {
      committedRef.current = mergeSttTranscript(committedRef.current, next);
      setTranscript(committedRef.current);
      onTranscriptRef.current(mergeSttTranscript(baseRef.current, committedRef.current));
      return;
    }
    setTranscript(next);
    onTranscriptRef.current(
      mergeSttTranscript(baseRef.current, mergeSttTranscript(committedRef.current, next)),
    );
  });

  useSpeechRecognitionEvent("error", (event) => {
    if (abortedRef.current || event.error === "aborted") {
      abortedRef.current = false;
      return;
    }
    // Continuous sessions often emit no-speech between phrases — ignore while the user still owns stop.
    if (listeningRef.current && (event.error === "no-speech" || event.error === "speech-timeout")) {
      return;
    }
    onErrorRef.current?.(classifySttError(event.error));
  });

  // Same smoothing as sample useVoiceCapture: withTiming(…, { duration: 130 }).
  useSpeechRecognitionEvent("volumechange", (event) => {
    const value = typeof event?.value === "number" ? event.value : -2;
    const next = normalizeSttVolume(value);
    level.value = withTiming(next, { duration: 130 });
  });

  const abort = useCallback(() => {
    if (!listeningRef.current) {
      abortStt();
      setListening(false);
      setActiveField(null);
      resetLevel();
      return;
    }
    abortedRef.current = true;
    abortStt();
    listeningRef.current = false;
    setListening(false);
    setActiveField(null);
    resetLevel();
    setTranscript("");
    committedRef.current = "";
  }, [resetLevel]);

  const stop = useCallback(() => {
    stopStt();
  }, []);

  const start = useCallback(
    async (field: string, currentValue: string, kind: "arabic" | "other"): Promise<boolean> => {
      if (!isSttAvailable()) {
        onErrorRef.current?.("unavailable");
        return false;
      }

      if (listeningRef.current) {
        abortedRef.current = true;
        abortStt();
      }

      const permission = await requestSttPermissions();
      if (!permission.granted) {
        onErrorRef.current?.("permission");
        return false;
      }

      baseRef.current = currentValue;
      committedRef.current = "";
      setTranscript("");
      level.value = withTiming(0, { duration: 120 });
      setActiveField(field);
      abortedRef.current = false;

      try {
        startStt({
          lang: resolveSttLang(uiLocale, kind),
          interimResults: true,
          continuous: true,
          volumeMetering: true,
        });
        return true;
      } catch {
        setActiveField(null);
        onErrorRef.current?.("unavailable");
        return false;
      }
    },
    [level, uiLocale],
  );

  return {
    available,
    listening,
    activeField,
    level,
    transcript,
    start,
    stop,
    abort,
  };
}
