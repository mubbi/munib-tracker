import type { HadithItem, HadithSection } from "@munib-tracker/shared/types";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  type FlatList,
  type LayoutChangeEvent,
  type ListRenderItem,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { getRemoteCollection, isRemoteCollection } from "@/api/hadith-remote";
import { ContentReportButton } from "@/components/content-report/content-report-button";
import { HadithIsnadChain } from "@/components/hadith/hadith-isnad-chain";
import { HadithSharhBlock } from "@/components/hadith/hadith-sharh-block";
import { HadithReadingToolbar } from "@/components/hadith/reading-toolbar";
import { ReadingFontControls } from "@/components/reading-font-controls";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { ContextMenu, type ContextMenuAction } from "@/components/ui/context-menu";
import { EmptyState } from "@/components/ui/empty-state";
import { LabeledIconButton } from "@/components/ui/labeled-icon-button";
import { NavRow } from "@/components/ui/nav-row";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ThemedSwitch } from "@/components/ui/themed-switch";
import { TvFlatList } from "@/components/ui/tv-flat-list";
import { TvScrollView } from "@/components/ui/tv-scroll-view";
import { PLAY_CIRCLE_ICON } from "@/constants/media-icons";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { HadithRepository } from "@/db";
import type { HadithPrefs } from "@/db/repositories/hadith-repository";
import { useContentBottomInset } from "@/hooks/use-content-bottom-inset";
import { useRemoteCollection } from "@/hooks/use-hadith";
import { useHadithTranslation } from "@/hooks/use-hadith-translation";
import { useLargeScreenLayout } from "@/hooks/use-large-screen-layout";
import { useReadingFullscreen } from "@/hooks/use-reading-fullscreen";
import { useShareContentCard } from "@/hooks/use-share-content-card";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { buildContentReportRef } from "@/lib/content-report-ref";
import { buildHadithActivity, buildHadithCollectionActivity } from "@/lib/continue-activity";
import {
  ensureBundledCollection,
  ensureBundledCollectionData,
  getBundledCollection,
  getBundledCollectionData,
  getBundledCollections,
} from "@/lib/hadith";
import { tTv } from "@/lib/i18n/t-tv";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { arabicReadingLayout, resolveReadingFontSizes } from "@/lib/reading-typography";
import { runWhenIdle } from "@/lib/run-when-idle";
import { createHadithSearch, type FuzzyIndex } from "@/lib/search";
import { collectionPageSchema } from "@/lib/seo/structured-data";
import { buildHadithSharePayload } from "@/lib/share";
import { resolveHadithTranslation } from "@/lib/translation-locale";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";
import { recordContinueActivity } from "@/stores/continue-store";
import { useHadithActions, useHadithPrefs } from "@/stores/hadith-store";
import { usePreferences } from "@/stores/preferences-store";

/** Stable empty sentinels so `?? []` does not churn effect deps every render. */
const EMPTY_HADITH_ITEMS: HadithItem[] = [];
const EMPTY_SECTIONS: HadithSection[] = [];

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
  const params = useLocalSearchParams<{ collection: string; q?: string }>();
  const collectionId = params.collection ?? "";
  const remote = isRemoteCollection(collectionId);

  const [bundled, setBundled] = useState(() => getBundledCollection(collectionId));
  const [bundledData, setBundledData] = useState(() => getBundledCollectionData(collectionId));

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const [collection, data] = await Promise.all([
        ensureBundledCollection(collectionId),
        ensureBundledCollectionData(collectionId),
      ]);
      if (cancelled) return;
      setBundled(collection);
      setBundledData(data);
    })();
    return () => {
      cancelled = true;
    };
  }, [collectionId]);
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
  const prefs = useHadithPrefs();
  const { updatePrefs } = useHadithActions();
  const readingSizes = resolveReadingFontSizes("hadith", fontPrefs);
  const listRef = useRef<FlatList<HadithItem>>(null);
  const screenScrollRef = useRef<ScrollView>(null);
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
            type="caption"
            style={{
              color: colors.accentText,
              fontWeight: "600",
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
  const [sectionId, setSectionId] = useState<string | null>(null);
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

  const collectionName = collection?.nameEnglish ?? "";

  const toggleBookmark = useCallback(async (item: HadithItem) => {
    const added = await HadithRepository.toggleBookmark(item);
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (added) next.add(item.id);
      else next.delete(item.id);
      return next;
    });
  }, []);

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
      <Card padding="three" style={[styles.filtersCard, tv && styles.filtersCardTv]}>
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
      </Card>
    ),
    [hasGrade, hasIsnad, hasNarrator, hasSharh, prefs, t, tv, updatePrefs],
  );

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

  const isLoading = remote && remoteQuery.isPending;
  const failedOffline = remote && remoteQuery.isError && !remoteQuery.data;

  const goBackToBooks = () => {
    setSectionId(null);
    setQuery("");
  };

  const useFlatList = !isLoading && !failedOffline && !showSectionList;
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

  const readingListHeader = (
    <View
      style={[styles.readingColumn, styles.listHeader, tvMappedList && styles.listHeaderTv]}
      onLayout={onHeaderCardLayout}
    >
      <Card padding="four">
        <View style={styles.searchCard}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t("hadith.searchPlaceholder")}
            placeholderTextColor={colors.mutedForeground}
            accessibilityLabel={t("hadith.searchPlaceholder")}
            style={[
              styles.input,
              tv && styles.inputTv,
              { backgroundColor: colors.muted, color: colors.foreground },
            ]}
          />
          <ThemedText
            type="caption"
            themeColor="mutedForeground"
            style={tv ? { fontSize: TvLayout.bodyFontSize } : undefined}
          >
            {t("hadith.hadithCount", { count: listItems.length })}
          </ThemedText>
        </View>
      </Card>
      {!showSideFilters ? readerFilters : null}
    </View>
  );

  return (
    <ScreenLayout
      eyebrow={t("hadith.title")}
      title={activeSection ? activeSection.name : collection.nameEnglish}
      subtitle={activeSection ? collection.nameEnglish : collection.nameArabic}
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
        <EmptyState
          icon={{ ios: "arrow.down.circle", android: "download", web: "download" }}
          title={t("hadith.loading")}
        />
      ) : failedOffline ? (
        <EmptyState
          icon={{ ios: "wifi.slash", android: "wifi_off", web: "wifi_off" }}
          title={t("hadith.offlineTitle")}
          description={t("hadith.offlineDesc")}
        />
      ) : showSectionList ? (
        <View style={styles.contentStack}>
          <Card padding="four">
            <View style={styles.searchCard}>
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder={t("hadith.searchPlaceholder")}
                placeholderTextColor={colors.mutedForeground}
                accessibilityLabel={t("hadith.searchPlaceholder")}
                style={[
                  styles.input,
                  tv && styles.inputTv,
                  { backgroundColor: colors.muted, color: colors.foreground },
                ]}
              />
              <ThemedText
                type="caption"
                themeColor="mutedForeground"
                style={tv ? { fontSize: TvLayout.bodyFontSize } : undefined}
              >
                {t("hadith.bookCount", { count: sections.length })}
              </ThemedText>
            </View>
          </Card>
          <Card padding="four">
            <View style={styles.list}>
              {sections.map((section) => (
                <SectionRow
                  key={section.id}
                  section={section}
                  onPress={() => setSectionId(section.id)}
                />
              ))}
            </View>
          </Card>
        </View>
      ) : tvMappedList ? (
        <View style={[styles.contentStack, { paddingBottom: contentBottomInset }]}>
          {readingListHeader}
          {listItems.length === 0 ? (
            <EmptyState
              icon={{ ios: "text.magnifyingglass", android: "search", web: "search" }}
              title={searching ? t("search.noResultsTitle") : t("hadith.emptyTitle")}
              description={searching ? t("search.noResultsDesc") : t("hadith.emptyDesc")}
            />
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
          <TvFlatList
            ref={listRef}
            style={[styles.flatList, showSideFilters ? styles.listDetailPrimary : null]}
            contentContainerStyle={[styles.flatListContent, { paddingBottom: contentBottomInset }]}
            data={listItems}
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
            ListEmptyComponent={
              <EmptyState
                icon={{ ios: "text.magnifyingglass", android: "search", web: "search" }}
                title={searching ? t("search.noResultsTitle") : t("hadith.emptyTitle")}
                description={searching ? t("search.noResultsDesc") : t("hadith.emptyDesc")}
              />
            }
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
                {readerFilters}
              </TvScrollView>
            </View>
          ) : null}
        </View>
      )}
    </ScreenLayout>
  );
}

/** Spacer matching the previous `gap: Spacing.three` between hadith cards. */
function HadithListSeparator() {
  return <View style={styles.hadithSeparator} />;
}

function SectionRow({ section, onPress }: { section: HadithSection; onPress: () => void }) {
  return (
    <NavRow
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
  prefs: HadithPrefs;
  arabicSize: number;
  translationSize: number;
}) {
  const { colors, tokens } = useThemeTokens();
  const { t, i18n } = useTranslation();
  const audio = useAudioPlayerContext();
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

  const onMenuAction = (id: string) => {
    if (id === "play") onPlay();
    else if (id === "share") onShare();
    else if (id === "bookmark") onBookmarkPress();
  };

  const showArabic = prefs.showArabic && Boolean(item.arabic);
  const showNarrator = prefs.showNarrator && Boolean(item.narrator);
  const showGrade = prefs.showGrade && Boolean(item.grade);
  const showTranslation = prefs.showTranslation && Boolean(displayTranslation);
  const showIsnad = prefs.showIsnad && (item.isnad?.length ?? 0) > 0;
  const showSharh = prefs.showSharh && Boolean(item.sharhArabic);

  return (
    <ContextMenu actions={menuActions} onAction={onMenuAction}>
      <Card padding="four">
        <View style={styles.cardHeader}>
          <View style={styles.cardRef}>
            <ThemedText type="smallBold" style={{ color: colors.accent }}>
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
          <View style={styles.cardActions}>
            {item.audioUri ? (
              <LabeledIconButton
                name={PLAY_CIRCLE_ICON}
                label={t("common.play")}
                iconSize={20}
                tintColor={colors.accent}
                accessibilityLabel={t("common.play")}
                onPress={onPlay}
              />
            ) : null}
            <LabeledIconButton
              name={{ ios: "square.and.arrow.up", android: "share", web: "share" }}
              label={
                isGesturePending(item.id)
                  ? tTv(t, "share.tapToShare", "share.selectToShare")
                  : t("common.share")
              }
              iconSize={18}
              tintColor={colors.mutedForeground}
              accessibilityLabel={t("hadith.share")}
              loading={isSharing(item.id)}
              loadingLabel={t("share.preparing")}
              onPress={onShare}
            />
            <LabeledIconButton
              name={
                isBookmarked
                  ? { ios: "bookmark.fill", android: "bookmark", web: "bookmark" }
                  : { ios: "bookmark", android: "bookmark_border", web: "bookmark_border" }
              }
              label={isBookmarked ? t("quran.actionBookmarked") : t("quran.actionBookmark")}
              iconSize={18}
              tintColor={isBookmarked ? tokens.status.warning.color : colors.mutedForeground}
              labelColor={isBookmarked ? tokens.status.warning.color : undefined}
              accessibilityLabel={
                isBookmarked ? t("hadith.bookmarkRemove") : t("hadith.bookmarkAdd")
              }
              accessibilityState={{ selected: isBookmarked }}
              haptic="selection"
              onPress={onBookmarkPress}
            />
            <ContentReportButton
              contentRef={buildContentReportRef(
                "hadith",
                item.id,
                `/hadith/${item.collection}`,
                locale,
                {
                  parentId: item.collection,
                  snapshot: {
                    title: item.reference,
                    arabic: item.arabic,
                    translation: displayTranslation,
                    reference: item.reference,
                  },
                },
              )}
            />
          </View>
        </View>

        {showArabic ? (
          <>
            <ThemedText type="arabic" style={[styles.arabic, arabicReadingLayout(arabicSize)]}>
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
            backgroundColor: enabled ? tokens.accentSoft : colors.muted,
            borderColor: enabled ? colors.accent : tokens.hairline,
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
            {
              backgroundColor: enabled ? colors.accent : withAlpha(colors.mutedForeground, 0.2),
            },
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

/** Comfortable line length for long-form hadith reading on wide screens. */
const HadithReadingMaxWidth = 720;

const styles = StyleSheet.create({
  contentStack: { gap: Spacing.four, width: "100%" },
  tvLoadMore: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.four,
    marginTop: Spacing.two,
    borderWidth: StyleSheet.hairlineWidth,
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
  listDetailSecondary: {
    flex: 1,
    minWidth: 280,
    maxWidth: 400,
    borderStartWidth: StyleSheet.hairlineWidth,
    gap: Spacing.three,
    minHeight: 0,
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
  flatList: { flex: 1, minHeight: 0 },
  flatListContent: { paddingBottom: Spacing.four },
  listHeader: { marginBottom: Spacing.four, gap: Spacing.three },
  listHeaderTv: { marginBottom: Spacing.five },
  filtersCard: { gap: Spacing.two },
  filtersCardTv: { gap: Spacing.three },
  hadithSeparator: { height: Spacing.three },
  searchCard: { gap: Spacing.three },
  input: {
    borderRadius: Radius.md,
    borderCurve: "continuous",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 15,
  },
  inputTv: {
    minHeight: TvLayout.minFocusTarget,
    fontSize: TvLayout.bodyFontSize,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  list: { gap: Spacing.two },
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
  toggleRow: {
    paddingVertical: Spacing.half,
  },
  controlLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    flexShrink: 1,
    minWidth: 0,
  },
  controlValue: {
    flexShrink: 0,
  },
  controlValueTv: {
    width: "100%",
    flexShrink: 1,
  },
  prefToggleTv: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    minHeight: TvLayout.minFocusTarget,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
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
