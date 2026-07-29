import { beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("expo-speech", () => ({
  speak: jest.fn((_text: string, options?: { onDone?: () => void }) => {
    options?.onDone?.();
  }),
  stop: jest.fn(async () => undefined),
  pause: jest.fn(async () => undefined),
  resume: jest.fn(async () => undefined),
  isSpeakingAsync: jest.fn(async () => false),
  getAvailableVoicesAsync: jest.fn(async () => [
    { identifier: "en-US-x", name: "English", language: "en-US" },
    { identifier: "ur-PK-x", name: "Urdu", language: "ur-PK" },
  ]),
}));

import * as Speech from "expo-speech";
import {
  chunkTextForTts,
  getTtsVoices,
  playerRateToSpeechRate,
  resetTtsVoicesCache,
  resolveReadingTtsTarget,
  resolveTtsVoice,
  speak,
  speakLong,
  stopTts,
  TTS_CHUNK_MAX_CHARS,
} from "@/lib/tts";

describe("tts", () => {
  beforeEach(() => {
    resetTtsVoicesCache();
    (Speech.getAvailableVoicesAsync as jest.Mock).mockResolvedValue([
      { identifier: "en-US-x", name: "English", language: "en-US" },
      { identifier: "ur-PK-x", name: "Urdu", language: "ur-PK" },
    ]);
  });
  it("speaks and resolves on done", async () => {
    await speak("In the name of Allah", { lang: "en-US" });
    expect(Speech.speak).toHaveBeenCalled();
  });

  it("filters voices by language prefix", async () => {
    const urdu = await getTtsVoices("ur");
    expect(urdu).toHaveLength(1);
    expect(urdu[0].language).toBe("ur-PK");
  });

  it("matches BCP-47 tags by primary subtag", async () => {
    const english = await getTtsVoices("en-US");
    expect(english).toHaveLength(1);
    expect(english[0].language).toBe("en-US");
  });

  it("resolves preferred voice when still installed", async () => {
    const id = await resolveTtsVoice("en", "en-US-x");
    expect(id).toBe("en-US-x");
  });

  it("keeps a preferred voice even when it is outside the language filter", async () => {
    const id = await resolveTtsVoice("ar", "en-US-x");
    expect(id).toBe("en-US-x");
  });

  it("prefers Arabic reading TTS when Arabic voices exist", async () => {
    (Speech.getAvailableVoicesAsync as jest.Mock).mockResolvedValueOnce([
      { identifier: "ar-SA-x", name: "Arabic", language: "ar-SA" },
      { identifier: "en-US-x", name: "English", language: "en-US" },
    ]);
    await expect(
      resolveReadingTtsTarget({
        arabic: "بسم الله",
        transliteration: "Bismillah",
        translation: "In the name of Allah",
        fallbackLang: "en-US",
      }),
    ).resolves.toEqual({ text: "بسم الله", lang: "ar" });
  });

  it("falls back to transliteration when no Arabic voices are installed", async () => {
    await expect(
      resolveReadingTtsTarget({
        arabic: "بسم الله",
        transliteration: "Bismillah",
        translation: "In the name of Allah",
        fallbackLang: "en-US",
      }),
    ).resolves.toEqual({ text: "Bismillah", lang: "en-US" });
  });

  it("stops speech", async () => {
    await stopTts();
    expect(Speech.stop).toHaveBeenCalled();
  });

  it("chunks long text under the platform limit", () => {
    const long = `${"Sentence one is a bit longer for chunking. ".repeat(120)}Tail sentence.`;
    expect(long.length).toBeGreaterThan(TTS_CHUNK_MAX_CHARS);
    const chunks = chunkTextForTts(long);
    expect(chunks.length).toBeGreaterThan(1);
    for (const chunk of chunks) {
      expect(chunk.length).toBeLessThanOrEqual(TTS_CHUNK_MAX_CHARS);
    }
  });

  it("speakLong chains chunks then finishes", async () => {
    (Speech.speak as jest.Mock).mockClear();
    const long = `${"Sentence one is a bit longer for chunking. ".repeat(120)}Tail.`;
    await speakLong(long, { lang: "en-US" });
    expect((Speech.speak as jest.Mock).mock.calls.length).toBeGreaterThan(1);
  });

  it("maps mini-player rate onto the speech rate scale", () => {
    expect(playerRateToSpeechRate(1)).toBeGreaterThan(0);
    expect(playerRateToSpeechRate(2)).toBeGreaterThan(playerRateToSpeechRate(1));
  });
});
