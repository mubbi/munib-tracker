import { act, renderHook } from "@testing-library/react-native";

import type { VoicePipelineOptions } from "@/lib/tasbeeh-voice/pipeline";
import { SOMETHING_ELSE, type VoiceZikr } from "@/lib/tasbeeh-voice/voice-zikr";
import { tasbeehVoiceTemplatesStore } from "@/stores/tasbeeh-voice-templates-store";
import { captureAppStateListener } from "@/test-support/app-state";
import { syntheticPhrase, withPauses } from "@/test-support/tasbeeh-voice";

import { RETEACH_NUDGE_AFTER, useVoiceTasbeeh } from "./use-voice-tasbeeh";
import { useVoiceTasbeehSteps } from "./use-voice-tasbeeh-steps";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("expo-keep-awake", () => ({
  activateKeepAwakeAsync: jest.fn(() => Promise.resolve()),
  deactivateKeepAwake: jest.fn(() => Promise.resolve()),
}));
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
jest.mock("@/lib/tasbeeh-voice/mode", () => ({
  ...jest.requireActual("@/lib/tasbeeh-voice/mode"),
  usesModel: () => mockUsesModel,
}));
jest.mock("@/lib/tasbeeh-voice/availability", () => ({
  isVoiceTasbeehPlatformAvailable: () => true,
  isVoiceTasbeehAvailable: (zikr: unknown) => zikr != null,
}));

const mockPipeline = { mute: jest.fn(), stop: jest.fn(() => Promise.resolve()) };
let pipelineOptions: VoicePipelineOptions | null = null;
const pipelineModes: string[] = [];
jest.mock("@/lib/tasbeeh-voice/pipeline", () => ({
  startVoicePipeline: jest.fn((options: VoicePipelineOptions) => {
    pipelineOptions = options;
    pipelineModes.push(options.mode);
    return Promise.resolve(mockPipeline);
  }),
}));

/** A catalog zikr counter (SubhanAllah) — the spotter phrase applies when the model ships. */
const SUBHANALLAH: VoiceZikr = {
  key: "zikr:after_prayer-tasbih",
  label: "SubhanAllah",
  entry: null,
  phrase: "subhanallah",
};

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

async function setup(atLimit = false, zikr: VoiceZikr = SUBHANALLAH) {
  const onVoiceCount = jest.fn();
  const onAutoStop = jest.fn();
  const view = await renderHook(
    (props: { atLimit: boolean }) =>
      useVoiceTasbeeh({ zikr, atLimit: props.atLimit, onVoiceCount, onAutoStop }),
    { initialProps: { atLimit } },
  );
  return { ...view, onVoiceCount, onAutoStop };
}

const hit = { startMs: 0, endMs: 600, score: -0.1 };

beforeEach(async () => {
  mockUsesModel = true;
  pipelineOptions = null;
  pipelineModes.length = 0;
  jest.clearAllMocks();
  installModel();
  await tasbeehVoiceTemplatesStore.getState().forget();
});

/** One teaching burst: the same synthetic "zikr" at a slightly different pace. */
const take = (stretch: number) => withPauses([syntheticPhrase(["a", "i", "u", "e"], { stretch })]);

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

  it("teaches a zikr from three samples, keeps only its pattern, then counts by it (D48–D50)", async () => {
    mockUsesModel = false;
    const { result } = await setup();
    expect(result.current.taught).toBe(false);
    await act(async () => {
      expect(await result.current.startTeaching()).toBe("started");
    });
    expect(pipelineOptions?.mode).toBe("teach");
    expect(result.current.teach.status).toBe("recording");
    await act(async () => {
      pipelineOptions?.onSample?.(take(1));
    });
    expect(result.current.teach.accepted).toBe(1);
    await act(async () => {
      pipelineOptions?.onSample?.(take(0.95));
      pipelineOptions?.onSample?.(take(1.05));
    });
    // The third sample finishes teaching and starts counting by the taught pattern.
    expect(pipelineModes).toEqual(["teach", "template"]);
    expect(pipelineOptions?.pattern?.templates).toHaveLength(3);
    expect(result.current.listening).toBe(true);
    expect(result.current.countingMode).toBe("template");
    expect(result.current.taught).toBe(true);
    const stored = tasbeehVoiceTemplatesStore.getState().patterns["zikr:after_prayer-tasbih"];
    expect(stored?.templates).toHaveLength(3);
    // Numbers only — never audio.
    expect(JSON.stringify(stored)).not.toMatch(/pcm|audio/i);
  });

  it("rejects a sample that sounds like a different zikr", async () => {
    mockUsesModel = false;
    const { result } = await setup();
    await act(async () => {
      await result.current.startTeaching();
    });
    await act(async () => {
      pipelineOptions?.onSample?.(take(1));
      pipelineOptions?.onSample?.(withPauses([syntheticPhrase(new Array(60).fill("a"))]));
    });
    expect(result.current.teach.accepted).toBe(1);
    expect(result.current.teach.issue).toBe("too-long");
  });

  it("starts a taught zikr in template mode; skipping teaching counts pauses", async () => {
    mockUsesModel = false;
    const { result } = await setup();
    await act(async () => {
      expect(await result.current.start({ skipTeaching: true })).toBe("started");
    });
    expect(pipelineModes).toEqual(["pause"]);
    expect(result.current.countingMode).toBe("pause");
  });

  it('keeps a "Something else" pattern for the session only', async () => {
    mockUsesModel = false;
    const { result } = await setup(false, SOMETHING_ELSE);
    await act(async () => {
      await result.current.startTeaching();
    });
    await act(async () => {
      pipelineOptions?.onSample?.(take(1));
    });
    await act(async () => {
      await result.current.finishTeaching();
    });
    expect(pipelineModes).toEqual(["teach", "template"]);
    expect(result.current.taught).toBe(true);
    expect(tasbeehVoiceTemplatesStore.getState().patterns).toEqual({});
  });

  it("cancels teaching when the app goes to the background", async () => {
    mockUsesModel = false;
    const { result } = await setup();
    await act(async () => {
      await result.current.startTeaching();
    });
    await act(async () => {
      appState.emit("background");
    });
    expect(result.current.teach.status).toBe("idle");
    expect(mockPipeline.stop).toHaveBeenCalled();
  });

  it("hands the microphone back when Cancel is pressed on a re-teach", async () => {
    mockUsesModel = false;
    await teachThreeTakes();
    const { result } = await setup();
    await act(async () => {
      await result.current.start();
    });
    expect(pipelineModes).toEqual(["template"]);
    await act(async () => {
      await result.current.startTeaching();
    });
    expect(pipelineModes).toEqual(["template", "teach"]);
    await act(async () => {
      result.current.cancelTeaching({ resume: true });
    });
    expect(result.current.teach.status).toBe("idle");
    expect(pipelineModes).toEqual(["template", "teach", "template"]);
    expect(result.current.listening).toBe(true);
  });

  it("offers Re-teach after repeated manual corrections while counting by the pattern", async () => {
    mockUsesModel = false;
    await teachThreeTakes();
    const { result } = await setup();
    await act(async () => {
      await result.current.start();
    });
    for (let i = 0; i < RETEACH_NUDGE_AFTER - 1; i++) {
      await act(async () => result.current.noteCorrection());
    }
    expect(result.current.suggestReteach).toBe(false);
    await act(async () => result.current.noteCorrection());
    expect(result.current.suggestReteach).toBe(true);
    await act(async () => result.current.dismissReteach());
    expect(result.current.suggestReteach).toBe(false);
    await act(async () => result.current.noteCorrection());
    expect(result.current.suggestReteach).toBe(false);
  });

  it("persists templates learned from confident matches (features only)", async () => {
    mockUsesModel = false;
    await teachThreeTakes();
    const { result } = await setup();
    await act(async () => {
      await result.current.start();
    });
    const taught = pipelineOptions?.pattern;
    expect(taught).toBeTruthy();
    await act(async () => {
      pipelineOptions?.onPatternLearned?.({
        ...(taught as NonNullable<typeof taught>),
        learned: [(taught as NonNullable<typeof taught>).templates[0]],
      });
    });
    const stored = tasbeehVoiceTemplatesStore.getState().patterns["zikr:after_prayer-tasbih"];
    expect(stored?.templates).toHaveLength(3);
    expect(stored?.learned).toHaveLength(1);
  });
});

/** Teach SubhanAllah from three takes through the real hook, then release it. */
async function teachThreeTakes() {
  const { result, unmount } = await setup();
  await act(async () => {
    await result.current.startTeaching();
  });
  await act(async () => {
    pipelineOptions?.onSample?.(take(1));
    pipelineOptions?.onSample?.(take(0.95));
    pipelineOptions?.onSample?.(take(1.05));
  });
  await act(async () => {
    unmount();
  });
  pipelineModes.length = 0;
  pipelineOptions = null;
}

describe("re-teach while counting in a step flow (live race, D69)", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("keeps the teach panel open through the resume delay, then resumes once with the new pattern", async () => {
    mockUsesModel = false;
    await teachThreeTakes();
    const before = tasbeehVoiceTemplatesStore.getState().patterns["zikr:after_prayer-tasbih"]?.at;
    jest.useFakeTimers();
    const onVoiceCount = jest.fn();
    const view = await renderHook(() =>
      useVoiceTasbeehSteps({
        zikr: SUBHANALLAH,
        eligible: true,
        count: 0,
        target: 33,
        active: true,
        onVoiceCount,
      }),
    );
    await act(async () => view.result.current.toggle());
    await act(async () => {
      jest.advanceTimersByTime(400);
    });
    expect(view.result.current.voice.listening).toBe(true);
    expect(pipelineModes).toEqual(["template"]);

    // Re-teach while counting: the panel switches at once and nothing resumes counting.
    await act(async () => view.result.current.teach());
    expect(view.result.current.voice.teach.status).toBe("recording");
    for (let i = 0; i < 5; i++) {
      await act(async () => {
        jest.advanceTimersByTime(400);
      });
    }
    expect(view.result.current.voice.teach.status).toBe("recording");
    expect(view.result.current.on).toBe(true);
    expect(pipelineModes).toEqual(["template", "teach"]);
    // A stray resume cannot take the microphone from teaching.
    let late = "";
    await act(async () => {
      late = await view.result.current.voice.start();
    });
    expect(late).toBe("busy");
    expect(pipelineModes).toEqual(["template", "teach"]);

    // Three samples: the new pattern is saved and counting resumes exactly once.
    await act(async () => {
      pipelineOptions?.onSample?.(take(1.02));
      pipelineOptions?.onSample?.(take(0.97));
      pipelineOptions?.onSample?.(take(1.04));
    });
    for (let i = 0; i < 3; i++) {
      await act(async () => {
        jest.advanceTimersByTime(400);
      });
    }
    expect(view.result.current.voice.teach.status).toBe("idle");
    expect(view.result.current.voice.listening).toBe(true);
    expect(pipelineModes).toEqual(["template", "teach", "template"]);
    expect(pipelineOptions?.pattern?.templates).toHaveLength(3);
    const after = tasbeehVoiceTemplatesStore.getState().patterns["zikr:after_prayer-tasbih"]?.at;
    expect(after).not.toBe(before);
    await act(async () => {
      view.unmount();
    });
  });
});
