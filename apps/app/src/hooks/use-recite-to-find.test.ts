import { act, renderHook } from "@testing-library/react-native";

import {
  chunkLevel,
  RECITE_MAX_LISTEN_MS,
  RECITE_SETTLE_MS,
  type ReciteEngineFactory,
  useReciteToFind,
} from "@/hooks/use-recite-to-find";
import { enterRecordMode, restorePlaybackMode } from "@/lib/quran-companion/audio/audio-mode";
import type { RecitationEngine } from "@/lib/quran-companion/engine/types";
import type { CompanionEvent } from "@/lib/quran-companion/types";
import { claimMicrophone, microphoneOwner } from "@/lib/speech/mic-owner";
import { captureAppStateListener } from "@/test-support/app-state";
import { buildRecitationManifest } from "@/test-support/fixtures/quran-companion";
import { setPlatform } from "@/test-support/platform";

jest.mock("@/lib/quran-companion/audio/audio-mode", () => ({
  enterRecordMode: jest.fn(async () => undefined),
  restorePlaybackMode: jest.fn(async () => undefined),
}));
jest.mock("@/lib/quran-companion/audio/capture", () => ({
  useRecitationCapture: () => mockCapture,
}));
jest.mock("@/lib/quran-companion/error-codes", () => ({
  ...jest.requireActual("@/lib/quran-companion/error-codes"),
  reportPracticeError: jest.fn(),
}));
jest.mock("@/stores/quran-listener-store", () => ({
  loadInstalledModel: () => mockLoadInstalledModel(),
  useListenerState: () => mockListener,
  useEnsureListenerLoaded: jest.fn(),
}));

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

type FakeEngine = RecitationEngine & {
  emit: (event: CompanionEvent) => void;
  fed: Float32Array[];
  start: jest.Mock;
  stop: jest.Mock;
  dispose: jest.Mock;
};

function makeEngine(stopEvents: CompanionEvent[] = []): FakeEngine {
  const listeners = new Set<(event: CompanionEvent) => void>();
  const emit = (event: CompanionEvent) => {
    for (const l of listeners) l(event);
  };
  const engine: FakeEngine = {
    id: "tilawa-zipformer",
    ready: true,
    confirmsMismatches: false,
    fed: [],
    emit,
    start: jest.fn(async () => emit({ type: "started" })),
    feed(pcm) {
      engine.fed.push(pcm);
    },
    stop: jest.fn(async () => {
      for (const e of stopEvents) emit(e);
      emit({ type: "completed" });
    }),
    dispose: jest.fn(async () => listeners.clear()),
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    engineWords: () => [],
  };
  return engine;
}

let mockCapture: CaptureMock;
let mockListener: { status: string; manifest: unknown };
let mockLoadInstalledModel: jest.Mock;
let engine: FakeEngine;
let createEngine: jest.Mock;
let restorePlatform: () => void = () => {};
const appState = captureAppStateListener();

const MATCH: CompanionEvent = { type: "verseMatch", surah: 2, ayah: 255, confidence: 0.9 };

async function flush() {
  await act(async () => {
    await Promise.resolve();
  });
}

async function setup(options: { enabled?: boolean } = {}) {
  const hook = await renderHook(() =>
    useReciteToFind({
      enabled: options.enabled,
      createEngine: createEngine as unknown as ReciteEngineFactory,
    }),
  );
  await flush();
  await flush();
  return hook;
}

type Hook = Awaited<ReturnType<typeof setup>>;

async function toggle(hook: Hook) {
  await act(async () => {
    await hook.result.current.toggle();
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  mockCapture = makeCapture();
  mockListener = { status: "ready", manifest: buildRecitationManifest() };
  mockLoadInstalledModel = jest.fn(async () => ({
    manifest: buildRecitationManifest(),
    assets: { json: {} },
  }));
  engine = makeEngine([
    { type: "verseSequence", verses: [{ surah: 2, ayah: 255, confidence: 1 }] },
  ]);
  createEngine = jest.fn(async () => engine);
});

afterEach(() => {
  jest.useRealTimers();
  restorePlatform();
  restorePlatform = () => {};
});

describe("useReciteToFind — engine", () => {
  it("loads the free-recitation engine for the installed listener", async () => {
    const hook = await setup();
    expect(createEngine).toHaveBeenCalledWith("tilawa-zipformer", { json: {} });
    expect(hook.result.current.engineStatus).toBe("ready");
    expect(hook.result.current.canListen).toBe(true);
    expect(hook.result.current.micPermission).toBe("granted");
    await hook.unmount();
    expect(engine.dispose).toHaveBeenCalled();
  });

  it("never loads without the listener, and the mic stays off", async () => {
    mockListener = { status: "not-downloaded", manifest: null };
    const hook = await setup();
    expect(mockLoadInstalledModel).not.toHaveBeenCalled();
    expect(hook.result.current.canListen).toBe(false);
    await toggle(hook);
    expect(mockCapture.start).not.toHaveBeenCalled();
    await hook.unmount();
  });

  it("never loads on TV", async () => {
    restorePlatform = setPlatform({ isTV: true });
    const hook = await setup();
    expect(createEngine).not.toHaveBeenCalled();
    expect(hook.result.current.engineStatus).toBe("idle");
    await hook.unmount();
  });

  it("reports an engine that fails to load", async () => {
    createEngine = jest.fn(async () => {
      throw new Error("bad graph");
    });
    const hook = await setup();
    expect(hook.result.current.engineStatus).toBe("failed");
    expect(hook.result.current.engineError).toBe("engine-init-failed");
    await hook.unmount();
  });
});

describe("useReciteToFind — a take", () => {
  it("claims the mic, streams audio, and lists what the engine heard", async () => {
    const hook = await setup();
    await toggle(hook);
    const { result } = hook;
    expect(microphoneOwner()).toBe("recite-to-find");
    expect(enterRecordMode).toHaveBeenCalled();
    expect(engine.start).toHaveBeenCalledWith({ surah: 1, ayahStart: 1, ayahEnd: 1 }, "tracking");
    expect(result.current.mic).toBe("listening");
    expect(result.current.state.status).toBe("listening");

    const pcm = new Float32Array(480).fill(0.1);
    await act(async () => {
      mockCapture.onChunk?.(pcm);
      engine.emit(MATCH);
    });
    // (The meter itself is covered by `chunkLevel`; the Jest Reanimated mock
    // hands out a new shared value per render, so it cannot be read back here.)
    expect(engine.fed).toEqual([pcm]);
    expect(result.current.state.candidates[0]).toMatchObject({ surah: 2, ayah: 255 });

    await toggle(hook);
    expect(mockCapture.stop).toHaveBeenCalled();
    expect(engine.stop).toHaveBeenCalled();
    expect(restorePlaybackMode).toHaveBeenCalled();
    expect(microphoneOwner()).toBeNull();
    expect(result.current.mic).toBe("idle");
    expect(result.current.state.status).toBe("found");
    await hook.unmount();
  });

  it("ends as nothing when no ayah was heard, and reset clears it", async () => {
    engine = makeEngine();
    const hook = await setup();
    await toggle(hook);
    await toggle(hook);
    expect(hook.result.current.state.status).toBe("nothing");
    await act(async () => hook.result.current.reset());
    expect(hook.result.current.state.status).toBe("idle");
    await hook.unmount();
  });

  it("asks for the mic and shows an error when it is refused", async () => {
    mockCapture.getPermission.mockResolvedValue("undetermined");
    mockCapture.requestPermission.mockResolvedValue("denied");
    const hook = await setup();
    await toggle(hook);
    expect(mockCapture.requestPermission).toHaveBeenCalled();
    expect(mockCapture.start).not.toHaveBeenCalled();
    expect(hook.result.current.micPermission).toBe("denied");
    expect(hook.result.current.state).toMatchObject({ status: "error", error: "mic-denied" });
    expect(microphoneOwner()).toBeNull();
    await hook.unmount();
  });

  it("cleans up when capture cannot start", async () => {
    mockCapture.start.mockRejectedValueOnce(
      Object.assign(new Error("busy"), { code: "mic-unavailable" }),
    );
    const hook = await setup();
    await toggle(hook);
    expect(hook.result.current.mic).toBe("idle");
    expect(hook.result.current.state.status).toBe("error");
    expect(mockCapture.stop).toHaveBeenCalled();
    expect(restorePlaybackMode).toHaveBeenCalled();
    expect(microphoneOwner()).toBeNull();
    await hook.unmount();
  });

  it("closes the mic when the engine fails mid-take", async () => {
    const hook = await setup();
    await toggle(hook);
    await act(async () => engine.emit({ type: "failed", code: "engine-runtime" }));
    expect(hook.result.current.mic).toBe("idle");
    expect(hook.result.current.state).toMatchObject({ status: "error", error: "engine-runtime" });
    expect(mockCapture.stop).toHaveBeenCalled();
    expect(microphoneOwner()).toBeNull();
    await hook.unmount();
  });
});

describe("useReciteToFind — ending a take on its own", () => {
  it("stops after a pause once an ayah is confirmed", async () => {
    jest.useFakeTimers();
    const hook = await setup();
    await toggle(hook);
    await act(async () => engine.emit(MATCH));
    await act(async () => {
      jest.advanceTimersByTime(RECITE_SETTLE_MS - 100);
    });
    expect(hook.result.current.mic).toBe("listening");
    await act(async () => {
      jest.advanceTimersByTime(200);
    });
    await flush();
    expect(engine.stop).toHaveBeenCalled();
    expect(hook.result.current.state.status).toBe("found");
    await hook.unmount();
  });

  it("stops at the time cap even with nothing found", async () => {
    jest.useFakeTimers();
    engine = makeEngine();
    const hook = await setup();
    await toggle(hook);
    await act(async () => {
      jest.advanceTimersByTime(RECITE_MAX_LISTEN_MS + 10);
    });
    await flush();
    expect(hook.result.current.mic).toBe("idle");
    expect(hook.result.current.state.status).toBe("nothing");
    await hook.unmount();
  });

  it("stops when the app goes to the background", async () => {
    const hook = await setup();
    await toggle(hook);
    await act(async () => appState.emit("background"));
    await flush();
    expect(hook.result.current.mic).toBe("idle");
    expect(mockCapture.stop).toHaveBeenCalled();
    await hook.unmount();
  });

  it("stops when the capture is interrupted (a call)", async () => {
    const hook = await setup();
    await toggle(hook);
    await act(async () => mockCapture.onStatus?.({ interrupted: true }));
    await flush();
    expect(hook.result.current.mic).toBe("idle");
    await hook.unmount();
  });

  it("gives the mic up when another feature claims it", async () => {
    const hook = await setup();
    await toggle(hook);
    await act(async () => {
      await claimMicrophone("dictation", async () => {});
    });
    await flush();
    expect(hook.result.current.mic).toBe("idle");
    expect(mockCapture.stop).toHaveBeenCalled();
    expect(microphoneOwner()).toBe("dictation");
    await hook.unmount();
  });

  it("releases the mic, the stream and the engine on unmount mid-take", async () => {
    const hook = await setup();
    await toggle(hook);
    await hook.unmount();
    await flush();
    expect(mockCapture.stop).toHaveBeenCalled();
    expect(restorePlaybackMode).toHaveBeenCalled();
    expect(engine.dispose).toHaveBeenCalled();
    expect(microphoneOwner()).toBeNull();
  });
});

describe("chunkLevel", () => {
  it("maps silence to 0 and loud audio towards 1", () => {
    expect(chunkLevel(new Float32Array(0))).toBe(0);
    expect(chunkLevel(new Float32Array(100))).toBe(0);
    expect(chunkLevel(new Float32Array(100).fill(0.5))).toBe(1);
    const quiet = chunkLevel(new Float32Array(100).fill(0.01));
    expect(quiet).toBeGreaterThan(0);
    expect(quiet).toBeLessThan(0.5);
  });
});
