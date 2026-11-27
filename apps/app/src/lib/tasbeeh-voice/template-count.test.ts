import {
  concatPcm,
  feedInChunks,
  hush,
  syllable,
  syntheticPhrase,
  VOWELS,
  withPauses,
} from "@/test-support/tasbeeh-voice";

import { buildPattern, MAX_LEARNED_TEMPLATES, sampleFeatures, type TaughtPattern } from "./matcher";
import {
  createTeachRecorder,
  createTemplateCounter,
  OPEN_BURST_HOP_MS,
  SETTLE_MS,
} from "./template-count";

const TAUGHT = ["a", "i", "u", "e"] as const;
const OTHER = ["o", "e", "a", "a"] as const;

/** Patterns are immutable (learning returns a new one): build the taught one once per file. */
let taught: TaughtPattern | undefined;
function pattern(): TaughtPattern {
  taught ??= buildPattern(
    [0.95, 1.05, 1]
      .map((stretch) => sampleFeatures(withPauses([syntheticPhrase(TAUGHT, { stretch })])))
      .filter((t) => t != null),
  );
  return taught;
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

/** Feeds in 20 ms chunks and records the audio time (ms) at which each hit landed. */
function feedTimed(
  counter: ReturnType<typeof createTemplateCounter>,
  pcm: Float32Array,
  hits: number[],
) {
  for (let i = 0; i < pcm.length; i += 320) {
    const before = hits.length;
    counter.feed(pcm.subarray(i, i + 320));
    if (hits.length > before) {
      for (let k = before; k < hits.length; k++) hits[k] = counter.audioMs;
    }
  }
}

describe("template counter timing (synthetic features)", () => {
  it("searches the open burst every ~250 ms with a short settle", () => {
    expect(OPEN_BURST_HOP_MS).toBeLessThanOrEqual(250);
    expect(SETTLE_MS).toBeLessThanOrEqual(300);
  });

  it("lands each back-to-back count ~0.3–0.55 s after that repeat ends", async () => {
    const hits: number[] = [];
    const counter = createTemplateCounter({
      pattern: pattern(),
      onHit: () => hits.push(-1),
    });
    const fast = syntheticPhrase(TAUGHT, { stretch: 0.85 });
    const repeatMs = (fast.length / 16_000) * 1000;
    feedTimed(counter, concatPcm(hush(500), fast, fast, fast, fast, hush(900)), hits);
    await counter.finish();
    expect(hits).toHaveLength(4);
    hits.forEach((at, i) => {
      const end = 500 + repeatMs * (i + 1);
      const latency = at - end;
      expect(latency).toBeGreaterThanOrEqual(0);
      expect(latency).toBeLessThanOrEqual(SETTLE_MS + OPEN_BURST_HOP_MS + 40);
    });
  });

  it("lands a count about the VAD hangover after a paused repeat", async () => {
    const hits: number[] = [];
    const counter = createTemplateCounter({ pattern: pattern(), onHit: () => hits.push(-1) });
    const phrase = syntheticPhrase(TAUGHT);
    const phraseMs = (phrase.length / 16_000) * 1000;
    feedTimed(counter, withPauses([phrase, phrase]), hits);
    await counter.finish();
    expect(hits).toHaveLength(2);
    const firstEnd = 500 + phraseMs;
    expect(hits[0] - firstEnd).toBeLessThanOrEqual(560);
    const secondEnd = 500 + phraseMs + 600 + phraseMs;
    expect(hits[1] - secondEnd).toBeLessThanOrEqual(560);
  });
});

/** The taught zikr with an uneven syllable rhythm (long-short-long-short). */
function unevenRepeat() {
  return concatPcm(
    syllable(VOWELS.a, 280),
    syllable(VOWELS.i, 90),
    syllable(VOWELS.u, 240),
    syllable(VOWELS.e, 100),
  );
}

describe("adaptive templates", () => {
  it("learns a confident repeat as an extra feature template, capped", async () => {
    const learned: TaughtPattern[] = [];
    const onHit = jest.fn();
    const counter = createTemplateCounter({
      pattern: pattern(),
      onHit,
      onPatternLearned: (next) => learned.push(next),
    });
    // Said with a different rhythm than any taught take: a confident match
    // (well under the threshold) that is still not a near-copy of a template.
    const repeat = unevenRepeat();
    feedInChunks(counter, withPauses(new Array(6).fill(repeat)));
    await counter.finish();
    expect(onHit).toHaveBeenCalledTimes(6);
    expect(learned.length).toBeGreaterThanOrEqual(1);
    const last = learned[learned.length - 1];
    expect(last.templates).toHaveLength(3);
    expect(last.learned?.length).toBeGreaterThanOrEqual(1);
    expect(last.learned?.length).toBeLessThanOrEqual(MAX_LEARNED_TEMPLATES);
    // Features only: plain numeric matrices, never PCM.
    expect(last.learned?.[0].dim).toBe(last.templates[0].dim);
  });

  it("still ignores a different zikr after learning", async () => {
    let current = pattern();
    const first = createTemplateCounter({
      pattern: current,
      onHit: () => {},
      onPatternLearned: (next) => {
        current = next;
      },
    });
    feedInChunks(first, withPauses(new Array(4).fill(unevenRepeat())));
    await first.finish();
    expect(current.learned?.length).toBeGreaterThanOrEqual(1);
    const onHit = jest.fn();
    const counter = createTemplateCounter({ pattern: current, onHit });
    feedInChunks(counter, withPauses([syntheticPhrase(OTHER), syntheticPhrase(OTHER)]));
    await counter.finish();
    expect(onHit).not.toHaveBeenCalled();
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
