import {
  type ExpoSpeechRecognitionErrorCode,
  ExpoSpeechRecognitionModule,
  type ExpoSpeechRecognitionOptions,
} from "expo-speech-recognition";
import { Platform } from "react-native";

import { localeToBcp47, toAppLocale } from "@/lib/locale-bcp47";
import { isTV } from "@/lib/platform/is-tv";

export type SttPermissionResult = {
  granted: boolean;
  canAskAgain: boolean;
};

export type StartSttOptions = {
  lang: string;
  continuous?: boolean;
  interimResults?: boolean;
  volumeMetering?: boolean;
};

/** Prefer region-qualified tags when OS speech engines need them. */
const STT_LANG_OVERRIDES: Record<string, string> = {
  ar: "ar-SA",
  ur: "ur-PK",
  fa: "fa-IR",
  ps: "ps-AF",
  ku: "ckb-IQ",
};

/** Map an app/UI locale (or raw language tag) to a BCP-47 tag for STT. */
export function resolveSttLang(localeOrTag: string, field: "arabic" | "other" = "other"): string {
  if (field === "arabic") return "ar-SA";
  const tag = localeToBcp47(toAppLocale(localeOrTag));
  const base = tag.split("-")[0]?.toLowerCase() ?? "en";
  if (tag.includes("-")) return tag;
  return STT_LANG_OVERRIDES[base] ?? tag;
}

/**
 * Map expo-speech-recognition volume (~[-2, 10]) to 0→1 for the equalizer.
 * Matches the sample project's systemSpeech.native normalize.
 */
export function normalizeSttVolume(value: number): number {
  const level = (value + 2) / 12;
  return level <= 0 ? 0 : Math.min(level, 1);
}

/**
 * Whether this platform can offer dictation at all (used to show the mic button).
 *
 * - Web: the browser exposes `SpeechRecognition` / `webkitSpeechRecognition`
 *   (Chrome, Edge, Safari). Firefox has none → hidden.
 * - Native: the OS recognizer for the device default locale. This is only a
 *   coarse "is there a recognizer" signal — per-language support is resolved at
 *   start time with fallbacks (see `sttLangCandidates`).
 */
export function isSttAvailable(): boolean {
  if (isTV()) return false;
  try {
    return ExpoSpeechRecognitionModule.isRecognitionAvailable();
  } catch {
    return false;
  }
}

export async function requestSttPermissions(): Promise<SttPermissionResult> {
  // expo-speech-recognition stubs requestPermissionsAsync on web with a console.warn
  // and always returns granted. Browser mic consent is prompted when SpeechRecognition
  // starts — skip the unsupported call to avoid the noise.
  if (Platform.OS === "web" || isTV()) {
    return { granted: Platform.OS === "web", canAskAgain: Platform.OS === "web" };
  }

  try {
    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    return { granted: result.granted, canAskAgain: result.canAskAgain };
  } catch {
    return { granted: false, canAskAgain: false };
  }
}

/**
 * Ordered BCP-47 tags to try for a field. If the OS / browser rejects the first
 * (`language-not-supported`, e.g. iOS has no Urdu recognizer) the hook retries
 * the next one. Arabic fields never fall back to a non-Arabic language.
 */
export function sttLangCandidates(
  localeOrTag: string,
  field: "arabic" | "other" = "other",
): string[] {
  const primary = resolveSttLang(localeOrTag, field);
  const base = primary.split("-")[0]?.toLowerCase() ?? "";
  const out = [primary];
  if (field === "arabic") {
    out.push("ar");
  } else {
    if (base && base !== primary) out.push(base);
    if (base !== "en") out.push("en-US");
  }
  return [...new Set(out)];
}

export function startStt(options: StartSttOptions): void {
  if (isTV()) return;
  // Match sample INPUT-VOICE: system recognizer + optional volume metering.
  // Do not force on-device recognition — it often skips volumechange events.
  const payload: ExpoSpeechRecognitionOptions = {
    lang: options.lang,
    interimResults: options.interimResults ?? true,
    continuous: options.continuous ?? true,
    maxAlternatives: 1,
    // Web Speech API has no volume metering — the hook pulses on speech events instead.
    ...(options.volumeMetering && Platform.OS !== "web"
      ? { volumeChangeEventOptions: { enabled: true, intervalMillis: 100 } }
      : {}),
  };
  ExpoSpeechRecognitionModule.start(payload);
}

export function stopStt(): void {
  if (isTV()) return;
  try {
    ExpoSpeechRecognitionModule.stop();
  } catch {
    // ignore
  }
}

export function abortStt(): void {
  if (isTV()) return;
  try {
    ExpoSpeechRecognitionModule.abort();
  } catch {
    // ignore
  }
}

/** Append a transcript segment to existing field text without duplicating. */
export function mergeSttTranscript(base: string, segment: string): string {
  const trimmedSeg = segment.trim();
  if (!trimmedSeg) return base;
  const trimmedBase = base.trimEnd();
  if (!trimmedBase) return trimmedSeg;
  return `${trimmedBase} ${trimmedSeg}`;
}

export type SttErrorKind = "permission" | "noSpeech" | "unavailable" | "generic";

export function classifySttError(code: ExpoSpeechRecognitionErrorCode | string): SttErrorKind {
  switch (code) {
    case "not-allowed":
      return "permission";
    case "no-speech":
    case "speech-timeout":
      return "noSpeech";
    case "service-not-allowed":
    case "language-not-supported":
    case "audio-capture":
      return "unavailable";
    case "aborted":
      return "generic";
    default:
      return "generic";
  }
}
