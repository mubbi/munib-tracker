import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { arabicReadingLayout } from "@/lib/reading-typography";
import type { ShareableReading } from "@/lib/share";

type ReadingContentProps = {
  item: ShareableReading & { virtues?: string };
  arabicSize?: number;
  textSize?: number;
};

export function ShareReadingContent({ item, arabicSize = 28, textSize = 16 }: ReadingContentProps) {
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
      {item.title ? (
        <ThemedText type="smallBold" style={styles.title}>
          {item.title}
        </ThemedText>
      ) : null}

      <ThemedText type="arabic" style={[styles.arabic, arabicReadingLayout(arabicSize)]}>
        {item.arabic}
      </ThemedText>

      <View style={[styles.divider, { backgroundColor: tokens.hairline }]} />

      {item.transliteration ? (
        <ThemedText
          type="small"
          style={[styles.transliteration, { color: colors.accentText, fontSize: textSize }]}
        >
          {item.transliteration}
        </ThemedText>
      ) : null}

      <ThemedText type="default" style={[styles.translation, { fontSize: textSize }]}>
        {item.translation}
      </ThemedText>

      {item.reference ? (
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.reference}>
          — {item.reference}
        </ThemedText>
      ) : null}
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
  title: {
    textAlign: "center",
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
