import fixtures from "./__fixtures__/alignment-ayahs.json";
import { alignPracticeWords, foldArabicWord, splitAyahWords, studyIndexesFor } from "./align-words";

type Fixture = { bundled: string; engine: string[] };
const ayahs = fixtures.ayahs as Record<string, Fixture>;

function align(key: string) {
  const f = ayahs[key];
  const study = splitAyahWords(f.bundled);
  return { study, engine: f.engine, alignment: alignPracticeWords(f.bundled, study, f.engine) };
}

function expectIdentity(key: string) {
  const { study, engine, alignment } = align(key);
  expect(study).toHaveLength(engine.length);
  for (const [e, s] of alignment.engineToStudy.entries()) expect(s).toEqual([e]);
  for (const [s, e] of alignment.studyToEngine.entries()) expect(e).toEqual([s]);
}

describe("alignPracticeWords (§6)", () => {
  it.each(["1:1", "1:2", "1:3", "1:4", "1:5", "1:6", "1:7"])(
    "maps Al-Fatiha %s one-to-one after folding",
    expectIdentity,
  );

  it("maps Ayat al-Kursi (2:255)", () => expectIdentity("2:255"));

  it("maps At-Tawbah 9:1 with no basmala prepended", () => {
    const { study } = align("9:1");
    expect(foldArabicWord(study[0])).not.toBe(foldArabicWord("بِسۡمِ"));
    expectIdentity("9:1");
  });

  it("covers the whole disconnected-letters token in 2:1", () => {
    const { alignment, study } = align("2:1");
    expect(study).toHaveLength(1);
    expect(alignment.studyToEngine[0].length).toBeGreaterThan(0);
  });

  it("handles the longest ayah (2:282) quickly", () => {
    const start = Date.now();
    expectIdentity("2:282");
    expect(Date.now() - start).toBeLessThan(200);
  });

  it("joins a study word the engine splits in two (15:7 لَّوۡمَا → لَّوْ + مَا)", () => {
    const { alignment } = align("15:7");
    expect(alignment.studyToEngine[0]).toEqual([0, 1]);
    expect(alignment.engineToStudy[0]).toEqual([0]);
    expect(alignment.engineToStudy[1]).toEqual([0]);
    expect(alignment.engineToStudy[2]).toEqual([1]);
  });

  it("groups a split study row the engine keeps whole (2:72)", () => {
    const { alignment, study, engine } = align("2:72");
    expect(study.length).toBe(engine.length + 1);
    // Every engine word maps somewhere; nothing maps out of order.
    let last = -1;
    for (const s of alignment.engineToStudy) {
      expect(s.length).toBeGreaterThan(0);
      expect(Math.min(...s)).toBeGreaterThanOrEqual(last);
      last = Math.max(...s);
    }
  });

  it("leaves an unmapped study word neutral (empty), never guessed", () => {
    const alignment = alignPracticeWords("", ["بِسۡمِ", "زَيۡدٌ", "ٱللَّهِ"], ["بِسْمِ", "ٱللَّهِ"]);
    expect(alignment.studyToEngine[1]).toEqual([]);
    expect(studyIndexesFor(alignment, [0, 1])).toEqual([0, 2]);
  });

  it("ignores harakat and hamza-alef variants when comparing", () => {
    expect(foldArabicWord("ٱلرَّحۡمَٰنِ")).toBe(foldArabicWord("الرحمن"));
  });

  it("drops marks-only tokens (waqf signs) from the study row", () => {
    expect(splitAyahWords("كَلِمَةٌ ۚ أُخۡرَىٰ")).toHaveLength(2);
  });
});

describe("alignPracticeWords divergence", () => {
  const alignOf = (study: string[], engine: string[]) => alignPracticeWords("", study, engine);

  it("links a close misspelling inside an equal-length gap", () => {
    const { engineToStudy } = alignOf(["الرحمان", "الرحيم"], ["الرحمن", "الرحيم"]);
    expect(engineToStudy).toEqual([[0], [1]]);
  });

  it("leaves a dissimilar pair unmapped", () => {
    const { engineToStudy } = alignOf(["قلم", "الرحيم"], ["كتابهم", "الرحيم"]);
    expect(engineToStudy).toEqual([[], [1]]);
  });

  it("skips an unequal gap without guessing", () => {
    const { studyToEngine } = alignOf(["أ", "ب", "ج", "د"], ["س", "د"]);
    expect(studyToEngine[3]).toEqual([1]);
    expect(studyToEngine.slice(0, 3)).toEqual([[], [], []]);
  });

  it("handles an empty side", () => {
    expect(alignOf([], ["س"]).engineToStudy).toEqual([[]]);
  });
});
