import type { HadithItem, HadithSection } from "@munib-tracker/shared/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Share, StyleSheet, TextInput, View } from "react-native";

import { getRemoteCollection, isRemoteCollection } from "@/api/hadith-remote";
import { ScreenLayout } from "@/components/screen-layout";
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
import { getBundledCollection, getBundledCollectionData, searchHadiths } from "@/lib/hadith";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";
import { usePreferences } from "@/stores/preferences-store";

/** Build the plain-text body shared for a hadith (arabic + english + reference). */
function hadithShareMessage(item: HadithItem): string {
  return [item.arabic, item.english, item.reference].filter(Boolean).join("\n\n");
}

const PAGE_SIZE = 20;

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

  // What to show: the section list, or a filtered list of hadith.
  const showSectionList = sections.length > 0 && !sectionId && !searching;

  const listItems = useMemo(() => {
    if (searching) return searchHadiths(allItems, query);
    if (sectionId) return allItems.filter((h) => h.chapterId === sectionId);
    return allItems;
  }, [allItems, query, sectionId, searching]);
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
          <>
            <Card padding="three">
              <TextInput
                value={query}
                onChangeText={(text) => {
                  setQuery(text);
                  resetPage();
                }}
                placeholder={t("hadith.searchPlaceholder")}
                placeholderTextColor={colors.mutedForeground}
                accessibilityLabel={t("hadith.searchPlaceholder")}
                style={[styles.input, { backgroundColor: colors.muted, color: colors.foreground }]}
              />
              <ThemedText type="caption" themeColor="mutedForeground">
                {showSectionList
                  ? t("hadith.bookCount", { count: sections.length })
                  : t("hadith.hadithCount", { count: listItems.length })}
              </ThemedText>
            </Card>

            {showSectionList ? (
              <Card padding="three">
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
              <View style={styles.list}>
                {shown.map((item) => (
                  <HadithCard
                    key={item.id}
                    item={item}
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
                onPress={() => setVisible((v) => v + PAGE_SIZE)}
              />
            ) : null}
          </>
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
  isBookmarked,
  onBookmark,
}: {
  item: HadithItem;
  isBookmarked: boolean;
  onBookmark: () => void;
}) {
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();
  const audio = useAudioPlayerContext();
  const { fontPrefs } = usePreferences();
  const arabicSize = fontPrefs.arabic.size;

  const onShare = () => {
    void Share.share({ message: hadithShareMessage(item) });
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
                audio.play([
                  {
                    id: item.id,
                    title: item.reference,
                    subtitle: item.narrator,
                    uri: item.audioUri,
                  },
                ])
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
            onPress={onBookmark}
          />
        </View>
      </View>

      {item.arabic ? (
        <ThemedText
          type="arabic"
          style={[
            styles.arabic,
            arabicSize ? { fontSize: arabicSize, lineHeight: arabicSize * 1.8 } : null,
          ]}
        >
          {item.arabic}
        </ThemedText>
      ) : null}

      {item.narrator ? (
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.narrator}>
          {item.narrator}
        </ThemedText>
      ) : null}

      <ThemedText type="default" style={styles.english}>
        {item.english}
      </ThemedText>
    </Card>
  );
}

const styles = StyleSheet.create({
  input: {
    borderRadius: Radius.md,
    borderCurve: "continuous",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    marginBottom: Spacing.two,
    fontSize: 15,
  },
  list: { gap: Spacing.two },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: Spacing.three,
    gap: Spacing.two,
  },
  cardRef: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    flexWrap: "wrap",
  },
  cardActions: { flexDirection: "row", alignItems: "center", marginRight: -Spacing.two },
  arabic: { writingDirection: "rtl", textAlign: "right", fontSize: 22, lineHeight: 42 },
  narrator: { marginTop: Spacing.three, fontStyle: "italic" },
  english: { marginTop: Spacing.two },
});
