import type { DurudItem } from "@munib-tracker/shared/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { type ScrollViewInstance, StyleSheet, View } from "react-native";

import { ReadingCard } from "@/components/content/reading-card";
import {
  SCRIPTURE_LIST_DETAIL_MAX_WIDTH,
  ScriptureReadingFilters,
} from "@/components/content/scripture-reading-filters";
import { duroodNeighbors } from "@/components/duroods/durood-browse";
import { DuroodSourceCard } from "@/components/duroods/durood-source-card";
import { useDuroodSaveToggle } from "@/components/duroods/use-durood-save-toggle";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SkeletonPlaceholder } from "@/components/ui/skeleton";
import { Stagger } from "@/components/ui/stagger";
import { TvUndoButton } from "@/components/ui/tv-undo-button";
import { Spacing } from "@/constants/theme";
import { useContentCorpus } from "@/hooks/use-content-corpus";
import { useLargeScreenLayout } from "@/hooks/use-large-screen-layout";
import { useShareContentCard } from "@/hooks/use-share-content-card";
import { DUROOD_CORPUS } from "@/lib/content-loaders";
import { buildContentReportRef } from "@/lib/content-report-ref";
import { buildDuroodActivity } from "@/lib/continue-activity";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { TASBEEH_ICON } from "@/lib/quick-actions";
import { useChevronBack, useChevronForward } from "@/lib/rtl";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { articleSchema } from "@/lib/seo/structured-data";
import { recordContinueActivity } from "@/stores/continue-store";
import {
  useEnsureDuroodFavoritesLoaded,
  useIsFavoriteDurood,
} from "@/stores/durood-favorites-store";

/** Pre-render a static HTML page for every bundled durood at web export time. */
export async function generateStaticParams(): Promise<Array<{ id: string }>> {
  const { DUROOD_ITEMS } = await import("@munib-tracker/shared/content/duroods");
  return DUROOD_ITEMS.map((item) => ({ id: item.id }));
}

/** Expo Router may pass dynamic segments as `string | string[]` on deep links. */
function paramValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default function DuroodDetailScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const tv = isTV();
  const { isListDetail } = useLargeScreenLayout();
  const params = useLocalSearchParams<{ id: string | string[]; source?: string | string[] }>();
  const id = paramValue(params.id) ?? "";
  // The list's info button opens the reader on the source narrations.
  const openSource = paramValue(params.source) === "1";
  const { items, ready } = useContentCorpus(DUROOD_CORPUS);
  const item = items.find((durood) => durood.id === id);
  useEnsureDuroodFavoritesLoaded();
  const isFavorite = useIsFavoriteDurood(item?.id ?? "");
  const { toggleSaved, undoToast } = useDuroodSaveToggle();
  const shareCard = useShareContentCard();
  const scrollRef = useRef<ScrollViewInstance>(null);
  const neighbors = useMemo(() => (item ? duroodNeighbors(items, item.id) : null), [item, items]);
  const chevronBack = useChevronBack();
  const chevronForward = useChevronForward();

  useEffect(() => {
    if (!item) return;
    // Continue → this durood, not the whole collection.
    recordContinueActivity({ ...buildDuroodActivity(item), href: `/duroods/${item.id}` });
    // Paging replaces the route in place — start the next durood at the top.
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [item]);

  // Replace (not push) so Back still returns to the list after paging.
  const openNeighbor = useCallback(
    (target: DurudItem) => router.replace({ pathname: "/duroods/[id]", params: { id: target.id } }),
    [router],
  );

  const backToList = () => goBackOrReplace(router, "/duroods");

  if (!item && ready) {
    return (
      <ScreenLayout title={t("duroods.detailEyebrow")} onBack={backToList}>
        <Seo
          path={`/duroods/${id}`}
          title={t("duroods.notFoundTitle")}
          description={t("duroods.notFoundDesc")}
          index={false}
        />
        <EmptyState
          icon={{ ios: "questionmark.circle", android: "help", web: "help" }}
          title={t("duroods.notFoundTitle")}
          description={t("duroods.notFoundDesc")}
          actionLabel={t("duroods.browseAll")}
          onAction={() => router.replace("/duroods")}
        />
      </ScreenLayout>
    );
  }
  // Chrome (title + back) always mounts; only the body waits for the corpus.
  if (!item) {
    return (
      <ScreenLayout title={t("duroods.detailEyebrow")} onBack={backToList}>
        <SkeletonPlaceholder preset="card" accessibilityLabel={t("duroods.loading")} />
      </ScreenLayout>
    );
  }

  const path = `/duroods/${item.id}`;
  const description = `${item.translation}${item.reference ? ` — ${item.reference}` : ""}`.slice(
    0,
    155,
  );
  const breadcrumbs = [
    { name: t("tabs.home"), path: "/" },
    { name: t("duroods.title"), path: "/duroods" },
    { name: item.title, path },
  ];
  const locale = i18n.language?.split("-")[0] ?? "en";
  const contentRef = buildContentReportRef("durood", item.id, path, locale, {
    snapshot: {
      title: item.title,
      arabic: item.arabic,
      transliteration: item.transliteration,
      translation: item.translation,
      reference: item.reference,
    },
  });
  const isSalawat = item.kind !== "virtue";

  return (
    <ScreenLayout
      eyebrow={t("duroods.title")}
      title={item.title}
      subtitle={
        neighbors
          ? t("duroods.position", { current: neighbors.position, total: neighbors.total })
          : undefined
      }
      onBack={backToList}
      scrollRef={scrollRef}
      maxContentWidth={isListDetail && !tv ? SCRIPTURE_LIST_DETAIL_MAX_WIDTH : undefined}
    >
      {shareCard.SnapshotHost}
      {/* TV: toasts take no focus — the Undo lives on the page (B-04). */}
      <TvUndoButton controller={undoToast} />
      <Seo
        path={path}
        title={item.title}
        description={description}
        type="article"
        breadcrumbs={breadcrumbs}
        jsonLd={[
          articleSchema({
            path,
            headline: item.title,
            description,
            type: "CreativeWork",
            inLanguage: "ar",
            breadcrumbs,
          }),
        ]}
      />
      <Stagger>
        <ScriptureReadingFilters />
        <ReadingCard
          item={item}
          shareCard={shareCard}
          sourceHref={path}
          isFavorite={isFavorite}
          onToggleFavorite={() => toggleSaved(item.id)}
          contentRef={contentRef}
          // No recorded recitation → the device voice reads it (never on TV).
          enableTts
          enableContextMenu={!tv}
        />
        {isSalawat ? (
          <Button
            label={t("duroods.openInTasbeeh")}
            icon={TASBEEH_ICON}
            variant="secondary"
            onPress={() =>
              router.push({ pathname: "/tasbeeh/durood/[id]", params: { id: item.id } })
            }
          />
        ) : null}
        <DuroodSourceCard item={item} defaultExpanded={openSource} />
        {neighbors && (neighbors.previous || neighbors.next) ? (
          <View style={styles.pager}>
            {neighbors.previous ? (
              <Button
                label={t("common.previous")}
                icon={chevronBack}
                variant="ghost"
                size="sm"
                onPress={() => neighbors.previous && openNeighbor(neighbors.previous)}
              />
            ) : (
              <View />
            )}
            {neighbors.next ? (
              <Button
                label={t("common.next")}
                trailingIcon={chevronForward}
                variant="ghost"
                size="sm"
                onPress={() => neighbors.next && openNeighbor(neighbors.next)}
              />
            ) : null}
          </View>
        ) : null}
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  pager: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: Spacing.two,
  },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/duroods/[id]");
