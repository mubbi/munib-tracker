import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { arabicReadingLayout } from "@/lib/reading-typography";

type HadithContentProps = {
  arabic: string;
  english: string;
  reference: string;
  arabicSize?: number;
  textSize?: number;
};

export function ShareHadithContent({
  arabic,
  english,
  reference,
  arabicSize = 24,
  textSize = 16,
}: HadithContentProps) {
  const { colors, tokens } = useThemeTokens();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <ThemedText type="arabic" style={[styles.arabic, arabicReadingLayout(arabicSize)]}>
        {arabic}
      </ThemedText>

      <View style={[styles.divider, { backgroundColor: tokens.hairline }]} />

      <ThemedText type="default" style={[styles.translation, { fontSize: textSize }]}>
        {english}
      </ThemedText>

      <ThemedText type="caption" themeColor="mutedForeground" style={styles.reference}>
        — {reference}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  arabic: {
    textAlign: "right",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: Spacing.one,
  },
  translation: {
    lineHeight: 24,
  },
  reference: {
    marginTop: Spacing.one,
  },
});
