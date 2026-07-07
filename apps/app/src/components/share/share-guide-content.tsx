import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

type ShareGuideContentProps = {
  title: string;
  summary: string;
  excerpt?: string;
  url: string;
};

export function ShareGuideContent({ title, summary, excerpt, url }: ShareGuideContentProps) {
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
      <ThemedText type="subtitle" style={styles.title}>
        {title}
      </ThemedText>
      {summary ? (
        <ThemedText type="small" themeColor="mutedForeground">
          {summary}
        </ThemedText>
      ) : null}
      {excerpt ? (
        <ThemedText type="small" style={styles.excerpt}>
          {excerpt}
        </ThemedText>
      ) : null}
      <View style={[styles.urlBox, { backgroundColor: tokens.accentSoft }]}>
        <ThemedText type="caption" style={{ color: colors.accentText }}>
          {url}
        </ThemedText>
      </View>
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
  excerpt: {
    lineHeight: 22,
  },
  urlBox: {
    marginTop: Spacing.one,
    padding: Spacing.two,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
  },
});
