import type { HadithItem, HadithSection } from "@munib-tracker/shared/types";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BackHandler,
  type FlatList,
  type LayoutChangeEvent,
  type ListRenderItem,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollViewInstance,
  StyleSheet,
  View,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { getRemoteCollection, isRemoteCollection } from "@/api/hadith-remote";
import { ContentActions, REPORT_FLAG_ICON } from "@/components/content/content-actions";
import { ControlLabel, PrefToggle } from "@/components/content/pref-toggle";
import { ContentReportContext } from "@/components/content-report/content-report-context";
import { useCollectionName } from "@/components/hadith/collection-name";
import { HadithIsnadChain } from "@/components/hadith/hadith-isnad-chain";
import { HadithSharhBlock } from "@/components/hadith/hadith-sharh-block";
import { HadithReadingToolbar } from "@/components/hadith/reading-toolbar";
import { ReadingFontControls } from "@/components/reading-font-controls";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { MoreInSettingsLink } from "@/components/settings/more-in-settings-link";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { ContentState } from "@/components/ui/content-state";
import { ContextMenu, type ContextMenuAction } from "@/components/ui/context-menu";
import { EmptyState } from "@/components/ui/empty-state";
import { NavRow } from "@/components/ui/nav-row";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { SearchField } from "@/components/ui/search-field";
import { TvFlatList } from "@/components/ui/tv-flat-list";
import { TvScrollView } from "@/components/ui/tv-scroll-view";
import { TvUndoButton } from "@/components/ui/tv-undo-button";
import { BorderWidth, Opacity, Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { HadithRepository } from "@/db";
import type { HadithBookmark, HadithPrefs } from "@/db/repositories/hadith-repository";
import { useContentBottomInset } from "@/hooks/use-content-bottom-inset";
import { useRemoteCollection } from "@/hooks/use-hadith";
import { useHadithTranslation } from "@/hooks/use-hadith-translation";
import { useLargeScreenLayout } from "@/hooks/use-large-screen-layout";
import { useReadingFullscreen } from "@/hooks/use-reading-fullscreen";
import { useShareContentCard } from "@/hooks/use-share-content-card";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useUndoToast } from "@/hooks/use-undo-toast";
import { useWebScreenKeyHandler } from "@/hooks/use-web-key-handler";
import { buildContentReportRef } from "@/lib/content-report-ref";
import { buildHadithActivity, buildHadithCollectionActivity } from "@/lib/continue-activity";
import {
  ensureBundledCollection,
  ensureBundledCollectionData,
  getBundledCollection,
  getBundledCollectionData,
  getBundledCollections,
} from "@/lib/hadith";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { arabicReadingLayout, resolveReadingFontSizes } from "@/lib/reading-typography";
import { isRTL, useChevronBackward, useChevronForward } from "@/lib/rtl";
import { runWhenIdle } from "@/lib/run-when-idle";
import { createHadithSearch, type FuzzyIndex } from "@/lib/search";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { collectionPageSchema } from "@/lib/seo/structured-data";
import { setSetting } from "@/lib/settings/shortcuts";
import { useReadingDisplayToggles } from "@/lib/settings/use-reading-display-toggles";
import { buildHadithSharePayload } from "@/lib/share";
import { resolveHadithTranslation } from "@/lib/translation-locale";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";
import { recordContinueActivity } from "@/stores/continue-store";
import { useHadithPrefs } from "@/stores/hadith-store";
import { usePreferences } from "@/stores/preferences-store";

/** Stable empty sentinels so `?? []` does not churn effect deps every render. */
const EMPTY_HADITH_ITEMS: HadithItem[] = [];
const EMPTY_SECTIONS: HadithSection[] = [];

/** Hadith display toggles + the app-wide translation visibility (D13). */
type HadithDisplayPrefs = HadithPrefs & { showTranslation: boolean };

/** Extra width so the hadith list and filters pane can sit side by side. */
const LIST_DETAIL_MAX_WIDTH = 1280;

/**
 * Pre-render a static HTML page for every bundled hadith collection at web
 * export time, so each has its own crawlable URL and metadata.
 */
export function generateStaticParams(): Array<{ collection: string }> {
  return getBundledCollections().map((c) => ({ collection: c.id }));
}

export default function HadithCollectionScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const tv = isTV();
  const contentBottomInset = useContentBottomInset();
  const { isListDetail } = useLargeScreenLayout();
  // Wide tablet/desktop: sticky side filters. TV: single column — a fixed-width
  // secondary pane kept overflowing past overscan no matter how we capped it.
  const showSideFilters = isListDetail && !tv;
  const fullscreen = useReadingFullscreen({ exitOnBlur: true });
  const params = useLocalSearchParams<{ collection: string; q?: string; book?: string }>();
  const collectionId = params.collection ?? "";
  const remote = isRemoteCollection(collectionId);
  const collectionLabel = useCollectionName();

  const [bundled, setBundled] = useState(() => getBundledCollection(collectionId));
  const [bundledData, setBundledData] = useState(() => getBundledCollectionData(collectionId));

  // Bundled collections load lazily: show a skeleton (not "Not found") until they
  // land, and Try again if the chunk fails (P8-01 / P8-02).
  const isBundledId = useMemo(
    () => getBundledCollections().some((c) => c.id === collectionId),
    [collectionId],
  );
  const [bundledFailed, setBundledFailed] = useState(false);
  const [bundledAttempt, setBundledAttempt] = useState(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: `bundledAttempt` re-runs the load on retry
  useEffect(() => {
    let cancelled = false;
    setBundledFailed(false);
    Promise.all([
      ensureBundledCollection(collectionId),
      ensureBundledCollectionData(collectionId),
    ]).then(
      ([collection, data]) => {
        if (cancelled) return;
        setBundled(collection);
        setBundledData(data);
      },
      () => {
        if (!cancelled) setBundledFailed(true);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [collectionId, bundledAttempt]);
  const remoteQuery = useRemoteCollection(remote ? collectionId : null);

  const collection = bundled?.collection ?? getRemoteCollection(collectionId);
  const data = remote ? remoteQuery.data : bundledData;
  const sections = data?.sections ?? EMPTY_SECTIONS;
  const allItems = data?.items ?? EMPTY_HADITH_ITEMS;
  const hasNarrator = useMemo(() => allItems.some((item) => Boolean(item.narrator)), [allItems]);
  const hasGrade = useMemo(() => allItems.some((item) => Boolean(item.grade)), [allItems]);
  const hasIsnad = useMemo(
    () => allItems.some((item) => (item.isnad?.length ?? 0) > 0),
    [allItems],
  );
  const hasSharh = useMemo(() => allItems.some((item) => Boolean(item.sharhArabic)), [allItems]);
  const { share, isSharing, isGesturePending, SnapshotHost } = useShareContentCard();
  const { translationLocale, fontPrefs } = usePreferences();
  const hadithPrefs = useHadithPrefs();
  const { showTranslation, setShowTranslation } = useReadingDisplayToggles();
  const prefs = useMemo<HadithDisplayPrefs>(
    () => ({ ...hadithPrefs, showTranslation }),
    [hadithPrefs, showTranslation],
  );
  // Toolbar + filter card are shortcuts to Settings › Hadith (and Text & fonts
  // for translation): every write goes through the registered setting.
  const updatePrefs = useCallback(
    async (patch: Partial<HadithDisplayPrefs>) => {
      for (const [key, value] of Object.entries(patch) as [keyof HadithDisplayPrefs, boolean][]) {
        if (key === "showTranslation") await setShowTranslation(value);
        else await setSetting(`content.hadith.${key}`, value);
      }
    },
    [setShowTranslation],
  );
  const readingSizes = resolveReadingFontSizes("hadith", fontPrefs);
  const listRef = useRef<FlatList<HadithItem>>(null);
  const screenScrollRef = useRef<ScrollViewInstance>(null);
  const [toolbarVisible, setToolbarVisible] = useState(false);
  const headerCardHeightRef = useRef(0);
  const readingProgress = useSharedValue(0);

  const onHeaderCardLayout = useCallback((event: LayoutChangeEvent) => {
    headerCardHeightRef.current = event.nativeEvent.layout.height;
  }, []);

  const onListScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
      const y = contentOffset.y;
      const threshold = Math.max(0, headerCardHeightRef.current - Spacing.four);
      const nextToolbar = y > threshold;
      setToolbarVisible((prev) => (prev === nextToolbar ? prev : nextToolbar));

      const range = contentSize.height - layoutMeasurement.height;
      readingProgress.value = range > 0 ? Math.min(1, Math.max(0, y / range)) : 0;
    },
    [readingProgress],
  );

  const scrollToTop = useCallback(() => {
    if (tv) {
      screenScrollRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [tv]);

  // Back-to-top lives in the sticky side pane on large screens (same chrome
  // pattern as the Qur'an surah reader). Fullscreen is omitted on TV.
  const readerChrome = showSideFilters ? (
    <View style={styles.readerChromeRow}>
      {toolbarVisible ? (
        <PressableScale
          haptic="light"
          accessibilityRole="button"
          accessibilityLabel={t("hadith.backToTop")}
          onPress={scrollToTop}
          scaleTo={0.97}
          style={[styles.readerChromeBtn, { backgroundColor: tokens.accentSoft }]}
        >
          <SymbolView
            name={{ ios: "arrow.up", android: "arrow_upward", web: "arrow_upward" }}
            size={16}
            tintColor={colors.accent}
          />
          <ThemedText
            weight="semibold"
            type="caption"
            style={{
              color: tokens.accentOnSoft,
            }}
          >
            {t("hadith.backToTop")}
          </ThemedText>
        </PressableScale>
      ) : null}
      {fullscreen.supported ? (
        <PressableScale
          haptic="light"
          accessibilityRole="button"
          accessibilityLabel={
            fullscreen.active ? t("hadith.exitFullscreen") : t("hadith.enterFullscreen")
          }
          accessibilityState={{ selected: fullscreen.active }}
          onPress={() => void fullscreen.toggle()}
          scaleTo={0.97}
          style={[
            styles.readerChromeBtn,
            {
              backgroundColor: fullscreen.active ? tokens.accentSoft : colors.muted,
              borderColor: fullscreen.active ? colors.accent : "transparent",
              borderWidth: BorderWidth.thin,
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
            weight="semibold"
            type="caption"
            style={{
              color: fullscreen.active ? tokens.accentOnSoft : colors.mutedForeground,
            }}
          >
            {fullscreen.active ? t("hadith.exitFullscreen") : t("hadith.enterFullscreen")}
          </ThemedText>
        </PressableScale>
      ) : null}
    </View>
  ) : null;

  const shareHadith = useCallback(
    (item: HadithItem) => {
      const translation = resolveHadithTranslation(item, { translationLocale });
      void share({
        ...buildHadithSharePayload(item.arabic, translation, item.reference, {
          sectionTitle: t("share.sectionHadith"),
          contentLabel: collection
            ? `${collection.nameEnglish} · ${item.reference}`
            : item.reference,
        }),
        shareKey: item.id,
      });
    },
    [collection, share, t, translationLocale],
  );

  // Seed the in-collection search from a `q` param (e.g. arriving from universal
  // search) so the matched hadith is already filtered into view.
  const [query, setQuery] = useState(params.q ?? "");
  // The open book lives in the URL (`?book=`) so web Back / deep links work; the
  // route file stays the same (P5-34, C-18).
  const sectionId = typeof params.book === "string" && params.book ? params.book : null;
  const setSectionId = useCallback(
    (id: string | null) => router.setParams({ book: id ?? undefined }),
    [router],
  );
  const searching = query.trim().length > 0;
  // Cap mapped TV cards to avoid OOM on ~1GB TV AVDs when a collection has thousands.
  const TV_MAPPED_PAGE_SIZE = 40;
  const [tvVisibleCount, setTvVisibleCount] = useState(TV_MAPPED_PAGE_SIZE);
  // biome-ignore lint/correctness/useExhaustiveDependencies: reset page window when collection/book/search changes
  useEffect(() => {
    setTvVisibleCount(TV_MAPPED_PAGE_SIZE);
  }, [collectionId, sectionId, query]);

  // Fuzzy index over this collection's hadith. Building it is O(n) over every
  // item (a remote collection can hold thousands), so we never do it in a
  // render-blocking useMemo. Instead we keep it in state and build it lazily:
  // deferred until idle once data has loaded, or immediately
  // (synchronously) the moment the user starts searching if that deferred build
  // hasn't landed yet. Keyed to the item list so it rebuilds only when the data
  // changes — never per keystroke.
  const [hadithIndex, setHadithIndex] = useState<{
    key: HadithItem[];
    locale: string;
    index: FuzzyIndex<HadithItem>;
  } | null>(null);
  const activeIndex =
    hadithIndex?.key === allItems && hadithIndex.locale === translationLocale
      ? hadithIndex.index
      : null;
  useEffect(() => {
    // Already have an index for exactly this item list + translation — nothing to do.
    if (hadithIndex?.key === allItems && hadithIndex.locale === translationLocale) return;
    if (allItems.length === 0) {
      if (hadithIndex) setHadithIndex(null);
      return;
    }
    const build = () =>
      setHadithIndex({
        key: allItems,
        locale: translationLocale,
        index: createHadithSearch(allItems),
      });
    // Searching now: build synchronously so results aren't stalled behind a
    // pending interaction (also covers the `q`-seeded arrival case).
    if (searching) {
      build();
      return;
    }
    // Idle: defer the build so it doesn't compete with mount/nav animations.
    const handle = runWhenIdle(build);
    return () => handle.cancel();
  }, [allItems, searching, hadithIndex, translationLocale]);

  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const reloadBookmarks = useCallback(() => {
    let active = true;
    void HadithRepository.getBookmarks().then((list) => {
      if (active) setBookmarked(new Set(list.map((b) => b.hadithId)));
    });
    return () => {
      active = false;
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      return reloadBookmarks();
    }, [reloadBookmarks]),
  );

  useFocusEffect(
    useCallback(() => {
      if (collection) {
        recordContinueActivity(buildHadithCollectionActivity(collectionId, collection.nameEnglish));
      }
    }, [collection, collectionId]),
  );

  // What to show: the section list, or a filtered list of hadith.
  const showSectionList = sections.length > 0 && !sectionId && !searching;

  const listItems = useMemo(() => {
    // `activeIndex` is null only for the single frame between a search starting
    // and the synchronous build effect landing — treat that as "no results yet".
    if (searching) return activeIndex ? activeIndex.search(query) : [];
    if (sectionId) return allItems.filter((h) => h.chapterId === sectionId);
    return allItems;
  }, [allItems, activeIndex, query, sectionId, searching]);

  const activeSection = sections.find((s) => s.id === sectionId);
  const activeSectionIndex = activeSection ? sections.indexOf(activeSection) : -1;

  /** Jump to another book in place (wide-screen aside + arrow keys on web). */
  const openSection = useCallback(
    (id: string) => {
      setSectionId(id);
      setQuery("");
      listRef.current?.scrollToOffset({ offset: 0, animated: false });
    },
    [setSectionId],
  );

  const stepSection = useCallback(
    (delta: number) => {
      if (activeSectionIndex < 0) return false;
      const next = sections[activeSectionIndex + delta];
      if (!next) return false;
      openSection(next.id);
      return true;
    },
    [activeSectionIndex, openSection, sections],
  );

  // Desktop web: Left/Right arrows turn to the previous / next book (mirrored in RTL).
  useWebScreenKeyHandler(
    (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return undefined;
      const forward = (event.key === "ArrowRight") !== isRTL();
      return stepSection(forward ? 1 : -1);
    },
    !tv && activeSectionIndex >= 0,
  );

  // TV: no header back button — remote Back / Menu inside a book returns to the
  // book list (in-screen state) instead of popping the whole collection route.
  // Registered after the navigator's listener, so it runs first.
  const hasActiveSection = Boolean(activeSection);
  useFocusEffect(
    useCallback(() => {
      if (!tv || !hasActiveSection) return;
      const sub = BackHandler.addEventListener("hardwareBackPress", () => {
        setSectionId(null);
        setQuery("");
        return true;
      });
      return () => sub.remove();
    }, [tv, hasActiveSection, setSectionId]),
  );

  const collectionName = collection?.nameEnglish ?? "";
  const localCollectionName = collection ? collectionLabel(collection) : "";

  const markSaved = useCallback((id: string, saved: boolean) => {
    setBookmarked((prev) => {
      if (prev.has(id) === saved) return prev;
      const next = new Set(prev);
      if (saved) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  // Saving is instant; un-saving offers Undo, which restores the exact record
  // (same id + saved date) instead of re-saving it as new (B-13 pattern).
  const undoToast = useUndoToast();
  const runUndo = undoToast.run;
  const toggleBookmark = useCallback(
    async (item: HadithItem) => {
      if (!(await HadithRepository.isBookmarked(item.id))) {
        await HadithRepository.toggleBookmark(item);
        markSaved(item.id, true);
        return;
      }
      let removed: HadithBookmark | null = null;
      await runUndo({
        do: async () => {
          removed = await HadithRepository.removeBookmark(item.id);
          markSaved(item.id, false);
        },
        undo: async () => {
          if (removed && (await HadithRepository.restoreBookmark(removed))) {
            markSaved(item.id, true);
          }
        },
        messageKey: "hadith.removedFromSaved",
      });
    },
    [markSaved, runUndo],
  );

  const keyExtractor = useCallback((item: HadithItem) => item.id, []);

  const renderHadithCard = useCallback(
    (item: HadithItem) => (
      <View style={styles.readingColumn}>
        <HadithCard
          item={item}
          collectionName={collectionName}
          isBookmarked={bookmarked.has(item.id)}
          onBookmark={() => toggleBookmark(item)}
          onShare={shareHadith}
          isSharing={isSharing}
          isGesturePending={isGesturePending}
          prefs={prefs}
          arabicSize={readingSizes.arabic}
          translationSize={readingSizes.translation}
        />
      </View>
    ),
    [
      bookmarked,
      collectionName,
      isGesturePending,
      isSharing,
      prefs,
      readingSizes.arabic,
      readingSizes.translation,
      shareHadith,
      toggleBookmark,
    ],
  );

  const renderHadithItem = useCallback<ListRenderItem<HadithItem>>(
    ({ item }) => renderHadithCard(item),
    [renderHadithCard],
  );

  const readerFilters = useMemo(
    () => (
      <Card style={[styles.filtersCard, tv && styles.filtersCardTv]}>
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
            <ReadingFontControls surface="hadith" fullWidth={tv} />
          </View>
        </View>
        <PrefToggle
          icon={CONTROL_ICONS.arabic}
          label={t("hadith.showArabic")}
          enabled={prefs.showArabic}
          onToggle={() => void updatePrefs({ showArabic: !prefs.showArabic })}
        />
        <PrefToggle
          icon={CONTROL_ICONS.translation}
          label={t("hadith.showTranslation")}
          enabled={prefs.showTranslation}
          onToggle={() => void updatePrefs({ showTranslation: !prefs.showTranslation })}
        />
        {hasNarrator ? (
          <PrefToggle
            icon={CONTROL_ICONS.narrator}
            label={t("hadith.showNarrator")}
            enabled={prefs.showNarrator}
            onToggle={() => void updatePrefs({ showNarrator: !prefs.showNarrator })}
          />
        ) : null}
        {hasGrade ? (
          <PrefToggle
            icon={CONTROL_ICONS.grade}
            label={t("hadith.showGrade")}
            enabled={prefs.showGrade}
            onToggle={() => void updatePrefs({ showGrade: !prefs.showGrade })}
          />
        ) : null}
        {hasIsnad ? (
          <PrefToggle
            icon={CONTROL_ICONS.isnad}
            label={t("hadith.showIsnad")}
            enabled={prefs.showIsnad}
            onToggle={() => void updatePrefs({ showIsnad: !prefs.showIsnad })}
          />
        ) : null}
        {hasSharh ? (
          <PrefToggle
            icon={CONTROL_ICONS.sharh}
            label={t("hadith.showSharh")}
            enabled={prefs.showSharh}
            onToggle={() => void updatePrefs({ showSharh: !prefs.showSharh })}
          />
        ) : null}
        <MoreInSettingsLink settingId="content.hadith.showArabic" />
      </Card>
    ),
    [hasGrade, hasIsnad, hasNarrator, hasSharh, prefs, t, tv, updatePrefs],
  );

  if (!collection && isBundledId) {
    return (
      <ScreenLayout title={t("hadith.title")} onBack={() => goBackOrReplace(router, "/")}>
        {bundledFailed ? (
          <ContentState status="error" onRetry={() => setBundledAttempt((n) => n + 1)} />
        ) : (
          <ContentState
            status="loading"
            skeleton="rows"
            skeletonCount={6}
            loadingLabel={t("hadith.loading")}
          />
        )}
      </ScreenLayout>
    );
  }

  if (!collection) {
    return (
      <ScreenLayout title={t("hadith.title")} onBack={() => goBackOrReplace(router, "/")}>
        <Seo
          path={`/hadith/${collectionId}`}
          title={t("hadith.notFoundTitle")}
          description={t("hadith.notFoundDesc")}
          index={false}
        />
        <EmptyState
          icon={{ ios: "questionmark.circle", android: "help", web: "help" }}
          title={t("hadith.notFoundTitle")}
          description={t("hadith.notFoundDesc")}
        />
      </ScreenLayout>
    );
  }

  const isLoading = remote ? remoteQuery.isPending : !bundledData && !bundledFailed;
  const failedOffline = remote && remoteQuery.isError && !remoteQuery.data;
  const failedBundled = !remote && bundledFailed && !bundledData;
  const failed = failedOffline || failedBundled;

  const goBackToBooks = () => {
    setSectionId(null);
    setQuery("");
  };

  // D-UX11 list–detail (wide tablet / desktop, not TV): the start pane lists the
  // books — the selection is the `?book=` param, so deep links and Back behave
  // as on a phone — and the detail pane reads the chosen book (or search hits).
  const listDetail = showSideFilters && !isLoading && !failed;
  // Wide, no book chosen and no search: books pane + a "choose a book" prompt.
  // The URL is left alone (no book is written until the reader picks one).
  const awaitingBook = listDetail && showSectionList;
  const useFlatList = !isLoading && !failed && (!showSectionList || listDetail);
  // TV: ScreenLayout ScrollView + mapped cards — nested FlatList flex hosts still
  // collapse to zero height on Leanback (same failure mode as dua/zikr categories).
  const tvMappedList = tv && useFlatList;
  const tvListItems = tvMappedList ? listItems.slice(0, tvVisibleCount) : listItems;
  const collectionDescription = `Read hadith from ${collectionName} — the sayings and traditions of the Prophet Muhammad ﷺ, with narrator and grading details.`;
  const collectionBreadcrumbs = [
    { name: t("tabs.home"), path: "/" },
    { name: t("hadith.title"), path: "/hadith" },
    { name: collectionName, path: `/hadith/${collectionId}` },
  ];

  const searchCard = (countLabel: string) => (
    <Card padding="four">
      <View style={styles.searchCard}>
        <SearchField
          value={query}
          onChangeText={setQuery}
          placeholder={t("hadith.searchPlaceholder")}
        />
        <ThemedText
          type="caption"
          themeColor="mutedForeground"
          style={tv ? { fontSize: TvLayout.bodyFontSize } : undefined}
        >
          {countLabel}
        </ThemedText>
      </View>
    </Card>
  );

  const readingListHeader = (
    <View
      style={[styles.readingColumn, styles.listHeader, tvMappedList && styles.listHeaderTv]}
      onLayout={onHeaderCardLayout}
    >
      <TvUndoButton controller={undoToast} preferredFocus />
      {searchCard(
        awaitingBook
          ? t("hadith.bookCount", { count: sections.length })
          : t("hadith.hadithCount", { count: listItems.length }),
      )}
      {!showSideFilters ? readerFilters : null}
    </View>
  );

  const listEmpty = awaitingBook ? (
    <EmptyState
      icon={{ ios: "books.vertical", android: "library_books", web: "library_books" }}
      title={t("hadith.chooseBookTitle")}
      description={t("hadith.chooseBookDesc")}
    />
  ) : (
    <EmptyState
      icon={{ ios: "text.magnifyingglass", android: "search", web: "search" }}
      title={searching ? t("search.noResultsTitle") : t("hadith.emptyTitle")}
      description={searching ? t("search.noResultsDesc") : t("hadith.emptyDesc")}
    />
  );

  return (
    <ScreenLayout
      eyebrow={t("hadith.title")}
      title={activeSection ? activeSection.name : localCollectionName}
      subtitle={
        activeSection
          ? localCollectionName
          : localCollectionName === collection.nameArabic
            ? collection.nameEnglish
            : collection.nameArabic
      }
      onBack={activeSection ? goBackToBooks : () => goBackOrReplace(router, "/")}
      scrollable={tvMappedList ? true : useFlatList ? false : undefined}
      scrollRef={tvMappedList ? screenScrollRef : undefined}
      onScroll={tvMappedList ? onListScroll : undefined}
      readingProgress={tvMappedList ? true : undefined}
      maxContentWidth={
        useFlatList
          ? showSideFilters
            ? LIST_DETAIL_MAX_WIDTH
            : tv
              ? TvLayout.listDetailMaxWidth
              : undefined
          : undefined
      }
      headerAccessory={
        useFlatList && !showSideFilters ? (
          <HadithReadingToolbar
            visible={toolbarVisible}
            progress={readingProgress}
            onBackToTop={scrollToTop}
            showArabic={prefs.showArabic}
            showTranslation={prefs.showTranslation}
            showNarrator={prefs.showNarrator}
            showGrade={prefs.showGrade}
            showIsnad={prefs.showIsnad}
            showSharh={prefs.showSharh}
            hasNarrator={hasNarrator}
            hasGrade={hasGrade}
            hasIsnad={hasIsnad}
            hasSharh={hasSharh}
            onToggleArabic={() => void updatePrefs({ showArabic: !prefs.showArabic })}
            onToggleTranslation={() =>
              void updatePrefs({ showTranslation: !prefs.showTranslation })
            }
            onToggleNarrator={() => void updatePrefs({ showNarrator: !prefs.showNarrator })}
            onToggleGrade={() => void updatePrefs({ showGrade: !prefs.showGrade })}
            onToggleIsnad={() => void updatePrefs({ showIsnad: !prefs.showIsnad })}
            onToggleSharh={() => void updatePrefs({ showSharh: !prefs.showSharh })}
          />
        ) : undefined
      }
    >
      {SnapshotHost}
      <Seo
        path={`/hadith/${collectionId}`}
        title={collectionName}
        description={collectionDescription}
        type="article"
        breadcrumbs={collectionBreadcrumbs}
        jsonLd={[
          collectionPageSchema({
            path: `/hadith/${collectionId}`,
            name: collectionName,
            description: collectionDescription,
            breadcrumbs: collectionBreadcrumbs,
          }),
        ]}
      />
      {isLoading ? (
        <ContentState
          status="loading"
          skeleton="rows"
          skeletonCount={6}
          loadingLabel={t("hadith.loadingCollection", { name: collectionName })}
        />
      ) : failedOffline ? (
        <ContentState
          status="offline"
          errorMessage={t("hadith.offlineDesc")}
          onRetry={() => void remoteQuery.refetch()}
        />
      ) : failedBundled ? (
        <ContentState status="error" onRetry={() => setBundledAttempt((n) => n + 1)} />
      ) : showSectionList && !listDetail ? (
        <View style={styles.contentStack}>
          {searchCard(t("hadith.bookCount", { count: sections.length }))}
          <Card padding="four">
            {/* TV: two-column book grid uses the landscape width; the first book
                takes initial focus instead of the search field. */}
            {tv ? (
              <View style={[styles.list, styles.sectionGridTv]}>
                {sections.map((section, index) => (
                  <View key={section.id} style={styles.sectionCellTv}>
                    <SectionRow
                      section={section}
                      preferredFocus={index === 0}
                      onPress={() => setSectionId(section.id)}
                    />
                  </View>
                ))}
              </View>
            ) : (
              /* Wide web / tablets: books flow into 2-3 columns. */
              <ResponsiveGrid maxColumns={3} gap={Spacing.two}>
                {sections.map((section) => (
                  <SectionRow
                    key={section.id}
                    section={section}
                    onPress={() => setSectionId(section.id)}
                  />
                ))}
              </ResponsiveGrid>
            )}
          </Card>
        </View>
      ) : tvMappedList ? (
        <View style={[styles.contentStack, { paddingBottom: contentBottomInset }]}>
          {readingListHeader}
          {listItems.length === 0 ? (
            listEmpty
          ) : (
            <>
              {tvListItems.map((item, index) => (
                <View key={item.id}>
                  {index > 0 ? <HadithListSeparator /> : null}
                  {renderHadithCard(item)}
                </View>
              ))}
              {tvVisibleCount < listItems.length ? (
                <PressableScale
                  haptic="light"
                  accessibilityRole="button"
                  accessibilityLabel={t("hadith.loadMore")}
                  onPress={() => setTvVisibleCount((n) => n + TV_MAPPED_PAGE_SIZE)}
                  style={[styles.tvLoadMore, { borderColor: tokens.hairline }]}
                >
                  <ThemedText type="smallBold">{t("hadith.loadMore")}</ThemedText>
                </PressableScale>
              ) : null}
            </>
          )}
        </View>
      ) : (
        /* No Stagger wrapper: its item view has no flex, which would break the
           FlatList's height chain (matches the dua category screen). */
        <View style={showSideFilters ? styles.listDetailRoot : styles.readerRoot}>
          {showSideFilters ? (
            <View style={[styles.listPane, { borderEndColor: tokens.hairline }]}>
              {readerChrome}
              <TvScrollView
                style={styles.listPaneScroll}
                contentContainerStyle={[
                  styles.listPaneContent,
                  { paddingBottom: contentBottomInset },
                ]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {sections.length > 0 ? (
                  <BookNavCard
                    sections={sections}
                    activeId={activeSection?.id ?? null}
                    onSelect={openSection}
                    onStep={stepSection}
                    title={t("hadith.bookCount", { count: sections.length })}
                    previousLabel={t("common.previous")}
                    nextLabel={t("common.next")}
                  />
                ) : null}
                {readerFilters}
              </TvScrollView>
            </View>
          ) : null}
          <TvFlatList
            ref={listRef}
            style={[styles.flatList, showSideFilters ? styles.listDetailPrimary : null]}
            contentContainerStyle={[styles.flatListContent, { paddingBottom: contentBottomInset }]}
            data={awaitingBook ? EMPTY_HADITH_ITEMS : listItems}
            keyExtractor={keyExtractor}
            renderItem={renderHadithItem}
            extraData={prefs}
            ItemSeparatorComponent={HadithListSeparator}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            initialNumToRender={12}
            maxToRenderPerBatch={8}
            windowSize={7}
            removeClippedSubviews={!tv}
            onScroll={onListScroll}
            scrollEventThrottle={16}
            ListHeaderComponent={readingListHeader}
            ListEmptyComponent={listEmpty}
          />
        </View>
      )}
    </ScreenLayout>
  );
}

/** Spacer matching the previous `gap: Spacing.three` between hadith cards. */
function HadithListSeparator() {
  return <View style={styles.hadithSeparator} />;
}

/**
 * Wide-screen aside: jump between books without leaving the reader, with
 * previous / next controls for the active book.
 */
function BookNavCard({
  sections,
  activeId,
  onSelect,
  onStep,
  title,
  previousLabel,
  nextLabel,
}: {
  sections: HadithSection[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onStep: (delta: number) => boolean;
  title: string;
  previousLabel: string;
  nextLabel: string;
}) {
  const { colors, tokens } = useThemeTokens();
  const activeIndex = activeId ? sections.findIndex((s) => s.id === activeId) : -1;
  const atFirst = activeIndex <= 0;
  const atLast = activeIndex >= sections.length - 1;
  const prevIcon = useChevronBackward();
  const nextIcon = useChevronForward();
  return (
    <Card style={styles.bookNavCard}>
      <View style={styles.bookNavHead}>
        <SymbolView
          name={{ ios: "books.vertical", android: "library_books", web: "library_books" }}
          size={16}
          tintColor={colors.mutedForeground}
        />
        <ThemedText type="smallBold" style={styles.bookNavTitle}>
          {title}
        </ThemedText>
      </View>
      {activeIndex >= 0 ? (
        <View style={styles.bookNavStepRow}>
          <PressableScale
            haptic="light"
            accessibilityRole="button"
            accessibilityLabel={previousLabel}
            accessibilityState={{ disabled: atFirst }}
            disabled={atFirst}
            onPress={() => onStep(-1)}
            style={[
              styles.readerChromeBtn,
              { backgroundColor: colors.muted, opacity: atFirst ? Opacity.disabled : 1 },
            ]}
          >
            <SymbolView name={prevIcon} size={14} tintColor={colors.mutedForeground} />
            <ThemedText weight="semibold" type="caption" style={{ color: colors.mutedForeground }}>
              {previousLabel}
            </ThemedText>
          </PressableScale>
          <PressableScale
            haptic="light"
            accessibilityRole="button"
            accessibilityLabel={nextLabel}
            accessibilityState={{ disabled: atLast }}
            disabled={atLast}
            onPress={() => onStep(1)}
            style={[
              styles.readerChromeBtn,
              { backgroundColor: colors.muted, opacity: atLast ? Opacity.disabled : 1 },
            ]}
          >
            <ThemedText weight="semibold" type="caption" style={{ color: colors.mutedForeground }}>
              {nextLabel}
            </ThemedText>
            <SymbolView name={nextIcon} size={14} tintColor={colors.mutedForeground} />
          </PressableScale>
        </View>
      ) : null}
      <View style={styles.bookNavList}>
        {sections.map((section, index) => {
          const active = section.id === activeId;
          return (
            <PressableScale
              key={section.id}
              haptic="light"
              accessibilityRole="button"
              accessibilityLabel={section.name}
              accessibilityState={{ selected: active }}
              onPress={() => onSelect(section.id)}
              scaleTo={0.98}
              style={[styles.bookNavRow, active && { backgroundColor: tokens.accentSoft }]}
            >
              <ThemedText
                type="caption"
                style={[
                  styles.bookNavIndex,
                  { color: active ? tokens.accentOnSoft : colors.mutedForeground },
                ]}
              >
                {index + 1}
              </ThemedText>
              <ThemedText
                type="small"
                weight={active ? "semibold" : undefined}
                numberOfLines={2}
                style={[styles.bookNavLabel, active && { color: tokens.accentOnSoft }]}
              >
                {section.name}
              </ThemedText>
              {section.count != null ? (
                <ThemedText type="caption" themeColor="mutedForeground">
                  {section.count}
                </ThemedText>
              ) : null}
            </PressableScale>
          );
        })}
      </View>
    </Card>
  );
}

function SectionRow({
  section,
  onPress,
  preferredFocus,
}: {
  section: HadithSection;
  onPress: () => void;
  preferredFocus?: boolean;
}) {
  return (
    <NavRow
      preferredFocus={preferredFocus}
      icon={{ ios: "book.closed", android: "menu_book", web: "menu_book" }}
      label={section.name}
      count={section.count}
      onPress={onPress}
    />
  );
}

function HadithCard({
  item,
  collectionName,
  isBookmarked,
  onBookmark,
  onShare: onShareHadith,
  isSharing,
  isGesturePending,
  prefs,
  arabicSize,
  translationSize,
}: {
  item: HadithItem;
  collectionName: string;
  isBookmarked: boolean;
  onBookmark: () => void;
  onShare: (item: HadithItem) => void;
  isSharing: (shareKey: string) => boolean;
  isGesturePending: (shareKey: string) => boolean;
  prefs: HadithDisplayPrefs;
  arabicSize: number;
  translationSize: number;
}) {
  const { colors, tokens } = useThemeTokens();
  const { t, i18n } = useTranslation();
  const tv = isTV();
  const audio = useAudioPlayerContext();
  // Optional: outside the report provider (tests) the card just omits "Report".
  const contentReport = useContext(ContentReportContext);
  const locale = i18n.language?.split("-")[0] ?? "en";
  const displayTranslation = useHadithTranslation(item);

  const onShare = () => {
    recordContinueActivity(buildHadithActivity(item, collectionName));
    onShareHadith(item);
  };

  const onBookmarkPress = () => {
    recordContinueActivity(buildHadithActivity(item, collectionName));
    onBookmark();
  };

  const onPlay = () => {
    if (!item.audioUri) return;
    audio.play(
      [{ id: item.id, title: item.reference, subtitle: item.narrator, uri: item.audioUri }],
      0,
      { sourceHref: `/hadith/${item.collection}?q=${encodeURIComponent(item.reference)}` },
    );
  };

  const menuActions: ContextMenuAction[] = [];
  if (item.audioUri) {
    menuActions.push({ id: "play", title: t("common.play"), systemIcon: "play.circle.fill" });
  }
  menuActions.push({ id: "share", title: t("hadith.share"), systemIcon: "square.and.arrow.up" });
  menuActions.push({
    id: "bookmark",
    title: isBookmarked ? t("hadith.bookmarkRemove") : t("hadith.bookmarkAdd"),
    systemIcon: isBookmarked ? "bookmark.slash" : "bookmark",
  });

  const reportRef = () =>
    buildContentReportRef("hadith", item.id, `/hadith/${item.collection}`, locale, {
      parentId: item.collection,
      snapshot: {
        title: item.reference,
        arabic: item.arabic,
        translation: displayTranslation,
        reference: item.reference,
      },
    });
  if (contentReport) {
    menuActions.push({
      id: "report",
      title: t("contentReport.reportIssue"),
      shortTitle: t("contentReport.short"),
      systemIcon: "flag",
      icon: REPORT_FLAG_ICON,
    });
  }

  const onMenuAction = (id: string) => {
    if (id === "play") onPlay();
    else if (id === "share") onShare();
    else if (id === "bookmark") onBookmarkPress();
    else if (id === "report") contentReport?.openReport(reportRef());
  };

  const showArabic = prefs.showArabic && Boolean(item.arabic);
  const showNarrator = prefs.showNarrator && Boolean(item.narrator);
  const showGrade = prefs.showGrade && Boolean(item.grade);
  const showTranslation = prefs.showTranslation && Boolean(displayTranslation);
  const showIsnad = prefs.showIsnad && (item.isnad?.length ?? 0) > 0;
  const showSharh = prefs.showSharh && Boolean(item.sharhArabic);

  return (
    // TV: no long-press menus — every action has a focusable button on the card.
    <ContextMenu actions={tv ? [] : menuActions} onAction={onMenuAction}>
      <Card padding="four">
        <View style={styles.cardHeader}>
          <View style={styles.cardRef}>
            <ThemedText type="smallBold" style={{ color: colors.accentText }}>
              {item.reference}
            </ThemedText>
            {showGrade && item.grade ? (
              <Pill
                label={item.grade}
                color={tokens.status.success.color}
                background={tokens.status.success.soft}
              />
            ) : null}
          </View>
          {/* Play · Save · Share · More (report) — the shared row (P5-37, D-UX9). */}
          <View style={styles.cardActions}>
            <ContentActions
              labelled
              play={item.audioUri ? { trackId: item.id, onPlay } : undefined}
              save={{ saved: isBookmarked, onToggle: onBookmarkPress }}
              share={
                tv
                  ? undefined
                  : {
                      onShare,
                      loading: isSharing(item.id),
                      loadingLabel: t("share.preparing"),
                      accessibilityLabel: t("hadith.share"),
                      label: isGesturePending(item.id) ? t("share.tapToShare") : undefined,
                    }
              }
              more={
                contentReport
                  ? {
                      actions: [
                        {
                          id: "report",
                          title: t("contentReport.reportIssue"),
                          shortTitle: t("contentReport.short"),
                          systemIcon: "flag",
                          icon: REPORT_FLAG_ICON,
                        },
                      ],
                      onAction: onMenuAction,
                    }
                  : undefined
              }
            />
          </View>
        </View>

        {showArabic ? (
          <>
            <ThemedText
              type="arabic"
              accessibilityLanguage="ar"
              style={[styles.arabic, arabicReadingLayout(arabicSize)]}
            >
              {item.arabic}
            </ThemedText>
            {showNarrator || showIsnad || showTranslation || showSharh ? (
              <View style={[styles.divider, { backgroundColor: tokens.hairline }]} />
            ) : null}
          </>
        ) : null}

        {showIsnad && item.isnad ? <HadithIsnadChain isnad={item.isnad} /> : null}

        {showNarrator && !showIsnad ? (
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.narrator}>
            {item.narrator}
          </ThemedText>
        ) : null}

        {showTranslation ? (
          <ThemedText
            type="default"
            style={[
              styles.english,
              { fontSize: translationSize, lineHeight: translationSize * 1.6 },
            ]}
          >
            {displayTranslation}
          </ThemedText>
        ) : null}

        {showSharh && item.sharhArabic ? (
          <HadithSharhBlock
            sharhArabic={item.sharhArabic}
            arabicSize={Math.max(16, arabicSize - 2)}
          />
        ) : null}
      </Card>
    </ContextMenu>
  );
}

const CONTROL_ICONS = {
  arabic: { ios: "character.textbox", android: "translate", web: "translate" },
  translation: { ios: "text.alignleft", android: "notes", web: "notes" },
  narrator: { ios: "person.fill", android: "person", web: "person" },
  grade: { ios: "checkmark.seal.fill", android: "verified", web: "verified" },
  isnad: { ios: "list.bullet", android: "format_list_bulleted", web: "format_list_bulleted" },
  sharh: { ios: "text.book.closed", android: "menu_book", web: "menu_book" },
  textSize: { ios: "textformat.size", android: "format_size", web: "format_size" },
} as const satisfies Record<string, SymbolViewProps["name"]>;

/** Comfortable line length for long-form hadith reading on wide screens. */
const HadithReadingMaxWidth = 720;

const styles = StyleSheet.create({
  contentStack: { gap: Spacing.four, width: "100%" },
  tvLoadMore: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.four,
    marginTop: Spacing.two,
    borderWidth: BorderWidth.hairline,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  readerRoot: { flex: 1, width: "100%" },
  listDetailRoot: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    gap: Spacing.four,
    minHeight: 0,
  },
  listDetailPrimary: {
    flex: 1.25,
    minWidth: 0,
    minHeight: 0,
  },
  /** List–detail start pane: books (the list) + reader filters. */
  listPane: {
    flex: 1,
    minWidth: 280,
    maxWidth: 400,
    borderEndWidth: BorderWidth.hairline,
    gap: Spacing.three,
    minHeight: 0,
  },
  listPaneScroll: {
    flex: 1,
  },
  listPaneContent: {
    paddingEnd: Spacing.four,
    flexGrow: 1,
    gap: Spacing.three,
  },
  readerChromeRow: {
    flexDirection: "row",
    gap: Spacing.two,
    paddingEnd: Spacing.four,
  },
  readerChromeBtn: {
    flex: 1,
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.oneHalf,
    paddingVertical: Spacing.oneHalf,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
  },
  flatList: { flex: 1, minHeight: 0 },
  flatListContent: { paddingBottom: Spacing.four },
  listHeader: { marginBottom: Spacing.four, gap: Spacing.three },
  listHeaderTv: { marginBottom: Spacing.five },
  filtersCard: { gap: Spacing.two },
  filtersCardTv: { gap: Spacing.three },
  hadithSeparator: { height: Spacing.three },
  searchCard: { gap: Spacing.three },
  list: { gap: Spacing.two },
  bookNavCard: { gap: Spacing.two },
  bookNavHead: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  bookNavTitle: { flex: 1 },
  bookNavStepRow: { flexDirection: "row", gap: Spacing.two },
  bookNavList: { gap: Spacing.half },
  bookNavRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    minHeight: 44,
    paddingVertical: Spacing.oneHalf,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
  },
  bookNavIndex: { minWidth: 22, fontVariant: ["tabular-nums"] },
  bookNavLabel: { flex: 1, minWidth: 0 },
  sectionGridTv: { flexDirection: "row", flexWrap: "wrap" },
  sectionCellTv: { flexGrow: 1, flexBasis: "48%", minWidth: 0 },
  readingColumn: {
    width: "100%",
    maxWidth: HadithReadingMaxWidth,
    alignSelf: "center",
  },
  controlRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.three,
    minHeight: 44,
  },
  controlRowTv: {
    minHeight: TvLayout.minFocusTarget,
  },
  controlRowStackTv: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: Spacing.two,
  },
  translationRow: {
    alignItems: "center",
  },
  controlValue: {
    flexShrink: 0,
  },
  controlValueTv: {
    width: "100%",
    flexShrink: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: Spacing.four,
    gap: Spacing.three,
  },
  cardRef: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    flexWrap: "wrap",
  },
  cardActions: {
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: Spacing.one,
    maxWidth: "58%",
  },
  arabic: {},
  divider: { height: StyleSheet.hairlineWidth, marginVertical: Spacing.four },
  narrator: { fontStyle: "italic" },
  english: { marginTop: Spacing.three, lineHeight: 26 },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/hadith/[collection]");
