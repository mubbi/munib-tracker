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
  /**
   * When true, do not call `Speech.stop()` before speaking. Used by
   * `speakLong` when chaining chunks so mid-utterance stops stay intentional.
   */
  continueFromPrevious?: boolean;
};

/** Android TTS often truncates past ~4k; keep a safe margin and split on sentences. */
export const TTS_CHUNK_MAX_CHARS = 3500;

/** Invalidates in-flight `speakLong` loops when `stopTts` (or a new speak) runs. */
let ttsSession = 0;

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

/**
 * Pick the best installed voice for a BCP-47 (or primary) language tag.
 * Prefers an exact/preferred identifier when still installed for that language.
 */
export async function resolveTtsVoice(
  lang: string,
  preferredId?: string | null,
): Promise<string | undefined> {
  const voices = await getTtsVoices(lang);
  if (preferredId && voices.some((v) => v.identifier === preferredId)) {
    return preferredId;
  }
  return voices[0]?.identifier;
}

/**
 * Split long copy into speakable chunks at sentence / paragraph boundaries.
 * Exported for unit tests.
 */
export function chunkTextForTts(text: string, maxChars = TTS_CHUNK_MAX_CHARS): string[] {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return [];
  if (normalized.length <= maxChars) return [normalized];

  const chunks: string[] = [];
  let rest = normalized;
  while (rest.length > maxChars) {
    const window = rest.slice(0, maxChars);
    const breakAt = Math.max(
      window.lastIndexOf(". "),
      window.lastIndexOf("。"),
      window.lastIndexOf("؟ "),
      window.lastIndexOf("! "),
      window.lastIndexOf("? "),
      window.lastIndexOf("\n"),
      window.lastIndexOf(" "),
    );
    const cut = breakAt > maxChars * 0.4 ? breakAt + 1 : maxChars;
    const piece = rest.slice(0, cut).trim();
    if (piece) chunks.push(piece);
    rest = rest.slice(cut).trim();
  }
  if (rest) chunks.push(rest);
  return chunks;
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
        if (!options.continueFromPrevious) {
          // Cancels any in-flight `speakLong` chunk loop as well.
          ttsSession += 1;
          await Speech.stop();
        }
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

/**
 * Speak article-length text by chaining platform-safe chunks.
 * Call `stopTts()` to cancel remaining chunks.
 */
export async function speakLong(text: string, options: SpeakOptions): Promise<void> {
  const chunks = chunkTextForTts(text);
  if (chunks.length === 0) {
    options.onDone?.();
    return;
  }

  await stopTts();
  const session = ttsSession;

  for (const chunk of chunks) {
    if (session !== ttsSession) break;

    let errored = false;
    await speak(chunk, {
      lang: options.lang,
      voice: options.voice,
      rate: options.rate,
      continueFromPrevious: true,
      onError: () => {
        errored = true;
        options.onError?.();
      },
    });

    if (errored || session !== ttsSession) break;
  }

  if (session === ttsSession) {
    options.onDone?.();
  }
}

/** Stop any in-progress TTS (including remaining `speakLong` chunks). */
export async function stopTts(): Promise<void> {
  ttsSession += 1;
  try {
    await Speech.stop();
  } catch {
    // ignore
  }
}
