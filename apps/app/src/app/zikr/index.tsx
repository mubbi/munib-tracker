import { ZIKR_CATEGORY_IDS } from "@munib-tracker/shared/constants";
import type { ZikrCategoryId, ZikrItem } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useWindowDimensions, View } from "react-native";
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
import { ZikrCaughtUpCard, ZikrDueCard } from "@/components/zikr/zikr-due-card";
import { ZikrRow } from "@/components/zikr/zikr-row";
import { Breakpoints, type CategoryHueKey, Spacing } from "@/constants/theme";
import { useAdhkarClock } from "@/hooks/use-adhkar-clock";
import { useAdhkarDayCounts } from "@/hooks/use-adhkar-day-counts";
import { useContentCorpus } from "@/hooks/use-content-corpus";
import { useTimeFormat } from "@/hooks/use-time-format";
import { type AdhkarScope, adhkarDueNow, type TimedAdhkarSet } from "@/lib/adhkar-session";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { formatPrayerTime } from "@/lib/prayer-times";
import { createZikrSearch } from "@/lib/search";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { collectionPageSchema } from "@/lib/seo/structured-data";
import { ZIKR_CATEGORY_ICONS, ZIKR_CORPUS, zikrByCategory } from "@/lib/zikr";
import { zikrCategoryTodayProgress, zikrListRowProgress } from "@/lib/zikr-list-progress";
import { pushZikrDetail } from "@/lib/zikr-quran";
import { useLocation } from "@/stores/location-store";
import { useFavoriteZikrIds } from "@/stores/preferences-store";

/** Below this width the two shortcut rows stack — a half-width NavRow leaves the label narrower than one word. */
const SHORTCUT_TWO_COLUMN_MIN_WIDTH = 480;

/** Due-now cards shown at once (the rest are a tap away in their category). */
const MAX_DUE = 3;

/**
 * Hub groups: the day's rhythm (time-of-day sets + anytime) and the sets that
 * orbit each salah. Every category appears exactly once.
 */
const ZIKR_GROUPS: ReadonlyArray<{
  id: "daily" | "salah";
  hue: CategoryHueKey;
  icon: AppIcon;
  categories: readonly ZikrCategoryId[];
}> = [
  {
    id: "daily",
    hue: "dawn",
    icon: { ios: "sun.max.fill", android: "wb_sunny", web: "wb_sunny" },
    categories: ["morning", "evening", "before_sleep", "anytime"],
  },
  {
    id: "salah",
    hue: "accent",
    icon: { ios: "moon.stars.fill", android: "mosque", web: "mosque" },
    categories: ["before_prayer", "after_azan", "after_prayer"],
  },
];

export default function ZikrHomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const tv = isTV();
  const { width } = useWindowDimensions();
  const tileColumns = tv ? 3 : width >= 1200 ? 4 : width >= Breakpoints.tablet ? 3 : 2;
  const favoriteIds = useFavoriteZikrIds();
  const timeFormat = useTimeFormat();
  const location = useLocation();
  // Progress follows the adhkar day (Fajr → Fajr), like the sessions that log it.
  const clock = useAdhkarClock();
  const zikrCounts = useAdhkarDayCounts(clock.date).counts;
  const { items: zikrItems, ready: zikrReady } = useContentCorpus(ZIKR_CORPUS);
  const [query, setQuery] = useState("");
  const searching = query.trim().length > 0;

  const searchIndex = useMemo(() => createZikrSearch(zikrItems), [zikrItems]);
  const results = useMemo(
    () => (searching ? searchIndex.search(query) : []),
    [query, searchIndex, searching],
  );

  const indexById = useMemo(() => {
    const map = new Map<string, number>();
    if (!zikrReady) return map;
    for (const id of ZIKR_CATEGORY_IDS) {
      zikrByCategory(id).forEach((item, position) => {
        map.set(item.id, position + 1);
      });
    }
    return map;
  }, [zikrReady]);

  const dueNow = useMemo(
    () => (zikrReady ? adhkarDueNow(zikrCounts, clock.now, clock.times) : { due: [] }),
    [clock.now, clock.times, zikrCounts, zikrReady],
  );

  const onOpenDetail = useCallback((id: string) => pushZikrDetail(router, id), [router]);
  const openCategory = useCallback(
    (category: ZikrCategoryId) =>
      router.push({ pathname: "/zikr/[category]", params: { category } }),
    [router],
  );
  // The session opens at the first zikr still pending.
  const openSession = useCallback(
    (scope: AdhkarScope) =>
      router.push({
        pathname: "/zikr/session/[category]",
        params: {
          category: scope.categoryId,
          ...(scope.prayer ? { prayer: scope.prayer } : {}),
        },
      }),
    [router],
  );

  const setTitle = (scope: AdhkarScope) =>
    scope.categoryId === "after_prayer" && scope.prayer
      ? t("zikrSession.afterPrayerEyebrow", { prayer: t(`prayers.${scope.prayer}`) })
      : t(`zikrCat.${scope.categoryId}`);

  const dueSection =
    zikrReady && clock.times ? (
      <View key="due" style={styles.section}>
        <SectionHeader
          title={t("zikr.dueNow")}
          icon={{ ios: "clock.fill", android: "schedule", web: "schedule" }}
        />
        {dueNow.due.length > 0 ? (
          <ResponsiveGrid columns={tv ? 2 : undefined} maxColumns={3} gap={Spacing.three}>
            {dueNow.due.slice(0, MAX_DUE).map((set, index) => (
              <DueCard
                key={`${set.scope.categoryId}:${set.scope.prayer ?? ""}`}
                set={set}
                title={setTitle(set.scope)}
                onPress={() => openSession(set.scope)}
                preferredFocus={index === 0}
              />
            ))}
          </ResponsiveGrid>
        ) : (
          <ZikrCaughtUpCard
            title={t("zikr.caughtUpTitle")}
            body={
              dueNow.next?.window.start
                ? t("zikr.caughtUpNext", {
                    set: setTitle(dueNow.next.scope),
                    time: formatPrayerTime(dueNow.next.window.start, timeFormat, location.timeZone),
                  })
                : t("zikr.caughtUpBody")
            }
          />
        )}
      </View>
    ) : null;

  // Compact shortcuts — the old titled cards repeated their labels ("Favorites
  // → See all") and stacked three boxes above the content.
  const shortcuts = (
    <ResponsiveGrid
      key="shortcuts"
      columns={width >= SHORTCUT_TWO_COLUMN_MIN_WIDTH ? 2 : 1}
      gap={Spacing.two}
    >
      <NavRow
        icon={{ ios: "bookmark.fill", android: "bookmark", web: "bookmark" }}
        label={t("zikr.favorites")}
        count={favoriteIds.length > 0 ? favoriteIds.length : undefined}
        onPress={() => router.push("/zikr/favorites")}
      />
      <NavRow
        icon={{ ios: "square.and.pencil", android: "edit_note", web: "edit_note" }}
        label={t("customAdhkar.title")}
        onPress={() => router.push("/adhkar-builder")}
      />
    </ResponsiveGrid>
  );

  const groups = ZIKR_GROUPS.map((group) => (
    <CategoryGroup
      key={group.id}
      group={group}
      columns={tileColumns}
      ready={zikrReady}
      counts={zikrCounts}
      onOpen={openCategory}
    />
  ));

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
        <SearchField
          key="search"
          value={query}
          onChangeText={setQuery}
          placeholder={t("zikr.searchPlaceholder")}
        />

        {searching ? (
          !zikrReady ? null : results.length === 0 ? (
            <EmptyState
              key="empty"
              icon={{ ios: "magnifyingglass", android: "search", web: "search" }}
              title={t("zikr.noResults")}
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
          )
        ) : null}

        {!searching ? [dueSection, shortcuts, ...groups] : null}
      </Stagger>
    </ScreenLayout>
  );
}

function DueCard({
  set,
  title,
  onPress,
  preferredFocus,
}: {
  set: TimedAdhkarSet;
  title: string;
  onPress: () => void;
  preferredFocus?: boolean;
}) {
  const group = ZIKR_GROUPS.find((g) => g.categories.includes(set.scope.categoryId));
  const hue = useCategoryHue(group?.hue ?? "accent");
  return (
    <ZikrDueCard
      set={set}
      title={title}
      icon={ZIKR_CATEGORY_ICONS[set.scope.categoryId]}
      hue={hue}
      onPress={onPress}
      preferredFocus={preferredFocus}
    />
  );
}

function CategoryGroup({
  group,
  columns,
  ready,
  counts,
  onOpen,
}: {
  group: (typeof ZIKR_GROUPS)[number];
  columns: number;
  ready: boolean;
  counts: Record<string, number>;
  onOpen: (id: ZikrCategoryId) => void;
}) {
  const { t } = useTranslation();
  const hue = useCategoryHue(group.hue);
  return (
    <View style={styles.section}>
      <SectionHeader title={t(`zikr.group.${group.id}`)} icon={group.icon} />
      <ResponsiveGrid columns={columns} gap={Spacing.two}>
        {group.categories.map((id) => {
          const size = ready ? zikrByCategory(id).length : undefined;
          const progress = ready ? zikrCategoryTodayProgress(id, counts) : undefined;
          return (
            <BrowseTile
              key={id}
              icon={ZIKR_CATEGORY_ICONS[id]}
              label={t(`zikrCat.${id}`)}
              countLabel={
                progress && progress.total > 0
                  ? t("zikrSession.progressShort", progress)
                  : size != null
                    ? t("zikr.adhkarCount", { count: size })
                    : undefined
              }
              progress={progress}
              hue={hue}
              onPress={() => onOpen(id)}
            />
          );
        })}
      </ResponsiveGrid>
    </View>
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
  section: { gap: Spacing.two },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/zikr");
