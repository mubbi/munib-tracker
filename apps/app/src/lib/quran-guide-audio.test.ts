import {
  alFatihaTracks,
  allLetterPronunciationTracks,
  examplePhraseTrack,
  glyphFromTrack,
  glyphPronunciationTrack,
  guideAyahRangeTracks,
  guideAyahTrack,
  isGlyphPronunciationTrack,
  isLetterPronunciationTrack,
  letterIdFromTrack,
  letterPronunciationTrack,
  pronunciationGlyphTracks,
  resolveGlyphAudioUri,
  resolveLetterAudioUri,
  surahDisplayName,
  vocabWordTrack,
} from "@/lib/quran-guide-audio";

const RECITER = "Alafasy_128kbps";
const ayahUri = (surah: number, ayah: number) =>
  `https://everyayah.com/data/${RECITER}/${String(surah).padStart(3, "0")}${String(ayah).padStart(3, "0")}.mp3`;

describe("surahDisplayName", () => {
  it("uses the surah transliteration", () => {
    expect(surahDisplayName(1)).toBe("Al-Fatihah");
  });

  it("falls back to a generic label for unknown surahs", () => {
    expect(surahDisplayName(999)).toBe("Surah 999");
  });
});

describe("guideAyahTrack", () => {
  it("builds a full-ayah track with an open-ended clip id", () => {
    expect(guideAyahTrack(RECITER, { surah: 2, ayah: 255 })).toEqual({
      id: "guide:2:255:0-end",
      title: "Al-Baqarah",
      subtitle: "Ayah 255",
      uri: ayahUri(2, 255),
    });
  });

  it("carries clip bounds and a title override", () => {
    const track = guideAyahTrack(
      RECITER,
      { surah: 1, ayah: 2, clipStart: 1.5, clipEnd: 3 },
      "Rabb",
    );
    expect(track).toMatchObject({
      id: "guide:1:2:1.5-3",
      title: "Rabb",
      clipStart: 1.5,
      clipEnd: 3,
    });
  });
});

describe("guideAyahRangeTracks", () => {
  it.each([
    [5, 7, ["112:5", "112:6", "112:7"]],
    [3, undefined, ["112:3"]],
    [4, 2, ["112:4"]],
  ])("from %p to %p → %p", (from, to, ids) => {
    expect(guideAyahRangeTracks(RECITER, 112, from, to).map((t) => t.id)).toEqual(ids);
  });
});

describe("letter pronunciation tracks", () => {
  it("builds a track for a known letter", () => {
    expect(letterPronunciationTrack("ba", "Ba")).toEqual({
      id: "letter:ba",
      title: "Ba",
      subtitle: "Letter pronunciation",
      uri: resolveLetterAudioUri("ba"),
    });
  });

  it("returns null for a letter without audio", () => {
    expect(letterPronunciationTrack("nope", "Nope")).toBeNull();
  });

  it("queues only letters that have audio, in order", () => {
    const ids = allLetterPronunciationTracks([
      { id: "alif", name: "Alif" },
      { id: "nope", name: "Nope" },
      { id: "ta", name: "Ta" },
    ]).map((t) => t.id);
    expect(ids).toEqual(["letter:alif", "letter:ta"]);
  });

  it.each([
    ["letter:ba", true, "ba"],
    ["letter:", true, null],
    ["glyph:ب", false, null],
    [undefined, false, null],
  ])("%p → isLetter=%p, id=%p", (id, isLetter, letterId) => {
    expect(isLetterPronunciationTrack(id)).toBe(isLetter);
    expect(letterIdFromTrack(id)).toBe(letterId);
  });
});

describe("glyph pronunciation tracks", () => {
  it("builds a track for a known glyph", () => {
    expect(glyphPronunciationTrack("ب", "ب")).toEqual({
      id: "glyph:ب",
      title: "ب",
      subtitle: "Letter pronunciation",
      uri: resolveGlyphAudioUri("ب"),
    });
  });

  it("returns null for a glyph without audio", () => {
    expect(glyphPronunciationTrack("x", "x")).toBeNull();
  });

  it("flattens pairs in screen order, skipping glyphs without audio", () => {
    const ids = pronunciationGlyphTracks([{ letters: ["ا", "x"] }, { letters: ["ت"] }]).map(
      (t) => t.id,
    );
    expect(ids).toEqual(["glyph:ا", "glyph:ت"]);
  });

  it.each([
    ["glyph:ب", true, "ب"],
    ["glyph:", true, null],
    ["letter:ba", false, null],
    [undefined, false, null],
  ])("%p → isGlyph=%p, glyph=%p", (id, isGlyph, glyph) => {
    expect(isGlyphPronunciationTrack(id)).toBe(isGlyph);
    expect(glyphFromTrack(id)).toBe(glyph);
  });
});

describe("examplePhraseTrack", () => {
  it("clips the ayah for a known example and titles it with the phrase", () => {
    expect(examplePhraseTrack(RECITER, "مِنْ عِلْم")).toMatchObject({
      id: "guide:17:85:9.505-12.755",
      title: "مِنْ عِلْم",
      clipStart: 9.505,
      clipEnd: 12.755,
    });
  });

  it("uses an explicit title when given", () => {
    expect(examplePhraseTrack(RECITER, "مِنْ عِلْم", "Ikhfa")?.title).toBe("Ikhfa");
  });

  it("returns null for an unknown example", () => {
    expect(examplePhraseTrack(RECITER, "unknown")).toBeNull();
  });
});

describe("vocabWordTrack", () => {
  it("builds a timed headword clip", () => {
    expect(vocabWordTrack(RECITER, "rabb")).toMatchObject({
      id: "guide:1:2:1.795-2.425",
      title: "Al-Fatihah",
      uri: ayahUri(1, 2),
    });
  });

  it("returns null for an unknown vocab id", () => {
    expect(vocabWordTrack(RECITER, "unknown")).toBeNull();
  });
});

describe("alFatihaTracks", () => {
  it("queues all seven ayahs of Al-Fatihah", () => {
    const tracks = alFatihaTracks(RECITER);
    expect(tracks.map((t) => t.id)).toEqual(["1:1", "1:2", "1:3", "1:4", "1:5", "1:6", "1:7"]);
    expect(tracks[6]).toMatchObject({ title: "Al-Fatihah", uri: ayahUri(1, 7) });
  });
});
