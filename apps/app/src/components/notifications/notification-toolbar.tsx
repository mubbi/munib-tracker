import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";

const CHIP_HIT_SLOP = { top: 6, bottom: 6, left: 4, right: 4 } as const;

type NotificationToolbarProps = {
  unreadCount: number;
  markingAllRead?: boolean;
  onMarkAllRead?: () => void;
  onClearAll?: () => void;
  /** Omit to hide the settings chip (e.g. TV, where reminders aren't available). */
  onOpenSettings?: () => void;
};

export function NotificationToolbar({
  unreadCount,
  markingAllRead = false,
  onMarkAllRead,
  onClearAll,
  onOpenSettings,
}: NotificationToolbarProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const showMarkAllRead = markingAllRead || (unreadCount > 0 && onMarkAllRead);
  const tv = isTV();
  /** TV: chips become 48dp D-pad targets with body-size labels. */
  const chipStyle = tv ? [styles.chip, styles.chipTv] : styles.chip;
  const labelType = tv ? "small" : "caption";

  return (
    <View style={styles.row}>
      {showMarkAllRead ? (
        <PressableScale
          haptic="light"
          accessibilityRole="button"
          accessibilityLabel={
            markingAllRead ? t("notifCenter.markingAllRead") : t("notifCenter.markAllRead")
          }
          accessibilityState={{ busy: markingAllRead, disabled: markingAllRead }}
          disabled={markingAllRead}
          onPress={markingAllRead ? undefined : onMarkAllRead}
          hitSlop={CHIP_HIT_SLOP}
          style={[
            chipStyle,
            { backgroundColor: tokens.accentSoft, opacity: markingAllRead ? 0.85 : 1 },
          ]}
        >
          {markingAllRead ? (
            <ActivityIndicator size="small" color={colors.accent} />
          ) : (
            <SymbolView
              name={{ ios: "checkmark.circle.fill", android: "check_circle", web: "check_circle" }}
              size={14}
              tintColor={colors.accent}
            />
          )}
          <ThemedText type={labelType} style={{ color: colors.accent }}>
            {markingAllRead ? t("notifCenter.markingAllRead") : t("notifCenter.markAllRead")}
          </ThemedText>
          {!markingAllRead ? (
            <View style={[styles.badge, { backgroundColor: colors.accent }]}>
              <ThemedText type="caption" style={{ color: colors.accentForeground, fontSize: 11 }}>
                {unreadCount > 99 ? "99+" : unreadCount}
              </ThemedText>
            </View>
          ) : null}
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
            hitSlop={CHIP_HIT_SLOP}
            style={[chipStyle, { backgroundColor: tokens.status.danger.soft }]}
          >
            <SymbolView
              name={{ ios: "trash", android: "delete_sweep", web: "delete_sweep" }}
              size={14}
              tintColor={tokens.status.danger.text}
            />
            <ThemedText type={labelType} style={{ color: tokens.status.danger.text }}>
              {t("notifCenter.clearAll")}
            </ThemedText>
          </PressableScale>
        ) : null}

        {onOpenSettings ? (
          <PressableScale
            haptic="light"
            accessibilityRole="button"
            accessibilityLabel={t("notifCenter.settings")}
            onPress={onOpenSettings}
            hitSlop={CHIP_HIT_SLOP}
            style={[chipStyle, { backgroundColor: colors.muted }]}
          >
            <SymbolView
              name={{ ios: "gearshape.fill", android: "settings", web: "settings" }}
              size={14}
              tintColor={colors.mutedForeground}
            />
            <ThemedText type={labelType} themeColor="mutedForeground">
              {t("notifCenter.settings")}
            </ThemedText>
          </PressableScale>
        ) : null}
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
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
  },
  chipTv: {
    minHeight: TvLayout.chipMinHeight,
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
  },
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.one,
  },
});
