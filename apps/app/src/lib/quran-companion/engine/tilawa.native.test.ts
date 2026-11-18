import type { EnginePlatform, OrtNamespace } from "./types";

const mockCreateTilawaEngine = jest.fn(
  async (_engine: string, _assets: unknown, platform: EnginePlatform) => ({ platform }),
);
jest.mock("./tilawa-adapter", () => ({
  createTilawaEngine: (engine: string, assets: unknown, platform: EnginePlatform) =>
    mockCreateTilawaEngine(engine, assets, platform),
}));

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
    await platform.createSession(ort, assets);
    expect(ort.InferenceSession.create).toHaveBeenCalledWith("/data/model.onnx", {
      executionProviders: ["cpu"],
      graphOptimizationLevel: "all",
    });
    await expect(platform.createSession(ort, { json: {} })).rejects.toMatchObject({
      code: "model-missing",
    });
  });
});
