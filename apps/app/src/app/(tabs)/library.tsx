import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { type ReactNode, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, useWindowDimensions, View } from "react-native";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { BrowseTile } from "@/components/ui/browse-tile";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Divider } from "@/components/ui/divider";
import { IconButton } from "@/components/ui/icon-button";
import { IconWell } from "@/components/ui/icon-well";
import { NewBadge } from "@/components/ui/new-badge";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { SearchField } from "@/components/ui/search-field";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { useCategoryHue } from "@/components/ui/use-category-hue";
import { anchorHref } from "@/components/web/web-link-press";
import { type CategoryHueKey, Control, IconSize, Radius, Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { TvLayout } from "@/constants/tv-layout";
import { useDefaultCalendar } from "@/hooks/use-calendar-format";
import { useNativeTabletRail } from "@/hooks/use-large-screen-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { type ContinueKind, navigateToContinue } from "@/lib/continue-activity";
import { tTv } from "@/lib/i18n/t-tv";
import {
  createLibraryMenuSearch,
  groupLearnEntries,
  groupLibraryMenuBySection,
  LIBRARY_PRIMARY_IDS,
  LIBRARY_SECTIONS,
  type LibraryMenuDef,
  type LibrarySearchEntry,
  type LibrarySectionId,
  libraryMenuForDevice,
  libraryPreviewLimit,
  librarySectionColumns,
  libraryTileColumns,
  orderLibrarySections,
  useShowTvFinanceTools,
} from "@/lib/library-menu";
import { type AppIcon, NAMES_OF_ALLAH_ICON } from "@/lib/names-of-allah-ui";
import { isTV } from "@/lib/platform/is-tv";
import { formatRelativeWhen } from "@/lib/relative-time";
import { useChevronForward, useIsRTL } from "@/lib/rtl";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { continueStore, useContinueActivity } from "@/stores/continue-store";
import { useStore } from "@/stores/create-store";
import { useEnsureNewFeaturesLoaded, useNewFeatureIds } from "@/stores/new-features-store";
import { preferencesStore, usePreferencesReady } from "@/stores/preferences-store";

/** Hue of each primary tile (decoration only — never a status colour). */
const PRIMARY_HUES: Record<string, CategoryHueKey> = {
  quran: "accent",
  hadith: "sky",
  duas: "rose",
  zikr: "sage",
  names: "dawn",
  bookmarks: "violet",
};

/** Leading icon of the slim Continue row, per resumable kind. */
const CONTINUE_ICONS: Record<ContinueKind, AppIcon> = {
  quran: { ios: "book.fill", android: "menu_book", web: "menu_book" },
  hadith: { ios: "text.book.closed.fill", android: "auto_stories", web: "auto_stories" },
  dua: { ios: "hands.and.sparkles.fill", android: "volunteer_activism", web: "volunteer_activism" },
  zikr: { ios: "heart.fill", android: "favorite", web: "favorite" },
  durood: { ios: "sparkles", android: "auto_awesome", web: "auto_awesome" },
  names: NAMES_OF_ALLAH_ICON,
  audio: { ios: "waveform", android: "graphic_eq", web: "graphic_eq" },
  practice: { ios: "mic.fill", android: "mic", web: "mic" },
};

const SEARCH_ICON: AppIcon = { ios: "magnifyingglass", android: "search", web: "search" };

/** Phone row icon well; the divider inset lines up with the label after it. */
const ROW_WELL = 32;
const ROW_WELL_TV = 44;

type ListItem = {
  key: string;
  icon: AppIcon;
  label: string;
  subtitle?: string;
  /** Replaces the label + subtitle announcement (e.g. the Continue row's context). */
  accessibilityLabel?: string;
  isNew?: boolean;
  preferredFocus?: boolean;
  onPress: () => void;
  /** Web: crawlable `<a href>` for the destination. */
  href?: string;
};

function PrimaryTile({
  entry,
  label,
  isNew,
  preferredFocus,
  onPress,
  href,
}: {
  entry: LibraryMenuDef;
  label: string;
  isNew: boolean;
  preferredFocus: boolean;
  onPress: () => void;
  href?: string;
}) {
  const { t } = useTranslation();
  const hue = useCategoryHue(PRIMARY_HUES[entry.id] ?? "accent");
  return (
    <BrowseTile
      variant="compact"
      icon={entry.icon}
      label={label}
      hue={hue}
      isNew={isNew}
      newLabel={t("common.newBadge")}
      preferredFocus={preferredFocus}
      onPress={onPress}
      href={href}
    />
  );
}

/** Slim grouped-list row (~52pt): small icon well, label, optional New pill, chevron. */
function LibraryRow({ item }: { item: ListItem }) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const rtl = useIsRTL();
  const chevron = useChevronForward();
  const tv = isTV();
  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={
        item.accessibilityLabel ??
        [item.label, item.isNew ? t("common.newBadge") : undefined, item.subtitle]
          .filter(Boolean)
          .join(", ")
      }
      onPress={item.onPress}
      href={item.href}
      {...(tv && item.preferredFocus ? { hasTVPreferredFocus: true } : {})}
      style={[styles.row, tv && styles.rowTv]}
    >
      <IconWell
        icon={item.icon}
        well={tv ? ROW_WELL_TV : ROW_WELL}
        size={tv ? IconSize.lg : IconSize.md}
        radius={Radius.sm}
        tint={tokens.accentOnSoft}
      />
      <View style={styles.rowText}>
        <ThemedText
          type="small"
          numberOfLines={2}
          android_hyphenationFrequency="normal"
          style={tv ? { fontSize: TvLayout.bodyFontSize } : undefined}
        >
          {item.label}
        </ThemedText>
        {item.subtitle ? (
          <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
            {item.subtitle}
          </ThemedText>
        ) : null}
      </View>
      {item.isNew ? <NewBadge style={styles.rowBadge} /> : null}
      <SymbolView
        key={rtl ? "chevron-rtl" : "chevron-ltr"}
        name={chevron}
        size={tv ? IconSize.lg : IconSize.md}
        tintColor={colors.mutedForeground}
      />
    </PressableScale>
  );
}

/**
 * One card's grouped list: slim rows separated by hairlines (no card per row).
 * Wide web / tablet / TV lay the rows out in `columns` columns; a hairline sits
 * above every row except those in the first grid row.
 */
function LibraryList({ items, columns }: { items: readonly ListItem[]; columns: number }) {
  const tv = isTV();
  const inset = tvDp(tv ? ROW_WELL_TV : ROW_WELL) + Spacing.two + Spacing.three;
  if (columns <= 1) {
    return (
      <View style={styles.list}>
        {items.map((item, index) => (
          <View key={item.key}>
            {index > 0 ? <Divider inset={inset} /> : null}
            <LibraryRow item={item} />
          </View>
        ))}
      </View>
    );
  }
  return (
    <View style={[styles.list, styles.grid]}>
      {items.map((item, index) => (
        <View key={item.key} style={[styles.gridCell, { width: `${100 / columns}%` }]}>
          {index >= columns ? <Divider inset={inset} /> : null}
          <LibraryRow item={item} />
        </View>
      ))}
    </View>
  );
}

/** Slim "pick up where you left off" row; renders nothing when there is nothing to continue. */
function ContinueRow() {
  const activity = useContinueActivity();
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { colors } = useThemeTokens();
  const defaultCalendar = useDefaultCalendar();
  const tv = isTV();
  if (!activity) return null;

  const kindLabel = activity.isAudio
    ? t("home.continueKind.audio")
    : t(`home.continueKind.${activity.kind}`);
  const when = formatRelativeWhen(
    activity.updatedAt,
    i18n.language?.split("-")[0],
    t,
    defaultCalendar,
  );
  const subtitle = [kindLabel, t("home.continueLastOpened", { time: when })].join(" · ");
  const item: ListItem = {
    key: "continue",
    icon: activity.isAudio ? CONTINUE_ICONS.audio : CONTINUE_ICONS[activity.kind],
    label: activity.title,
    subtitle,
    accessibilityLabel: [t("home.continueTitle"), activity.title, activity.subtitle, subtitle]
      .filter(Boolean)
      .join(". "),
    onPress: () => navigateToContinue(router, activity),
  };

  return (
    <Card padding="two">
      <View style={styles.continueRow}>
        <View style={styles.continueMain}>
          <LibraryRow item={item} />
        </View>
        {/* A sibling, never nested inside the row's pressable (web <button> rule). */}
        <IconButton
          name={{ ios: "xmark", android: "close", web: "close" }}
          accessibilityLabel={t("home.continueDismissA11y")}
          onPress={() => void continueStore.getState().clear()}
          size={IconSize.sm}
          tintColor={colors.mutedForeground}
          hitTarget={tv ? TvLayout.minFocusTargetDp : 44}
          haptic="light"
        />
      </View>
    </Card>
  );
}

export default function LibraryScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const tv = isTV();
  const { width } = useWindowDimensions();
  // Native tablets: the side rail (232dp on iPad) eats into the window, so size
  // the grids on the content width. The web thresholds already allow for its rail.
  const tabletRail = useNativeTabletRail();
  const contentWidth = width - tabletRail.width;
  const columns = librarySectionColumns(contentWidth, tv);
  const tileColumns = libraryTileColumns(contentWidth, tv);
  // TV lists everything (lean-back, D-pad scrolls); elsewhere sections preview.
  const previewLimit = tv ? Number.POSITIVE_INFINITY : libraryPreviewLimit(columns);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(() => new Set());
  const [learnGroupId, setLearnGroupId] = useState<string | null>(null);
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

  // Browsing hides the primary six from the lists (they are tiles above).
  const browseMenu = useMemo(
    () => searchableMenu.filter((entry) => !primaryIds.has(entry.id)),
    [primaryIds, searchableMenu],
  );
  const grouped = useMemo(
    () => groupLibraryMenuBySection(browseMenu) as Record<LibrarySectionId, LibrarySearchEntry[]>,
    [browseMenu],
  );
  // Searching: every match, wherever it lives, flat in relevance order.
  const results = useMemo(
    () => (searching ? searchIndex.search(trimmedQuery) : []),
    [searchIndex, searching, trimmedQuery],
  );

  // D13: Settings › Appearance & home › Library order.
  const libraryOrder = useStore(preferencesStore, (s) => s.prefs.libraryMenuOrder);
  const sections = useMemo(
    () =>
      orderLibrarySections(LIBRARY_SECTIONS, libraryOrder).filter(
        (section) => grouped[section.id].length > 0,
      ),
    [grouped, libraryOrder],
  );
  const sectionTitle = useMemo(
    () => new Map(LIBRARY_SECTIONS.map((section) => [section.id, t(section.titleKey)])),
    [t],
  );

  const searchEverything = () =>
    router.push(`/search?q=${encodeURIComponent(trimmedQuery)}` as never);

  const toggleExpanded = (key: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const toItem = (
    entry: LibrarySearchEntry,
    extra?: Partial<Pick<ListItem, "subtitle" | "preferredFocus">>,
  ): ListItem => ({
    key: entry.id,
    icon: entry.icon,
    label: entry.label,
    isNew: newFeatureIds.has(entry.id),
    onPress: () => router.push(entry.route),
    href: anchorHref(entry.route),
    ...extra,
  });

  /** "See all (N)" / "Show fewer" header action for a list longer than the preview. */
  const seeAllProps = (key: string, total: number, group: string) => {
    if (total <= previewLimit) return {};
    const open = expanded.has(key);
    return {
      actionLabel: open ? t("library.showFewerShort") : t("library.seeAllShort", { total }),
      actionAccessibilityLabel: open
        ? t("library.showFewer", { group })
        : t("library.seeAll", { total, group }),
      onActionPress: () => toggleExpanded(key),
    };
  };

  const visibleRows = (key: string, entries: readonly LibrarySearchEntry[]) =>
    expanded.has(key) ? entries : entries.slice(0, previewLimit);

  const renderSection = (
    section: (typeof LIBRARY_SECTIONS)[number],
    sectionIndex: number,
  ): ReactNode => {
    const entries = grouped[section.id];
    const title = t(section.titleKey);
    const focusFirst = tv && primaryEntries.length === 0 && sectionIndex === 0;

    if (section.id === "learn") {
      const groups = groupLearnEntries(entries);
      const active = groups.find(({ group }) => group.id === learnGroupId) ?? groups[0];
      if (!active) return null;
      const key = `learn:${active.group.id}`;
      const groupTitle = t(active.group.titleKey);
      const chips = groups.map(({ group }) => (
        <Chip
          key={group.id}
          role="radio"
          label={t(group.titleKey)}
          selected={group.id === active.group.id}
          onPress={() => setLearnGroupId(group.id)}
        />
      ));
      return (
        <Card key={section.id}>
          <SectionHeader
            title={title}
            icon={section.icon}
            {...seeAllProps(key, active.entries.length, groupTitle)}
          />
          {columns > 1 || tv ? (
            <View accessibilityRole="radiogroup" style={styles.chipsWrap}>
              {chips}
            </View>
          ) : (
            <ScrollView
              horizontal
              accessibilityRole="radiogroup"
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              style={styles.chipsScroll}
              contentContainerStyle={styles.chipsRow}
            >
              {chips}
            </ScrollView>
          )}
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.groupHint}>
            {t(active.group.descriptionKey)}
          </ThemedText>
          <LibraryList
            columns={columns}
            items={visibleRows(key, active.entries).map((entry, index) =>
              toItem(entry, { preferredFocus: focusFirst && index === 0 }),
            )}
          />
        </Card>
      );
    }

    return (
      <Card key={section.id}>
        <SectionHeader
          title={title}
          icon={section.icon}
          {...seeAllProps(section.id, entries.length, title)}
        />
        <LibraryList
          columns={columns}
          items={visibleRows(section.id, entries).map((entry, index) =>
            toItem(entry, { preferredFocus: focusFirst && index === 0 }),
          )}
        />
      </Card>
    );
  };

  const searchItems: ListItem[] = searching
    ? [
        {
          key: "search-everything",
          icon: SEARCH_ICON,
          label: t("library.searchEverything", { query: trimmedQuery }),
          subtitle: t("library.searchEverythingHint"),
          onPress: searchEverything,
        },
        ...results.map((entry) => toItem(entry, { subtitle: sectionTitle.get(entry.section) })),
      ]
    : [];

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
          style={!tv && columns > 1 ? styles.searchWide : undefined}
        />

        {searching ? (
          <Card padding="two">
            <LibraryList items={searchItems} columns={1} />
            {results.length === 0 ? (
              <ThemedText
                type="small"
                themeColor="mutedForeground"
                role="status"
                style={styles.noResults}
              >
                {t("library.noResults")}
              </ThemedText>
            ) : null}
          </Card>
        ) : null}

        {!searching ? <ContinueRow /> : null}

        {!searching && primaryEntries.length > 0 ? (
          <Card padding="two">
            <ResponsiveGrid columns={tileColumns} gap={Spacing.one}>
              {primaryEntries.map((entry, index) => (
                <PrimaryTile
                  key={entry.id}
                  entry={entry}
                  label={entry.label}
                  isNew={newFeatureIds.has(entry.id)}
                  preferredFocus={tv && index === 0}
                  onPress={() => router.push(entry.route)}
                  href={anchorHref(entry.route)}
                />
              ))}
            </ResponsiveGrid>
          </Card>
        ) : null}

        {!searching ? sections.map((section, index) => renderSection(section, index)) : null}
      </Stagger>
      {/* Extra clearance so the floating tab bar never sits on the last row. */}
      {tv ? null : <View style={styles.tabBarClearance} />}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  /** Wide screens: don't stretch the search field across the whole column. */
  searchWide: { maxWidth: 640 },
  list: { marginTop: Spacing.two },
  // Padding-based gutters keep exact 1/N columns (percent widths + `gap` overflow).
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -Spacing.one,
  },
  gridCell: { paddingHorizontal: Spacing.one },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    minHeight: Control.row,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  rowTv: {
    minHeight: TvLayout.minFocusTarget,
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  rowText: { flex: 1, minWidth: 0, gap: Spacing.half },
  rowBadge: { alignSelf: "center" },
  continueRow: { flexDirection: "row", alignItems: "center", gap: Spacing.one },
  continueMain: { flex: 1, minWidth: 0 },
  chipsScroll: { marginTop: Spacing.three, marginHorizontal: -Spacing.three },
  chipsRow: { gap: Spacing.two, paddingHorizontal: Spacing.three },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  groupHint: { marginTop: Spacing.two },
  noResults: { paddingHorizontal: Spacing.two, paddingVertical: Spacing.two },
  tabBarClearance: { height: Spacing.four },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/(tabs)/library");
