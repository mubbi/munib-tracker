import { ZIKR_CATEGORY_IDS } from "@munib-tracker/shared/constants";
import type { AfterSalahPrayer, ZikrCategoryId, ZikrItem } from "@munib-tracker/shared/types";
import { isAfterSalahPrayer, isZikrCategoryId } from "@munib-tracker/shared/validators";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import { ProgressBar } from "@/components/ui/progress-bar";
import { ZikrRow } from "@/components/zikr/zikr-row";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  afterSalahItemProgress,
  afterSalahItemsForPrayer,
  afterSalahProgressForPrayer,
  getZikrCountFromMap,
  isZikrItemDone,
} from "@/lib/after-salah-adhkar-progress";
import { goBackOrReplace } from "@/lib/navigation";
import { createZikrSearch } from "@/lib/search";
import { collectionPageSchema } from "@/lib/seo/structured-data";
import { ensureZikrCorpus, zikrByCategory } from "@/lib/zikr";
import { useFavoriteZikrIds, usePreferencesActions } from "@/stores/preferences-store";
import { useZikrCounts } from "@/stores/tracker-store";

// After-salah adhkar tabs: the five fard prayers plus Witr (its own adhkar).
const AFTER_SALAH_PRAYERS: AfterSalahPrayer[] = ["fajr", "dhuhr", "asr", "maghrib", "isha", "witr"];
type PrayerFilter = AfterSalahPrayer | "all";

/** Expo Router may pass dynamic segments as `string | string[]` on deep links. */
function paramValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

/** Pre-render a static HTML page for each fixed zikr category at web export time. */
export function generateStaticParams(): Array<{ category: string }> {
  return ZIKR_CATEGORY_IDS.map((id) => ({ category: id }));
}

export default function ZikrCategoryScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const params = useLocalSearchParams<{
    category: string | string[];
    prayer?: string | string[];
  }>();
  const favoriteIds = useFavoriteZikrIds();
  const { toggleFavorite } = usePreferencesActions();
  const zikrCounts = useZikrCounts();
  const [query, setQuery] = useState("");
  const searching = query.trim().length > 0;
  // Cold opens (notification / deep link) never visit /zikr first, so the corpus
  // must be warmed here — zikrByCategory is sync and returns [] until ready.
  const [corpusReady, setCorpusReady] = useState(false);
  useEffect(() => {
    let active = true;
    void ensureZikrCorpus().then(() => {
      if (active) setCorpusReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const categoryParam = paramValue(params.category);
  const isKnownCategory = isZikrCategoryId(categoryParam ?? "");
  const categoryId = (isKnownCategory ? categoryParam : "anytime") as ZikrCategoryId;
  const allItems = corpusReady ? zikrByCategory(categoryId) : [];

  // After-salah adhkar can be narrowed to a single fard prayer. An item with no
  // `prayers` tag is recited after every prayer, so it shows under each filter.
  const showPrayerFilter = categoryId === "after_prayer";
  const [prayerFilter, setPrayerFilter] = useState<PrayerFilter>(() => {
    const raw = paramValue(params.prayer);
    return raw && isAfterSalahPrayer(raw) ? raw : "all";
  });
  // Notification deep-links can land on this screen while it is already mounted.
  useEffect(() => {
    if (!showPrayerFilter) return;
    const raw = paramValue(params.prayer);
    if (raw && isAfterSalahPrayer(raw)) setPrayerFilter(raw);
  }, [showPrayerFilter, params.prayer]);
  const items = useMemo(() => {
    if (!showPrayerFilter || prayerFilter === "all") return allItems;
    // Universal after-salah adhkar surface under every fard prayer but not Witr,
    // whose tab holds only its own adhkar — mirror afterSalahApplicablePrayers.
    return afterSalahItemsForPrayer(prayerFilter);
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

  const prayerProgress = useMemo(() => {
    if (!showPrayerFilter || prayerFilter === "all") return null;
    return afterSalahProgressForPrayer(prayerFilter, zikrCounts);
  }, [showPrayerFilter, prayerFilter, zikrCounts]);

  const onOpen = useCallback(
    (id: string) =>
      router.push({
        pathname: "/zikr/detail/[id]",
        params: showPrayerFilter && prayerFilter !== "all" ? { id, prayer: prayerFilter } : { id },
      }),
    [router, showPrayerFilter, prayerFilter],
  );

  const keyExtractor = useCallback((item: ZikrItem) => item.id, []);

  const renderItem = useCallback<ListRenderItem<ZikrItem>>(
    ({ item }) => {
      let completed = false;
      let progressLabel: string | undefined;

      if (showPrayerFilter) {
        if (prayerFilter === "all") {
          const slot = afterSalahItemProgress(item, zikrCounts);
          completed = slot.completed >= slot.total;
          progressLabel = `${slot.completed}/${slot.total}`;
        } else {
          const count = getZikrCountFromMap(zikrCounts, item.id, prayerFilter);
          completed = isZikrItemDone(count, item.targetCount);
          progressLabel = completed
            ? undefined
            : item.targetCount
              ? `${count}/${item.targetCount}`
              : undefined;
        }
      }

      return (
        <ZikrRow
          item={item}
          index={indexById.get(item.id)}
          isFavorite={favoriteIds.includes(item.id)}
          onToggleFavorite={toggleFavorite}
          onPress={onOpen}
          completed={showPrayerFilter ? completed : undefined}
          progressLabel={showPrayerFilter ? progressLabel : undefined}
        />
      );
    },
    [favoriteIds, indexById, onOpen, prayerFilter, showPrayerFilter, toggleFavorite, zikrCounts],
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
        !corpusReady
          ? undefined
          : searching
            ? t("zikr.searchResultCount", { count: filtered.length })
            : t("zikr.adhkarCount", { count: items.length })
      }
      onBack={() => goBackOrReplace(router, "/")}
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
      {!corpusReady ? null : allItems.length === 0 ? (
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
              {(["all", ...AFTER_SALAH_PRAYERS] as PrayerFilter[]).map((prayer) => {
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
          {prayerProgress ? (
            <View style={styles.progressBlock}>
              <View style={styles.progressHeader}>
                <ThemedText type="smallBold">
                  {t("zikr.afterSalahTodayForPrayer", { prayer: t(`prayers.${prayerFilter}`) })}
                </ThemedText>
                <ThemedText type="caption" themeColor="mutedForeground">
                  {t("zikr.afterSalahProgress", {
                    completed: prayerProgress.completed,
                    total: prayerProgress.total,
                  })}
                </ThemedText>
              </View>
              <ProgressBar
                value={
                  prayerProgress.total > 0 ? prayerProgress.completed / prayerProgress.total : 0
                }
                height={4}
              />
            </View>
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
            initialNumToRender={12}
            maxToRenderPerBatch={8}
            windowSize={7}
            removeClippedSubviews
            ListEmptyComponent={
              searching && corpusReady ? (
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
  chips: { gap: Spacing.two, paddingEnd: Spacing.one },
  progressBlock: {
    marginBottom: Spacing.three,
    gap: Spacing.two,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: Spacing.two,
  },
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
