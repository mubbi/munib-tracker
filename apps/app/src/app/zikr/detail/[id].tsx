import { getZikrById, ZIKR_ITEMS } from "@munib-tracker/shared/content";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
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
import { useShareContentCard } from "@/hooks/use-share-content-card";
import { buildContentReportRef } from "@/lib/content-report-ref";
import { buildZikrActivity } from "@/lib/continue-activity";
import { TASBEEH_ICON } from "@/lib/quick-actions";
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
  const { t, i18n } = useTranslation();
  const params = useLocalSearchParams<{ id: string }>();
  const favoriteIds = useFavoriteZikrIds();
  const { toggleFavorite } = usePreferencesActions();
  const item = params.id ? getZikrById(params.id) : undefined;
  const count = useZikrCount(item?.id ?? "");
  const shareCard = useShareContentCard();

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

  const onShare = async () => {
    await shareCard.share({
      message: formatReadingShare(item),
      sectionTitle: t("share.sectionReading"),
      contentLabel: item.title ?? item.reference,
      filenameSlug: "zikr",
      content: { kind: "reading", item },
    });
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
      {shareCard.SnapshotHost}
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
        <ReadingCard
          item={item}
          shareCard={shareCard}
          sourceHref={`/zikr/detail/${item.id}`}
          contentRef={buildContentReportRef(
            "zikr",
            item.id,
            `/zikr/detail/${item.id}`,
            i18n.language?.split("-")[0] ?? "en",
            {
              snapshot: {
                title: item.title,
                arabic: item.arabic,
                transliteration: item.transliteration,
                translation: item.translation,
                reference: item.reference,
              },
            },
          )}
        />

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
            icon={TASBEEH_ICON}
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
});
