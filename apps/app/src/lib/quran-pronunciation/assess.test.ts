import fixtures from "@/lib/quran-companion/__fixtures__/alignment-ayahs.json";
import { alignPracticeWords, splitAyahWords } from "@/lib/quran-companion/align-words";
import {
  READ_CLEAR,
  READ_OTHER,
  READ_PADDED,
  READ_SKIPPED,
  READ_SUBSTITUTED,
  TOY_PIECES,
  TOY_THRESHOLDS,
  toyAyah,
  toyLogprobs,
} from "@/test-support/quran-pronunciation";

import { assessAyah, assessAyahDetailed, toStudyVerdicts, wordWindows } from "./assess";
import type { AyahAssessment, PronunciationWordState } from "./types";

const run = (
  frames: readonly (number | null)[],
  mode: "full" | "skipped-only" = "full",
  ayah = 2,
) =>
  assessAyah({
    matrix: toyLogprobs(frames),
    expected: toyAyah(5, ayah),
    pieces: TOY_PIECES,
    thresholds: TOY_THRESHOLDS,
    mode,
  });

const states = (a: AyahAssessment): PronunciationWordState[] =>
  a.status === "ok" ? a.words.map((w) => w.state) : [];

describe("assessAyah (NF-3.24)", () => {
  it("marks a clear reading Clear word by word", () => {
    expect(states(run(READ_CLEAR))).toEqual(["clear", "clear", "clear"]);
  });

  it("flags a substituted word Listen again (full mode) and nothing else", () => {
    expect(states(run(READ_SUBSTITUTED))).toEqual(["clear", "clear", "listen-again"]);
  });

  it("does not flag a substitution in the skipped-only fallback (Not sure instead)", () => {
    expect(states(run(READ_SUBSTITUTED, "skipped-only"))).toEqual(["clear", "clear", "not-sure"]);
  });

  it("flags a skipped word", () => {
    expect(states(run(READ_SKIPPED))[1]).toBe("listen-again");
  });

  it("ignores silence and stray noise around the ayah", () => {
    expect(states(run(READ_PADDED))).toEqual(["clear", "clear", "clear"]);
  });

  it("says it couldn't follow a different passage — no per-word marks", () => {
    expect(run(READ_OTHER)).toEqual({ status: "no-fit", reason: "different-passage" });
  });

  it("says too short when the take can't hold the ayah", () => {
    expect(run([1, 2])).toEqual({ status: "no-fit", reason: "too-short" });
  });

  it("never flags the optional basmala the corpus prepends to a first ayah", () => {
    // 5:1 = [basmala "بسم"] + "بسم ربك قل"; the reader leaves the basmala out.
    const detail = assessAyahDetailed({
      matrix: toyLogprobs(READ_CLEAR),
      expected: toyAyah(5, 1),
      pieces: TOY_PIECES,
      thresholds: TOY_THRESHOLDS,
      mode: "full",
    });
    expect(detail.assessment.status).toBe("ok");
    expect(detail.engineWords).toEqual([1, 2, 3]);
    expect(states(detail.assessment)).toEqual(["clear", "clear", "clear"]);
  });

  it("applies the device offset only to relax flags", () => {
    const relaxed = assessAyah({
      matrix: toyLogprobs(READ_SUBSTITUTED),
      expected: toyAyah(),
      pieces: TOY_PIECES,
      thresholds: TOY_THRESHOLDS,
      mode: "full",
      offset: -3,
    });
    expect(states(relaxed)[2]).toBe("not-sure");
    const tightened = assessAyah({
      matrix: toyLogprobs(READ_CLEAR),
      expected: toyAyah(),
      pieces: TOY_PIECES,
      thresholds: TOY_THRESHOLDS,
      mode: "full",
      offset: 5,
    });
    expect(states(tightened)).toEqual(["clear", "clear", "clear"]);
  });

  it("puts word windows between the words' spikes, in order and non-overlapping", () => {
    const detail = assessAyahDetailed({
      matrix: toyLogprobs(READ_CLEAR),
      expected: toyAyah(),
      pieces: TOY_PIECES,
      thresholds: TOY_THRESHOLDS,
      mode: "full",
    });
    const w = detail.windows;
    expect(w).toHaveLength(3);
    for (let i = 1; i < w.length; i++) {
      expect(w[i].startMs).toBe(w[i - 1].endMs);
      expect(w[i].endMs).toBeGreaterThan(w[i].startMs);
    }
    expect(wordWindows(detail.scores, 11, 0)[0].endMs).toBeLessThan(w[0].endMs);
  });
});

describe("toStudyVerdicts (word grouping via align-words)", () => {
  type Fixture = { bundled: string; engine: string[] };
  const ayahs = fixtures.ayahs as Record<string, Fixture>;

  const okWith = (engineStates: PronunciationWordState[]) =>
    ({
      status: "ok",
      mode: "full",
      words: engineStates.map((state, word) => ({
        word,
        state,
        startMs: word * 100,
        endMs: word * 100 + 100,
      })),
    }) as const;

  it.each(Object.keys(ayahs))("maps %s's engine words onto study words", (key) => {
    const f = ayahs[key];
    const study = splitAyahWords(f.bundled);
    const alignment = alignPracticeWords(f.bundled, study, f.engine);
    const engineStates = f.engine.map((_, i) =>
      i === 0 ? "listen-again" : "clear",
    ) as PronunciationWordState[];
    const verdicts = toStudyVerdicts(okWith(engineStates), alignment.studyToEngine);
    expect(verdicts).toHaveLength(study.length);
    for (const v of verdicts) {
      const engine = alignment.studyToEngine[v.index];
      if (!engine.length) expect(v.state).toBe("not-sure");
      else if (engine.includes(0)) expect(v.state).toBe("listen-again");
      else expect(v.state).toBe("clear");
    }
  });

  it("joins: a study word covered by two engine words takes the worst state and spans both", () => {
    const verdicts = toStudyVerdicts(okWith(["clear", "not-sure"]), [[0, 1]]);
    expect(verdicts).toEqual([{ index: 0, state: "not-sure", startMs: 0, endMs: 200 }]);
  });

  it("leaves an unmapped study word Not sure (never a guessed flag)", () => {
    expect(toStudyVerdicts(okWith(["listen-again"]), [[]])).toEqual([
      { index: 0, state: "not-sure" },
    ]);
  });
});
