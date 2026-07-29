import { SymbolView, type SymbolViewProps } from "expo-symbols";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppIcon } from "@/components/ui/app-icon";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { AppIcon as AppIconName } from "@/lib/names-of-allah-ui";

type SectionHeaderProps = {
  title: string;
  icon?: AppIconName;
  subtitle?: string;
  badge?: ReactNode;
  actionLabel?: string;
  actionIcon?: SymbolViewProps["name"];
  actionAccessibilityLabel?: string;
  onActionPress?: () => void;
};

export function SectionHeader({
  title,
  icon,
  subtitle,
  badge,
  actionLabel,
  actionIcon,
  actionAccessibilityLabel,
  onActionPress,
}: SectionHeaderProps) {
  const { colors, tokens } = useThemeTokens();

  return (
    <View style={styles.row}>
      <View style={styles.titleRow}>
        {icon ? (
          <View style={[styles.iconWell, { backgroundColor: tokens.accentSoft }]}>
            <AppIcon icon={icon} size={14} tintColor={colors.accent} />
          </View>
        ) : null}
        <View style={styles.titleBlock}>
          <ThemedText type="subtitle" heading={2} style={styles.title}>
            {title}
          </ThemedText>
          {subtitle ? (
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.subtitle}>
              {subtitle}
            </ThemedText>
          ) : null}
        </View>
      </View>

      {badge ? <View style={styles.badge}>{badge}</View> : null}

      {actionLabel ? (
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={actionAccessibilityLabel ?? actionLabel}
          onPress={onActionPress}
          haptic="light"
          dimOnPress
          hitSlop={8}
          style={styles.action}
        >
          <View style={styles.actionRow}>
            {actionIcon ? (
              <SymbolView name={actionIcon} size={14} tintColor={colors.accentText} />
            ) : null}
            <ThemedText type="smallBold" style={{ color: colors.accentText }}>
              {actionLabel}
            </ThemedText>
          </View>
        </PressableScale>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: Spacing.two,
    width: "100%",
    marginTop: Spacing.two,
  },
  titleRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    alignSelf: "stretch",
    gap: Spacing.two,
    minWidth: 0,
  },
  titleBlock: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  title: {
    flexShrink: 1,
    alignSelf: "stretch",
    textTransform: "capitalize",
  },
  subtitle: {
    flexShrink: 1,
  },
  badge: {
    flexShrink: 0,
    alignSelf: "center",
  },
  iconWell: {
    flexShrink: 0,
    width: 28,
    height: 28,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  action: {
    flexShrink: 0,
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
});
