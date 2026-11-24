import { getTafsirEdition, resolveIntlLocale } from "@munib-tracker/shared/i18n";
import type {
  Ayah,
  QuranReaderLayout,
  QuranWord,
  TajweedSegment,
} from "@munib-tracker/shared/types";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import {
  createContext,
  memo,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  type FlatList,
  type LayoutChangeEvent,
  type ListRenderItemInfo,
  type ListViewToken,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Platform,
  type ScrollViewInstance,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { hasEditionAyahs, isRemoteEdition, REMOTE_EDITIONS } from "@/api/quran-remote";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { ContentReportButton } from "@/components/content-report/content-report-button";
import { AyahActionSheet } from "@/components/quran/ayah-action-sheet";
import {
  AnnotatedAyahText,
  AyahNoteActions,
  AyahNoteMarker,
} from "@/components/quran/ayah-annotations";
import { AyahSeparator, ayahKeyExtractor, SurahAyahList } from "@/components/quran/ayah-reader";
import { OptionPickerSheet, SelectTrigger } from "@/components/quran/option-picker-sheet";
import { PlaybackSettingsSheet } from "@/components/quran/playback-settings-sheet";
import { QuranNotesSheetHost } from "@/components/quran/quran-notes-sheet-host";
import { QuranNotesSidePanel } from "@/components/quran/quran-notes-side-panel";
import { QuranReadingToolbar } from "@/components/quran/reading-toolbar";
import { TafsirAyahSheet } from "@/components/quran/tafsir-ayah-sheet";
import { TafsirPickerSheet } from "@/components/quran/tafsir-picker-sheet";
import { TajweedLegend, TajweedStickyLegendBar } from "@/components/quran/tajweed-legend";
import { TranslationPickerSheet } from "@/components/quran/translation-picker-sheet";
import {
  QuranWordStudyProviders,
  useQuranPlayback,
  WordByWord,
} from "@/components/quran/word-by-word";
import { ReadingFontControls } from "@/components/reading-font-controls";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { MoreInSettingsLink } from "@/components/settings/more-in-settings-link";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { LabeledIconButton } from "@/components/ui/labeled-icon-button";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ThemedSwitch } from "@/components/ui/themed-switch";
import { TvScrollView } from "@/components/ui/tv-scroll-view";
import { PAUSE_CIRCLE_ICON, PLAY_CIRCLE_ICON } from "@/constants/media-icons";
import { Durations } from "@/constants/motion";
import { quranComRecitationId } from "@/constants/tajweed";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useContentBottomInset } from "@/hooks/use-content-bottom-inset";
import { useLargeScreenLayout } from "@/hooks/use-large-screen-layout";
import { usePlaybackSummaryLabel } from "@/hooks/use-playback-summary-label";
import {
  useAyahWordSegments,
  useRemoteEditionSurah,
  useSurahTajweed,
  useSurahWords,
  useTafsirSurah,
} from "@/hooks/use-quran";
import { useQuranReadingRecorder } from "@/hooks/use-quran-reading-recorder";
import { useReadingFullscreen } from "@/hooks/use-reading-fullscreen";
import { useScrollToActive, useScrollToActiveIndex } from "@/hooks/use-scroll-to-active";
import { useShareContentCard } from "@/hooks/use-share-content-card";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isWebInteractiveTarget, useWebScreenKeyHandler } from "@/hooks/use-web-key-handler";
import { buildContentReportRef } from "@/lib/content-report-ref";
import { tTv } from "@/lib/i18n/t-tv";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { runAfterSheetDismiss } from "@/lib/platform/run-after-sheet-dismiss";
import {
  getBundledEdition,
  getEditionById,
  getPageForAyah,
  getSurahAyahs,
  getSurahByNumber,
  getSurahMeta,
  getTransliteration,
} from "@/lib/quran";
import { ayahTracks, RECITERS } from "@/lib/quran-audio";
import { isPracticeAvailable } from "@/lib/quran-companion/availability";
import { isPronunciationCheckPlatformAvailable } from "@/lib/quran-pronunciation/availability";
import { pronunciationCheckHref } from "@/lib/quran-pronunciation/entry";
import { normalizeRepeatPlan } from "@/lib/quran-repeat";
import { resolvePreferredTafsirId } from "@/lib/quran-tafsir-options";
import { ALL_QURAN_TRANSLATIONS } from "@/lib/quran-translation-options";
import { activeWordIndexAt } from "@/lib/quran-word-timing";
import { arabicReadingLayout, resolveReadingFontSizes } from "@/lib/reading-typography";
import { useChevronBackward, useChevronForward, useIsRTL } from "@/lib/rtl";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { articleSchema } from "@/lib/seo/structured-data";
import { updateQuranPrefs } from "@/lib/settings/quran-shortcuts";
import { setTtsVoice, useTtsVoice } from "@/lib/settings/tts-voice";
import { useReadingDisplayToggles } from "@/lib/settings/use-reading-display-toggles";
import { buildAyahSharePayload } from "@/lib/share";
import { resolveQuranEditionId } from "@/lib/translation-locale";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";
import { useToast } from "@/providers/toast-provider";
import {
  type HifzStatus,
  hifzKey,
  nextHifzStatus,
  useEnsureHifzLoaded,
  useHifzActions,
  useHifzMap,
} from "@/stores/hifz-store";
import { usePreferences } from "@/stores/preferences-store";
import { useQuranActions, useQuranBookmarks, useQuranPrefs } from "@/stores/quran-store";

const BUNDLED_EN_FALLBACK = "en-pickthall";

/** Stable empty maps so FlatList `extraData` does not change identity every render. */
const EMPTY_EDITION: Record<string, string> = {};
const EMPTY_TAJWEED: Record<string, TajweedSegment[]> = {};
const EMPTY_WORDS: Record<string, QuranWord[]> = {};

/** Deep-link focus ring: hold briefly so the user sees the target, then fade out. */
const FOCUS_HIGHLIGHT_HOLD_MS = 2500;
const FOCUS_HIGHLIGHT_FADE_MS = Durations.slow;

/**
 * Debounce persisting the reading position while the list scrolls — we only save
 * once the user pauses, so "continue reading" resumes from the exact ayah on
 * screen without hammering storage on every viewability change.
 */
const LAST_READ_FLUSH_MS = 600;

/** Extra width so the ayah list and filters pane can sit side by side. */
const LIST_DETAIL_MAX_WIDTH = 1280;
/** Desktop (≥1600): match the global wide content column. */
const LIST_DETAIL_MAX_WIDTH_XL = 1320;
/** Readable measure for the ayah column when the reader has a side pane. */
const READING_COLUMN_MAX_WIDTH = 800;
const TOTAL_SURAHS = 114;

const RECITER_OPTIONS = RECITERS.map((r) => ({ id: r.dir, label: r.name }));

/**
 * TV follow-along bookkeeping (refs, never state — focus changes must not
 * re-render the ayah list). `focused` is the ayah card holding D-pad focus;
 * `prevPlaying` the ayah that was playing before the current track.
 */
type AyahFocusTracker = { focused: number | null; prevPlaying: number | null };
const AyahFocusTrackerContext = createContext<{ current: AyahFocusTracker } | null>(null);

const LAYOUT_OPTIONS: Array<{ id: QuranReaderLayout; labelKey: string }> = [
  { id: "page", labelKey: "quran.layoutPage" },
  { id: "mushaf", labelKey: "quran.layoutMushaf" },
  { id: "ayah", labelKey: "quran.layoutAyah" },
];

function editionDirection(id: string): "ltr" | "rtl" {
  return (
    getEditionById(id)?.direction ?? REMOTE_EDITIONS.find((e) => e.id === id)?.direction ?? "ltr"
  );
}

/**
 * Pre-render a static HTML page for every surah (1–114) at web export time, so
 * each has its own crawlable URL, metadata, and Arabic ayah text for search/AI.
 */
export function generateStaticParams(): Array<{ surah: string }> {
  return getSurahMeta().map((s) => ({ surah: String(s.number) }));
}

export default function SurahReaderScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const params = useLocalSearchParams<{ surah: string; ayah?: string; word?: string }>();
  const surahNumber = Number(params.surah);
  const surah = getSurahByNumber(surahNumber);
  // Optional deep-link target (e.g. from universal search) — scroll to & mark it.
  const focusAyah = params.ayah ? Number(params.ayah) : undefined;
  // NF-3.22 root search: 1-based bundled word to mark in word-by-word view.
  const focusWordNumber = params.word ? Number(params.word) : undefined;

  const { colors, tokens } = useThemeTokens();
  const contentBottomInset = useContentBottomInset();
  const { isListDetail, width: windowWidth } = useLargeScreenLayout();
  const tv = isTV();
  const uiRtl = useIsRTL();
  // Wide tablet/desktop: sticky side filters. TV: single column — the fixed-width
  // secondary pane clipped past overscan (A− peeking on the right edge).
  const showSideFilters = isListDetail && !tv;
  // TV: ScreenLayout ScrollView + mapped ayahs — nested FlatList flex hosts still
  // collapse to zero height on Leanback (same failure mode as dua/hadith).
  const tvMappedList = tv;
  const fullscreen = useReadingFullscreen({ exitOnBlur: true });
  const prefs = useQuranPrefs();
  const { fontPrefs, translationLocale, locale: appLocale } = usePreferences();
  const defaultEditionId = resolveQuranEditionId({ translationLocale, locale: appLocale });
  const readingSizes = resolveReadingFontSizes("quran", fontPrefs);
  const { setLastRead, toggleBookmark, recordProgress } = useQuranActions();
  // Reader controls are shortcuts to Settings › Qur'an (one write path, §4.5.2).
  const updatePrefs = updateQuranPrefs;
  const { showTranslation, showTransliteration, toggleTranslation, toggleTransliteration } =
    useReadingDisplayToggles();
  useEnsureHifzLoaded();
  const hifzMap = useHifzMap();
  const { cycle: cycleHifz } = useHifzActions();
  const toast = useToast();
  const bookmarks = useQuranBookmarks();
  const audio = useAudioPlayerContext();
  // Subscribe to primitives / stable methods — never close list callbacks over
  // the whole context value (it is a new object on duration/buffering ticks).
  const playAudio = audio.play;
  const toggleAudio = audio.toggle;
  const setRepeatPlan = audio.setRepeatPlan;
  const setTranslationAudio = audio.setTranslationAudio;
  const readPlaybackSeconds = audio.readPlaybackSeconds;
  const audioIsPlaying = audio.isPlaying;
  const currentAudioId = audio.current?.id;
  const audioDurationRef = useRef(audio.duration);
  audioDurationRef.current = audio.duration;
  const trackDurationsRef = useRef(audio.trackDurations);
  trackDurationsRef.current = audio.trackDurations;
  const listRef = useRef<FlatList<Ayah>>(null);
  const screenScrollRef = useRef<ScrollViewInstance>(null);
  const { share, activeShareKey, gesturePendingKey, SnapshotHost } = useShareContentCard();
  const [reciterPickerOpen, setReciterPickerOpen] = useState(false);
  const [translationPickerOpen, setTranslationPickerOpen] = useState(false);
  const [secondaryPickerOpen, setSecondaryPickerOpen] = useState(false);
  const [tafsirPickerOpen, setTafsirPickerOpen] = useState(false);
  const [tafsirAyah, setTafsirAyah] = useState<number | null>(null);
  const [layoutPickerOpen, setLayoutPickerOpen] = useState(false);
  const [playbackSheetOpen, setPlaybackSheetOpen] = useState(false);
  /** TV: row index whose ayah action sheet is open (Select on an ayah card). */
  const [tvActionIndex, setTvActionIndex] = useState<number | null>(null);
  const ayahFocusRef = useRef<AyahFocusTracker>({ focused: null, prevPlaying: null });
  const [focusHighlightAyah, setFocusHighlightAyah] = useState<number | undefined>(focusAyah);
  // The word highlight follows the ayah flash (cleared with it).
  const focusWordValue = useMemo(
    () =>
      focusHighlightAyah != null &&
      focusHighlightAyah === focusAyah &&
      focusWordNumber != null &&
      focusWordNumber >= 1
        ? { ayah: focusHighlightAyah, index: focusWordNumber - 1 }
        : null,
    [focusAyah, focusHighlightAyah, focusWordNumber],
  );
  const [activeWordIndex, setActiveWordIndex] = useState<number | null>(null);
  const focusTargetKey = focusAyah != null ? `${surahNumber}:${focusAyah}` : null;

  // Reveal the compact reading toolbar once the header card scrolls out of view.
  const [toolbarVisible, setToolbarVisible] = useState(false);
  // Sticky tajweed swatch bar — only after the in-list legend scrolls away.
  const [tajweedBarVisible, setTajweedBarVisible] = useState(false);
  const headerCardHeightRef = useRef(0);
  const tajweedLegendBottomRef = useRef(0);
  const showTajweedRef = useRef(false);
  // 0→1 fraction of the surah scrolled through, driving the toolbar progress line.
  const readingProgress = useSharedValue(0);

  const onHeaderCardLayout = useCallback((event: LayoutChangeEvent) => {
    headerCardHeightRef.current = event.nativeEvent.layout.height;
  }, []);

  // Exact resume position: the top-most ayah currently rendered on screen. We
  // persist it (debounced) so "continue reading" drops the user back precisely
  // where they left off — critical for long surahs.
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
  const scrollYRef = useRef(0);
  const settleOffsetRef = useRef<number | null>(null);
  // Reassigned every render so the debounced flush always sees the latest surah,
  // audio state, and store actions without recreating the stable handler below.
  const flushReadingPositionRef = useRef<() => void>(() => {});

  const onTajweedLegendLayout = useCallback((event: LayoutChangeEvent) => {
    const { y, height } = event.nativeEvent.layout;
    const bottom = y + height;
    tajweedLegendBottomRef.current = bottom;
    const next = showTajweedRef.current && scrollYRef.current > Math.max(0, bottom - Spacing.four);
    setTajweedBarVisible((prev) => (prev === next ? prev : next));
  }, []);

  const onListScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;
    scrollYRef.current = y;
    const threshold = Math.max(0, headerCardHeightRef.current - Spacing.four);
    const nextToolbar = y > threshold;
    setToolbarVisible((prev) => (prev === nextToolbar ? prev : nextToolbar));

    const legendBottom = tajweedLegendBottomRef.current;
    const nextTajweedBar =
      showTajweedRef.current && legendBottom > 0 && y > Math.max(0, legendBottom - Spacing.four);
    setTajweedBarVisible((prev) => (prev === nextTajweedBar ? prev : nextTajweedBar));

    // After focus-scroll settles, treat a real offset change as user intent
    // (covers web wheel / trackpad which do not fire onScrollBeginDrag).
    if (
      !userMovedListRef.current &&
      settleOffsetRef.current != null &&
      Math.abs(y - settleOffsetRef.current) > Spacing.six
    ) {
      userMovedListRef.current = true;
    }
  }, []);

  const onScrollBeginDrag = useCallback(() => {
    userMovedListRef.current = true;
  }, []);

  // Index-based progress: with a virtualized list, pixel offsets over an
  // estimated `contentSize` are unreliable (variable row heights, recycling), so
  // derive progress from the furthest ayah on screen instead — always accurate.
  const ayahCountRef = useRef(0);
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 0 }).current;

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ListViewToken[] }) => {
    const total = ayahCountRef.current;
    if (total <= 1) {
      readingProgress.value = total === 1 ? 1 : 0;
      topVisibleAyahRef.current = total === 1 ? 1 : null;
    } else {
      let maxIndex = -1;
      let minIndex = Number.POSITIVE_INFINITY;
      for (const token of viewableItems) {
        if (token.index == null) continue;
        if (token.index > maxIndex) maxIndex = token.index;
        if (token.index < minIndex) minIndex = token.index;
      }
      if (maxIndex >= 0) {
        const target = Math.min(1, Math.max(0, maxIndex / (total - 1)));
        readingProgress.value = withTiming(target, { duration: Durations.fast });
      }
      // Ayahs are contiguous from 1, so the row index maps to `ayah = index + 1`.
      if (Number.isFinite(minIndex)) topVisibleAyahRef.current = minIndex + 1;
      bottomVisibleAyahRef.current = maxIndex >= 0 ? maxIndex + 1 : null;
    }
    if (flushTimerRef.current) clearTimeout(flushTimerRef.current);
    flushTimerRef.current = setTimeout(() => flushReadingPositionRef.current(), LAST_READ_FLUSH_MS);
  }).current;

  // Flash the deep-linked ayah, then drop the highlight so audio playback can own the border.
  useEffect(() => {
    if (!focusTargetKey) {
      setFocusHighlightAyah(undefined);
      return;
    }
    setFocusHighlightAyah(focusAyah);
    const timer = setTimeout(
      () => setFocusHighlightAyah(undefined),
      FOCUS_HIGHLIGHT_HOLD_MS + FOCUS_HIGHLIGHT_FADE_MS,
    );
    return () => clearTimeout(timer);
  }, [focusAyah, focusTargetKey]);

  const ayahs = useMemo(() => (surah ? getSurahAyahs(surahNumber) : []), [surah, surahNumber]);
  ayahCountRef.current = ayahs.length;

  // Resolve a `surah:ayah` key to its row index. Ayahs are contiguous starting at
  // 1, so the ayah number maps directly to `index = ayah - 1` — but guard against
  // gaps by validating against the actual data.
  const indexForKey = useCallback(
    (key: string) => {
      const [surahPart, ayahPart] = key.split(":");
      if (Number(surahPart) !== surahNumber) return -1;
      const ayahNumber = Number(ayahPart);
      if (!Number.isFinite(ayahNumber)) return -1;
      const guess = ayahNumber - 1;
      if (ayahs[guess]?.ayah === ayahNumber) return guess;
      return ayahs.findIndex((a) => a.ayah === ayahNumber);
    },
    [ayahs, surahNumber],
  );

  const audioActiveKey =
    currentAudioId?.startsWith(`${surahNumber}:`) === true ? currentAudioId : undefined;

  // Persist the top-most rendered ayah as the resume point. Skipped while audio
  // plays this surah — the player already records its own (isAudio) position and
  // auto-scroll would otherwise clobber it. Reassigned each render for fresh deps.
  flushReadingPositionRef.current = () => {
    flushTimerRef.current = null;
    const ayah = topVisibleAyahRef.current;
    // D40: the settled viewport counts toward today's reading (debounced like this flush).
    if (ayah != null) {
      readingRecorder.noteAyahRange(surahNumber, ayah, bottomVisibleAyahRef.current ?? ayah);
    }
    if (ayah == null || ayah === lastRecordedAyahRef.current) return;
    if (audioActiveKey != null) return;
    // scrollToIndex for continue/deep-link often reports the previous ayah as
    // top-most; don't walk the resume point backward until the user moves the list.
    if (ayah < lastRecordedAyahRef.current && !userMovedListRef.current) return;
    lastRecordedAyahRef.current = ayah;
    void recordProgress(surahNumber, ayah);
  };

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

  // Follow the currently-playing card (or a deep-linked ayah).
  // Phone: FlatList scrollToIndex. TV mapped list: measure() via ScreenLayout ScrollView.
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

  const onTvMappedScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      onListScroll(event);
      onTvActiveScroll(event);
    },
    [onListScroll, onTvActiveScroll],
  );

  const requestedEdition = prefs.preferredTranslationIds[0] ?? defaultEditionId;
  const knownEdition = ALL_QURAN_TRANSLATIONS.some((e) => e.id === requestedEdition)
    ? requestedEdition
    : defaultEditionId;
  const remoteActive = isRemoteEdition(knownEdition);

  // Remote editions are fetched cache-first; call the hook unconditionally.
  const remoteQuery = useRemoteEditionSurah(
    remoteActive && surah ? knownEdition : null,
    surahNumber,
  );

  const bundledTranslation = useMemo(
    () =>
      surah
        ? getBundledEdition(remoteActive ? BUNDLED_EN_FALLBACK : knownEdition, surahNumber)
        : EMPTY_EDITION,
    [surah, surahNumber, knownEdition, remoteActive],
  );
  // Remote data when available, otherwise fall back to a bundled translation.
  const remoteReady = hasEditionAyahs(remoteQuery.data);
  const translation =
    remoteActive && hasEditionAyahs(remoteQuery.data) ? remoteQuery.data : bundledTranslation;
  const translationLoading = remoteActive && remoteQuery.isPending;
  const usingFallback = remoteActive && !remoteReady && !translationLoading;
  const translationDir = usingFallback ? "ltr" : editionDirection(knownEdition);

  // ── Second (side-by-side) translation — NF-1.13 ──────────────────────────
  const secondaryId = prefs.secondaryTranslationId;
  const secondaryKnown =
    secondaryId &&
    secondaryId !== knownEdition &&
    ALL_QURAN_TRANSLATIONS.some((e) => e.id === secondaryId)
      ? secondaryId
      : undefined;
  const secondaryRemoteActive = secondaryKnown ? isRemoteEdition(secondaryKnown) : false;
  const secondaryRemoteQuery = useRemoteEditionSurah(
    secondaryRemoteActive && surah ? (secondaryKnown ?? null) : null,
    surahNumber,
  );
  const secondaryBundled = useMemo(
    () =>
      secondaryKnown && surah
        ? getBundledEdition(
            secondaryRemoteActive ? BUNDLED_EN_FALLBACK : secondaryKnown,
            surahNumber,
          )
        : EMPTY_EDITION,
    [secondaryKnown, secondaryRemoteActive, surah, surahNumber],
  );
  const secondaryRemoteReady = hasEditionAyahs(secondaryRemoteQuery.data);
  const secondTranslation = secondaryKnown
    ? secondaryRemoteActive && secondaryRemoteReady
      ? secondaryRemoteQuery.data
      : secondaryBundled
    : undefined;
  const secondaryDir = secondaryKnown ? editionDirection(secondaryKnown) : "ltr";
  const secondaryEdition = ALL_QURAN_TRANSLATIONS.find((e) => e.id === secondaryId);

  // ── On-demand tafsir (NF-1.10) ───────────────────────────────────────────
  const activeTafsirId = resolvePreferredTafsirId(
    prefs.preferredTafsirId,
    translationLocale,
    appLocale,
  );
  const tafsirEdition = activeTafsirId ? getTafsirEdition(activeTafsirId) : undefined;
  const tafsirQuery = useTafsirSurah(activeTafsirId ?? null, surahNumber);
  const tafsirMap = hasEditionAyahs(tafsirQuery.data) ? tafsirQuery.data : undefined;
  const tafsirLoading = Boolean(activeTafsirId) && tafsirQuery.isPending;
  const tafsirOffline =
    Boolean(activeTafsirId) && !tafsirLoading && tafsirQuery.isError && !tafsirMap;

  const openTafsirForAyah = useCallback(
    (ayahNumber: number) => {
      if (!activeTafsirId) {
        setTafsirPickerOpen(true);
        return;
      }
      setTafsirAyah(ayahNumber);
    },
    [activeTafsirId],
  );

  const transliteration = useMemo(
    () => (surah ? getTransliteration(surahNumber) : {}),
    [surah, surahNumber],
  );

  const showWordByWord = prefs.showWordByWord === true;
  const showTajweed = prefs.showTajweed === true;
  showTajweedRef.current = showTajweed;

  useEffect(() => {
    if (!showTajweed) {
      setTajweedBarVisible(false);
      return;
    }
    const bottom = tajweedLegendBottomRef.current;
    if (bottom > 0 && scrollYRef.current > Math.max(0, bottom - Spacing.four)) {
      setTajweedBarVisible(true);
    }
  }, [showTajweed]);

  const wordLang = translationLocale || appLocale || "en";
  const tajweedQuery = useSurahTajweed(surahNumber, showTajweed && Boolean(surah));
  const wordsQuery = useSurahWords(surahNumber, wordLang, showWordByWord && Boolean(surah));
  const tajweedByAyah = tajweedQuery.data ?? EMPTY_TAJWEED;
  const wordByWordByAyah = wordsQuery.data ?? EMPTY_WORDS;
  const studyExtrasLoading =
    (showTajweed && tajweedQuery.isPending) || (showWordByWord && wordsQuery.isPending);

  const playingAyahNumber = audioActiveKey ? Number(audioActiveKey.split(":")[1]) : null;
  // Runs after the render that activated the new ayah, so cards compare the
  // focused ayah against the *previous* track when deciding to follow along.
  useEffect(() => {
    ayahFocusRef.current.prevPlaying = playingAyahNumber;
  }, [playingAyahNumber]);
  const recitationId = quranComRecitationId(prefs.preferredReciterDir);
  const segmentsQuery = useAyahWordSegments(
    recitationId,
    surahNumber,
    playingAyahNumber,
    showWordByWord && playingAyahNumber != null,
  );

  useEffect(() => {
    if (!showWordByWord || playingAyahNumber == null || !audioIsPlaying) {
      setActiveWordIndex(null);
      return;
    }
    const segments = segmentsQuery.data;
    const wordsForAyah = wordByWordByAyah[String(playingAyahNumber)] ?? [];
    const wordCount = wordsForAyah.length;
    // Need either real timings or a word count for the proportional fallback.
    if (!segments?.length && wordCount === 0) {
      setActiveWordIndex(null);
      return;
    }
    const playingTrackId = currentAudioId ?? "";
    let cancelled = false;
    let raf = 0;
    const tick = () => {
      if (cancelled) return;
      const durationSec =
        audioDurationRef.current > 0
          ? audioDurationRef.current
          : (trackDurationsRef.current[playingTrackId] ?? 0);
      const next = activeWordIndexAt(readPlaybackSeconds(), segments, {
        wordCount,
        durationSec,
      });
      setActiveWordIndex((prev) => (prev === next ? prev : next));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [
    showWordByWord,
    playingAyahNumber,
    audioIsPlaying,
    readPlaybackSeconds,
    currentAudioId,
    segmentsQuery.data,
    wordByWordByAyah,
  ]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: record entry once per surah open.
  useEffect(() => {
    if (!surah) return;
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
    }, 900);
    return () => clearTimeout(settleTimer);
  }, [surahNumber]);

  const reciterDir = prefs.preferredReciterDir;
  const reciter = RECITERS.find((r) => r.dir === reciterDir) ?? RECITERS[0];
  const selectedEdition =
    ALL_QURAN_TRANSLATIONS.find((e) => e.id === knownEdition) ??
    ALL_QURAN_TRANSLATIONS.find((e) => e.id === BUNDLED_EN_FALLBACK) ??
    ALL_QURAN_TRANSLATIONS[0];

  const ttsLang = resolveIntlLocale(translationLocale);
  const ttsVoiceId = useTtsVoice(ttsLang);
  const repeatPlan = useMemo(
    () => normalizeRepeatPlan(prefs.repeatMode, prefs.repeatRange, ayahs.length),
    [prefs.repeatMode, prefs.repeatRange, ayahs.length],
  );
  const playbackSummary = usePlaybackSummaryLabel(
    repeatPlan,
    prefs.translationAudio,
    "quran.playback.open",
  );
  const toolbarPlaybackSummary = usePlaybackSummaryLabel(
    repeatPlan,
    prefs.translationAudio,
    "quran.playback.title",
  );

  useEffect(() => {
    setRepeatPlan(repeatPlan);
    // TV has no speech synthesis — never queue translation TTS there.
    setTranslationAudio(tv ? "off" : (prefs.translationAudio ?? "off"));
  }, [setRepeatPlan, setTranslationAudio, repeatPlan, prefs.translationAudio, tv]);

  const playFrom = useCallback(
    (index: number, nextReciterDir = reciterDir) => {
      if (!surah) return;
      const tracks = ayahTracks(nextReciterDir, surah.nameTransliteration, surahNumber, ayahs, {
        translations: translation,
        lang: ttsLang,
        voice: ttsVoiceId,
      });
      playAudio(tracks, index, {
        sourceHref: `/quran/${surahNumber}`,
      });
      void setLastRead(surahNumber, index + 1, { isAudio: true });
    },
    [
      playAudio,
      ayahs,
      reciterDir,
      setLastRead,
      surah,
      surahNumber,
      translation,
      ttsLang,
      ttsVoiceId,
    ],
  );

  /** Persist the choice and, if this surah is in the player, swap URIs mid-session. */
  const handleReciterSelect = useCallback(
    (id: string) => {
      void updatePrefs({ preferredReciterDir: id });
      if (id === reciterDir) return;
      if (!currentAudioId?.startsWith(`${surahNumber}:`)) return;
      const ayahNum = Number(currentAudioId.slice(currentAudioId.indexOf(":") + 1));
      const index = ayahs.findIndex((a) => a.ayah === ayahNum);
      if (index < 0) return;
      playFrom(index, id);
    },
    [currentAudioId, ayahs, playFrom, reciterDir, surahNumber],
  );

  /** Per-ayah control: pause/resume when this ayah is already current; otherwise start it. */
  const playOrToggleAyah = useCallback(
    (index: number) => {
      const ayah = ayahs[index];
      if (!ayah) return;
      if (currentAudioId === `${surahNumber}:${ayah.ayah}`) {
        toggleAudio();
        return;
      }
      playFrom(index);
    },
    [ayahs, currentAudioId, playFrom, surahNumber, toggleAudio],
  );

  const handleBookmarkAyah = useCallback(
    (surahNum: number, ayahNum: number) => toggleBookmark(surahNum, ayahNum),
    [toggleBookmark],
  );

  const [hifzPending, setHifzPending] = useState<{ surah: number; ayah: number } | null>(null);

  const handleHifzAyah = useCallback((surahNum: number, ayahNum: number) => {
    setHifzPending({ surah: surahNum, ayah: ayahNum });
  }, []);

  const confirmHifz = useCallback(async () => {
    if (!hifzPending) return;
    const { surah: surahNum, ayah: ayahNum } = hifzPending;
    setHifzPending(null);
    const nextStatus = await cycleHifz(surahNum, ayahNum);
    const ref = t("hifz.toastRef", {
      surah: surah?.nameTransliteration ?? String(surahNum),
      ayah: ayahNum,
    });
    if (nextStatus === "memorized") {
      toast.success(t("hifz.toastMemorizedTitle"), t("hifz.toastMemorizedBody", { ref }));
    } else if (nextStatus === "review") {
      toast.info(t("hifz.toastReviewTitle"), t("hifz.toastReviewBody", { ref }));
    } else {
      toast.info(t("hifz.toastClearedTitle"), t("hifz.toastClearedBody", { ref }));
    }
  }, [cycleHifz, hifzPending, surah, t, toast]);

  const hifzPendingNext = hifzPending
    ? nextHifzStatus(hifzMap[hifzKey(hifzPending.surah, hifzPending.ayah)])
    : null;
  const hifzPendingRef = hifzPending
    ? t("hifz.toastRef", {
        surah: surah?.nameTransliteration ?? String(hifzPending.surah),
        ayah: hifzPending.ayah,
      })
    : "";

  const shareAyah = useCallback(
    (
      arabic: string,
      translation: string,
      surahNum: number,
      ayahNum: number,
      transliteration?: string,
    ) => {
      void share({
        ...buildAyahSharePayload(arabic, translation, surahNum, ayahNum, {
          surahName: surah?.nameTransliteration,
          transliteration,
          sectionTitle: t("share.sectionQuran"),
        }),
        shareKey: `${surahNum}:${ayahNum}`,
      });
    },
    [share, surah?.nameTransliteration, t],
  );

  const bookmarkedSet = useMemo(
    () => new Set(bookmarks.map((b) => `${b.surah}:${b.ayah}`)),
    [bookmarks],
  );

  const layoutOptions = useMemo(
    () => LAYOUT_OPTIONS.map((o) => ({ id: o.id, label: t(o.labelKey) })),
    [t],
  );

  const openPageReader = useCallback(
    (layout: Exclude<QuranReaderLayout, "ayah">) => {
      const ayah = topVisibleAyahRef.current ?? focusAyah ?? 1;
      void updatePrefs({ readerLayout: layout });
      router.push(
        `/quran/page/${getPageForAyah(surahNumber, ayah)}?surah=${surahNumber}&ayah=${ayah}`,
      );
    },
    [focusAyah, router, surahNumber],
  );

  const handleLayoutSelect = useCallback(
    (id: string) => {
      const next = id as QuranReaderLayout;
      if (next === "ayah") {
        void updatePrefs({ readerLayout: "ayah" });
        return;
      }
      openPageReader(next);
    },
    [openPageReader],
  );

  const scrollToTop = useCallback(() => {
    if (tvMappedList) {
      screenScrollRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [tvMappedList]);

  // ── Desktop navigation: side-pane surah stepper / ayah jump + keyboard ─────
  const goToSurah = useCallback(
    (n: number) => {
      if (n < 1 || n > TOTAL_SURAHS || n === surahNumber) return;
      router.replace({ pathname: "/quran/[surah]", params: { surah: String(n) } });
    },
    [router, surahNumber],
  );

  const jumpHighlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (jumpHighlightTimerRef.current) clearTimeout(jumpHighlightTimerRef.current);
    },
    [],
  );
  const jumpToAyah = useCallback(
    (ayahNumber: number) => {
      const index = indexForKey(`${surahNumber}:${ayahNumber}`);
      if (index < 0) return;
      // An explicit jump is user intent — let the resume point follow it.
      userMovedListRef.current = true;
      listRef.current?.scrollToIndex({ index, animated: true, viewOffset: Spacing.two });
      setFocusHighlightAyah(ayahNumber);
      if (jumpHighlightTimerRef.current) clearTimeout(jumpHighlightTimerRef.current);
      jumpHighlightTimerRef.current = setTimeout(
        () => setFocusHighlightAyah(undefined),
        FOCUS_HIGHLIGHT_HOLD_MS + FOCUS_HIGHLIGHT_FADE_MS,
      );
    },
    [indexForKey, surahNumber],
  );

  /** Pause/resume this surah's audio, or start it from the top-most ayah on screen. */
  const playPauseSurah = useCallback(() => {
    if (audioActiveKey != null) {
      toggleAudio();
      return;
    }
    const top = topVisibleAyahRef.current ?? 1;
    playFrom(Math.max(0, Math.min(ayahs.length - 1, top - 1)));
  }, [audioActiveKey, ayahs.length, playFrom, toggleAudio]);

  // Web keyboard: ←/→ previous/next surah (reading-direction aware), Space
  // play/pause. Off while typing, while a sheet is open, or when this screen
  // is not the focused route (stack screens below stay mounted on web).
  const [screenFocused, setScreenFocused] = useState(true);
  useFocusEffect(
    useCallback(() => {
      setScreenFocused(true);
      return () => setScreenFocused(false);
    }, []),
  );
  const anySheetOpen =
    reciterPickerOpen ||
    translationPickerOpen ||
    secondaryPickerOpen ||
    tafsirPickerOpen ||
    tafsirAyah != null ||
    layoutPickerOpen ||
    playbackSheetOpen ||
    hifzPending != null;
  useWebScreenKeyHandler(
    (event) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        if (event.shiftKey) return undefined;
        if ((event.target as HTMLElement | null)?.getAttribute?.("role") === "slider") {
          return undefined;
        }
        const forward = (event.key === "ArrowRight") !== uiRtl;
        goToSurah(surahNumber + (forward ? 1 : -1));
        return true;
      }
      if (event.key === " ") {
        if (isWebInteractiveTarget(event.target)) return undefined;
        playPauseSurah();
        return true;
      }
      return undefined;
    },
    Platform.OS === "web" && !tv && screenFocused && !anySheetOpen,
  );

  const readerChrome = showSideFilters ? (
    <View style={styles.readerChromeRow}>
      {toolbarVisible ? (
        <PressableScale
          haptic="light"
          accessibilityRole="button"
          accessibilityLabel={t("quran.backToTop")}
          onPress={scrollToTop}
          scaleTo={0.97}
          style={[styles.readerChromeBtn, { backgroundColor: tokens.accentSoft }]}
        >
          <SymbolView
            name={{ ios: "arrow.up", android: "arrow_upward", web: "arrow_upward" }}
            size={16}
            tintColor={colors.accent}
          />
          <ThemedText type="caption" style={{ color: colors.accentText, fontWeight: "600" }}>
            {t("quran.backToTop")}
          </ThemedText>
        </PressableScale>
      ) : null}
      {fullscreen.supported ? (
        <PressableScale
          haptic="light"
          accessibilityRole="button"
          accessibilityLabel={
            fullscreen.active ? t("quran.exitFullscreen") : t("quran.enterFullscreen")
          }
          accessibilityState={{ selected: fullscreen.active }}
          onPress={() => void fullscreen.toggle()}
          scaleTo={0.97}
          style={[
            styles.readerChromeBtn,
            {
              backgroundColor: fullscreen.active ? tokens.accentSoft : colors.muted,
              borderColor: fullscreen.active ? colors.accent : "transparent",
              borderWidth: 1,
            },
          ]}
        >
          <SymbolView
            name={
              fullscreen.active
                ? {
                    ios: "arrow.down.right.and.arrow.up.left",
                    android: "fullscreen_exit",
                    web: "fullscreen_exit",
                  }
                : {
                    ios: "arrow.up.left.and.arrow.down.right",
                    android: "fullscreen",
                    web: "fullscreen",
                  }
            }
            size={16}
            tintColor={fullscreen.active ? colors.accent : colors.mutedForeground}
          />
          <ThemedText
            type="caption"
            style={{
              color: fullscreen.active ? colors.accentText : colors.mutedForeground,
              fontWeight: "600",
            }}
          >
            {fullscreen.active ? t("quran.exitFullscreen") : t("quran.enterFullscreen")}
          </ThemedText>
        </PressableScale>
      ) : null}
    </View>
  ) : null;

  // Reading controls (layout / reciter / translation / toggles). On narrow screens
  // these ride in the list header; on list–detail they move to a sticky side pane.
  const readerFilters = useMemo(() => {
    return (
      <Card padding="three">
        <View style={styles.controlRow}>
          <ControlLabel icon={CONTROL_ICONS.layout} label={t("quran.readerLayout")} />
          <SelectTrigger
            label={t("quran.layoutAyah")}
            accessibilityLabel={t("quran.readerLayout")}
            onPress={() => setLayoutPickerOpen(true)}
          />
        </View>

        <View style={[styles.controlRow, styles.translationRow]}>
          <ControlLabel icon={CONTROL_ICONS.reciter} label={t("quran.reciter")} />
          <SelectTrigger
            label={reciter.name}
            accessibilityLabel={t("quran.reciter")}
            onPress={() => setReciterPickerOpen(true)}
          />
        </View>

        <View style={[styles.controlRow, styles.translationRow]}>
          <ControlLabel icon={CONTROL_ICONS.translation} label={t("quran.translation")} />
          <SelectTrigger
            label={selectedEdition.name}
            accessibilityLabel={t("quran.translation")}
            onPress={() => setTranslationPickerOpen(true)}
          />
        </View>

        <View style={[styles.controlRow, styles.translationRow]}>
          <ControlLabel
            icon={CONTROL_ICONS.secondTranslation}
            label={t("quran.secondTranslation")}
          />
          <SelectTrigger
            label={secondaryEdition?.name ?? t("quran.secondTranslationNone")}
            accessibilityLabel={t("quran.secondTranslation")}
            onPress={() => setSecondaryPickerOpen(true)}
          />
        </View>

        <View style={[styles.controlRow, styles.translationRow]}>
          <ControlLabel icon={CONTROL_ICONS.tafsir} label={t("quran.tafsir")} />
          <SelectTrigger
            label={tafsirEdition?.name ?? t("quran.tafsirNone")}
            accessibilityLabel={t("quran.tafsir")}
            onPress={() => setTafsirPickerOpen(true)}
          />
        </View>
        {translationLoading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color={colors.accent} />
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("quran.loadingTranslation")}
            </ThemedText>
          </View>
        ) : usingFallback ? (
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.offlineNote}>
            {t("quran.offlineTranslation")}
          </ThemedText>
        ) : null}

        <PrefToggle
          icon={CONTROL_ICONS.showTransliteration}
          label={t("quran.showTransliteration")}
          enabled={showTransliteration}
          onToggle={() => void toggleTransliteration()}
        />
        <PrefToggle
          icon={CONTROL_ICONS.showTranslation}
          label={t("quran.showTranslation")}
          enabled={showTranslation}
          onToggle={() => void toggleTranslation()}
        />
        <PrefToggle
          icon={CONTROL_ICONS.wordByWord}
          label={t("quran.showWordByWord")}
          enabled={showWordByWord}
          onToggle={() => updatePrefs({ showWordByWord: !showWordByWord })}
        />
        <PrefToggle
          icon={CONTROL_ICONS.tajweed}
          label={t("quran.showTajweed")}
          enabled={showTajweed}
          onToggle={() => updatePrefs({ showTajweed: !showTajweed })}
        />
        {studyExtrasLoading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color={colors.accent} />
            <ThemedText type="caption" themeColor="mutedForeground">
              {showWordByWord && showTajweed
                ? `${t("quran.wordByWord.loading")} / ${t("quran.tajweed.loading")}`
                : showTajweed
                  ? t("quran.tajweed.loading")
                  : t("quran.wordByWord.loading")}
            </ThemedText>
          </View>
        ) : null}

        <View style={[styles.controlRow, styles.translationRow]}>
          <ControlLabel icon={CONTROL_ICONS.playback} label={t("quran.playback.title")} />
          <SelectTrigger
            label={playbackSummary.label}
            accessibilityLabel={t("quran.playback.open")}
            active={playbackSummary.active}
            onPress={() => setPlaybackSheetOpen(true)}
          />
        </View>

        <View
          style={[
            styles.controlRow,
            styles.translationRow,
            tv && styles.controlRowTv,
            tv && styles.controlRowStackTv,
          ]}
        >
          <ControlLabel icon={CONTROL_ICONS.textSize} label={t("reading.textSize")} />
          <View style={[styles.controlValue, tv && styles.controlValueTv]}>
            <ReadingFontControls surface="quran" />
          </View>
        </View>

        {/* Side pane: play / pause lives in the surah navigation card above. */}
        {showSideFilters ? null : <PlaySurahButton onPress={() => playFrom(0)} />}
        <MoreInSettingsLink settingId="quran.reader.layout" />
      </Card>
    );
  }, [
    colors.accent,
    playFrom,
    showSideFilters,
    showTransliteration,
    showTranslation,
    showWordByWord,
    showTajweed,
    studyExtrasLoading,
    reciter.name,
    secondaryEdition?.name,
    selectedEdition.name,
    t,
    tafsirEdition?.name,
    translationLoading,
    tv,
    usingFallback,
    playbackSummary.active,
    playbackSummary.label,
    toggleTransliteration,
    toggleTranslation,
  ]);

  // Bismillah (+ tajweed legend on narrow) rides above the ayah list. Filters and
  // the tajweed legend move to the side pane on list–detail (not TV).
  const listHeader = useMemo(() => {
    if (!surah) return null;
    return (
      <View style={styles.listHeader} onLayout={onHeaderCardLayout}>
        {!showSideFilters ? readerFilters : null}

        {!showSideFilters && showTajweed ? (
          <View onLayout={onTajweedLegendLayout}>
            <TajweedLegend />
          </View>
        ) : null}

        {surah.bismillahPre ? (
          <ThemedText
            type="arabic"
            style={[styles.bismillah, arabicReadingLayout(readingSizes.arabic - 2, "center")]}
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </ThemedText>
        ) : null}
      </View>
    );
  }, [
    showSideFilters,
    onHeaderCardLayout,
    onTajweedLegendLayout,
    readerFilters,
    readingSizes.arabic,
    showTajweed,
    surah,
  ]);

  const locale = i18n.language?.split("-")[0] ?? "en";

  // Row props that change independently of the ayah `data` array. Word maps,
  // recitation highlight, and play/pause chrome update via QuranWordStudyProviders
  // — never extraData (track changes would remount every visible word grid).
  const ayahRowExtras = useMemo(
    () => ({
      arabicSize: readingSizes.arabic,
      translitSize: readingSizes.transliteration,
      translationSize: readingSizes.translation,
      showTransliteration,
      showTranslation,
      showWordByWord,
      showTajweed,
      translationDir,
      secondaryDir,
      focusHighlightAyah,
      translation,
      transliteration,
      secondTranslation,
      tajweedByAyah,
      bookmarkedSet,
      hifzMap,
      locale,
      activeShareKey,
      gesturePendingKey,
    }),
    [
      activeShareKey,
      bookmarkedSet,
      focusHighlightAyah,
      gesturePendingKey,
      hifzMap,
      locale,
      showTransliteration,
      showTranslation,
      readingSizes.arabic,
      readingSizes.transliteration,
      readingSizes.translation,
      secondTranslation,
      secondaryDir,
      showTajweed,
      showWordByWord,
      tajweedByAyah,
      translation,
      translationDir,
      transliteration,
    ],
  );

  const ayahRowExtrasRef = useRef(ayahRowExtras);
  ayahRowExtrasRef.current = ayahRowExtras;

  // TV lean-back: land on the deep-linked / resumed ayah, else the first ayah.
  const tvInitialFocusIndex = tv ? Math.max(0, (focusAyah ?? 1) - 1) : -1;
  const openAyahActions = useCallback((index: number) => setTvActionIndex(index), []);

  const renderAyahCard = useCallback(
    (ayah: Ayah, index: number) => {
      const extras = ayahRowExtrasRef.current;
      const ayahKey = String(ayah.ayah);
      const ayahShareKey = `${surahNumber}:${ayah.ayah}`;
      return (
        <AyahRow
          ayah={ayah}
          index={index}
          surahNumber={surahNumber}
          locale={extras.locale}
          arabicSize={extras.arabicSize}
          translitSize={extras.translitSize}
          translationSize={extras.translationSize}
          hifzStatus={extras.hifzMap[hifzKey(surahNumber, ayah.ayah)]}
          onHifzAyah={handleHifzAyah}
          secondTranslation={
            extras.showTranslation && extras.secondTranslation
              ? extras.secondTranslation[ayahKey]
              : undefined
          }
          secondTranslationDir={extras.secondaryDir}
          transliteration={extras.showTransliteration ? extras.transliteration[ayahKey] : undefined}
          translation={extras.showTranslation ? (extras.translation[ayahKey] ?? "") : ""}
          translationDir={extras.translationDir}
          showWordByWord={extras.showWordByWord}
          tajweedSegments={extras.showTajweed ? extras.tajweedByAyah[ayahKey] : undefined}
          highlighted={ayah.ayah === extras.focusHighlightAyah}
          isBookmarked={extras.bookmarkedSet.has(ayahShareKey)}
          onPlayAtIndex={playOrToggleAyah}
          onBookmarkAyah={handleBookmarkAyah}
          onShareAyah={shareAyah}
          onOpenTafsir={openTafsirForAyah}
          isSharing={extras.activeShareKey === ayahShareKey}
          isGesturePending={extras.gesturePendingKey === ayahShareKey}
          onOpenActions={tv ? openAyahActions : undefined}
          tvPreferredFocus={index === tvInitialFocusIndex}
        />
      );
    },
    [
      handleBookmarkAyah,
      handleHifzAyah,
      openAyahActions,
      openTafsirForAyah,
      playOrToggleAyah,
      shareAyah,
      surahNumber,
      tv,
      tvInitialFocusIndex,
    ],
  );

  const renderItem = useCallback(
    ({ item: ayah, index }: ListRenderItemInfo<Ayah>) => renderAyahCard(ayah, index),
    [renderAyahCard],
  );

  if (!surah) {
    return (
      <>
        <Seo
          path={`/quran/${params.surah}`}
          title={t("quran.notFoundTitle")}
          description={t("quran.notFoundDesc")}
          index={false}
        />
        <ScreenLayout title={t("quran.title")} onBack={() => goBackOrReplace(router, "/")}>
          <EmptyState
            icon={{ ios: "questionmark.circle", android: "help", web: "help" }}
            title={t("quran.notFoundTitle")}
            description={t("quran.notFoundDesc")}
          />
        </ScreenLayout>
      </>
    );
  }

  const revelation = surah.revelationPlace === "makkah" ? "Makkah" : "Madinah";
  const surahTitle = `Surah ${surah.nameTransliteration} — ${surah.nameEnglish}`;
  const surahDescription = `Read and listen to Surah ${surah.nameTransliteration} (${surah.nameEnglish}), chapter ${surah.number} of the Qur'an — ${surah.ayahCount} ayahs, revealed in ${revelation}. Arabic text, transliteration, translation, and recitation, offline.`;
  const surahBreadcrumbs = [
    { name: t("tabs.home"), path: "/" },
    { name: t("quran.title"), path: "/quran" },
    { name: surah.nameTransliteration, path: `/quran/${surah.number}` },
  ];

  return (
    <>
      {SnapshotHost}
      <Seo
        path={`/quran/${surah.number}`}
        title={surahTitle}
        description={surahDescription}
        type="article"
        breadcrumbs={surahBreadcrumbs}
        keywords={[
          `Surah ${surah.nameTransliteration}`,
          surah.nameEnglish,
          `surah ${surah.number}`,
          "read Quran online",
        ]}
        jsonLd={[
          articleSchema({
            path: `/quran/${surah.number}`,
            type: "CreativeWork",
            headline: surahTitle,
            description: surahDescription,
            inLanguage: "ar",
            breadcrumbs: surahBreadcrumbs,
          }),
        ]}
      />
      <ScreenLayout
        scrollable={!!tvMappedList}
        scrollRef={tvMappedList ? screenScrollRef : undefined}
        onScroll={tvMappedList ? onTvMappedScroll : undefined}
        readingProgress={tvMappedList ? true : undefined}
        eyebrow={t("quran.title")}
        title={surah.nameTransliteration}
        subtitle={`${surah.nameEnglish} · ${t("quran.ayahCount", { count: surah.ayahCount })}`}
        onBack={() => goBackOrReplace(router, "/")}
        maxContentWidth={
          showSideFilters
            ? windowWidth >= 1600
              ? LIST_DETAIL_MAX_WIDTH_XL
              : LIST_DETAIL_MAX_WIDTH
            : undefined
        }
        headerAccessory={
          showSideFilters ? undefined : (
            <View>
              <QuranReadingToolbar
                visible={toolbarVisible}
                progress={readingProgress}
                onBackToTop={scrollToTop}
                reciterName={reciter.name}
                translationName={selectedEdition.name}
                secondTranslationName={secondaryEdition?.name ?? t("quran.secondTranslationNone")}
                tafsirName={tafsirEdition?.name ?? t("quran.tafsirNone")}
                showTransliteration={showTransliteration}
                showTranslation={showTranslation}
                showWordByWord={showWordByWord}
                showTajweed={showTajweed}
                layoutLabel={t("quran.layoutAyah")}
                onOpenLayout={() => setLayoutPickerOpen(true)}
                onOpenReciter={() => setReciterPickerOpen(true)}
                onOpenTranslation={() => setTranslationPickerOpen(true)}
                onOpenSecondary={() => setSecondaryPickerOpen(true)}
                onOpenTafsir={() => setTafsirPickerOpen(true)}
                onToggleTransliteration={() => void toggleTransliteration()}
                onToggleTranslation={() => void toggleTranslation()}
                onToggleWordByWord={() => updatePrefs({ showWordByWord: !showWordByWord })}
                onToggleTajweed={() => updatePrefs({ showTajweed: !showTajweed })}
                onOpenPlayback={() => setPlaybackSheetOpen(true)}
                playbackLabel={toolbarPlaybackSummary.label}
                playbackActive={toolbarPlaybackSummary.active}
              />
              <TajweedStickyLegendBar visible={showTajweed && tajweedBarVisible} />
            </View>
          )
        }
      >
        <AyahFocusTrackerContext.Provider value={ayahFocusRef}>
          <QuranWordStudyProviders
            wordAudioEnabled={showWordByWord}
            playingAyah={playingAyahNumber}
            audioIsPlaying={audioIsPlaying}
            activeWordIndex={activeWordIndex}
            wordsByAyah={wordByWordByAyah}
            surah={surahNumber}
            focusWord={focusWordValue}
          >
            {tvMappedList ? (
              <View style={[styles.tvMappedRoot, { paddingBottom: contentBottomInset }]}>
                {listHeader}
                {ayahs.map((ayah, index) => (
                  <View
                    key={ayahKeyExtractor(ayah)}
                    ref={registerAyahScroll(`${surahNumber}:${ayah.ayah}`)}
                  >
                    {index > 0 ? <AyahSeparator /> : null}
                    {renderAyahCard(ayah, index)}
                  </View>
                ))}
              </View>
            ) : (
              <View style={showSideFilters ? styles.listDetailRoot : styles.readerRoot}>
                <SurahAyahList
                  listRef={listRef}
                  data={ayahs}
                  extraData={ayahRowExtras}
                  heavyRows={showWordByWord}
                  keyExtractor={ayahKeyExtractor}
                  renderItem={renderItem}
                  ListHeaderComponent={listHeader ?? undefined}
                  ItemSeparatorComponent={AyahSeparator}
                  onScroll={onListScroll}
                  onScrollBeginDrag={onScrollBeginDrag}
                  onViewableItemsChanged={onViewableItemsChanged}
                  viewabilityConfig={viewabilityConfig}
                  onScrollToIndexFailed={onScrollToIndexFailed}
                  style={showSideFilters ? styles.listDetailPrimary : undefined}
                  contentContainerStyle={[
                    { paddingBottom: contentBottomInset },
                    // Keep the Arabic + translation at a readable measure; the
                    // side pane takes the remaining width.
                    showSideFilters && styles.readingColumn,
                  ]}
                />
                {showSideFilters ? (
                  <View
                    style={[
                      styles.listDetailSecondary,
                      tv && styles.listDetailSecondaryTv,
                      { borderStartColor: tokens.hairline },
                    ]}
                  >
                    {readerChrome}
                    <TvScrollView
                      style={styles.listDetailSecondaryScroll}
                      contentContainerStyle={[
                        styles.listDetailSecondaryContent,
                        { paddingBottom: contentBottomInset },
                      ]}
                      showsVerticalScrollIndicator={false}
                      keyboardShouldPersistTaps="handled"
                    >
                      <SurahNavCard
                        surahNumber={surahNumber}
                        ayahCount={ayahs.length}
                        audioActive={audioActiveKey != null}
                        audioPlaying={audioActiveKey != null && audioIsPlaying}
                        onGoToSurah={goToSurah}
                        onJumpToAyah={jumpToAyah}
                        onPlayPause={playPauseSurah}
                      />
                      {showTajweed ? <TajweedLegend /> : null}
                      {readerFilters}
                      <QuranNotesSidePanel surah={surahNumber} onOpenAyah={jumpToAyah} />
                    </TvScrollView>
                  </View>
                ) : null}
              </View>
            )}
          </QuranWordStudyProviders>
        </AyahFocusTrackerContext.Provider>
      </ScreenLayout>

      <OptionPickerSheet
        visible={layoutPickerOpen}
        title={t("quran.readerLayout")}
        options={layoutOptions}
        selectedId="ayah"
        onSelect={handleLayoutSelect}
        onClose={() => setLayoutPickerOpen(false)}
      />
      <OptionPickerSheet
        visible={reciterPickerOpen}
        title={t("quran.reciter")}
        options={RECITER_OPTIONS}
        selectedId={reciterDir}
        onSelect={handleReciterSelect}
        onClose={() => setReciterPickerOpen(false)}
      />
      <TranslationPickerSheet
        visible={translationPickerOpen}
        title={t("quran.translation")}
        selectedId={knownEdition}
        preferredLanguages={[translationLocale, appLocale]}
        onSelect={(id) => updatePrefs({ preferredTranslationIds: [id] })}
        onClose={() => setTranslationPickerOpen(false)}
      />
      <TranslationPickerSheet
        visible={secondaryPickerOpen}
        title={t("quran.secondTranslation")}
        allowNone
        selectedId={secondaryId ?? ""}
        preferredLanguages={[translationLocale, appLocale]}
        onSelect={(id) => updatePrefs({ secondaryTranslationId: id || undefined })}
        onClose={() => setSecondaryPickerOpen(false)}
      />
      <TafsirPickerSheet
        visible={tafsirPickerOpen}
        title={t("quran.tafsir")}
        allowNone
        selectedId={activeTafsirId ?? ""}
        preferredLanguages={[translationLocale, appLocale]}
        onSelect={(id) => updatePrefs({ preferredTafsirId: id })}
        onClose={() => setTafsirPickerOpen(false)}
      />
      <TafsirAyahSheet
        visible={tafsirAyah != null}
        onClose={() => setTafsirAyah(null)}
        surah={surahNumber}
        ayah={tafsirAyah ?? 1}
        editionName={tafsirEdition?.name ?? t("quran.tafsir")}
        author={tafsirEdition?.author ?? ""}
        text={tafsirAyah != null ? tafsirMap?.[String(tafsirAyah)] : undefined}
        direction={tafsirEdition?.direction ?? "ltr"}
        loading={tafsirLoading}
        offline={tafsirOffline}
      />
      <PlaybackSettingsSheet
        visible={playbackSheetOpen}
        onClose={() => setPlaybackSheetOpen(false)}
        ayahCount={ayahs.length}
        repeatMode={prefs.repeatMode ?? "off"}
        repeatRange={prefs.repeatRange ?? { start: 1, end: Math.max(1, ayahs.length) }}
        translationAudio={prefs.translationAudio ?? "off"}
        ttsLang={ttsLang}
        ttsVoiceId={ttsVoiceId}
        onRepeatModeChange={(mode) => updatePrefs({ repeatMode: mode })}
        onRepeatRangeChange={(range) => updatePrefs({ repeatRange: range })}
        onTranslationAudioChange={(mode) => updatePrefs({ translationAudio: mode })}
        onTtsVoiceChange={(voiceId) => void setTtsVoice(ttsLang, voiceId)}
      />
      {tv ? (
        <TvAyahActions
          ayah={tvActionIndex != null ? ayahs[tvActionIndex] : undefined}
          surahNumber={surahNumber}
          surahName={surah.nameTransliteration}
          surahNameEnglish={surah.nameEnglish}
          locale={locale}
          translation={translation}
          isBookmarked={
            tvActionIndex != null && ayahs[tvActionIndex] != null
              ? bookmarkedSet.has(`${surahNumber}:${ayahs[tvActionIndex].ayah}`)
              : false
          }
          isPlaying={
            tvActionIndex != null &&
            audioIsPlaying &&
            currentAudioId === `${surahNumber}:${ayahs[tvActionIndex]?.ayah}`
          }
          hifzStatus={
            tvActionIndex != null && ayahs[tvActionIndex] != null
              ? hifzMap[hifzKey(surahNumber, ayahs[tvActionIndex].ayah)]
              : undefined
          }
          onClose={() => setTvActionIndex(null)}
          onPlay={() => {
            if (tvActionIndex == null) return;
            const index = tvActionIndex;
            // Close first so the reader sees the follow-along highlight.
            setTvActionIndex(null);
            playOrToggleAyah(index);
          }}
          onBookmark={(ayahNum) => void toggleBookmark(surahNumber, ayahNum)}
          onHifz={(ayahNum) => {
            setTvActionIndex(null);
            runAfterSheetDismiss(() => handleHifzAyah(surahNumber, ayahNum));
          }}
          onTafsir={(ayahNum) => {
            setTvActionIndex(null);
            runAfterSheetDismiss(() => openTafsirForAyah(ayahNum));
          }}
        />
      ) : null}
      <ConfirmDialog
        visible={hifzPending != null}
        title={t("hifz.confirmTitle")}
        message={
          hifzPending != null
            ? hifzPendingNext === "review"
              ? t("hifz.confirmReviewBody", { ref: hifzPendingRef })
              : hifzPendingNext === "memorized"
                ? t("hifz.confirmMemorizedBody", { ref: hifzPendingRef })
                : t("hifz.confirmClearBody", { ref: hifzPendingRef })
            : undefined
        }
        confirmLabel={
          hifzPendingNext === "review"
            ? t("hifz.markReview")
            : hifzPendingNext === "memorized"
              ? t("hifz.markMemorized")
              : t("hifz.clear")
        }
        cancelLabel={t("common.cancel")}
        destructive={hifzPendingNext == null}
        onConfirm={() => void confirmHifz()}
        onCancel={() => setHifzPending(null)}
        onClose={() => setHifzPending(null)}
      />
      <QuranNotesSheetHost />
    </>
  );
}

/** Icon glyphs for each reading-control row (SF Symbols → Material fallbacks). */
const CONTROL_ICONS = {
  layout: { ios: "book.pages", android: "menu_book", web: "menu_book" },
  reciter: { ios: "person.wave.2.fill", android: "record_voice_over", web: "record_voice_over" },
  translation: { ios: "translate", android: "translate", web: "translate" },
  secondTranslation: { ios: "globe", android: "language", web: "language" },
  tafsir: { ios: "book.closed.fill", android: "menu_book", web: "menu_book" },
  showTransliteration: { ios: "textformat.abc", android: "abc", web: "abc" },
  showTranslation: { ios: "text.alignleft", android: "notes", web: "notes" },
  wordByWord: { ios: "text.word.spacing", android: "space_bar", web: "space_bar" },
  tajweed: { ios: "paintpalette.fill", android: "palette", web: "palette" },
  playback: { ios: "slider.horizontal.3", android: "tune", web: "tune" },
  textSize: { ios: "textformat.size", android: "format_size", web: "format_size" },
} as const satisfies Record<string, SymbolViewProps["name"]>;

/** Leading icon + label used by every reading-control row for quick scanning. */
function ControlLabel({ icon, label }: { icon: SymbolViewProps["name"]; label: string }) {
  const { colors } = useThemeTokens();
  const tv = isTV();
  return (
    <View style={styles.controlLabel}>
      <SymbolView name={icon} size={tv ? 22 : 18} tintColor={colors.mutedForeground} />
      <ThemedText type="smallBold" style={tv ? { fontSize: TvLayout.bodyFontSize } : undefined}>
        {label}
      </ThemedText>
    </View>
  );
}

function PrefToggle({
  icon,
  label,
  enabled,
  onToggle,
}: {
  icon: SymbolViewProps["name"];
  label: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const tv = isTV();

  // TV remotes struggle with native Switch thumbs — whole-row pressables with a
  // clear on/off chrome are easier to focus and activate with Select.
  if (tv) {
    return (
      <PressableScale
        haptic="selection"
        accessibilityRole="switch"
        accessibilityLabel={label}
        accessibilityState={{ checked: enabled }}
        onPress={onToggle}
        scaleTo={0.98}
        style={[
          styles.prefToggleTv,
          {
            // On = soft fill + muted hairline; the solid accent ring is D-pad focus.
            backgroundColor: enabled ? tokens.accentSoft : colors.muted,
            borderColor: enabled ? withAlpha(colors.accent, 0.35) : tokens.hairline,
          },
        ]}
      >
        <SymbolView
          name={icon}
          size={22}
          tintColor={enabled ? colors.accent : colors.mutedForeground}
        />
        <ThemedText
          type="smallBold"
          numberOfLines={2}
          style={{
            flex: 1,
            minWidth: 0,
            fontSize: TvLayout.bodyFontSize,
            color: enabled ? colors.accentText : colors.foreground,
          }}
        >
          {label}
        </ThemedText>
        <View
          style={[
            styles.prefToggleStateTv,
            { backgroundColor: enabled ? colors.accent : colors.card },
          ]}
        >
          <ThemedText
            type="caption"
            style={{
              color: enabled ? colors.accentForeground : colors.mutedForeground,
              fontWeight: "700",
            }}
          >
            {enabled ? t("common.on") : t("common.off")}
          </ThemedText>
        </View>
      </PressableScale>
    );
  }

  return (
    <View style={[styles.controlRow, styles.toggleRow]}>
      <ControlLabel icon={icon} label={label} />
      <View style={styles.controlValue}>
        <ThemedSwitch value={enabled} onValueChange={onToggle} accessibilityLabel={label} />
      </View>
    </View>
  );
}

function PlaySurahButton({ onPress }: { onPress: () => void }) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const tv = isTV();
  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={t("quran.playSurah")}
      onPress={onPress}
      style={[styles.playSurah, tv && styles.playSurahTv, { backgroundColor: colors.accent }]}
    >
      <SymbolView name={PLAY_CIRCLE_ICON} size={tv ? 24 : 20} tintColor={colors.accentForeground} />
      <ThemedText
        type="smallBold"
        style={{
          color: colors.accentForeground,
          fontSize: tv ? TvLayout.bodyFontSize : undefined,
        }}
      >
        {t("quran.playSurah")}
      </ThemedText>
    </PressableScale>
  );
}

/**
 * Desktop / wide-tablet side pane: previous / next surah, jump to an ayah, and
 * a play–pause control for this surah (keyboard: ←/→ and Space on web).
 */
function SurahNavCard({
  surahNumber,
  ayahCount,
  audioActive,
  audioPlaying,
  onGoToSurah,
  onJumpToAyah,
  onPlayPause,
}: {
  surahNumber: number;
  ayahCount: number;
  audioActive: boolean;
  audioPlaying: boolean;
  onGoToSurah: (n: number) => void;
  onJumpToAyah: (ayah: number) => void;
  onPlayPause: () => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const backwardIcon = useChevronBackward();
  const forwardIcon = useChevronForward();
  const [ayahInput, setAyahInput] = useState("");
  const [invalid, setInvalid] = useState(false);
  const prev = surahNumber > 1 ? getSurahByNumber(surahNumber - 1) : undefined;
  const next = surahNumber < TOTAL_SURAHS ? getSurahByNumber(surahNumber + 1) : undefined;

  const submit = () => {
    const n = Number.parseInt(ayahInput, 10);
    if (!Number.isFinite(n) || n < 1 || n > ayahCount) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    setAyahInput("");
    onJumpToAyah(n);
  };

  const playLabel = audioActive
    ? audioPlaying
      ? t("quran.actionPause")
      : t("quran.actionPlay")
    : t("quran.playSurah");

  const stepButton = (target: typeof prev, direction: "prev" | "next"): ReactNode => {
    const label = direction === "prev" ? t("common.previous") : t("common.next");
    const disabled = !target;
    return (
      <PressableScale
        haptic="light"
        accessibilityRole="button"
        accessibilityLabel={target ? `${label}: ${target.nameTransliteration}` : label}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={() => target && onGoToSurah(target.number)}
        scaleTo={0.97}
        style={[
          styles.navStep,
          direction === "next" && styles.navStepNext,
          { backgroundColor: colors.muted, opacity: disabled ? 0.45 : 1 },
        ]}
      >
        {direction === "prev" ? (
          <SymbolView name={backwardIcon} size={14} tintColor={colors.mutedForeground} />
        ) : null}
        <View style={[styles.navStepCopy, direction === "next" && styles.navStepCopyNext]}>
          <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
            {label}
          </ThemedText>
          <ThemedText type="smallBold" numberOfLines={1}>
            {target ? target.nameTransliteration : "—"}
          </ThemedText>
        </View>
        {direction === "next" ? (
          <SymbolView name={forwardIcon} size={14} tintColor={colors.mutedForeground} />
        ) : null}
      </PressableScale>
    );
  };

  return (
    <Card padding="three" style={styles.navCard}>
      <View style={styles.navStepsRow}>
        {stepButton(prev, "prev")}
        {stepButton(next, "next")}
      </View>

      <View style={styles.navJumpRow}>
        <TextInput
          value={ayahInput}
          onChangeText={(text) => {
            setAyahInput(text.replace(/[^0-9]/g, ""));
            if (invalid) setInvalid(false);
          }}
          onSubmitEditing={submit}
          keyboardType="number-pad"
          inputMode="numeric"
          returnKeyType="go"
          maxLength={3}
          placeholder={t("quran.goToAyahPlaceholder", { max: ayahCount })}
          placeholderTextColor={colors.mutedForeground}
          accessibilityLabel={t("quran.goToAyahA11y")}
          style={[
            styles.navJumpInput,
            {
              color: colors.foreground,
              backgroundColor: colors.input,
              borderColor: invalid ? tokens.status.danger.color : colors.inputBorder,
              borderWidth: 1,
            },
          ]}
        />
        <PressableScale
          haptic="light"
          accessibilityRole="button"
          accessibilityLabel={t("quran.goToAyahA11y")}
          onPress={submit}
          scaleTo={0.97}
          style={[styles.navJumpGo, { backgroundColor: tokens.accentSoft }]}
        >
          <ThemedText type="smallBold" style={{ color: colors.accentText }}>
            {t("quran.goToPageAction")}
          </ThemedText>
        </PressableScale>
      </View>
      {invalid ? (
        <ThemedText type="caption" style={{ color: tokens.status.danger.text }}>
          {t("quran.goToAyahInvalid", { max: ayahCount })}
        </ThemedText>
      ) : null}

      <PressableScale
        haptic="light"
        accessibilityRole="button"
        accessibilityLabel={playLabel}
        onPress={onPlayPause}
        style={[styles.playSurah, styles.navPlay, { backgroundColor: colors.accent }]}
      >
        <SymbolView
          name={audioPlaying ? PAUSE_CIRCLE_ICON : PLAY_CIRCLE_ICON}
          size={20}
          tintColor={colors.accentForeground}
        />
        <ThemedText type="smallBold" style={{ color: colors.accentForeground }}>
          {playLabel}
        </ThemedText>
      </PressableScale>
    </Card>
  );
}

/**
 * A single ayah card. Memoized so scrolling the virtualized list only re-renders
 * rows whose props actually change (e.g. the playing/highlighted row), not every
 * mounted row on each parent render.
 */
type AyahRowProps = {
  ayah: Ayah;
  index: number;
  surahNumber: number;
  locale: string;
  transliteration?: string;
  translation: string;
  translationDir: "ltr" | "rtl";
  showWordByWord?: boolean;
  tajweedSegments?: TajweedSegment[];
  highlighted?: boolean;
  isBookmarked: boolean;
  arabicSize: number;
  translitSize: number;
  translationSize: number;
  hifzStatus?: HifzStatus;
  onHifzAyah: (surahNumber: number, ayahNumber: number) => void;
  secondTranslation?: string;
  secondTranslationDir: "ltr" | "rtl";
  onPlayAtIndex: (index: number) => void;
  onBookmarkAyah: (surahNumber: number, ayahNumber: number) => void;
  onShareAyah: (
    arabic: string,
    translation: string,
    surah: number,
    ayah: number,
    transliteration?: string,
  ) => void;
  onOpenTafsir: (ayahNumber: number) => void;
  isSharing: boolean;
  isGesturePending: boolean;
  /** TV only: Select on the card opens the action sheet (inline actions hidden). */
  onOpenActions?: (index: number) => void;
  tvPreferredFocus?: boolean;
};

function ayahRowPropsAreEqual(prev: AyahRowProps, next: AyahRowProps): boolean {
  return (
    prev.ayah === next.ayah &&
    prev.index === next.index &&
    prev.surahNumber === next.surahNumber &&
    prev.locale === next.locale &&
    prev.transliteration === next.transliteration &&
    prev.translation === next.translation &&
    prev.translationDir === next.translationDir &&
    prev.showWordByWord === next.showWordByWord &&
    prev.tajweedSegments === next.tajweedSegments &&
    prev.highlighted === next.highlighted &&
    prev.isBookmarked === next.isBookmarked &&
    prev.arabicSize === next.arabicSize &&
    prev.translitSize === next.translitSize &&
    prev.translationSize === next.translationSize &&
    prev.hifzStatus === next.hifzStatus &&
    prev.secondTranslation === next.secondTranslation &&
    prev.secondTranslationDir === next.secondTranslationDir &&
    prev.onHifzAyah === next.onHifzAyah &&
    prev.onPlayAtIndex === next.onPlayAtIndex &&
    prev.onBookmarkAyah === next.onBookmarkAyah &&
    prev.onShareAyah === next.onShareAyah &&
    prev.onOpenTafsir === next.onOpenTafsir &&
    prev.isSharing === next.isSharing &&
    prev.isGesturePending === next.isGesturePending &&
    prev.onOpenActions === next.onOpenActions &&
    prev.tvPreferredFocus === next.tvPreferredFocus
  );
}

/** Deep-link focus ring — only mounted for the target ayah, not every row. */
function AyahFocusRing({ color }: { color: string }) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    cancelAnimation(opacity);
    opacity.value = 1;
    opacity.value = withDelay(
      FOCUS_HIGHLIGHT_HOLD_MS,
      withTiming(0, { duration: FOCUS_HIGHLIGHT_FADE_MS }),
    );
  }, [opacity]);

  const focusBorderStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        styles.focusRing,
        { borderColor: color, borderRadius: Radius.lg, pointerEvents: "none" },
        focusBorderStyle,
      ]}
    />
  );
}

/**
 * TV: Select on an ayah card opens this sheet instead of a row of six inline
 * buttons per ayah, so D-pad Up/Down moves ayah-by-ayah.
 */
function TvAyahActions({
  ayah,
  surahNumber,
  surahName,
  surahNameEnglish,
  locale,
  translation,
  isBookmarked,
  isPlaying,
  hifzStatus,
  onClose,
  onPlay,
  onBookmark,
  onHifz,
  onTafsir,
}: {
  ayah?: Ayah;
  surahNumber: number;
  surahName: string;
  surahNameEnglish: string;
  locale: string;
  translation: Record<string, string>;
  isBookmarked: boolean;
  isPlaying: boolean;
  hifzStatus?: HifzStatus;
  onClose: () => void;
  onPlay: () => void;
  onBookmark: (ayah: number) => void;
  onHifz: (ayah: number) => void;
  onTafsir: (ayah: number) => void;
}) {
  const ayahNum = ayah?.ayah ?? 1;
  const reportRef = useMemo(
    () =>
      ayah
        ? buildContentReportRef(
            "quran_ayah",
            String(ayah.ayah),
            `/quran/${surahNumber}?ayah=${ayah.ayah}`,
            locale,
            {
              parentId: String(surahNumber),
              snapshot: {
                arabic: ayah.arabic,
                translation: translation[String(ayah.ayah)] ?? "",
                reference: `${surahNumber}:${ayah.ayah}`,
              },
            },
          )
        : undefined,
    [ayah, locale, surahNumber, translation],
  );
  return (
    <AyahActionSheet
      visible={ayah != null}
      surah={surahNumber}
      ayah={ayahNum}
      surahName={surahName}
      surahNameEnglish={surahNameEnglish}
      juz={ayah?.juz}
      isBookmarked={isBookmarked}
      isPlaying={isPlaying}
      hifzStatus={hifzStatus}
      onPlay={onPlay}
      onBookmark={() => onBookmark(ayahNum)}
      onHifz={() => onHifz(ayahNum)}
      onTafsir={() => onTafsir(ayahNum)}
      // The sheet hides Share on TV (no system share sheet); keep the prop satisfied.
      onShare={onClose}
      reportRef={reportRef}
      onClose={onClose}
    />
  );
}

function AyahStudyCard({
  surahNumber,
  ayahNumber,
  children,
  onSelect,
  preferredFocus,
}: {
  surahNumber: number;
  ayahNumber: number;
  children: ReactNode;
  /** TV: the whole card is one focus target; Select opens the ayah action sheet. */
  onSelect?: () => void;
  preferredFocus?: boolean;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { ayah } = useQuranPlayback();
  const tracker = useContext(AyahFocusTrackerContext);
  const isActive = ayah === ayahNumber;

  if (onSelect) {
    const focus = tracker?.current;
    // Follow-along: hand focus to the newly playing ayah only when the reader
    // was resting on the previously playing card — never steal it from chrome
    // or from an ayah the user browsed to.
    const follow = Boolean(
      isActive &&
        focus &&
        focus.focused != null &&
        focus.focused !== ayahNumber &&
        focus.focused === focus.prevPlaying,
    );
    return (
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={t("quran.ayahRef", { surah: surahNumber, ayah: ayahNumber })}
        accessibilityState={{ selected: isActive }}
        onPress={onSelect}
        onFocus={() => {
          if (focus) focus.focused = ayahNumber;
        }}
        onBlur={() => {
          if (focus && focus.focused === ayahNumber) focus.focused = null;
        }}
        {...(preferredFocus || follow ? { hasTVPreferredFocus: true } : {})}
        scaleTo={0.99}
        style={[
          styles.ayahCardTv,
          // Playing = soft fill + hairline; the accent ring is reserved for focus.
          isActive
            ? {
                backgroundColor: tokens.accentSoft,
                borderColor: withAlpha(colors.accent, 0.35),
              }
            : { backgroundColor: colors.card, borderColor: tokens.hairline },
        ]}
      >
        {children}
      </PressableScale>
    );
  }

  return (
    <Card
      padding="four"
      style={isActive ? { borderColor: colors.accent, borderWidth: 1 } : undefined}
    >
      {children}
    </Card>
  );
}

function AyahPlayButton({ ayahNumber, onPlay }: { ayahNumber: number; onPlay: () => void }) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { ayah, isPlaying } = useQuranPlayback();
  const thisPlaying = ayah === ayahNumber && isPlaying;
  return (
    <LabeledIconButton
      name={thisPlaying ? PAUSE_CIRCLE_ICON : PLAY_CIRCLE_ICON}
      label={thisPlaying ? t("quran.actionPause") : t("quran.actionPlay")}
      tintColor={colors.accent}
      labelColor={colors.accent}
      background={tokens.accentSoft}
      accessibilityLabel={
        thisPlaying ? t("quran.pauseAyah") : t("quran.playAyah", { n: ayahNumber })
      }
      onPress={onPlay}
    />
  );
}

function AyahContinuePill({
  ayahNumber,
  highlighted,
}: {
  ayahNumber: number;
  highlighted?: boolean;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { ayah } = useQuranPlayback();
  if (!highlighted || ayah === ayahNumber) return null;
  return (
    <Pill
      compact
      label={t("quran.continueReading")}
      color={colors.accentText}
      background={withAlpha(colors.accent, tokens.isDark ? 0.28 : 0.16)}
    />
  );
}

function AyahFocusRingIfNeeded({
  ayahNumber,
  highlighted,
}: {
  ayahNumber: number;
  highlighted?: boolean;
}) {
  const { colors } = useThemeTokens();
  const { ayah } = useQuranPlayback();
  if (!highlighted || ayah === ayahNumber) return null;
  return <AyahFocusRing color={colors.accent} />;
}

const AyahRow = memo(function AyahRow({
  ayah,
  index,
  surahNumber,
  locale,
  transliteration,
  translation,
  translationDir,
  showWordByWord,
  tajweedSegments,
  highlighted,
  isBookmarked,
  arabicSize,
  translitSize,
  translationSize,
  hifzStatus,
  onHifzAyah,
  secondTranslation,
  secondTranslationDir,
  onPlayAtIndex,
  onBookmarkAyah,
  onShareAyah,
  onOpenTafsir,
  isSharing,
  isGesturePending,
  onOpenActions,
  tvPreferredFocus,
}: AyahRowProps) {
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();
  const tv = isTV();

  const handlePlay = useCallback(() => onPlayAtIndex(index), [index, onPlayAtIndex]);
  const handleBookmark = useCallback(
    () => onBookmarkAyah(surahNumber, ayah.ayah),
    [ayah.ayah, onBookmarkAyah, surahNumber],
  );
  const handleShare = useCallback(
    () => onShareAyah(ayah.arabic, translation, surahNumber, ayah.ayah, transliteration),
    [ayah.arabic, ayah.ayah, onShareAyah, surahNumber, translation, transliteration],
  );
  const handleTafsir = useCallback(() => onOpenTafsir(ayah.ayah), [ayah.ayah, onOpenTafsir]);
  const handleOpenActions = useCallback(() => onOpenActions?.(index), [index, onOpenActions]);
  const cardActions = Boolean(tv && onOpenActions);
  const handleHifz = useCallback(
    () => onHifzAyah(surahNumber, ayah.ayah),
    [ayah.ayah, onHifzAyah, surahNumber],
  );
  const practiceRouter = useRouter();
  const showPractise = !tv && isPracticeAvailable();
  // "Practise this ayah": straight into a one-ayah session in the saved default mode.
  const handlePractise = useCallback(
    () =>
      practiceRouter.push({
        pathname: "/quran/practice/session",
        params: {
          surah: String(surahNumber),
          from: String(ayah.ayah),
          to: String(ayah.ayah),
          source: "reader",
        },
      }),
    [ayah.ayah, practiceRouter, surahNumber],
  );

  // NF-3.24 "Check my recitation": a one-ayah pronunciation check.
  const showCheck = showPractise && isPronunciationCheckPlatformAvailable();
  const handleCheck = useCallback(
    () => practiceRouter.push(pronunciationCheckHref(surahNumber, ayah.ayah, ayah.ayah, "reader")),
    [ayah.ayah, practiceRouter, surahNumber],
  );

  const reportRef = useMemo(
    () =>
      buildContentReportRef(
        "quran_ayah",
        String(ayah.ayah),
        `/quran/${surahNumber}?ayah=${ayah.ayah}`,
        locale,
        {
          parentId: String(surahNumber),
          snapshot: {
            arabic: ayah.arabic,
            translation,
            reference: `${surahNumber}:${ayah.ayah}`,
          },
        },
      ),
    [ayah.arabic, ayah.ayah, locale, surahNumber, translation],
  );

  return (
    <View style={styles.ayahRow}>
      <AyahStudyCard
        surahNumber={surahNumber}
        ayahNumber={ayah.ayah}
        onSelect={cardActions ? handleOpenActions : undefined}
        preferredFocus={cardActions && tvPreferredFocus}
      >
        <View style={[styles.ayahHeader, tv && styles.ayahHeaderTv]}>
          <View style={styles.ayahIdentity}>
            <View style={[styles.ayahBadge, { backgroundColor: tokens.accentSoft }]}>
              <ThemedText
                type="caption"
                numberOfLines={1}
                style={{ color: colors.accent, textAlign: "center" }}
              >
                {ayah.ayah}
              </ThemedText>
            </View>
            <AyahContinuePill ayahNumber={ayah.ayah} highlighted={highlighted} />
            <AyahNoteMarker surah={surahNumber} ayah={ayah.ayah} ayahText={ayah.arabic} />
          </View>
          {cardActions ? (
            ayah.sajda ? (
              <Pill label="۩" color={colors.accent} background={tokens.accentSoft} />
            ) : null
          ) : (
            <View style={[styles.ayahActions, tv && styles.ayahActionsTv]}>
              {ayah.sajda ? (
                <Pill label="۩" color={colors.accent} background={tokens.accentSoft} />
              ) : null}
              <AyahPlayButton ayahNumber={ayah.ayah} onPlay={handlePlay} />
              <LabeledIconButton
                name={
                  hifzStatus === "memorized"
                    ? { ios: "checkmark.circle.fill", android: "check_circle", web: "check_circle" }
                    : hifzStatus === "review"
                      ? { ios: "arrow.triangle.2.circlepath", android: "sync", web: "sync" }
                      : { ios: "book.closed", android: "menu_book", web: "menu_book" }
                }
                label={
                  hifzStatus === "memorized"
                    ? t("quran.actionMemorized")
                    : hifzStatus === "review"
                      ? t("quran.actionReview")
                      : t("hifz.short")
                }
                tintColor={
                  hifzStatus === "memorized"
                    ? tokens.status.success.color
                    : hifzStatus === "review"
                      ? tokens.status.warning.color
                      : colors.mutedForeground
                }
                labelColor={
                  hifzStatus === "memorized"
                    ? tokens.status.success.color
                    : hifzStatus === "review"
                      ? tokens.status.warning.color
                      : colors.mutedForeground
                }
                accessibilityLabel={
                  hifzStatus === "memorized"
                    ? t("hifz.clear")
                    : hifzStatus === "review"
                      ? t("hifz.markMemorized")
                      : t("hifz.markReview")
                }
                accessibilityState={{ selected: !!hifzStatus }}
                haptic="selection"
                onPress={handleHifz}
              />
              {showPractise ? (
                <LabeledIconButton
                  name={{ ios: "mic", android: "mic_none", web: "mic_none" }}
                  label={t("quranCompanion.entry.practise")}
                  tintColor={colors.mutedForeground}
                  labelColor={colors.mutedForeground}
                  accessibilityLabel={t("quranCompanion.entry.practiseAyah", { n: ayah.ayah })}
                  onPress={handlePractise}
                />
              ) : null}
              {showCheck ? (
                <LabeledIconButton
                  name={{ ios: "waveform", android: "graphic_eq", web: "graphic_eq" }}
                  label={t("quranPronunciation.entry.check")}
                  tintColor={colors.mutedForeground}
                  labelColor={colors.mutedForeground}
                  accessibilityLabel={t("quranPronunciation.entry.checkAyah", { n: ayah.ayah })}
                  onPress={handleCheck}
                />
              ) : null}
              <LabeledIconButton
                name={
                  isBookmarked
                    ? { ios: "bookmark.fill", android: "bookmark", web: "bookmark" }
                    : { ios: "bookmark", android: "bookmark_border", web: "bookmark_border" }
                }
                label={isBookmarked ? t("quran.actionBookmarked") : t("quran.actionBookmark")}
                tintColor={isBookmarked ? tokens.status.warning.color : colors.mutedForeground}
                labelColor={isBookmarked ? tokens.status.warning.color : colors.mutedForeground}
                accessibilityLabel={
                  isBookmarked ? t("quran.bookmarkRemove") : t("quran.bookmarkAdd")
                }
                accessibilityState={{ selected: isBookmarked }}
                onPress={handleBookmark}
              />
              <AyahNoteActions surah={surahNumber} ayah={ayah.ayah} />
              <LabeledIconButton
                name={{ ios: "book.closed.fill", android: "menu_book", web: "menu_book" }}
                label={t("quran.actionTafsir")}
                tintColor={colors.mutedForeground}
                labelColor={colors.mutedForeground}
                accessibilityLabel={t("quran.openTafsir")}
                onPress={handleTafsir}
              />
              <LabeledIconButton
                name={{ ios: "square.and.arrow.up", android: "share", web: "share" }}
                label={
                  isGesturePending
                    ? tTv(t, "share.tapToShare", "share.selectToShare")
                    : t("quran.actionShare")
                }
                tintColor={colors.mutedForeground}
                accessibilityLabel={t("quran.shareAyah")}
                loading={isSharing}
                loadingLabel={t("share.preparing")}
                onPress={handleShare}
              />
              <ContentReportButton contentRef={reportRef} />
            </View>
          )}
        </View>

        <AnnotatedAyahText
          surah={surahNumber}
          ayah={ayah.ayah}
          text={ayah.arabic}
          tajweedSegments={tajweedSegments}
          fontSize={arabicSize}
          style={styles.arabic}
        />

        {showWordByWord ? (
          <WordByWord
            ayahNumber={ayah.ayah}
            arabicSize={arabicSize}
            translitSize={translitSize}
            glossSize={translationSize}
          />
        ) : null}

        {transliteration ? (
          <ThemedText
            type="small"
            style={[styles.translit, { color: colors.accent, fontSize: translitSize }]}
          >
            {transliteration}
          </ThemedText>
        ) : null}

        {translation ? (
          <ThemedText
            type="default"
            style={[
              styles.translation,
              { fontSize: translationSize },
              translationDir === "rtl" ? styles.rtl : null,
            ]}
          >
            {translation}
          </ThemedText>
        ) : null}

        {secondTranslation ? (
          <ThemedText
            type="default"
            themeColor="mutedForeground"
            style={[
              styles.secondTranslation,
              { fontSize: translationSize, borderTopColor: tokens.hairline },
              secondTranslationDir === "rtl" ? styles.rtl : null,
            ]}
          >
            {secondTranslation}
          </ThemedText>
        ) : null}
      </AyahStudyCard>
      <AyahFocusRingIfNeeded ayahNumber={ayah.ayah} highlighted={highlighted} />
    </View>
  );
}, ayahRowPropsAreEqual);

const styles = StyleSheet.create({
  readerRoot: { flex: 1, width: "100%" },
  readingColumn: {
    width: "100%",
    maxWidth: READING_COLUMN_MAX_WIDTH,
    alignSelf: "center",
  },
  navCard: { gap: Spacing.three },
  navStepsRow: { flexDirection: "row", gap: Spacing.two },
  navStep: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two + 2,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
  },
  navStepNext: { justifyContent: "flex-end" },
  navStepCopy: { flex: 1, minWidth: 0, gap: 2 },
  navStepCopyNext: { alignItems: "flex-end" },
  navJumpRow: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  navJumpInput: {
    flex: 1,
    minWidth: 0,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    fontSize: 15,
  },
  navJumpGo: {
    minHeight: 38,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  navPlay: { marginTop: 0 },
  tvMappedRoot: { width: "100%", gap: 0 },
  listDetailRoot: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    gap: Spacing.four,
  },
  listDetailPrimary: {
    flex: 1.25,
    minWidth: 0,
  },
  listDetailSecondary: {
    flex: 1,
    minWidth: 280,
    maxWidth: 400,
    borderStartWidth: StyleSheet.hairlineWidth,
    gap: Spacing.three,
  },
  listDetailSecondaryTv: {
    minWidth: TvLayout.detailPaneMinWidth,
    maxWidth: TvLayout.detailPaneMaxWidth,
  },
  listDetailSecondaryScroll: {
    flex: 1,
  },
  listDetailSecondaryContent: {
    paddingStart: Spacing.four,
    flexGrow: 1,
    gap: Spacing.three,
  },
  readerChromeRow: {
    flexDirection: "row",
    gap: Spacing.two,
    paddingStart: Spacing.four,
  },
  readerChromeBtn: {
    flex: 1,
    minHeight: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.one + 2,
    paddingVertical: Spacing.one + 2,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
  },
  listHeader: { gap: Spacing.four, marginBottom: Spacing.two },
  controlRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  controlRowTv: {
    minHeight: TvLayout.minFocusTarget,
  },
  controlRowStackTv: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: Spacing.two,
  },
  controlLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    flexShrink: 0,
  },
  /** Pushes switches / font controls to the outer edge opposite the label. */
  controlValue: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    minWidth: 0,
  },
  controlValueTv: {
    width: "100%",
    justifyContent: "flex-start",
  },
  prefToggleTv: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    minHeight: TvLayout.minFocusTarget,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    marginTop: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: 1,
  },
  prefToggleStateTv: {
    paddingHorizontal: Spacing.two + 2,
    paddingVertical: Spacing.one,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    minWidth: 44,
    alignItems: "center",
  },
  toggleRow: { marginTop: Spacing.three },
  translationRow: { marginTop: Spacing.three },
  offlineNote: { marginTop: Spacing.two },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  playSurah: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    marginTop: Spacing.three,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  playSurahTv: {
    minHeight: TvLayout.minFocusTarget,
    gap: Spacing.three,
  },
  bismillah: { marginBottom: Spacing.two },
  ayahRow: { position: "relative" },
  ayahCardTv: {
    width: "100%",
    padding: Spacing.four,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
  focusRing: {
    ...StyleSheet.absoluteFill,
    borderWidth: 1,
    borderCurve: "continuous",
  },
  ayahHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.three,
    gap: Spacing.two,
  },
  ayahHeaderTv: {
    alignItems: "flex-start",
    marginBottom: Spacing.four,
    gap: Spacing.three,
  },
  ayahIdentity: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    flexShrink: 0,
  },
  ayahBadge: {
    minWidth: 36,
    minHeight: 30,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  ayahActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    flex: 1,
    minWidth: 0,
    gap: Spacing.one,
  },
  ayahActionsTv: {
    gap: Spacing.two,
  },
  arabic: {},
  translit: { fontStyle: "italic", marginTop: Spacing.three },
  translation: { marginTop: Spacing.two },
  secondTranslation: {
    marginTop: Spacing.three,
    paddingTop: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  rtl: { writingDirection: "rtl" },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/quran/[surah]");
