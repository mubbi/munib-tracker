import type { ReactNode } from "react";
import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Shadows, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

type CardVariant = "elevated" | "outline" | "muted" | "plain";

type CardProps = {
  children: ReactNode;
  variant?: CardVariant;
  padding?: keyof typeof Spacing | 0;
  radius?: keyof typeof Radius;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  accessibilityLabel?: string;
};

export function Card({
  children,
  variant = "elevated",
  padding = "four",
  radius = "lg",
  style,
  onPress,
  accessibilityLabel,
}: CardProps) {
  const { colors, tokens } = useThemeTokens();

  const paddingValue = padding === 0 ? 0 : Spacing[padding];

  const baseStyle: ViewStyle = {
    width: "100%",
    alignSelf: "stretch",
    padding: paddingValue,
    borderRadius: Radius[radius],
    borderCurve: "continuous",
  };

  const variantStyle: ViewStyle =
    variant === "outline"
      ? { backgroundColor: "transparent", borderWidth: 1, borderColor: colors.border }
      : variant === "muted"
        ? { backgroundColor: colors.muted }
        : variant === "plain"
          ? { backgroundColor: colors.card }
          : {
              backgroundColor: colors.card,
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: tokens.hairline,
              ...Shadows.sm,
            };

  if (onPress) {
    return (
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        scaleTo={0.985}
        haptic="light"
        style={[baseStyle, variantStyle, style]}
      >
        {children}
      </PressableScale>
    );
  }

  return <View style={[baseStyle, variantStyle, style]}>{children}</View>;
}
