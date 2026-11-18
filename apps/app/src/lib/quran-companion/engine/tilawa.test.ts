import { createPlatformEngine, isEngineRuntimeSupported } from "./tilawa.ts";
import { createUnavailableEngine } from "./unavailable";

describe("tilawa fallback platform", () => {
  it("has no runtime and refuses to build an engine", async () => {
    expect(isEngineRuntimeSupported()).toBe(false);
    await expect(createPlatformEngine("tilawa-zipformer", { json: {} })).rejects.toMatchObject({
      code: "runtime-unsupported",
    });
  });
});

describe("createUnavailableEngine", () => {
  it("is listen-only: reports model-missing on start and never emits positions", async () => {
    const engine = createUnavailableEngine();
    expect(engine.id).toBe("tilawa-zipformer");
    expect(engine.ready).toBe(false);
    expect(engine.confirmsMismatches).toBe(false);
    expect(engine.engineWords(1, 1)).toEqual([]);

    const listener = jest.fn();
    const unsubscribe = engine.subscribe(listener);
    await engine.start({ surah: 1, ayahStart: 1, ayahEnd: 7 }, "tracking");
    expect(listener).toHaveBeenCalledWith({ type: "failed", code: "model-missing" });

    engine.feed(new Float32Array(10));
    await engine.stop();
    unsubscribe();
    await engine.start({ surah: 1, ayahStart: 1, ayahEnd: 7 }, "tracking");
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("keeps the requested id and clears listeners on dispose", async () => {
    const engine = createUnavailableEngine("tilawa-fastconformer");
    expect(engine.id).toBe("tilawa-fastconformer");
    const listener = jest.fn();
    engine.subscribe(listener);
    await engine.dispose();
    await engine.start({ surah: 1, ayahStart: 1, ayahEnd: 1 }, "correction");
    expect(listener).not.toHaveBeenCalled();
  });
});
