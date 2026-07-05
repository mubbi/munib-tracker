import { useRouter } from "expo-router";
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
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { getBundledEdition, getSurahAyahs, getSurahByNumber } from "@/lib/quran";
import { compactArabicTextStyle } from "@/lib/reading-typography";
import { useQuranActions, useQuranBookmarks } from "@/stores/quran-store";

const FALLBACK_TRANSLATION = "en-pickthall";

/** Compose Arabic + translation + "Surah:Ayah" reference for the share sheet. */
function shareAyah(arabic: string, translation: string, surah: number, ayah: number) {
  const parts = [arabic, translation].filter(Boolean);
  parts.push(`— ${surah}:${ayah}`);
  void Share.share({ message: parts.join("\n\n") });
}

export default function QuranBookmarksScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const bookmarks = useQuranBookmarks();
  const { toggleBookmark } = useQuranActions();

  return (
    <ScreenLayout
      eyebrow={t("quran.title")}
      title={t("quran.bookmarksTitle")}
      subtitle={t("quran.bookmarksSubtitle")}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
    >
      <Seo path="/quran/bookmarks" />
      {bookmarks.length === 0 ? (
        <EmptyState
          icon={{ ios: "bookmark", android: "bookmark_border", web: "bookmark_border" }}
          title={t("quran.bookmarkEmptyTitle")}
          description={t("quran.bookmarkEmptyDesc")}
          actionLabel={t("quran.surahList")}
          onAction={() => router.push("/quran")}
        />
      ) : (
        <Card padding="three">
          <Stagger>
            <View style={styles.list}>
              {bookmarks.map((bm) => {
                const surah = getSurahByNumber(bm.surah);
                const arabic = getSurahAyahs(bm.surah)[bm.ayah - 1]?.arabic ?? "";
                const translation =
                  getBundledEdition(FALLBACK_TRANSLATION, bm.surah)[String(bm.ayah)] ?? "";
                return (
                  <View key={bm.id} style={[styles.row, { backgroundColor: colors.muted }]}>
                    <PressableScale
                      haptic="light"
                      accessibilityRole="button"
                      accessibilityLabel={`${surah?.nameTransliteration} ${bm.ayah}`}
                      onPress={() =>
                        router.push({
                          pathname: "/quran/[surah]",
                          params: { surah: String(bm.surah), ayah: String(bm.ayah) },
                        })
                      }
                      style={styles.rowContent}
                    >
                      <View style={[styles.badge, { backgroundColor: tokens.accentSoft }]}>
                        <ThemedText type="caption" style={{ color: colors.accent }}>
                          {bm.surah}:{bm.ayah}
                        </ThemedText>
                      </View>
                      <View style={styles.body}>
                        <ThemedText type="small" numberOfLines={1}>
                          {surah?.nameTransliteration}
                        </ThemedText>
                        <ThemedText
                          type="arabic"
                          themeColor="mutedForeground"
                          numberOfLines={1}
                          style={compactArabicTextStyle}
                        >
                          {arabic}
                        </ThemedText>
                      </View>
                    </PressableScale>
                    <IconButton
                      name={{ ios: "square.and.arrow.up", android: "share", web: "share" }}
                      size={20}
                      tintColor={colors.mutedForeground}
                      accessibilityLabel={t("quran.shareAyah")}
                      haptic="light"
                      onPress={() => shareAyah(arabic, translation, bm.surah, bm.ayah)}
                    />
                    <IconButton
                      name={{ ios: "bookmark.fill", android: "bookmark", web: "bookmark" }}
                      size={20}
                      tintColor={tokens.status.warning.color}
                      accessibilityLabel={t("quran.bookmarkRemove")}
                      accessibilityState={{ selected: true }}
                      haptic="light"
                      onPress={() => toggleBookmark(bm.surah, bm.ayah)}
                    />
                  </View>
                );
              })}
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
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  rowContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  badge: {
    paddingHorizontal: Spacing.two,
    height: 30,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  body: { flex: 1, gap: 2 },
});
