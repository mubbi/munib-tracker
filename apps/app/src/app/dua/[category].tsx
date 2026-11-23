import type { DuaCategoryId, DuaItem } from "@munib-tracker/shared/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { type ListRenderItem, StyleSheet, View } from "react-native";
import { DuaListRow } from "@/components/dua/dua-list-row";
import { type DuaOccasionChip, DuaOccasionChips } from "@/components/dua/dua-occasion-chips";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ResponsiveGrid, useResponsiveColumns } from "@/components/ui/responsive-grid";
import { SearchField } from "@/components/ui/search-field";
import { TvFlatList } from "@/components/ui/tv-flat-list";
import { useCategoryHue } from "@/components/ui/use-category-hue";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { loadDuaItems } from "@/lib/content-loaders";
import {
  DUA_CATEGORY_IDS,
  type DuaSection,
  duaCategoryGroup,
  groupDuasByOccasion,
  isDuaCategoryId,
  shortOccasionLabel,
} from "@/lib/dua-browse";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { createDuaSearch } from "@/lib/search";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { collectionPageSchema } from "@/lib/seo/structured-data";
import { resolveTranslationField } from "@/lib/translation-locale";
import {
  useDuaFavoritesActions,
  useEnsureDuaFavoritesLoaded,
  useFavoriteDuaIds,
} from "@/stores/dua-favorites-store";
import { usePreferences } from "@/stores/preferences-store";

/** Expo Router may pass dynamic segments as `string | string[]` on deep links. */
function paramValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

/** Pre-render a static HTML page for each fixed dua category at web export time. */
export function generateStaticParams(): Array<{ category: string }> {
  return DUA_CATEGORY_IDS.map((category) => ({ category }));
}

export default function DuaCategoryScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const tv = isTV();
  // Wide web / tablets: duas inside each occasion flow into 2-3 columns.
  const autoColumns = useResponsiveColumns({ max: 3 });
  const columns = tv ? 1 : autoColumns;
  const prefs = usePreferences();
  useEnsureDuaFavoritesLoaded();
  const favoriteIds = useFavoriteDuaIds();
  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);
  const { toggle } = useDuaFavoritesActions();
  const params = useLocalSearchParams<{ category: string | string[] }>();
  const categoryParam = paramValue(params.category);
  const isKnownCategory = isDuaCategoryId(categoryParam);
  const categoryId: DuaCategoryId = isKnownCategory ? categoryParam : "morning_evening";
  const hue = useCategoryHue(duaCategoryGroup(categoryId).hue);
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
  const sections = useMemo(() => groupDuasByOccasion(items), [items]);
  const [query, setQuery] = useState("");
  const [occasion, setOccasion] = useState<string | null>(null);
  const searching = query.trim().length > 0;

  const duaIndex = useMemo(() => createDuaSearch(items), [items]);
  const results = useMemo(
    () => (searching ? duaIndex.search(query) : []),
    [duaIndex, query, searching],
  );

  const chips = useMemo<DuaOccasionChip[]>(
    () =>
      sections
        .filter((section) => section.title != null)
        .map((section) => ({
          key: section.key,
          label: shortOccasionLabel(section.title ?? ""),
          count: section.items.length,
        })),
    [sections],
  );

  // Searching shows one flat result section; otherwise the occasion sections
  // (narrowed to the selected chip).
  const visibleSections = useMemo<DuaSection[]>(() => {
    if (searching)
      return results.length > 0 ? [{ key: "results", title: null, items: results }] : [];
    if (occasion == null) return sections;
    return sections.filter((section) => section.key === occasion);
  }, [occasion, results, searching, sections]);

  // TV: the first dua row takes initial D-pad focus (not the search field).
  // Pinned once so search changes never yank focus back into the list.
  const tvFirstFocusId = useRef<string | null>(null);
  if (tv && tvFirstFocusId.current == null && sections[0]?.items[0]) {
    tvFirstFocusId.current = sections[0].items[0].id;
  }

  const onOpen = useCallback(
    (id: string) => router.push({ pathname: "/dua/detail/[id]", params: { id } }),
    [router],
  );
  const translationOf = useCallback(
    (item: DuaItem) => resolveTranslationField(item, prefs),
    [prefs],
  );

  const renderSection = useCallback(
    (section: DuaSection) => (
      <OccasionSection
        section={section}
        columns={columns}
        favoriteSet={favoriteSet}
        translationOf={translationOf}
        onToggleFavorite={toggle}
        onOpen={onOpen}
        tvFirstFocusId={tvFirstFocusId.current}
        accent={hue.icon}
      />
    ),
    [columns, favoriteSet, hue.icon, onOpen, toggle, translationOf],
  );
  const renderItem = useCallback<ListRenderItem<DuaSection>>(
    ({ item }) => renderSection(item),
    [renderSection],
  );
  const keyExtractor = useCallback((section: DuaSection) => section.key, []);

  const categoryName = t(`duaCat.${categoryId}`);
  const categoryDescription = `${categoryName} — authentic supplications with Arabic, transliteration, and meaning.`;
  const categoryBreadcrumbs = [
    { name: t("tabs.home"), path: "/" },
    { name: t("dua.title"), path: "/dua" },
    { name: categoryName, path: `/dua/${categoryId}` },
  ];

  const empty =
    searching && corpusReady ? (
      <EmptyState
        icon={{ ios: "magnifyingglass", android: "search", web: "search" }}
        title={t("dua.noResults")}
        description={t("search.noResultsDesc")}
      />
    ) : null;

  const controls = (
    <View style={styles.controls}>
      <SearchField
        value={query}
        onChangeText={setQuery}
        placeholder={t("dua.searchInCategory")}
        style={columns > 1 ? styles.searchWide : undefined}
      />
      {!searching && chips.length > 1 ? (
        <DuaOccasionChips
          chips={chips}
          selected={occasion}
          onSelect={setOccasion}
          totalCount={items.length}
        />
      ) : null}
    </View>
  );

  return (
    <ScreenLayout
      eyebrow={t("dua.categoryEyebrow")}
      title={categoryName}
      subtitle={
        !corpusReady
          ? undefined
          : searching
            ? t("dua.searchResultCount", { count: results.length })
            : t("dua.supplicationsCount", { count: items.length })
      }
      onBack={() => goBackOrReplace(router, "/dua")}
      // TV: ScreenLayout ScrollView + mapped sections — nested FlatList flex hosts
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
        {controls}
        {tv ? (
          <View style={styles.tvList}>
            {visibleSections.length === 0
              ? empty
              : visibleSections.map((section) => (
                  <View key={section.key}>{renderSection(section)}</View>
                ))}
          </View>
        ) : (
          <View style={styles.listHost}>
            <TvFlatList
              style={styles.flatList}
              data={visibleSections}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              ItemSeparatorComponent={SectionSeparator}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              initialNumToRender={4}
              maxToRenderPerBatch={4}
              windowSize={7}
              ListEmptyComponent={empty ?? undefined}
            />
          </View>
        )}
      </Card>
    </ScreenLayout>
  );
}

function SectionSeparator() {
  return <View style={styles.sectionSeparator} />;
}

function OccasionSection({
  section,
  columns,
  favoriteSet,
  translationOf,
  onToggleFavorite,
  onOpen,
  tvFirstFocusId,
  accent,
}: {
  section: DuaSection;
  columns: number;
  favoriteSet: ReadonlySet<string>;
  translationOf: (item: DuaItem) => string;
  onToggleFavorite: (id: string) => void;
  onOpen: (id: string) => void;
  tvFirstFocusId: string | null;
  /** Category hue for the header accent bar (scannability between occasions). */
  accent: string;
}) {
  const { tokens } = useThemeTokens();
  const titled = section.title != null;
  // Phones: a rail only — a full frame inside the list card nested three
  // paddings deep and squeezed the reading column to ~170px.
  const compact = columns === 1 && !isTV();
  return (
    // A multi-dua occasion carries a hue rail down its whole height (framed on
    // wide screens), so its rows can't be mistaken for the one-off duas that
    // follow unframed. A header-only bar left that boundary ambiguous.
    <View
      style={[
        styles.section,
        titled &&
          (compact
            ? [styles.groupRail, { borderStartColor: accent }]
            : [styles.group, { borderColor: tokens.hairline, borderStartColor: accent }]),
      ]}
    >
      {titled ? (
        <View style={styles.sectionHeader} accessibilityRole="header">
          <ThemedText type="smallBold" style={styles.sectionTitle}>
            {section.title}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {section.items.length}
          </ThemedText>
        </View>
      ) : null}
      <ResponsiveGrid columns={columns} gap={Spacing.two}>
        {section.items.map((item, index) => (
          <DuaListRow
            key={item.id}
            item={item}
            variant={titled ? "passage" : "titled"}
            index={titled ? index + 1 : undefined}
            translation={translationOf(item)}
            isFavorite={favoriteSet.has(item.id)}
            onToggleFavorite={onToggleFavorite}
            onOpen={onOpen}
            preferredFocus={item.id === tvFirstFocusId}
          />
        ))}
      </ResponsiveGrid>
    </View>
  );
}

const styles = StyleSheet.create({
  listCard: { flex: 1, minHeight: 0 },
  /** Bounded host so FlatList flex:1 resolves against a real viewport height. */
  listHost: { flex: 1, minHeight: 0 },
  flatList: { flex: 1 },
  tvList: { gap: Spacing.four },
  controls: { gap: Spacing.three, marginBottom: Spacing.three },
  searchWide: { maxWidth: 640 },
  section: { gap: Spacing.two },
  group: {
    padding: Spacing.two,
    paddingTop: Spacing.three,
    borderWidth: 1,
    borderStartWidth: 4,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
  },
  groupRail: { borderStartWidth: 3, paddingStart: Spacing.two },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingHorizontal: Spacing.one,
  },
  sectionTitle: { flex: 1 },
  sectionSeparator: { height: Spacing.four },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/dua/[category]");
