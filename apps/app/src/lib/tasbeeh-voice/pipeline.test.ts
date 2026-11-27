import type { RecitationCapture } from "@/lib/quran-companion/audio/types";
import { claimMicrophone, microphoneOwner, releaseMicrophone } from "@/lib/speech/mic-owner";

import { startVoicePipeline, type VoicePipelineOptions } from "./pipeline";

jest.mock("@/lib/quran-companion/audio/audio-mode", () => ({
  enterRecordMode: jest.fn(async () => {}),
  restorePlaybackMode: jest.fn(async () => {}),
}));
jest.mock("@/lib/speech/fastconformer", () => ({
  openFastConformerRunner: jest.fn(),
}));
jest.mock("@/stores/quran-listener-store", () => ({
  loadInstalledModel: jest.fn(),
}));

function fakeCapture(): RecitationCapture & { start: jest.Mock; stop: jest.Mock } {
  return {
    available: true,
    getPermission: async () => "granted",
    requestPermission: async () => "granted",
    start: jest.fn(async () => {}),
    stop: jest.fn(async () => {}),
  };
}

function pauseOptions(capture: RecitationCapture): VoicePipelineOptions {
  return {
    capture,
    mode: "pause",
    onHit: jest.fn(),
    onFailure: jest.fn(),
    onInterrupted: jest.fn(),
  };
}

describe("startVoicePipeline — microphone ownership", () => {
  it("owns the mic while listening and gives it back on stop", async () => {
    const capture = fakeCapture();
    const pipeline = await startVoicePipeline(pauseOptions(capture));
    expect(microphoneOwner()).toBe("tasbeeh-voice");
    expect(capture.start).toHaveBeenCalledTimes(1);

    await pipeline.stop();
    expect(capture.stop).toHaveBeenCalledTimes(1);
    expect(microphoneOwner()).toBeNull();
  });

  it("stops capture and reports an interruption when another listener claims the mic", async () => {
    const capture = fakeCapture();
    const options = pauseOptions(capture);
    const pipeline = await startVoicePipeline(options);

    const other = () => {};
    await claimMicrophone("dictation", other);
    expect(capture.stop).toHaveBeenCalledTimes(1);
    expect(options.onInterrupted).toHaveBeenCalledTimes(1);
    expect(microphoneOwner()).toBe("dictation");

    // The screen's own stop afterwards is a no-op and keeps the new owner.
    await pipeline.stop();
    expect(capture.stop).toHaveBeenCalledTimes(1);
    expect(microphoneOwner()).toBe("dictation");
    releaseMicrophone(other);
  });

  it("does not report an interruption after it stopped on its own", async () => {
    const capture = fakeCapture();
    const options = pauseOptions(capture);
    const pipeline = await startVoicePipeline(options);
    await pipeline.stop();

    const other = () => {};
    await claimMicrophone("dictation", other);
    expect(options.onInterrupted).not.toHaveBeenCalled();
    releaseMicrophone(other);
  });

  it("releases the mic when capture fails to start", async () => {
    const capture = fakeCapture();
    capture.start.mockRejectedValueOnce(new Error("no mic"));
    await expect(startVoicePipeline(pauseOptions(capture))).rejects.toMatchObject({
      code: "capture-failed",
    });
    expect(microphoneOwner()).toBeNull();
  });
});
