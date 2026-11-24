import { QuranStudyCacheRepository } from "@/db";
import { DB_KEYS } from "@/db/keys";
import * as ossReport from "@/lib/report-oss-content-download-failure";
import { clearStaticJsonCache } from "@/lib/static-json-fetch";
import { fakeResponse, mockFetch } from "@/test-support/fetch";
import { resetPreferences, setPreferences } from "@/test-support/preferences";
import { storedKeysUnder } from "@/test-support/storage";

import {
  fetchAyahWordSegments,
  fetchSurahWordByWord,
  fetchSurahWordSegments,
  fetchSurahWords,
  normalizeAyahWordSegments,
} from "./quran-words";

// jest.setup.ts preloads this module graph, so report through a spy, not jest.mock.
const report = jest
  .spyOn(ossReport, "reportOssContentDownloadFailure")
  .mockImplementation(() => {});

const word = (overrides: Record<string, unknown> = {}) => ({
  position: 1,
  char_type_name: "word",
  text_uthmani: "بِسْمِ",
  translation: { text: "In (the) name" },
  transliteration: { text: "bis'mi" },
  audio_url: "wbw/001_001_001.mp3",
  ...overrides,
});

beforeEach(async () => {
  clearStaticJsonCache();
  await QuranStudyCacheRepository.clear();
  report.mockClear();
});

describe("fetchSurahWords", () => {
  it("requests the chapter with word fields in the gloss language", async () => {
    const fetchMock = mockFetch(fakeResponse({ verses: [{ verse_number: 1, words: [word()] }] }));
    await fetchSurahWords(1, "ur-PK");
    const url = new URL(String(fetchMock.mock.calls[0]?.[0]));
    expect(url.pathname).toBe("/api/v4/verses/by_chapter/1");
    expect(Object.fromEntries(url.searchParams)).toMatchObject({
      language: "ur",
      words: "true",
      per_page: "50",
      page: "1",
    });
  });

  it("maps words, keeps only real words and resolves audio URLs", async () => {
    mockFetch(
      fakeResponse({
        verses: [
          {
            verse_number: 1,
            words: [
              word(),
              word({ text_uthmani: undefined, text: "ٱللَّهِ", audio_url: "https://x/a.mp3" }),
              word({ char_type_name: "end", text_uthmani: "١" }),
              word({ text_uthmani: "", text: "" }),
              word({
                char_type_name: undefined,
                text_uthmani: "ٱلرَّحْمَٰنِ",
                audio_url: null,
                translation: undefined,
                transliteration: undefined,
              }),
            ],
          },
          { verse_number: 2 },
        ],
      }),
    );

    const map = await fetchSurahWords(1);

    expect(map["1"]).toEqual([
      {
        arabic: "بِسْمِ",
        translit: "bis'mi",
        gloss: "In (the) name",
        audioUrl: "https://audio.qurancdn.com/wbw/001_001_001.mp3",
      },
      { arabic: "ٱللَّهِ", translit: "bis'mi", gloss: "In (the) name", audioUrl: "https://x/a.mp3" },
      { arabic: "ٱلرَّحْمَٰنِ", translit: "", gloss: "", audioUrl: undefined },
    ]);
    expect(map["2"]).toEqual([]);
  });

  it("follows pagination until there is no next page", async () => {
    const fetchMock = mockFetch(
      fakeResponse({
        verses: [{ verse_number: 1, words: [word()] }],
        pagination: { next_page: 2 },
      }),
      fakeResponse({
        verses: [{ verse_number: 51, words: [word()] }],
        pagination: { next_page: null },
      }),
    );
    const map = await fetchSurahWords(2);
    expect(Object.keys(map)).toEqual(["1", "51"]);
    expect(new URL(String(fetchMock.mock.calls[1]?.[0])).searchParams.get("page")).toBe("2");
  });

  it("serves a repeat request from the study cache", async () => {
    mockFetch(fakeResponse({ verses: [{ verse_number: 1, words: [word()] }] }));
    const first = await fetchSurahWords(3);
    const fetchMock = mockFetch(new Error("offline"));
    await expect(fetchSurahWords(3)).resolves.toEqual(first);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("defaults an empty language to English", async () => {
    const fetchMock = mockFetch(fakeResponse({ verses: [{ verse_number: 1, words: [word()] }] }));
    await fetchSurahWords(4, "");
    expect(new URL(String(fetchMock.mock.calls[0]?.[0])).searchParams.get("language")).toBe("en");
  });

  it("reports and rejects a payload with no words", async () => {
    mockFetch(fakeResponse({ verses: [{ verse_number: 1, words: [] }] }));
    await expect(fetchSurahWords(5)).rejects.toThrow("Empty word-by-word payload for surah 5 (en)");
    expect(report).toHaveBeenCalledWith(
      expect.objectContaining({ errorCode: "empty_payload", contentKey: "quran_wbw:en:5" }),
    );
  });

  it("treats a payload without verses as empty", async () => {
    mockFetch(fakeResponse({}));
    await expect(fetchSurahWords(6)).rejects.toThrow("Empty word-by-word payload");
  });

  it("fetchSurahWordByWord keys the English map by ayah number", async () => {
    mockFetch(fakeResponse({ verses: [{ verse_number: 7, words: [word()] }] }));
    const map = await fetchSurahWordByWord(7);
    expect(Object.keys(map)).toEqual(["7"]);
    expect(map[7]?.[0]?.arabic).toBe("بِسْمِ");
  });
});

describe("normalizeAyahWordSegments", () => {
  it.each([
    [undefined, []],
    [[], []],
    [[["a", 1, 2] as unknown as number[]], []],
    [[[1, 50, 100]], [[1, 0, 0]]],
  ])("normalises %j", (raw, expected) => {
    expect(normalizeAyahWordSegments(200, raw)).toEqual(expected);
  });
});

describe("fetchSurahWordSegments", () => {
  const payload = {
    audio_file: {
      timestamps: [
        { verse_key: "1:1", timestamp_from: 1000, segments: [[1, 1000, 1500]] },
        { verse_key: "1:2", segments: [[1, 10, 20]] },
        { verse_key: "1:3", timestamp_from: 0, segments: [] },
        { verse_key: "bad", timestamp_from: 0, segments: [[1, 0, 1]] },
      ],
    },
  };

  it("requests chapter segments and keys them per ayah", async () => {
    const fetchMock = mockFetch(fakeResponse(payload));
    await expect(fetchSurahWordSegments(7, 1)).resolves.toEqual({
      "1": [[1, 0, 500]],
      "2": [[1, 10, 20]],
    });
    expect(String(fetchMock.mock.calls[0]?.[0])).toBe(
      "https://api.quran.com/api/v4/chapter_recitations/7/1?segments=true",
    );
  });

  it("serves a repeat request from the study cache", async () => {
    mockFetch(fakeResponse(payload));
    await fetchSurahWordSegments(7, 2);
    const fetchMock = mockFetch(new Error("offline"));
    await expect(fetchSurahWordSegments(7, 2)).resolves.toHaveProperty("1");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns an empty map (and caches nothing) when there are no timings", async () => {
    mockFetch(fakeResponse({}));
    await expect(fetchSurahWordSegments(7, 3)).resolves.toEqual({});
    await expect(QuranStudyCacheRepository.get("segments:v2:7:3")).resolves.toBeNull();
  });

  it("returns an empty map when the request fails", async () => {
    mockFetch(new Error("offline"));
    await expect(fetchSurahWordSegments(7, 4)).resolves.toEqual({});
  });

  it("fetchAyahWordSegments returns one ayah's timings or null", async () => {
    mockFetch(fakeResponse(payload));
    await expect(fetchAyahWordSegments(7, 5, 1)).resolves.toEqual([[1, 0, 500]]);
    await expect(fetchAyahWordSegments(7, 5, 3)).resolves.toBeNull();
  });
});

describe("word-by-word — cacheQuranEditionsLocally (B1)", () => {
  afterEach(resetPreferences);

  it("persists words and timings by default", async () => {
    mockFetch(fakeResponse({ verses: [{ verse_number: 1, words: [word()] }] }));
    await fetchSurahWords(20);
    mockFetch(
      fakeResponse({ audio_file: { timestamps: [{ verse_key: "20:1", segments: [[1, 0, 9]] }] } }),
    );
    await fetchSurahWordSegments(7, 20);
    expect(await storedKeysUnder(DB_KEYS.quranStudyCache)).toHaveLength(2);
  });

  it("keeps words and timings for the session only when the toggle is off", async () => {
    await setPreferences({ cacheQuranEditionsLocally: false });
    mockFetch(fakeResponse({ verses: [{ verse_number: 1, words: [word()] }] }));
    const words = await fetchSurahWords(21);
    mockFetch(
      fakeResponse({ audio_file: { timestamps: [{ verse_key: "21:1", segments: [[1, 0, 9]] }] } }),
    );
    await expect(fetchSurahWordSegments(7, 21)).resolves.toEqual({ "1": [[1, 0, 9]] });
    expect(await storedKeysUnder(DB_KEYS.quranStudyCache)).toEqual([]);

    const fetchMock = mockFetch(new Error("offline"));
    await expect(fetchSurahWords(21)).resolves.toEqual(words);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
