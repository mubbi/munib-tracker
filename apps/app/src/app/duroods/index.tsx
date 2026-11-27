import type { DurudItem } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { type DuroodSection, groupDuroods } from "@/components/duroods/durood-browse";
import { DuroodRow } from "@/components/duroods/durood-row";
import { duroodHasAudio, useDuroodListAudio } from "@/components/duroods/use-durood-list-audio";
import { useDuroodSaveToggle } from "@/components/duroods/use-durood-save-toggle";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { EmptyState } from "@/components/ui/empty-state";
import { ResponsiveGrid, useResponsiveColumns } from "@/components/ui/responsive-grid";
import { SavedNavCard } from "@/components/ui/saved-nav-card";
import { SearchField } from "@/components/ui/search-field";
import { SkeletonPlaceholder } from "@/components/ui/skeleton";
import { TvUndoButton } from "@/components/ui/tv-undo-button";
import { Spacing } from "@/constants/theme";
import { useContentBottomInset } from "@/hooks/use-content-bottom-inset";
import { useContentCorpus } from "@/hooks/use-content-corpus";
import { DUROOD_CORPUS } from "@/lib/content-loaders";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { createDuroodSearch } from "@/lib/search";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { collectionPageSchema } from "@/lib/seo/structured-data";
import { useReadingDisplay } from "@/lib/settings/reading-display";
import { resolveTranslationField } from "@/lib/translation-locale";
import {
  useEnsureDuroodFavoritesLoaded,
  useFavoriteDuroodIds,
} from "@/stores/durood-favorites-store";
import { usePreferences } from "@/stores/preferences-store";

const SOURCE_HREF = "/duroods";

export default function DuroodsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const tv = isTV();
  // Wide web / tablets: rows flow into two columns; TV keeps one D-pad column.
  const autoColumns = useResponsiveColumns({ max: 2 });
  const columns = tv ? 1 : autoColumns;
  const contentBottomInset = useContentBottomInset();
  const prefs = usePreferences();
  useEnsureDuroodFavoritesLoaded();
  const favoriteIds = useFavoriteDuroodIds();
  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);
  // Un-save offers Undo and restores the saved position (B-30).
  const { toggleSaved, undoToast } = useDuroodSaveToggle();
  const listAudio = useDuroodListAudio(SOURCE_HREF);
  // The row's second line follows the reader's transliteration / meaning toggles.
  const { showTransliteration, showTranslation } = useReadingDisplay();

  const [query, setQuery] = useState("");
  const { items, ready } = useContentCorpus(DUROOD_CORPUS);
  const index = useMemo(() => createDuroodSearch(items), [items]);
  const searching = query.trim().length > 0;
  const sections = useMemo<DuroodSection[]>(() => {
    if (!searching) return groupDuroods(items);
    const results = index.search(query);
    return results.length > 0 ? [{ key: "results", items: results }] : [];
  }, [index, items, query, searching]);

  const byId = useMemo(() => new Map(items.map((item) => [item.id, item])), [items]);
  // TV: the first row takes initial D-pad focus (not the search field). Pinned
  // once so searching never yanks focus back into the list.
  const tvFirstFocusId = useRef<string | null>(null);
  if (tv && tvFirstFocusId.current == null && items[0]) tvFirstFocusId.current = items[0].id;

  const onOpen = useCallback(
    (id: string) => router.push({ pathname: "/duroods/[id]", params: { id } }),
    [router],
  );
  const onInfo = useCallback(
    (id: string) => router.push({ pathname: "/duroods/[id]", params: { id, source: "1" } }),
    [router],
  );
  const onPlay = useCallback(
    (id: string) => {
      const item = byId.get(id);
      if (item) listAudio.toggle(item);
    },
    [byId, listAudio],
  );
  const translationOf = useCallback(
    (item: DurudItem) => resolveTranslationField(item, prefs),
    [prefs],
  );
  const previewOf = useCallback(
    (item: DurudItem) => {
      const transliteration = item.transliteration?.trim();
      if (showTransliteration && transliteration) return transliteration;
      return showTranslation ? resolveTranslationField(item, prefs) : undefined;
    },
    [prefs, showTranslation, showTransliteration],
  );

  const breadcrumbs = [
    { name: t("tabs.home"), path: "/" },
    { name: t("duroods.title"), path: SOURCE_HREF },
  ];

  return (
    <ScreenLayout
      eyebrow={t("duroods.eyebrow")}
      title={t("duroods.title")}
      subtitle={t("duroods.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      {/* TV: toasts take no focus — the Undo lives on the page (B-04). */}
      <TvUndoButton controller={undoToast} />
      <Seo
        path={SOURCE_HREF}
        breadcrumbs={breadcrumbs}
        jsonLd={[
          collectionPageSchema({
            path: SOURCE_HREF,
            name: "Duroods & Salawat",
            description:
              "Salawat upon the Prophet Muhammad ﷺ from authentic hadith — Arabic, meaning, citation and grade.",
            items: items.map((item) => ({ name: item.title, path: `/duroods/${item.id}` })),
            breadcrumbs,
          }),
        ]}
      />
      <View style={[styles.root, { paddingBottom: contentBottomInset }]}>
        <SavedNavCard
          title={t("duroods.favorites")}
          viewLabel={t("duroods.favorites")}
          count={favoriteIds.length > 0 ? favoriteIds.length : undefined}
          headerIcon={{ ios: "bookmark.fill", android: "bookmark", web: "bookmark" }}
          rowIcon={{ ios: "bookmark.fill", android: "bookmark", web: "bookmark" }}
          onPress={() => router.push("/duroods/favorites")}
        />
        <SearchField
          value={query}
          onChangeText={setQuery}
          placeholder={t("duroods.searchPlaceholder")}
          style={columns > 1 ? styles.searchWide : undefined}
        />
        {!ready ? (
          <SkeletonPlaceholder preset="card" count={3} accessibilityLabel={t("duroods.loading")} />
        ) : sections.length === 0 ? (
          <EmptyState
            icon={{ ios: "magnifyingglass", android: "search", web: "search" }}
            title={t("duroods.noResults")}
            description={t("search.noResultsDesc")}
          />
        ) : (
          sections.map((section) => (
            <View key={section.key} style={styles.section}>
              {section.key !== "results" ? (
                <View style={styles.sectionHeader} accessibilityRole="header">
                  <ThemedText type="smallBold" style={styles.sectionTitle}>
                    {t(
                      section.key === "salawat"
                        ? "duroods.sectionSalawat"
                        : "duroods.sectionVirtues",
                    )}
                  </ThemedText>
                  <ThemedText type="caption" themeColor="mutedForeground">
                    {section.items.length}
                  </ThemedText>
                </View>
              ) : null}
              <ResponsiveGrid columns={columns} gap={Spacing.two}>
                {section.items.map((item, position) => (
                  <DuroodRow
                    key={item.id}
                    item={item}
                    index={position + 1}
                    translation={translationOf(item)}
                    preview={previewOf(item)}
                    isFavorite={favoriteSet.has(item.id)}
                    onOpen={onOpen}
                    onToggleFavorite={toggleSaved}
                    onInfo={onInfo}
                    onPlay={duroodHasAudio(item) ? onPlay : undefined}
                    playing={listAudio.playingId === item.id}
                    preferredFocus={item.id === tvFirstFocusId.current}
                  />
                ))}
              </ResponsiveGrid>
            </View>
          ))
        )}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  root: { gap: Spacing.four },
  searchWide: { maxWidth: 640 },
  section: { gap: Spacing.two },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingHorizontal: Spacing.one,
  },
  sectionTitle: { flex: 1 },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/duroods");
