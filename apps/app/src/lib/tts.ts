import * as Speech from "expo-speech";
import { Platform } from "react-native";

export type TtsVoice = {
  identifier: string;
  name: string;
  language: string;
};

export type SpeakOptions = {
  lang: string;
  voice?: string;
  rate?: number;
  onDone?: () => void;
  onError?: () => void;
};

/** Whether TTS is available on this platform (native + web via expo-speech). */
export async function isTtsAvailable(): Promise<boolean> {
  try {
    await Speech.getAvailableVoicesAsync();
    return true;
  } catch {
    return false;
  }
}

/** List installed voices, optionally filtered by language (e.g. "en", "en-US", "ur"). */
export async function getTtsVoices(langPrefix?: string): Promise<TtsVoice[]> {
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    const mapped = voices.map((v) => ({
      identifier: v.identifier,
      name: v.name,
      language: v.language,
    }));
    if (!langPrefix) return mapped;
    // Accept full BCP-47 tags ("en-US") by matching the primary subtag ("en").
    const prefix = langPrefix.toLowerCase().split("-")[0] ?? langPrefix.toLowerCase();
    return mapped.filter((v) => {
      const lang = v.language.toLowerCase();
      return lang === prefix || lang.startsWith(`${prefix}-`);
    });
  } catch {
    return [];
  }
}

/** Speak text via platform TTS. Resolves when speech finishes (or immediately if empty). */
export function speak(text: string, options: SpeakOptions): Promise<void> {
  const trimmed = text.trim();
  if (!trimmed) {
    options.onDone?.();
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    void (async () => {
      try {
        await Speech.stop();
        Speech.speak(trimmed, {
          language: options.lang,
          voice: options.voice,
          rate: options.rate ?? (Platform.OS === "ios" ? 0.5 : 1),
          onDone: () => {
            options.onDone?.();
            resolve();
          },
          onStopped: () => {
            options.onDone?.();
            resolve();
          },
          onError: () => {
            options.onError?.();
            resolve();
          },
        });
      } catch {
        options.onError?.();
        resolve();
      }
    })();
  });
}

/** Stop any in-progress TTS. */
export async function stopTts(): Promise<void> {
  try {
    await Speech.stop();
  } catch {
    // ignore
  }
}
