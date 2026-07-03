import type { HadithItem } from "@munib-tracker/shared/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { getRemoteCollection, isRemoteCollection } from "@/api/hadith-remote";
import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Pill } from "@/components/ui/pill";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { HadithRepository } from "@/db";
import { useRemoteCollection } from "@/hooks/use-hadith";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { getBundledCollection, searchHadiths } from "@/lib/hadith";

const PAGE_SIZE = 20;

export default function HadithCollectionScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ collection: string }>();
  const collectionId = params.collection ?? "";
  const remote = isRemoteCollection(collectionId);

  const bundled = getBundledCollection(collectionId);
  const remoteQuery = useRemoteCollection(remote ? collectionId : null);

  const collection = bundled?.collection ?? getRemoteCollection(collectionId);
  const allItems = useMemo<HadithItem[]>(
    () => (remote ? (remoteQuery.data ?? []) : (bundled?.items ?? [])),
    [remote, remoteQuery.data, bundled],
  );

  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const { colors } = useThemeTokens();

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

  const filtered = useMemo(() => searchHadiths(allItems, query), [allItems, query]);
  const shown = filtered.slice(0, visible);

  const toggleBookmark = async (item: HadithItem) => {
    const added = await HadithRepository.toggleBookmark(item);
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (added) next.add(item.id);
      else next.delete(item.id);
      return next;
    });
  };

  if (!collection) {
    return (
      <ScreenLayout title={t("hadith.title")} onBack={() => router.back()}>
        <EmptyState
          icon={{ ios: "questionmark.circle", android: "help", web: "help" }}
          title={t("hadith.notFoundTitle")}
          description={t("hadith.notFoundDesc")}
        />
      </ScreenLayout>
    );
  }

  const isLoading = remote && remoteQuery.isLoading;
  const failedOffline = remote && !remoteQuery.data && !remoteQuery.isLoading;

  return (
    <ScreenLayout
      eyebrow={t("hadith.title")}
      title={collection.nameEnglish}
      subtitle={collection.nameArabic}
      onBack={() => router.back()}
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
                  setVisible(PAGE_SIZE);
                }}
                placeholder={t("hadith.searchPlaceholder")}
                placeholderTextColor={colors.mutedForeground}
                style={[styles.input, { backgroundColor: colors.muted, color: colors.foreground }]}
              />
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("hadith.hadithCount", { count: filtered.length })}
              </ThemedText>
            </Card>

            {shown.length === 0 ? (
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

            {visible < filtered.length ? (
              <Button
                label={t("common.next")}
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

  return (
    <Card padding="four">
      <View style={styles.cardHeader}>
        <ThemedText type="smallBold" style={{ color: colors.accent }}>
          {item.reference}
        </ThemedText>
        <View style={styles.cardActions}>
          <Pill
            label={item.grade ? t("hadith.grade", { grade: item.grade }) : t("hadith.ungraded")}
            color={item.grade ? tokens.status.success.color : colors.mutedForeground}
            background={item.grade ? tokens.status.success.soft : colors.muted}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("hadith.bookmark")}
            hitSlop={8}
            onPress={onBookmark}
          >
            <SymbolView
              name={
                isBookmarked
                  ? { ios: "bookmark.fill", android: "bookmark", web: "bookmark" }
                  : { ios: "bookmark", android: "bookmark_border", web: "bookmark_border" }
              }
              size={20}
              tintColor={isBookmarked ? tokens.status.warning.color : colors.mutedForeground}
            />
          </Pressable>
        </View>
      </View>

      {item.arabic ? (
        <ThemedText type="arabic" style={styles.arabic}>
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
  list: { gap: Spacing.three },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.three,
    gap: Spacing.two,
  },
  cardActions: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  arabic: { writingDirection: "rtl", textAlign: "right", fontSize: 22, lineHeight: 42 },
  narrator: { marginTop: Spacing.three, fontStyle: "italic" },
  english: { marginTop: Spacing.two },
});
