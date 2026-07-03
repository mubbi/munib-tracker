import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { NotificationBadge } from "@/components/ui/notification-badge";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { ThemedText } from "./themed-text";

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  notificationCount?: number;
  onNotificationsPress?: () => void;
  onBack?: () => void;
};

export function AppHeader({
  title,
  subtitle,
  eyebrow,
  notificationCount = 0,
  onNotificationsPress,
  onBack,
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + Spacing.two,
          backgroundColor: colors.background,
        },
      ]}
    >
      {onBack ? (
        <Pressable
          accessibilityLabel={t("common.goBack")}
          accessibilityRole="button"
          onPress={onBack}
          style={({ pressed }) => [
            styles.backButton,
            { backgroundColor: tokens.accentSoft, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <SymbolView
            name={{ ios: "chevron.left", android: "arrow_back", web: "arrow_back" }}
            size={19}
            tintColor={colors.accent}
          />
        </Pressable>
      ) : null}

      <View style={styles.textBlock}>
        {eyebrow ? (
          <ThemedText type="label" style={{ color: colors.accent }}>
            {eyebrow}
          </ThemedText>
        ) : null}
        <ThemedText type="header">{title}</ThemedText>
        {subtitle ? (
          <ThemedText type="small" themeColor="mutedForeground">
            {subtitle}
          </ThemedText>
        ) : null}
      </View>

      <Pressable
        accessibilityLabel={t("common.notifications")}
        accessibilityRole="button"
        onPress={onNotificationsPress}
        style={({ pressed }) => [
          styles.notificationButton,
          { backgroundColor: tokens.accentSoft, opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <SymbolView
          name={{ ios: "bell.fill", android: "notifications", web: "notifications" }}
          size={19}
          tintColor={colors.accent}
        />
        <NotificationBadge count={notificationCount} />
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
    gap: Spacing.three,
  },
  textBlock: {
    flex: 1,
    gap: Spacing.half,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    borderCurve: "continuous",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    borderCurve: "continuous",
  },
});
