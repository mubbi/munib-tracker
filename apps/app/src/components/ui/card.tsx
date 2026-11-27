import type { ReactNode } from "react";
import { type AccessibilityState, type StyleProp, View, type ViewStyle } from "react-native";

import { PressableScale } from "@/components/ui/pressable-scale";
import { BorderWidth, Radius, Shadows, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

type CardVariant = "elevated" | "outline" | "muted" | "plain";

type CardProps = {
  children: ReactNode;
  variant?: CardVariant;
  padding?: keyof typeof Spacing | 0;
  radius?: keyof typeof Radius;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  /** Web: in-app route this opens — renders a crawlable `<a href>` (see `PressableScale`). */
  href?: string;
  accessibilityLabel?: string;
  accessibilityState?: AccessibilityState;
  /** TV: request initial D-pad focus on this card. */
  preferredFocus?: boolean;
  testID?: string;
};

export function Card({
  children,
  variant = "elevated",
  // Spec: card padding is Spacing.three (WP-3A flipped the default from four).
  padding = "three",
  radius = "lg",
  style,
  onPress,
  href,
  accessibilityLabel,
  accessibilityState,
  preferredFocus,
  testID,
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
      ? {
          backgroundColor: "transparent",
          borderWidth: BorderWidth.thin,
          borderColor: colors.border,
        }
      : variant === "muted"
        ? { backgroundColor: colors.muted }
        : variant === "plain"
          ? { backgroundColor: colors.card }
          : {
              // A full thin outline (not hairlineWidth) — on cream and deep-green
              // pages the fill step alone is too subtle to read as a card.
              backgroundColor: colors.card,
              borderWidth: BorderWidth.thin,
              borderColor: colors.cardBorder,
              ...(tokens.isDark ? Shadows.md : Shadows.sm),
            };

  if (onPress) {
    return (
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={accessibilityState}
        onPress={onPress}
        href={href}
        testID={testID}
        scaleTo={0.985}
        haptic="light"
        {...(preferredFocus ? { hasTVPreferredFocus: true } : {})}
        style={[baseStyle, variantStyle, style]}
      >
        {children}
      </PressableScale>
    );
  }

  return (
    <View testID={testID} style={[baseStyle, variantStyle, style]}>
      {children}
    </View>
  );
}
