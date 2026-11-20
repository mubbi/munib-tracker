import { ZIKR_CATEGORY_IDS } from "@munib-tracker/shared/constants";
import type { ZikrItem } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, useWindowDimensions, View } from "react-native";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { NavRow } from "@/components/ui/nav-row";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { SavedNavCard } from "@/components/ui/saved-nav-card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { ZikrRow } from "@/components/zikr/zikr-row";
import { Radius, Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { TvLayout } from "@/constants/tv-layout";
import { useAdhkarClock } from "@/hooks/use-adhkar-clock";
import { useAdhkarDayCounts } from "@/hooks/use-adhkar-day-counts";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { createZikrSearch } from "@/lib/search";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { collectionPageSchema } from "@/lib/seo/structured-data";
import { ensureZikrCorpus, zikrByCategory, zikrCategories } from "@/lib/zikr";
import { zikrCategoryBadge, zikrListRowProgress } from "@/lib/zikr-list-progress";
import { pushZikrDetail } from "@/lib/zikr-quran";
import { useFavoriteZikrIds } from "@/stores/preferences-store";

export default function ZikrHomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const tv = isTV();
  const { width } = useWindowDimensions();
  // Wide web / tablets: search beside saved + My adhkar, categories in a grid.
  const wide = !tv && width >= 768;
  const favoriteIds = useFavoriteZikrIds();
  // Badges follow the adhkar day (Fajr → Fajr), like the sessions that log them.
  const { date: adhkarDate } = useAdhkarClock();
  const zikrCounts = useAdhkarDayCounts(adhkarDate).counts;
  const [zikrReady, setZikrReady] = useState(false);
  const [zikrItems, setZikrItems] = useState<ZikrItem[]>([]);
  const categories = zikrReady ? zikrCategories() : [];
  const [query, setQuery] = useState("");
  const searching = query.trim().length > 0;

  useEffect(() => {
    let active = true;
    void ensureZikrCorpus().then((items) => {
      if (!active) return;
      setZikrItems(items);
      setZikrReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const searchIndex = useMemo(() => createZikrSearch(zikrItems), [zikrItems]);
  const results = useMemo(
    () => (searching ? searchIndex.search(query) : []),
    [query, searchIndex, searching],
  );

  const indexById = useMemo(() => {
    const map = new Map<string, number>();
    for (const category of categories) {
      zikrByCategory(category.id).forEach((item, position) => {
        map.set(item.id, position + 1);
      });
    }
    return map;
  }, [categories]);

  const onOpenDetail = useCallback((id: string) => pushZikrDetail(router, id), [router]);

  const savedCard = (
    <SavedNavCard
      key="saved"
      title={t("zikr.favorites")}
      viewLabel={t("zikr.seeAll")}
      count={favoriteIds.length > 0 ? favoriteIds.length : undefined}
      headerIcon={{ ios: "star.fill", android: "star", web: "star" }}
      rowIcon={{ ios: "star.fill", android: "star", web: "star" }}
      onPress={() => router.push("/zikr/favorites")}
    />
  );

  const searchCard = (
    <Card key="search" padding="three" style={wide ? styles.fill : undefined}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder={t("zikr.searchPlaceholder")}
        placeholderTextColor={colors.mutedForeground}
        accessibilityLabel={t("zikr.searchPlaceholder")}
        style={[
          styles.input,
          tv ? styles.inputTv : null,
          tokens.inputSurface,
          { color: colors.foreground },
        ]}
      />
    </Card>
  );

  const customCard = (
    <Card key="custom" padding="three">
      <NavRow
        icon={{ ios: "square.and.pencil", android: "edit_note", web: "edit_note" }}
        label={t("customAdhkar.title")}
        onPress={() => router.push("/adhkar-builder")}
      />
    </Card>
  );

  return (
    <ScreenLayout
      eyebrow={t("zikr.eyebrow")}
      title={t("zikr.title")}
      subtitle={
        searching ? t("zikr.searchResultCount", { count: results.length }) : t("zikr.subtitle")
      }
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo
        path="/zikr"
        breadcrumbs={[
          { name: t("tabs.home"), path: "/" },
          { name: t("zikr.title"), path: "/zikr" },
        ]}
        jsonLd={[
          collectionPageSchema({
            path: "/zikr",
            name: "Daily Adhkar & Zikr",
            description: "Morning, evening, and situational adhkar for every part of your day.",
            items: ZIKR_CATEGORY_IDS.map((id) => ({
              name: t(`zikrCat.${id}`),
              path: `/zikr/${id}`,
            })),
            breadcrumbs: [
              { name: t("tabs.home"), path: "/" },
              { name: t("zikr.title"), path: "/zikr" },
            ],
          }),
        ]}
      />
      <Stagger>
        {wide ? (
          <View style={styles.topRowWide}>
            <View style={styles.searchColWide}>{searchCard}</View>
            <View style={styles.sideColWide}>
              {savedCard}
              {searching ? null : customCard}
            </View>
          </View>
        ) : (
          [savedCard, searchCard]
        )}

        {searching ? (
          !zikrReady ? null : results.length === 0 ? (
            <EmptyState
              icon={{ ios: "magnifyingglass", android: "search", web: "search" }}
              title={t("zikr.noResults")}
              description={t("search.noResultsDesc")}
            />
          ) : (
            <Card padding="three">
              <ResponsiveGrid columns={tv ? 1 : undefined} maxColumns={2} gap={Spacing.two}>
                {results.map((item) => (
                  <ZikrSearchRow
                    key={item.id}
                    item={item}
                    index={indexById.get(item.id)}
                    categoryLabel={t(`zikrCat.${item.categoryId}`)}
                    counts={zikrCounts}
                    onPress={onOpenDetail}
                  />
                ))}
              </ResponsiveGrid>
            </Card>
          )
        ) : null}

        {!searching && !wide ? customCard : null}

        {!searching ? (
          <Card padding="three">
            <SectionHeader
              title={t("zikr.categories")}
              icon={{ ios: "square.grid.2x2.fill", android: "grid_view", web: "grid_view" }}
            />
            {/* TV: two-column grid (D-pad left/right between columns). Wide web /
                tablets: 2-4 columns by width. Phones: one column. */}
            <ResponsiveGrid columns={tv ? 2 : undefined} gap={Spacing.two} style={styles.gridTop}>
              {categories.map((category) => {
                const progress = zikrCategoryBadge(category.id, zikrCounts, t("zikr.done"));
                return (
                  <NavRow
                    key={category.id}
                    icon={category.icon}
                    label={t(`zikrCat.${category.id}`)}
                    badge={progress?.label}
                    completed={progress?.completed}
                    count={progress ? undefined : category.count}
                    onPress={() =>
                      router.push({
                        pathname: "/zikr/[category]",
                        params: { category: category.id },
                      })
                    }
                  />
                );
              })}
            </ResponsiveGrid>
          </Card>
        ) : null}
      </Stagger>
    </ScreenLayout>
  );
}

function ZikrSearchRow({
  item,
  index,
  categoryLabel,
  counts,
  onPress,
}: {
  item: ZikrItem;
  index?: number;
  categoryLabel: string;
  counts: Record<string, number>;
  onPress: (id: string) => void;
}) {
  const { completed, progressLabel } = zikrListRowProgress(item, counts);
  return (
    <ZikrRow
      item={item}
      index={index}
      categoryLabel={categoryLabel}
      onPress={onPress}
      completed={completed}
      progressLabel={progressLabel}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderRadius: Radius.md,
    borderCurve: "continuous",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 15,
  },
  // TextInput bypasses ThemedText's tvOS density scaling — match Library's input.
  inputTv: {
    minHeight: TvLayout.minFocusTarget,
    fontSize: tvDp(TvLayout.bodyFontSize),
  },
  gridTop: { marginTop: Spacing.three },
  topRowWide: { flexDirection: "row", alignItems: "stretch", gap: Spacing.three },
  searchColWide: { flex: 3, minWidth: 0 },
  sideColWide: { flex: 2, minWidth: 0, gap: Spacing.three },
  fill: { flexGrow: 1, justifyContent: "center" },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/zikr");
