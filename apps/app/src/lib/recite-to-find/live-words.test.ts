import { liveAyahWords } from "./live-words";

const IKHLAS_1 = "قُلْ هُوَ ٱللَّهُ أَحَدٌ";

describe("liveAyahWords", () => {
  it("maps heard engine words onto the bundled words through the alignment", () => {
    const { words, heard } = liveAyahWords(IKHLAS_1, ["قُلْ", "هُوَ", "ٱللَّهُ", "أَحَدٌ"], [0, 1], 4);
    expect(words).toHaveLength(4);
    expect([...heard]).toEqual([0, 1]);
  });

  it("falls back to 1:1 without an engine word list when the counts agree", () => {
    expect([...liveAyahWords(IKHLAS_1, [], [3], 4).heard]).toEqual([3]);
  });

  it("marks nothing when it cannot place the words", () => {
    expect(liveAyahWords(IKHLAS_1, [], [0], 7).heard.size).toBe(0);
    expect(liveAyahWords(IKHLAS_1, [], [], 4).heard.size).toBe(0);
    expect(liveAyahWords("", ["x"], [0], 1).words).toEqual([]);
  });
});
