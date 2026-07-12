import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ReadingCard } from "@/components/content/reading-card";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { EmptyState } from "@/components/ui/empty-state";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { loadDuroodItems } from "@/lib/content-loaders";
import { goBackOrReplace } from "@/lib/navigation";
import {
  useDuroodFavoritesActions,
  useEnsureDuroodFavoritesLoaded,
  useFavoriteDuroodIds,
} from "@/stores/durood-favorites-store";

export default function DuroodFavoritesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  useEnsureDuroodFavoritesLoaded();
  const favoriteIds = useFavoriteDuroodIds();
  const { toggle } = useDuroodFavoritesActions();
  const [duroodItems, setDuroodItems] = useState<Awaited<ReturnType<typeof loadDuroodItems>>>([]);
  useEffect(() => {
    void loadDuroodItems().then(setDuroodItems);
  }, []);
  const byId = useMemo(() => new Map(duroodItems.map((item) => [item.id, item])), [duroodItems]);

  const items = favoriteIds.map((id) => byId.get(id)).filter((item) => item != null);

  return (
    <ScreenLayout
      eyebrow={t("duroods.eyebrow")}
      title={t("duroods.favorites")}
      subtitle={t("duroods.favSubtitle")}
      onBack={() => goBackOrReplace(router, "/duroods")}
    >
      <Seo path="/duroods/favorites" />
      {items.length === 0 ? (
        <EmptyState
          icon={{ ios: "star", android: "star_border", web: "star_border" }}
          title={t("duroods.favEmptyTitle")}
          description={t("duroods.favEmptyDesc")}
          actionLabel={t("duroods.title")}
          onAction={() => router.replace("/duroods")}
        />
      ) : (
        <Stagger>
          {items.map((item) => (
            <View key={item.id} style={styles.item}>
              <ThemedText type="smallBold" style={styles.title}>
                {item.title}
              </ThemedText>
              <ReadingCard
                item={item}
                sourceHref="/duroods"
                isFavorite
                onToggleFavorite={() => toggle(item.id)}
              />
            </View>
          ))}
        </Stagger>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  item: {
    gap: Spacing.two,
  },
  title: {
    marginStart: Spacing.one,
  },
});
