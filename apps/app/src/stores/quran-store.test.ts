import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook } from "@testing-library/react-native";

import { DEFAULT_QURAN_PREFS, QuranRepository } from "@/db/repositories/quran-repository";
import { getPageForAyah } from "@/lib/quran-meta";

import { continueStore } from "./continue-store";
import {
  quranStore,
  useIsAyahBookmarked,
  useLastRead,
  useQuranActions,
  useQuranBookmarks,
  useQuranPrefs,
  useQuranReady,
} from "./quran-store";

beforeEach(async () => {
  await AsyncStorage.clear();
  quranStore.setState({
    prefs: DEFAULT_QURAN_PREFS,
    lastRead: null,
    bookmarks: [],
    isReady: false,
  });
  continueStore.setState({ activity: null, isReady: false });
});

describe("quranStore", () => {
  it("loads prefs, last read and bookmarks from the repository", async () => {
    await QuranRepository.toggleBookmark(2, 255);
    await QuranRepository.setLastRead(18, 10, 294);

    await quranStore.getState().load();

    const state = quranStore.getState();
    expect(state.isReady).toBe(true);
    expect(state.prefs).toEqual(await QuranRepository.getPrefs());
    expect(state.lastRead).toMatchObject({ surah: 18, ayah: 10, page: 294 });
    expect(state.bookmarks).toHaveLength(1);
    expect(state.bookmarks[0]).toMatchObject({ surah: 2, ayah: 255 });
  });

  it("updatePrefs persists and stores the merged prefs", async () => {
    await quranStore.getState().updatePrefs({ readerLayout: "page" });
    expect(quranStore.getState().prefs.readerLayout).toBe("page");
    expect((await QuranRepository.getPrefs()).readerLayout).toBe("page");
  });

  it("setLastRead derives the mushaf page and records a continue activity", async () => {
    await quranStore.getState().setLastRead(2, 255);

    const page = getPageForAyah(2, 255);
    expect(quranStore.getState().lastRead).toMatchObject({ surah: 2, ayah: 255, page });
    expect(await QuranRepository.getLastRead()).toMatchObject({ surah: 2, ayah: 255, page });
    await act(async () => {});
    expect(continueStore.getState().activity).toMatchObject({
      kind: "quran",
      href: "/quran/2?ayah=255",
    });
  });

  it("setLastRead honours an explicit page and the page layout", async () => {
    quranStore.setState({ prefs: { ...DEFAULT_QURAN_PREFS, readerLayout: "page" } });
    await quranStore.getState().setLastRead(1, 1, { page: 1, isAudio: true });
    await act(async () => {});
    expect(quranStore.getState().lastRead?.page).toBe(1);
    expect(continueStore.getState().activity?.href).toBe("/quran/page/1?surah=1&ayah=1");
  });

  it("toggleBookmark returns whether it was added and refreshes the list", async () => {
    await expect(quranStore.getState().toggleBookmark(36, 1)).resolves.toBe(true);
    expect(quranStore.getState().bookmarks).toHaveLength(1);
    await expect(quranStore.getState().toggleBookmark(36, 1)).resolves.toBe(false);
    expect(quranStore.getState().bookmarks).toHaveLength(0);
  });

  it("recordProgress stores reading progress and the last read position", async () => {
    await quranStore.getState().recordProgress(67, 5);
    expect((await QuranRepository.getReadingProgress())[67]?.furthestAyah).toBe(5);
    expect(quranStore.getState().lastRead).toMatchObject({ surah: 67, ayah: 5 });
    await act(async () => {});
  });
});

describe("quran hooks", () => {
  it("expose state slices and route actions to the store", async () => {
    const { result } = await renderHook(() => ({
      prefs: useQuranPrefs(),
      ready: useQuranReady(),
      lastRead: useLastRead(),
      bookmarks: useQuranBookmarks(),
      bookmarked: useIsAyahBookmarked(2, 255),
      actions: useQuranActions(),
    }));

    expect(result.current.ready).toBe(false);
    expect(result.current.bookmarked).toBe(false);

    await act(async () => {
      await result.current.actions.load();
      await result.current.actions.toggleBookmark(2, 255);
      await result.current.actions.updatePrefs({ readerLayout: "mushaf" });
      await result.current.actions.setLastRead(2, 255);
      await result.current.actions.recordProgress(2, 256);
    });

    expect(result.current.ready).toBe(true);
    expect(result.current.bookmarked).toBe(true);
    expect(result.current.bookmarks).toHaveLength(1);
    expect(result.current.prefs.readerLayout).toBe("mushaf");
    expect(result.current.lastRead).toMatchObject({ surah: 2, ayah: 256 });
  });
});
