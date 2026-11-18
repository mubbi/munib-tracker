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
  canPauseTts,
  chunkTextForTts,
  getTtsVoices,
  isTtsAvailable,
  pauseTts,
  playerRateToSpeechRate,
  resetTtsVoicesCache,
  resolveReadingTtsTarget,
  resolveTtsVoice,
  resumeTts,
  speak,
  speakLong,
  stopTts,
  TTS_CHUNK_MAX_CHARS,
} from "@/lib/tts";
import { installBrowser } from "@/test-support/browser";
import { usePlatform } from "@/test-support/platform";

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

const speech = jest.mocked(Speech);

/** Make `Speech.speak` finish through the given expo-speech callback. */
function speakEndsWith(callback: "onDone" | "onStopped" | "onError") {
  speech.speak.mockImplementation((_text, options) => {
    options?.[callback]?.();
  });
}

/** Fake `window.speechSynthesis` whose voices appear after `voiceschanged`. */
function fakeSynth(initial: { voiceURI: string; name: string; lang: string }[] = []) {
  let voices = initial;
  const listeners = new Set<() => void>();
  const synth = {
    getVoices: jest.fn(() => voices),
    addEventListener: jest.fn((_event: string, cb: () => void) => listeners.add(cb)),
    removeEventListener: jest.fn((_event: string, cb: () => void) => listeners.delete(cb)),
    publish(next: typeof voices) {
      voices = next;
      for (const cb of [...listeners]) cb();
    },
  };
  return synth;
}

const NATIVE_VOICES = [
  { identifier: "en-US-x", name: "English", language: "en-US" },
  { identifier: "ur-PK-x", name: "Urdu", language: "ur-PK" },
];

const WEB_VOICE = { voiceURI: "Google Arabic", name: "Arabic", lang: "ar-SA" };

describe("tts platform behaviour", () => {
  beforeEach(() => {
    resetTtsVoicesCache();
    jest.clearAllMocks();
    speakEndsWith("onDone");
    speech.getAvailableVoicesAsync.mockResolvedValue([
      { identifier: "en-US-x", name: "English", language: "en-US" } as never,
    ]);
  });

  describe.each([
    ["ios", 0.5, true],
    ["android", 1, false],
    ["web", 1, true],
  ] as const)("on %s", (OS, normalRate, pausable) => {
    usePlatform({ OS });

    it("maps and clamps the player rate", () => {
      expect(playerRateToSpeechRate(1)).toBe(normalRate);
      expect(playerRateToSpeechRate(10)).toBe(2 * normalRate);
      expect(playerRateToSpeechRate(0.1)).toBe(0.5 * normalRate);
    });

    it("reports whether TTS can pause", () => {
      expect(canPauseTts()).toBe(pausable);
    });

    it("pauses and resumes only when supported", async () => {
      await pauseTts();
      await resumeTts();
      expect(speech.pause).toHaveBeenCalledTimes(pausable ? 1 : 0);
      expect(speech.resume).toHaveBeenCalledTimes(pausable ? 1 : 0);
    });

    it("defaults the speech rate for the platform", async () => {
      await speak("Hello", { lang: "en-US" });
      expect(speech.speak).toHaveBeenCalledWith(
        "Hello",
        expect.objectContaining({ language: "en-US", rate: normalRate }),
      );
    });
  });

  it("swallows pause/resume failures", async () => {
    speech.pause.mockRejectedValueOnce(new Error("x"));
    speech.resume.mockRejectedValueOnce(new Error("x"));
    await expect(pauseTts()).resolves.toBeUndefined();
    await expect(resumeTts()).resolves.toBeUndefined();
  });
});

describe("tts voices", () => {
  beforeEach(() => {
    resetTtsVoicesCache();
    jest.clearAllMocks();
    speech.getAvailableVoicesAsync.mockResolvedValue(NATIVE_VOICES as never);
  });

  it("reports availability when voices load", async () => {
    speech.getAvailableVoicesAsync.mockResolvedValueOnce([]);
    await expect(isTtsAvailable()).resolves.toBe(true);
  });

  it("returns an empty list when the native voice query fails", async () => {
    speech.getAvailableVoicesAsync.mockRejectedValueOnce(new Error("no engine"));
    await expect(getTtsVoices()).resolves.toEqual([]);
  });

  it("shares one in-flight voice load and caches the result", async () => {
    await Promise.all([getTtsVoices(), getTtsVoices("en")]);
    await getTtsVoices();
    expect(speech.getAvailableVoicesAsync).toHaveBeenCalledTimes(1);
  });

  it("falls back to the first voice for the language when the preferred id is gone", async () => {
    await expect(resolveTtsVoice("ur", "missing")).resolves.toBe("ur-PK-x");
  });

  it("returns undefined when no voice matches", async () => {
    await expect(resolveTtsVoice("ar")).resolves.toBeUndefined();
  });

  describe("on web", () => {
    usePlatform({ OS: "web" });

    it("reads speechSynthesis voices immediately when present", async () => {
      const restore = installBrowser({ window: { speechSynthesis: fakeSynth([WEB_VOICE]) } });
      try {
        await expect(getTtsVoices("ar")).resolves.toEqual([
          { identifier: "Google Arabic", name: "Arabic", language: "ar-SA" },
        ]);
        expect(speech.getAvailableVoicesAsync).not.toHaveBeenCalled();
      } finally {
        restore();
      }
    });

    it("waits for voiceschanged when voices load asynchronously", async () => {
      const synth = fakeSynth();
      const restore = installBrowser({ window: { speechSynthesis: synth } });
      try {
        const pending = getTtsVoices();
        await Promise.resolve();
        synth.publish([WEB_VOICE]);
        await expect(pending).resolves.toHaveLength(1);
        expect(synth.removeEventListener).toHaveBeenCalled();
      } finally {
        restore();
      }
    });

    it("gives up after a second and falls back to expo-speech voices", async () => {
      jest.useFakeTimers();
      const restore = installBrowser({ window: { speechSynthesis: fakeSynth() } });
      try {
        const pending = getTtsVoices();
        await jest.advanceTimersByTimeAsync(1000);
        await expect(pending).resolves.toEqual(NATIVE_VOICES);
      } finally {
        restore();
        jest.useRealTimers();
      }
    });

    it("uses expo-speech voices when speechSynthesis is missing", async () => {
      const restore = installBrowser({ window: { speechSynthesis: undefined } });
      try {
        await expect(getTtsVoices("ur")).resolves.toHaveLength(1);
      } finally {
        restore();
      }
    });
  });
});

describe("resolveReadingTtsTarget fallbacks", () => {
  beforeEach(() => resetTtsVoicesCache());

  it.each([
    [
      { translation: " Meaning ", fallbackLang: "ur-PK" },
      { text: "Meaning", lang: "ur-PK" },
    ],
    [
      { arabic: "بسم الله", fallbackLang: "  " },
      { text: "بسم الله", lang: "en-US" },
    ],
    [{ arabic: "  ", transliteration: null, fallbackLang: "en-US" }, null],
  ])("%p → %p", async (input, expected) => {
    await expect(resolveReadingTtsTarget(input)).resolves.toEqual(expected);
  });
});

describe("chunkTextForTts edge cases", () => {
  it("returns no chunks for blank text", () => {
    expect(chunkTextForTts("  \n ")).toEqual([]);
  });

  it("collapses whitespace in short text", () => {
    expect(chunkTextForTts("a \n  b")).toEqual(["a b"]);
  });

  it("hard-cuts text with no early break point", () => {
    expect(chunkTextForTts("abcdefghij", 4)).toEqual(["abcd", "efgh", "ij"]);
  });

  it("prefers a sentence boundary past 40% of the window", () => {
    expect(chunkTextForTts("One two. Three four five", 12)).toEqual([
      "One two.",
      "Three four",
      "five",
    ]);
  });
});

describe("speak callbacks", () => {
  beforeEach(() => jest.clearAllMocks());

  it("calls onDone immediately for empty text without speaking", async () => {
    const onDone = jest.fn();
    await speak("   ", { lang: "en", onDone });
    expect(onDone).toHaveBeenCalledTimes(1);
    expect(speech.speak).not.toHaveBeenCalled();
  });

  it.each([
    ["onDone", "onDone"],
    ["onStopped", "onDone"],
    ["onError", "onError"],
  ] as const)("resolves and forwards %s to %s", async (event, handler) => {
    speakEndsWith(event);
    const callbacks = { onDone: jest.fn(), onError: jest.fn() };
    await speak("Hi", { lang: "en", ...callbacks });
    expect(callbacks[handler]).toHaveBeenCalledTimes(1);
  });

  it("reports onError when stopping the previous utterance throws", async () => {
    speech.stop.mockRejectedValueOnce(new Error("busy"));
    const onError = jest.fn();
    await speak("Hi", { lang: "en", onError });
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it("does not stop the previous utterance when continuing a chain", async () => {
    speakEndsWith("onDone");
    await speak("Hi", { lang: "en", continueFromPrevious: true, voice: "v", rate: 0.7 });
    expect(speech.stop).not.toHaveBeenCalled();
    expect(speech.speak).toHaveBeenCalledWith(
      "Hi",
      expect.objectContaining({ voice: "v", rate: 0.7 }),
    );
  });

  it("stopTts ignores stop failures", async () => {
    speech.stop.mockRejectedValueOnce(new Error("x"));
    await expect(stopTts()).resolves.toBeUndefined();
  });
});

describe("speakLong", () => {
  const LONG = `${"A sentence that repeats for chunking. ".repeat(200)}`;

  beforeEach(() => jest.clearAllMocks());

  it("calls onDone immediately for blank text", async () => {
    const onDone = jest.fn();
    await speakLong(" ", { lang: "en", onDone });
    expect(onDone).toHaveBeenCalledTimes(1);
    expect(speech.speak).not.toHaveBeenCalled();
  });

  it("stops after the first chunk that errors", async () => {
    speakEndsWith("onError");
    const callbacks = { onDone: jest.fn(), onError: jest.fn() };
    await speakLong(LONG, { lang: "en", ...callbacks });
    expect(speech.speak).toHaveBeenCalledTimes(1);
    expect(callbacks.onError).toHaveBeenCalledTimes(1);
    expect(callbacks.onDone).toHaveBeenCalledTimes(1);
  });

  it("cancels the remaining chunks and skips onDone when stopped mid-way", async () => {
    speech.speak.mockImplementation((_text, options) => {
      void stopTts().then(() => options?.onDone?.());
    });
    const onDone = jest.fn();
    await speakLong(LONG, { lang: "en", onDone });
    expect(speech.speak).toHaveBeenCalledTimes(1);
    expect(onDone).not.toHaveBeenCalled();
  });
});
