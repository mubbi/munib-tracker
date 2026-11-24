import {
  concatPcm,
  feedInChunks,
  hush,
  syntheticPhrase,
  withPauses,
} from "@/test-support/tasbeeh-voice";

import { buildPattern, sampleFeatures } from "./matcher";
import { createTeachRecorder, createTemplateCounter } from "./template-count";

const TAUGHT = ["a", "i", "u", "e"] as const;
const OTHER = ["o", "e", "a", "a"] as const;

function pattern() {
  const takes = [0.95, 1.05, 1]
    .map((stretch) => sampleFeatures(withPauses([syntheticPhrase(TAUGHT, { stretch })])))
    .filter((t) => t != null);
  return buildPattern(takes);
}

describe("template counter (streaming)", () => {
  it("counts each repeat said with pauses, once", async () => {
    const onHit = jest.fn();
    const counter = createTemplateCounter({ pattern: pattern(), onHit });
    feedInChunks(
      counter,
      withPauses([
        syntheticPhrase(TAUGHT),
        syntheticPhrase(TAUGHT, { stretch: 1.1 }),
        syntheticPhrase(TAUGHT),
      ]),
    );
    await counter.finish();
    expect(onHit).toHaveBeenCalledTimes(3);
  });

  it("counts fast repeats with no pause between them", async () => {
    const onHit = jest.fn();
    const counter = createTemplateCounter({ pattern: pattern(), onHit });
    const fast = syntheticPhrase(TAUGHT, { stretch: 0.85 });
    feedInChunks(counter, concatPcm(hush(500), fast, fast, fast, fast, hush(900)));
    await counter.finish();
    expect(onHit).toHaveBeenCalledTimes(4);
  });

  it("ignores a different zikr and silence", async () => {
    const onHit = jest.fn();
    const counter = createTemplateCounter({ pattern: pattern(), onHit });
    feedInChunks(counter, withPauses([syntheticPhrase(OTHER), syntheticPhrase(OTHER)]));
    feedInChunks(counter, hush(3000));
    await counter.finish();
    expect(onHit).not.toHaveBeenCalled();
  });

  it("ignores repeats during a screen-reader mute", async () => {
    const onHit = jest.fn();
    const counter = createTemplateCounter({ pattern: pattern(), onHit });
    counter.mute(5000);
    feedInChunks(counter, withPauses([syntheticPhrase(TAUGHT)]));
    await counter.finish();
    expect(onHit).not.toHaveBeenCalled();
  });

  it("reports speech and level, and stops after dispose", async () => {
    const onHit = jest.fn();
    const onSpeech = jest.fn();
    const onLevel = jest.fn();
    const counter = createTemplateCounter({ pattern: pattern(), onHit, onSpeech, onLevel });
    counter.dispose();
    feedInChunks(counter, withPauses([syntheticPhrase(TAUGHT)]));
    expect(onHit).not.toHaveBeenCalled();
    const live = createTemplateCounter({ pattern: pattern(), onHit, onSpeech, onLevel });
    feedInChunks(live, withPauses([syntheticPhrase(TAUGHT)]));
    expect(onSpeech).toHaveBeenCalledWith(true);
    expect(onSpeech).toHaveBeenCalledWith(false);
    expect(onLevel).toHaveBeenCalled();
  });
});

describe("teach recorder", () => {
  it("hands over one sample per spoken burst (in memory only)", async () => {
    const onSample = jest.fn();
    const recorder = createTeachRecorder({ onSample });
    feedInChunks(recorder, withPauses([syntheticPhrase(TAUGHT), syntheticPhrase(TAUGHT)]));
    await recorder.finish();
    expect(onSample).toHaveBeenCalledTimes(2);
    const sample = onSample.mock.calls[0][0] as Float32Array;
    expect(sampleFeatures(sample)).not.toBeNull();
  });

  it("flags speech that runs far longer than one zikr", async () => {
    const onSample = jest.fn();
    const onTooLong = jest.fn();
    const recorder = createTeachRecorder({ onSample, onTooLong });
    // ~11 s of talking: syllables with short gaps (speech dips, so the VAD stays on).
    const talking = concatPcm(
      ...Array.from({ length: 50 }, (_, i) =>
        concatPcm(syntheticPhrase([i % 2 ? "a" : "o"], { ms: 160 }), hush(60)),
      ),
    );
    feedInChunks(recorder, withPauses([talking]));
    await recorder.finish();
    expect(onTooLong).toHaveBeenCalledTimes(1);
    expect(onSample).not.toHaveBeenCalled();
  });
});
