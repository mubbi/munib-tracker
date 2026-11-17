import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, useWindowDimensions, View } from "react-native";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { NavRow } from "@/components/ui/nav-row";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { tTv } from "@/lib/i18n/t-tv";
import {
  createLibraryMenuSearch,
  groupLibraryMenuBySection,
  LIBRARY_MENU_META,
  LIBRARY_SECTIONS,
} from "@/lib/library-menu";
import { isTV } from "@/lib/platform/is-tv";
import { TV_HIDDEN_QUICK_ACTION_IDS } from "@/lib/quick-actions";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useEnsureNewFeaturesLoaded, useNewFeatureIds } from "@/stores/new-features-store";
import { usePreferencesReady } from "@/stores/preferences-store";

/** TV: tiles per row — the landscape pane fits three readable NavRows. */
const TV_GRID_COLUMNS = 3;

/**
 * Phone / tablet / desktop tile columns per section (window width; the web
 * rail + ScreenLayout cap leave ~250px per NavRow at 4–5 columns).
 */
function libraryGridColumns(width: number): number {
  if (width >= 1600) return 5;
  if (width >= 1200) return 4;
  if (width >= 1024) return 3;
  if (width >= 768) return 2;
  return 1;
}

export default function LibraryScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const tv = isTV();
  const { width } = useWindowDimensions();
  const columns = tv ? TV_GRID_COLUMNS : libraryGridColumns(width);
  const useGrid = columns > 1;
  const [query, setQuery] = useState("");
  const searching = query.trim().length > 0;
  useEnsureNewFeaturesLoaded(usePreferencesReady());
  const newFeatureIds = useNewFeatureIds();

  const menu = useMemo(
    () =>
      tv
        ? LIBRARY_MENU_META.filter((entry) => !TV_HIDDEN_QUICK_ACTION_IDS.has(entry.id))
        : LIBRARY_MENU_META,
    [tv],
  );

  const searchableMenu = useMemo(
    () => menu.map((entry) => ({ ...entry, label: t(entry.labelKey) })),
    [menu, t],
  );

  const searchIndex = useMemo(() => createLibraryMenuSearch(searchableMenu), [searchableMenu]);

  const visibleMenu = useMemo(
    () => (searching ? searchIndex.search(query) : searchableMenu),
    [query, searchIndex, searchableMenu, searching],
  );

  const grouped = useMemo(() => groupLibraryMenuBySection(visibleMenu), [visibleMenu]);

  const sections = useMemo(
    () => LIBRARY_SECTIONS.filter((section) => grouped[section.id].length > 0),
    [grouped],
  );

  return (
    <ScreenLayout
      eyebrow={t("library.eyebrow")}
      title={t("library.title")}
      subtitle={tTv(t, "library.subtitle", "library.tvSubtitle")}
    >
      <Seo path="/library" />
      <Stagger>
        <Card padding="three" style={!tv && useGrid ? styles.searchCardWide : undefined}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t("library.searchPlaceholder")}
            placeholderTextColor={colors.mutedForeground}
            accessibilityLabel={t("library.searchPlaceholder")}
            autoCorrect={false}
            returnKeyType="search"
            style={[
              styles.input,
              tv ? styles.inputTv : null,
              tokens.inputSurface,
              { color: colors.foreground },
            ]}
          />
        </Card>

        {searching && sections.length === 0 ? (
          <EmptyState
            icon={{ ios: "magnifyingglass", android: "search", web: "search" }}
            title={t("library.noResults")}
            description={t("search.noResultsDesc")}
          />
        ) : (
          sections.map((section, sectionIndex) => (
            <Card key={section.id} padding="three">
              <SectionHeader title={t(section.titleKey)} icon={section.icon} />
              {/* TV + wide screens: multi-column tile grid (TV: Left/Right within a row,
                Up/Down across rows) instead of one long phone column. */}
              <View style={useGrid ? styles.grid : styles.rows}>
                {grouped[section.id].map((entry, entryIndex) => {
                  const row = (
                    <NavRow
                      key={entry.id}
                      icon={entry.icon}
                      label={t(entry.labelKey)}
                      isNew={newFeatureIds.has(entry.id)}
                      newLabel={t("common.newBadge")}
                      preferredFocus={tv && sectionIndex === 0 && entryIndex === 0}
                      onPress={() => router.push(entry.route)}
                    />
                  );
                  return useGrid ? (
                    <View key={entry.id} style={[styles.gridCell, { width: `${100 / columns}%` }]}>
                      {row}
                    </View>
                  ) : (
                    row
                  );
                })}
              </View>
            </Card>
          ))
        )}
      </Stagger>
    </ScreenLayout>
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
  inputTv: {
    minHeight: TvLayout.minFocusTarget,
    fontSize: tvDp(TvLayout.bodyFontSize),
  },
  rows: { gap: Spacing.two, marginTop: Spacing.three },
  // Padding-based gutters keep exact 1/N columns (percent widths + `gap` overflow).
  /** Wide screens: don't stretch the filter field across the whole column. */
  searchCardWide: { maxWidth: 640 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: Spacing.three,
    marginHorizontal: -Spacing.one,
  },
  gridCell: {
    paddingHorizontal: Spacing.one,
    paddingBottom: Spacing.two,
  },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/(tabs)/library");
