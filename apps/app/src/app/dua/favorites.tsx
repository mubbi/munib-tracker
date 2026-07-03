import { getDuaById } from "@munib-tracker/shared/content";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
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

  const items = order.map((id) => getDuaById(id)).filter((item) => item != null);

  const move = (index: number, direction: -1 | 1) => {
    const next = [...order];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    void setOrder(next);
  };

  return (
    <ScreenLayout
      eyebrow={t("dua.detailEyebrow")}
      title={t("dua.favorites")}
      subtitle={t("zikr.favSubtitle")}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
    >
      {items.length === 0 ? (
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
                <PressableScale
                  haptic="light"
                  accessibilityRole="button"
                  accessibilityLabel={item.title}
                  onPress={() =>
                    router.push({ pathname: "/dua/detail/[id]", params: { id: item.id } })
                  }
                  style={styles.body}
                >
                  <ThemedText type="small" numberOfLines={1}>
                    {item.title}
                  </ThemedText>
                  <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
                    {item.transliteration}
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
