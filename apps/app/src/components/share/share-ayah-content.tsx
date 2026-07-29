import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { arabicReadingLayout } from "@/lib/reading-typography";

type AyahContentProps = {
  arabic: string;
  translation: string;
  reference: string;
  transliteration?: string;
  arabicSize?: number;
  textSize?: number;
};

export function ShareAyahContent({
  arabic,
  translation,
  reference,
  transliteration,
  arabicSize = 28,
  textSize = 16,
}: AyahContentProps) {
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

      {transliteration ? (
        <ThemedText
          type="small"
          style={[styles.transliteration, { color: colors.accentText, fontSize: textSize }]}
        >
          {transliteration}
        </ThemedText>
      ) : null}

      <ThemedText type="default" style={[styles.translation, { fontSize: textSize }]}>
        {translation}
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
    textAlign: "center",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: Spacing.one,
  },
  transliteration: {
    fontStyle: "italic",
    textAlign: "center",
  },
  translation: {
    lineHeight: 24,
  },
  reference: {
    marginTop: Spacing.one,
    textAlign: "center",
  },
});
