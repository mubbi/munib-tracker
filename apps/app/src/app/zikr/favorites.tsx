import { getZikrById } from "@munib-tracker/shared/content";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useFavoriteZikrIds, usePreferencesActions } from "@/stores/preferences-store";

export default function ZikrFavoritesScreen() {
  const router = useRouter();
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
      eyebrow="Zikr"
      title="Favorites"
      subtitle="Reorder or remove your saved adhkar"
      onBack={router.canGoBack() ? () => router.back() : undefined}
    >
      {items.length === 0 ? (
        <EmptyState
          icon={{ ios: "star", android: "star_border", web: "star_border" }}
          title="No favorites yet"
          description="Tap the star on any zikr to keep it here for quick access."
          actionLabel="Browse zikr"
          onAction={() => router.replace("/zikr")}
        />
      ) : (
        <Card padding="three">
          <View style={styles.list}>
            {items.map((item, index) => (
              <View key={item.id} style={[styles.row, { backgroundColor: colors.muted }]}>
                <PressableScale
                  haptic="light"
                  onPress={() => router.push({ pathname: "/zikr/[id]", params: { id: item.id } })}
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
                  <Pressable
                    accessibilityLabel="Move up"
                    accessibilityRole="button"
                    disabled={index === 0}
                    hitSlop={6}
                    onPress={() => move(index, -1)}
                    style={{ opacity: index === 0 ? 0.3 : 1 }}
                  >
                    <SymbolView
                      name={{
                        ios: "chevron.up",
                        android: "keyboard_arrow_up",
                        web: "keyboard_arrow_up",
                      }}
                      size={18}
                      tintColor={colors.foreground}
                    />
                  </Pressable>
                  <Pressable
                    accessibilityLabel="Move down"
                    accessibilityRole="button"
                    disabled={index === items.length - 1}
                    hitSlop={6}
                    onPress={() => move(index, 1)}
                    style={{ opacity: index === items.length - 1 ? 0.3 : 1 }}
                  >
                    <SymbolView
                      name={{
                        ios: "chevron.down",
                        android: "keyboard_arrow_down",
                        web: "keyboard_arrow_down",
                      }}
                      size={18}
                      tintColor={colors.foreground}
                    />
                  </Pressable>
                  <Pressable
                    accessibilityLabel="Remove favorite"
                    accessibilityRole="button"
                    hitSlop={6}
                    onPress={() => toggleFavorite(item.id)}
                  >
                    <SymbolView
                      name={{ ios: "star.slash", android: "star_border", web: "star_border" }}
                      size={18}
                      tintColor={tokens.status.danger.color}
                    />
                  </Pressable>
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
    gap: Spacing.three,
  },
});
