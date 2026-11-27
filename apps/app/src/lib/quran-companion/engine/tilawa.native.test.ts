import type { EnginePlatform, OrtNamespace } from "./types";

const mockCreateTilawaEngine = jest.fn(
  async (_engine: string, _assets: unknown, platform: EnginePlatform) => ({ platform }),
);
jest.mock("./tilawa-adapter", () => ({
  createTilawaEngine: (engine: string, assets: unknown, platform: EnginePlatform) =>
    mockCreateTilawaEngine(engine, assets, platform),
}));

import { SPEECH_SESSION_IDLE_MS } from "@/lib/speech/session-cache";

import { createPlatformEngine, isEngineRuntimeSupported } from "./tilawa.native";

describe("tilawa.native", () => {
  it("always reports runtime support", () => {
    expect(isEngineRuntimeSupported()).toBe(true);
  });

  it("hands the shared adapter a platform that builds a CPU session from the model path", async () => {
    const assets = { json: {}, modelPath: "/data/model.onnx" };
    await createPlatformEngine("tilawa-fastconformer", assets);
    const [engine, passedAssets, platform] = mockCreateTilawaEngine.mock.calls[0];
    expect(engine).toBe("tilawa-fastconformer");
    expect(passedAssets).toBe(assets);

    const ort = {
      InferenceSession: { create: jest.fn(async () => ({ run: jest.fn(), outputNames: [] })) },
      Tensor: class {},
    } as unknown as OrtNamespace;
    const lease = await platform.createSession(ort, assets);
    expect(ort.InferenceSession.create).toHaveBeenCalledWith("/data/model.onnx", {
      executionProviders: ["cpu"],
      graphOptimizationLevel: "all",
      intraOpNumThreads: 2,
    });
    await lease.release?.();
    await expect(platform.createSession(ort, { json: {} })).rejects.toMatchObject({
      code: "model-missing",
    });
  });

  it("shares one warmed-up session per model file and releases it after the idle delay", async () => {
    jest.useFakeTimers();
    try {
      const run = jest.fn(async () => ({
        log_probs: { data: new Float32Array(1025), dims: [1, 1, 1025] },
      }));
      const release = jest.fn(async () => {});
      const create = jest.fn(async () => ({
        run,
        release,
        outputNames: ["log_probs"],
        inputNames: ["audio_signal", "length"],
      }));
      const ort = {
        InferenceSession: { create },
        Tensor: class {},
      } as unknown as OrtNamespace;
      await createPlatformEngine("tilawa-fastconformer", { json: {}, modelPath: "/fc.onnx" });
      const platform = mockCreateTilawaEngine.mock.calls.at(-1)?.[2] as EnginePlatform;
      const assets = { json: {}, modelPath: "/fc.onnx" };

      const practice = await platform.createSession(ort, assets);
      const tasbeeh = await platform.createSession(ort, assets);
      expect(create).toHaveBeenCalledTimes(1);
      // One warm-up inference (0.5 s of silence) when the session was created.
      expect(run).toHaveBeenCalledTimes(1);

      await practice.release?.();
      await tasbeeh.release?.();
      await tasbeeh.release?.();
      expect(release).not.toHaveBeenCalled();
      await jest.advanceTimersByTimeAsync(SPEECH_SESSION_IDLE_MS);
      expect(release).toHaveBeenCalledTimes(1);
    } finally {
      jest.useRealTimers();
    }
  });
});
