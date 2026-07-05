import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Share, StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { HadithRepository } from "@/db";
import type { BookmarkedHadith } from "@/db/repositories/hadith-repository";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { arabicReadingLayout } from "@/lib/reading-typography";
import { usePreferences } from "@/stores/preferences-store";

/** Plain-text body shared for a hadith (arabic + english + reference). */
function hadithShareMessage(entry: BookmarkedHadith): string {
  const { arabic, english, reference } = entry.item;
  return [arabic, english, reference].filter(Boolean).join("\n\n");
}

export default function HadithBookmarksScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { fontPrefs } = usePreferences();
  const arabicSize = fontPrefs.arabic.size;

  const [entries, setEntries] = useState<BookmarkedHadith[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    void HadithRepository.getBookmarkedHadiths().then((list) => {
      if (!active) return;
      setEntries(list);
      setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const remove = async (entry: BookmarkedHadith) => {
    await HadithRepository.toggleBookmark(entry.item);
    setEntries((prev) => prev.filter((e) => e.bookmark.hadithId !== entry.bookmark.hadithId));
  };

  const share = (entry: BookmarkedHadith) => {
    void Share.share({ message: hadithShareMessage(entry) });
  };

  const open = (entry: BookmarkedHadith) =>
    router.push({
      pathname: "/hadith/[collection]",
      params: { collection: entry.item.collection },
    });

  return (
    <ScreenLayout
      eyebrow={t("hadith.title")}
      title={t("hadith.bookmarks")}
      subtitle={t("hadith.bookmarksSubtitle")}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
    >
      <Seo path="/hadith/bookmarks" />
      {loaded && entries.length === 0 ? (
        <EmptyState
          icon={{ ios: "bookmark", android: "bookmark_border", web: "bookmark_border" }}
          title={t("hadith.bookmarksEmpty")}
          actionLabel={t("hadith.title")}
          onAction={() => router.push("/hadith")}
        />
      ) : (
        <Card padding="three">
          <Stagger>
            <View style={styles.list}>
              {entries.map((entry) => (
                <View
                  key={entry.bookmark.id}
                  style={[styles.row, { backgroundColor: colors.muted }]}
                >
                  <PressableScale
                    haptic="light"
                    accessibilityRole="button"
                    accessibilityLabel={entry.item.reference}
                    onPress={() => open(entry)}
                    style={styles.rowContent}
                  >
                    <ThemedText type="smallBold" style={{ color: colors.accent }} numberOfLines={1}>
                      {entry.item.reference}
                    </ThemedText>
                    {entry.item.arabic ? (
                      <ThemedText
                        type="arabic"
                        numberOfLines={2}
                        style={[styles.arabic, arabicSize ? arabicReadingLayout(arabicSize) : null]}
                      >
                        {entry.item.arabic}
                      </ThemedText>
                    ) : null}
                    <ThemedText type="small" themeColor="mutedForeground" numberOfLines={2}>
                      {entry.item.english}
                    </ThemedText>
                  </PressableScale>
                  <View style={styles.actions}>
                    <IconButton
                      name={{ ios: "square.and.arrow.up", android: "share", web: "share" }}
                      size={20}
                      tintColor={colors.mutedForeground}
                      accessibilityLabel={t("hadith.share")}
                      onPress={() => share(entry)}
                    />
                    <IconButton
                      name={{ ios: "bookmark.fill", android: "bookmark", web: "bookmark" }}
                      size={20}
                      tintColor={tokens.status.warning.color}
                      accessibilityLabel={t("hadith.bookmarkRemove")}
                      accessibilityState={{ selected: true }}
                      onPress={() => remove(entry)}
                    />
                  </View>
                </View>
              ))}
            </View>
          </Stagger>
        </Card>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.two },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  rowContent: {
    flex: 1,
    gap: Spacing.one,
  },
  arabic: {},
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
});
