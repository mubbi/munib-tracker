import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppIcon } from "@/components/ui/app-icon";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { AppIcon as AppIconName } from "@/lib/names-of-allah-ui";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md";

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: AppIconName;
  trailingIcon?: SymbolViewProps["name"];
  fullWidth?: boolean;
  disabled?: boolean;
  /** Override the label (and icon) color — useful on branded hero surfaces. */
  labelColor?: string;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  label,
  onPress,
  variant = "primary",
  size = "md",
  icon,
  trailingIcon,
  fullWidth,
  disabled,
  labelColor,
  style,
}: ButtonProps) {
  const { colors, tokens } = useThemeTokens();

  const bg =
    variant === "primary"
      ? colors.accent
      : variant === "secondary"
        ? tokens.accentSoft
        : "transparent";

  const fg =
    labelColor ??
    (variant === "primary"
      ? colors.accentForeground
      : variant === "ghost"
        ? colors.mutedForeground
        : colors.accentText);

  const isSm = size === "sm";
  const paddingVertical = isSm ? Spacing.one + 2 : Spacing.two;
  const paddingHorizontal = isSm ? Spacing.two + 2 : Spacing.three;
  const minHeight = isSm ? 36 : 40;
  const iconSize = isSm ? 14 : 16;
  const labelType = isSm ? "caption" : ("smallBold" as const);

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      scaleTo={0.97}
      dimOnPress
      haptic="light"
      hitSlop={minHeight < 44 ? { top: 4, bottom: 4 } : undefined}
      style={[
        styles.base,
        {
          backgroundColor: bg,
          minHeight,
          paddingVertical,
          paddingHorizontal,
          opacity: disabled ? 0.5 : 1,
          alignSelf: fullWidth ? "stretch" : "flex-start",
          borderWidth: variant === "ghost" ? 1 : 0,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      <View style={styles.content}>
        {icon ? <AppIcon icon={icon} size={iconSize} tintColor={fg} /> : null}
        <ThemedText type={labelType} style={{ color: fg }}>
          {label}
        </ThemedText>
        {trailingIcon ? <SymbolView name={trailingIcon} size={iconSize} tintColor={fg} /> : null}
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.md,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
});
