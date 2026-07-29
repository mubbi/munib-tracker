import { ZIKR_CATEGORY_IDS } from "@munib-tracker/shared/constants";
import type { AfterSalahPrayer, ZikrCategoryId, ZikrItem } from "@munib-tracker/shared/types";
import { isAfterSalahPrayer, isZikrCategoryId } from "@munib-tracker/shared/validators";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { type ListRenderItem, type ScrollView, StyleSheet, TextInput, View } from "react-native";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ProgressBar } from "@/components/ui/progress-bar";
import { TvFlatList } from "@/components/ui/tv-flat-list";
import { TvFocusGuide } from "@/components/ui/tv-focus-guide";
import { TvScrollView } from "@/components/ui/tv-scroll-view";
import { ZikrRow } from "@/components/zikr/zikr-row";
import { Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useScrollToActiveHorizontal } from "@/hooks/use-scroll-to-active";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  afterSalahApplicablePrayers,
  afterSalahItemProgress,
  afterSalahProgressForPrayer,
  getZikrCountFromMap,
  isZikrItemDone,
} from "@/lib/after-salah-adhkar-progress";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { createZikrSearch } from "@/lib/search";
import { collectionPageSchema } from "@/lib/seo/structured-data";
import { ensureZikrCorpus, zikrByCategory } from "@/lib/zikr";
import { pushZikrDetail } from "@/lib/zikr-quran";
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
  const tv = isTV();
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
  // Live Activity / notification deep links (`?prayer=asr`) can resolve after the
  // first paint, or update while this screen is already mounted.
  const linkedPrayer = useMemo((): AfterSalahPrayer | null => {
    if (!showPrayerFilter) return null;
    const raw = paramValue(params.prayer);
    return raw && isAfterSalahPrayer(raw) ? raw : null;
  }, [showPrayerFilter, params.prayer]);
  const [prayerFilter, setPrayerFilter] = useState<PrayerFilter>(() => linkedPrayer ?? "all");
  useEffect(() => {
    if (linkedPrayer) setPrayerFilter(linkedPrayer);
  }, [linkedPrayer]);

  const chipsScrollRef = useRef<ScrollView>(null);
  // Hold null until the chip bar mounts so deep-linked Maghrib/Witr still scroll
  // into view after the corpus finishes loading.
  const activePrayerChip = showPrayerFilter && corpusReady ? prayerFilter : null;
  const { register: registerChip, onScroll: onChipsScroll } = useScrollToActiveHorizontal(
    chipsScrollRef,
    activePrayerChip,
  );

  const items = useMemo(() => {
    if (!showPrayerFilter || prayerFilter === "all") return allItems;
    // Filter the loaded category list so deep-link prayer switches share one
    // corpus snapshot with `allItems` (Witr keeps only its tagged adhkar).
    return allItems.filter((item) => afterSalahApplicablePrayers(item).includes(prayerFilter));
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
      pushZikrDetail(
        router,
        id,
        showPrayerFilter && prayerFilter !== "all" ? { prayer: prayerFilter } : undefined,
      ),
    [router, showPrayerFilter, prayerFilter],
  );

  const keyExtractor = useCallback((item: ZikrItem) => item.id, []);

  const renderZikrRow = useCallback(
    (item: ZikrItem) => {
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

  const renderItem = useCallback<ListRenderItem<ZikrItem>>(
    ({ item }) => renderZikrRow(item),
    [renderZikrRow],
  );

  const categoryName = t(`zikrCat.${categoryId}`);
  const categoryDescription = `${categoryName} — authentic supplications with Arabic, transliteration, and meaning.`;
  const categoryBreadcrumbs = [
    { name: t("tabs.home"), path: "/" },
    { name: t("zikr.title"), path: "/zikr" },
    { name: categoryName, path: `/zikr/${categoryId}` },
  ];

  const empty =
    searching && corpusReady ? (
      <EmptyState
        icon={{ ios: "magnifyingglass", android: "search", web: "search" }}
        title={t("zikr.noResults")}
        description={t("search.noResultsDesc")}
      />
    ) : null;

  const listChrome = (
    <>
      {showPrayerFilter ? (
        <TvFocusGuide trapFocusUp trapFocusDown>
          <TvScrollView
            ref={chipsScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chips}
            style={styles.chipsRow}
            onScroll={onChipsScroll}
            scrollEventThrottle={16}
          >
            {(["all", ...AFTER_SALAH_PRAYERS] as PrayerFilter[]).map((prayer) => {
              const active = prayerFilter === prayer;
              return (
                <PressableScale
                  key={prayer}
                  ref={registerChip(prayer)}
                  haptic="selection"
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  onPress={() => setPrayerFilter(prayer)}
                  style={[
                    styles.chip,
                    tv && styles.chipTv,
                    { backgroundColor: active ? colors.accent : colors.muted },
                  ]}
                >
                  <ThemedText
                    type="small"
                    style={{
                      color: active ? colors.accentForeground : colors.foreground,
                      fontSize: tv ? TvLayout.bodyFontSize : undefined,
                    }}
                  >
                    {prayer === "all" ? t("zikr.allPrayers") : t(`prayers.${prayer}`)}
                  </ThemedText>
                </PressableScale>
              );
            })}
          </TvScrollView>
        </TvFocusGuide>
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
            value={prayerProgress.total > 0 ? prayerProgress.completed / prayerProgress.total : 0}
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
        style={[
          styles.input,
          tv && styles.inputTv,
          { backgroundColor: colors.muted, color: colors.foreground },
        ]}
      />
    </>
  );

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
      // TV: ScreenLayout ScrollView + mapped rows — nested FlatList flex hosts
      // still collapse to zero height on Leanback even with minHeight:0 chains.
      scrollable={tv}
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
        <Card padding="three" style={tv ? undefined : styles.listCard}>
          {listChrome}
          {tv ? (
            <View style={styles.tvList}>
              {filtered.length === 0
                ? empty
                : filtered.map((item, index) => (
                    <View key={item.id}>
                      {index > 0 ? <ListSeparator /> : null}
                      {renderZikrRow(item)}
                    </View>
                  ))}
            </View>
          ) : (
            <View style={styles.listHost}>
              <TvFlatList
                // Remount when the deep-linked salah tab arrives/changes — otherwise
                // removeClippedSubviews + a late `?prayer=` update can leave a blank list
                // until the user manually switches chips.
                key={showPrayerFilter ? `after-salah-${prayerFilter}` : categoryId}
                style={styles.flatList}
                data={filtered}
                extraData={prayerFilter}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                ItemSeparatorComponent={ListSeparator}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                initialNumToRender={12}
                maxToRenderPerBatch={8}
                windowSize={7}
                removeClippedSubviews={false}
                ListEmptyComponent={empty}
              />
            </View>
          )}
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
  listCard: { flex: 1, minHeight: 0 },
  listHost: { flex: 1, minHeight: 0 },
  flatList: { flex: 1 },
  tvList: { gap: 0 },
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
  chipTv: {
    minHeight: TvLayout.chipMinHeight,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    justifyContent: "center",
  },
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
});
