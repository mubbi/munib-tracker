import { AppState } from "react-native";

import {
  acquireSpeechSession,
  releaseIdleSpeechSessions,
  SPEECH_SESSION_IDLE_MS,
  type SpeechSession,
  speechSessionKey,
  speechSessionStats,
} from "./session-cache";

type FakeSession = SpeechSession & { release: jest.Mock; run: jest.Mock };

function fakeSession(): FakeSession {
  return {
    run: jest.fn(async () => ({ out: { data: new Float32Array(1), dims: [1] } })),
    release: jest.fn(async () => {}),
    outputNames: ["out"],
    inputNames: ["in"],
  } as unknown as FakeSession;
}

let changeListener: ((state: string) => void) | null = null;

beforeAll(() => {
  jest.spyOn(AppState, "addEventListener").mockImplementation(((
    _type: string,
    listener: (state: string) => void,
  ) => {
    changeListener = listener;
    return { remove: jest.fn() };
  }) as never);
});

beforeEach(() => jest.useFakeTimers());

afterEach(async () => {
  jest.useRealTimers();
  await releaseIdleSpeechSessions();
});

describe("speech session cache", () => {
  it("creates once per key, counts holders and frees the session an idle minute after the last release", async () => {
    const session = fakeSession();
    const create = jest.fn(async () => session);
    const [a, b] = await Promise.all([
      acquireSpeechSession("fc", create),
      acquireSpeechSession("fc", create),
    ]);
    expect(create).toHaveBeenCalledTimes(1);
    expect(speechSessionStats()).toEqual([{ key: "fc", refs: 2 }]);

    await a.release?.();
    await a.release?.(); // idempotent per lease
    expect(speechSessionStats()).toEqual([{ key: "fc", refs: 1 }]);
    await b.release?.();
    await jest.advanceTimersByTimeAsync(SPEECH_SESSION_IDLE_MS - 1);
    expect(session.release).not.toHaveBeenCalled();

    // Re-acquired inside the idle window: same session, timer cancelled.
    const c = await acquireSpeechSession("fc", create);
    await jest.advanceTimersByTimeAsync(SPEECH_SESSION_IDLE_MS * 2);
    expect(create).toHaveBeenCalledTimes(1);
    expect(session.release).not.toHaveBeenCalled();

    await c.release?.();
    await jest.advanceTimersByTimeAsync(SPEECH_SESSION_IDLE_MS);
    expect(session.release).toHaveBeenCalledTimes(1);
    expect(speechSessionStats()).toEqual([]);
  });

  it("releases idle sessions of other models before creating a new one, never held ones", async () => {
    const zipformer = fakeSession();
    const fastconformer = fakeSession();
    const other = fakeSession();
    const z = await acquireSpeechSession("zip", async () => zipformer);
    await z.release?.();
    const held = await acquireSpeechSession("other", async () => other);

    const create = jest.fn(async () => {
      // The idle Zipformer is gone before FastConformer loads; the held one stays.
      expect(zipformer.release).toHaveBeenCalledTimes(1);
      expect(other.release).not.toHaveBeenCalled();
      return fastconformer;
    });
    const fc = await acquireSpeechSession("fc", create);
    expect(speechSessionStats().map((s) => s.key)).toEqual(["other", "fc"]);
    await fc.release?.();
    await held.release?.();
  });

  it("releases idle sessions when the app goes to the background", async () => {
    const session = fakeSession();
    const lease = await acquireSpeechSession("fc", async () => session);
    changeListener?.("background");
    await Promise.resolve();
    expect(session.release).not.toHaveBeenCalled(); // still held

    await lease.release?.();
    changeListener?.("background");
    await jest.advanceTimersByTimeAsync(0);
    expect(session.release).toHaveBeenCalledTimes(1);
  });

  it("does not cache a failed creation", async () => {
    const create = jest
      .fn<Promise<SpeechSession>, []>()
      .mockRejectedValueOnce(new Error("bad graph"))
      .mockResolvedValueOnce(fakeSession());
    await expect(acquireSpeechSession("fc", create)).rejects.toThrow("bad graph");
    expect(speechSessionStats()).toEqual([]);
    const lease = await acquireSpeechSession("fc", create);
    expect(create).toHaveBeenCalledTimes(2);
    await lease.release?.();
  });

  it("serialises runs on a shared session and refuses runs after release", async () => {
    const order: string[] = [];
    const session = fakeSession();
    let finishFirst: () => void = () => {};
    session.run
      .mockImplementationOnce(async () => {
        order.push("first:start");
        await new Promise<void>((r) => {
          finishFirst = r;
        });
        order.push("first:end");
        return {};
      })
      .mockImplementationOnce(async () => {
        order.push("second");
        return {};
      });
    const a = await acquireSpeechSession("fc", async () => session);
    const b = await acquireSpeechSession("fc", async () => session);
    const first = a.run({});
    const second = b.run({});
    await jest.advanceTimersByTimeAsync(0);
    expect(order).toEqual(["first:start"]);
    finishFirst();
    await Promise.all([first, second]);
    expect(order).toEqual(["first:start", "first:end", "second"]);

    await a.release?.();
    await expect(a.run({})).rejects.toThrow("released");
    await b.release?.();
  });

  it("keys native models by path and web models by size + content", () => {
    expect(speechSessionKey({ json: {}, modelPath: "/m.onnx" })).toBe("path:/m.onnx");
    const one = speechSessionKey({ json: {}, modelBytes: new Uint8Array([1, 2, 3]).buffer });
    expect(one).toBe(speechSessionKey({ json: {}, modelBytes: new Uint8Array([1, 2, 3]).buffer }));
    expect(one).not.toBe(
      speechSessionKey({ json: {}, modelBytes: new Uint8Array([1, 2, 4]).buffer }),
    );
    expect(speechSessionKey({ json: {} })).toBeNull();
  });
});
