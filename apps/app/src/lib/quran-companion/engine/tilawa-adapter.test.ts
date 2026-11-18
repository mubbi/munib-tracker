import type { LoadedModelAssets } from "../model/types";
import { createTilawaEngine } from "./tilawa-adapter";
import type { EnginePlatform, OrtNamespace } from "./types";

const mockCapture = jest.fn();
jest.mock("@/lib/sentry", () => ({
  captureAppException: (...args: unknown[]) => mockCapture(...args),
}));

const ASSETS: LoadedModelAssets = { json: {} };

function makePlatform(overrides: Partial<EnginePlatform> = {}): EnginePlatform {
  const ort = {
    Tensor: class {},
    InferenceSession: { create: jest.fn() },
  } as unknown as OrtNamespace;
  return {
    loadOrt: jest.fn(async () => ort),
    createSession: jest.fn(async () => ({ run: jest.fn(), outputNames: [] })),
    ...overrides,
  };
}

const rejecting = (message: string) =>
  jest.fn(async () => {
    throw new Error(message);
  });

beforeEach(() => mockCapture.mockClear());

// Engine wiring past the `await import("@tilawa/core")` line cannot run under
// Jest: native dynamic import needs --experimental-vm-modules (see jest.setup.ts).
describe("createTilawaEngine init failures", () => {
  it("classifies ORT load failures and reports them", async () => {
    const platform = makePlatform({ loadOrt: rejecting("WebAssembly not supported") });
    await expect(createTilawaEngine("tilawa-zipformer", ASSETS, platform)).rejects.toMatchObject({
      code: "runtime-unsupported",
    });
    expect(mockCapture).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ tags: expect.objectContaining({ phase: "engine-init" }) }),
    );
  });

  it("defaults session failures to engine-init-failed", async () => {
    const platform = makePlatform({ createSession: rejecting("bad graph") });
    await expect(createTilawaEngine("tilawa-zipformer", ASSETS, platform)).rejects.toMatchObject({
      code: "engine-init-failed",
      message: "bad graph",
    });
  });
});
