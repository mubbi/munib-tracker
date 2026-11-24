import type { DuaCategoryId, DuaItem } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { DuaListRow } from "@/components/dua/dua-list-row";
import { DuaMomentCard, DuaOfTheDayCard } from "@/components/dua/dua-spotlight";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { BrowseTile } from "@/components/ui/browse-tile";
import { EmptyState } from "@/components/ui/empty-state";
import { NavRow } from "@/components/ui/nav-row";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { SearchField } from "@/components/ui/search-field";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { useCategoryHue } from "@/components/ui/use-category-hue";
import { Spacing } from "@/constants/theme";
import { useContentCorpus } from "@/hooks/use-content-corpus";
import { useNow } from "@/hooks/use-now";
import { DUA_CORPUS } from "@/lib/content-loaders";
import {
  DUA_CATEGORY_GROUPS,
  DUA_CATEGORY_ICONS,
  DUA_CATEGORY_IDS,
  type DuaCategoryGroup,
  duaCategoryGroup,
  duaMomentFor,
  duaOfTheDay,
} from "@/lib/dua-browse";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { createDuaSearch } from "@/lib/search";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { collectionPageSchema } from "@/lib/seo/structured-data";
import { resolveTranslationField } from "@/lib/translation-locale";
import { useEnsureDuaFavoritesLoaded, useFavoriteDuaIds } from "@/stores/dua-favorites-store";
import {
  clearDuaRecents,
  useEnsureDuaRecentsLoaded,
  useRecentDuaIds,
} from "@/stores/dua-recents-store";
import { usePreferences } from "@/stores/preferences-store";

/** Recently read rows shown on the hub (the store keeps a few more). */
const HUB_RECENTS = 4;

export default function DuaHomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const tv = isTV();
  const { width } = useWindowDimensions();
  // Wide web / tablets: spotlight + shortcuts side by side, denser tile grid.
  const wide = !tv && width >= 768;
  const tileColumns = tv ? 3 : width >= 1200 ? 4 : wide ? 3 : 2;
  const prefs = usePreferences();
  const now = useNow();
  useEnsureDuaFavoritesLoaded();
  useEnsureDuaRecentsLoaded();
  const favoriteCount = useFavoriteDuaIds().length;
  const recentIds = useRecentDuaIds();
  const [query, setQuery] = useState("");
  const { items: duaItems, ready: corpusReady } = useContentCorpus(DUA_CORPUS);
  const searching = query.trim().length > 0;

  const searchIndex = useMemo(() => createDuaSearch(duaItems), [duaItems]);
  const results = useMemo(
    () => (searching ? searchIndex.search(query) : []),
    [query, searchIndex, searching],
  );

  const countByCategory = useMemo(() => {
    const counts = new Map<DuaCategoryId, number>();
    for (const item of duaItems) {
      counts.set(item.categoryId, (counts.get(item.categoryId) ?? 0) + 1);
    }
    return counts;
  }, [duaItems]);

  const byId = useMemo(() => new Map(duaItems.map((item) => [item.id, item])), [duaItems]);
  const recents = useMemo(
    () =>
      recentIds
        .map((id) => byId.get(id))
        .filter((item): item is DuaItem => item != null)
        .slice(0, HUB_RECENTS),
    [byId, recentIds],
  );

  // Re-pick only when the local day changes, not on every minute tick.
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const todaysDua = useMemo(() => duaOfTheDay(duaItems, new Date(dayStart)), [duaItems, dayStart]);
  const moment = duaMomentFor(now);
  const momentHue = useCategoryHue(duaCategoryGroup(moment.categoryId).hue);

  const translationOf = useCallback(
    (item: DuaItem) => resolveTranslationField(item, prefs),
    [prefs],
  );
  const openDua = useCallback(
    (id: string) => router.push({ pathname: "/dua/detail/[id]", params: { id } }),
    [router],
  );
  const openCategory = useCallback(
    (categoryId: DuaCategoryId) =>
      router.push({ pathname: "/dua/[category]", params: { category: categoryId } }),
    [router],
  );

  const countLabel = (categoryId: DuaCategoryId) => {
    const count = countByCategory.get(categoryId);
    return count != null ? t("dua.supplicationsCount", { count }) : undefined;
  };

  // A single row, not a titled card — the card repeated "Saved duas" twice and
  // cost ~160px above the fold for one link.
  const savedCard = (
    <NavRow
      key="saved"
      icon={{ ios: "star.fill", android: "star", web: "star" }}
      label={t("dua.favorites")}
      count={favoriteCount > 0 ? favoriteCount : undefined}
      onPress={() => router.push("/dua/favorites")}
    />
  );

  const momentCard = (
    <DuaMomentCard
      key="moment"
      icon={moment.icon}
      eyebrow={t("dua.suggestedNow")}
      title={t(`dua.moment.${moment.moment}`)}
      subtitle={t(`duaCat.${moment.categoryId}`)}
      hue={momentHue}
      onPress={() => openCategory(moment.categoryId)}
    />
  );

  const spotlight = todaysDua ? (
    <DuaOfTheDayCard
      key="today"
      item={todaysDua}
      translation={translationOf(todaysDua)}
      onPress={() => openDua(todaysDua.id)}
      preferredFocus
    />
  ) : null;

  const recentsBlock =
    recents.length > 0 ? (
      <View key="recents" style={styles.section}>
        <SectionHeader
          title={t("dua.recent")}
          icon={{ ios: "clock.arrow.circlepath", android: "history", web: "history" }}
          actionLabel={t("dua.clearRecent")}
          actionAccessibilityLabel={t("dua.clearRecentA11y")}
          onActionPress={() => void clearDuaRecents()}
        />
        <ResponsiveGrid columns={tv ? 1 : undefined} maxColumns={2} gap={Spacing.two}>
          {recents.map((item) => (
            <DuaListRow
              key={item.id}
              item={item}
              translation={translationOf(item)}
              meta={t(`duaCat.${item.categoryId}`)}
              onOpen={openDua}
            />
          ))}
        </ResponsiveGrid>
      </View>
    ) : null;

  const browse = DUA_CATEGORY_GROUPS.map((group) => (
    <CategoryGroupSection
      key={group.id}
      group={group}
      columns={tileColumns}
      countLabel={countLabel}
      onOpen={openCategory}
    />
  ));

  return (
    <ScreenLayout
      eyebrow={t("dua.eyebrow")}
      title={t("dua.title")}
      subtitle={
        searching ? t("dua.searchResultCount", { count: results.length }) : t("dua.subtitle")
      }
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo
        path="/dua"
        breadcrumbs={[
          { name: t("tabs.home"), path: "/" },
          { name: t("dua.title"), path: "/dua" },
        ]}
        jsonLd={[
          collectionPageSchema({
            path: "/dua",
            name: "Duas & Supplications",
            description:
              "Authentic duas and supplications from the Qur'an and Sunnah — morning & evening, prayer, protection, travel, forgiveness, and more.",
            items: DUA_CATEGORY_IDS.map((category) => ({
              name: t(`duaCat.${category}`),
              path: `/dua/${category}`,
            })),
            breadcrumbs: [
              { name: t("tabs.home"), path: "/" },
              { name: t("dua.title"), path: "/dua" },
            ],
          }),
        ]}
      />
      <Stagger>
        <SearchField
          key="search"
          value={query}
          onChangeText={setQuery}
          placeholder={t("dua.searchPlaceholder")}
        />

        {searching ? (
          !corpusReady ? null : results.length === 0 ? (
            <EmptyState
              key="empty"
              icon={{ ios: "magnifyingglass", android: "search", web: "search" }}
              title={t("dua.noResults")}
              description={t("search.noResultsDesc")}
            />
          ) : (
            <ResponsiveGrid
              key="results"
              columns={tv ? 1 : undefined}
              maxColumns={2}
              gap={Spacing.two}
            >
              {results.map((item) => (
                <DuaListRow
                  key={item.id}
                  item={item}
                  translation={translationOf(item)}
                  meta={t(`duaCat.${item.categoryId}`)}
                  onOpen={openDua}
                />
              ))}
            </ResponsiveGrid>
          )
        ) : null}

        {!searching
          ? [
              wide ? (
                <View key="spotlight" style={styles.spotlightWide}>
                  <View style={styles.spotlightMain}>{spotlight}</View>
                  <View style={styles.spotlightSide}>
                    {momentCard}
                    {savedCard}
                  </View>
                </View>
              ) : (
                <View key="spotlight" style={styles.stack}>
                  {spotlight}
                  {momentCard}
                  {savedCard}
                </View>
              ),
              recentsBlock,
              ...browse,
            ]
          : null}
      </Stagger>
    </ScreenLayout>
  );
}

function CategoryGroupSection({
  group,
  columns,
  countLabel,
  onOpen,
}: {
  group: DuaCategoryGroup;
  columns: number;
  countLabel: (id: DuaCategoryId) => string | undefined;
  onOpen: (id: DuaCategoryId) => void;
}) {
  const { t } = useTranslation();
  const hue = useCategoryHue(group.hue);
  return (
    <View style={styles.section}>
      <SectionHeader title={t(`dua.group.${group.id}`)} icon={group.icon} />
      {/* Tiles sit straight on the page — wrapping them in a Card nested three
          surfaces deep (page → card → tile) and read as clutter on phones. */}
      <ResponsiveGrid columns={columns} gap={Spacing.two}>
        {group.categories.map((categoryId) => (
          <BrowseTile
            key={categoryId}
            icon={DUA_CATEGORY_ICONS[categoryId]}
            label={t(`duaCat.${categoryId}`)}
            countLabel={countLabel(categoryId)}
            hue={hue}
            onPress={() => onOpen(categoryId)}
          />
        ))}
      </ResponsiveGrid>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.two },
  stack: { gap: Spacing.three },
  spotlightWide: { flexDirection: "row", alignItems: "stretch", gap: Spacing.three },
  spotlightMain: { flex: 3, minWidth: 0 },
  spotlightSide: { flex: 2, minWidth: 0, gap: Spacing.three },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/dua");
