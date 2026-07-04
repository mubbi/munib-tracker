import type { ZikrCategoryId, ZikrItem } from "@munib-tracker/shared/types";
import { isZikrCategoryId } from "@munib-tracker/shared/validators";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, type ListRenderItem, StyleSheet, TextInput, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ZikrRow } from "@/components/zikr/zikr-row";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { createZikrSearch } from "@/lib/search";
import { zikrByCategory } from "@/lib/zikr";
import { useFavoriteZikrIds, usePreferencesActions } from "@/stores/preferences-store";

export default function ZikrCategoryScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const params = useLocalSearchParams<{ category: string }>();
  const favoriteIds = useFavoriteZikrIds();
  const { toggleFavorite } = usePreferencesActions();
  const [query, setQuery] = useState("");
  const searching = query.trim().length > 0;

  const categoryId = (
    isZikrCategoryId(params.category) ? params.category : "anytime"
  ) as ZikrCategoryId;
  const items = zikrByCategory(categoryId);

  const zikrIndex = useMemo(() => createZikrSearch(items), [items]);
  const indexById = useMemo(
    () => new Map(items.map((item, position) => [item.id, position + 1])),
    [items],
  );
  const filtered = useMemo(
    () => (searching ? zikrIndex.search(query) : items),
    [items, query, searching, zikrIndex],
  );

  const onOpen = useCallback(
    (id: string) => router.push({ pathname: "/zikr/detail/[id]", params: { id } }),
    [router],
  );

  const keyExtractor = useCallback((item: ZikrItem) => item.id, []);

  const renderItem = useCallback<ListRenderItem<ZikrItem>>(
    ({ item }) => (
      <ZikrRow
        item={item}
        index={indexById.get(item.id)}
        isFavorite={favoriteIds.includes(item.id)}
        onToggleFavorite={() => toggleFavorite(item.id)}
        onPress={() => onOpen(item.id)}
      />
    ),
    [favoriteIds, indexById, toggleFavorite, onOpen],
  );

  return (
    <ScreenLayout
      eyebrow={t("zikr.categoryEyebrow")}
      title={t(`zikrCat.${categoryId}`)}
      subtitle={
        searching
          ? t("zikr.searchResultCount", { count: filtered.length })
          : t("zikr.adhkarCount", { count: items.length })
      }
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
      scrollable={false}
    >
      {items.length === 0 ? (
        <EmptyState
          icon={{ ios: "heart", android: "favorite_border", web: "favorite_border" }}
          title={t("zikr.emptyTitle")}
          description={t("zikr.emptyDesc")}
        />
      ) : (
        <Card padding="three" style={styles.listCard}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t("zikr.searchInCategory")}
            placeholderTextColor={colors.mutedForeground}
            accessibilityLabel={t("zikr.searchInCategory")}
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
                  title={t("zikr.noResults")}
                  description={t("search.noResultsDesc")}
                />
              ) : null
            }
          />
        </Card>
      )}
    </ScreenLayout>
  );
}

/** Spacer matching the previous `gap: Spacing.two` between rows. */
function ListSeparator() {
  return <View style={styles.separator} />;
}

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
});
