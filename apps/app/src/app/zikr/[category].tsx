import { ZIKR_CATEGORY_IDS } from "@munib-tracker/shared/constants";
import type { AfterSalahPrayer, ZikrCategoryId, ZikrItem } from "@munib-tracker/shared/types";
import { isAfterSalahPrayer, isZikrCategoryId } from "@munib-tracker/shared/validators";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { type ListRenderItem, StyleSheet, View } from "react-native";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ContentState } from "@/components/ui/content-state";
import { EmptyState } from "@/components/ui/empty-state";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useResponsiveColumns } from "@/components/ui/responsive-grid";
import { SearchField } from "@/components/ui/search-field";
import { TvFlatList } from "@/components/ui/tv-flat-list";
import { TvUndoButton } from "@/components/ui/tv-undo-button";
import { AfterSalahPrayerChips } from "@/components/zikr/after-salah-prayer-chips";
import { ZikrRow } from "@/components/zikr/zikr-row";
import { Radius, Spacing } from "@/constants/theme";
import { trackReviewInteraction } from "@/features/reviews/lib/reviewEngagementBridge";
import { useAdhkarClock } from "@/hooks/use-adhkar-clock";
import { useAdhkarDayCounts } from "@/hooks/use-adhkar-day-counts";
import { useContentCorpus } from "@/hooks/use-content-corpus";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useUndoToast } from "@/hooks/use-undo-toast";
import {
  type AdhkarScope,
  adhkarScopeState,
  afterSalahScopeStates,
  completeAllEntries,
  firstPendingIndex,
  isSessionItemOptional,
  sessionItemCount,
  sessionItemTarget,
} from "@/lib/adhkar-session";
import { afterSalahApplicablePrayers } from "@/lib/after-salah-adhkar-progress";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { createZikrSearch } from "@/lib/search";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { collectionPageSchema } from "@/lib/seo/structured-data";
import { ZIKR_CORPUS, zikrByCategory } from "@/lib/zikr";
import { zikrListRowProgress } from "@/lib/zikr-list-progress";
import { useFavoriteZikrIds, usePreferencesActions } from "@/stores/preferences-store";

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
  const { colors, tokens } = useThemeTokens();
  const tv = isTV();
  // Wide web / tablets: adhkar flow into 2-3 columns (FlatList stays virtualized).
  const autoColumns = useResponsiveColumns({ max: 3 });
  const columns = tv ? 1 : autoColumns;
  const params = useLocalSearchParams<{
    category: string | string[];
    prayer?: string | string[];
  }>();
  const favoriteIds = useFavoriteZikrIds();
  const { toggleFavorite, setFavoriteOrder } = usePreferencesActions();
  const undoToast = useUndoToast();
  // Un-starring is reversible: remove now and offer Undo (adding stays instant).
  const onToggleFavorite = useCallback(
    (id: string) => {
      if (!favoriteIds.includes(id)) {
        void toggleFavorite(id);
        return;
      }
      const previous = [...favoriteIds];
      void undoToast.run({
        do: () => toggleFavorite(id),
        undo: () => setFavoriteOrder(previous),
        messageKey: "zikr.favoriteRemoved",
      });
    },
    [favoriteIds, setFavoriteOrder, toggleFavorite, undoToast],
  );
  const clock = useAdhkarClock();
  // Counts for the adhkar day (Fajr → Fajr), the same day the session logs to.
  const day = useAdhkarDayCounts(clock.date);
  const zikrCounts = day.counts;
  const [confirmAll, setConfirmAll] = useState(false);
  const [query, setQuery] = useState("");
  const searching = query.trim().length > 0;
  // Cold opens (notification / deep link) never visit /zikr first, so the corpus
  // must be warmed here — zikrByCategory is sync and returns [] until ready.
  const { ready: corpusReady } = useContentCorpus(ZIKR_CORPUS);

  const categoryParam = paramValue(params.category);
  const isKnownCategory = isZikrCategoryId(categoryParam ?? "");
  const categoryId = (isKnownCategory ? categoryParam : "anytime") as ZikrCategoryId;
  // Memoized: a fresh array each render rebuilt the search index on every keystroke.
  const allItems = useMemo(
    () => (corpusReady ? zikrByCategory(categoryId) : []),
    [categoryId, corpusReady],
  );

  // After-salah adhkar are always logged per salah (never one shared "All"
  // count), so the list is scoped to one salah — the current one by default.
  // An item with no `prayers` tag is recited after every fard salah.
  const showPrayerFilter = categoryId === "after_prayer";
  // Live Activity / notification deep links (`?prayer=asr`) can resolve after the
  // first paint, or update while this screen is already mounted.
  const linkedPrayer = useMemo((): AfterSalahPrayer | null => {
    if (!showPrayerFilter) return null;
    const raw = paramValue(params.prayer);
    return raw && isAfterSalahPrayer(raw) ? raw : null;
  }, [showPrayerFilter, params.prayer]);
  const [prayerFilter, setPrayerFilter] = useState<AfterSalahPrayer>(
    () => linkedPrayer ?? clock.currentAfterSalah,
  );
  useEffect(() => {
    if (linkedPrayer) setPrayerFilter(linkedPrayer);
  }, [linkedPrayer]);

  const scope = useMemo<AdhkarScope>(
    () => (showPrayerFilter ? { categoryId, prayer: prayerFilter } : { categoryId }),
    [categoryId, prayerFilter, showPrayerFilter],
  );

  const items = useMemo(() => {
    if (!showPrayerFilter) return allItems;
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
  // TV: the first zikr row takes initial D-pad focus (not the search field).
  // Pinned once so chip/search changes never yank focus back into the list.
  const tvFirstFocusId = useRef<string | null>(null);
  if (tv && tvFirstFocusId.current == null && !searching && filtered[0]) {
    tvFirstFocusId.current = filtered[0].id;
  }

  const scopeState = useMemo(
    () => adhkarScopeState(scope, zikrCounts, clock.now, clock.times, items),
    [clock.now, clock.times, items, scope, zikrCounts],
  );
  const chipStates = useMemo(
    () => (showPrayerFilter ? afterSalahScopeStates(zikrCounts, clock.now, clock.times) : null),
    [clock.now, clock.times, showPrayerFilter, zikrCounts],
  );

  /** Open the guided session — at a tapped zikr, or at the first one still pending. */
  const openSession = useCallback(
    (startId?: string) => {
      const start = startId ?? items[firstPendingIndex(items, zikrCounts, scope)]?.id;
      router.push({
        pathname: "/zikr/session/[category]",
        params: {
          category: categoryId,
          ...(showPrayerFilter ? { prayer: prayerFilter } : {}),
          ...(start ? { start } : {}),
        },
      });
    },
    [categoryId, items, prayerFilter, router, scope, showPrayerFilter, zikrCounts],
  );
  const onOpen = useCallback((id: string) => openSession(id), [openSession]);
  const onInfo = useCallback(
    (id: string) =>
      router.push({
        pathname: "/zikr/detail/[id]",
        params: showPrayerFilter ? { id, prayer: prayerFilter } : { id },
      }),
    [prayerFilter, router, showPrayerFilter],
  );

  const keyExtractor = useCallback((item: ZikrItem) => item.id, []);

  const renderZikrRow = useCallback(
    (item: ZikrItem) => {
      const { completed, progressLabel } = zikrListRowProgress(
        item,
        zikrCounts,
        showPrayerFilter ? prayerFilter : "all",
      );

      return (
        <ZikrRow
          item={item}
          target={sessionItemTarget(item, scope)}
          optional={isSessionItemOptional(item, scope)}
          index={indexById.get(item.id)}
          isFavorite={favoriteIds.includes(item.id)}
          onToggleFavorite={onToggleFavorite}
          onPress={onOpen}
          onInfo={onInfo}
          completed={completed}
          progressLabel={progressLabel}
          preferredFocus={item.id === tvFirstFocusId.current}
        />
      );
    },
    [
      favoriteIds,
      indexById,
      onOpen,
      prayerFilter,
      scope,
      onToggleFavorite,
      onInfo,
      showPrayerFilter,
      zikrCounts,
    ],
  );

  const renderItem = useCallback<ListRenderItem<ZikrItem>>(
    ({ item }) =>
      columns > 1 ? (
        <View style={[styles.gridCell, { width: `${100 / columns}%` as const }]}>
          {renderZikrRow(item)}
        </View>
      ) : (
        renderZikrRow(item)
      ),
    [columns, renderZikrRow],
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

  const allDone = scopeState.total > 0 && scopeState.completed >= scopeState.total;
  const started = items.some((item) => sessionItemCount(item, zikrCounts, scope) > 0);
  const statusColor =
    scopeState.status === "done"
      ? tokens.status.success.color
      : scopeState.status === "missed"
        ? tokens.status.warning.color
        : scopeState.status === "upcoming"
          ? colors.mutedForeground
          : colors.accent;
  const setName = showPrayerFilter
    ? t("zikrSession.afterPrayerEyebrow", { prayer: t(`prayers.${prayerFilter}`) })
    : t(`zikrCat.${categoryId}`);

  const listChrome = (
    <>
      {showPrayerFilter && chipStates ? (
        <View style={styles.chipsRow}>
          <AfterSalahPrayerChips
            selected={prayerFilter}
            onSelect={setPrayerFilter}
            states={chipStates}
            current={clock.currentAfterSalah}
          />
        </View>
      ) : null}
      {scopeState.total > 0 ? (
        <View style={[styles.sessionCard, { backgroundColor: colors.muted }]}>
          <View style={styles.progressHeader}>
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
              <ThemedText type="smallBold" style={{ color: statusColor }}>
                {t(`zikrSession.status.${scopeState.status}`)}
              </ThemedText>
            </View>
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("zikr.afterSalahProgress", {
                completed: scopeState.completed,
                total: scopeState.total,
              })}
            </ThemedText>
          </View>
          <ProgressBar
            value={scopeState.completed / scopeState.total}
            accessibilityLabel={t("a11yProgress.adhkarSession")}
            height={4}
            color={allDone ? tokens.status.success.color : undefined}
          />
          {/* Wide: one full-width row (aligned with the progress bar above);
              phones: stacked. Both buttons share one height so they read as a pair. */}
          <View style={[styles.sessionActions, columns > 1 && styles.sessionActionsWide]}>
            <Button
              style={columns > 1 ? styles.primaryActionWide : undefined}
              label={
                allDone
                  ? t("zikrSession.reviewSet")
                  : started
                    ? t("zikrSession.continueSet", {
                        remaining: scopeState.total - scopeState.completed,
                      })
                    : t("zikrSession.startSet")
              }
              icon={
                allDone
                  ? { ios: "checkmark.seal.fill", android: "verified", web: "verified" }
                  : { ios: "play.fill", android: "play_arrow", web: "play_arrow" }
              }
              variant={allDone ? "secondary" : "primary"}
              onPress={() => openSession()}
              fullWidth={columns === 1}
            />
            {!allDone ? (
              <Button
                label={t("zikrSession.markAll")}
                variant="secondary"
                icon={{ ios: "checkmark.circle", android: "task_alt", web: "task_alt" }}
                accessibilityHint={t("zikrSession.markAllHint")}
                onPress={() => setConfirmAll(true)}
                fullWidth={columns === 1}
                style={columns > 1 ? styles.secondaryActionWide : undefined}
              />
            ) : null}
          </View>
          {showPrayerFilter ? (
            <Button
              label={t("handsFreeZikr.sequence.openFromSession")}
              variant="ghost"
              size="sm"
              icon={{
                ios: "circle.dotted",
                android: "radio_button_checked",
                web: "radio_button_checked",
              }}
              onPress={() =>
                router.push({ pathname: "/tasbeeh/sequence", params: { prayer: prayerFilter } })
              }
            />
          ) : null}
        </View>
      ) : null}
      <SearchField
        value={query}
        onChangeText={setQuery}
        placeholder={t("zikr.searchInCategory")}
        style={styles.search}
      />
    </>
  );

  return (
    <ScreenLayout
      eyebrow={t("zikr.categoryEyebrow")}
      title={isKnownCategory ? t(`zikrCat.${categoryId}`) : t("zikr.title")}
      subtitle={
        !isKnownCategory || !corpusReady
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
      {/* TV: toasts take no focus — the Undo lives on the page (B-04). */}
      <TvUndoButton controller={undoToast} />
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
      {!isKnownCategory ? (
        // An unknown category never silently becomes "anytime" (B-55): nothing
        // is shown, counted or logged against a set the user did not open.
        <EmptyState
          icon={{ ios: "questionmark.circle", android: "help", web: "help" }}
          title={t("zikr.unknownCategoryTitle")}
          description={t("zikr.unknownCategoryDesc")}
          actionLabel={t("zikr.browseAdhkar")}
          onAction={() => router.replace("/zikr")}
        />
      ) : !corpusReady ? (
        <ContentState status="loading" skeleton="rows" loadingLabel={t("zikr.loadingAdhkar")} />
      ) : allItems.length === 0 ? (
        <EmptyState
          icon={{ ios: "text.book.closed", android: "menu_book", web: "menu_book" }}
          title={t("zikr.emptyTitle")}
          description={t("zikr.emptyDesc")}
        />
      ) : (
        <Card style={tv ? undefined : styles.listCard}>
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
                // numColumns also needs a remount when the column count changes.
                key={`${showPrayerFilter ? `after-salah-${prayerFilter}` : categoryId}-${columns}`}
                numColumns={columns}
                columnWrapperStyle={columns > 1 ? styles.gridRow : undefined}
                style={styles.flatList}
                data={filtered}
                extraData={zikrCounts}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                ItemSeparatorComponent={ListSeparator}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                initialNumToRender={12}
                maxToRenderPerBatch={8}
                windowSize={7}
                removeClippedSubviews={false}
                ListEmptyComponent={empty ?? undefined}
              />
            </View>
          )}
        </Card>
      )}
      <ConfirmDialog
        visible={confirmAll}
        title={t("zikrSession.confirmAllTitle")}
        message={t("zikrSession.confirmAllMessage", { set: setName })}
        confirmLabel={t("zikrSession.markAll")}
        onConfirm={() => {
          void day.setCounts(completeAllEntries(items, scope));
          trackReviewInteraction("mark_zikr");
        }}
        onClose={() => setConfirmAll(false)}
      />
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
  chipsRow: { marginBottom: Spacing.three },
  sessionCard: {
    marginBottom: Spacing.three,
    gap: Spacing.twoHalf,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  // Primary "Start / Continue" on its own line (never squeezed); "Mark all" as a quieter secondary.
  sessionActions: { gap: Spacing.two },
  sessionActionsWide: { flexDirection: "row", alignItems: "stretch" },
  primaryActionWide: { flex: 2, alignSelf: "stretch" },
  secondaryActionWide: { flex: 1, alignSelf: "stretch" },
  search: { marginBottom: Spacing.three },
  statusRow: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: Spacing.two,
  },
  separator: { height: Spacing.two },
  gridRow: { marginHorizontal: -Spacing.one },
  gridCell: { paddingHorizontal: Spacing.one },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/zikr/[category]");
