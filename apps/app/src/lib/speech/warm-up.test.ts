import type { OrtNamespace } from "@/lib/quran-companion/engine/types";

import { FASTCONFORMER_VOCAB_SIZE, type OrtInferenceSession } from "./fastconformer-runner";
import { WARM_UP_SAMPLES, warmUpKind, warmUpSpeechSession } from "./warm-up";

// `@tilawa/core` only exposes an ESM `import` condition; a virtual mock stands in.
const mockAccept = jest.fn(async (_frames: Float32Array[]) => ({ frames: 1 }));
const mockFromSession = jest.fn((_session: unknown, _io: unknown, _tensor: unknown) => ({
  accept: mockAccept,
}));
jest.mock(
  "@tilawa/core",
  () => ({
    DEFAULT_ZIPFORMER_IO: { T: 61, featureDim: 80 },
    ZipformerRunner: {
      fromSession: (session: unknown, io: unknown, tensor: unknown) =>
        mockFromSession(session, io, tensor),
    },
  }),
  { virtual: true },
);

class FakeTensor {
  constructor(
    readonly type: string,
    readonly data: unknown,
    readonly dims: readonly number[],
  ) {}
}
const ort = { Tensor: FakeTensor } as unknown as Pick<OrtNamespace, "Tensor">;

function session(inputNames: string[] | undefined, run?: jest.Mock): OrtInferenceSession {
  return {
    inputNames,
    outputNames: ["log_probs"],
    run:
      run ??
      jest.fn(async () => ({
        log_probs: {
          data: new Float32Array(FASTCONFORMER_VOCAB_SIZE),
          dims: [1, 1, FASTCONFORMER_VOCAB_SIZE],
        },
      })),
    release: jest.fn(async () => {}),
  } as unknown as OrtInferenceSession;
}

beforeEach(() => {
  mockAccept.mockClear();
  mockFromSession.mockClear();
});

describe("speech session warm-up", () => {
  it("picks the feed from the graph's input names", () => {
    expect(warmUpKind({ inputNames: ["audio_signal", "length"] })).toBe("fastconformer");
    expect(warmUpKind({ inputNames: ["x", "cached_key_0", "processed_lens"] })).toBe("zipformer");
    expect(warmUpKind({ inputNames: ["input"] })).toBeNull();
    expect(warmUpKind({})).toBeNull();
  });

  it("runs half a second of silence through the FastConformer feed without releasing", async () => {
    const s = session(["audio_signal", "length"]);
    await expect(warmUpSpeechSession(ort, s)).resolves.toBe("fastconformer");
    const feeds = (s.run as jest.Mock).mock.calls[0][0] as Record<string, FakeTensor>;
    expect(feeds.audio_signal.dims).toEqual([1, WARM_UP_SAMPLES]);
    expect(Array.from(feeds.length.data as BigInt64Array)).toEqual([BigInt(WARM_UP_SAMPLES)]);
    expect(s.release).not.toHaveBeenCalled();
  });

  it("runs one Zipformer chunk of zero frames through Tilawa's runner", async () => {
    const s = session(["x", "cached_key_0"]);
    await expect(warmUpSpeechSession(ort, s)).resolves.toBe("zipformer");
    expect(mockFromSession).toHaveBeenCalledWith(s, { T: 61, featureDim: 80 }, FakeTensor);
    const frames = mockAccept.mock.calls[0][0];
    expect(frames).toHaveLength(61);
    expect(frames[0]).toEqual(new Float32Array(80));
    expect(s.release).not.toHaveBeenCalled();
  });

  it("never throws into the caller", async () => {
    const failing = session(
      ["audio_signal", "length"],
      jest.fn(async () => {
        throw new Error("oom");
      }),
    );
    await expect(warmUpSpeechSession(ort, failing)).resolves.toBeNull();
    await expect(warmUpSpeechSession(ort, session(undefined))).resolves.toBeNull();
  });
});
