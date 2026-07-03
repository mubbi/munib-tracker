import { duasByCategory } from "@munib-tracker/shared/content";
import type { DuaCategoryId } from "@munib-tracker/shared/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

const VALID: DuaCategoryId[] = ["sunnah", "quranic", "daily"];

export default function DuaCategoryScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const params = useLocalSearchParams<{ category: string }>();
  const categoryId = (
    VALID.includes(params.category as DuaCategoryId) ? params.category : "daily"
  ) as DuaCategoryId;
  const items = duasByCategory(categoryId);

  return (
    <ScreenLayout
      eyebrow={t("dua.categoryEyebrow")}
      title={t(`duaCat.${categoryId}`)}
      subtitle={t("dua.supplicationsCount", { count: items.length })}
      onBack={router.canGoBack() ? () => router.back() : undefined}
    >
      <Stagger>
        <Card padding="three">
          <View style={styles.list}>
            {items.map((item) => (
              <PressableScale
                key={item.id}
                haptic="light"
                onPress={() => router.push({ pathname: "/dua/[id]", params: { id: item.id } })}
                style={[styles.row, { backgroundColor: colors.muted }]}
              >
                <View style={styles.body}>
                  <ThemedText type="small" numberOfLines={1}>
                    {item.title}
                  </ThemedText>
                  <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
                    {item.transliteration}
                  </ThemedText>
                </View>
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
  list: { gap: Spacing.two },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  body: { flex: 1, gap: 2 },
});
