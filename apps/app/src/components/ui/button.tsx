import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppIcon } from "@/components/ui/app-icon";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { AppIcon as AppIconName } from "@/lib/names-of-allah-ui";
import { isTV } from "@/lib/platform/is-tv";

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
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
  /** TV: request initial D-pad focus on this control. */
  preferredFocus?: boolean;
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
  accessibilityHint,
  style,
  preferredFocus,
}: ButtonProps) {
  const { colors, tokens } = useThemeTokens();
  const tv = isTV();

  // Ghost must still paint a real (near-invisible) fill. Fully transparent
  // Pressables intermittently drop Fabric taps inside Modals — Cancel looks
  // pressed while the dialog stays open; backdrop dismiss still works.
  // Secondary uses a stronger soft fill in light mode than accentSoft chips —
  // 0.14 alpha washes out on cream cards; CTAs need a clearer edge.
  const bg =
    variant === "primary"
      ? colors.accent
      : variant === "secondary"
        ? withAlpha(colors.accent, tokens.isDark ? 0.28 : 0.2)
        : withAlpha(colors.foreground, tokens.isDark ? 0.06 : 0.04);

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
  const minHeight = tv ? (isSm ? 48 : TvLayout.minFocusTarget) : isSm ? 36 : 40;
  const iconSize = isSm ? 14 : 16;
  const labelType = isSm ? "caption" : ("smallBold" as const);
  const borderWidth =
    variant === "ghost" ? 1 : variant === "secondary" ? StyleSheet.hairlineWidth : 0;
  const borderColor = variant === "secondary" ? tokens.accentBorder : colors.border;

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      scaleTo={0.97}
      dimOnPress
      haptic="light"
      hitSlop={minHeight < 44 ? { top: 4, bottom: 4 } : undefined}
      {...(preferredFocus && tv ? { hasTVPreferredFocus: true } : {})}
      style={[
        styles.base,
        {
          backgroundColor: bg,
          minHeight,
          paddingVertical,
          paddingHorizontal,
          opacity: disabled ? 0.5 : 1,
          alignSelf: fullWidth ? "stretch" : "flex-start",
          borderWidth,
          borderColor,
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
