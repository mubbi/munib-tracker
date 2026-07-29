import { useRouter } from "expo-router";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useShareContentCard } from "@/hooks/use-share-content-card";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { tTv } from "@/lib/i18n/t-tv";
import { goBackOrReplace } from "@/lib/navigation";
import { getBundledEdition, getPageForAyah, getSurahAyahs, getSurahByNumber } from "@/lib/quran";
import { arabicReadingLayout, DEFAULT_ARABIC_SIZE } from "@/lib/reading-typography";
import { buildAyahSharePayload } from "@/lib/share";
import { usePreferences } from "@/stores/preferences-store";
import { useQuranActions, useQuranBookmarks } from "@/stores/quran-store";

const FALLBACK_TRANSLATION = "en-pickthall";

export default function QuranBookmarksScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { fontPrefs } = usePreferences();
  const arabicSize = fontPrefs.arabic.size ?? DEFAULT_ARABIC_SIZE;
  const bookmarks = useQuranBookmarks();
  const { toggleBookmark } = useQuranActions();
  const { share, isSharing, isGesturePending, SnapshotHost } = useShareContentCard();

  const shareAyah = useCallback(
    (arabic: string, translation: string, surah: number, ayah: number) => {
      const surahMeta = getSurahByNumber(surah);
      void share({
        ...buildAyahSharePayload(arabic, translation, surah, ayah, {
          surahName: surahMeta?.nameTransliteration,
          sectionTitle: t("share.sectionQuran"),
        }),
        shareKey: `${surah}:${ayah}`,
      });
    },
    [share, t],
  );

  return (
    <ScreenLayout
      eyebrow={t("quran.title")}
      title={t("quran.bookmarksTitle")}
      subtitle={t("quran.bookmarksSubtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      {SnapshotHost}
      <Seo path="/quran/bookmarks" />
      {bookmarks.length === 0 ? (
        <EmptyState
          icon={{ ios: "bookmark", android: "bookmark_border", web: "bookmark_border" }}
          title={t("quran.bookmarkEmptyTitle")}
          description={tTv(t, "quran.bookmarkEmptyDesc", "quran.bookmarkEmptyDescTv")}
          actionLabel={t("quran.surahList")}
          onAction={() => router.push("/quran")}
        />
      ) : (
        <Stagger>
          <View style={styles.list}>
            {bookmarks.map((bm) => {
              const surah = getSurahByNumber(bm.surah);
              const arabic = getSurahAyahs(bm.surah)[bm.ayah - 1]?.arabic ?? "";
              const translation =
                getBundledEdition(FALLBACK_TRANSLATION, bm.surah)[String(bm.ayah)] ?? "";
              const page = getPageForAyah(bm.surah, bm.ayah);
              const shareKey = `${bm.surah}:${bm.ayah}`;
              const sharePending = isGesturePending(shareKey);
              const openAyah = () =>
                router.push({
                  pathname: "/quran/[surah]",
                  params: { surah: String(bm.surah), ayah: String(bm.ayah) },
                });

              return (
                <View key={bm.id} style={[styles.card, { backgroundColor: colors.muted }]}>
                  <View style={styles.header}>
                    <PressableScale
                      haptic="light"
                      accessibilityRole="button"
                      accessibilityLabel={`${surah?.nameTransliteration} ${bm.ayah}`}
                      onPress={openAyah}
                      style={styles.meta}
                    >
                      <View style={[styles.badge, { backgroundColor: tokens.accentSoft }]}>
                        <ThemedText type="caption" style={{ color: colors.accent }}>
                          {bm.surah}:{bm.ayah} · {t("quran.pageN", { n: page })}
                        </ThemedText>
                      </View>
                      <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
                        {surah?.nameTransliteration}
                      </ThemedText>
                    </PressableScale>
                    <View style={styles.actions}>
                      <IconButton
                        name={{ ios: "square.and.arrow.up", android: "share", web: "share" }}
                        size={18}
                        tintColor={colors.mutedForeground}
                        accessibilityLabel={
                          sharePending
                            ? tTv(t, "share.tapToShare", "share.selectToShare")
                            : t("quran.shareAyah")
                        }
                        haptic="light"
                        loading={isSharing(shareKey)}
                        onPress={() => shareAyah(arabic, translation, bm.surah, bm.ayah)}
                      />
                      <IconButton
                        name={{ ios: "bookmark.fill", android: "bookmark", web: "bookmark" }}
                        size={18}
                        tintColor={tokens.status.warning.color}
                        accessibilityLabel={t("quran.bookmarkRemove")}
                        accessibilityState={{ selected: true }}
                        haptic="light"
                        onPress={() => toggleBookmark(bm.surah, bm.ayah)}
                      />
                    </View>
                  </View>
                  <PressableScale
                    haptic="light"
                    accessibilityRole="button"
                    accessibilityLabel={`${surah?.nameTransliteration} ${bm.ayah}`}
                    onPress={openAyah}
                  >
                    <ThemedText
                      type="arabic"
                      numberOfLines={4}
                      style={arabicReadingLayout(arabicSize)}
                    >
                      {arabic}
                    </ThemedText>
                  </PressableScale>
                </View>
              );
            })}
          </View>
        </Stagger>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.two },
  card: {
    gap: Spacing.two,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.two,
  },
  meta: {
    flex: 1,
    gap: Spacing.half,
    minWidth: 0,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.half,
  },
});
