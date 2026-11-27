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

// Init failures happen before `await import("@tilawa/core")`; the wiring past it
// runs against the virtual `@tilawa/core` mock further down.
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

// `@tilawa/core` only exposes an ESM `import` condition, so Jest cannot resolve
// it; a virtual mock stands in for the Zipformer session.
type Msg = { type: string; [key: string]: unknown };
const mockZipformer = {
  feed: jest.fn(async (_samples: Float32Array): Promise<Msg[]> => []),
  stop: jest.fn(async (): Promise<Msg[]> => []),
  reset: jest.fn((): Msg[] => []),
  setMode: jest.fn((_mode: string): Msg[] => []),
  setExpected: jest.fn(),
  correct: jest.fn((): Msg[] => []),
};
const mockCreateZipformerSession = jest.fn(async (_opts: Record<string, unknown>) => mockZipformer);
jest.mock(
  "@tilawa/core",
  () => ({
    createZipformerSession: (opts: Record<string, unknown>) => mockCreateZipformerSession(opts),
    createRecognitionSession: jest.fn(),
  }),
  { virtual: true },
);

const PASSAGE = { surah: 2, ayahStart: 255, ayahEnd: 255 };
/** Half a second of 16 kHz audio: one full 480 ms chunk for the adapter. */
const HALF_SECOND = new Float32Array(8000);

async function feedAndStop(engine: Awaited<ReturnType<typeof createTilawaEngine>>) {
  engine.feed(HALF_SECOND);
  await engine.stop();
}

describe("createTilawaEngine session options", () => {
  beforeEach(() => {
    mockCreateZipformerSession.mockClear();
    for (const fn of Object.values(mockZipformer)) fn.mockClear();
  });

  it("practice: stays on the surah, sets the expected passage, drops verse messages", async () => {
    mockZipformer.feed.mockResolvedValueOnce([
      { type: "verse_match", surah: 2, ayah: 255, confidence: 0.9 },
      {
        type: "word_progress",
        surah: 2,
        ayah: 255,
        word_index: 1,
        total_words: 50,
        matched_indices: [0, 1],
      },
    ]);
    const engine = await createTilawaEngine("tilawa-zipformer", ASSETS, makePlatform());
    expect(mockCreateZipformerSession).toHaveBeenCalledWith(
      expect.objectContaining({ stayOnSurah: true }),
    );
    const events: string[] = [];
    engine.subscribe((e) => events.push(e.type));
    await engine.start(PASSAGE, "correction");
    expect(mockZipformer.setMode).toHaveBeenCalledWith("correction");
    expect(mockZipformer.setExpected).toHaveBeenCalledWith({ surah: 2, ayah: 255, ayahEnd: 255 });
    await feedAndStop(engine);
    expect(events).toEqual(["started", "position", "completed"]);
    await engine.dispose();
  });

  it("free recitation: relocates anywhere, tracking only, no passage, verse events", async () => {
    mockZipformer.feed.mockResolvedValueOnce([
      {
        type: "verse_candidate",
        candidates: [{ surah: 2, ayah: 255, confidence: 0.5, rank: 0, source: "discovery" }],
        stable: false,
        final_flush: false,
      },
      { type: "verse_match", surah: 2, ayah: 255, confidence: 0.92 },
    ]);
    mockZipformer.stop.mockResolvedValueOnce([
      { type: "final_sequence", verses: [{ surah: 2, ayah: 255, confidence: 1 }], confidence: 1 },
    ]);
    const engine = await createTilawaEngine("tilawa-zipformer", ASSETS, makePlatform(), {
      freeRecitation: true,
    });
    expect(mockCreateZipformerSession).toHaveBeenCalledWith(
      expect.objectContaining({ stayOnSurah: false }),
    );
    expect(engine.confirmsMismatches).toBe(false);
    const events: unknown[] = [];
    engine.subscribe((e) => events.push(e));
    // A correction request is ignored: free lookup never checks against a passage.
    await engine.start(PASSAGE, "correction");
    expect(mockZipformer.setMode).toHaveBeenCalledWith("tracking");
    expect(mockZipformer.setExpected).toHaveBeenCalledWith(null);
    await feedAndStop(engine);
    expect(events).toEqual([
      { type: "started" },
      {
        type: "verseCandidates",
        candidates: [{ surah: 2, ayah: 255, confidence: 0.5 }],
        stable: false,
        final: false,
      },
      { type: "verseMatch", surah: 2, ayah: 255, confidence: 0.92 },
      { type: "verseSequence", verses: [{ surah: 2, ayah: 255, confidence: 1 }] },
      { type: "completed" },
    ]);
    await engine.dispose();
  });
});
