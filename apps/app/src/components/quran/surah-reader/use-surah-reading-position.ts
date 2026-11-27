import { type RefObject, useCallback, useEffect, useRef } from "react";
import type { ListViewToken } from "react-native";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { Durations } from "@/constants/motion";
import { Spacing } from "@/constants/theme";
import { useQuranReadingRecorder } from "@/hooks/use-quran-reading-recorder";
import {
  readingProgressForIndex,
  shouldPersistResumeAyah,
  viewableIndexRange,
} from "@/lib/quran-surah-reader";
import { setQuranReaderViewport } from "@/stores/quran-notes-store";
import { useQuranActions } from "@/stores/quran-store";

/**
 * Debounce persisting the reading position while the list scrolls — we only save
 * once the user pauses, so "continue reading" resumes from the exact ayah on
 * screen without hammering storage on every viewability change.
 */
const LAST_READ_FLUSH_MS = 600;
/** How long a continue / deep-link `scrollToIndex` takes to settle before we snapshot it. */
const ENTRY_SETTLE_MS = 900;

/**
 * Continue-reading + D40 reading log for the ayah list: tracks the ayahs on
 * screen (viewability), drives the toolbar progress line, and persists the
 * top-most ayah as the exact resume point (debounced, flushed on exit).
 */
export function useSurahReadingPosition({
  hasSurah,
  surahNumber,
  focusAyah,
  ayahCount,
  audioActiveKey,
  scrollYRef,
}: {
  hasSurah: boolean;
  surahNumber: number;
  /** Deep-link / continue-reading entry ayah. */
  focusAyah: number | undefined;
  ayahCount: number;
  /** This surah's playing track (`surah:ayah`) — the player records its own position. */
  audioActiveKey: string | undefined;
  /** Latest list offset (from {@link useReaderChromeVisibility}). */
  scrollYRef: RefObject<number>;
}) {
  const { setLastRead, recordProgress } = useQuranActions();
  // 0→1 fraction of the surah scrolled through, driving the toolbar progress line.
  const readingProgress = useSharedValue(0);
  // Exact resume position: the top-most ayah currently rendered on screen.
  const topVisibleAyahRef = useRef<number | null>(null);
  // D40 reading log: last ayah on screen + the focus/foreground-aware recorder.
  const bottomVisibleAyahRef = useRef<number | null>(null);
  const readingRecorder = useQuranReadingRecorder();
  const lastRecordedAyahRef = useRef(0);
  const flushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Deep-link / continue-reading scrolls often leave the previous ayah as the
  // top-most viewable row. Ignore regressions until the user actually moves the
  // list (finger drag, or a post-settle offset change from wheel/trackpad).
  const userMovedListRef = useRef(false);
  const settleOffsetRef = useRef<number | null>(null);
  // Index-based progress: with a virtualized list, pixel offsets over an
  // estimated `contentSize` are unreliable (variable row heights, recycling), so
  // derive progress from the furthest ayah on screen instead — always accurate.
  const ayahCountRef = useRef(0);
  ayahCountRef.current = ayahCount;
  const viewportSurahRef = useRef(0);
  viewportSurahRef.current = surahNumber;
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 0 }).current;

  // Persist the top-most rendered ayah as the resume point. Reassigned every
  // render so the debounced flush sees the latest surah, audio state and store
  // actions without recreating the stable viewability handler below.
  const flushReadingPositionRef = useRef<() => void>(() => {});
  flushReadingPositionRef.current = () => {
    flushTimerRef.current = null;
    const ayah = topVisibleAyahRef.current;
    // D40: the settled viewport counts toward today's reading (debounced like this flush).
    if (ayah != null) {
      readingRecorder.noteAyahRange(surahNumber, ayah, bottomVisibleAyahRef.current ?? ayah);
    }
    if (
      ayah == null ||
      !shouldPersistResumeAyah({
        ayah,
        lastRecorded: lastRecordedAyahRef.current,
        audioActive: audioActiveKey != null,
        userMoved: userMovedListRef.current,
      })
    ) {
      return;
    }
    lastRecordedAyahRef.current = ayah;
    void recordProgress(surahNumber, ayah);
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ListViewToken[] }) => {
    const total = ayahCountRef.current;
    if (total <= 1) {
      readingProgress.value = total === 1 ? 1 : 0;
      topVisibleAyahRef.current = total === 1 ? 1 : null;
    } else {
      const range = viewableIndexRange(viewableItems);
      if (range) {
        readingProgress.value = withTiming(readingProgressForIndex(range.max, total), {
          duration: Durations.fast,
        });
        // Ayahs are contiguous from 1, so the row index maps to `ayah = index + 1`.
        topVisibleAyahRef.current = range.min + 1;
      }
      bottomVisibleAyahRef.current = range ? range.max + 1 : null;
    }
    // NF-3.21: the wide-screen notes panel highlights notes on the ayahs in view.
    const top = topVisibleAyahRef.current;
    const bottom = bottomVisibleAyahRef.current ?? top;
    setQuranReaderViewport(
      top != null && bottom != null
        ? { surah: viewportSurahRef.current, from: top, to: bottom }
        : null,
    );
    if (flushTimerRef.current) clearTimeout(flushTimerRef.current);
    flushTimerRef.current = setTimeout(() => flushReadingPositionRef.current(), LAST_READ_FLUSH_MS);
  }).current;

  // Leaving the reader clears the panel's "in view" state.
  useEffect(() => () => setQuranReaderViewport(null), []);

  // Flush any pending position when leaving the screen so a mid-scroll exit still
  // saves the exact ayah on screen.
  useEffect(() => {
    return () => {
      if (flushTimerRef.current) {
        clearTimeout(flushTimerRef.current);
        flushTimerRef.current = null;
      }
      flushReadingPositionRef.current();
    };
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: record entry once per surah open.
  useEffect(() => {
    if (!hasSurah) return;
    const startAyah = focusAyah ?? 1;
    // Seed the resume anchor so scroll-tracking only overwrites it once the user
    // actually moves past the entry point.
    lastRecordedAyahRef.current = startAyah;
    topVisibleAyahRef.current = startAyah;
    userMovedListRef.current = false;
    settleOffsetRef.current = null;
    void setLastRead(surahNumber, startAyah);
    // After scrollToIndex settles, snapshot the offset and re-assert the entry
    // ayah so a peeked previous row cannot stick as the resume point on exit.
    const settleTimer = setTimeout(() => {
      settleOffsetRef.current = scrollYRef.current;
      if (!userMovedListRef.current) {
        topVisibleAyahRef.current = startAyah;
        lastRecordedAyahRef.current = startAyah;
      }
    }, ENTRY_SETTLE_MS);
    return () => clearTimeout(settleTimer);
  }, [surahNumber]);

  /** Stable — after the entry scroll settles, a real offset change is user intent
   * (covers web wheel / trackpad, which never fire `onScrollBeginDrag`). */
  const onScrollOffset = useCallback((y: number) => {
    if (
      !userMovedListRef.current &&
      settleOffsetRef.current != null &&
      Math.abs(y - settleOffsetRef.current) > Spacing.six
    ) {
      userMovedListRef.current = true;
    }
  }, []);

  /** Stable — a drag or an explicit jump lets the resume point follow the list. */
  const markUserMoved = useCallback(() => {
    userMovedListRef.current = true;
  }, []);

  return {
    readingProgress,
    topVisibleAyahRef,
    viewabilityConfig,
    onViewableItemsChanged,
    onScrollOffset,
    markUserMoved,
  };
}
