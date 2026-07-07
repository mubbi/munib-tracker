import { useRouter } from "expo-router";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { LabeledIconButton } from "@/components/ui/labeled-icon-button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useShareContentCard } from "@/hooks/use-share-content-card";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import { getBundledEdition, getPageForAyah, getSurahAyahs, getSurahByNumber } from "@/lib/quran";
import { compactArabicTextStyle } from "@/lib/reading-typography";
import { buildAyahSharePayload } from "@/lib/share";
import { useQuranActions, useQuranBookmarks } from "@/stores/quran-store";

const FALLBACK_TRANSLATION = "en-pickthall";

export default function QuranBookmarksScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
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
                const page = getPageForAyah(bm.surah, bm.ayah);
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
                          {bm.surah}:{bm.ayah} · {t("quran.pageN", { n: page })}
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
                    <LabeledIconButton
                      name={{ ios: "square.and.arrow.up", android: "share", web: "share" }}
                      label={
                        isGesturePending(`${bm.surah}:${bm.ayah}`)
                          ? t("share.tapToShare")
                          : t("common.share")
                      }
                      iconSize={18}
                      tintColor={colors.mutedForeground}
                      accessibilityLabel={t("quran.shareAyah")}
                      haptic="light"
                      loading={isSharing(`${bm.surah}:${bm.ayah}`)}
                      loadingLabel={t("share.preparing")}
                      onPress={() => shareAyah(arabic, translation, bm.surah, bm.ayah)}
                    />
                    <LabeledIconButton
                      name={{ ios: "bookmark.fill", android: "bookmark", web: "bookmark" }}
                      label={t("quran.actionBookmarked")}
                      iconSize={18}
                      tintColor={tokens.status.warning.color}
                      labelColor={tokens.status.warning.color}
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
