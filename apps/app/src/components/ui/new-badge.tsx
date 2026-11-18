import { useTranslation } from "react-i18next";
import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

/**
 * A small "New" pill for recently released features (see `lib/new-features.ts`).
 * Accent fill so it reads at a glance on home tiles and Library rows. Purely
 * visual: callers add the word to their own accessibility label.
 */
export function NewBadge({ style }: { style?: StyleProp<ViewStyle> }) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={[styles.badge, { backgroundColor: colors.accent, pointerEvents: "none" }, style]}
    >
      <ThemedText type="caption" style={[styles.text, { color: colors.accentForeground }]}>
        {t("common.newBadge")}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 1,
    borderRadius: Radius.pill,
    alignSelf: "flex-start",
  },
  text: { fontSize: 10, lineHeight: 14, fontWeight: "700", letterSpacing: 0.3 },
});
