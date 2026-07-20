import { getTafsirEdition, resolveIntlLocale } from "@munib-tracker/shared/i18n";
import type {
  Ayah,
  QuranReaderLayout,
  QuranWord,
  TajweedSegment,
} from "@munib-tracker/shared/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  type FlatList,
  type LayoutChangeEvent,
  type ListRenderItemInfo,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
  type ViewToken,
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
import { AyahSeparator, ayahKeyExtractor, SurahAyahList } from "@/components/quran/ayah-reader";
import { OptionPickerSheet, SelectTrigger } from "@/components/quran/option-picker-sheet";
import { PlaybackSettingsSheet } from "@/components/quran/playback-settings-sheet";
import { QuranReadingToolbar } from "@/components/quran/reading-toolbar";
import { TafsirAyahSheet } from "@/components/quran/tafsir-ayah-sheet";
import { TafsirPickerSheet } from "@/components/quran/tafsir-picker-sheet";
import { TajweedLegend, TajweedStickyLegendBar } from "@/components/quran/tajweed-legend";
import { TajweedText } from "@/components/quran/tajweed-text";
import { TranslationPickerSheet } from "@/components/quran/translation-picker-sheet";
import { WordByWord } from "@/components/quran/word-by-word";
import { ReadingFontControls } from "@/components/reading-font-controls";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { LabeledIconButton } from "@/components/ui/labeled-icon-button";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ThemedSwitch } from "@/components/ui/themed-switch";
import { PAUSE_CIRCLE_ICON, PLAY_CIRCLE_ICON } from "@/constants/media-icons";
import { Durations } from "@/constants/motion";
import { quranComRecitationId } from "@/constants/tajweed";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
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
import { useReadingFullscreen } from "@/hooks/use-reading-fullscreen";
import { useScrollToActiveIndex } from "@/hooks/use-scroll-to-active";
import { useShareContentCard } from "@/hooks/use-share-content-card";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { buildContentReportRef } from "@/lib/content-report-ref";
import { goBackOrReplace } from "@/lib/navigation";
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
import { normalizeRepeatPlan } from "@/lib/quran-repeat";
import { resolvePreferredTafsirId } from "@/lib/quran-tafsir-options";
import { ALL_QURAN_TRANSLATIONS } from "@/lib/quran-translation-options";
import { activeWordIndexAt } from "@/lib/quran-word-timing";
import { arabicReadingLayout, resolveReadingFontSizes } from "@/lib/reading-typography";
import { articleSchema } from "@/lib/seo/structured-data";
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

const RECITER_OPTIONS = RECITERS.map((r) => ({ id: r.dir, label: r.name }));

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
  const params = useLocalSearchParams<{ surah: string; ayah?: string }>();
  const surahNumber = Number(params.surah);
  const surah = getSurahByNumber(surahNumber);
  // Optional deep-link target (e.g. from universal search) — scroll to & mark it.
  const focusAyah = params.ayah ? Number(params.ayah) : undefined;

  const { colors, tokens } = useThemeTokens();
  const contentBottomInset = useContentBottomInset();
  const { isListDetail } = useLargeScreenLayout();
  const fullscreen = useReadingFullscreen({ exitOnBlur: true });
  const prefs = useQuranPrefs();
  const { fontPrefs, translationLocale, locale: appLocale } = usePreferences();
  const defaultEditionId = resolveQuranEditionId({ translationLocale, locale: appLocale });
  const readingSizes = resolveReadingFontSizes("quran", fontPrefs);
  const { updatePrefs, setLastRead, toggleBookmark, recordProgress } = useQuranActions();
  useEnsureHifzLoaded();
  const hifzMap = useHifzMap();
  const { cycle: cycleHifz } = useHifzActions();
  const toast = useToast();
  const bookmarks = useQuranBookmarks();
  const audio = useAudioPlayerContext();
  const listRef = useRef<FlatList<Ayah>>(null);
  const { share, isSharing, isGesturePending, SnapshotHost } = useShareContentCard();
  const [reciterPickerOpen, setReciterPickerOpen] = useState(false);
  const [translationPickerOpen, setTranslationPickerOpen] = useState(false);
  const [secondaryPickerOpen, setSecondaryPickerOpen] = useState(false);
  const [tafsirPickerOpen, setTafsirPickerOpen] = useState(false);
  const [tafsirAyah, setTafsirAyah] = useState<number | null>(null);
  const [layoutPickerOpen, setLayoutPickerOpen] = useState(false);
  const [playbackSheetOpen, setPlaybackSheetOpen] = useState(false);
  const [focusHighlightAyah, setFocusHighlightAyah] = useState<number | undefined>(focusAyah);
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

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
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
    audio.current?.id.startsWith(`${surahNumber}:`) === true ? audio.current.id : undefined;

  // Persist the top-most rendered ayah as the resume point. Skipped while audio
  // plays this surah — the player already records its own (isAudio) position and
  // auto-scroll would otherwise clobber it. Reassigned each render for fresh deps.
  flushReadingPositionRef.current = () => {
    flushTimerRef.current = null;
    const ayah = topVisibleAyahRef.current;
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

  // Follow the currently-playing card (or a deep-linked ayah) via scrollToIndex.
  const activeKey = audioActiveKey ?? (focusAyah ? `${surahNumber}:${focusAyah}` : undefined);
  const { onScrollToIndexFailed } = useScrollToActiveIndex(listRef, activeKey, indexForKey, {
    viewOffset: Spacing.two,
    itemCount: ayahs.length,
  });

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
        : {},
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
        : {},
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
  const tajweedByAyah = tajweedQuery.data ?? {};
  const wordByWordByAyah = wordsQuery.data ?? {};
  const studyExtrasLoading =
    (showTajweed && tajweedQuery.isPending) || (showWordByWord && wordsQuery.isPending);

  const playingAyahNumber = audioActiveKey ? Number(audioActiveKey.split(":")[1]) : null;
  const recitationId = quranComRecitationId(prefs.preferredReciterDir);
  const segmentsQuery = useAyahWordSegments(
    recitationId,
    surahNumber,
    playingAyahNumber,
    showWordByWord && playingAyahNumber != null,
  );

  useEffect(() => {
    if (!showWordByWord || playingAyahNumber == null || !audio.isPlaying) {
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
    let cancelled = false;
    let raf = 0;
    const tick = () => {
      if (cancelled) return;
      const durationSec =
        audio.duration > 0
          ? audio.duration
          : (audio.trackDurations?.[audio.current?.id ?? ""] ?? 0);
      const next = activeWordIndexAt(audio.readPlaybackSeconds(), segments, {
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
    audio.isPlaying,
    audio.readPlaybackSeconds,
    audio.duration,
    audio.trackDurations,
    audio.current?.id,
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
  const ttsVoiceId = prefs.ttsVoiceByLang?.[ttsLang];
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
    audio.setRepeatPlan(repeatPlan);
    audio.setTranslationAudio(prefs.translationAudio ?? "off");
  }, [audio, repeatPlan, prefs.translationAudio]);

  const playFrom = useCallback(
    (index: number) => {
      if (!surah) return;
      const tracks = ayahTracks(reciterDir, surah.nameTransliteration, surahNumber, ayahs, {
        translations: translation,
        lang: ttsLang,
        voice: ttsVoiceId,
      });
      audio.play(tracks, index, {
        sourceHref: `/quran/${surahNumber}`,
      });
      void setLastRead(surahNumber, index + 1, { isAudio: true });
    },
    [audio, ayahs, reciterDir, setLastRead, surah, surahNumber, translation, ttsLang, ttsVoiceId],
  );

  /** Per-ayah control: pause/resume when this ayah is already current; otherwise start it. */
  const playOrToggleAyah = useCallback(
    (index: number) => {
      const ayah = ayahs[index];
      if (!ayah) return;
      if (audio.current?.id === `${surahNumber}:${ayah.ayah}`) {
        audio.toggle();
        return;
      }
      playFrom(index);
    },
    [audio, ayahs, playFrom, surahNumber],
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
  const currentAudioId = audio.current?.id;

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
    [focusAyah, router, surahNumber, updatePrefs],
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
    [openPageReader, updatePrefs],
  );

  const scrollToTop = useCallback(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  const readerChrome = isListDetail ? (
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
          enabled={prefs.showTransliteration}
          onToggle={() => updatePrefs({ showTransliteration: !prefs.showTransliteration })}
        />
        <PrefToggle
          icon={CONTROL_ICONS.showTranslation}
          label={t("quran.showTranslation")}
          enabled={prefs.showTranslation}
          onToggle={() => updatePrefs({ showTranslation: !prefs.showTranslation })}
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

        <View style={[styles.controlRow, styles.translationRow]}>
          <ControlLabel icon={CONTROL_ICONS.textSize} label={t("reading.textSize")} />
          <View style={styles.controlValue}>
            <ReadingFontControls surface="quran" />
          </View>
        </View>

        <PlaySurahButton onPress={() => playFrom(0)} />
      </Card>
    );
  }, [
    colors.accent,
    playFrom,
    prefs.showTransliteration,
    prefs.showTranslation,
    showWordByWord,
    showTajweed,
    studyExtrasLoading,
    reciter.name,
    secondaryEdition?.name,
    selectedEdition.name,
    t,
    tafsirEdition?.name,
    translationLoading,
    updatePrefs,
    usingFallback,
    playbackSummary.active,
    playbackSummary.label,
  ]);

  // Bismillah (+ tajweed legend on narrow) rides above the ayah list. Filters and
  // the tajweed legend move to the side pane on list–detail.
  const listHeader = useMemo(() => {
    if (!surah) return null;
    return (
      <View style={styles.listHeader} onLayout={onHeaderCardLayout}>
        {!isListDetail ? readerFilters : null}

        {!isListDetail && showTajweed ? (
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
    isListDetail,
    onHeaderCardLayout,
    onTajweedLegendLayout,
    readerFilters,
    readingSizes.arabic,
    showTajweed,
    surah,
  ]);

  const locale = i18n.language?.split("-")[0] ?? "en";

  // Row props that change independently of the ayah `data` array (audio, hifz,
  // bookmarks, translation text). Passed via `extraData` so `renderItem` stays
  // stable and FlatList only re-renders cells when these values actually change.
  const audioIsPlaying = audio.isPlaying;

  const ayahRowExtras = useMemo(
    () => ({
      locale,
      arabicSize: readingSizes.arabic,
      translitSize: readingSizes.transliteration,
      translationSize: readingSizes.translation,
      showTransliteration: prefs.showTransliteration,
      showTranslation: prefs.showTranslation,
      showWordByWord,
      showTajweed,
      translationDir,
      secondaryDir,
      currentAudioId,
      audioIsPlaying,
      focusHighlightAyah,
      bookmarkedSet,
      hifzMap,
      translation,
      transliteration,
      secondTranslation,
      wordByWordByAyah,
      tajweedByAyah,
      activeWordIndex,
      playingAyahNumber,
    }),
    [
      activeWordIndex,
      audioIsPlaying,
      bookmarkedSet,
      currentAudioId,
      focusHighlightAyah,
      hifzMap,
      locale,
      playingAyahNumber,
      prefs.showTransliteration,
      prefs.showTranslation,
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
      wordByWordByAyah,
    ],
  );

  const ayahRowExtrasRef = useRef(ayahRowExtras);
  ayahRowExtrasRef.current = ayahRowExtras;

  const renderItem = useCallback(
    ({ item: ayah, index }: ListRenderItemInfo<Ayah>) => {
      const extras = ayahRowExtrasRef.current;
      const ayahKey = String(ayah.ayah);
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
          words={extras.showWordByWord ? extras.wordByWordByAyah[ayahKey] : undefined}
          tajweedSegments={extras.showTajweed ? extras.tajweedByAyah[ayahKey] : undefined}
          activeWordIndex={
            extras.showWordByWord && extras.playingAyahNumber === ayah.ayah
              ? extras.activeWordIndex
              : null
          }
          isActive={extras.currentAudioId === `${surahNumber}:${ayah.ayah}`}
          isPlaying={
            extras.currentAudioId === `${surahNumber}:${ayah.ayah}` && extras.audioIsPlaying
          }
          highlighted={ayah.ayah === extras.focusHighlightAyah}
          isBookmarked={extras.bookmarkedSet.has(`${surahNumber}:${ayah.ayah}`)}
          onPlayAtIndex={playOrToggleAyah}
          onBookmarkAyah={handleBookmarkAyah}
          onShareAyah={shareAyah}
          onOpenTafsir={openTafsirForAyah}
          isSharing={isSharing}
          isGesturePending={isGesturePending}
        />
      );
    },
    [
      handleBookmarkAyah,
      handleHifzAyah,
      isGesturePending,
      isSharing,
      openTafsirForAyah,
      playOrToggleAyah,
      shareAyah,
      surahNumber,
    ],
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
        scrollable={false}
        eyebrow={t("quran.title")}
        title={surah.nameTransliteration}
        subtitle={`${surah.nameEnglish} · ${t("quran.ayahCount", { count: surah.ayahCount })}`}
        onBack={() => goBackOrReplace(router, "/")}
        maxContentWidth={isListDetail ? LIST_DETAIL_MAX_WIDTH : undefined}
        headerAccessory={
          isListDetail ? undefined : (
            <View>
              <QuranReadingToolbar
                visible={toolbarVisible}
                progress={readingProgress}
                onBackToTop={scrollToTop}
                reciterName={reciter.name}
                translationName={selectedEdition.name}
                secondTranslationName={secondaryEdition?.name ?? t("quran.secondTranslationNone")}
                tafsirName={tafsirEdition?.name ?? t("quran.tafsirNone")}
                showTransliteration={prefs.showTransliteration}
                showTranslation={prefs.showTranslation}
                showWordByWord={showWordByWord}
                showTajweed={showTajweed}
                layoutLabel={t("quran.layoutAyah")}
                onOpenLayout={() => setLayoutPickerOpen(true)}
                onOpenReciter={() => setReciterPickerOpen(true)}
                onOpenTranslation={() => setTranslationPickerOpen(true)}
                onOpenSecondary={() => setSecondaryPickerOpen(true)}
                onOpenTafsir={() => setTafsirPickerOpen(true)}
                onToggleTransliteration={() =>
                  updatePrefs({ showTransliteration: !prefs.showTransliteration })
                }
                onToggleTranslation={() => updatePrefs({ showTranslation: !prefs.showTranslation })}
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
        <View style={isListDetail ? styles.listDetailRoot : styles.readerRoot}>
          <SurahAyahList
            listRef={listRef}
            data={ayahs}
            extraData={ayahRowExtras}
            keyExtractor={ayahKeyExtractor}
            renderItem={renderItem}
            ListHeaderComponent={listHeader}
            ItemSeparatorComponent={AyahSeparator}
            onScroll={onListScroll}
            onScrollBeginDrag={onScrollBeginDrag}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            onScrollToIndexFailed={onScrollToIndexFailed}
            style={isListDetail ? styles.listDetailPrimary : undefined}
            contentContainerStyle={{ paddingBottom: contentBottomInset }}
          />
          {isListDetail ? (
            <View style={[styles.listDetailSecondary, { borderStartColor: tokens.hairline }]}>
              {readerChrome}
              <ScrollView
                style={styles.listDetailSecondaryScroll}
                contentContainerStyle={[
                  styles.listDetailSecondaryContent,
                  { paddingBottom: contentBottomInset },
                ]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {showTajweed ? <TajweedLegend /> : null}
                {readerFilters}
              </ScrollView>
            </View>
          ) : null}
        </View>
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
        onSelect={(id) => updatePrefs({ preferredReciterDir: id })}
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
        onTtsVoiceChange={(voiceId) => {
          const next = { ...(prefs.ttsVoiceByLang ?? {}) };
          if (voiceId) next[ttsLang] = voiceId;
          else delete next[ttsLang];
          updatePrefs({ ttsVoiceByLang: next });
        }}
      />
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
  return (
    <View style={styles.controlLabel}>
      <SymbolView name={icon} size={18} tintColor={colors.mutedForeground} />
      <ThemedText type="smallBold">{label}</ThemedText>
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
  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={t("quran.playSurah")}
      onPress={onPress}
      style={[styles.playSurah, { backgroundColor: colors.accent }]}
    >
      <SymbolView name={PLAY_CIRCLE_ICON} size={20} tintColor={colors.accentForeground} />
      <ThemedText type="smallBold" style={{ color: colors.accentForeground }}>
        {t("quran.playSurah")}
      </ThemedText>
    </PressableScale>
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
  words?: QuranWord[];
  tajweedSegments?: TajweedSegment[];
  activeWordIndex?: number | null;
  /** This ayah is the current audio track (playing or paused). */
  isActive: boolean;
  /** This ayah is actively playing (not user-paused). */
  isPlaying: boolean;
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
  isSharing: (shareKey: string) => boolean;
  isGesturePending: (shareKey: string) => boolean;
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
    prev.words === next.words &&
    prev.tajweedSegments === next.tajweedSegments &&
    prev.activeWordIndex === next.activeWordIndex &&
    prev.isActive === next.isActive &&
    prev.isPlaying === next.isPlaying &&
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
    prev.isGesturePending === next.isGesturePending
  );
}

const AyahRow = memo(function AyahRow({
  ayah,
  index,
  surahNumber,
  locale,
  transliteration,
  translation,
  translationDir,
  words,
  tajweedSegments,
  activeWordIndex = null,
  isActive,
  isPlaying,
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
}: AyahRowProps) {
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();
  const focusBorderOpacity = useSharedValue(0);
  const ayahShareKey = `${surahNumber}:${ayah.ayah}`;

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
  const handleHifz = useCallback(
    () => onHifzAyah(surahNumber, ayah.ayah),
    [ayah.ayah, onHifzAyah, surahNumber],
  );

  useEffect(() => {
    cancelAnimation(focusBorderOpacity);
    if (isActive || !highlighted) {
      focusBorderOpacity.value = 0;
      return;
    }
    focusBorderOpacity.value = 1;
    focusBorderOpacity.value = withDelay(
      FOCUS_HIGHLIGHT_HOLD_MS,
      withTiming(0, { duration: FOCUS_HIGHLIGHT_FADE_MS }),
    );
  }, [highlighted, isActive, focusBorderOpacity]);

  const focusBorderStyle = useAnimatedStyle(() =>
    focusBorderOpacity.value > 0 ? { opacity: focusBorderOpacity.value } : { opacity: 0 },
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
      <Card
        padding="four"
        style={isActive ? { borderColor: colors.accent, borderWidth: 1 } : undefined}
      >
        <View style={styles.ayahHeader}>
          <View style={styles.ayahIdentity}>
            <View style={[styles.ayahBadge, { backgroundColor: tokens.accentSoft }]}>
              <ThemedText type="caption" style={{ color: colors.accent }}>
                {ayah.ayah}
              </ThemedText>
            </View>
            {highlighted && !isActive ? (
              <Pill
                compact
                label={t("quran.continueReading")}
                color={colors.accentText}
                background={withAlpha(colors.accent, tokens.isDark ? 0.28 : 0.16)}
              />
            ) : null}
          </View>
          <View style={styles.ayahActions}>
            {ayah.sajda ? (
              <Pill label="۩" color={colors.accent} background={tokens.accentSoft} />
            ) : null}
            <LabeledIconButton
              name={isPlaying ? PAUSE_CIRCLE_ICON : PLAY_CIRCLE_ICON}
              label={isPlaying ? t("quran.actionPause") : t("quran.actionPlay")}
              tintColor={colors.accent}
              labelColor={colors.accent}
              background={tokens.accentSoft}
              accessibilityLabel={
                isPlaying ? t("quran.pauseAyah") : t("quran.playAyah", { n: ayah.ayah })
              }
              onPress={handlePlay}
            />
            <LabeledIconButton
              name={
                hifzStatus === "memorized"
                  ? { ios: "checkmark.circle.fill", android: "check_circle", web: "check_circle" }
                  : hifzStatus === "review"
                    ? {
                        ios: "arrow.triangle.2.circlepath",
                        android: "sync",
                        web: "sync",
                      }
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
            <LabeledIconButton
              name={
                isBookmarked
                  ? { ios: "bookmark.fill", android: "bookmark", web: "bookmark" }
                  : { ios: "bookmark", android: "bookmark_border", web: "bookmark_border" }
              }
              label={isBookmarked ? t("quran.actionBookmarked") : t("quran.actionBookmark")}
              tintColor={isBookmarked ? tokens.status.warning.color : colors.mutedForeground}
              labelColor={isBookmarked ? tokens.status.warning.color : colors.mutedForeground}
              accessibilityLabel={isBookmarked ? t("quran.bookmarkRemove") : t("quran.bookmarkAdd")}
              accessibilityState={{ selected: isBookmarked }}
              onPress={handleBookmark}
            />
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
                isGesturePending(ayahShareKey) ? t("share.tapToShare") : t("quran.actionShare")
              }
              tintColor={colors.mutedForeground}
              accessibilityLabel={t("quran.shareAyah")}
              loading={isSharing(ayahShareKey)}
              loadingLabel={t("share.preparing")}
              onPress={handleShare}
            />
            <ContentReportButton contentRef={reportRef} />
          </View>
        </View>

        <TajweedText
          segments={tajweedSegments}
          fallback={ayah.arabic}
          fontSize={arabicSize}
          style={styles.arabic}
        />

        {words?.length ? (
          <WordByWord
            words={words}
            activeWordIndex={activeWordIndex}
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
      </Card>
      {!isActive ? (
        <Animated.View
          style={[
            styles.focusRing,
            { borderColor: colors.accent, borderRadius: Radius.lg, pointerEvents: "none" },
            focusBorderStyle,
          ]}
        />
      ) : null}
    </View>
  );
}, ayahRowPropsAreEqual);

const styles = StyleSheet.create({
  readerRoot: { flex: 1, width: "100%" },
  listDetailRoot: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    gap: Spacing.four,
  },
  listDetailPrimary: {
    flex: 1.15,
    minWidth: 0,
  },
  listDetailSecondary: {
    flex: 0.85,
    minWidth: 280,
    maxWidth: 400,
    borderStartWidth: StyleSheet.hairlineWidth,
    gap: Spacing.three,
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
    paddingVertical: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    marginTop: Spacing.three,
  },
  bismillah: { marginBottom: Spacing.two },
  ayahRow: { position: "relative" },
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
  ayahIdentity: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    flexShrink: 1,
    minWidth: 0,
  },
  ayahBadge: {
    minWidth: 30,
    height: 30,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  ayahActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    flexShrink: 1,
    gap: Spacing.half,
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
