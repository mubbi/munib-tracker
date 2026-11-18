import { renderHook } from "@testing-library/react-native";

import { usePracticeAyahText } from "./use-practice-ayah-text";

jest.mock("@/api/quran-remote", () => ({
  isRemoteEdition: (id: string) => id.startsWith("remote-"),
}));
jest.mock("@/hooks/use-is-online", () => ({ useIsOnline: () => mockState.online }));
jest.mock("@/hooks/use-quran", () => ({
  useSurahWords: () => mockState.words,
  useRemoteEditionSurah: (editionId: string | null) => {
    mockState.remoteEditionRequested = editionId;
    return { data: mockState.remoteData };
  },
}));
jest.mock("@/lib/quran", () => ({
  getSurahAyahs: () => [{ arabic: "بِسْمِ ٱللَّهِ" }, { arabic: "ٱلْحَمْدُ لِلَّهِ رَبِّ" }],
  getTransliteration: () => ({ "1": "bismillah" }),
  getBundledEdition: (id: string) => ({ "1": `${id}:1`, "2": `${id}:2` }),
}));
jest.mock("@/stores/quran-store", () => ({
  useQuranPrefs: () => ({ preferredTranslationIds: mockState.translationIds }),
}));

type Word = { arabic: string; audioUrl?: string };

let mockState: {
  online: boolean;
  words: { data?: Record<string, Word[]>; isPending: boolean };
  remoteData?: Record<string, string>;
  remoteEditionRequested?: string | null;
  translationIds: string[];
};

async function setup(ayahs = [1, 2]) {
  const { result } = await renderHook(() => usePracticeAyahText(1, ayahs, "en"));
  return result.current;
}

beforeEach(() => {
  mockState = {
    online: true,
    words: { data: undefined, isPending: true },
    remoteData: undefined,
    translationIds: ["en-sahih"],
  };
});

describe("usePracticeAyahText", () => {
  it("falls back to bundled words split on whitespace", async () => {
    const { rows, surahWordCounts } = await setup();
    expect(rows[2]).toEqual({
      ayah: 2,
      arabic: "ٱلْحَمْدُ لِلَّهِ رَبِّ",
      translation: "en-sahih:2",
      transliteration: "",
      words: ["ٱلْحَمْدُ", "لِلَّهِ", "رَبِّ"],
      wordAudio: [],
      fallbackWords: true,
    });
    expect(rows[1].transliteration).toBe("bismillah");
    expect(surahWordCounts).toBeNull();
  });

  it("uses Quran.com study words and audio once cached", async () => {
    mockState.words = {
      data: { "1": [{ arabic: "بِسْمِ", audioUrl: "a.mp3" }, { arabic: "ٱللَّهِ" }], "2": [] },
      isPending: false,
    };
    const { rows, surahWordCounts, wordsLoading } = await setup();
    expect(rows[1].words).toEqual(["بِسْمِ", "ٱللَّهِ"]);
    expect(rows[1].wordAudio).toEqual(["a.mp3", undefined]);
    expect(rows[1].fallbackWords).toBe(false);
    expect(rows[2].fallbackWords).toBe(true);
    expect(surahWordCounts).toEqual({ 1: 2, 2: 0 });
    expect(wordsLoading).toBe(false);
  });

  it("reports no word counts for an empty word map", async () => {
    mockState.words = { data: {}, isPending: false };
    expect((await setup()).surahWordCounts).toBeNull();
  });

  it("is loading only while online", async () => {
    expect((await setup()).wordsLoading).toBe(true);
    mockState.online = false;
    expect((await setup()).wordsLoading).toBe(false);
  });

  it("defaults to the bundled English edition", async () => {
    mockState.translationIds = [];
    expect((await setup()).rows[1].translation).toBe("en-pickthall:1");
    expect(mockState.remoteEditionRequested).toBeNull();
  });

  it("uses a downloaded remote edition", async () => {
    mockState.translationIds = ["remote-ur"];
    mockState.remoteData = { "1": "remote one" };
    const { rows } = await setup();
    expect(mockState.remoteEditionRequested).toBe("remote-ur");
    expect(rows[1].translation).toBe("remote one");
    expect(rows[2].translation).toBe("");
  });

  it("falls back to bundled English until a remote edition loads", async () => {
    mockState.translationIds = ["remote-ur"];
    mockState.remoteData = {};
    expect((await setup()).rows[1].translation).toBe("en-pickthall:1");
  });

  it("leaves text empty for ayahs outside the surah", async () => {
    const { rows } = await setup([9]);
    expect(rows[9].arabic).toBe("");
    expect(rows[9].words).toEqual([]);
  });
});
