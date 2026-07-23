/**
 * Metro resolves `expo-speech-recognition` here when `EXPO_TV=1`.
 * Keeps search / journal / verse-detector from loading a missing native module.
 */
import { useEffect } from "react";

export type ExpoSpeechRecognitionErrorCode =
  | "not-allowed"
  | "no-speech"
  | "speech-timeout"
  | "service-not-allowed"
  | "language-not-supported"
  | "aborted"
  | string;

export type ExpoSpeechRecognitionOptions = Record<string, unknown>;

export const ExpoSpeechRecognitionModule = {
  isRecognitionAvailable: () => false,
  requestPermissionsAsync: async () => ({ granted: false, canAskAgain: false as boolean }),
  start: (_options?: ExpoSpeechRecognitionOptions) => {},
  stop: () => {},
  abort: () => {},
};

/** No-op event subscription — matches the real hook's call signature. */
export function useSpeechRecognitionEvent(
  _event: string,
  _listener: (...args: unknown[]) => void,
): void {
  useEffect(() => {}, []);
}
