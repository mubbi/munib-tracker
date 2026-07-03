import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { getSurahAyahs, getSurahByNumber } from "@/lib/quran";
import { useQuranActions, useQuranBookmarks } from "@/stores/quran-store";

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
      onBack={() => router.back()}
    >
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
                return (
                  <PressableScale
                    key={bm.id}
                    haptic="light"
                    accessibilityRole="button"
                    accessibilityLabel={`${surah?.nameTransliteration} ${bm.ayah}`}
                    onPress={() =>
                      router.push({
                        pathname: "/quran/[surah]",
                        params: { surah: String(bm.surah) },
                      })
                    }
                    style={[styles.row, { backgroundColor: colors.muted }]}
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
                        type="caption"
                        themeColor="mutedForeground"
                        numberOfLines={1}
                        style={styles.arabic}
                      >
                        {arabic}
                      </ThemedText>
                    </View>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={t("quran.removeBookmark")}
                      hitSlop={8}
                      onPress={() => toggleBookmark(bm.surah, bm.ayah)}
                    >
                      <SymbolView
                        name={{ ios: "bookmark.fill", android: "bookmark", web: "bookmark" }}
                        size={20}
                        tintColor={tokens.status.warning.color}
                      />
                    </Pressable>
                  </PressableScale>
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
  badge: {
    paddingHorizontal: Spacing.two,
    height: 30,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  body: { flex: 1, gap: 2 },
  arabic: { writingDirection: "rtl", textAlign: "right" },
});
