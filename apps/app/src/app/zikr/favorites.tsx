import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Card } from "@/components/ui/card";
import { ContentState } from "@/components/ui/content-state";
import { EmptyState } from "@/components/ui/empty-state";
import { FavoritesOrderRow } from "@/components/ui/favorites-order-row";
import { TvUndoButton } from "@/components/ui/tv-undo-button";
import { Spacing } from "@/constants/theme";
import { useAdhkarClock } from "@/hooks/use-adhkar-clock";
import { useAdhkarDayCounts } from "@/hooks/use-adhkar-day-counts";
import { useContentCorpus } from "@/hooks/use-content-corpus";
import { useUndoToast } from "@/hooks/use-undo-toast";
import { tTv } from "@/lib/i18n/t-tv";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { getZikrById, ZIKR_CORPUS } from "@/lib/zikr";
import { zikrListRowProgress } from "@/lib/zikr-list-progress";
import { pushZikrDetail } from "@/lib/zikr-quran";
import { useFavoriteZikrIds, usePreferencesActions } from "@/stores/preferences-store";

export default function ZikrFavoritesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const order = useFavoriteZikrIds();
  const { setFavoriteOrder, toggleFavorite } = usePreferencesActions();
  // The same count source as the category lists (the adhkar day, Fajr → Fajr).
  const clock = useAdhkarClock();
  const zikrCounts = useAdhkarDayCounts(clock.date).counts;
  const undoToast = useUndoToast();
  const { ready: corpusReady } = useContentCorpus(ZIKR_CORPUS);

  const items = order.map((id) => getZikrById(id)).filter((item) => item != null);

  const move = (index: number, direction: -1 | 1) => {
    const next = [...order];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    void setFavoriteOrder(next);
  };

  // Removal is cheap and reversible: remove now, offer Undo (restores the old order).
  const removeFavorite = (id: string) => {
    const previous = [...order];
    void undoToast.run({
      do: () => toggleFavorite(id),
      undo: () => setFavoriteOrder(previous),
      messageKey: "zikr.favoriteRemoved",
    });
  };

  return (
    <ScreenLayout
      eyebrow={t("zikr.detailEyebrow")}
      title={t("zikr.favTitle")}
      subtitle={t("zikr.favSubtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      {/* TV: toasts take no focus — the Undo lives on the page (B-04). */}
      <TvUndoButton controller={undoToast} preferredFocus />
      <Seo path="/zikr/favorites" />
      {order.length === 0 ? (
        <EmptyState
          icon={{ ios: "bookmark", android: "bookmark_border", web: "bookmark_border" }}
          title={t("zikr.favEmptyTitle")}
          description={tTv(t, "zikr.favEmptyDesc", "zikr.favEmptyDescTv")}
          actionLabel={t("zikr.browseZikr")}
          onAction={() => router.replace("/zikr")}
        />
      ) : !corpusReady ? (
        <ContentState status="loading" skeleton="rows" loadingLabel={t("zikr.loadingAdhkar")} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={{ ios: "bookmark", android: "bookmark_border", web: "bookmark_border" }}
          title={t("zikr.favEmptyTitle")}
          description={tTv(t, "zikr.favEmptyDesc", "zikr.favEmptyDescTv")}
          actionLabel={t("zikr.browseZikr")}
          onAction={() => router.replace("/zikr")}
        />
      ) : (
        // Wide web / tablets: a reorderable list reads best as one capped column
        // (move up / down keeps a linear order). TV keeps the full width.
        <Card style={isTV() ? undefined : styles.listCard}>
          <View style={styles.list}>
            {items.map((item, index) => {
              const { completed, progressLabel } = zikrListRowProgress(item, zikrCounts);
              return (
                <FavoritesOrderRow
                  key={item.id}
                  index={index}
                  total={items.length}
                  title={item.title}
                  subtitle={item.transliteration}
                  onPress={() => pushZikrDetail(router, item.id)}
                  onMove={(direction) => move(index, direction)}
                  onRemove={() => removeFavorite(item.id)}
                  removeAccessibilityLabel={t("zikr.removeFavorite")}
                  completed={completed}
                  progressLabel={progressLabel}
                />
              );
            })}
          </View>
        </Card>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  listCard: { width: "100%", maxWidth: 760, alignSelf: "center" },
  list: {
    gap: Spacing.two,
  },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/zikr/favorites");
