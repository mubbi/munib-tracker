import { getZikrById } from "@munib-tracker/shared/content";
import { useRouter } from "expo-router";
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
import { useFavoriteZikrIds, usePreferencesActions } from "@/stores/preferences-store";

export default function ZikrFavoritesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const order = useFavoriteZikrIds();
  const { setFavoriteOrder, toggleFavorite } = usePreferencesActions();

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
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
    >
      <Seo path="/zikr/favorites" />
      {items.length === 0 ? (
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
              <View key={item.id} style={[styles.row, { backgroundColor: colors.muted }]}>
                <ListIndexBadge index={index + 1} />
                <PressableScale
                  haptic="light"
                  onPress={() =>
                    router.push({ pathname: "/zikr/detail/[id]", params: { id: item.id } })
                  }
                  style={styles.body}
                  accessibilityLabel={`${index + 1}. ${item.title}`}
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
                    accessibilityLabel={t("zikr.removeFavorite")}
                    haptic="warning"
                    onPress={() => toggleFavorite(item.id)}
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
