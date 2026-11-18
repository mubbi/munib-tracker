import { act, renderHook } from "@testing-library/react-native";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";

import { PRACTICE_KEEP_AWAKE_TAG, usePracticeSession } from "@/hooks/use-practice-session";
import { restorePlaybackMode } from "@/lib/quran-companion/audio/audio-mode";
import { reportPracticeError } from "@/lib/quran-companion/error-codes";
import type { PracticeMode, SessionMode } from "@/lib/quran-companion/types";
import { captureAppStateListener } from "@/test-support/app-state";
import { deferred } from "@/test-support/async";
import { buildRecitationManifest } from "@/test-support/fixtures/quran-companion";
import {
  mockAudioPlayer as mockAudio,
  mockAudioProgress,
  resetAudioPlayerMock,
} from "@/test-support/mocks/audio-player-provider";
import { setPlatform } from "@/test-support/platform";

jest.mock("expo-keep-awake", () => ({
  activateKeepAwakeAsync: jest.fn(async () => undefined),
  deactivateKeepAwake: jest.fn(async () => undefined),
}));

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);

jest.mock("@/lib/haptics", () => require("@/test-support/mocks/haptics").hapticsMock);
jest.mock("@/lib/quran-companion/audio/audio-mode", () => ({
  enterRecordMode: jest.fn(async () => undefined),
  restorePlaybackMode: jest.fn(async () => undefined),
}));
jest.mock("@/lib/quran-companion/audio/capture", () => ({
  useRecitationCapture: () => mockCapture,
}));
jest.mock("@/lib/quran-companion/align-words", () => {
  const actual = jest.requireActual("@/lib/quran-companion/align-words");
  return {
    ...actual,
    alignPracticeWords: (_arabic: string, words: string[]) =>
      actual.identityAlignment(words.length),
  };
});
jest.mock("@/lib/quran-companion/error-codes", () => ({
  ...jest.requireActual("@/lib/quran-companion/error-codes"),
  reportPracticeError: jest.fn(),
}));
jest.mock("@/hooks/use-quran", () => ({
  useAyahWordSegments: () => ({ data: mockSegments }),
}));
jest.mock("./use-practice-ayah-text", () => ({
  usePracticeAyahText: () => mockAyahText,
}));
jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);
jest.mock("@/stores/create-store", () => ({
  useStore: (_store: unknown, selector: (s: unknown) => unknown) =>
    selector({ isReady: mockListenerLoaded }),
}));
jest.mock("@/stores/quran-companion-prefs-store", () => ({
  quranCompanionPrefsStore: { getState: () => ({ update: mockPrefsUpdate }) },
  useCompanionPrefs: () => mockPrefs,
}));
jest.mock("@/stores/quran-listener-store", () => ({
  loadInstalledModel: () => mockLoadInstalledModel(),
  quranListenerStore: {},
  useListenerState: () => mockListener,
}));
jest.mock("@/stores/quran-memorization-store", () => ({
  quranMemorizationStore: { getState: () => ({ applyOutcomes: mockApplyOutcomes }) },
}));
jest.mock("@/stores/quran-practice-store", () => ({
  quranPracticeStore: { getState: () => ({ addSummary: mockAddSummary }) },
}));
jest.mock("@/stores/quran-store", () => ({
  useQuranPrefs: () => ({ preferredReciterDir: "Alafasy_128kbps" }),
}));

type Row = {
  ayah: number;
  arabic: string;
  translation: string;
  transliteration: string;
  words: string[];
  wordAudio: (string | undefined)[];
  fallbackWords: boolean;
};

function makeRow(ayah: number, words: string[]): Row {
  return {
    ayah,
    arabic: words.join(" "),
    translation: "",
    transliteration: "",
    words,
    wordAudio: words.map((_, i) => (i === 0 ? `https://audio/${ayah}/${i}.mp3` : undefined)),
    fallbackWords: false,
  };
}

const ROWS: Record<number, Row> = {
  1: makeRow(1, ["a", "b", "c"]),
  2: makeRow(2, ["d", "e"]),
  3: makeRow(3, ["f", "g", "h", "i"]),
};

type CaptureMock = {
  available: boolean;
  getPermission: jest.Mock;
  requestPermission: jest.Mock;
  start: jest.Mock;
  stop: jest.Mock;
  onChunk?: (pcm: Float32Array) => void;
  onStatus?: (status: { interrupted?: boolean }) => void;
};

function makeCapture(): CaptureMock {
  const capture: CaptureMock = {
    available: true,
    getPermission: jest.fn(async () => "granted"),
    requestPermission: jest.fn(async () => "granted"),
    start: jest.fn(async (onChunk, onStatus) => {
      capture.onChunk = onChunk;
      capture.onStatus = onStatus;
    }),
    stop: jest.fn(async () => undefined),
  };
  return capture;
}

let mockCapture: CaptureMock | null;
let mockLoadInstalledModel: jest.Mock;
let mockListenerLoaded: boolean;
let mockListener: { status: string; manifest: unknown };
let mockSegments: Array<[number, number, number]> | null;
let mockAyahText: {
  rows: Record<number, Row>;
  wordsLoading: boolean;
  surahWordCounts: Record<number, number> | null;
};
let mockPrefs: {
  defaultMode: PracticeMode;
  feedbackTiming: "ayah" | "live" | "end";
  hearBeforeRecite: "off" | "once" | "every-ayah";
  autoAdvance: boolean;
  keepAwake: boolean;
  coachDismissed: boolean;
};
const mockPrefsUpdate = jest.fn(async () => undefined);
const mockApplyOutcomes = jest.fn(async () => undefined);
const mockAddSummary = jest.fn(async () => undefined);

let restorePlatform: () => void = () => {};
const appState = captureAppStateListener();
const PASSAGE = { surah: 1, ayahStart: 1, ayahEnd: 3 };

async function flush() {
  await act(async () => {
    await Promise.resolve();
  });
}

async function setup(mode: SessionMode = "follow") {
  const hook = await renderHook(() =>
    usePracticeSession({ passage: PASSAGE, mode, language: "en", surahName: "Al-Fatiha" }),
  );
  await flush();
  await flush();
  return hook;
}

type Hook = Awaited<ReturnType<typeof setup>>;

async function startTake(hook: Hook) {
  await act(async () => {
    await hook.result.current.toggleMic();
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  mockCapture = makeCapture();
  mockLoadInstalledModel = jest.fn(async () => ({
    manifest: buildRecitationManifest(),
    assets: {},
  }));
  mockListenerLoaded = true;
  mockListener = { status: "ready", manifest: buildRecitationManifest() };
  mockSegments = null;
  mockAyahText = { rows: ROWS, wordsLoading: false, surahWordCounts: { 1: 3 } };
  resetAudioPlayerMock();
  mockAudio.duration = 6;
  mockPrefs = {
    defaultMode: "follow",
    feedbackTiming: "live",
    hearBeforeRecite: "off",
    autoAdvance: false,
    keepAwake: false,
    coachDismissed: false,
  };
});

afterEach(() => {
  jest.useRealTimers();
  restorePlatform();
  restorePlatform = () => {};
});

describe("usePracticeSession — engine", () => {
  it("fails over when the engine bundle cannot be imported under Jest", async () => {
    // The engine is loaded through a dynamic `import()`, which Jest cannot run
    // without --experimental-vm-modules, so init always ends in "failed" here.
    const hook = await setup();
    const { result } = hook;

    expect(mockLoadInstalledModel).toHaveBeenCalled();
    expect(result.current.engineStatus).toBe("failed");
    expect(result.current.engineError).toBe("engine-init-failed");
    expect(result.current.confirmsMismatches).toBe(false);
    expect(result.current.ayahs).toEqual([1, 2, 3]);
    expect(result.current.ayah).toBe(1);
    expect(result.current.row).toBe(ROWS[1]);
    expect(result.current.surahWordCounts).toEqual({ 1: 3 });
    expect(result.current.session.ayahs[1].alignment).toBeNull();
    expect(result.current.session.ayahs[2].words).toEqual(["d", "e"]);
    expect(result.current.micPermission).toBe("granted");

    // No engine → the mic stays off.
    await startTake(hook);
    expect(result.current.mic).toBe("idle");
    expect(mockCapture?.start).not.toHaveBeenCalled();
    await hook.unmount();
  });

  it("stays listen-only when the listener is not usable", async () => {
    mockListener = { status: "missing", manifest: null };
    const hook = await setup();
    expect(hook.result.current.engineStatus).toBe("listen-only");
    expect(hook.result.current.confirmsMismatches).toBe(false);
    expect(hook.result.current.session.ayahs[1].alignment).toBeNull();
    expect(hook.result.current.session.ayahs[1].states).toEqual(["idle", "idle", "idle"]);
    expect(mockLoadInstalledModel).not.toHaveBeenCalled();

    // Mic is unavailable without an engine.
    await startTake(hook);
    expect(hook.result.current.mic).toBe("idle");
    expect(mockCapture?.start).not.toHaveBeenCalled();
    await hook.unmount();
  });

  it("stays listen-only on TV even before the listener store loads", async () => {
    restorePlatform = setPlatform({ isTV: true });
    mockListenerLoaded = false;
    const hook = await setup();
    expect(hook.result.current.engineStatus).toBe("listen-only");
    await hook.unmount();
  });

  it("stays loading until the listener store has read its manifest", async () => {
    mockListenerLoaded = false;
    const hook = await setup();
    expect(hook.result.current.engineStatus).toBe("loading");
    expect(mockLoadInstalledModel).not.toHaveBeenCalled();
    await hook.unmount();
  });

  it("is listen-only when the capture is unavailable", async () => {
    mockCapture = { ...makeCapture(), available: false };
    const hook = await setup();
    expect(hook.result.current.engineStatus).toBe("listen-only");
    await hook.unmount();
  });

  it("is listen-only when there is no capture at all", async () => {
    mockCapture = null;
    const hook = await setup();
    expect(hook.result.current.engineStatus).toBe("listen-only");
    expect(hook.result.current.micPermission).toBeNull();
    await hook.unmount();
  });

  it("reports a failed engine init", async () => {
    mockLoadInstalledModel.mockRejectedValueOnce(new Error("out of memory"));
    const hook = await setup();
    expect(hook.result.current.engineStatus).toBe("failed");
    expect(hook.result.current.engineError).toBe("out-of-memory");
    expect(reportPracticeError).toHaveBeenCalledWith(
      expect.any(Error),
      "out-of-memory",
      "session-init",
    );
    await hook.unmount();
  });

  it("ignores a failed init that lands after unmount", async () => {
    const load = deferred<never>();
    mockLoadInstalledModel.mockReturnValueOnce(load.promise);
    const hook = await renderHook(() =>
      usePracticeSession({ passage: PASSAGE, mode: "follow", language: "en", surahName: "X" }),
    );
    await hook.unmount();
    await act(async () => {
      load.reject(new Error("boom"));
    });
    expect(reportPracticeError).not.toHaveBeenCalled();
  });

  it("releases the capture and restores playback on unmount", async () => {
    const hook = await setup();
    await hook.unmount();
    await flush();
    expect(mockCapture?.stop).toHaveBeenCalled();
    expect(restorePlaybackMode).toHaveBeenCalled();
  });

  it("keeps tearing down when releasing the recorder fails", async () => {
    const unhandled = jest.fn();
    process.on("unhandledRejection", unhandled);
    try {
      const hook = await setup();
      mockCapture?.stop.mockRejectedValueOnce(new Error("recorder busy"));
      jest.mocked(restorePlaybackMode).mockRejectedValueOnce(new Error("audio session"));
      await hook.unmount();
      await flush();
      await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
      expect(restorePlaybackMode).toHaveBeenCalled();
      expect(unhandled).not.toHaveBeenCalled();
    } finally {
      process.off("unhandledRejection", unhandled);
    }
  });
});

describe("usePracticeSession — lifecycle", () => {
  it("ignores app-state changes while the mic is idle", async () => {
    const hook = await setup();
    await act(async () => {
      appState.emit("active");
      appState.emit("background");
    });
    expect(hook.result.current.mic).toBe("idle");
    expect(mockCapture?.stop).not.toHaveBeenCalled();
    await hook.unmount();
    expect(appState.spy.mock.results.at(-1)?.value.remove).toHaveBeenCalled();
  });
});
describe("usePracticeSession — hide modes", () => {
  it("hides all but the first word in Hide words and reveals progressively", async () => {
    const hook = await setup("hide-words");
    const { result } = hook;
    expect(result.current.displayMode).toBe("hide-words");
    expect([...result.current.hidden]).toEqual([1, 2]);
    expect(result.current.hiddenOf(1)).toBe(result.current.hidden);
    expect([...result.current.hiddenOf(3)]).toEqual([1, 2, 3]);

    await act(async () => {
      result.current.revealNext();
    });
    expect([...result.current.hidden]).toEqual([2]);
    await act(async () => {
      result.current.revealNext();
    });
    await act(async () => {
      result.current.revealNext();
    });
    expect([...result.current.hidden]).toEqual([]);

    // Retry restores the initial cue.
    await act(async () => {
      result.current.retry();
    });
    expect([...result.current.hidden]).toEqual([1, 2]);
    await act(async () => {
      result.current.revealAll();
    });
    expect(result.current.hidden.size).toBe(0);
    await hook.unmount();
  });

  it("hides the whole ayah in Hide ayahs and reveals it at once", async () => {
    const hook = await setup("hide-ayahs");
    const { result } = hook;
    expect([...result.current.hidden]).toEqual([0, 1, 2]);
    expect([...result.current.hiddenOf(2)]).toEqual([0, 1]);

    await act(async () => {
      result.current.revealNext();
    });
    expect(result.current.hidden.size).toBe(0);
    // Remembered per ayah: other ayahs stay hidden.
    expect(result.current.hiddenOf(3).size).toBe(4);
    await act(async () => {
      result.current.next();
    });
    expect(result.current.hidden.size).toBe(2);
    expect(result.current.hiddenOf(1).size).toBe(0);
    await hook.unmount();
  });
  it("shows nothing hidden in Follow", async () => {
    const hook = await setup("follow");
    expect(hook.result.current.hidden.size).toBe(0);
    expect(hook.result.current.hiddenOf(2).size).toBe(0);
    await hook.unmount();
  });

  it("resolves revision to Hide ayahs when the default is Follow", async () => {
    const hook = await setup("revision");
    expect(hook.result.current.displayMode).toBe("hide-ayahs");
    await hook.unmount();
  });

  it("resolves revision to the chosen default mode", async () => {
    mockPrefs.defaultMode = "check";
    const hook = await setup("revision");
    expect(hook.result.current.displayMode).toBe("check");
    await hook.unmount();
  });
});

describe("usePracticeSession — text loading", () => {
  it("holds rows until the study words arrive or the wait passes", async () => {
    jest.useFakeTimers();
    mockAyahText = { rows: ROWS, wordsLoading: true, surahWordCounts: null };
    const hook = await renderHook(() =>
      usePracticeSession({ passage: PASSAGE, mode: "hide-words", language: "en", surahName: "X" }),
    );
    expect(hook.result.current.rows).toEqual({});
    expect(hook.result.current.row).toBeUndefined();
    expect(hook.result.current.wordsLoading).toBe(true);
    expect(hook.result.current.hidden.size).toBe(0);
    expect(hook.result.current.hiddenOf(2).size).toBe(0);
    await act(async () => {
      jest.advanceTimersByTime(1600);
    });
    expect(hook.result.current.rows).toBe(ROWS);
    await hook.unmount();
  });

  it("falls back to the passage start when no ayahs are in range", async () => {
    const hook = await renderHook(() =>
      usePracticeSession({
        passage: { surah: 1, ayahStart: 5, ayahEnd: 4 },
        mode: "follow",
        language: "en",
        surahName: "X",
      }),
    );
    await flush();
    expect(hook.result.current.ayahs).toEqual([]);
    expect(hook.result.current.ayah).toBe(5);
    await hook.unmount();
  });
});

describe("usePracticeSession — navigation", () => {
  it("moves within the range and clamps", async () => {
    const hook = await setup();
    const { result } = hook;
    await act(async () => {
      result.current.previous();
    });
    expect(result.current.index).toBe(0);
    await act(async () => {
      result.current.next();
    });
    expect(result.current.ayah).toBe(2);
    await act(async () => {
      result.current.goTo(99);
    });
    expect(result.current.index).toBe(2);
    await act(async () => {
      result.current.previous();
    });
    expect(result.current.ayah).toBe(2);
    await hook.unmount();
  });
});

describe("usePracticeSession — hear", () => {
  it("plays the reference ayah, then stops it when already hearing", async () => {
    const hook = await setup();
    await act(async () => {
      await hook.result.current.hear();
    });
    expect(mockAudio.play).toHaveBeenCalledWith(
      [expect.objectContaining({ id: "1:1", title: "Al-Fatiha" })],
      0,
      { sourceHref: "/quran/1?ayah=1" },
    );

    mockAudio.isPlaying = true;
    mockAudio.current = { id: "1:1" };
    mockSegments = [
      [1, 0, 1000],
      [2, 1000, 2000],
      [3, 2000, 3000],
    ];
    mockAudioProgress.position = 1.5;
    await hook.rerender({});
    expect(hook.result.current.isHearing).toBe(true);
    expect(hook.result.current.hearWordIndex).toBe(1);

    await act(async () => {
      await hook.result.current.hear();
    });
    expect(mockAudio.stop).toHaveBeenCalled();
    await hook.unmount();
  });

  it("plays cached word audio, else the whole ayah", async () => {
    const hook = await setup();
    await act(async () => {
      await hook.result.current.hearWord(0);
    });
    expect(mockAudio.play).toHaveBeenLastCalledWith(
      [
        {
          id: "word:1:1:0",
          title: "Al-Fatiha",
          subtitle: "a",
          uri: "https://audio/1/0.mp3",
        },
      ],
      0,
    );
    await act(async () => {
      await hook.result.current.hearWord(2);
    });
    expect(mockAudio.play).toHaveBeenLastCalledWith([expect.objectContaining({ id: "1:1" })], 0);
    await hook.unmount();
  });

  it("hears before reciting once", async () => {
    mockPrefs.hearBeforeRecite = "once";
    const hook = await setup();
    expect(mockAudio.play).toHaveBeenCalledTimes(1);
    await act(async () => {
      hook.result.current.next();
    });
    await flush();
    expect(mockAudio.play).toHaveBeenCalledTimes(1);
    await hook.unmount();
  });

  it("hears before reciting every ayah", async () => {
    mockPrefs.hearBeforeRecite = "every-ayah";
    const hook = await setup();
    expect(mockAudio.play).toHaveBeenCalledTimes(1);
    await act(async () => {
      hook.result.current.next();
    });
    await flush();
    expect(mockAudio.play).toHaveBeenCalledTimes(2);
    await hook.unmount();
  });
});

describe("usePracticeSession — keep awake", () => {
  it("keeps the screen awake while focused and releases it on blur", async () => {
    mockPrefs.keepAwake = true;
    const hook = await setup();
    expect(activateKeepAwakeAsync).toHaveBeenCalledWith(PRACTICE_KEEP_AWAKE_TAG);
    await hook.unmount();
    expect(deactivateKeepAwake).toHaveBeenCalledWith(PRACTICE_KEEP_AWAKE_TAG);
  });

  it("swallows a keep-awake failure", async () => {
    mockPrefs.keepAwake = true;
    (activateKeepAwakeAsync as jest.Mock).mockRejectedValueOnce(new Error("nope"));
    const hook = await setup();
    expect(activateKeepAwakeAsync).toHaveBeenCalled();
    await hook.unmount();
  });

  it("does not keep awake on web", async () => {
    mockPrefs.keepAwake = true;
    restorePlatform = setPlatform({ OS: "web" });
    const hook = await setup();
    expect(activateKeepAwakeAsync).not.toHaveBeenCalled();
    await hook.unmount();
  });

  it("does not keep awake on TV", async () => {
    mockPrefs.keepAwake = true;
    restorePlatform = setPlatform({ isTV: true });
    const hook = await setup();
    expect(activateKeepAwakeAsync).not.toHaveBeenCalled();
    await hook.unmount();
  });
});

describe("usePracticeSession — finish", () => {
  it("saves a summary, outcomes and the last passage", async () => {
    const hook = await setup("check");
    let summary: Awaited<ReturnType<typeof hook.result.current.finish>> | undefined;
    await act(async () => {
      summary = await hook.result.current.finish();
    });
    expect(summary).toEqual(
      expect.objectContaining({
        mode: "check",
        surah: 1,
        ayahStart: 1,
        ayahEnd: 3,
        engine: "none",
      }),
    );
    expect(mockAddSummary).toHaveBeenCalledWith(summary);
    expect(mockApplyOutcomes).toHaveBeenCalledWith([]);
    expect(mockPrefsUpdate).toHaveBeenCalledWith({
      lastPassage: { ...PASSAGE, mode: "check" },
      coachDismissed: true,
    });
    expect(mockAudio.stop).toHaveBeenCalled();
    await hook.unmount();
  });

  it("records a listen-only revision and dismisses the coach", async () => {
    mockListener = { status: "missing", manifest: null };
    const hook = await setup("revision");
    let summary: Awaited<ReturnType<typeof hook.result.current.finish>> | undefined;
    await act(async () => {
      summary = await hook.result.current.finish();
    });
    expect(summary?.engine).toBe("none");
    expect(summary?.engineVersion).toBe("");
    expect(summary?.mismatchesUnconfirmed).toBe(true);
    expect(mockApplyOutcomes).toHaveBeenCalledWith([]);
    expect(mockPrefsUpdate).toHaveBeenCalledWith({ coachDismissed: true });
    await hook.unmount();
  });

  it("leaves the coach alone in revision once dismissed", async () => {
    mockPrefs.coachDismissed = true;
    const hook = await setup("revision");
    await act(async () => {
      await hook.result.current.finish();
    });
    expect(mockPrefsUpdate).not.toHaveBeenCalled();
    await hook.unmount();
  });
});
