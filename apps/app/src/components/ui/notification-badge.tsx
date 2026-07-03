import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
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
      style={[
        styles.badge,
        {
          backgroundColor: tokens.status.danger.color,
          borderColor: borderColor ?? colors.background,
        },
      ]}
    >
      <ThemedText type="caption" style={styles.text}>
        {count > 9 ? "9+" : String(count)}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: 3,
    right: 3,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  text: {
    fontSize: 10,
    lineHeight: 12,
    color: "#FFFFFF",
  },
});
