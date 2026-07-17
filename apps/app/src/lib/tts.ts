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

/** Map mini-player speed (0.5–2) onto expo-speech's platform-specific rate scale. */
export function playerRateToSpeechRate(playerRate: number): number {
  const clamped = Math.min(2, Math.max(0.5, playerRate));
  // iOS expo-speech treats ~0.5 as "normal"; Android/web use 1.0.
  if (Platform.OS === "ios") return 0.5 * clamped;
  return clamped;
}

/** Whether the platform can pause/resume TTS without restarting (not Android). */
export function canPauseTts(): boolean {
  return Platform.OS === "ios" || Platform.OS === "web";
}

export async function pauseTts(): Promise<void> {
  if (!canPauseTts()) return;
  try {
    await Speech.pause();
  } catch {
    // ignore
  }
}

export async function resumeTts(): Promise<void> {
  if (!canPauseTts()) return;
  try {
    await Speech.resume();
  } catch {
    // ignore
  }
}

/** Whether TTS is available on this platform (native + web via expo-speech). */
export async function isTtsAvailable(): Promise<boolean> {
  try {
    // Use the shared loader — concurrent `Speech.getAvailableVoicesAsync()` on
    // web overwrites `speechSynthesis.onvoiceschanged` and can hang forever.
    await loadAllTtsVoices();
    return true;
  } catch {
    return false;
  }
}

/**
 * expo-speech's web `getVoices()` assigns `speechSynthesis.onvoiceschanged`
 * (replacing any prior handler). Parallel callers from the voice sheet +
 * `resolveReadingTtsTarget` therefore race and leave one Promise pending with
 * an empty UI. Cache one shared load instead.
 */
let voicesCache: TtsVoice[] | null = null;
let voicesLoad: Promise<TtsVoice[]> | null = null;

/** Clears the installed-voice cache (tests only). */
export function resetTtsVoicesCache(): void {
  voicesCache = null;
  voicesLoad = null;
}

function mapSpeechVoices(
  voices: ReadonlyArray<{ identifier: string; name: string; language: string }>,
): TtsVoice[] {
  return voices.map((v) => ({
    identifier: v.identifier,
    name: v.name,
    language: v.language,
  }));
}

function loadWebSpeechVoices(): Promise<TtsVoice[]> {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    return Promise.resolve([]);
  }
  const synth = window.speechSynthesis;
  const read = (): TtsVoice[] =>
    synth.getVoices().map((voice) => ({
      identifier: voice.voiceURI,
      name: voice.name,
      language: voice.lang,
    }));

  const immediate = read();
  if (immediate.length > 0) return Promise.resolve(immediate);

  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      synth.removeEventListener("voiceschanged", onChange);
      resolve(read());
    };
    const onChange = () => finish();
    synth.addEventListener("voiceschanged", onChange);
    // Chrome populates voices asynchronously; calling getVoices() kicks the load.
    void synth.getVoices();
    setTimeout(finish, 1000);
  });
}

async function loadAllTtsVoices(): Promise<TtsVoice[]> {
  if (voicesCache) return voicesCache;
  if (voicesLoad) return voicesLoad;

  voicesLoad = (async () => {
    try {
      if (Platform.OS === "web") {
        const webVoices = await loadWebSpeechVoices();
        if (webVoices.length > 0) {
          voicesCache = webVoices;
          return webVoices;
        }
      }
      const voices = await Speech.getAvailableVoicesAsync();
      const mapped = mapSpeechVoices(voices);
      voicesCache = mapped;
      return mapped;
    } catch {
      return voicesCache ?? [];
    } finally {
      voicesLoad = null;
    }
  })();

  return voicesLoad;
}

/** List installed voices, optionally filtered by language (e.g. "en", "en-US", "ur"). */
export async function getTtsVoices(langPrefix?: string): Promise<TtsVoice[]> {
  try {
    const mapped = await loadAllTtsVoices();
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
 * Prefers an exact/preferred identifier when still installed (any language),
 * so a sheet fallback voice still sticks when speaking another locale's text.
 */
export async function resolveTtsVoice(
  lang: string,
  preferredId?: string | null,
): Promise<string | undefined> {
  if (preferredId) {
    const all = await getTtsVoices();
    if (all.some((v) => v.identifier === preferredId)) return preferredId;
  }
  const voices = await getTtsVoices(lang);
  return voices[0]?.identifier;
}

export type ReadingTtsTarget = {
  text: string;
  lang: string;
};

/**
 * Choose speakable text + language for a reading card (custom adhkar, etc.).
 * Prefers Arabic when an Arabic TTS voice is installed; otherwise falls back to
 * transliteration/translation using the UI locale so web browsers without `ar`
 * voices still show a usable voice list (same idea as learn listen).
 */
export async function resolveReadingTtsTarget(options: {
  arabic?: string | null;
  transliteration?: string | null;
  translation?: string | null;
  /** BCP-47 tag from the UI locale (e.g. en-US). */
  fallbackLang: string;
}): Promise<ReadingTtsTarget | null> {
  const arabic = options.arabic?.trim() ?? "";
  const transliteration = options.transliteration?.trim() ?? "";
  const translation = options.translation?.trim() ?? "";
  const fallbackLang = options.fallbackLang.trim() || "en-US";

  if (arabic) {
    const arabicVoices = await getTtsVoices("ar");
    if (arabicVoices.length > 0) {
      return { text: arabic, lang: "ar" };
    }
  }

  if (transliteration) {
    return { text: transliteration, lang: fallbackLang };
  }
  if (translation) {
    return { text: translation, lang: fallbackLang };
  }
  if (arabic) {
    // No Arabic voices and no romanized/translated copy — still allow listen
    // using the UI language's voices (browser will use the selected voice id).
    return { text: arabic, lang: fallbackLang };
  }
  return null;
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
