import type { DuaCategoryId, DuaItem } from "@munib-tracker/shared/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { type ListRenderItem, StyleSheet, TextInput, View } from "react-native";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { ListIndexBadge } from "@/components/ui/list-index-badge";
import { PressableScale } from "@/components/ui/pressable-scale";
import { TvFlatList } from "@/components/ui/tv-flat-list";
import { Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { loadDuaItems } from "@/lib/content-loaders";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { useChevronForward } from "@/lib/rtl";
import { createDuaSearch } from "@/lib/search";
import { collectionPageSchema } from "@/lib/seo/structured-data";
import {
  useDuaFavoritesActions,
  useEnsureDuaFavoritesLoaded,
  useFavoriteDuaIds,
} from "@/stores/dua-favorites-store";

const VALID: DuaCategoryId[] = [
  "morning_evening",
  "sleep",
  "prayer",
  "forgiveness",
  "distress",
  "protection",
  "quranic",
  "food",
  "home",
  "travel",
  "family",
  "illness",
  "weather",
  "hajj",
  "purification",
  "social",
];

/** Expo Router may pass dynamic segments as `string | string[]` on deep links. */
function paramValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

/** Pre-render a static HTML page for each fixed dua category at web export time. */
export function generateStaticParams(): Array<{ category: string }> {
  return VALID.map((category) => ({ category }));
}

export default function DuaCategoryScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const tv = isTV();
  useEnsureDuaFavoritesLoaded();
  const favoriteIds = useFavoriteDuaIds();
  const { toggle } = useDuaFavoritesActions();
  const params = useLocalSearchParams<{ category: string | string[] }>();
  const categoryParam = paramValue(params.category);
  const isKnownCategory = VALID.includes(categoryParam as DuaCategoryId);
  const categoryId = (isKnownCategory ? categoryParam : "morning_evening") as DuaCategoryId;
  const [duaItems, setDuaItems] = useState<DuaItem[]>([]);
  const [corpusReady, setCorpusReady] = useState(false);
  useEffect(() => {
    let active = true;
    void loadDuaItems().then((items) => {
      if (!active) return;
      setDuaItems(items);
      setCorpusReady(true);
    });
    return () => {
      active = false;
    };
  }, []);
  const items = useMemo(
    () => duaItems.filter((item) => item.categoryId === categoryId),
    [categoryId, duaItems],
  );
  const { colors } = useThemeTokens();
  const [query, setQuery] = useState("");
  const searching = query.trim().length > 0;

  const duaIndex = useMemo(() => createDuaSearch(items), [items]);
  const indexById = useMemo(
    () => new Map(items.map((item, position) => [item.id, position + 1])),
    [items],
  );
  const filtered = useMemo(
    () => (searching ? duaIndex.search(query) : items),
    [duaIndex, items, query, searching],
  );

  // Stable, id-taking handlers so memoized rows keep their prop identity and
  // only the toggled row re-renders on a favorite change.
  const onOpen = useCallback(
    (id: string) => router.push({ pathname: "/dua/detail/[id]", params: { id } }),
    [router],
  );

  const keyExtractor = useCallback((item: DuaItem) => item.id, []);

  const renderItem = useCallback<ListRenderItem<DuaItem>>(
    ({ item }) => (
      <DuaRow
        item={item}
        index={indexById.get(item.id)}
        isFavorite={favoriteIds.includes(item.id)}
        onToggleFavorite={toggle}
        onOpen={onOpen}
      />
    ),
    [favoriteIds, indexById, toggle, onOpen],
  );

  const categoryName = t(`duaCat.${categoryId}`);
  const categoryDescription = `${categoryName} — authentic supplications with Arabic, transliteration, and meaning.`;
  const categoryBreadcrumbs = [
    { name: t("tabs.home"), path: "/" },
    { name: t("dua.title"), path: "/dua" },
    { name: categoryName, path: `/dua/${categoryId}` },
  ];

  const searchField = (
    <TextInput
      value={query}
      onChangeText={setQuery}
      placeholder={t("dua.searchInCategory")}
      placeholderTextColor={colors.mutedForeground}
      accessibilityLabel={t("dua.searchInCategory")}
      style={[
        styles.input,
        tv && styles.inputTv,
        { backgroundColor: colors.muted, color: colors.foreground },
      ]}
    />
  );

  const empty =
    searching && corpusReady ? (
      <EmptyState
        icon={{ ios: "magnifyingglass", android: "search", web: "search" }}
        title={t("dua.noResults")}
        description={t("search.noResultsDesc")}
      />
    ) : null;

  return (
    <ScreenLayout
      eyebrow={t("dua.categoryEyebrow")}
      title={t(`duaCat.${categoryId}`)}
      subtitle={
        !corpusReady
          ? undefined
          : searching
            ? t("dua.searchResultCount", { count: filtered.length })
            : t("dua.supplicationsCount", { count: items.length })
      }
      onBack={() => goBackOrReplace(router, "/")}
      // TV: ScreenLayout ScrollView + mapped rows — nested FlatList flex hosts
      // still collapse to zero height on Leanback even with minHeight:0 chains.
      scrollable={tv}
    >
      <Seo
        path={`/dua/${categoryId}`}
        title={categoryName}
        description={categoryDescription}
        index={isKnownCategory}
        breadcrumbs={categoryBreadcrumbs}
        jsonLd={[
          collectionPageSchema({
            path: `/dua/${categoryId}`,
            name: categoryName,
            description: categoryDescription,
            breadcrumbs: categoryBreadcrumbs,
          }),
        ]}
      />
      {/* The Card supplies the list chrome. No Stagger wrapper: its item view has
          no flex, which would break the FlatList's height chain on phone. */}
      <Card padding="three" style={tv ? undefined : styles.listCard}>
        {searchField}
        {tv ? (
          <View style={styles.tvList}>
            {filtered.length === 0
              ? empty
              : filtered.map((item, index) => (
                  <View key={item.id}>
                    {index > 0 ? <ListSeparator /> : null}
                    <DuaRow
                      item={item}
                      index={indexById.get(item.id)}
                      isFavorite={favoriteIds.includes(item.id)}
                      onToggleFavorite={toggle}
                      onOpen={onOpen}
                    />
                  </View>
                ))}
          </View>
        ) : (
          <View style={styles.listHost}>
            <TvFlatList
              style={styles.flatList}
              data={filtered}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              ItemSeparatorComponent={ListSeparator}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              initialNumToRender={12}
              maxToRenderPerBatch={8}
              windowSize={7}
              ListEmptyComponent={empty}
            />
          </View>
        )}
      </Card>
    </ScreenLayout>
  );
}

/** Spacer matching the previous `gap: Spacing.two` between rows. */
function ListSeparator() {
  return <View style={styles.separator} />;
}

const CHEVRON_SIZE = 14;
const FAVORITE_SIZE = 18;
const FAVORITE_HIT = 44;
const ROW_GAP = Spacing.two;

const DuaRow = memo(function DuaRow({
  item,
  index,
  isFavorite,
  onToggleFavorite,
  onOpen,
}: {
  item: DuaItem;
  index?: number;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpen: (id: string) => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const chevronForwardIcon = useChevronForward();
  const tv = isTV();

  const handleToggleFavorite = useCallback(
    () => onToggleFavorite(item.id),
    [onToggleFavorite, item.id],
  );
  const handleOpen = useCallback(() => onOpen(item.id), [onOpen, item.id]);

  return (
    // The favorite toggle is a sibling overlay, not nested inside the row's
    // Pressable — nesting a <button> inside another <button> is invalid HTML on
    // web (matches the ZikrRow pattern).
    <View style={styles.rowWrap}>
      <PressableScale
        haptic="light"
        accessibilityRole="button"
        accessibilityLabel={index != null ? `${index}. ${item.title}` : item.title}
        onPress={handleOpen}
        style={[styles.rowHeader, tv && styles.rowHeaderTv, { backgroundColor: colors.muted }]}
      >
        {index != null ? <ListIndexBadge index={index} /> : null}
        <View style={styles.body}>
          <ThemedText type="small" numberOfLines={2}>
            {item.title}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
            {item.transliteration ?? item.translation}
          </ThemedText>
        </View>
        <View style={styles.favoriteSlot} />
        <SymbolView
          name={chevronForwardIcon}
          size={CHEVRON_SIZE}
          tintColor={colors.mutedForeground}
        />
      </PressableScale>

      <IconButton
        name={
          isFavorite
            ? { ios: "star.fill", android: "star", web: "star" }
            : { ios: "star", android: "star_border", web: "star_border" }
        }
        size={FAVORITE_SIZE}
        tintColor={isFavorite ? tokens.status.warning.color : colors.mutedForeground}
        accessibilityLabel={isFavorite ? t("dua.unfavorite") : t("dua.favorite")}
        accessibilityState={{ selected: isFavorite }}
        haptic="selection"
        onPress={handleToggleFavorite}
        style={styles.favoriteButton}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  listCard: { flex: 1, minHeight: 0 },
  /** Bounded host so FlatList flex:1 resolves against a real viewport height. */
  listHost: { flex: 1, minHeight: 0 },
  flatList: { flex: 1 },
  tvList: { gap: 0 },
  input: {
    borderRadius: Radius.md,
    borderCurve: "continuous",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    marginBottom: Spacing.three,
    fontSize: 15,
  },
  inputTv: {
    minHeight: TvLayout.minFocusTarget,
    fontSize: TvLayout.bodyFontSize,
    paddingHorizontal: Spacing.four,
  },
  separator: { height: Spacing.two },
  rowWrap: {
    position: "relative",
  },
  rowHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: ROW_GAP,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  // Horizontal padding stays put — the favorite button's absolute `end` offset
  // below is computed against it. Only height/vertical padding grow for TV.
  rowHeaderTv: {
    minHeight: TvLayout.minFocusTarget,
    paddingVertical: Spacing.four,
    borderRadius: Radius.lg,
  },
  body: { flex: 1, gap: 2 },
  favoriteSlot: { width: FAVORITE_SIZE, height: FAVORITE_SIZE },
  favoriteButton: {
    position: "absolute",
    // Center over the row: PressableScale keeps the glyph on an inner view that
    // does not stretch when top/bottom are set, so pin to mid-height instead.
    top: "50%",
    marginTop: -(FAVORITE_HIT / 2),
    // Center the 44pt target over the reserved slot (slot sits just start-ward of the
    // chevron): slot end edge + half the slot, minus half the tap target.
    end: Spacing.three + CHEVRON_SIZE + ROW_GAP + FAVORITE_SIZE / 2 - FAVORITE_HIT / 2,
  },
});
