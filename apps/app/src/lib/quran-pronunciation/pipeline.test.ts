import type { CaptureChunkListener, RecitationCapture } from "@/lib/quran-companion/audio/types";
import { claimMicrophone, microphoneOwner, releaseMicrophone } from "@/lib/speech/mic-owner";

import { openPronunciationRecorder } from "./pipeline";

const mockRunner = { run: jest.fn(async () => ({ frames: 1 })), release: jest.fn(async () => {}) };

jest.mock("@/lib/quran-companion/audio/audio-mode", () => ({
  enterRecordMode: jest.fn(async () => {}),
  restorePlaybackMode: jest.fn(async () => {}),
}));
jest.mock("@/lib/speech/fastconformer", () => ({
  isFastConformerManifest: () => true,
  openFastConformerRunner: jest.fn(async () => mockRunner),
}));
jest.mock("@/stores/quran-listener-store", () => ({
  loadInstalledModel: jest.fn(async () => ({
    manifest: { version: "test" },
    assets: { json: { "vocab.json": {}, "quran.json": [] } },
  })),
}));
jest.mock("./ayah-tokens", () => ({
  buildPieceIndex: () => ({}),
  corpusIndex: () => new Map(),
}));

function fakeCapture() {
  let onChunk: CaptureChunkListener = () => {};
  const capture = {
    available: true,
    getPermission: async () => "granted" as const,
    requestPermission: async () => "granted" as const,
    start: jest.fn(async (listener: CaptureChunkListener) => {
      onChunk = listener;
    }),
    stop: jest.fn(async () => {}),
  } satisfies RecitationCapture;
  return { capture, feed: (pcm: Float32Array) => onChunk(pcm) };
}

describe("openPronunciationRecorder — microphone ownership", () => {
  beforeEach(() => jest.clearAllMocks());

  it("owns the mic for a take and gives it back when the take finishes", async () => {
    const recorder = await openPronunciationRecorder();
    const { capture, feed } = fakeCapture();
    await recorder.startTake(capture);
    expect(microphoneOwner()).toBe("pronunciation");

    feed(new Float32Array(16_000));
    await expect(recorder.finishTake(500)).resolves.toEqual({ frames: 1 });
    expect(capture.stop).toHaveBeenCalledTimes(1);
    expect(microphoneOwner()).toBeNull();
    await recorder.dispose();
    expect(mockRunner.release).toHaveBeenCalledTimes(1);
  });

  it("on preemption stops capture, keeps the take and tells the screen", async () => {
    const recorder = await openPronunciationRecorder();
    const { capture, feed } = fakeCapture();
    const onInterrupted = jest.fn();
    await recorder.startTake(capture, { onInterrupted });
    feed(new Float32Array(16_000));

    const other = () => {};
    await claimMicrophone("tasbeeh-voice", other);
    expect(capture.stop).toHaveBeenCalledTimes(1);
    expect(onInterrupted).toHaveBeenCalledTimes(1);
    expect(microphoneOwner()).toBe("tasbeeh-voice");

    // The screen finishes the interrupted take: the audio heard so far is assessed.
    await expect(recorder.finishTake(500)).resolves.toEqual({ frames: 1 });
    expect(microphoneOwner()).toBe("tasbeeh-voice");
    releaseMicrophone(other);
    await recorder.dispose();
  });

  it("does not report an interruption once the take is over", async () => {
    const recorder = await openPronunciationRecorder();
    const { capture } = fakeCapture();
    const onInterrupted = jest.fn();
    await recorder.startTake(capture, { onInterrupted });
    await recorder.cancelTake();

    const other = () => {};
    await claimMicrophone("dictation", other);
    expect(onInterrupted).not.toHaveBeenCalled();
    releaseMicrophone(other);
    await recorder.dispose();
  });
});
