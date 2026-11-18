import { useSpeechRecognitionEvent } from "expo-speech-recognition";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Platform } from "react-native";
import { type SharedValue, useSharedValue, withTiming } from "react-native-reanimated";
import { isTV } from "@/lib/platform/is-tv";
import {
  abortStt,
  classifySttError,
  isSttAvailable,
  mergeSttTranscript,
  normalizeSttVolume,
  requestSttPermissions,
  type SttErrorKind,
  startStt,
  stopStt,
  sttLangCandidates,
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
 * The recognizer is a process-wide singleton and its events are broadcast to
 * every subscriber. Several screens using this hook can be mounted at once
 * (e.g. Search under a pushed Verse Detector), so only the instance that
 * started the current session may react to events.
 */
let activeOwner: string | null = null;

const IS_WEB = Platform.OS === "web";
/** Web Speech API has no volume metering — pulse the visualizer while speech is heard. */
const WEB_SPEECH_LEVEL = 0.55;

/**
 * Speech-to-text for form fields (iOS, Android and web). One active field at a
 * time; continuous mode keeps the mic open until the user stops so longer
 * dictation is possible. Interim results replace the in-flight segment; finals append.
 *
 * Loudness is smoothed into `level` the same way as the sample project's
 * `useVoiceCapture` → VoiceRainbowVisualizer pipeline.
 */
export function useSpeechToText(options: UseSpeechToTextOptions): UseSpeechToTextResult {
  const { onTranscript, onError, uiLocale } = options;
  const ownerId = useId();
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
  /** Remaining language tags to try if the recognizer rejects the current one. */
  const fallbackLangsRef = useRef<string[]>([]);
  /** Set when an unsupported-language error should restart on the next `end`. */
  const retryLangRef = useRef<string | null>(null);
  const onTranscriptRef = useRef(onTranscript);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    setAvailable(!isTV() && isSttAvailable());
  }, []);

  // Release ownership (and the mic) if this screen unmounts mid-session.
  useEffect(
    () => () => {
      if (activeOwner === ownerId) {
        activeOwner = null;
        abortStt();
      }
    },
    [ownerId],
  );

  const owns = () => activeOwner === ownerId;

  const resetLevel = useCallback(() => {
    level.value = withTiming(0, { duration: 160 });
  }, [level]);

  const launch = useCallback((lang: string) => {
    startStt({ lang, interimResults: true, continuous: true, volumeMetering: true });
  }, []);

  useSpeechRecognitionEvent("start", () => {
    if (!owns()) return;
    listeningRef.current = true;
    setListening(true);
  });

  useSpeechRecognitionEvent("end", () => {
    if (!owns()) return;
    const retryLang = retryLangRef.current;
    if (retryLang) {
      retryLangRef.current = null;
      try {
        launch(retryLang);
        return;
      } catch {
        onErrorRef.current?.("unavailable");
      }
    }
    activeOwner = null;
    listeningRef.current = false;
    setListening(false);
    setActiveField(null);
    resetLevel();
  });

  useSpeechRecognitionEvent("result", (event) => {
    if (!owns()) return;
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
    if (!owns()) return;
    if (abortedRef.current || event.error === "aborted") {
      abortedRef.current = false;
      return;
    }
    // Continuous sessions often emit no-speech between phrases — ignore while the user still owns stop.
    if (listeningRef.current && (event.error === "no-speech" || event.error === "speech-timeout")) {
      return;
    }
    // Recognizer has no model for this language (e.g. Urdu on iOS) — retry with the next tag.
    if (event.error === "language-not-supported" && fallbackLangsRef.current.length > 0) {
      retryLangRef.current = fallbackLangsRef.current.shift() ?? null;
      return;
    }
    onErrorRef.current?.(classifySttError(event.error));
  });

  // Same smoothing as sample useVoiceCapture: withTiming(…, { duration: 130 }).
  useSpeechRecognitionEvent("volumechange", (event) => {
    if (!owns()) return;
    const value = typeof event?.value === "number" ? event.value : -2;
    const next = normalizeSttVolume(value);
    level.value = withTiming(next, { duration: 130 });
  });

  useSpeechRecognitionEvent("speechstart", () => {
    if (!IS_WEB || !owns()) return;
    level.value = withTiming(WEB_SPEECH_LEVEL, { duration: 160 });
  });

  useSpeechRecognitionEvent("speechend", () => {
    if (!IS_WEB || !owns()) return;
    resetLevel();
  });

  const abort = useCallback(() => {
    if (activeOwner !== ownerId) return;
    retryLangRef.current = null;
    fallbackLangsRef.current = [];
    if (listeningRef.current) {
      abortedRef.current = true;
      setTranscript("");
      committedRef.current = "";
    }
    abortStt();
    activeOwner = null;
    listeningRef.current = false;
    setListening(false);
    setActiveField(null);
    resetLevel();
  }, [ownerId, resetLevel]);

  const stop = useCallback(() => {
    if (activeOwner !== ownerId) return;
    retryLangRef.current = null;
    fallbackLangsRef.current = [];
    stopStt();
  }, [ownerId]);

  const start = useCallback(
    async (field: string, currentValue: string, kind: "arabic" | "other"): Promise<boolean> => {
      // Only gate on "no recognizer at all" (TV, Firefox). Per-language support
      // is resolved by the recognizer itself, with fallbacks below.
      if (isTV() || (IS_WEB && !isSttAvailable())) {
        onErrorRef.current?.("unavailable");
        return false;
      }

      // Stop any session — ours or another mounted screen's — before taking over.
      if (activeOwner !== null) {
        abortedRef.current = activeOwner === ownerId;
        abortStt();
      }

      const permission = await requestSttPermissions();
      if (!permission.granted) {
        onErrorRef.current?.("permission");
        return false;
      }

      const [lang, ...fallbacks] = sttLangCandidates(uiLocale, kind);
      activeOwner = ownerId;
      fallbackLangsRef.current = fallbacks;
      retryLangRef.current = null;
      baseRef.current = currentValue;
      committedRef.current = "";
      setTranscript("");
      level.value = withTiming(0, { duration: 120 });
      setActiveField(field);
      abortedRef.current = false;

      try {
        launch(lang ?? "en-US");
        return true;
      } catch {
        activeOwner = null;
        setActiveField(null);
        onErrorRef.current?.("unavailable");
        return false;
      }
    },
    [launch, level, ownerId, uiLocale],
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
