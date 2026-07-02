import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { ThemedText } from "./themed-text";

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  notificationCount?: number;
  onNotificationsPress?: () => void;
};

export function AppHeader({
  title,
  subtitle,
  notificationCount = 0,
  onNotificationsPress,
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + Spacing.two,
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={styles.textBlock}>
        <ThemedText type="header" style={{ color: colors.foreground }}>
          {title}
        </ThemedText>
        {subtitle ? (
          <ThemedText type="small" themeColor="mutedForeground">
            {subtitle}
          </ThemedText>
        ) : null}
      </View>

      <Pressable
        accessibilityLabel="Notifications"
        accessibilityRole="button"
        onPress={onNotificationsPress}
        style={({ pressed }) => [
          styles.notificationButton,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            opacity: pressed ? 0.75 : 1,
          },
        ]}
      >
        <SymbolView
          name={{ ios: "bell.fill", android: "notifications", web: "notifications" }}
          size={20}
          tintColor={colors.accent}
        />
        {notificationCount > 0 ? (
          <View style={[styles.badge, { backgroundColor: colors.accent }]}>
            <ThemedText
              type="smallBold"
              style={[styles.badgeText, { color: colors.accentForeground }]}
            >
              {notificationCount > 9 ? "9+" : String(notificationCount)}
            </ThemedText>
          </View>
        ) : null}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: Spacing.three,
  },
  textBlock: {
    flex: 1,
    gap: Spacing.half,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    borderCurve: "continuous",
  },
  badge: {
    position: "absolute",
    top: 4,
    right: 4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    lineHeight: 12,
  },
});
