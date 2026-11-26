import type { Ayah } from "@munib-tracker/shared/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  type ListRenderItemInfo,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  StyleSheet,
  View,
} from "react-native";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { AyahSeparator, ayahKeyExtractor, SurahAyahList } from "@/components/quran/ayah-reader";
import { BISMILLAH } from "@/components/quran/basmala";
import { OptionPickerSheet } from "@/components/quran/option-picker-sheet";
import { PlaybackSettingsSheet } from "@/components/quran/playback-settings-sheet";
import { QuranNotesSheetHost } from "@/components/quran/quran-notes-sheet-host";
import { QuranNotesSidePanel } from "@/components/quran/quran-notes-side-panel";
import {
  type ReaderEditionSheet,
  ReaderEditionSheets,
} from "@/components/quran/reader-edition-sheets";
import {
  RECITER_OPTIONS,
  useBookmarkedAyahSet,
  useReaderLayoutOptions,
  useReaderWebKeys,
} from "@/components/quran/reader-shared";
import { QuranReadingToolbar } from "@/components/quran/reading-toolbar";
import { AyahFocusTrackerContext } from "@/components/quran/surah-reader/ayah-focus-tracker";
import { AyahMoreActions } from "@/components/quran/surah-reader/ayah-more-actions";
import { AyahRow } from "@/components/quran/surah-reader/ayah-row";
import { ReaderChromeButtons } from "@/components/quran/surah-reader/reader-chrome-buttons";
import { ReaderFiltersCard } from "@/components/quran/surah-reader/reader-filters-card";
import { SurahNavCard } from "@/components/quran/surah-reader/surah-nav-card";
import { useAudioFollowAlong } from "@/components/quran/surah-reader/use-audio-follow-along";
import { useAyahActions } from "@/components/quran/surah-reader/use-ayah-actions";
import { useAyahFocusHighlight } from "@/components/quran/surah-reader/use-ayah-focus-highlight";
import { useAyahSheetActions } from "@/components/quran/surah-reader/use-ayah-sheet-actions";
import { useReaderChromeVisibility } from "@/components/quran/surah-reader/use-reader-chrome-visibility";
import { useSurahEditions } from "@/components/quran/surah-reader/use-surah-editions";
import { useSurahListNavigation } from "@/components/quran/surah-reader/use-surah-list-navigation";
import { useSurahPlayback } from "@/components/quran/surah-reader/use-surah-playback";
import { useSurahReadingPosition } from "@/components/quran/surah-reader/use-surah-reading-position";
import { useSurahStudyLayers } from "@/components/quran/surah-reader/use-surah-study-layers";
import { TafsirAyahSheet } from "@/components/quran/tafsir-ayah-sheet";
import { TajweedLegend, TajweedStickyLegendBar } from "@/components/quran/tajweed-legend";
import { QuranWordStudyProviders } from "@/components/quran/word-by-word";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { MoreInSettingsLink } from "@/components/settings/more-in-settings-link";
import { ThemedText } from "@/components/themed-text";
import { EmptyState } from "@/components/ui/empty-state";
import { TvScrollView } from "@/components/ui/tv-scroll-view";
import { BorderWidth, Breakpoints, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useContentBottomInset } from "@/hooks/use-content-bottom-inset";
import { useLargeScreenLayout } from "@/hooks/use-large-screen-layout";
import { usePlaybackSummaryLabel } from "@/hooks/use-playback-summary-label";
import { useReadingFullscreen } from "@/hooks/use-reading-fullscreen";
import { useShareContentCard } from "@/hooks/use-share-content-card";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { getSurahAyahs, getSurahByNumber, getSurahMeta, getTransliteration } from "@/lib/quran";
import { ayahNumberFromKey, surahAudioKey, surahSeoCopy } from "@/lib/quran-surah-reader";
import { arabicReadingLayout, resolveReadingFontSizes } from "@/lib/reading-typography";
import { useIsRTL } from "@/lib/rtl";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { articleSchema } from "@/lib/seo/structured-data";
import { updateQuranPrefs } from "@/lib/settings/quran-shortcuts";
import { setTtsVoice } from "@/lib/settings/tts-voice";
import { useReadingDisplayToggles } from "@/lib/settings/use-reading-display-toggles";
import { buildAyahSharePayload } from "@/lib/share";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";
import { hifzKey, useEnsureHifzLoaded, useHifzMap } from "@/stores/hifz-store";
import { usePreferences } from "@/stores/preferences-store";
import { useQuranActions, useQuranPrefs } from "@/stores/quran-store";

/** Extra width so the ayah list and filters pane can sit side by side. */
const LIST_DETAIL_MAX_WIDTH = 1280;
/** Desktop (≥1600): match the global wide content column. */
const LIST_DETAIL_MAX_WIDTH_XL = 1320;
/** Readable measure for the ayah column when the reader has a side pane. */
const READING_COLUMN_MAX_WIDTH = 800;

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
  const hasSurah = surah != null;
  // Optional deep-link target (e.g. from universal search) — scroll to & mark it.
  const focusAyah = params.ayah ? Number(params.ayah) : undefined;
  // NF-3.22 root search: 1-based bundled word to mark in word-by-word view.
  const focusWordNumber = params.word ? Number(params.word) : undefined;

  const { tokens } = useThemeTokens();
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
  const readingSizes = resolveReadingFontSizes("quran", fontPrefs);
  const { toggleBookmark } = useQuranActions();
  // Reader controls are shortcuts to Settings › Qur'an (one write path, §4.5.2).
  const updatePrefs = updateQuranPrefs;
  const { showTranslation, showTransliteration, toggleTranslation, toggleTransliteration } =
    useReadingDisplayToggles();
  useEnsureHifzLoaded();
  const hifzMap = useHifzMap();
  const bookmarkedSet = useBookmarkedAyahSet();
  const layoutOptions = useReaderLayoutOptions();
  const audio = useAudioPlayerContext();
  // Subscribe to primitives only — never close list callbacks over the whole
  // context value (it is a new object on duration/buffering ticks).
  const audioIsPlaying = audio.isPlaying;
  // Same buffering rule as the shared PlayButton (C-12): spinner until loaded.
  const audioIsBuffering = audio.isBuffering && !audio.isLoaded;
  const currentAudioId = audio.current?.id;
  const audioActiveKey = surahAudioKey(currentAudioId, surahNumber);
  const playingAyahNumber = ayahNumberFromKey(audioActiveKey);
  const { share, activeShareKey, gesturePendingKey, SnapshotHost } = useShareContentCard();
  const [reciterPickerOpen, setReciterPickerOpen] = useState(false);
  const [editionSheet, setEditionSheet] = useState<ReaderEditionSheet | null>(null);
  const [tafsirAyah, setTafsirAyah] = useState<number | null>(null);
  const [layoutPickerOpen, setLayoutPickerOpen] = useState(false);
  const [playbackSheetOpen, setPlaybackSheetOpen] = useState(false);
  /** TV: row index whose ayah action sheet is open (Select on an ayah card). */
  const [tvActionIndex, setTvActionIndex] = useState<number | null>(null);
  const showWordByWord = prefs.showWordByWord === true;
  const showTajweed = prefs.showTajweed === true;

  const { focusHighlightAyah, focusWordValue, flashAyah } = useAyahFocusHighlight({
    surahNumber,
    focusAyah,
    focusWordNumber,
  });
  const {
    toolbarVisible,
    tajweedBarVisible,
    scrollYRef,
    onHeaderCardLayout,
    onTajweedLegendLayout,
    onScrollOffset: onChromeScrollOffset,
  } = useReaderChromeVisibility(showTajweed);

  const ayahs = useMemo(() => (surah ? getSurahAyahs(surahNumber) : []), [surah, surahNumber]);
  const {
    readingProgress,
    topVisibleAyahRef,
    viewabilityConfig,
    onViewableItemsChanged,
    onScrollOffset: onPositionScrollOffset,
    markUserMoved,
  } = useSurahReadingPosition({
    hasSurah,
    surahNumber,
    focusAyah,
    ayahCount: ayahs.length,
    audioActiveKey,
    scrollYRef,
  });

  const onListScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = event.nativeEvent.contentOffset.y;
      onChromeScrollOffset(y);
      onPositionScrollOffset(y);
    },
    [onChromeScrollOffset, onPositionScrollOffset],
  );

  const {
    knownEdition,
    selectedEdition,
    translation,
    translationLoading,
    usingFallback,
    translationDir,
    secondaryId,
    secondaryEdition,
    secondTranslation,
    secondaryDir,
    activeTafsirId,
    tafsirEdition,
    tafsirMap,
    tafsirLoading,
    tafsirOffline,
    retryTranslation,
    retryTafsir,
  } = useSurahEditions({ surahNumber, hasSurah, prefs, translationLocale, appLocale });

  const { tajweedByAyah, wordByWordByAyah, studyExtrasLoading } = useSurahStudyLayers({
    surahNumber,
    hasSurah,
    showTajweed,
    showWordByWord,
    wordLang: translationLocale || appLocale || "en",
  });

  const { ayahFocusRef, activeWordIndex } = useAudioFollowAlong({
    surahNumber,
    playingAyahNumber,
    showWordByWord,
    reciterDir: prefs.preferredReciterDir,
    wordByWordByAyah,
  });

  const {
    reciterDir,
    reciter,
    ttsLang,
    ttsVoiceId,
    repeatPlan,
    playFrom,
    handleReciterSelect,
    playOrToggleAyah,
    playPauseSurah,
  } = useSurahPlayback({
    surah,
    surahNumber,
    ayahs,
    translation,
    prefs,
    translationLocale,
    tv,
    currentAudioId,
    audioActiveKey,
    topVisibleAyahRef,
  });
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

  const {
    listRef,
    screenScrollRef,
    onScrollToIndexFailed,
    registerAyahScroll,
    onTvActiveScroll,
    scrollToTop,
    goToSurah,
    jumpToAyah,
    handleLayoutSelect,
  } = useSurahListNavigation({
    surahNumber,
    ayahs,
    tv,
    tvMappedList,
    audioActiveKey,
    focusAyah,
    topVisibleAyahRef,
    markUserMoved,
    flashAyah,
  });

  const onTvMappedScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      onListScroll(event);
      onTvActiveScroll(event);
    },
    [onListScroll, onTvActiveScroll],
  );

  const openTafsirForAyah = useCallback(
    (ayahNumber: number) => {
      if (!activeTafsirId) {
        setEditionSheet("tafsir");
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

  const handleBookmarkAyah = useCallback(
    (surahNum: number, ayahNum: number) => toggleBookmark(surahNum, ayahNum),
    [toggleBookmark],
  );

  // Per-ayah actions shared with the passage screen and the Adhkar Qur'an cards:
  // the inline "More" row (one ayah open at a time) and the TV action sheet.
  const {
    handlers: ayahActionHandlers,
    expandedAyah,
    toggleExpanded: toggleAyahExpanded,
    hifz: { hifzPending, cancelHifz, confirmHifz, dialog: hifzDialog },
  } = useAyahActions({
    surahNumber,
    surahName: surah?.nameTransliteration,
    hifzMap,
    openTafsir: openTafsirForAyah,
  });

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

  // Web keyboard: ←/→ previous/next surah (reading-direction aware), Space
  // play/pause. Off while a sheet is open (typing / unfocused route: built in).
  const anySheetOpen =
    reciterPickerOpen ||
    editionSheet != null ||
    tafsirAyah != null ||
    layoutPickerOpen ||
    playbackSheetOpen ||
    hifzPending != null;
  useReaderWebKeys(
    {
      onArrow: (key) => {
        const forward = (key === "ArrowRight") !== uiRtl;
        goToSurah(surahNumber + (forward ? 1 : -1));
      },
      onSpace: playPauseSurah,
    },
    !anySheetOpen,
  );

  // Reading controls (layout / reciter / translation / toggles). On narrow screens
  // these ride in the list header; on list–detail they move to a sticky side pane.
  const readerFilters = useMemo(
    () => (
      <ReaderFiltersCard
        reciterName={reciter.name}
        translationName={selectedEdition.name}
        secondTranslationName={secondaryEdition?.name ?? t("quran.secondTranslationNone")}
        tafsirName={tafsirEdition?.name ?? t("quran.tafsirNone")}
        translationLoading={translationLoading}
        usingFallback={usingFallback}
        showTransliteration={showTransliteration}
        showTranslation={showTranslation}
        showWordByWord={showWordByWord}
        showTajweed={showTajweed}
        studyExtrasLoading={studyExtrasLoading}
        playbackLabel={playbackSummary.label}
        playbackActive={playbackSummary.active}
        onToggleTransliteration={toggleTransliteration}
        onToggleTranslation={toggleTranslation}
        onOpenLayout={() => setLayoutPickerOpen(true)}
        onOpenReciter={() => setReciterPickerOpen(true)}
        onOpenEdition={setEditionSheet}
        onOpenPlayback={() => setPlaybackSheetOpen(true)}
        // Side pane: play / pause lives in the surah navigation card above.
        onPlaySurah={showSideFilters ? undefined : () => playFrom(0)}
        // Recite along with the whole surah rides beside "Play surah" (D68).
        reciteSurah={showSideFilters ? undefined : surahNumber}
        onRetryTranslation={retryTranslation}
      />
    ),
    [
      retryTranslation,
      surahNumber,
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
      usingFallback,
      playbackSummary.active,
      playbackSummary.label,
      toggleTransliteration,
      toggleTranslation,
    ],
  );

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
            accessibilityLanguage="ar"
            style={[styles.bismillah, arabicReadingLayout(readingSizes.arabic - 2, "center")]}
          >
            {BISMILLAH}
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
      activeShareKey,
      gesturePendingKey,
      expandedAyah,
    }),
    [
      activeShareKey,
      bookmarkedSet,
      expandedAyah,
      focusHighlightAyah,
      gesturePendingKey,
      hifzMap,
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
  const closeAyahActions = useCallback(() => setTvActionIndex(null), []);
  const ayahSheetActions = useAyahSheetActions({
    handlers: ayahActionHandlers,
    closeSheet: closeAyahActions,
  });

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
          arabicSize={extras.arabicSize}
          translitSize={extras.translitSize}
          translationSize={extras.translationSize}
          hifzStatus={extras.hifzMap[hifzKey(surahNumber, ayah.ayah)]}
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
          isSharing={extras.activeShareKey === ayahShareKey}
          isGesturePending={extras.gesturePendingKey === ayahShareKey}
          // TV: Select on the card opens the ayah action sheet. Elsewhere "More"
          // expands the rest of the actions inline (one ayah at a time).
          onOpenActions={openAyahActions}
          expanded={ayah.ayah === extras.expandedAyah}
          onToggleExpanded={toggleAyahExpanded}
          actionHandlers={ayahActionHandlers}
          tvPreferredFocus={index === tvInitialFocusIndex}
        />
      );
    },
    [
      ayahActionHandlers,
      handleBookmarkAyah,
      openAyahActions,
      toggleAyahExpanded,
      playOrToggleAyah,
      shareAyah,
      surahNumber,
      tvInitialFocusIndex,
    ],
  );

  // G-02: phones, narrow web and TV end the surah with previous / next surah
  // (the list–detail side pane already carries the full navigation card).
  const listFooter = useMemo(
    () =>
      showSideFilters ? null : (
        <SurahNavCard
          variant="footer"
          surahNumber={surahNumber}
          ayahCount={ayahs.length}
          onGoToSurah={goToSurah}
        />
      ),
    [ayahs.length, goToSurah, showSideFilters, surahNumber],
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

  const seo = surahSeoCopy(surah, { home: t("tabs.home"), quran: t("quran.title") });
  // The ayah whose "More" sheet is open (TV: Select on a card; phones: the row button).
  const actionAyah = tvActionIndex != null ? ayahs[tvActionIndex] : undefined;
  const actionKey = actionAyah ? `${surahNumber}:${actionAyah.ayah}` : null;

  return (
    <>
      {SnapshotHost}
      <Seo
        path={seo.path}
        title={seo.title}
        description={seo.description}
        type="article"
        breadcrumbs={seo.breadcrumbs}
        keywords={seo.keywords}
        jsonLd={[
          articleSchema({
            path: seo.path,
            type: "CreativeWork",
            headline: seo.title,
            description: seo.description,
            inLanguage: "ar",
            breadcrumbs: seo.breadcrumbs,
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
            ? windowWidth >= Breakpoints.xwide
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
                onOpenTranslation={() => setEditionSheet("translation")}
                onOpenSecondary={() => setEditionSheet("secondary")}
                onOpenTafsir={() => setEditionSheet("tafsir")}
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
            audioIsBuffering={audioIsBuffering}
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
                {listFooter}
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
                  ListFooterComponent={listFooter ?? undefined}
                  ItemSeparatorComponent={AyahSeparator}
                  onScroll={onListScroll}
                  onScrollBeginDrag={markUserMoved}
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
                    <ReaderChromeButtons
                      showBackToTop={toolbarVisible}
                      onBackToTop={scrollToTop}
                      fullscreen={fullscreen}
                    />
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
        // G-26: same footer as the page reader's layout picker (§4.5.6 shortcuts).
        footer={
          <MoreInSettingsLink
            settingId="quran.reader.layout"
            onNavigate={() => setLayoutPickerOpen(false)}
          />
        }
      />
      <OptionPickerSheet
        visible={reciterPickerOpen}
        title={t("quran.reciter")}
        options={RECITER_OPTIONS}
        selectedId={reciterDir}
        onSelect={handleReciterSelect}
        onClose={() => setReciterPickerOpen(false)}
      />
      <ReaderEditionSheets
        open={editionSheet}
        onClose={() => setEditionSheet(null)}
        translationId={knownEdition}
        secondaryId={secondaryId}
        tafsirId={activeTafsirId}
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
        onRetry={retryTafsir}
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
      {/* TV: Select on an ayah card (phones / web expand "More" inline instead). */}
      <AyahMoreActions
        ayah={actionAyah}
        surahNumber={surahNumber}
        surahName={surah.nameTransliteration}
        surahNameEnglish={surah.nameEnglish}
        locale={locale}
        translation={translation}
        isBookmarked={actionKey != null && bookmarkedSet.has(actionKey)}
        isPlaying={actionKey != null && audioIsPlaying && currentAudioId === actionKey}
        hifzStatus={actionAyah ? hifzMap[hifzKey(surahNumber, actionAyah.ayah)] : undefined}
        onClose={closeAyahActions}
        onPlay={() => {
          if (tvActionIndex == null) return;
          const index = tvActionIndex;
          // Close first so the reader sees the follow-along highlight.
          setTvActionIndex(null);
          playOrToggleAyah(index);
        }}
        onBookmark={(ayahNum) => void toggleBookmark(surahNumber, ayahNum)}
        onHifz={ayahSheetActions.onHifz}
        onTafsir={ayahSheetActions.onTafsir}
        {...(tv
          ? {}
          : {
              isSharing: actionKey != null && activeShareKey === actionKey,
              isGesturePending: actionKey != null && gesturePendingKey === actionKey,
              onShare: (target: Ayah) =>
                shareAyah(
                  target.arabic,
                  showTranslation ? (translation[String(target.ayah)] ?? "") : "",
                  surahNumber,
                  target.ayah,
                  showTransliteration ? transliteration[String(target.ayah)] : undefined,
                ),
              onPractise: ayahSheetActions.onPractise,
              onCheckRecitation: ayahSheetActions.onCheckRecitation,
              onNote: ayahSheetActions.onNote,
              onHighlight: ayahSheetActions.onHighlight,
            })}
      />
      <ConfirmDialog
        visible={hifzDialog.visible}
        title={t("hifz.confirmTitle")}
        message={hifzDialog.message}
        confirmLabel={hifzDialog.confirmLabel}
        cancelLabel={t("common.cancel")}
        destructive={hifzDialog.destructive}
        onConfirm={() => void confirmHifz()}
        onCancel={cancelHifz}
        onClose={cancelHifz}
      />
      <QuranNotesSheetHost />
    </>
  );
}

const styles = StyleSheet.create({
  readerRoot: { flex: 1, width: "100%" },
  readingColumn: {
    width: "100%",
    maxWidth: READING_COLUMN_MAX_WIDTH,
    alignSelf: "center",
  },
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
    borderStartWidth: BorderWidth.hairline,
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
  listHeader: { gap: Spacing.four, marginBottom: Spacing.two },
  bismillah: { marginBottom: Spacing.two },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/quran/[surah]");
