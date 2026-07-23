import { isAfterSalahPrayer } from "@munib-tracker/shared/validators";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import { ReadingCard } from "@/components/content/reading-card";
import {
  SCRIPTURE_LIST_DETAIL_MAX_WIDTH,
  ScriptureReadingFilters,
  scriptureListDetailStyles,
} from "@/components/content/scripture-reading-filters";
import { QuranAyahRangeCards } from "@/components/quran/quran-ayah-range-cards";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SegmentedProgress } from "@/components/ui/progress-bar";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { trackReviewInteraction } from "@/features/reviews/lib/reviewEngagementBridge";
import { useContentBottomInset } from "@/hooks/use-content-bottom-inset";
import { useLargeScreenLayout } from "@/hooks/use-large-screen-layout";
import { useShareContentCard } from "@/hooks/use-share-content-card";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { buildContentReportRef } from "@/lib/content-report-ref";
import { buildZikrActivity } from "@/lib/continue-activity";
import { tTv } from "@/lib/i18n/t-tv";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { TASBEEH_ICON } from "@/lib/quick-actions";
import { articleSchema } from "@/lib/seo/structured-data";
import { formatReadingShare } from "@/lib/share";
import { ensureZikrCorpus, getZikrById } from "@/lib/zikr";
import { isZikrItemDone } from "@/lib/zikr-count-key";
import { zikrQuranHref, zikrQuranRanges } from "@/lib/zikr-quran";
import { recordContinueActivity } from "@/stores/continue-store";
import { useFavoriteZikrIds, usePreferencesActions } from "@/stores/preferences-store";
import { useTrackerActions, useZikrCount } from "@/stores/tracker-store";

/** Pre-render a static HTML page for every bundled zikr at web export time. */
export async function generateStaticParams(): Promise<Array<{ id: string }>> {
  const { ZIKR_ITEMS } = await import("@munib-tracker/shared/content/zikr");
  return ZIKR_ITEMS.map((zikr) => ({ id: zikr.id }));
}

function paramId(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default function ZikrDetailScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { tokens } = useThemeTokens();
  const contentBottomInset = useContentBottomInset();
  const { isListDetail } = useLargeScreenLayout();
  const tv = isTV();
  // Wide tablet/desktop: sticky side filters. TV: single column (hadith/dua pattern).
  const showSideFilters = isListDetail && !tv;
  const params = useLocalSearchParams<{ id: string; prayer?: string }>();
  const zikrId = paramId(params.id);
  const prayerParam = paramId(params.prayer);
  // Full-surah remembrances (e.g. Al-Mulk) open the Qur'an reader.
  const quranHref = zikrQuranHref(zikrId);
  // Short ayah spans stay here with Qur'an cards + recitation audio.
  const quranRanges = zikrQuranRanges(zikrId);
  const [corpusReady, setCorpusReady] = useState(false);
  useEffect(() => {
    if (quranHref) return;
    let active = true;
    void ensureZikrCorpus().then(() => {
      if (active) setCorpusReady(true);
    });
    return () => {
      active = false;
    };
  }, [quranHref]);
  const favoriteIds = useFavoriteZikrIds();
  const { toggleFavorite } = usePreferencesActions();
  const { setZikrCount } = useTrackerActions();
  const item = !quranHref && corpusReady && zikrId ? getZikrById(zikrId) : undefined;
  const afterSalahPrayer =
    item?.categoryId === "after_prayer" && prayerParam && isAfterSalahPrayer(prayerParam)
      ? prayerParam
      : undefined;
  const count = useZikrCount(item?.id ?? "", afterSalahPrayer);
  const shareCard = useShareContentCard();

  useEffect(() => {
    if (item) recordContinueActivity(buildZikrActivity(item));
  }, [item]);

  if (quranHref) {
    return <Redirect href={quranHref} />;
  }

  if (!corpusReady) {
    return null;
  }

  if (!item) {
    return (
      <ScreenLayout title={t("zikr.title")} onBack={() => goBackOrReplace(router, "/")}>
        <Seo
          path={`/zikr/detail/${zikrId ?? ""}`}
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
  // Single-recitation adhkar don't need the counter — mark complete on this screen.
  const isSingleRecitation = target === 1;
  const isDone = isZikrItemDone(count, target);

  const onShare = async () => {
    await shareCard.share({
      message: formatReadingShare(item),
      sectionTitle: t("share.sectionReading"),
      contentLabel: item.title ?? item.reference,
      filenameSlug: "zikr",
      shareKey: item.id,
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

  const sourceHref = `/zikr/detail/${item.id}`;
  const readingBody = (
    <Stagger>
      {!showSideFilters ? <ScriptureReadingFilters /> : null}
      {quranRanges ? (
        <>
          <QuranAyahRangeCards ranges={quranRanges} sourceHref={sourceHref} shareCard={shareCard} />
          {item.virtues ? (
            <Card padding="three">
              <ThemedText type="small" themeColor="mutedForeground">
                {item.virtues}
              </ThemedText>
            </Card>
          ) : null}
        </>
      ) : (
        <ReadingCard
          item={item}
          shareCard={shareCard}
          sourceHref={sourceHref}
          enableContextMenu={!tv}
          contentRef={buildContentReportRef(
            "zikr",
            item.id,
            sourceHref,
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
      )}

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
        {isSingleRecitation ? (
          <Button
            label={isDone ? t("zikr.done") : t("zikr.markAsDone")}
            icon={
              isDone
                ? { ios: "checkmark.seal.fill", android: "verified", web: "verified" }
                : { ios: "checkmark.circle.fill", android: "check_circle", web: "check_circle" }
            }
            variant={isDone ? "secondary" : "primary"}
            fullWidth
            accessibilityHint={
              isDone ? tTv(t, "zikr.undoDoneHint", "zikr.undoDoneHintTv") : undefined
            }
            onPress={() => {
              const next = isDone ? 0 : 1;
              void setZikrCount(
                item.id,
                next,
                target,
                afterSalahPrayer ? { prayerId: afterSalahPrayer } : undefined,
              );
              if (!isDone) trackReviewInteraction("mark_zikr");
            }}
          />
        ) : (
          <Button
            label={t("zikr.openInTasbeeh")}
            icon={TASBEEH_ICON}
            fullWidth
            onPress={() =>
              router.push({
                pathname: "/tasbeeh/[zikrId]",
                params: afterSalahPrayer
                  ? { zikrId: item.id, prayer: afterSalahPrayer }
                  : { zikrId: item.id },
              })
            }
          />
        )}
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
            label={
              shareCard.isSharing(item.id)
                ? t("share.preparing")
                : shareCard.isGesturePending(item.id)
                  ? tTv(t, "share.tapToShare", "share.selectToShare")
                  : t("zikr.share")
            }
            variant="ghost"
            icon={{ ios: "square.and.arrow.up", android: "share", web: "share" }}
            disabled={shareCard.isSharing(item.id)}
            onPress={onShare}
            style={styles.flex}
          />
        </View>
      </View>
    </Stagger>
  );

  return (
    <ScreenLayout
      eyebrow={t("zikr.detailEyebrow")}
      title={item.title}
      onBack={() => goBackOrReplace(router, "/")}
      maxContentWidth={showSideFilters ? SCRIPTURE_LIST_DETAIL_MAX_WIDTH : undefined}
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
      {showSideFilters ? (
        <View style={[scriptureListDetailStyles.listDetailRoot, styles.detailRoot]}>
          <View style={[scriptureListDetailStyles.listDetailPrimary, styles.detailPrimary]}>
            {readingBody}
          </View>
          <View
            style={[
              scriptureListDetailStyles.listDetailSecondary,
              { borderStartColor: tokens.hairline },
            ]}
          >
            <ScrollView
              style={scriptureListDetailStyles.listDetailSecondaryScroll}
              contentContainerStyle={[
                scriptureListDetailStyles.listDetailSecondaryContent,
                { paddingBottom: contentBottomInset },
              ]}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <ScriptureReadingFilters />
            </ScrollView>
          </View>
        </View>
      ) : (
        readingBody
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  detailRoot: {
    minHeight: 420,
  },
  detailPrimary: {
    gap: Spacing.four,
  },
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
