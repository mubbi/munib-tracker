import { useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  type FlatList,
  type LayoutChangeEvent,
  type ListRenderItem,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  StyleSheet,
  View,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { ReadingCard } from "@/components/content/reading-card";
import {
  SCRIPTURE_LIST_DETAIL_MAX_WIDTH,
  ScriptureReaderChrome,
  ScriptureReadingFilters,
  ScriptureReadingToolbar,
  scriptureListDetailStyles,
} from "@/components/content/scripture-reading-filters";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SavedNavCard } from "@/components/ui/saved-nav-card";
import { SearchField } from "@/components/ui/search-field";
import { SkeletonPlaceholder } from "@/components/ui/skeleton";
import { TvFlatList } from "@/components/ui/tv-flat-list";
import { TvScrollView } from "@/components/ui/tv-scroll-view";
import { TvUndoButton } from "@/components/ui/tv-undo-button";
import { Spacing } from "@/constants/theme";
import { useContentBottomInset } from "@/hooks/use-content-bottom-inset";
import { useContentCorpus } from "@/hooks/use-content-corpus";
import { useLargeScreenLayout } from "@/hooks/use-large-screen-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useUndoToast } from "@/hooks/use-undo-toast";
import { DUROOD_CORPUS, type loadDuroodItems } from "@/lib/content-loaders";
import { buildContentReportRef } from "@/lib/content-report-ref";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { TASBEEH_ICON } from "@/lib/quick-actions";
import { createDuroodSearch } from "@/lib/search";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { webPageSchema } from "@/lib/seo/structured-data";
import { useReadingDisplay } from "@/lib/settings/reading-display";
import {
  useDuroodFavoritesActions,
  useEnsureDuroodFavoritesLoaded,
  useFavoriteDuroodIds,
} from "@/stores/durood-favorites-store";

type DuroodItem = Awaited<ReturnType<typeof loadDuroodItems>>[number];

export default function DuroodsScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const locale = i18n.language?.split("-")[0] ?? "en";
  const { tokens } = useThemeTokens();
  const contentBottomInset = useContentBottomInset();
  const { isListDetail } = useLargeScreenLayout();
  const tv = isTV();
  const showSideFilters = isListDetail && !tv;
  useEnsureDuroodFavoritesLoaded();
  const favoriteIds = useFavoriteDuroodIds();
  const { toggle, restore } = useDuroodFavoritesActions();
  const undoToast = useUndoToast();
  // Saving is a plain toggle; un-saving offers Undo (never silent).
  const toggleSaved = useCallback(
    (id: string, saved: boolean) => {
      if (!saved) {
        toggle(id);
        return;
      }
      // Undo restores the saved position (B-30), not the end of the list.
      const position = favoriteIds.indexOf(id);
      void undoToast.run({
        do: () => toggle(id),
        undo: () => restore(id, position),
        messageKey: "duroods.removedToast",
      });
    },
    [favoriteIds, restore, toggle, undoToast],
  );
  const visibility = useReadingDisplay();

  const [query, setQuery] = useState("");
  const { items: duroodItems, ready: corpusReady } = useContentCorpus(DUROOD_CORPUS);
  const listRef = useRef<FlatList<DuroodItem>>(null);
  const [toolbarVisible, setToolbarVisible] = useState(false);
  const headerCardHeightRef = useRef(0);
  const readingProgress = useSharedValue(0);

  const index = useMemo(() => createDuroodSearch(duroodItems), [duroodItems]);
  const searching = query.trim().length > 0;
  const items = searching ? index.search(query) : duroodItems;
  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

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
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  const keyExtractor = useCallback((item: DuroodItem) => item.id, []);

  const renderItem = useCallback<ListRenderItem<DuroodItem>>(
    ({ item }) => (
      <View style={styles.item}>
        <ThemedText type="smallBold" style={styles.title}>
          {item.title}
        </ThemedText>
        <ReadingCard
          item={item}
          sourceHref="/duroods"
          isFavorite={favoriteSet.has(item.id)}
          onToggleFavorite={() => toggleSaved(item.id, favoriteSet.has(item.id))}
          contentRef={buildContentReportRef("durood", item.id, "/duroods", locale, {
            snapshot: {
              title: item.title,
              arabic: item.arabic,
              transliteration: item.transliteration,
              translation: item.translation,
              reference: item.reference,
            },
          })}
        />
        <Button
          label={t("duroods.openInTasbeeh")}
          icon={TASBEEH_ICON}
          variant="secondary"
          onPress={() =>
            router.push({
              pathname: "/tasbeeh/durood/[id]",
              params: { id: item.id },
            })
          }
        />
      </View>
    ),
    [favoriteSet, locale, router, t, toggleSaved],
  );

  const savedCard = useMemo(
    () => (
      <SavedNavCard
        title={t("duroods.favorites")}
        viewLabel={t("duroods.favorites")}
        count={favoriteIds.length > 0 ? favoriteIds.length : undefined}
        headerIcon={{ ios: "bookmark.fill", android: "bookmark", web: "bookmark" }}
        rowIcon={{ ios: "bookmark.fill", android: "bookmark", web: "bookmark" }}
        onPress={() => router.push("/duroods/favorites")}
      />
    ),
    [favoriteIds.length, router, t],
  );

  const listHeader = useMemo(
    () => (
      <View style={styles.listHeader} onLayout={onHeaderCardLayout}>
        {/* Wide web / tablets: saved duroods live in the aside instead. */}
        {showSideFilters ? null : savedCard}
        <SearchField
          value={query}
          onChangeText={setQuery}
          placeholder={t("duroods.searchPlaceholder")}
        />
        {!showSideFilters ? <ScriptureReadingFilters /> : null}
      </View>
    ),
    [savedCard, showSideFilters, onHeaderCardLayout, query, t],
  );

  return (
    <ScreenLayout
      eyebrow={t("duroods.eyebrow")}
      title={t("duroods.title")}
      subtitle={t("duroods.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
      scrollable={false}
      maxContentWidth={showSideFilters ? SCRIPTURE_LIST_DETAIL_MAX_WIDTH : undefined}
      headerAccessory={
        showSideFilters ? undefined : (
          <ScriptureReadingToolbar
            visible={toolbarVisible}
            progress={readingProgress}
            onBackToTop={scrollToTop}
          />
        )
      }
    >
      {/* TV: toasts take no focus — the Undo lives on the page (B-04). */}
      <TvUndoButton controller={undoToast} />
      <Seo
        path="/duroods"
        breadcrumbs={[
          { name: t("tabs.home"), path: "/" },
          { name: t("duroods.title"), path: "/duroods" },
        ]}
        jsonLd={[
          webPageSchema({
            path: "/duroods",
            name: "Duroods & Salawat",
            description:
              "Recite Durood and Salawat — sending blessings upon the Prophet Muhammad ﷺ.",
            type: "CollectionPage",
            breadcrumbs: [
              { name: t("tabs.home"), path: "/" },
              { name: t("duroods.title"), path: "/duroods" },
            ],
          }),
        ]}
      />
      <View
        style={
          showSideFilters
            ? scriptureListDetailStyles.listDetailRoot
            : scriptureListDetailStyles.readerRoot
        }
      >
        <TvFlatList
          ref={listRef}
          style={[
            styles.flatList,
            showSideFilters ? scriptureListDetailStyles.listDetailPrimary : null,
          ]}
          contentContainerStyle={[styles.flatListContent, { paddingBottom: contentBottomInset }]}
          data={corpusReady ? items : []}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          extraData={visibility}
          ItemSeparatorComponent={ListSeparator}
          ListHeaderComponent={listHeader}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          initialNumToRender={6}
          maxToRenderPerBatch={4}
          windowSize={5}
          onScroll={onListScroll}
          scrollEventThrottle={16}
          ListEmptyComponent={
            corpusReady ? (
              <EmptyState
                icon={{ ios: "magnifyingglass", android: "search", web: "search" }}
                title={t("duroods.noResults")}
              />
            ) : (
              <SkeletonPlaceholder
                preset="card"
                count={2}
                accessibilityLabel={t("duroods.loading")}
              />
            )
          }
        />
        {showSideFilters ? (
          <View
            style={[
              scriptureListDetailStyles.listDetailSecondary,
              tv && scriptureListDetailStyles.listDetailSecondaryTv,
              { borderStartColor: tokens.hairline },
            ]}
          >
            <ScriptureReaderChrome toolbarVisible={toolbarVisible} onBackToTop={scrollToTop} />
            <TvScrollView
              style={scriptureListDetailStyles.listDetailSecondaryScroll}
              contentContainerStyle={[
                scriptureListDetailStyles.listDetailSecondaryContent,
                { paddingBottom: contentBottomInset },
              ]}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {savedCard}
              <ScriptureReadingFilters />
            </TvScrollView>
          </View>
        ) : null}
      </View>
    </ScreenLayout>
  );
}

function ListSeparator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  flatList: { flex: 1, minHeight: 0 },
  flatListContent: { gap: 0 },
  listHeader: { gap: Spacing.four, marginBottom: Spacing.four },
  item: { gap: Spacing.two },
  title: { marginStart: Spacing.one },
  separator: { height: Spacing.four },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/duroods");
