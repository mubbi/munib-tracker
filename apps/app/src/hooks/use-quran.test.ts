import { renderHook } from "@testing-library/react-native";

import { fetchRemoteEditionSurah } from "@/api/quran-remote";
import { fetchTafsirSurah } from "@/api/quran-tafsir";
import { fetchSurahTajweed } from "@/api/quran-tajweed";
import { fetchAyahWordSegments, fetchSurahWords } from "@/api/quran-words";
import { queryOptionsOf } from "@/test-support/mocks/tanstack-query";

import {
  useAyahWordSegments,
  useRemoteEditionSurah,
  useSurahTajweed,
  useSurahWords,
  useTafsirSurah,
} from "./use-quran";

jest.mock(
  "@tanstack/react-query",
  () => require("@/test-support/mocks/tanstack-query").tanstackQueryOptionsMock,
);
jest.mock("@/api/quran-remote", () => ({ fetchRemoteEditionSurah: jest.fn() }));
jest.mock("@/api/quran-tafsir", () => ({ fetchTafsirSurah: jest.fn() }));
jest.mock("@/api/quran-tajweed", () => ({ fetchSurahTajweed: jest.fn() }));
jest.mock("@/api/quran-words", () => ({
  fetchAyahWordSegments: jest.fn(),
  fetchSurahWords: jest.fn(),
}));

async function optionsOf<T>(hook: () => T) {
  const { result } = await renderHook(hook);
  return queryOptionsOf(result.current);
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("useRemoteEditionSurah", () => {
  it("fetches the edition offline-first", async () => {
    const options = await optionsOf(() => useRemoteEditionSurah("ur-jalandhry", 2));
    expect(options.queryKey).toEqual(["quran-edition", "v2", "ur-jalandhry", 2]);
    expect(options.enabled).toBe(true);
    expect(options.networkMode).toBe("offlineFirst");
    await options.queryFn();
    expect(fetchRemoteEditionSurah).toHaveBeenCalledWith("ur-jalandhry", 2);
  });

  it("is disabled without an edition", async () => {
    expect((await optionsOf(() => useRemoteEditionSurah(null, 2))).enabled).toBe(false);
  });
});

describe("useTafsirSurah", () => {
  it("fetches the tafsir for a valid surah", async () => {
    const options = await optionsOf(() => useTafsirSurah("ibn-kathir", 1));
    expect(options.enabled).toBe(true);
    await options.queryFn();
    expect(fetchTafsirSurah).toHaveBeenCalledWith("ibn-kathir", 1);
  });

  it.each<[string | null, number]>([
    [null, 1],
    ["ibn-kathir", 0],
    ["ibn-kathir", 115],
  ])("is disabled for edition %s and surah %i", async (edition, surah) => {
    expect((await optionsOf(() => useTafsirSurah(edition, surah))).enabled).toBe(false);
  });
});

describe("useSurahTajweed", () => {
  it("fetches tajweed when enabled", async () => {
    const options = await optionsOf(() => useSurahTajweed(114, true));
    expect(options.enabled).toBe(true);
    await options.queryFn();
    expect(fetchSurahTajweed).toHaveBeenCalledWith(114);
  });

  it.each([
    [1, false],
    [0, true],
    [115, true],
  ])("is disabled for surah %i when enabled=%s", async (surah, enabled) => {
    expect((await optionsOf(() => useSurahTajweed(surah, enabled))).enabled).toBe(false);
  });
});

describe("useSurahWords", () => {
  it("keys and fetches by the base language", async () => {
    const options = await optionsOf(() => useSurahWords(1, "UR-PK", true));
    expect(options.queryKey).toEqual(["quran-words", "v2", "ur", 1]);
    await options.queryFn();
    expect(fetchSurahWords).toHaveBeenCalledWith(1, "ur");
  });

  it("defaults an empty language to English", async () => {
    const options = await optionsOf(() => useSurahWords(1, "", true));
    expect(options.queryKey).toEqual(["quran-words", "v2", "en", 1]);
  });

  it.each([
    [1, false],
    [0, true],
    [115, true],
  ])("is disabled for surah %i when enabled=%s", async (surah, enabled) => {
    expect((await optionsOf(() => useSurahWords(surah, "en", enabled))).enabled).toBe(false);
  });
});

describe("useAyahWordSegments", () => {
  it("fetches timing segments for the playing ayah", async () => {
    const options = await optionsOf(() => useAyahWordSegments(7, 1, 3, true));
    expect(options.queryKey).toEqual(["quran-word-segments", "v2", 7, 1, 3]);
    expect(options.enabled).toBe(true);
    await options.queryFn();
    expect(fetchAyahWordSegments).toHaveBeenCalledWith(7, 1, 3);
  });

  it.each<[number | null, number | null, boolean]>([
    [7, 3, false],
    [null, 3, true],
    [7, null, true],
    [7, 0, true],
  ])("is disabled for recitation %s, ayah %s, enabled=%s", async (recitation, ayah, enabled) => {
    expect((await optionsOf(() => useAyahWordSegments(recitation, 1, ayah, enabled))).enabled).toBe(
      false,
    );
  });
});
