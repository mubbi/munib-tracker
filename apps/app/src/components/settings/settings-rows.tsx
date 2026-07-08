import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { memo, useMemo } from "react";
import { StyleSheet, Switch, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { chevronForward } from "@/lib/rtl";

type SymbolName = SymbolViewProps["name"];

export function SettingsRow({
  icon,
  title,
  subtitle,
  value,
  onPress,
}: {
  icon: SymbolName;
  title: string;
  subtitle?: string;
  value?: string;
  onPress: () => void;
}) {
  const { colors, tokens } = useThemeTokens();
  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={[styles.row, { backgroundColor: colors.muted }]}
    >
      <View style={[styles.iconWell, { backgroundColor: tokens.accentSoft }]}>
        <SymbolView name={icon} size={18} tintColor={colors.accent} />
      </View>
      <View style={styles.body}>
        <ThemedText type="small">{title}</ThemedText>
        {subtitle ? (
          <ThemedText type="caption" themeColor="mutedForeground">
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
      {value ? (
        <ThemedText type="caption" themeColor="mutedForeground">
          {value}
        </ThemedText>
      ) : null}
      <SymbolView name={chevronForward()} size={14} tintColor={colors.mutedForeground} />
    </PressableScale>
  );
}

export const ToggleRow = memo(
  function ToggleRow({
    icon,
    title,
    subtitle,
    value,
    disabled,
    onValueChange,
  }: {
    icon?: SymbolName;
    title: string;
    subtitle?: string;
    value: boolean;
    disabled?: boolean;
    onValueChange: (value: boolean) => void;
  }) {
    const { colors, tokens } = useThemeTokens();
    const trackColor = useMemo(
      () => ({ true: colors.accent, false: tokens.track }),
      [colors.accent, tokens.track],
    );

    return (
      <View style={[styles.row, { backgroundColor: colors.muted, opacity: disabled ? 0.5 : 1 }]}>
        {icon ? (
          <View style={[styles.iconWell, { backgroundColor: tokens.accentSoft }]}>
            <SymbolView name={icon} size={18} tintColor={colors.accent} />
          </View>
        ) : null}
        <View style={styles.body}>
          <ThemedText type="small">{title}</ThemedText>
          {subtitle ? (
            <ThemedText type="caption" themeColor="mutedForeground">
              {subtitle}
            </ThemedText>
          ) : null}
        </View>
        <Switch
          value={value}
          disabled={disabled}
          onValueChange={onValueChange}
          trackColor={trackColor}
          thumbColor={colors.card}
          accessibilityLabel={title}
        />
      </View>
    );
  },
  (prev, next) =>
    prev.value === next.value &&
    prev.disabled === next.disabled &&
    prev.title === next.title &&
    prev.subtitle === next.subtitle &&
    prev.icon === next.icon,
);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    minHeight: 56,
  },
  iconWell: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    flex: 1,
    gap: 2,
  },
});
