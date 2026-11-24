import type { DuaItem } from "@munib-tracker/shared/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { type ScrollViewInstance, StyleSheet, View } from "react-native";
import { ReadingCard } from "@/components/content/reading-card";
import {
  SCRIPTURE_LIST_DETAIL_MAX_WIDTH,
  ScriptureReadingFilters,
  scriptureListDetailStyles,
} from "@/components/content/scripture-reading-filters";
import { DuaDetailPager } from "@/components/dua/dua-detail-pager";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Stagger } from "@/components/ui/stagger";
import { TvScrollView } from "@/components/ui/tv-scroll-view";
import { Spacing } from "@/constants/theme";
import { useContentBottomInset } from "@/hooks/use-content-bottom-inset";
import { useContentCorpus } from "@/hooks/use-content-corpus";
import { useLargeScreenLayout } from "@/hooks/use-large-screen-layout";
import { useShareContentCard } from "@/hooks/use-share-content-card";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { DUA_CORPUS } from "@/lib/content-loaders";
import { buildContentReportRef } from "@/lib/content-report-ref";
import { buildDuaActivity } from "@/lib/continue-activity";
import { duaNeighbors, formatDuaHeading } from "@/lib/dua-browse";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { articleSchema } from "@/lib/seo/structured-data";
import { formatReadingShare } from "@/lib/share";
import { recordContinueActivity } from "@/stores/continue-store";
import {
  useDuaFavoritesActions,
  useEnsureDuaFavoritesLoaded,
  useIsFavoriteDua,
} from "@/stores/dua-favorites-store";
import { recordDuaRecent } from "@/stores/dua-recents-store";

/** Pre-render a static HTML page for every bundled dua at web export time. */
export async function generateStaticParams(): Promise<Array<{ id: string }>> {
  const { DUA_ITEMS } = await import("@munib-tracker/shared/content/duas");
  return DUA_ITEMS.map((dua) => ({ id: dua.id }));
}

export default function DuaDetailScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { tokens } = useThemeTokens();
  const contentBottomInset = useContentBottomInset();
  const { isListDetail } = useLargeScreenLayout();
  const tv = isTV();
  // Wide tablet/desktop: sticky side filters. TV: single column — side panes
  // crowd the Arabic and fight D-pad focus (same pattern as hadith reader).
  const showSideFilters = isListDetail && !tv;
  const params = useLocalSearchParams<{ id: string }>();
  const { items } = useContentCorpus(DUA_CORPUS);
  const item = params.id ? items.find((dua) => dua.id === params.id) : undefined;
  useEnsureDuaFavoritesLoaded();
  const isFavorite = useIsFavoriteDua(item?.id ?? "");
  const { toggle } = useDuaFavoritesActions();
  const shareCard = useShareContentCard();
  const scrollRef = useRef<ScrollViewInstance>(null);
  const neighbors = useMemo(() => (item ? duaNeighbors(items, item.id) : null), [item, items]);

  useEffect(() => {
    if (!item) return;
    recordContinueActivity(buildDuaActivity(item));
    void recordDuaRecent(item.id);
    // Paging replaces the route in place — start the next dua at the top.
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [item]);

  // Replace (not push) so Back still returns to the list after paging through a set.
  const openNeighbor = useCallback(
    (target: DuaItem) =>
      router.replace({ pathname: "/dua/detail/[id]", params: { id: target.id } }),
    [router],
  );

  if (!item && items.length > 0) {
    return (
      <ScreenLayout title={t("dua.detailEyebrow")} onBack={() => goBackOrReplace(router, "/")}>
        <Seo
          path={`/dua/detail/${params.id ?? ""}`}
          title={t("dua.notFoundTitle")}
          description={t("dua.notFoundDesc")}
          index={false}
        />
        <EmptyState
          icon={{ ios: "questionmark.circle", android: "help", web: "help" }}
          title={t("dua.notFoundTitle")}
          description={t("dua.notFoundDesc")}
        />
      </ScreenLayout>
    );
  }
  if (!item) return null;

  const onShare = async () => {
    await shareCard.share({
      message: formatReadingShare(item),
      sectionTitle: t("share.sectionReading"),
      contentLabel: item.title ?? item.reference,
      filenameSlug: "dua",
      shareKey: item.id,
      content: { kind: "reading", item },
    });
  };

  const duaTitle = formatDuaHeading(item.title);
  const categoryLabel = t(`duaCat.${item.categoryId}`);
  const categoryHref = `/dua/${item.categoryId}` as const;
  const duaDescription = `${item.translation}${item.reference ? ` — ${item.reference}` : ""}`.slice(
    0,
    155,
  );
  const duaBreadcrumbs = [
    { name: t("tabs.home"), path: "/" },
    { name: t("dua.title"), path: "/dua" },
    { name: categoryLabel, path: categoryHref },
    { name: duaTitle, path: `/dua/detail/${item.id}` },
  ];
  const locale = i18n.language?.split("-")[0] ?? "en";
  const contentRef = buildContentReportRef("dua", item.id, `/dua/detail/${item.id}`, locale, {
    snapshot: {
      title: item.title,
      arabic: item.arabic,
      transliteration: item.transliteration,
      translation: item.translation,
      reference: item.reference,
    },
  });

  const readingBody = (
    <Stagger>
      {!showSideFilters ? <ScriptureReadingFilters /> : null}
      <ReadingCard
        item={item}
        shareCard={shareCard}
        sourceHref={`/dua/detail/${item.id}`}
        isFavorite={isFavorite}
        onToggleFavorite={() => toggle(item.id)}
        contentRef={contentRef}
        enableContextMenu={!tv}
      />
      {/* No share sheet on TV (phone-only capability). */}
      {tv ? null : (
        <Button
          label={
            shareCard.isSharing(item.id)
              ? t("share.preparing")
              : shareCard.isGesturePending(item.id)
                ? t("share.tapToShare")
                : t("dua.share")
          }
          variant="secondary"
          icon={{ ios: "square.and.arrow.up", android: "share", web: "share" }}
          fullWidth
          disabled={shareCard.isSharing(item.id)}
          onPress={onShare}
        />
      )}
      {neighbors ? (
        <DuaDetailPager neighbors={neighbors} categoryLabel={categoryLabel} onOpen={openNeighbor} />
      ) : null}
    </Stagger>
  );

  return (
    <ScreenLayout
      eyebrow={categoryLabel}
      title={duaTitle}
      subtitle={
        neighbors?.occasion
          ? t("dua.positionInOccasion", {
              current: neighbors.occasion.position,
              total: neighbors.occasion.total,
            })
          : undefined
      }
      onBack={() => goBackOrReplace(router, categoryHref)}
      scrollRef={scrollRef}
      maxContentWidth={showSideFilters ? SCRIPTURE_LIST_DETAIL_MAX_WIDTH : undefined}
    >
      {shareCard.SnapshotHost}
      <Seo
        path={`/dua/detail/${item.id}`}
        title={duaTitle}
        description={duaDescription}
        type="article"
        breadcrumbs={duaBreadcrumbs}
        jsonLd={[
          articleSchema({
            path: `/dua/detail/${item.id}`,
            headline: duaTitle,
            description: duaDescription,
            type: "CreativeWork",
            inLanguage: "ar",
            breadcrumbs: duaBreadcrumbs,
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
              tv && scriptureListDetailStyles.listDetailSecondaryTv,
              { borderStartColor: tokens.hairline },
            ]}
          >
            <TvScrollView
              style={scriptureListDetailStyles.listDetailSecondaryScroll}
              contentContainerStyle={[
                scriptureListDetailStyles.listDetailSecondaryContent,
                { paddingBottom: contentBottomInset },
              ]}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <ScriptureReadingFilters />
            </TvScrollView>
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
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/dua/detail/[id]");
