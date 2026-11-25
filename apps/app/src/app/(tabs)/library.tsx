import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { ContinueCard } from "@/components/continue-card";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { BrowseTile } from "@/components/ui/browse-tile";
import { Card } from "@/components/ui/card";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { NavRow } from "@/components/ui/nav-row";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { SearchField } from "@/components/ui/search-field";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { useCategoryHue } from "@/components/ui/use-category-hue";
import { Breakpoints, type CategoryHueKey, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { tTv } from "@/lib/i18n/t-tv";
import {
  createLibraryMenuSearch,
  groupLearnEntries,
  groupLibraryMenuBySection,
  LEARN_SUBGROUP_PREVIEW,
  LIBRARY_COLLAPSED_SECTIONS,
  LIBRARY_PRIMARY_IDS,
  LIBRARY_SECTIONS,
  type LibraryMenuDef,
  type LibrarySearchEntry,
  libraryMenuForDevice,
  orderLibrarySections,
  useShowTvFinanceTools,
} from "@/lib/library-menu";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useStore } from "@/stores/create-store";
import { useEnsureNewFeaturesLoaded, useNewFeatureIds } from "@/stores/new-features-store";
import { preferencesStore, usePreferencesReady } from "@/stores/preferences-store";

/** TV: tiles per row — the landscape pane fits three readable NavRows. */
const TV_GRID_COLUMNS = 3;

/** Hue of each primary tile (decoration only — never a status colour). */
const PRIMARY_HUES: Record<string, CategoryHueKey> = {
  quran: "accent",
  hadith: "sky",
  duas: "rose",
  zikr: "sage",
  names: "dawn",
  bookmarks: "violet",
};

/**
 * Phone / tablet / desktop tile columns per section (window width; the web
 * rail + ScreenLayout cap leave ~250px per NavRow at 4–5 columns).
 */
function libraryGridColumns(width: number): number {
  if (width >= Breakpoints.xwide) return 5;
  if (width >= 1200) return 4;
  if (width >= Breakpoints.wide) return 3;
  if (width >= Breakpoints.tablet) return 2;
  return 1;
}

function PrimaryTile({
  entry,
  label,
  preferredFocus,
  onPress,
}: {
  entry: LibraryMenuDef;
  label: string;
  preferredFocus: boolean;
  onPress: () => void;
}) {
  const hue = useCategoryHue(PRIMARY_HUES[entry.id] ?? "accent");
  return (
    <BrowseTile
      icon={entry.icon}
      label={label}
      hue={hue}
      preferredFocus={preferredFocus}
      onPress={onPress}
    />
  );
}

export default function LibraryScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const tv = isTV();
  const { width } = useWindowDimensions();
  const columns = tv ? TV_GRID_COLUMNS : libraryGridColumns(width);
  const useGrid = columns > 1;
  const [query, setQuery] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<ReadonlySet<string>>(() => new Set());
  const trimmedQuery = query.trim();
  const searching = trimmedQuery.length > 0;
  useEnsureNewFeaturesLoaded(usePreferencesReady());
  const newFeatureIds = useNewFeatureIds();

  // TV lean-back scope (D-UX5): private records and, unless "Show finance
  // tools" is on, the finance tools are left out of the menu and its search.
  const showFinanceTools = useShowTvFinanceTools();
  const menu = useMemo(
    () => libraryMenuForDevice({ tv, showFinanceTools }),
    [tv, showFinanceTools],
  );

  const searchableMenu = useMemo<LibrarySearchEntry[]>(
    () => menu.map((entry) => ({ ...entry, label: t(entry.labelKey) })),
    [menu, t],
  );

  const searchIndex = useMemo(() => createLibraryMenuSearch(searchableMenu), [searchableMenu]);

  const primaryIds = useMemo(() => new Set<string>(LIBRARY_PRIMARY_IDS), []);
  const primaryEntries = useMemo(
    () =>
      LIBRARY_PRIMARY_IDS.flatMap((id) => {
        const entry = searchableMenu.find((candidate) => candidate.id === id);
        return entry ? [entry] : [];
      }),
    [searchableMenu],
  );

  // Browsing hides the primary six from the lists (they are tiles above);
  // searching shows every match, wherever it lives.
  const visibleMenu = useMemo(
    () =>
      searching
        ? searchIndex.search(trimmedQuery)
        : searchableMenu.filter((entry) => !primaryIds.has(entry.id)),
    [primaryIds, searchIndex, searchableMenu, searching, trimmedQuery],
  );

  const grouped = useMemo(() => groupLibraryMenuBySection(visibleMenu), [visibleMenu]);

  // D13: Settings › Appearance & home › Library order.
  const libraryOrder = useStore(preferencesStore, (s) => s.prefs.libraryMenuOrder);
  const sections = useMemo(
    () =>
      orderLibrarySections(LIBRARY_SECTIONS, libraryOrder).filter(
        (section) => grouped[section.id].length > 0,
      ),
    [grouped, libraryOrder],
  );

  const searchEverything = () =>
    router.push(`/search?q=${encodeURIComponent(trimmedQuery)}` as never);

  const toggleGroup = (id: string) =>
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const renderEntries = (entries: readonly LibrarySearchEntry[], focusFirst = false) => {
    const rows = entries.map((entry, entryIndex) => {
      const row = (
        <NavRow
          key={entry.id}
          icon={entry.icon}
          label={entry.label}
          isNew={newFeatureIds.has(entry.id)}
          newLabel={t("common.newBadge")}
          preferredFocus={tv && focusFirst && entryIndex === 0}
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
    });
    return <View style={useGrid ? styles.grid : styles.rows}>{rows}</View>;
  };

  const renderLearn = (entries: LibrarySearchEntry[]) => (
    <View style={styles.learnGroups}>
      {groupLearnEntries(entries).map(({ group, entries: groupEntries }) => {
        const expanded = expandedGroups.has(group.id);
        const overflow = groupEntries.length > LEARN_SUBGROUP_PREVIEW;
        const shown =
          expanded || !overflow ? groupEntries : groupEntries.slice(0, LEARN_SUBGROUP_PREVIEW);
        const toggleLabel = expanded
          ? t("library.showFewer", { group: t(group.titleKey) })
          : t("library.seeAll", { total: groupEntries.length, group: t(group.titleKey) });
        return (
          <View key={group.id} style={styles.learnGroup}>
            <View accessibilityRole="header">
              <ThemedText type="smallBold">{t(group.titleKey)}</ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                {t(group.descriptionKey)}
              </ThemedText>
            </View>
            {renderEntries(shown)}
            {overflow ? (
              <PressableScale
                haptic="selection"
                accessibilityRole="button"
                accessibilityState={{ expanded }}
                accessibilityLabel={toggleLabel}
                onPress={() => toggleGroup(group.id)}
                style={styles.seeAll}
              >
                <ThemedText type="smallBold" style={{ color: colors.accentText }}>
                  {toggleLabel}
                </ThemedText>
              </PressableScale>
            ) : null}
          </View>
        );
      })}
    </View>
  );

  return (
    <ScreenLayout
      eyebrow={t("library.eyebrow")}
      title={t("library.title")}
      subtitle={tTv(t, "library.subtitle", "library.tvSubtitle")}
    >
      <Seo path="/library" />
      <Stagger>
        <SearchField
          value={query}
          onChangeText={setQuery}
          placeholder={t("library.searchPlaceholder")}
          onSubmit={(text) => {
            if (text.trim()) searchEverything();
          }}
          style={!tv && useGrid ? styles.searchWide : undefined}
        />

        {searching ? (
          <NavRow
            icon={{ ios: "magnifyingglass", android: "search", web: "search" }}
            label={t("library.searchEverything", { query: trimmedQuery })}
            subtitle={t("library.searchEverythingHint")}
            onPress={searchEverything}
          />
        ) : null}

        {searching && sections.length === 0 ? (
          <ThemedText type="small" themeColor="mutedForeground" role="status">
            {t("library.noResults")}
          </ThemedText>
        ) : null}

        {!searching ? <ContinueCard /> : null}

        {!searching && primaryEntries.length > 0 ? (
          <ResponsiveGrid columns={tv ? TV_GRID_COLUMNS : width >= Breakpoints.tablet ? 3 : 2}>
            {primaryEntries.map((entry, index) => (
              <PrimaryTile
                key={entry.id}
                entry={entry}
                label={entry.label}
                preferredFocus={tv && index === 0}
                onPress={() => router.push(entry.route)}
              />
            ))}
          </ResponsiveGrid>
        ) : null}

        {sections.map((section, sectionIndex) => {
          const entries = grouped[section.id] as LibrarySearchEntry[];
          const collapsible = !searching && !tv && LIBRARY_COLLAPSED_SECTIONS.has(section.id);
          const content =
            !searching && section.id === "learn"
              ? renderLearn(entries)
              : renderEntries(entries, primaryEntries.length === 0 && sectionIndex === 0);
          return (
            <Card key={section.id}>
              {collapsible ? (
                <CollapsibleSection title={t(section.titleKey)} icon={section.icon}>
                  {content}
                </CollapsibleSection>
              ) : (
                <>
                  <SectionHeader title={t(section.titleKey)} icon={section.icon} />
                  {content}
                </>
              )}
            </Card>
          );
        })}
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  rows: { gap: Spacing.two, marginTop: Spacing.three },
  /** Wide screens: don't stretch the search field across the whole column. */
  searchWide: { maxWidth: 640 },
  // Padding-based gutters keep exact 1/N columns (percent widths + `gap` overflow).
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
  learnGroups: { gap: Spacing.four, marginTop: Spacing.three },
  learnGroup: { gap: Spacing.one },
  seeAll: {
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: Spacing.two,
  },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/(tabs)/library");
