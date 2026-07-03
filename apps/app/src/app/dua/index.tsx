import { DUA_CATEGORY_LABELS, duasByCategory } from "@munib-tracker/shared/content";
import type { DuaCategoryId } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

const CATEGORY_ICONS: Record<DuaCategoryId, SymbolViewProps["name"]> = {
  sunnah: { ios: "moon.stars.fill", android: "mosque", web: "mosque" },
  quranic: { ios: "book.fill", android: "menu_book", web: "menu_book" },
  daily: { ios: "sun.max.fill", android: "light_mode", web: "light_mode" },
};

const CATEGORIES: DuaCategoryId[] = ["sunnah", "quranic", "daily"];

export default function DuaHomeScreen() {
  const router = useRouter();
  const { colors, tokens } = useThemeTokens();

  return (
    <ScreenLayout
      eyebrow="Supplication"
      title="Duas"
      subtitle="Sunnah, Quranic, and daily duas"
      onBack={router.canGoBack() ? () => router.back() : undefined}
    >
      <Stagger>
        <Card padding="three">
          <View style={styles.list}>
            {CATEGORIES.map((categoryId) => (
              <PressableScale
                key={categoryId}
                haptic="light"
                onPress={() =>
                  router.push({ pathname: "/dua/[category]", params: { category: categoryId } })
                }
                style={[styles.row, { backgroundColor: colors.muted }]}
              >
                <View style={[styles.iconWell, { backgroundColor: tokens.accentSoft }]}>
                  <SymbolView
                    name={CATEGORY_ICONS[categoryId]}
                    size={18}
                    tintColor={colors.accent}
                  />
                </View>
                <ThemedText type="small" style={styles.label}>
                  {DUA_CATEGORY_LABELS[categoryId]}
                </ThemedText>
                <Pill
                  label={`${duasByCategory(categoryId).length}`}
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

        <Card padding="three">
          <PressableScale
            haptic="light"
            onPress={() => router.push("/duroods")}
            style={[styles.row, { backgroundColor: colors.muted }]}
          >
            <View style={[styles.iconWell, { backgroundColor: tokens.accentSoft }]}>
              <SymbolView
                name={{ ios: "heart.text.square.fill", android: "favorite", web: "favorite" }}
                size={18}
                tintColor={colors.accent}
              />
            </View>
            <ThemedText type="small" style={styles.label}>
              Duroods & Salawat
            </ThemedText>
            <SymbolView
              name={{ ios: "chevron.right", android: "chevron_right", web: "chevron_right" }}
              size={14}
              tintColor={colors.mutedForeground}
            />
          </PressableScale>
        </Card>
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.two },
  row: {
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
  label: { flex: 1 },
});
