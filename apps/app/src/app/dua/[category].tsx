import { duasByCategory } from "@munib-tracker/shared/content";
import type { DuaCategoryId, DuaItem } from "@munib-tracker/shared/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { memo, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, type ListRenderItem, StyleSheet, TextInput, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { ListIndexBadge } from "@/components/ui/list-index-badge";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { createDuaSearch } from "@/lib/search";
import {
  useDuaFavoritesActions,
  useEnsureDuaFavoritesLoaded,
  useFavoriteDuaIds,
} from "@/stores/dua-favorites-store";

const VALID: DuaCategoryId[] = ["sunnah", "quranic", "daily"];

export default function DuaCategoryScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  useEnsureDuaFavoritesLoaded();
  const favoriteIds = useFavoriteDuaIds();
  const { toggle } = useDuaFavoritesActions();
  const params = useLocalSearchParams<{ category: string }>();
  const categoryId = (
    VALID.includes(params.category as DuaCategoryId) ? params.category : "daily"
  ) as DuaCategoryId;
  const items = duasByCategory(categoryId);
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

  return (
    <ScreenLayout
      eyebrow={t("dua.categoryEyebrow")}
      title={t(`duaCat.${categoryId}`)}
      subtitle={
        searching
          ? t("dua.searchResultCount", { count: filtered.length })
          : t("dua.supplicationsCount", { count: items.length })
      }
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
      scrollable={false}
    >
      {/* The Card supplies the list chrome; the FlatList scrolls inside it and
          virtualizes rows (ScreenLayout is non-scrolling here). No Stagger wrapper:
          its item view has no flex, which would break the FlatList's height chain. */}
      <Card padding="three" style={styles.listCard}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t("dua.searchInCategory")}
          placeholderTextColor={colors.mutedForeground}
          accessibilityLabel={t("dua.searchInCategory")}
          style={[styles.input, { backgroundColor: colors.muted, color: colors.foreground }]}
        />
        <FlatList
          style={styles.flatList}
          data={filtered}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ItemSeparatorComponent={ListSeparator}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            searching ? (
              <EmptyState
                icon={{ ios: "magnifyingglass", android: "search", web: "search" }}
                title={t("dua.noResults")}
                description={t("search.noResultsDesc")}
              />
            ) : null
          }
        />
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
        style={[styles.rowHeader, { backgroundColor: colors.muted }]}
      >
        {index != null ? <ListIndexBadge index={index} /> : null}
        <View style={styles.body}>
          <ThemedText type="small" numberOfLines={1}>
            {item.title}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
            {item.transliteration}
          </ThemedText>
        </View>
        <View style={styles.favoriteSlot} />
        <SymbolView
          name={{ ios: "chevron.right", android: "chevron_right", web: "chevron_right" }}
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
  listCard: { flex: 1 },
  flatList: { flex: 1 },
  input: {
    borderRadius: Radius.md,
    borderCurve: "continuous",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    marginBottom: Spacing.three,
    fontSize: 15,
  },
  separator: { height: Spacing.two },
  rowWrap: {
    position: "relative",
  },
  rowHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  body: { flex: 1, gap: 2 },
  favoriteSlot: { width: FAVORITE_SIZE, height: FAVORITE_SIZE },
  favoriteButton: {
    position: "absolute",
    top: 7,
    right: Spacing.three + CHEVRON_SIZE + Spacing.two + FAVORITE_SIZE / 2 - 22,
  },
});
