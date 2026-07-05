import type { HadithItem, HadithSection } from "@munib-tracker/shared/types";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { InteractionManager, Share, StyleSheet, TextInput, View } from "react-native";

import { getRemoteCollection, isRemoteCollection } from "@/api/hadith-remote";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { NavRow } from "@/components/ui/nav-row";
import { Pill } from "@/components/ui/pill";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { HadithRepository } from "@/db";
import { useRemoteCollection } from "@/hooks/use-hadith";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { buildHadithActivity, buildHadithCollectionActivity } from "@/lib/continue-activity";
import {
  getBundledCollection,
  getBundledCollectionData,
  getBundledCollections,
} from "@/lib/hadith";
import { arabicReadingLayout } from "@/lib/reading-typography";
import { createHadithSearch, type FuzzyIndex } from "@/lib/search";
import { collectionPageSchema } from "@/lib/seo/structured-data";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";
import { recordContinueActivity } from "@/stores/continue-store";
import { usePreferences } from "@/stores/preferences-store";

/** Build the plain-text body shared for a hadith (arabic + english + reference). */
function hadithShareMessage(item: HadithItem): string {
  return [item.arabic, item.english, item.reference].filter(Boolean).join("\n\n");
}

const PAGE_SIZE = 20;

/**
 * Pre-render a static HTML page for every bundled hadith collection at web
 * export time, so each has its own crawlable URL and metadata.
 */
export function generateStaticParams(): Array<{ collection: string }> {
  return getBundledCollections().map((c) => ({ collection: c.id }));
}

export default function HadithCollectionScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const params = useLocalSearchParams<{ collection: string; q?: string }>();
  const collectionId = params.collection ?? "";
  const remote = isRemoteCollection(collectionId);

  const bundled = getBundledCollection(collectionId);
  const bundledData = useMemo(() => getBundledCollectionData(collectionId), [collectionId]);
  const remoteQuery = useRemoteCollection(remote ? collectionId : null);

  const collection = bundled?.collection ?? getRemoteCollection(collectionId);
  const data = remote ? remoteQuery.data : bundledData;
  const sections = data?.sections ?? [];
  const allItems = data?.items ?? [];

  // Seed the in-collection search from a `q` param (e.g. arriving from universal
  // search) so the matched hadith is already filtered into view.
  const [query, setQuery] = useState(params.q ?? "");
  const [sectionId, setSectionId] = useState<string | null>(null);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const searching = query.trim().length > 0;

  // Fuzzy index over this collection's hadith. Building it is O(n) over every
  // item (a remote collection can hold thousands), so we never do it in a
  // render-blocking useMemo. Instead we keep it in state and build it lazily:
  // deferred off the interaction thread once data has loaded, or immediately
  // (synchronously) the moment the user starts searching if that deferred build
  // hasn't landed yet. Keyed to the item list so it rebuilds only when the data
  // changes — never per keystroke.
  const [hadithIndex, setHadithIndex] = useState<{
    key: HadithItem[];
    index: FuzzyIndex<HadithItem>;
  } | null>(null);
  const activeIndex = hadithIndex?.key === allItems ? hadithIndex.index : null;
  useEffect(() => {
    // Already have an index for exactly this item list — nothing to do.
    if (hadithIndex?.key === allItems) return;
    if (allItems.length === 0) {
      if (hadithIndex) setHadithIndex(null);
      return;
    }
    const build = () => setHadithIndex({ key: allItems, index: createHadithSearch(allItems) });
    // Searching now: build synchronously so results aren't stalled behind a
    // pending interaction (also covers the `q`-seeded arrival case).
    if (searching) {
      build();
      return;
    }
    // Idle: defer the build so it doesn't compete with mount/nav animations.
    const handle = InteractionManager.runAfterInteractions(build);
    return () => handle.cancel();
  }, [allItems, searching, hadithIndex]);

  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  useEffect(() => {
    let active = true;
    void HadithRepository.getBookmarks().then((list) => {
      if (active) setBookmarked(new Set(list.map((b) => b.hadithId)));
    });
    return () => {
      active = false;
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (collection) {
        recordContinueActivity(buildHadithCollectionActivity(collectionId, collection.nameEnglish));
      }
    }, [collection, collectionId]),
  );

  // What to show: the section list, or a filtered list of hadith.
  const showSectionList = sections.length > 0 && !sectionId && !searching;

  const listItems = useMemo(() => {
    // `activeIndex` is null only for the single frame between a search starting
    // and the synchronous build effect landing — treat that as "no results yet".
    if (searching) return activeIndex ? activeIndex.search(query) : [];
    if (sectionId) return allItems.filter((h) => h.chapterId === sectionId);
    return allItems;
  }, [allItems, activeIndex, query, sectionId, searching]);
  const shown = listItems.slice(0, visible);

  const activeSection = sections.find((s) => s.id === sectionId);

  const toggleBookmark = async (item: HadithItem) => {
    const added = await HadithRepository.toggleBookmark(item);
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (added) next.add(item.id);
      else next.delete(item.id);
      return next;
    });
  };

  const resetPage = () => setVisible(PAGE_SIZE);

  if (!collection) {
    return (
      <ScreenLayout
        title={t("hadith.title")}
        onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
      >
        <Seo
          path={`/hadith/${collectionId}`}
          title={t("hadith.notFoundTitle")}
          description={t("hadith.notFoundDesc")}
          index={false}
        />
        <EmptyState
          icon={{ ios: "questionmark.circle", android: "help", web: "help" }}
          title={t("hadith.notFoundTitle")}
          description={t("hadith.notFoundDesc")}
        />
      </ScreenLayout>
    );
  }

  const isLoading = remote && remoteQuery.isPending;
  const failedOffline = remote && remoteQuery.isError && !remoteQuery.data;

  const goBackToBooks = () => {
    setSectionId(null);
    setQuery("");
    resetPage();
  };

  const collectionName = collection.nameEnglish;
  const collectionDescription = `Read hadith from ${collectionName} — the sayings and traditions of the Prophet Muhammad ﷺ, with narrator and grading details.`;
  const collectionBreadcrumbs = [
    { name: t("tabs.home"), path: "/" },
    { name: t("hadith.title"), path: "/hadith" },
    { name: collectionName, path: `/hadith/${collectionId}` },
  ];

  return (
    <ScreenLayout
      eyebrow={t("hadith.title")}
      title={activeSection ? activeSection.name : collection.nameEnglish}
      subtitle={activeSection ? collection.nameEnglish : collection.nameArabic}
      onBack={
        activeSection
          ? goBackToBooks
          : () => (router.canGoBack() ? router.back() : router.replace("/"))
      }
    >
      <Seo
        path={`/hadith/${collectionId}`}
        title={collectionName}
        description={collectionDescription}
        type="article"
        breadcrumbs={collectionBreadcrumbs}
        jsonLd={[
          collectionPageSchema({
            path: `/hadith/${collectionId}`,
            name: collectionName,
            description: collectionDescription,
            breadcrumbs: collectionBreadcrumbs,
          }),
        ]}
      />
      <Stagger>
        {isLoading ? (
          <EmptyState
            icon={{ ios: "arrow.down.circle", android: "download", web: "download" }}
            title={t("hadith.loading")}
          />
        ) : failedOffline ? (
          <EmptyState
            icon={{ ios: "wifi.slash", android: "wifi_off", web: "wifi_off" }}
            title={t("hadith.offlineTitle")}
            description={t("hadith.offlineDesc")}
          />
        ) : (
          <View style={styles.contentStack}>
            <Card padding="four" style={showSectionList ? undefined : styles.readingColumn}>
              <View style={styles.searchCard}>
                <TextInput
                  value={query}
                  onChangeText={(text) => {
                    setQuery(text);
                    resetPage();
                  }}
                  placeholder={t("hadith.searchPlaceholder")}
                  placeholderTextColor={colors.mutedForeground}
                  accessibilityLabel={t("hadith.searchPlaceholder")}
                  style={[
                    styles.input,
                    { backgroundColor: colors.muted, color: colors.foreground },
                  ]}
                />
                <ThemedText type="caption" themeColor="mutedForeground">
                  {showSectionList
                    ? t("hadith.bookCount", { count: sections.length })
                    : t("hadith.hadithCount", { count: listItems.length })}
                </ThemedText>
              </View>
            </Card>

            {showSectionList ? (
              <Card padding="four">
                <View style={styles.list}>
                  {sections.map((section) => (
                    <SectionRow
                      key={section.id}
                      section={section}
                      onPress={() => {
                        setSectionId(section.id);
                        resetPage();
                      }}
                    />
                  ))}
                </View>
              </Card>
            ) : shown.length === 0 ? (
              <EmptyState
                icon={{ ios: "text.magnifyingglass", android: "search", web: "search" }}
                title={t("hadith.emptyTitle")}
                description={t("hadith.emptyDesc")}
              />
            ) : (
              <View style={styles.hadithList}>
                {shown.map((item) => (
                  <HadithCard
                    key={item.id}
                    item={item}
                    collectionName={collection.nameEnglish}
                    isBookmarked={bookmarked.has(item.id)}
                    onBookmark={() => toggleBookmark(item)}
                  />
                ))}
              </View>
            )}

            {!showSectionList && visible < listItems.length ? (
              <Button
                label={t("hadith.loadMore")}
                variant="secondary"
                fullWidth
                style={styles.readingColumn}
                onPress={() => setVisible((v) => v + PAGE_SIZE)}
              />
            ) : null}
          </View>
        )}
      </Stagger>
    </ScreenLayout>
  );
}

function SectionRow({ section, onPress }: { section: HadithSection; onPress: () => void }) {
  return (
    <NavRow
      icon={{ ios: "book.closed", android: "menu_book", web: "menu_book" }}
      label={section.name}
      count={section.count}
      onPress={onPress}
    />
  );
}

function HadithCard({
  item,
  collectionName,
  isBookmarked,
  onBookmark,
}: {
  item: HadithItem;
  collectionName: string;
  isBookmarked: boolean;
  onBookmark: () => void;
}) {
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();
  const audio = useAudioPlayerContext();
  const { fontPrefs } = usePreferences();
  const arabicSize = fontPrefs.arabic.size;
  const textSize = fontPrefs.translation.size;

  const onShare = () => {
    recordContinueActivity(buildHadithActivity(item, collectionName));
    void Share.share({ message: hadithShareMessage(item) });
  };

  const onBookmarkPress = () => {
    recordContinueActivity(buildHadithActivity(item, collectionName));
    onBookmark();
  };

  return (
    <Card padding="four">
      <View style={styles.cardHeader}>
        <View style={styles.cardRef}>
          <ThemedText type="smallBold" style={{ color: colors.accent }}>
            {item.reference}
          </ThemedText>
          {item.grade ? (
            <Pill
              label={item.grade}
              color={tokens.status.success.color}
              background={tokens.status.success.soft}
            />
          ) : null}
        </View>
        <View style={styles.cardActions}>
          {item.audioUri ? (
            <IconButton
              name={{ ios: "play.circle.fill", android: "play_circle", web: "play_circle" }}
              size={22}
              tintColor={colors.accent}
              accessibilityLabel={t("common.play")}
              onPress={() =>
                item.audioUri &&
                audio.play(
                  [
                    {
                      id: item.id,
                      title: item.reference,
                      subtitle: item.narrator,
                      uri: item.audioUri,
                    },
                  ],
                  0,
                  {
                    sourceHref: `/hadith/${item.collection}?q=${encodeURIComponent(item.reference)}`,
                  },
                )
              }
            />
          ) : null}
          <IconButton
            name={{ ios: "square.and.arrow.up", android: "share", web: "share" }}
            size={20}
            tintColor={colors.mutedForeground}
            accessibilityLabel={t("hadith.share")}
            onPress={onShare}
          />
          <IconButton
            name={
              isBookmarked
                ? { ios: "bookmark.fill", android: "bookmark", web: "bookmark" }
                : { ios: "bookmark", android: "bookmark_border", web: "bookmark_border" }
            }
            size={20}
            tintColor={isBookmarked ? tokens.status.warning.color : colors.mutedForeground}
            accessibilityLabel={isBookmarked ? t("hadith.bookmarkRemove") : t("hadith.bookmarkAdd")}
            accessibilityState={{ selected: isBookmarked }}
            onPress={onBookmarkPress}
          />
        </View>
      </View>

      {item.arabic ? (
        <>
          <ThemedText
            type="arabic"
            style={[styles.arabic, arabicSize ? arabicReadingLayout(arabicSize) : null]}
          >
            {item.arabic}
          </ThemedText>
          <View style={[styles.divider, { backgroundColor: tokens.hairline }]} />
        </>
      ) : null}

      {item.narrator ? (
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.narrator}>
          {item.narrator}
        </ThemedText>
      ) : null}

      <ThemedText
        type="default"
        style={[
          styles.english,
          textSize ? { fontSize: textSize, lineHeight: textSize * 1.6 } : null,
        ]}
      >
        {item.english}
      </ThemedText>
    </Card>
  );
}

/** Comfortable line length for long-form hadith reading on wide screens. */
const HadithReadingMaxWidth = 720;

const styles = StyleSheet.create({
  contentStack: { gap: Spacing.four, width: "100%" },
  searchCard: { gap: Spacing.three },
  input: {
    borderRadius: Radius.md,
    borderCurve: "continuous",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 15,
  },
  list: { gap: Spacing.two },
  hadithList: {
    gap: Spacing.three,
    width: "100%",
    maxWidth: HadithReadingMaxWidth,
    alignSelf: "center",
  },
  readingColumn: {
    width: "100%",
    maxWidth: HadithReadingMaxWidth,
    alignSelf: "center",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: Spacing.four,
    gap: Spacing.three,
  },
  cardRef: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    flexWrap: "wrap",
  },
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
  arabic: {},
  divider: { height: StyleSheet.hairlineWidth, marginVertical: Spacing.four },
  narrator: { fontStyle: "italic" },
  english: { marginTop: Spacing.three, lineHeight: 26 },
});
