import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md";

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: SymbolViewProps["name"];
  trailingIcon?: SymbolViewProps["name"];
  fullWidth?: boolean;
  disabled?: boolean;
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
    variant === "primary"
      ? colors.accentForeground
      : variant === "ghost"
        ? colors.mutedForeground
        : colors.accentText;

  const paddingVertical = size === "sm" ? Spacing.two : Spacing.three - 2;
  const paddingHorizontal = size === "sm" ? Spacing.three : Spacing.four;

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      scaleTo={0.97}
      dimOnPress
      haptic="light"
      style={[
        styles.base,
        {
          backgroundColor: bg,
          minHeight: size === "sm" ? 44 : 48,
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
        {icon ? <SymbolView name={icon} size={size === "sm" ? 15 : 17} tintColor={fg} /> : null}
        <ThemedText type={size === "sm" ? "smallBold" : "default"} style={{ color: fg }}>
          {label}
        </ThemedText>
        {trailingIcon ? (
          <SymbolView name={trailingIcon} size={size === "sm" ? 15 : 17} tintColor={fg} />
        ) : null}
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.pill,
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
