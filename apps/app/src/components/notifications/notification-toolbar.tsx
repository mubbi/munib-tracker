import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

type NotificationToolbarProps = {
  unreadCount: number;
  onMarkAllRead?: () => void;
  onClearAll?: () => void;
  onOpenSettings: () => void;
};

export function NotificationToolbar({
  unreadCount,
  onMarkAllRead,
  onClearAll,
  onOpenSettings,
}: NotificationToolbarProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();

  return (
    <View style={styles.row}>
      {unreadCount > 0 && onMarkAllRead ? (
        <PressableScale
          haptic="light"
          accessibilityRole="button"
          accessibilityLabel={t("notifCenter.markAllRead")}
          onPress={onMarkAllRead}
          style={[styles.chip, { backgroundColor: tokens.accentSoft }]}
        >
          <SymbolView
            name={{ ios: "checkmark.circle.fill", android: "check_circle", web: "check_circle" }}
            size={16}
            tintColor={colors.accent}
          />
          <ThemedText type="smallBold" style={{ color: colors.accent }}>
            {t("notifCenter.markAllRead")}
          </ThemedText>
          <View style={[styles.badge, { backgroundColor: colors.accent }]}>
            <ThemedText type="caption" style={{ color: colors.accentForeground }}>
              {unreadCount > 99 ? "99+" : unreadCount}
            </ThemedText>
          </View>
        </PressableScale>
      ) : (
        <View />
      )}

      <View style={styles.actions}>
        {onClearAll ? (
          <PressableScale
            haptic="light"
            accessibilityRole="button"
            accessibilityLabel={t("notifCenter.clearAll")}
            onPress={onClearAll}
            style={[styles.chip, { backgroundColor: tokens.status.danger.soft }]}
          >
            <SymbolView
              name={{ ios: "trash", android: "delete_sweep", web: "delete_sweep" }}
              size={16}
              tintColor={tokens.status.danger.text}
            />
            <ThemedText type="smallBold" style={{ color: tokens.status.danger.text }}>
              {t("notifCenter.clearAll")}
            </ThemedText>
          </PressableScale>
        ) : null}

        <PressableScale
          haptic="light"
          accessibilityRole="button"
          accessibilityLabel={t("notifCenter.settings")}
          onPress={onOpenSettings}
          style={[styles.chip, { backgroundColor: colors.muted }]}
        >
          <SymbolView
            name={{ ios: "gearshape.fill", android: "settings", web: "settings" }}
            size={16}
            tintColor={colors.mutedForeground}
          />
          <ThemedText type="smallBold" themeColor="mutedForeground">
            {t("notifCenter.settings")}
          </ThemedText>
        </PressableScale>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one + 2,
    paddingHorizontal: Spacing.two + 2,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    minHeight: 36,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.one,
  },
});
