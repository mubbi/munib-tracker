import { SymbolView } from "expo-symbols";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

type AchievementContentProps = {
  title: string;
  description: string;
  trackLabel: string;
  level: number;
};

export function ShareAchievementContent({
  title,
  description,
  trackLabel,
  level,
}: AchievementContentProps) {
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
      <View style={[styles.badge, { backgroundColor: tokens.status.warning.soft }]}>
        <SymbolView
          name={{ ios: "trophy.fill", android: "emoji_events", web: "emoji_events" }}
          size={28}
          tintColor={tokens.status.warning.color}
        />
      </View>

      <ThemedText type="caption" themeColor="mutedForeground" style={styles.track}>
        {trackLabel} · L{level}
      </ThemedText>
      <ThemedText type="subtitle" style={styles.title}>
        {title}
      </ThemedText>
      <ThemedText type="small" themeColor="mutedForeground">
        {description}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  badge: {
    width: 56,
    height: 56,
    borderRadius: Radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  track: {
    textAlign: "center",
  },
  title: {
    textAlign: "center",
  },
});
