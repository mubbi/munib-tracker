import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  type LayoutChangeEvent,
  type ListRenderItem,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  TextInput,
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
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SavedNavCard } from "@/components/ui/saved-nav-card";
import { Radius, Spacing } from "@/constants/theme";
import { useContentBottomInset } from "@/hooks/use-content-bottom-inset";
import { useLargeScreenLayout } from "@/hooks/use-large-screen-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { loadDuroodItems } from "@/lib/content-loaders";
import { buildContentReportRef } from "@/lib/content-report-ref";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { TASBEEH_ICON } from "@/lib/quick-actions";
import { createDuroodSearch } from "@/lib/search";
import { webPageSchema } from "@/lib/seo/structured-data";
import {
  useDuroodFavoritesActions,
  useEnsureDuroodFavoritesLoaded,
  useFavoriteDuroodIds,
} from "@/stores/durood-favorites-store";
import { useReadingTextVisibility } from "@/stores/reading-text-visibility-store";

type DuroodItem = Awaited<ReturnType<typeof loadDuroodItems>>[number];

export default function DuroodsScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const locale = i18n.language?.split("-")[0] ?? "en";
  const { colors, tokens } = useThemeTokens();
  const contentBottomInset = useContentBottomInset();
  const { isListDetail } = useLargeScreenLayout();
  const tv = isTV();
  const showSideFilters = isListDetail && !tv;
  useEnsureDuroodFavoritesLoaded();
  const favoriteIds = useFavoriteDuroodIds();
  const { toggle } = useDuroodFavoritesActions();
  const visibility = useReadingTextVisibility();

  const [query, setQuery] = useState("");
  const [duroodItems, setDuroodItems] = useState<DuroodItem[]>([]);
  const [corpusReady, setCorpusReady] = useState(false);
  const listRef = useRef<FlatList<DuroodItem>>(null);
  const [toolbarVisible, setToolbarVisible] = useState(false);
  const headerCardHeightRef = useRef(0);
  const readingProgress = useSharedValue(0);

  useEffect(() => {
    void loadDuroodItems().then((items) => {
      setDuroodItems(items);
      setCorpusReady(true);
    });
  }, []);

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
          onToggleFavorite={() => toggle(item.id)}
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
          fullWidth
          onPress={() =>
            router.push({
              pathname: "/tasbeeh/durood/[id]",
              params: { id: item.id },
            })
          }
        />
      </View>
    ),
    [favoriteSet, locale, router, t, toggle],
  );

  const listHeader = useMemo(
    () => (
      <View style={styles.listHeader} onLayout={onHeaderCardLayout}>
        <SavedNavCard
          title={t("duroods.favorites")}
          viewLabel={t("duroods.favorites")}
          count={favoriteIds.length > 0 ? favoriteIds.length : undefined}
          headerIcon={{ ios: "star.fill", android: "star", web: "star" }}
          rowIcon={{ ios: "star.fill", android: "star", web: "star" }}
          onPress={() => router.push("/duroods/favorites")}
        />
        <Card padding="three">
          <View style={[styles.searchBox, { backgroundColor: colors.muted }]}>
            <SymbolView
              name={{ ios: "magnifyingglass", android: "search", web: "search" }}
              size={17}
              tintColor={colors.mutedForeground}
            />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={t("duroods.searchPlaceholder")}
              placeholderTextColor={colors.mutedForeground}
              accessibilityLabel={t("duroods.searchPlaceholder")}
              autoCorrect={false}
              returnKeyType="search"
              style={[styles.input, { color: colors.foreground }]}
            />
          </View>
        </Card>
        {!showSideFilters ? <ScriptureReadingFilters /> : null}
      </View>
    ),
    [
      colors.foreground,
      colors.muted,
      colors.mutedForeground,
      favoriteIds.length,
      showSideFilters,
      onHeaderCardLayout,
      query,
      router,
      t,
    ],
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
        <FlatList
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
            ) : null
          }
        />
        {showSideFilters ? (
          <View
            style={[
              scriptureListDetailStyles.listDetailSecondary,
              { borderStartColor: tokens.hairline },
            ]}
          >
            <ScriptureReaderChrome toolbarVisible={toolbarVisible} onBackToTop={scrollToTop} />
            <ScrollView
              style={scriptureListDetailStyles.listDetailSecondaryScroll}
              contentContainerStyle={[
                scriptureListDetailStyles.listDetailSecondaryContent,
                { paddingBottom: contentBottomInset },
              ]}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <ScriptureReadingFilters />
            </ScrollView>
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
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.three,
    fontSize: 15,
  },
});
