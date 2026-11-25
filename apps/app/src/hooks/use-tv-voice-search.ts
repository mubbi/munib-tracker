import { useCallback, useRef, useState } from "react";
import { Platform } from "react-native";

import { localeToBcp47 } from "@/lib/locale-bcp47";
import { isTV } from "@/lib/platform/is-tv";
import { isTvVoiceSearchAvailable, startTvVoiceSearch } from "@/lib/tv-home/native";

export type UseTvVoiceSearchOptions = {
  /** Recognized text (trimmed, non-empty). */
  onResult: (text: string) => void;
  /** No speech recognizer could be opened. */
  onUnavailable?: () => void;
  /** UI locale used as the recognition language hint. */
  uiLocale: string;
};

/**
 * Voice search on Android TV / Google TV: opens the system speech prompt
 * (`RecognizerIntent`) that the remote's microphone already uses. The recognizer
 * app records audio, so the TV build keeps RECORD_AUDIO blocked.
 *
 * - Apple TV: unavailable here — the system keyboard has Siri Remote dictation.
 * - Fire TV: usually no recognizer activity, so `available` is false and the
 *   on-screen keyboard's own voice input is used instead.
 */
export function useTvVoiceSearch({ onResult, onUnavailable, uiLocale }: UseTvVoiceSearchOptions) {
  const [available] = useState(
    () => isTV() && Platform.OS === "android" && isTvVoiceSearchAvailable(),
  );
  const [listening, setListening] = useState(false);
  const busyRef = useRef(false);

  const start = useCallback(
    async (prompt?: string) => {
      if (!available || busyRef.current) return;
      busyRef.current = true;
      setListening(true);
      try {
        const text = (
          await startTvVoiceSearch({ prompt, language: localeToBcp47(uiLocale) })
        )?.trim();
        // Null = cancelled with Back or nothing heard; the system prompt already said so.
        if (text) onResult(text);
      } catch {
        onUnavailable?.();
      } finally {
        busyRef.current = false;
        setListening(false);
      }
    },
    [available, onResult, onUnavailable, uiLocale],
  );

  return { available, listening, start };
}
