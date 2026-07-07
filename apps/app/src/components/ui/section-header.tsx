import { SymbolView, type SymbolViewProps } from "expo-symbols";
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
  actionLabel?: string;
  actionIcon?: SymbolViewProps["name"];
  actionAccessibilityLabel?: string;
  onActionPress?: () => void;
};

export function SectionHeader({
  title,
  icon,
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
        <ThemedText type="subtitle" heading={2} style={styles.title}>
          {title}
        </ThemedText>
      </View>

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
    gap: Spacing.two,
    minWidth: 0,
  },
  title: {
    flex: 1,
    flexShrink: 1,
    textTransform: "capitalize",
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
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
});
