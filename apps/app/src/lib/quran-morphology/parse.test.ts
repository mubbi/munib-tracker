import { readQacFixture } from "@/test-support/quran-morphology";

import {
  extractCopyrightNotice,
  parseMorphologyRow,
  parseMorphologyWords,
  QacWordAssembler,
} from "./parse";

const words = parseMorphologyWords(readQacFixture());
const word = (surah: number, ayah: number, n: number) =>
  words.find((w) => w.surah === surah && w.ayah === ayah && w.word === n);

describe("QAC morphology parser", () => {
  it("skips the copyright blocks and the header row", () => {
    expect(parseMorphologyRow("# PLEASE DO NOT REMOVE OR CHANGE THIS COPYRIGHT BLOCK")).toBeNull();
    expect(parseMorphologyRow("LOCATION\tFORM\tTAG\tFEATURES")).toBeNull();
    expect(parseMorphologyRow("")).toBeNull();
  });

  it("joins segments into whole words, in corpus order", () => {
    // Al-Fatiha has 29 words; Al-Baqarah 1–5 has 1 + 7 + 11 + 14 + 10 here.
    expect(words.filter((w) => w.surah === 1)).toHaveLength(29);
    expect(word(1, 1, 1)?.form).toBe("bisomi");
    expect(word(1, 1, 3)?.form).toBe("{lr~aHoma`ni");
  });

  it("takes ROOT and LEM from the stem segment", () => {
    expect(word(1, 1, 3)?.stems).toEqual([{ root: "rHm", lemma: "r~aHoma`n", pos: "ADJ" }]);
    expect(word(1, 2, 3)?.stems[0]).toMatchObject({ root: "rbb", lemma: "rab~" });
  });

  it("keeps rootless words rootless (particles, pronouns)", () => {
    // 2:5 word 7 is the pronoun humu; the dataset gives it a POS but no ROOT.
    expect(word(2, 5, 7)?.stems).toEqual([{ root: null, lemma: null, pos: "PRON" }]);
    expect(word(1, 5, 1)?.stems[0].root).toBeNull();
  });

  it("assembles identically whatever the chunking (streaming)", () => {
    const assembler = new QacWordAssembler();
    const streamed = [];
    for (const line of readQacFixture().split("\n")) {
      const done = assembler.push(line);
      if (done) streamed.push(done);
    }
    const last = assembler.finish();
    if (last) streamed.push(last);
    expect(streamed).toEqual(words);
  });

  it("tolerates CRLF rows", () => {
    const crlf = parseMorphologyWords(readQacFixture().replace(/\n/g, "\r\n"));
    expect(crlf).toEqual(words);
  });

  it("extracts both copyright blocks verbatim", () => {
    const notice = extractCopyrightNotice(readQacFixture());
    expect(notice).toContain("Quranic Arabic Corpus (morphology, version 0.4)");
    expect(notice).toContain("CHANGING IT IS NOT ALLOWED");
    expect(notice).toContain("http://corpus.quran.com");
    expect(notice).toContain("Tanzil Quran Text (Uthmani, version 1.0.2)");
    expect(notice).not.toContain("LOCATION");
  });
});
