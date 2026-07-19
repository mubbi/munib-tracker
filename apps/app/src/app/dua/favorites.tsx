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
import { loadDuaItems } from "@/lib/content-loaders";
import { goBackOrReplace } from "@/lib/navigation";
import {
  useDuaFavoritesActions,
  useEnsureDuaFavoritesLoaded,
  useFavoriteDuaIds,
} from "@/stores/dua-favorites-store";

export default function DuaFavoritesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  useEnsureDuaFavoritesLoaded();
  const order = useFavoriteDuaIds();
  const { setOrder, toggle } = useDuaFavoritesActions();
  const [duaItems, setDuaItems] = useState<Awaited<ReturnType<typeof loadDuaItems>>>([]);
  const [corpusReady, setCorpusReady] = useState(false);
  useEffect(() => {
    void loadDuaItems().then((items) => {
      setDuaItems(items);
      setCorpusReady(true);
    });
  }, []);

  const items = order
    .map((id) => duaItems.find((item) => item.id === id))
    .filter((item) => item != null);

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    // Reorder the *resolved* id list so the rendered index matches the array we
    // mutate — `order` may contain ids that no longer resolve to a dua, which
    // would otherwise make the raw-index swap move the wrong entries.
    const ids = items.map((item) => item.id);
    [ids[index], ids[target]] = [ids[target], ids[index]];
    void setOrder(ids);
  };

  return (
    <ScreenLayout
      eyebrow={t("dua.detailEyebrow")}
      title={t("dua.favorites")}
      subtitle={t("dua.favSubtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo path="/dua/favorites" />
      {order.length === 0 ? (
        <EmptyState
          icon={{ ios: "star", android: "star_border", web: "star_border" }}
          title={t("dua.favoritesEmpty")}
          description={t("zikr.favEmptyDesc")}
          actionLabel={t("dua.title")}
          onAction={() => router.replace("/dua")}
        />
      ) : !corpusReady ? null : items.length === 0 ? (
        <EmptyState
          icon={{ ios: "star", android: "star_border", web: "star_border" }}
          title={t("dua.favoritesEmpty")}
          description={t("zikr.favEmptyDesc")}
          actionLabel={t("dua.title")}
          onAction={() => router.replace("/dua")}
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
                subtitle={item.transliteration ?? item.translation}
                onPress={() =>
                  router.push({ pathname: "/dua/detail/[id]", params: { id: item.id } })
                }
                onMove={(direction) => move(index, direction)}
                onRemove={() => toggle(item.id)}
                removeAccessibilityLabel={t("dua.unfavorite")}
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
