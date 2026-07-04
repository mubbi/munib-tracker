import { ZIKR_CATEGORY_IDS } from "@munib-tracker/shared/constants";
import type { ObligatoryPrayer, ZikrCategoryId, ZikrItem } from "@munib-tracker/shared/types";
import { isZikrCategoryId } from "@munib-tracker/shared/validators";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  type ListRenderItem,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ZikrRow } from "@/components/zikr/zikr-row";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { createZikrSearch } from "@/lib/search";
import { collectionPageSchema } from "@/lib/seo/structured-data";
import { zikrByCategory } from "@/lib/zikr";
import { useFavoriteZikrIds, usePreferencesActions } from "@/stores/preferences-store";

const OBLIGATORY_PRAYERS: ObligatoryPrayer[] = ["fajr", "dhuhr", "asr", "maghrib", "isha"];
type PrayerFilter = ObligatoryPrayer | "all";

/** Pre-render a static HTML page for each fixed zikr category at web export time. */
export function generateStaticParams(): Array<{ category: string }> {
  return ZIKR_CATEGORY_IDS.map((id) => ({ category: id }));
}

export default function ZikrCategoryScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const params = useLocalSearchParams<{ category: string }>();
  const favoriteIds = useFavoriteZikrIds();
  const { toggleFavorite } = usePreferencesActions();
  const [query, setQuery] = useState("");
  const searching = query.trim().length > 0;

  const isKnownCategory = isZikrCategoryId(params.category);
  const categoryId = (isKnownCategory ? params.category : "anytime") as ZikrCategoryId;
  const allItems = zikrByCategory(categoryId);

  // After-salah adhkar can be narrowed to a single fard prayer. An item with no
  // `prayers` tag is recited after every prayer, so it shows under each filter.
  const showPrayerFilter = categoryId === "after_prayer";
  const [prayerFilter, setPrayerFilter] = useState<PrayerFilter>("all");
  const items = useMemo(() => {
    if (!showPrayerFilter || prayerFilter === "all") return allItems;
    return allItems.filter((z) => !z.prayers?.length || z.prayers.includes(prayerFilter));
  }, [allItems, showPrayerFilter, prayerFilter]);

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

  const categoryName = t(`zikrCat.${categoryId}`);
  const categoryDescription = `${categoryName} — authentic supplications with Arabic, transliteration, and meaning.`;
  const categoryBreadcrumbs = [
    { name: t("tabs.home"), path: "/" },
    { name: t("zikr.title"), path: "/zikr" },
    { name: categoryName, path: `/zikr/${categoryId}` },
  ];

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
      <Seo
        path={`/zikr/${categoryId}`}
        title={categoryName}
        description={categoryDescription}
        index={isKnownCategory}
        breadcrumbs={categoryBreadcrumbs}
        jsonLd={[
          collectionPageSchema({
            path: `/zikr/${categoryId}`,
            name: categoryName,
            description: categoryDescription,
            breadcrumbs: categoryBreadcrumbs,
          }),
        ]}
      />
      {allItems.length === 0 ? (
        <EmptyState
          icon={{ ios: "heart", android: "favorite_border", web: "favorite_border" }}
          title={t("zikr.emptyTitle")}
          description={t("zikr.emptyDesc")}
        />
      ) : (
        <Card padding="three" style={styles.listCard}>
          {showPrayerFilter ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chips}
              style={styles.chipsRow}
            >
              {(["all", ...OBLIGATORY_PRAYERS] as PrayerFilter[]).map((prayer) => {
                const active = prayerFilter === prayer;
                return (
                  <PressableScale
                    key={prayer}
                    haptic="selection"
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    onPress={() => setPrayerFilter(prayer)}
                    style={[
                      styles.chip,
                      { backgroundColor: active ? colors.accent : colors.muted },
                    ]}
                  >
                    <ThemedText
                      type="small"
                      style={{ color: active ? colors.accentForeground : colors.foreground }}
                    >
                      {prayer === "all" ? t("zikr.allPrayers") : t(`prayers.${prayer}`)}
                    </ThemedText>
                  </PressableScale>
                );
              })}
            </ScrollView>
          ) : null}
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
  chipsRow: { flexGrow: 0, marginBottom: Spacing.three },
  chips: { gap: Spacing.two, paddingRight: Spacing.one },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 999,
    borderCurve: "continuous",
  },
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
