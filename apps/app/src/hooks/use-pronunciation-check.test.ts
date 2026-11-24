import { act, renderHook } from "@testing-library/react-native";

import {
  READ_CLEAR,
  READ_OTHER,
  READ_SUBSTITUTED,
  TOY_CORPUS,
  TOY_PIECES,
  TOY_THRESHOLDS,
  toyLogprobs,
} from "@/test-support/quran-pronunciation";

import { usePronunciationCheck } from "./use-pronunciation-check";

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
jest.mock("@/lib/quran-pronunciation/availability", () => ({
  isPronunciationCheckAvailable: () => true,
  isPronunciationCheckPlatformAvailable: () => true,
}));
jest.mock("@/lib/quran-pronunciation/calibration", () => {
  const actual = jest.requireActual("@/lib/quran-pronunciation/calibration");
  const toy = jest.requireActual("@/test-support/quran-pronunciation");
  return {
    ...actual,
    PINNED_CALIBRATION: {
      ...actual.PINNED_CALIBRATION,
      mode: "full",
      thresholds: toy.TOY_THRESHOLDS,
    },
  };
});

let mockMatrix = toyLogprobs(READ_CLEAR);
const mockRecorder = {
  model: { pieces: TOY_PIECES, corpus: TOY_CORPUS, version: "toy" },
  startTake: jest.fn(() => Promise.resolve()),
  finishTake: jest.fn(() => Promise.resolve(mockMatrix)),
  cancelTake: jest.fn(() => Promise.resolve()),
  dispose: jest.fn(() => Promise.resolve()),
};
jest.mock("@/lib/quran-pronunciation/pipeline", () => ({
  openPronunciationRecorder: jest.fn(() => Promise.resolve(mockRecorder)),
}));

const { quranListenerStore } =
  require("@/stores/quran-listener-store") as typeof import("@/stores/quran-listener-store");
const { RECITATION_MODELS } =
  require("@/constants/recitation-models") as typeof import("@/constants/recitation-models");
const { pronunciationCalibrationStore } =
  require("@/stores/pronunciation-calibration-store") as typeof import("@/stores/pronunciation-calibration-store");

function installModel() {
  quranListenerStore.setState({
    isReady: true,
    listener: {
      status: "ready",
      engine: "tilawa-fastconformer",
      manifest: {
        engine: "tilawa-fastconformer",
        version: RECITATION_MODELS["tilawa-fastconformer"].version,
        files: [],
        downloadedAt: "2026-11-24T00:00:00.000Z",
      },
      bytesDone: 0,
      bytesTotal: 0,
      error: null,
    },
  });
}

const TARGET = { surah: 5, ayah: 2, arabic: "بِسْمِ رَبِّكَ قُلْ", words: ["بِسْمِ", "رَبِّكَ", "قُلْ"] };

beforeEach(() => {
  jest.clearAllMocks();
  installModel();
  pronunciationCalibrationStore.setState({ calibration: null, isReady: true });
  mockMatrix = toyLogprobs(READ_CLEAR);
});

async function takeOf(frames: readonly (number | null)[]) {
  mockMatrix = toyLogprobs(frames);
  const view = await renderHook(() => usePronunciationCheck());
  await act(async () => {
    expect(await view.result.current.start(TARGET)).toBe("started");
  });
  expect(view.result.current.state.status).toBe("listening");
  await act(async () => {
    await view.result.current.stop();
  });
  return view;
}

describe("usePronunciationCheck", () => {
  it("assesses a clear take word by word on the study row", async () => {
    const view = await takeOf(READ_CLEAR);
    expect(view.result.current.state.status).toBe("result");
    expect(view.result.current.state.verdicts?.map((v) => v.state)).toEqual([
      "clear",
      "clear",
      "clear",
    ]);
    expect(mockRecorder.startTake).toHaveBeenCalledTimes(1);
  });

  it("flags a substituted word Listen again", async () => {
    const view = await takeOf(READ_SUBSTITUTED);
    expect(view.result.current.state.verdicts?.[2].state).toBe("listen-again");
  });

  it("shows no marks when the take doesn't fit the ayah", async () => {
    const view = await takeOf(READ_OTHER);
    expect(view.result.current.state).toMatchObject({
      status: "no-fit",
      noFit: "different-passage",
      verdicts: null,
    });
  });

  it("asks for the model before anything starts", async () => {
    quranListenerStore.setState({
      listener: { ...quranListenerStore.getState().listener, manifest: null, status: "idle" },
    });
    const view = await renderHook(() => usePronunciationCheck());
    await act(async () => {
      expect(await view.result.current.start(TARGET)).toBe("needs-model");
    });
    expect(mockRecorder.startTake).not.toHaveBeenCalled();
  });

  it("saves a relaxing calibration offset from a calibration read", async () => {
    mockMatrix = toyLogprobs(READ_CLEAR);
    const view = await renderHook(() => usePronunciationCheck());
    await act(async () => {
      await view.result.current.start(TARGET, { calibrate: true });
    });
    await act(async () => {
      await view.result.current.stop();
    });
    expect(view.result.current.calibration).toBe("saved");
    expect(pronunciationCalibrationStore.getState().calibration?.offset).toBe(0);
    expect(TOY_THRESHOLDS.clear).toBe(1);
  });

  it("releases the model when the screen closes", async () => {
    const view = await takeOf(READ_CLEAR);
    await act(async () => {
      await view.unmount();
    });
    expect(mockRecorder.dispose).toHaveBeenCalled();
  });
});
