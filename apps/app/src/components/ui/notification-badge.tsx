import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { BorderWidth, Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

type NotificationBadgeProps = {
  count: number;
  /** Ring color, usually the surrounding surface so the badge reads as a cutout. */
  borderColor?: string;
};

/** The red count badge shown on the notification bell (app header and prayer hero). */
export function NotificationBadge({ count, borderColor }: NotificationBadgeProps) {
  const { colors, tokens } = useThemeTokens();
  if (count <= 0) return null;

  return (
    <View
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.badge,
        {
          backgroundColor: tokens.status.danger.fill,
          borderColor: borderColor ?? colors.background,
        },
      ]}
    >
      <ThemedText
        type="caption"
        maxFontSizeMultiplier={1.2}
        style={[styles.text, { color: tokens.status.danger.onFill }]}
      >
        {count > 9 ? "9+" : String(count)}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: 3,
    end: 3,
    minWidth: 18,
    minHeight: 18,
    borderRadius: Radius.pill,
    borderWidth: BorderWidth.thick,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.one,
  },
  text: {
    fontSize: 11,
    lineHeight: 12,
  },
});
