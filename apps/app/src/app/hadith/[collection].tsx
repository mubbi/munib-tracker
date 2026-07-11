import type { HadithItem, HadithSection } from "@munib-tracker/shared/types";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, type ListRenderItem, StyleSheet, TextInput, View } from "react-native";
import { getRemoteCollection, isRemoteCollection } from "@/api/hadith-remote";
import { ContentReportButton } from "@/components/content-report/content-report-button";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { ContextMenu, type ContextMenuAction } from "@/components/ui/context-menu";
import { EmptyState } from "@/components/ui/empty-state";
import { LabeledIconButton } from "@/components/ui/labeled-icon-button";
import { NavRow } from "@/components/ui/nav-row";
import { Pill } from "@/components/ui/pill";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { HadithRepository } from "@/db";
import { useRemoteCollection } from "@/hooks/use-hadith";
import { useHadithTranslation } from "@/hooks/use-hadith-translation";
import { useShareContentCard } from "@/hooks/use-share-content-card";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { buildContentReportRef } from "@/lib/content-report-ref";
import { buildHadithActivity, buildHadithCollectionActivity } from "@/lib/continue-activity";
import {
  getBundledCollection,
  getBundledCollectionData,
  getBundledCollections,
} from "@/lib/hadith";
import { goBackOrReplace } from "@/lib/navigation";
import { arabicReadingLayout } from "@/lib/reading-typography";
import { runWhenIdle } from "@/lib/run-when-idle";
import { createHadithSearch, type FuzzyIndex } from "@/lib/search";
import { collectionPageSchema } from "@/lib/seo/structured-data";
import { buildHadithSharePayload } from "@/lib/share";
import { resolveHadithTranslation } from "@/lib/translation-locale";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";
import { recordContinueActivity } from "@/stores/continue-store";
import { usePreferences } from "@/stores/preferences-store";

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
  const { share, isSharing, isGesturePending, SnapshotHost } = useShareContentCard();
  const { translationLocale } = usePreferences();

  const shareHadith = useCallback(
    (item: HadithItem) => {
      const translation = resolveHadithTranslation(item, { translationLocale });
      void share({
        ...buildHadithSharePayload(item.arabic, translation, item.reference, {
          sectionTitle: t("share.sectionHadith"),
          contentLabel: collection
            ? `${collection.nameEnglish} · ${item.reference}`
            : item.reference,
        }),
        shareKey: item.id,
      });
    },
    [collection, share, t, translationLocale],
  );

  // Seed the in-collection search from a `q` param (e.g. arriving from universal
  // search) so the matched hadith is already filtered into view.
  const [query, setQuery] = useState(params.q ?? "");
  const [sectionId, setSectionId] = useState<string | null>(null);
  const searching = query.trim().length > 0;

  // Fuzzy index over this collection's hadith. Building it is O(n) over every
  // item (a remote collection can hold thousands), so we never do it in a
  // render-blocking useMemo. Instead we keep it in state and build it lazily:
  // deferred until idle once data has loaded, or immediately
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
    const handle = runWhenIdle(build);
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

  const activeSection = sections.find((s) => s.id === sectionId);

  const collectionName = collection?.nameEnglish ?? "";

  const toggleBookmark = useCallback(async (item: HadithItem) => {
    const added = await HadithRepository.toggleBookmark(item);
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (added) next.add(item.id);
      else next.delete(item.id);
      return next;
    });
  }, []);

  const keyExtractor = useCallback((item: HadithItem) => item.id, []);

  const renderHadithItem = useCallback<ListRenderItem<HadithItem>>(
    ({ item }) => (
      <View style={styles.readingColumn}>
        <HadithCard
          item={item}
          collectionName={collectionName}
          isBookmarked={bookmarked.has(item.id)}
          onBookmark={() => toggleBookmark(item)}
          onShare={shareHadith}
          isSharing={isSharing}
          isGesturePending={isGesturePending}
        />
      </View>
    ),
    [bookmarked, collectionName, isGesturePending, isSharing, shareHadith, toggleBookmark],
  );

  if (!collection) {
    return (
      <ScreenLayout title={t("hadith.title")} onBack={() => goBackOrReplace(router, "/")}>
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
  };

  const useFlatList = !isLoading && !failedOffline && !showSectionList;
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
      onBack={activeSection ? goBackToBooks : () => goBackOrReplace(router, "/")}
      scrollable={useFlatList ? false : undefined}
    >
      {SnapshotHost}
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
      {isLoading ? (
        <Stagger>
          <EmptyState
            icon={{ ios: "arrow.down.circle", android: "download", web: "download" }}
            title={t("hadith.loading")}
          />
        </Stagger>
      ) : failedOffline ? (
        <Stagger>
          <EmptyState
            icon={{ ios: "wifi.slash", android: "wifi_off", web: "wifi_off" }}
            title={t("hadith.offlineTitle")}
            description={t("hadith.offlineDesc")}
          />
        </Stagger>
      ) : showSectionList ? (
        <Stagger>
          <View style={styles.contentStack}>
            <Card padding="four">
              <View style={styles.searchCard}>
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder={t("hadith.searchPlaceholder")}
                  placeholderTextColor={colors.mutedForeground}
                  accessibilityLabel={t("hadith.searchPlaceholder")}
                  style={[
                    styles.input,
                    { backgroundColor: colors.muted, color: colors.foreground },
                  ]}
                />
                <ThemedText type="caption" themeColor="mutedForeground">
                  {t("hadith.bookCount", { count: sections.length })}
                </ThemedText>
              </View>
            </Card>
            <Card padding="four">
              <View style={styles.list}>
                {sections.map((section) => (
                  <SectionRow
                    key={section.id}
                    section={section}
                    onPress={() => setSectionId(section.id)}
                  />
                ))}
              </View>
            </Card>
          </View>
        </Stagger>
      ) : (
        /* No Stagger wrapper: its item view has no flex, which would break the
           FlatList's height chain (matches the dua category screen). */
        <FlatList
          style={styles.flatList}
          contentContainerStyle={styles.flatListContent}
          data={listItems}
          keyExtractor={keyExtractor}
          renderItem={renderHadithItem}
          ItemSeparatorComponent={HadithListSeparator}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          initialNumToRender={12}
          maxToRenderPerBatch={8}
          windowSize={7}
          removeClippedSubviews
          ListHeaderComponent={
            <Card padding="four" style={[styles.readingColumn, styles.listHeader]}>
              <View style={styles.searchCard}>
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder={t("hadith.searchPlaceholder")}
                  placeholderTextColor={colors.mutedForeground}
                  accessibilityLabel={t("hadith.searchPlaceholder")}
                  style={[
                    styles.input,
                    { backgroundColor: colors.muted, color: colors.foreground },
                  ]}
                />
                <ThemedText type="caption" themeColor="mutedForeground">
                  {t("hadith.hadithCount", { count: listItems.length })}
                </ThemedText>
              </View>
            </Card>
          }
          ListEmptyComponent={
            <EmptyState
              icon={{ ios: "text.magnifyingglass", android: "search", web: "search" }}
              title={t("hadith.emptyTitle")}
              description={t("hadith.emptyDesc")}
            />
          }
        />
      )}
    </ScreenLayout>
  );
}

/** Spacer matching the previous `gap: Spacing.three` between hadith cards. */
function HadithListSeparator() {
  return <View style={styles.hadithSeparator} />;
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
  onShare: onShareHadith,
  isSharing,
  isGesturePending,
}: {
  item: HadithItem;
  collectionName: string;
  isBookmarked: boolean;
  onBookmark: () => void;
  onShare: (item: HadithItem) => void;
  isSharing: (shareKey: string) => boolean;
  isGesturePending: (shareKey: string) => boolean;
}) {
  const { colors, tokens } = useThemeTokens();
  const { t, i18n } = useTranslation();
  const audio = useAudioPlayerContext();
  const locale = i18n.language?.split("-")[0] ?? "en";
  const { fontPrefs } = usePreferences();
  const arabicSize = fontPrefs.arabic.size;
  const textSize = fontPrefs.translation.size;
  const displayTranslation = useHadithTranslation(item);

  const onShare = () => {
    recordContinueActivity(buildHadithActivity(item, collectionName));
    onShareHadith(item);
  };

  const onBookmarkPress = () => {
    recordContinueActivity(buildHadithActivity(item, collectionName));
    onBookmark();
  };

  const onPlay = () => {
    if (!item.audioUri) return;
    audio.play(
      [{ id: item.id, title: item.reference, subtitle: item.narrator, uri: item.audioUri }],
      0,
      { sourceHref: `/hadith/${item.collection}?q=${encodeURIComponent(item.reference)}` },
    );
  };

  const menuActions: ContextMenuAction[] = [];
  if (item.audioUri) {
    menuActions.push({ id: "play", title: t("common.play"), systemIcon: "play.fill" });
  }
  menuActions.push({ id: "share", title: t("hadith.share"), systemIcon: "square.and.arrow.up" });
  menuActions.push({
    id: "bookmark",
    title: isBookmarked ? t("hadith.bookmarkRemove") : t("hadith.bookmarkAdd"),
    systemIcon: isBookmarked ? "bookmark.slash" : "bookmark",
  });

  const onMenuAction = (id: string) => {
    if (id === "play") onPlay();
    else if (id === "share") onShare();
    else if (id === "bookmark") onBookmarkPress();
  };

  return (
    <ContextMenu actions={menuActions} onAction={onMenuAction}>
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
              <LabeledIconButton
                name={{ ios: "play.circle.fill", android: "play_circle", web: "play_circle" }}
                label={t("common.play")}
                iconSize={20}
                tintColor={colors.accent}
                accessibilityLabel={t("common.play")}
                onPress={onPlay}
              />
            ) : null}
            <LabeledIconButton
              name={{ ios: "square.and.arrow.up", android: "share", web: "share" }}
              label={isGesturePending(item.id) ? t("share.tapToShare") : t("common.share")}
              iconSize={18}
              tintColor={colors.mutedForeground}
              accessibilityLabel={t("hadith.share")}
              loading={isSharing(item.id)}
              loadingLabel={t("share.preparing")}
              onPress={onShare}
            />
            <LabeledIconButton
              name={
                isBookmarked
                  ? { ios: "bookmark.fill", android: "bookmark", web: "bookmark" }
                  : { ios: "bookmark", android: "bookmark_border", web: "bookmark_border" }
              }
              label={isBookmarked ? t("quran.actionBookmarked") : t("quran.actionBookmark")}
              iconSize={18}
              tintColor={isBookmarked ? tokens.status.warning.color : colors.mutedForeground}
              labelColor={isBookmarked ? tokens.status.warning.color : undefined}
              accessibilityLabel={
                isBookmarked ? t("hadith.bookmarkRemove") : t("hadith.bookmarkAdd")
              }
              accessibilityState={{ selected: isBookmarked }}
              haptic="selection"
              onPress={onBookmarkPress}
            />
            <ContentReportButton
              contentRef={buildContentReportRef(
                "hadith",
                item.id,
                `/hadith/${item.collection}`,
                locale,
                {
                  parentId: item.collection,
                  snapshot: {
                    title: item.reference,
                    arabic: item.arabic,
                    translation: displayTranslation,
                    reference: item.reference,
                  },
                },
              )}
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
          {displayTranslation}
        </ThemedText>
      </Card>
    </ContextMenu>
  );
}

/** Comfortable line length for long-form hadith reading on wide screens. */
const HadithReadingMaxWidth = 720;

const styles = StyleSheet.create({
  contentStack: { gap: Spacing.four, width: "100%" },
  flatList: { flex: 1 },
  flatListContent: { paddingBottom: Spacing.four },
  listHeader: { marginBottom: Spacing.four },
  hadithSeparator: { height: Spacing.three },
  searchCard: { gap: Spacing.three },
  input: {
    borderRadius: Radius.md,
    borderCurve: "continuous",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 15,
  },
  list: { gap: Spacing.two },
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
    alignItems: "flex-start",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: Spacing.one,
    maxWidth: "58%",
  },
  arabic: {},
  divider: { height: StyleSheet.hairlineWidth, marginVertical: Spacing.four },
  narrator: { fontStyle: "italic" },
  english: { marginTop: Spacing.three, lineHeight: 26 },
});
