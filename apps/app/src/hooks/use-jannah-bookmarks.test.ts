import { act, renderHook } from "@testing-library/react-native";

import { HadithRepository } from "@/db";
import { deferred } from "@/test-support/async";

import { useHadithCitationBookmark, useQuranAyahBookmark } from "./use-jannah-bookmarks";

jest.mock("@/db", () => ({
  HadithRepository: { isBookmarked: jest.fn(), toggleBookmark: jest.fn() },
}));
jest.mock("@/stores/quran-store", () => ({
  useIsAyahBookmarked: (surah: number, ayah: number) => surah === 2 && ayah === 255,
  useQuranActions: () => ({ toggleBookmark: mockToggleAyah }),
}));

const mockToggleAyah = jest.fn(async () => undefined);
const isBookmarked = HadithRepository.isBookmarked as jest.Mock;
const toggleBookmark = HadithRepository.toggleBookmark as jest.Mock;

const TARGET = { id: "bukhari:1", collection: "bukhari", number: 1 } as const;

beforeEach(() => {
  jest.clearAllMocks();
  isBookmarked.mockResolvedValue(true);
  toggleBookmark.mockResolvedValue(false);
});

describe("useQuranAyahBookmark", () => {
  it("reports and toggles the ayah bookmark", async () => {
    const { result } = await renderHook(() => useQuranAyahBookmark(2, 255));
    expect(result.current.bookmarked).toBe(true);
    await act(async () => {
      await result.current.toggle();
    });
    expect(mockToggleAyah).toHaveBeenCalledWith(2, 255);
  });
});

describe("useHadithCitationBookmark", () => {
  async function setup(target: typeof TARGET | null) {
    const hook = await renderHook(({ t }) => useHadithCitationBookmark(t), {
      initialProps: { t: target as typeof TARGET | null },
    });
    await act(async () => {
      await Promise.resolve();
    });
    return hook;
  }

  it("loads the bookmark state for the citation", async () => {
    const { result } = await setup(TARGET);
    expect(isBookmarked).toHaveBeenCalledWith("bukhari:1");
    expect(result.current.bookmarked).toBe(true);
    expect(result.current.canBookmark).toBe(true);
  });

  it("toggles the bookmark", async () => {
    const { result } = await setup(TARGET);
    await act(async () => {
      await result.current.toggle();
    });
    expect(toggleBookmark).toHaveBeenCalledWith(TARGET);
    expect(result.current.bookmarked).toBe(false);
  });

  it("cannot bookmark an unresolved citation", async () => {
    const { result } = await setup(null);
    expect(result.current.canBookmark).toBe(false);
    await act(async () => {
      await result.current.toggle();
    });
    expect(toggleBookmark).not.toHaveBeenCalled();
  });

  it("resets when the citation goes away", async () => {
    const { result, rerender } = await setup(TARGET);
    await rerender({ t: null });
    expect(result.current.bookmarked).toBe(false);
  });

  it("ignores a stale lookup after the citation changes", async () => {
    const pending = deferred<boolean>();
    isBookmarked.mockReturnValueOnce(pending.promise);
    const { result, rerender } = await setup(TARGET);
    await rerender({ t: null });
    await act(async () => pending.resolve(true));
    expect(result.current.bookmarked).toBe(false);
  });
});
