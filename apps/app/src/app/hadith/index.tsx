import { getLocalDateString } from "@munib-tracker/shared/utils";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { REMOTE_COLLECTIONS } from "@/api/hadith-remote";
import { useCollectionName } from "@/components/hadith/collection-name";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { NavRow } from "@/components/ui/nav-row";
import { SavedNavCard } from "@/components/ui/saved-nav-card";
import { SearchField } from "@/components/ui/search-field";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { BorderWidth, Breakpoints, Spacing } from "@/constants/theme";
import { HadithRepository } from "@/db";
import { useHadithTranslation } from "@/hooks/use-hadith-translation";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { navigateToContinue } from "@/lib/continue-activity";
import { dailyHadith, ensureDailyHadithPool } from "@/lib/daily-hadith";
import { getBundledCollection, getBundledCollections } from "@/lib/hadith";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { createFuzzyIndex } from "@/lib/search";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { collectionPageSchema } from "@/lib/seo/structured-data";
import { useContinueActivity } from "@/stores/continue-store";

const HADITH_ITEMS = getBundledCollections().map((collection) => ({
  name: collection.nameEnglish,
  path: `/hadith/${collection.id}`,
}));

function TodayHadithPreview({ hadith }: { hadith: NonNullable<ReturnType<typeof dailyHadith>> }) {
  const displayTranslation = useHadithTranslation(hadith);
  return (
    <ThemedText type="default" numberOfLines={3} style={styles.dailyBody}>
      {displayTranslation}
    </ThemedText>
  );
}

export default function HadithHomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  const tv = isTV();
  const { width } = useWindowDimensions();
  // Wide web / tablets: bookmarks + today side by side, collection lists in two columns.
  const wide = !tv && width >= Breakpoints.tablet;
  const twoCols = tv || (!tv && width >= Breakpoints.wide);

  const collectionName = useCollectionName();
  const [filter, setFilter] = useState("");
  const allBundled = getBundledCollections();
  // Collection filter: shared Fuse defaults over the localised + English names.
  const nameIndex = useMemo(
    () =>
      createFuzzyIndex(
        [...allBundled, ...REMOTE_COLLECTIONS].map((c) => ({
          id: c.id,
          local: collectionName(c),
          english: c.nameEnglish,
          arabic: c.nameArabic,
        })),
        [
          { key: "local", weight: 3, get: (c) => c.local },
          { key: "english", weight: 2, get: (c) => c.english },
          { key: "arabic", weight: 1, get: (c) => c.arabic },
        ],
      ),
    [allBundled, collectionName],
  );
  const matchedIds = useMemo(
    () => (filter.trim() ? new Set(nameIndex.search(filter).map((c) => c.id)) : null),
    [filter, nameIndex],
  );
  const bundled = matchedIds ? allBundled.filter((c) => matchedIds.has(c.id)) : allBundled;
  const remote = matchedIds
    ? REMOTE_COLLECTIONS.filter((c) => matchedIds.has(c.id))
    : REMOTE_COLLECTIONS;
  // Continue strip: the last hadith collection / hadith read (P5-34).
  const lastActivity = useContinueActivity();
  const resume = lastActivity?.kind === "hadith" ? lastActivity : null;
  const [today, setToday] = useState<ReturnType<typeof dailyHadith>>(undefined);
  const [bookmarkCount, setBookmarkCount] = useState(0);

  useEffect(() => {
    let active = true;
    void ensureDailyHadithPool().then(() => {
      if (active) setToday(dailyHadith(getLocalDateString()));
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    void HadithRepository.getBookmarks().then((list) => {
      if (active) setBookmarkCount(list.length);
    });
    return () => {
      active = false;
    };
  }, []);

  const open = (id: string) =>
    router.push({ pathname: "/hadith/[collection]", params: { collection: id } });

  const highlightsCard = (
    <Card key="highlights" style={twoCols ? styles.columnTv : undefined}>
      <SectionHeader
        title={t("hadith.highlights")}
        icon={{ ios: "star.fill", android: "star", web: "star" }}
      />
      <View style={styles.list}>
        {bundled.map((collection) => {
          // The bundled JSON loads lazily — show the count only once it is known
          // instead of a misleading "0 hadith" beside "Available offline".
          const loaded = getBundledCollection(collection.id)?.items.length;
          return (
            <NavRow
              key={collection.id}
              icon={{ ios: "book.closed.fill", android: "menu_book", web: "menu_book" }}
              label={collectionName(collection)}
              // "Available offline" is a phrase, not a count — as a trailing badge it
              // squeezed the collection name to one word per line on phones.
              subtitle={[
                loaded ? t("hadith.hadithCount", { count: loaded }) : null,
                t("hadith.availableOffline"),
              ]
                .filter(Boolean)
                .join(" · ")}
              onPress={() => open(collection.id)}
              href={`/hadith/${collection.id}`}
            />
          );
        })}
      </View>
    </Card>
  );

  const fullCollectionsCard = (
    <Card key="full" style={twoCols ? styles.columnTv : undefined}>
      <SectionHeader
        title={t("hadith.fullCollections")}
        icon={{ ios: "books.vertical.fill", android: "library_books", web: "library_books" }}
      />
      <View style={styles.list}>
        {remote.map((collection) => (
          <NavRow
            key={collection.id}
            icon={{ ios: "book.fill", android: "book", web: "book" }}
            label={collectionName(collection)}
            onPress={() => open(collection.id)}
          />
        ))}
      </View>
    </Card>
  );

  const savedCard = (
    <SavedNavCard
      key="saved"
      title={t("hadith.bookmarks")}
      viewLabel={t("hadith.viewBookmarks")}
      count={bookmarkCount > 0 ? bookmarkCount : undefined}
      headerIcon={{ ios: "bookmark.fill", android: "bookmark", web: "bookmark" }}
      rowIcon={{ ios: "bookmark", android: "bookmark_border", web: "bookmark_border" }}
      onPress={() => router.push("/hadith/bookmarks")}
    />
  );

  const todayCard = today ? (
    <Card
      key="today"
      onPress={() => router.push("/hadith/daily")}
      href="/hadith/daily"
      accessibilityLabel={t("dailyHadith.title")}
      style={{
        backgroundColor: tokens.status.info.soft,
        borderColor: tokens.status.info.color,
        borderWidth: BorderWidth.hairline,
      }}
    >
      <View style={styles.dailyHead}>
        <SymbolView
          name={{ ios: "sun.max.fill", android: "wb_sunny", web: "wb_sunny" }}
          size={16}
          tintColor={tokens.status.info.color}
        />
        <ThemedText type="smallBold" style={{ color: tokens.status.info.text }}>
          {t("dailyHadith.cardTitle")}
        </ThemedText>
      </View>
      <TodayHadithPreview hadith={today} />
      <ThemedText type="caption" style={{ color: tokens.status.info.text }}>
        {today.reference} · {t("dailyHadith.seeArchive")}
      </ThemedText>
    </Card>
  ) : null;

  return (
    <ScreenLayout
      eyebrow={t("hadith.eyebrow")}
      title={t("hadith.title")}
      subtitle={t("hadith.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo
        path="/hadith"
        breadcrumbs={[
          { name: t("tabs.home"), path: "/" },
          { name: t("hadith.title"), path: "/hadith" },
        ]}
        jsonLd={[
          collectionPageSchema({
            path: "/hadith",
            name: "Hadith Collections",
            description:
              "Authentic hadith from the major collections — the sayings and traditions of the Prophet Muhammad ﷺ.",
            items: HADITH_ITEMS,
            breadcrumbs: [
              { name: t("tabs.home"), path: "/" },
              { name: t("hadith.title"), path: "/hadith" },
            ],
          }),
        ]}
      />
      <Stagger>
        <SearchField
          value={filter}
          onChangeText={setFilter}
          placeholder={t("hadith.filterCollections")}
        />
        {resume && !matchedIds ? (
          <NavRow
            key="continue"
            icon={{ ios: "book.fill", android: "auto_stories", web: "auto_stories" }}
            label={t("hadith.continueReading")}
            subtitle={resume.subtitle ? `${resume.title} · ${resume.subtitle}` : resume.title}
            onPress={() => navigateToContinue(router, resume)}
          />
        ) : null}
        {matchedIds && bundled.length === 0 && remote.length === 0 ? (
          <EmptyState
            icon={{ ios: "magnifyingglass", android: "search", web: "search" }}
            title={t("search.noResultsTitle")}
            description={t("search.noResultsDesc")}
            actionLabel={t("common.clearSearch")}
            onAction={() => setFilter("")}
          />
        ) : null}
        {wide ? (
          <View style={styles.topRowWide}>
            <View style={styles.columnTv}>{savedCard}</View>
            {todayCard ? <View style={styles.columnTv}>{todayCard}</View> : null}
          </View>
        ) : (
          [savedCard, todayCard]
        )}

        {/* TV + wide web: highlights and full collections side by side. */}
        {twoCols ? (
          <View style={styles.columnsTv}>
            {highlightsCard}
            {fullCollectionsCard}
          </View>
        ) : (
          [highlightsCard, fullCollectionsCard]
        )}
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.two, marginTop: Spacing.three },
  columnsTv: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.four },
  columnTv: { flex: 1, minWidth: 0 },
  dailyHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  dailyBody: { marginBottom: Spacing.two },
  topRowWide: { flexDirection: "row", alignItems: "stretch", gap: Spacing.three },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/hadith");
