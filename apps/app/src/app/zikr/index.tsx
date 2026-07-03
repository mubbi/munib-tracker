import { getZikrById } from "@munib-tracker/shared/content";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { ZikrRow } from "@/components/zikr/zikr-row";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { zikrCategories } from "@/lib/zikr";
import { useFavoriteZikrIds } from "@/stores/preferences-store";

export default function ZikrHomeScreen() {
  const router = useRouter();
  const { colors, tokens } = useThemeTokens();
  const favoriteIds = useFavoriteZikrIds();
  const categories = zikrCategories();

  const favorites = favoriteIds
    .map(getZikrById)
    .filter((item) => item != null)
    .slice(0, 3);

  return (
    <ScreenLayout
      eyebrow="Remembrance"
      title="Zikr"
      subtitle="Adhkar for every part of your day"
      onBack={router.canGoBack() ? () => router.back() : undefined}
    >
      <Stagger>
        {favorites.length > 0 ? (
          <Card padding="three">
            <SectionHeader
              title="Favorites"
              icon={{ ios: "star.fill", android: "star", web: "star" }}
              actionLabel="See all"
              onActionPress={() => router.push("/zikr/favorites")}
            />
            <View style={styles.list}>
              {favorites.map((item) => (
                <ZikrRow
                  key={item.id}
                  item={item}
                  onPress={() => router.push({ pathname: "/zikr/[id]", params: { id: item.id } })}
                />
              ))}
            </View>
          </Card>
        ) : null}

        <Card padding="three">
          <SectionHeader
            title="Categories"
            icon={{ ios: "square.grid.2x2.fill", android: "grid_view", web: "grid_view" }}
          />
          <View style={styles.list}>
            {categories.map((category) => (
              <PressableScale
                key={category.id}
                haptic="light"
                onPress={() =>
                  router.push({ pathname: "/zikr/[category]", params: { category: category.id } })
                }
                style={[styles.categoryRow, { backgroundColor: colors.muted }]}
              >
                <View style={[styles.iconWell, { backgroundColor: tokens.accentSoft }]}>
                  <SymbolView name={category.icon} size={18} tintColor={colors.accent} />
                </View>
                <ThemedText type="small" style={styles.categoryLabel}>
                  {category.label}
                </ThemedText>
                <Pill
                  label={`${category.count}`}
                  color={colors.mutedForeground}
                  background={colors.card}
                />
                <SymbolView
                  name={{ ios: "chevron.right", android: "chevron_right", web: "chevron_right" }}
                  size={14}
                  tintColor={colors.mutedForeground}
                />
              </PressableScale>
            ))}
          </View>
        </Card>
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.two + 2,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  iconWell: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  categoryLabel: {
    flex: 1,
  },
});
