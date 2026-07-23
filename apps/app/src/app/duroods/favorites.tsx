import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { TvFlatList } from "@/components/ui/tv-flat-list";
import { TvScrollView } from "@/components/ui/tv-scroll-view";
import { Spacing } from "@/constants/theme";
import { useContentBottomInset } from "@/hooks/use-content-bottom-inset";
import { useLargeScreenLayout } from "@/hooks/use-large-screen-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { loadDuroodItems } from "@/lib/content-loaders";
import { tTv } from "@/lib/i18n/t-tv";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { TASBEEH_ICON } from "@/lib/quick-actions";
import {
  useDuroodFavoritesActions,
  useEnsureDuroodFavoritesLoaded,
  useFavoriteDuroodIds,
} from "@/stores/durood-favorites-store";
import { useReadingTextVisibility } from "@/stores/reading-text-visibility-store";

type DuroodItem = Awaited<ReturnType<typeof loadDuroodItems>>[number];

export default function DuroodFavoritesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  const contentBottomInset = useContentBottomInset();
  const { isListDetail } = useLargeScreenLayout();
  const tv = isTV();
  const showSideFilters = isListDetail && !tv;
  useEnsureDuroodFavoritesLoaded();
  const favoriteIds = useFavoriteDuroodIds();
  const { toggle } = useDuroodFavoritesActions();
  const visibility = useReadingTextVisibility();
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

  const byId = useMemo(() => new Map(duroodItems.map((item) => [item.id, item])), [duroodItems]);
  const items = favoriteIds
    .map((id) => byId.get(id))
    .filter((item): item is DuroodItem => item != null);

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
          isFavorite
          onToggleFavorite={() => toggle(item.id)}
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
    [router, t, toggle],
  );

  const empty =
    favoriteIds.length === 0 || (corpusReady && items.length === 0) ? (
      <EmptyState
        icon={{ ios: "star", android: "star_border", web: "star_border" }}
        title={t("duroods.favEmptyTitle")}
        description={tTv(t, "duroods.favEmptyDesc", "duroods.favEmptyDescTv")}
        actionLabel={t("duroods.title")}
        onAction={() => router.replace("/duroods")}
      />
    ) : null;

  const hasItems = corpusReady && items.length > 0;

  return (
    <ScreenLayout
      eyebrow={t("duroods.eyebrow")}
      title={t("duroods.favorites")}
      subtitle={t("duroods.favSubtitle")}
      onBack={() => goBackOrReplace(router, "/duroods")}
      scrollable={!hasItems}
      maxContentWidth={hasItems && showSideFilters ? SCRIPTURE_LIST_DETAIL_MAX_WIDTH : undefined}
      headerAccessory={
        hasItems && !showSideFilters ? (
          <ScriptureReadingToolbar
            visible={toolbarVisible}
            progress={readingProgress}
            onBackToTop={scrollToTop}
          />
        ) : undefined
      }
    >
      <Seo path="/duroods/favorites" />
      {empty && !hasItems ? (
        empty
      ) : hasItems ? (
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
            data={items}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            extraData={visibility}
            ItemSeparatorComponent={ListSeparator}
            ListHeaderComponent={
              !showSideFilters ? (
                <View onLayout={onHeaderCardLayout} style={styles.listHeader}>
                  <ScriptureReadingFilters />
                </View>
              ) : (
                <View onLayout={onHeaderCardLayout} />
              )
            }
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            onScroll={onListScroll}
            scrollEventThrottle={16}
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
                <ScriptureReadingFilters />
              </TvScrollView>
            </View>
          ) : null}
        </View>
      ) : null}
    </ScreenLayout>
  );
}

function ListSeparator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  flatList: { flex: 1, minHeight: 0 },
  flatListContent: {},
  listHeader: { marginBottom: Spacing.four },
  item: { gap: Spacing.two },
  title: { marginStart: Spacing.one },
  separator: { height: Spacing.four },
});
