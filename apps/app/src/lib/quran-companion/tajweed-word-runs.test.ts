import type { TajweedSegment } from "@munib-tracker/shared/types";

import { bundledAyahWords, markupSegments } from "@/test-support/tajweed-coaching";

import { markupWordRuns, studyWordTajweedRuns } from "./tajweed-word-runs";

// Words come from the bundled corpus (by reference); the markup is synthetic.
const WORDS = bundledAyahWords(112, 3);

describe("markupWordRuns", () => {
  it("splits markup into words with their runs and drops marks-only tokens", () => {
    const words = markupWordRuns(markupSegments(WORDS, { 1: "qalqalah" }));
    expect(words.map((w) => w.text)).toEqual(WORDS);
    expect(words[1]?.runs).toEqual([{ text: WORDS[1], rule: "qalqalah" }]);
    expect(words[0]?.runs).toEqual([{ text: WORDS[0] }]);
  });

  it("keeps letter-level runs inside one word", () => {
    const word = WORDS[0] ?? "";
    const segments: TajweedSegment[] = [
      { text: word.slice(0, 2) },
      { text: word.slice(2), rule: "ghunnah" },
    ];
    expect(markupWordRuns(segments)[0]?.runs).toEqual([
      { text: word.slice(0, 2) },
      { text: word.slice(2), rule: "ghunnah" },
    ]);
  });
});

describe("studyWordTajweedRuns", () => {
  it("is all plain without markup", () => {
    expect(studyWordTajweedRuns(null, WORDS)).toEqual(WORDS.map(() => null));
  });

  it("uses the markup runs for identical 1:1 words and leaves rule-free words plain", () => {
    const runs = studyWordTajweedRuns(markupSegments(WORDS, { 2: "ikhafa" }), WORDS);
    expect(runs[2]).toEqual([{ text: WORDS[2], rule: "ikhafa" }]);
    expect(runs[0]).toBeNull();
    // The drawn text is always the study word itself.
    expect(runs[2]?.map((r) => r.text).join("")).toBe(WORDS[2]);
  });

  it("colours a whole word with its rule when the markup spelling differs", () => {
    const study = [...WORDS];
    // A markup copy of word 1 with an extra mark: same letters, different glyphs.
    const markup = WORDS.map((w, i) => (i === 1 ? `${w}ٰ` : w));
    const runs = studyWordTajweedRuns(markupSegments(markup, { 1: "qalqalah" }), study);
    expect(runs[1]).toEqual([{ text: study[1], rule: "qalqalah" }]);
  });

  it("never guesses: an unmatched study word stays plain", () => {
    const runs = studyWordTajweedRuns(markupSegments(["لا"], { 0: "ghunnah" }), WORDS);
    expect(runs.every((r) => r === null)).toBe(true);
  });
});
