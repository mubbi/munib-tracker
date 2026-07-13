import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { ListIndexBadge } from "@/components/ui/list-index-badge";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
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
  const { colors, tokens } = useThemeTokens();
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
      subtitle={t("zikr.favSubtitle")}
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
              <View key={item.id} style={[styles.row, { backgroundColor: colors.muted }]}>
                <ListIndexBadge index={index + 1} />
                <PressableScale
                  haptic="light"
                  accessibilityRole="button"
                  accessibilityLabel={`${index + 1}. ${item.title}`}
                  onPress={() =>
                    router.push({ pathname: "/dua/detail/[id]", params: { id: item.id } })
                  }
                  style={styles.body}
                >
                  <ThemedText type="small" numberOfLines={2}>
                    {item.title}
                  </ThemedText>
                  <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
                    {item.transliteration ?? item.translation}
                  </ThemedText>
                </PressableScale>

                <View style={styles.controls}>
                  <IconButton
                    name={{
                      ios: "chevron.up",
                      android: "keyboard_arrow_up",
                      web: "keyboard_arrow_up",
                    }}
                    size={18}
                    tintColor={colors.foreground}
                    accessibilityLabel={t("zikr.moveUp")}
                    disabled={index === 0}
                    onPress={() => move(index, -1)}
                  />
                  <IconButton
                    name={{
                      ios: "chevron.down",
                      android: "keyboard_arrow_down",
                      web: "keyboard_arrow_down",
                    }}
                    size={18}
                    tintColor={colors.foreground}
                    accessibilityLabel={t("zikr.moveDown")}
                    disabled={index === items.length - 1}
                    onPress={() => move(index, 1)}
                  />
                  <IconButton
                    name={{ ios: "star.slash", android: "star_border", web: "star_border" }}
                    size={18}
                    tintColor={tokens.status.danger.color}
                    accessibilityLabel={t("dua.unfavorite")}
                    haptic="warning"
                    onPress={() => toggle(item.id)}
                  />
                </View>
              </View>
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  body: {
    flex: 1,
    gap: 2,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
  },
});
