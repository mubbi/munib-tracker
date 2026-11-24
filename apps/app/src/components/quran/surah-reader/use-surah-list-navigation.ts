import type { Ayah, QuranReaderLayout } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { type RefObject, useCallback, useRef } from "react";
import type { FlatList, ScrollViewInstance } from "react-native";
import { TOTAL_SURAHS } from "@/components/quran/surah-reader/constants";
import { Spacing } from "@/constants/theme";
import { useScrollToActive, useScrollToActiveIndex } from "@/hooks/use-scroll-to-active";
import { getPageForAyah } from "@/lib/quran";
import { ayahIndexForKey } from "@/lib/quran-surah-reader";
import { updateQuranPrefs } from "@/lib/settings/quran-shortcuts";

/**
 * Moving around the surah: keep the playing (or deep-linked) ayah in view,
 * back-to-top, the desktop side-pane surah stepper / ayah jump, and switching
 * to the page / mushaf reader at the ayah on screen.
 *
 * Phone / web: FlatList `scrollToIndex`. TV mapped list: `measure()` inside the
 * ScreenLayout ScrollView (nested FlatLists collapse to zero height on Leanback).
 */
export function useSurahListNavigation({
  surahNumber,
  ayahs,
  tv,
  tvMappedList,
  audioActiveKey,
  focusAyah,
  topVisibleAyahRef,
  markUserMoved,
  flashAyah,
}: {
  surahNumber: number;
  ayahs: Ayah[];
  tv: boolean;
  /** Ayahs are mapped inside the screen ScrollView instead of a FlatList (TV). */
  tvMappedList: boolean;
  audioActiveKey: string | undefined;
  focusAyah: number | undefined;
  topVisibleAyahRef: RefObject<number | null>;
  /** Stable — an explicit jump moves the resume point. */
  markUserMoved: () => void;
  /** Stable — ring the jump target. */
  flashAyah: (ayahNumber: number) => void;
}) {
  const router = useRouter();
  const listRef = useRef<FlatList<Ayah>>(null);
  const screenScrollRef = useRef<ScrollViewInstance>(null);

  const indexForKey = useCallback(
    (key: string) => ayahIndexForKey(ayahs, surahNumber, key),
    [ayahs, surahNumber],
  );

  // Follow the currently-playing card (or a deep-linked ayah).
  const activeKey = audioActiveKey ?? (focusAyah ? `${surahNumber}:${focusAyah}` : undefined);
  const { onScrollToIndexFailed } = useScrollToActiveIndex(
    listRef,
    tvMappedList ? undefined : activeKey,
    indexForKey,
    {
      viewOffset: Spacing.two,
      itemCount: ayahs.length,
    },
  );
  const { register: registerAyahScroll, onScroll: onTvActiveScroll } = useScrollToActive(
    screenScrollRef,
    tvMappedList ? activeKey : null,
    // Clear the floating AppHeader (+ sticky reading toolbar when revealed).
    tv ? 148 : 96,
  );

  const scrollToTop = useCallback(() => {
    if (tvMappedList) {
      screenScrollRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [tvMappedList]);

  const goToSurah = useCallback(
    (n: number) => {
      if (n < 1 || n > TOTAL_SURAHS || n === surahNumber) return;
      router.replace({ pathname: "/quran/[surah]", params: { surah: String(n) } });
    },
    [router, surahNumber],
  );

  const jumpToAyah = useCallback(
    (ayahNumber: number) => {
      const index = indexForKey(`${surahNumber}:${ayahNumber}`);
      if (index < 0) return;
      // An explicit jump is user intent — let the resume point follow it.
      markUserMoved();
      listRef.current?.scrollToIndex({ index, animated: true, viewOffset: Spacing.two });
      flashAyah(ayahNumber);
    },
    [flashAyah, indexForKey, markUserMoved, surahNumber],
  );

  const openPageReader = useCallback(
    (layout: Exclude<QuranReaderLayout, "ayah">) => {
      const ayah = topVisibleAyahRef.current ?? focusAyah ?? 1;
      // Reader controls are shortcuts to Settings › Qur'an (one write path, §4.5.2).
      void updateQuranPrefs({ readerLayout: layout });
      router.push(
        `/quran/page/${getPageForAyah(surahNumber, ayah)}?surah=${surahNumber}&ayah=${ayah}`,
      );
    },
    [focusAyah, router, surahNumber, topVisibleAyahRef],
  );

  const handleLayoutSelect = useCallback(
    (id: string) => {
      const next = id as QuranReaderLayout;
      if (next === "ayah") {
        void updateQuranPrefs({ readerLayout: "ayah" });
        return;
      }
      openPageReader(next);
    },
    [openPageReader],
  );

  return {
    listRef,
    screenScrollRef,
    onScrollToIndexFailed,
    registerAyahScroll,
    onTvActiveScroll,
    scrollToTop,
    goToSurah,
    jumpToAyah,
    handleLayoutSelect,
  };
}
