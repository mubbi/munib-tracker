import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { FavoritesOrderRow } from "@/components/ui/favorites-order-row";
import { Spacing } from "@/constants/theme";
import { goBackOrReplace } from "@/lib/navigation";
import { ensureZikrCorpus, getZikrById } from "@/lib/zikr";
import { pushZikrDetail } from "@/lib/zikr-quran";
import { useFavoriteZikrIds, usePreferencesActions } from "@/stores/preferences-store";

export default function ZikrFavoritesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const order = useFavoriteZikrIds();
  const { setFavoriteOrder, toggleFavorite } = usePreferencesActions();
  const [corpusReady, setCorpusReady] = useState(false);
  useEffect(() => {
    void ensureZikrCorpus().then(() => setCorpusReady(true));
  }, []);

  const items = order.map((id) => getZikrById(id)).filter((item) => item != null);

  const move = (index: number, direction: -1 | 1) => {
    const next = [...order];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    void setFavoriteOrder(next);
  };

  return (
    <ScreenLayout
      eyebrow={t("zikr.detailEyebrow")}
      title={t("zikr.favTitle")}
      subtitle={t("zikr.favSubtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo path="/zikr/favorites" />
      {order.length === 0 ? (
        <EmptyState
          icon={{ ios: "star", android: "star_border", web: "star_border" }}
          title={t("zikr.favEmptyTitle")}
          description={t("zikr.favEmptyDesc")}
          actionLabel={t("zikr.browseZikr")}
          onAction={() => router.replace("/zikr")}
        />
      ) : !corpusReady ? null : items.length === 0 ? (
        <EmptyState
          icon={{ ios: "star", android: "star_border", web: "star_border" }}
          title={t("zikr.favEmptyTitle")}
          description={t("zikr.favEmptyDesc")}
          actionLabel={t("zikr.browseZikr")}
          onAction={() => router.replace("/zikr")}
        />
      ) : (
        <Card padding="three">
          <View style={styles.list}>
            {items.map((item, index) => (
              <FavoritesOrderRow
                key={item.id}
                index={index}
                total={items.length}
                title={item.title}
                subtitle={item.transliteration}
                onPress={() => pushZikrDetail(router, item.id)}
                onMove={(direction) => move(index, direction)}
                onRemove={() => toggleFavorite(item.id)}
                removeAccessibilityLabel={t("zikr.removeFavorite")}
              />
            ))}
          </View>
        </Card>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.two,
  },
});
