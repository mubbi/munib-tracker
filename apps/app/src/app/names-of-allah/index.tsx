import { NAMES_OF_ALLAH } from "@munib-tracker/shared/content";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

export default function NamesOfAllahScreen() {
  const router = useRouter();
  const { colors, tokens } = useThemeTokens();

  return (
    <ScreenLayout
      eyebrow="Asma-ul-Husna"
      title="99 Names"
      subtitle={`${NAMES_OF_ALLAH.length} of the beautiful names of Allah`}
      onBack={router.canGoBack() ? () => router.back() : undefined}
    >
      <Stagger>
        <View style={styles.grid}>
          {NAMES_OF_ALLAH.map((name, position) => (
            <Card key={name.id} padding="three" style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.number, { backgroundColor: tokens.accentSoft }]}>
                  <ThemedText type="caption" style={{ color: colors.accent }}>
                    {position + 1}
                  </ThemedText>
                </View>
                <ThemedText type="arabic" style={styles.arabic}>
                  {name.arabic}
                </ThemedText>
              </View>
              <ThemedText type="smallBold" style={{ color: colors.accent }}>
                {name.transliteration}
              </ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                {name.translation}
              </ThemedText>
            </Card>
          ))}
        </View>
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  card: {
    flexGrow: 1,
    flexBasis: "47%",
    gap: Spacing.one,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.one,
  },
  number: {
    width: 26,
    height: 26,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  arabic: {
    fontSize: 26,
    lineHeight: 44,
  },
});
