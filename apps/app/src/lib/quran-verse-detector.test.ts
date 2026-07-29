import * as quran from "@/lib/quran";
import {
  __setQuranModuleForDetectorTests,
  detectQuranVerses,
  detectVerseInputLang,
  segmentHighlightedText,
} from "@/lib/quran-verse-detector";

beforeAll(() => {
  __setQuranModuleForDetectorTests(quran);
});

describe("detectVerseInputLang", () => {
  it("detects Arabic script", () => {
    expect(detectVerseInputLang("بسم الله الرحمن الرحيم")).toBe("ar");
  });

  it("detects English script", () => {
    expect(detectVerseInputLang("In the name of Allah, the Entirely Merciful")).toBe("en");
  });
});

describe("segmentHighlightedText", () => {
  it("highlights a contiguous English phrase", () => {
    const segments = segmentHighlightedText(
      "Allah! There is no deity save Him, the Alive, the Eternal. Neither slumber",
      "Allah! There is no deity save Him, the Alive, the Eternal",
    );
    const matched = segments
      .filter((s) => s.matched)
      .map((s) => s.text)
      .join("");
    expect(matched.toLowerCase()).toContain("alive");
    expect(segments.some((s) => s.matched)).toBe(true);
  });

  it("returns unmatched text when nothing hits", () => {
    expect(segmentHighlightedText("hello world", "zzzz")).toEqual([
      { text: "hello world", matched: false, start: 0 },
    ]);
  });
});

describe("detectQuranVerses", () => {
  it("resolves a bare surah:ayah reference", async () => {
    const hits = await detectQuranVerses("1:1");
    expect(hits).toHaveLength(1);
    expect(hits[0]).toMatchObject({ surah: 1, ayah: 1, matchKind: "reference", confidence: 1 });
  });

  it("resolves a labeled Qur'an reference", async () => {
    const hits = await detectQuranVerses("Qur'an 112:1");
    expect(hits).toHaveLength(1);
    expect(hits[0]).toMatchObject({ surah: 112, ayah: 1, matchKind: "reference" });
  });

  it("resolves Ayat al-Kursi by popular name", async () => {
    const hits = await detectQuranVerses("Ayat al-Kursi");
    expect(hits).toHaveLength(1);
    expect(hits[0]).toMatchObject({
      surah: 2,
      ayah: 255,
      matchKind: "alias",
      confidence: 1,
      popularName: "Ayat al-Kursi",
    });
  });

  it("finds Al-Fatihah by Arabic opening", async () => {
    const hits = await detectQuranVerses("بسم الله الرحمن الرحيم", { lang: "ar" });
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0]?.surah).toBe(1);
    expect(hits[0]?.ayah).toBe(1);
  });

  it("ranks Ayat al-Kursi first for its English opening with high confidence", async () => {
    const hits = await detectQuranVerses(
      "Allah! There is no deity save Him, the Alive, the Eternal",
      { lang: "en" },
    );
    expect(hits[0]).toMatchObject({ surah: 2, ayah: 255 });
    expect(hits[0]?.confidence).toBeGreaterThanOrEqual(0.9);
    expect(hits[0]?.popularName).toBe("Ayat al-Kursi");
  });

  it("returns empty for very short input", async () => {
    await expect(detectQuranVerses("ab")).resolves.toEqual([]);
  });

  it("includes Arabic text on hits", async () => {
    const hits = await detectQuranVerses("1:1");
    const arabic = quran.getSurahAyahs(1)[0]?.arabic ?? "";
    expect(hits[0]?.arabic).toBe(arabic);
  });
});
