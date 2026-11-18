import { act, renderHook } from "@testing-library/react-native";
import type { AudioStream, AudioStreamBuffer } from "expo-audio";
import { useAudioStream } from "expo-audio";
import { setPlatform } from "@/test-support/platform";

import { createRecitationCapture, useRecitationCapture } from "./capture.native";

const mockGetPermissions = jest.fn();
const mockRequestPermissions = jest.fn();
jest.mock("expo-audio", () => ({
  getRecordingPermissionsAsync: () => mockGetPermissions(),
  requestRecordingPermissionsAsync: () => mockRequestPermissions(),
  useAudioStream: jest.fn(() => ({ stream: null })),
}));

type StatusListener = (status: { isStreaming: boolean }) => void;

function setup(overrides: Partial<Record<"start" | "stop" | "addListener", jest.Mock>> = {}) {
  let statusListener: StatusListener | undefined;
  const subscription = { remove: jest.fn() };
  const stream = {
    sampleRate: 16_000,
    start: jest.fn(async () => undefined),
    stop: jest.fn(),
    addListener: jest.fn((_event: string, fn: StatusListener) => {
      statusListener = fn;
      return subscription;
    }),
    ...overrides,
  };
  const sink: { current: ((buffer: AudioStreamBuffer) => void) | null } = { current: null };
  const capture = createRecitationCapture(stream as unknown as AudioStream, sink);
  const onChunk = jest.fn();
  const onStatus = jest.fn();
  return {
    stream,
    sink,
    capture,
    onChunk,
    onStatus,
    subscription,
    emitStatus: (isStreaming: boolean) => statusListener?.({ isStreaming }),
    start: () => capture.start(onChunk, onStatus),
  };
}

const buffer = (data: ArrayBuffer, extra: Partial<AudioStreamBuffer> = {}) =>
  ({ data, sampleRate: 16_000, channels: 1, ...extra }) as AudioStreamBuffer;

describe("native recitation capture permissions", () => {
  it.each([
    [{ granted: true }, "granted"],
    [{ granted: false, status: "undetermined" }, "undetermined"],
    [{ granted: false, canAskAgain: true }, "undetermined"],
    [{ granted: false, canAskAgain: false, status: "denied" }, "denied"],
  ])("maps %o to %s", async (status, expected) => {
    mockGetPermissions.mockResolvedValueOnce(status);
    mockRequestPermissions.mockResolvedValueOnce(status);
    const capture = createRecitationCapture();
    expect(await capture.getPermission()).toBe(expected);
    expect(await capture.requestPermission()).toBe(expected);
  });

  it("treats a failed permission query as undetermined", async () => {
    mockGetPermissions.mockRejectedValueOnce(new Error("x"));
    expect(await createRecitationCapture().getPermission()).toBe("undetermined");
  });

  it("treats a failed permission request as denied", async () => {
    mockRequestPermissions.mockRejectedValueOnce(new Error("x"));
    expect(await createRecitationCapture().requestPermission()).toBe("denied");
  });
});

describe("native recitation capture without a stream", () => {
  it("is unavailable and refuses to start", async () => {
    const capture = createRecitationCapture();
    expect(capture.available).toBe(false);
    await expect(capture.start(jest.fn())).rejects.toMatchObject({ code: "mic-unavailable" });
    await expect(capture.stop()).resolves.toBeUndefined();
  });

  it("is unavailable on TV even with a stream", async () => {
    const restore = setPlatform({ isTV: true });
    try {
      const { capture, start } = setup();
      expect(capture.available).toBe(false);
      await expect(start()).rejects.toMatchObject({ code: "mic-unavailable" });
    } finally {
      restore();
    }
  });
});

describe("native recitation capture with a stream", () => {
  it("starts the stream and reports the delivered rate", async () => {
    const { capture, stream, start, onStatus } = setup();
    expect(capture.available).toBe(true);
    await start();
    expect(stream.start).toHaveBeenCalled();
    expect(onStatus).toHaveBeenCalledWith({ sampleRate: 16_000 });
  });

  it("forwards float32 buffers as 16 kHz chunks", async () => {
    const { sink, start, onChunk } = setup();
    await start();
    sink.current?.(buffer(new Float32Array(1600).fill(0.5).buffer));
    expect(onChunk).toHaveBeenCalledWith(expect.any(Float32Array));
    expect((onChunk.mock.calls[0][0] as Float32Array).length).toBeGreaterThan(0);
  });

  it("decodes odd-sized buffers as int16 and defaults missing rate/channels", async () => {
    const { sink, start, onChunk } = setup();
    await start();
    sink.current?.(buffer(new Int16Array(1601).fill(1000).buffer, { sampleRate: 0, channels: 0 }));
    expect(onChunk).toHaveBeenCalled();
  });

  it("ignores empty buffers", async () => {
    const { sink, start, onChunk } = setup();
    await start();
    sink.current?.({} as AudioStreamBuffer);
    expect(onChunk).not.toHaveBeenCalled();
  });

  it("reports an interruption when the stream stops on its own", async () => {
    const { start, emitStatus, onStatus } = setup();
    await start();
    emitStatus(true);
    emitStatus(false);
    expect(onStatus).toHaveBeenCalledWith({ interrupted: true });
    expect(onStatus).toHaveBeenCalledTimes(2);
  });

  it("does not report an interruption after stop()", async () => {
    const { capture, start, emitStatus, onStatus, subscription, sink, stream } = setup();
    await start();
    await capture.stop();
    emitStatus(false);
    expect(onStatus).not.toHaveBeenCalledWith({ interrupted: true });
    expect(subscription.remove).toHaveBeenCalled();
    expect(sink.current).toBeNull();
    expect(stream.stop).toHaveBeenCalled();
  });

  it("tolerates a stream that is already stopped", async () => {
    const { capture } = setup({
      stop: jest.fn(() => {
        throw new Error("released");
      }),
    });
    await expect(capture.stop()).resolves.toBeUndefined();
  });

  it("maps a listener failure to mic-unavailable", async () => {
    const { start } = setup({
      addListener: jest.fn(() => {
        throw new Error("no stream");
      }),
    });
    await expect(start()).rejects.toMatchObject({ code: "mic-unavailable", message: "no stream" });
  });

  it.each([
    ["Recording permission denied", "mic-denied"],
    ["hardware busy", "capture-failed"],
  ])("maps start failure %p to %s", async (message, code) => {
    const { start, sink } = setup({
      start: jest.fn(async () => Promise.reject(new Error(message))),
    });
    await expect(start()).rejects.toMatchObject({ code });
    expect(sink.current).toBeNull();
  });
});

describe("useRecitationCapture (phone)", () => {
  it("routes hook buffers to the active take", async () => {
    const { stream } = setup();
    let onBuffer: ((buffer: AudioStreamBuffer) => void) | undefined;
    (useAudioStream as jest.Mock).mockImplementation((options: { onBuffer: typeof onBuffer }) => {
      onBuffer = options.onBuffer;
      return { stream };
    });
    const { result } = await renderHook(() => useRecitationCapture());
    expect(result.current.available).toBe(true);
    const onChunk = jest.fn();
    await act(() => result.current.start(onChunk));
    onBuffer?.(buffer(new Float32Array(1600).buffer));
    expect(onChunk).toHaveBeenCalled();
  });
});
