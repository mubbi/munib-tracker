import { act, renderHook } from "@testing-library/react-native";

import type { VoicePipelineOptions } from "@/lib/tasbeeh-voice/pipeline";
import { captureAppStateListener } from "@/test-support/app-state";

import { useVoiceTasbeeh } from "./use-voice-tasbeeh";

jest.mock("expo-keep-awake", () => ({
  activateKeepAwakeAsync: jest.fn(() => Promise.resolve()),
  deactivateKeepAwake: jest.fn(() => Promise.resolve()),
}));
jest.mock("expo-audio", () => ({ __esModule: true }));
jest.mock("expo-network", () => ({
  getNetworkStateAsync: jest.fn(() => Promise.resolve({ type: "WIFI" })),
  NetworkStateType: { WIFI: "WIFI", ETHERNET: "ETHERNET" },
}));

const mockCapture = {
  available: true,
  getPermission: jest.fn(() => Promise.resolve("granted")),
  requestPermission: jest.fn(() => Promise.resolve("granted")),
  start: jest.fn(),
  stop: jest.fn(),
};
jest.mock("@/lib/quran-companion/audio/capture", () => ({
  useRecitationCapture: () => mockCapture,
}));
let mockUsesModel = true;
jest.mock("@/lib/tasbeeh-voice/mode", () => ({ usesModel: () => mockUsesModel }));
jest.mock("@/lib/tasbeeh-voice/availability", () => ({
  isVoiceTasbeehPlatformAvailable: () => true,
  isVoiceTasbeehAvailable: (phrase: string | null) => phrase != null,
}));

const mockPipeline = { mute: jest.fn(), stop: jest.fn(() => Promise.resolve()) };
let pipelineOptions: VoicePipelineOptions | null = null;
jest.mock("@/lib/tasbeeh-voice/pipeline", () => ({
  startVoicePipeline: jest.fn((options: VoicePipelineOptions) => {
    pipelineOptions = options;
    return Promise.resolve(mockPipeline);
  }),
}));

// Imported after the mocks so the store sees them.
const { quranListenerStore } =
  require("@/stores/quran-listener-store") as typeof import("@/stores/quran-listener-store");
const { RECITATION_MODELS } =
  require("@/constants/recitation-models") as typeof import("@/constants/recitation-models");

const appState = captureAppStateListener();

function installModel() {
  const spec = RECITATION_MODELS["tilawa-fastconformer"];
  quranListenerStore.setState({
    isReady: true,
    listener: {
      status: "ready",
      engine: "tilawa-fastconformer",
      manifest: {
        engine: "tilawa-fastconformer",
        version: spec.version,
        files: [],
        downloadedAt: "2026-11-23T00:00:00.000Z",
      },
      bytesDone: 0,
      bytesTotal: 0,
      error: null,
    },
  });
}

async function setup(atLimit = false) {
  const onVoiceCount = jest.fn();
  const onAutoStop = jest.fn();
  const view = await renderHook(
    (props: { atLimit: boolean }) =>
      useVoiceTasbeeh({ phrase: "subhanallah", atLimit: props.atLimit, onVoiceCount, onAutoStop }),
    { initialProps: { atLimit } },
  );
  return { ...view, onVoiceCount, onAutoStop };
}

const hit = { startMs: 0, endMs: 600, score: -0.1 };

beforeEach(() => {
  mockUsesModel = true;
  pipelineOptions = null;
  jest.clearAllMocks();
  installModel();
});

describe("useVoiceTasbeeh", () => {
  it("asks for the model first when FastConformer is not installed", async () => {
    quranListenerStore.setState({
      listener: {
        ...quranListenerStore.getState().listener,
        manifest: null,
        status: "not-downloaded",
      },
    });
    const { result } = await setup();
    let outcome = "";
    await act(async () => {
      outcome = await result.current.start();
    });
    expect(outcome).toBe("needs-model");
    expect(pipelineOptions).toBeNull();
  });

  it("needs no model in the pause-count fallback (D24)", async () => {
    mockUsesModel = false;
    quranListenerStore.setState({
      listener: {
        ...quranListenerStore.getState().listener,
        manifest: null,
        status: "not-downloaded",
      },
    });
    const { result } = await setup();
    expect(result.current.modelStatus).toBe("ready");
    let outcome = "";
    await act(async () => {
      outcome = await result.current.start();
    });
    expect(outcome).toBe("started");
  });

  it("asks for the microphone before listening", async () => {
    mockCapture.getPermission
      .mockResolvedValueOnce("granted")
      .mockResolvedValueOnce("undetermined");
    const { result } = await setup();
    let outcome = "";
    await act(async () => {
      outcome = await result.current.start();
    });
    expect(outcome).toBe("needs-permission");
  });

  it("counts exactly once per recognised phrase through the shell's path", async () => {
    const { result, onVoiceCount } = await setup();
    await act(async () => {
      await result.current.start();
    });
    expect(result.current.listening).toBe(true);
    await act(async () => {
      pipelineOptions?.onHit(hit);
      pipelineOptions?.onHit({ ...hit, startMs: 700, endMs: 1300 });
    });
    expect(onVoiceCount).toHaveBeenCalledTimes(2);
    expect(result.current.flashKey).toBe(2);
  });

  it("never counts past the target: a hit at the limit turns the mic off", async () => {
    const { result, rerender, onVoiceCount } = await setup();
    await act(async () => {
      await result.current.start();
    });
    await act(async () => {
      rerender({ atLimit: true });
    });
    await act(async () => {
      pipelineOptions?.onHit(hit);
    });
    expect(onVoiceCount).not.toHaveBeenCalled();
    expect(mockPipeline.stop).toHaveBeenCalled();
    expect(result.current.session.stopReason).toBe("target");
  });

  it("stops when the app goes to the background (no background microphone)", async () => {
    const { result, onAutoStop } = await setup();
    await act(async () => {
      await result.current.start();
    });
    await act(async () => {
      appState.emit("background");
    });
    expect(mockPipeline.stop).toHaveBeenCalled();
    expect(result.current.session.stopReason).toBe("background");
    expect(onAutoStop).toHaveBeenCalledWith("background", null);
  });

  it("stops on an audio interruption", async () => {
    const { result } = await setup();
    await act(async () => {
      await result.current.start();
    });
    await act(async () => {
      pipelineOptions?.onInterrupted();
    });
    expect(result.current.session.stopReason).toBe("interrupted");
  });

  it("mutes the spotter while the shell speaks to a screen reader", async () => {
    const { result, onVoiceCount } = await setup();
    await act(async () => {
      await result.current.start();
    });
    await act(async () => {
      result.current.muteFor(1800);
      pipelineOptions?.onHit(hit);
    });
    expect(mockPipeline.mute).toHaveBeenCalledWith(1800);
    expect(onVoiceCount).not.toHaveBeenCalled();
  });

  it("releases everything when the screen is left", async () => {
    const { result, unmount } = await setup();
    await act(async () => {
      await result.current.start();
    });
    await act(async () => {
      unmount();
    });
    expect(mockPipeline.stop).toHaveBeenCalled();
  });
});
