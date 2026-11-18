import type { EnginePlatform, OrtNamespace } from "./types";

const mockCreateTilawaEngine = jest.fn(
  async (_engine: string, _assets: unknown, platform: EnginePlatform) => ({ platform }),
);
jest.mock("./tilawa-adapter", () => ({
  createTilawaEngine: (engine: string, assets: unknown, platform: EnginePlatform) =>
    mockCreateTilawaEngine(engine, assets, platform),
}));

type ScriptStub = {
  src?: string;
  async?: boolean;
  dataset: Record<string, string>;
  onload?: () => void;
  onerror?: () => void;
};

const g = globalThis as Record<string, unknown>;
let appended: ScriptStub[];
let existing: ScriptStub | null;

function installDom() {
  appended = [];
  existing = null;
  g.window = g;
  g.document = {
    querySelector: jest.fn(() => existing),
    createElement: jest.fn(() => ({ dataset: {} }) as ScriptStub),
    head: { appendChild: jest.fn((s: ScriptStub) => appended.push(s)) },
  };
}

function loadWebModule() {
  let mod: typeof import("./tilawa.web") | undefined;
  jest.isolateModules(() => {
    mod = require("./tilawa.web");
  });
  return mod as typeof import("./tilawa.web");
}

async function getPlatform() {
  await loadWebModule().createPlatformEngine("tilawa-zipformer", { json: {} });
  return mockCreateTilawaEngine.mock.calls.at(-1)?.[2] as EnginePlatform;
}

function fakeOrt(withWasm = true) {
  return {
    InferenceSession: { create: jest.fn(async () => ({ run: jest.fn(), outputNames: [] })) },
    Tensor: class {},
    env: withWasm ? { wasm: {} } : undefined,
  } as unknown as OrtNamespace;
}

describe("tilawa.web", () => {
  beforeEach(() => {
    mockCreateTilawaEngine.mockClear();
    installDom();
  });

  afterEach(() => {
    delete g.window;
    delete g.document;
    delete g.ort;
  });

  it("detects WebAssembly support only when a window exists", () => {
    const mod = loadWebModule();
    expect(mod.isEngineRuntimeSupported()).toBe(true);
    delete g.window;
    expect(mod.isEngineRuntimeSupported()).toBe(false);
  });

  it("rejects loadOrt when the runtime is unsupported", async () => {
    const mod = loadWebModule();
    await mod.createPlatformEngine("tilawa-zipformer", { json: {} });
    const platform = mockCreateTilawaEngine.mock.calls[0][2];
    delete g.window;
    await expect(platform.loadOrt()).rejects.toMatchObject({ code: "runtime-unsupported" });
  });

  it("injects the same-origin ORT script once and configures single-threaded wasm", async () => {
    const mod = loadWebModule();
    await mod.createPlatformEngine("tilawa-zipformer", { json: {} });
    const platform = mockCreateTilawaEngine.mock.calls[0][2];
    const ort = fakeOrt();
    const first = platform.loadOrt();
    const second = platform.loadOrt();
    expect(appended).toHaveLength(1);
    expect(appended[0].src).toBe("/ort/ort.wasm.min.js");
    expect(appended[0].async).toBe(true);
    expect(appended[0].dataset.munibOrt).toEqual(expect.any(String));
    g.ort = ort;
    appended[0].onload?.();
    await expect(first).resolves.toBe(ort);
    await expect(second).resolves.toBe(ort);
    expect(ort.env?.wasm).toEqual({ wasmPaths: "/ort/", numThreads: 1 });
  });

  it("reuses an existing script tag when ort is already on window", async () => {
    const mod = loadWebModule();
    await mod.createPlatformEngine("tilawa-zipformer", { json: {} });
    const platform = mockCreateTilawaEngine.mock.calls[0][2];
    existing = { dataset: {} };
    const ort = fakeOrt(false);
    g.ort = ort;
    await expect(platform.loadOrt()).resolves.toBe(ort);
    expect(appended).toHaveLength(0);
  });

  it("clears the cached promise after a script error so the next call retries", async () => {
    const mod = loadWebModule();
    await mod.createPlatformEngine("tilawa-zipformer", { json: {} });
    const platform = mockCreateTilawaEngine.mock.calls[0][2];
    const failed = platform.loadOrt();
    appended[0].onerror?.();
    await expect(failed).rejects.toMatchObject({ code: "runtime-unsupported" });

    const retry = platform.loadOrt();
    expect(appended).toHaveLength(2);
    // Script loaded, but no ORT global.
    appended[1].onload?.();
    await expect(retry).rejects.toMatchObject({ code: "runtime-unsupported" });
  });

  it("creates a wasm session from model bytes and requires them", async () => {
    const platform = await getPlatform();
    const ort = fakeOrt();
    await expect(platform.createSession(ort, { json: {} })).rejects.toMatchObject({
      code: "model-missing",
    });
    const bytes = new Uint8Array([1, 2, 3]).buffer;
    await platform.createSession(ort, { json: {}, modelBytes: bytes });
    expect(ort.InferenceSession.create).toHaveBeenCalledWith(new Uint8Array([1, 2, 3]), {
      executionProviders: ["wasm"],
    });
  });
});
