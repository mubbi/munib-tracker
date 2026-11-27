import { act, renderHook, waitFor } from "@testing-library/react-native";
import * as Font from "expo-font";

import {
  loadSurahNameFont,
  resetSurahNameFontForTests,
  SURAH_NAME_FONT_FAMILY,
  SURAH_WORD_GLYPH,
  surahNameGlyph,
  useSurahNameFont,
} from "./surah-name-font";

jest.mock("./surah-name-font-file", () => ({ SURAH_NAME_FONT_FILE: 1 }));
jest.mock("expo-font", () => ({ isLoaded: jest.fn(), loadAsync: jest.fn() }));

const isLoaded = Font.isLoaded as jest.Mock;
const loadAsync = Font.loadAsync as jest.Mock;

describe("surah-name font", () => {
  beforeEach(() => {
    resetSurahNameFontForTests();
    isLoaded.mockReset().mockReturnValue(false);
    loadAsync.mockReset().mockResolvedValue(undefined);
  });

  it("loads the face once and reports its family", async () => {
    const { result } = await renderHook(() => useSurahNameFont());
    await waitFor(() => expect(result.current).toBe(SURAH_NAME_FONT_FAMILY));
    await act(async () => {
      await loadSurahNameFont();
    });
    expect(loadAsync).toHaveBeenCalledTimes(1);
    expect(loadAsync).toHaveBeenCalledWith({ [SURAH_NAME_FONT_FAMILY]: 1 });
  });

  it("keeps the fallback when loading fails, and can retry", async () => {
    loadAsync.mockRejectedValueOnce(new Error("asset missing"));
    await expect(loadSurahNameFont()).resolves.toBe(false);
    await expect(loadSurahNameFont()).resolves.toBe(true);
    expect(loadAsync).toHaveBeenCalledTimes(2);
  });

  it("is ready immediately when the face is already loaded", async () => {
    isLoaded.mockReturnValue(true);
    const { result } = await renderHook(() => useSurahNameFont());
    expect(result.current).toBe(SURAH_NAME_FONT_FAMILY);
    expect(loadAsync).not.toHaveBeenCalled();
  });

  it("maps surah n to the code point U+E000 + n", () => {
    expect(surahNameGlyph(1).codePointAt(0)).toBe(0xe001);
    expect(surahNameGlyph(114).codePointAt(0)).toBe(0xe072);
    expect(SURAH_WORD_GLYPH.codePointAt(0)).toBe(0xe000);
  });
});
