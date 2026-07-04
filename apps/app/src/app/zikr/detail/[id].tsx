import { getZikrById, ZIKR_ITEMS } from "@munib-tracker/shared/content";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, Share, StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { ReadingCard } from "@/components/content/reading-card";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SegmentedProgress } from "@/components/ui/progress-bar";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { buildZikrActivity } from "@/lib/continue-activity";
import { articleSchema } from "@/lib/seo/structured-data";
import { formatReadingShare } from "@/lib/share";
import { recordContinueActivity } from "@/stores/continue-store";
import { useFavoriteZikrIds, usePreferencesActions } from "@/stores/preferences-store";
import { useZikrCount } from "@/stores/tracker-store";

/** Pre-render a static HTML page for every bundled zikr at web export time. */
export function generateStaticParams(): Array<{ id: string }> {
  return ZIKR_ITEMS.map((zikr) => ({ id: zikr.id }));
}

export default function ZikrDetailScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ id: string }>();
  const { colors } = useThemeTokens();
  const favoriteIds = useFavoriteZikrIds();
  const { toggleFavorite } = usePreferencesActions();
  const item = params.id ? getZikrById(params.id) : undefined;
  const count = useZikrCount(item?.id ?? "");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (item) recordContinueActivity(buildZikrActivity(item));
  }, [item]);

  if (!item) {
    return (
      <ScreenLayout
        title={t("zikr.title")}
        onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
      >
        <Seo
          path={`/zikr/detail/${params.id ?? ""}`}
          title={t("zikr.notFoundTitle")}
          description={t("zikr.notFoundDesc")}
          index={false}
        />
        <EmptyState
          icon={{ ios: "questionmark.circle", android: "help", web: "help" }}
          title={t("zikr.notFoundTitle")}
          description={t("zikr.notFoundDesc")}
        />
      </ScreenLayout>
    );
  }

  const isFavorite = favoriteIds.includes(item.id);
  const target = item.targetCount ?? 0;

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  const onShare = async () => {
    const message = formatReadingShare(item);
    if (Platform.OS === "web") {
      const nav = typeof navigator !== "undefined" ? navigator : undefined;
      try {
        if (nav?.share) {
          await nav.share({ text: message });
        } else if (nav?.clipboard?.writeText) {
          await nav.clipboard.writeText(message);
          showToast(t("reading.copied"));
        }
      } catch {
        // user cancelled or share/clipboard unavailable
      }
      return;
    }
    try {
      await Share.share({ message });
    } catch {
      // user cancelled or share unavailable
    }
  };

  const zikrTitle = item.title;
  const zikrDescription = `${item.translation}${
    item.reference ? ` — ${item.reference}` : ""
  }`.slice(0, 155);
  const zikrBreadcrumbs = [
    { name: t("tabs.home"), path: "/" },
    { name: t("zikr.title"), path: "/zikr" },
    { name: zikrTitle, path: `/zikr/detail/${item.id}` },
  ];

  return (
    <ScreenLayout
      eyebrow={t("zikr.detailEyebrow")}
      title={item.title}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
    >
      <Seo
        path={`/zikr/detail/${item.id}`}
        title={zikrTitle}
        description={zikrDescription}
        type="article"
        breadcrumbs={zikrBreadcrumbs}
        jsonLd={[
          articleSchema({
            path: `/zikr/detail/${item.id}`,
            headline: zikrTitle,
            description: zikrDescription,
            type: "CreativeWork",
            inLanguage: "ar",
            breadcrumbs: zikrBreadcrumbs,
          }),
        ]}
      />
      <Stagger>
        <ReadingCard item={item} sourceHref={`/zikr/detail/${item.id}`} />

        {target > 0 ? (
          <Card padding="three">
            <View style={styles.progressHeader}>
              <ThemedText type="smallBold">{t("zikr.today")}</ThemedText>
              <ThemedText type="small" themeColor="mutedForeground">
                {Math.min(count, target)} / {target}
              </ThemedText>
            </View>
            <SegmentedProgress total={target} completed={Math.min(count, target)} />
          </Card>
        ) : null}

        <View style={styles.actions}>
          <Button
            label={t("zikr.openInTasbeeh")}
            icon={{ ios: "circle.hexagongrid.fill", android: "hive", web: "hive" }}
            fullWidth
            onPress={() =>
              router.push({ pathname: "/tasbeeh/[zikrId]", params: { zikrId: item.id } })
            }
          />
          <View style={styles.actionRow}>
            <Button
              label={isFavorite ? t("zikr.favorited") : t("zikr.favorite")}
              variant="secondary"
              icon={
                isFavorite
                  ? { ios: "star.fill", android: "star", web: "star" }
                  : { ios: "star", android: "star_border", web: "star_border" }
              }
              onPress={() => toggleFavorite(item.id)}
              style={styles.flex}
            />
            <Button
              label={t("zikr.share")}
              variant="ghost"
              icon={{ ios: "square.and.arrow.up", android: "share", web: "share" }}
              onPress={onShare}
              style={styles.flex}
            />
          </View>
        </View>

        {toast ? (
          <Animated.View
            entering={FadeIn.duration(160)}
            style={[styles.toast, { backgroundColor: colors.foreground }]}
          >
            <ThemedText type="small" style={{ color: colors.background }}>
              {toast}
            </ThemedText>
          </Animated.View>
        ) : null}
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.two,
  },
  actions: {
    gap: Spacing.two,
  },
  actionRow: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  flex: {
    flex: 1,
  },
  toast: {
    alignSelf: "center",
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
    borderRadius: 999,
    borderCurve: "continuous",
  },
});
