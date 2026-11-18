import { renderHook } from "@testing-library/react-native";

import { createRecitationCapture, useRecitationCapture } from "./capture.web";

const g = globalThis as Record<string, unknown>;

type WebAudioOptions = {
  getUserMedia?: jest.Mock;
  permissionState?: string | Error;
  contextSampleRate?: number;
  contextState?: string;
  rejectRateOption?: boolean;
  addModule?: jest.Mock;
};

/** Installs a fake getUserMedia + AudioContext + AudioWorkletNode browser. */
function installWebAudio(options: WebAudioOptions = {}) {
  const track = { stop: jest.fn(), onended: null as null | (() => void) };
  const stream = { getTracks: () => [track], getAudioTracks: () => [track] };
  const node = {
    port: { onmessage: null as null | ((e: unknown) => void), close: jest.fn() },
    connect: jest.fn((target: unknown) => target),
    disconnect: jest.fn(),
  };
  const source = { connect: jest.fn(), disconnect: jest.fn() };
  const gain = { gain: { value: 1 }, connect: jest.fn((t: unknown) => t) };
  const contexts: { close: jest.Mock; resume: jest.Mock; state: string }[] = [];
  const getUserMedia = options.getUserMedia ?? jest.fn(async () => stream);

  class FakeAudioContext {
    state = options.contextState ?? "running";
    sampleRate = options.contextSampleRate ?? 16_000;
    destination = {};
    audioWorklet = { addModule: options.addModule ?? jest.fn(async () => undefined) };
    close = jest.fn(async () => {
      this.state = "closed";
    });
    resume = jest.fn(async () => undefined);
    createMediaStreamSource = () => source;
    createGain = () => gain;
    constructor(init?: { sampleRate?: number }) {
      if (init?.sampleRate && options.rejectRateOption) throw new Error("rate unsupported");
      contexts.push(this);
    }
  }

  g.window = {};
  g.AudioContext = FakeAudioContext;
  g.AudioWorkletNode = jest.fn(() => node);
  g.Blob = class {};
  const createObjectURL = jest.fn(() => "blob:worklet");
  const revokeObjectURL = jest.fn();
  Object.assign(URL, { createObjectURL, revokeObjectURL });
  const permissions =
    options.permissionState === undefined
      ? undefined
      : {
          query: jest.fn(async () => {
            if (options.permissionState instanceof Error) throw options.permissionState;
            return { state: options.permissionState };
          }),
        };
  Object.defineProperty(globalThis.navigator, "mediaDevices", {
    configurable: true,
    value: { getUserMedia },
  });
  Object.defineProperty(globalThis.navigator, "permissions", {
    configurable: true,
    value: permissions,
  });

  return { track, node, source, contexts, getUserMedia, revokeObjectURL };
}

function uninstallWebAudio() {
  delete g.window;
  delete g.AudioContext;
  delete g.AudioWorkletNode;
  Object.defineProperty(globalThis.navigator, "mediaDevices", {
    configurable: true,
    value: undefined,
  });
  Object.defineProperty(globalThis.navigator, "permissions", {
    configurable: true,
    value: undefined,
  });
}

function setup(options?: WebAudioOptions) {
  const web = installWebAudio(options);
  const capture = createRecitationCapture();
  const onChunk = jest.fn();
  const onStatus = jest.fn();
  return { ...web, capture, onChunk, onStatus, start: () => capture.start(onChunk, onStatus) };
}

afterEach(uninstallWebAudio);

describe("web capture without Web Audio", () => {
  it("is unavailable", () => {
    expect(createRecitationCapture().available).toBe(false);
  });

  it("denies permission requests", async () => {
    expect(await createRecitationCapture().requestPermission()).toBe("denied");
  });

  it("refuses to start", async () => {
    await expect(createRecitationCapture().start(jest.fn())).rejects.toMatchObject({
      code: "runtime-unsupported",
    });
  });
});

describe("web capture permissions", () => {
  it.each([
    ["granted", "granted"],
    ["denied", "denied"],
    ["prompt", "undetermined"],
  ])("maps a %s permission state to %s", async (state, expected) => {
    const { capture } = setup({ permissionState: state });
    expect(await capture.getPermission()).toBe(expected);
  });

  it("is undetermined when the browser cannot query the microphone", async () => {
    const { capture } = setup({ permissionState: new Error("unsupported name") });
    expect(await capture.getPermission()).toBe("undetermined");
  });

  it("grants after a probe stream and stops its tracks", async () => {
    const { capture, track } = setup();
    expect(await capture.requestPermission()).toBe("granted");
    expect(track.stop).toHaveBeenCalled();
  });

  it("denies when the probe fails", async () => {
    const { capture } = setup({
      getUserMedia: jest.fn(async () => Promise.reject(new Error("no"))),
    });
    expect(await capture.requestPermission()).toBe("denied");
  });
});

describe("web capture start/stop", () => {
  it("wires mic → worklet → muted gain and reports the rate", async () => {
    const { start, onStatus, source, node, revokeObjectURL } = setup();
    await start();
    expect(source.connect).toHaveBeenCalledWith(node);
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:worklet");
    expect(onStatus).toHaveBeenCalledWith({ sampleRate: 16_000 });
  });

  it("requests a raw mono stream", async () => {
    const { start, getUserMedia } = setup();
    await start();
    expect(getUserMedia).toHaveBeenCalledWith({
      audio: {
        channelCount: 1,
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      },
    });
  });

  it("resamples worklet frames into 16 kHz chunks", async () => {
    const { start, node, onChunk } = setup({ contextSampleRate: 48_000 });
    await start();
    node.port.onmessage?.({ data: { samples: new Float32Array(4800), channels: 1 } });
    expect((onChunk.mock.calls[0][0] as Float32Array).length).toBeCloseTo(1600, -1);
  });

  it("skips empty resampler output", async () => {
    const { start, node, onChunk } = setup();
    await start();
    node.port.onmessage?.({ data: { samples: new Float32Array(0), channels: 1 } });
    expect(onChunk).not.toHaveBeenCalled();
  });

  it("falls back to the default rate when 16 kHz is refused", async () => {
    const { start, contexts } = setup({ rejectRateOption: true });
    await start();
    expect(contexts).toHaveLength(1);
  });

  it("resumes a suspended context", async () => {
    const { start, contexts } = setup({ contextState: "suspended" });
    await start();
    expect(contexts[0].resume).toHaveBeenCalled();
  });

  it("reports an interruption when the track ends on its own", async () => {
    const { start, track, onStatus } = setup();
    await start();
    track.onended?.();
    expect(onStatus).toHaveBeenCalledWith({ interrupted: true });
  });

  it("releases the graph on stop without reporting an interruption", async () => {
    const { capture, start, track, node, contexts, onStatus } = setup();
    await start();
    await capture.stop();
    track.onended?.();
    expect(onStatus).not.toHaveBeenCalledWith({ interrupted: true });
    expect(node.port.close).toHaveBeenCalled();
    expect(track.stop).toHaveBeenCalled();
    expect(contexts[0].close).toHaveBeenCalled();
  });

  it("tolerates disconnect and close errors on stop", async () => {
    const { capture, start, node, contexts } = setup();
    await start();
    node.disconnect.mockImplementation(() => {
      throw new Error("already");
    });
    contexts[0].close.mockRejectedValueOnce(new Error("closing"));
    await expect(capture.stop()).resolves.toBeUndefined();
  });

  it.each([
    ["NotAllowedError", "mic-denied"],
    ["SecurityError", "mic-denied"],
    ["NotFoundError", "mic-unavailable"],
  ])("maps a %s from getUserMedia to %s", async (name, code) => {
    const error = Object.assign(new Error(name), { name });
    const { start } = setup({ getUserMedia: jest.fn(async () => Promise.reject(error)) });
    await expect(start()).rejects.toMatchObject({ code });
  });

  it("maps a worklet failure to capture-failed and releases the mic", async () => {
    const { start, track } = setup({
      addModule: jest.fn(async () => Promise.reject(new Error("csp"))),
    });
    await expect(start()).rejects.toMatchObject({ code: "capture-failed", message: "csp" });
    expect(track.stop).toHaveBeenCalled();
  });
});

it("useRecitationCapture keeps one capture per mount", async () => {
  const { result, rerender } = await renderHook(() => useRecitationCapture());
  const first = result.current;
  await rerender({});
  expect(result.current).toBe(first);
});
