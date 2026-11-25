import { SymbolView, type SymbolViewProps } from "expo-symbols";
import {
  ActivityIndicator,
  Platform,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppIcon } from "@/components/ui/app-icon";
import { PressableScale } from "@/components/ui/pressable-scale";
import { BorderWidth, Control, IconSize, Radius, Spacing, withAlpha } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { HapticFeedback } from "@/lib/haptics";
import type { AppIcon as AppIconName } from "@/lib/names-of-allah-ui";
import { isTV } from "@/lib/platform/is-tv";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  label: string;
  onPress?: () => void;
  /**
   * `primary` accent fill · `secondary` accent tint · `ghost` neutral wash ·
   * `destructive` AA danger fill (`status.danger.fill` / `.onFill`) for
   * irreversible actions — never override a primary's background instead.
   */
  variant?: ButtonVariant;
  /** `sm` dense toolbars only (36) · `md` default (44) · `lg` full-width primary CTA (52). */
  size?: ButtonSize;
  icon?: AppIconName;
  trailingIcon?: SymbolViewProps["name"];
  fullWidth?: boolean;
  disabled?: boolean;
  /**
   * In-flight async action: a spinner replaces the leading icon (or overlays
   * the label when there is none), presses are blocked, `accessibilityState.busy`
   * is set and the button keeps its size. Stays focusable, unlike `disabled`.
   */
  loading?: boolean;
  /** Override the label (and icon) color — useful on branded hero surfaces. */
  labelColor?: string;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
  /** TV: request initial D-pad focus on this control. */
  preferredFocus?: boolean;
  /**
   * Press haptic (default `"light"`). `"success"` for completing actions
   * ("Mark complete"), `false` for silent buttons. Off while `loading`.
   */
  haptic?: HapticFeedback | false;
};

/**
 * Minimum height for a button `size`. Phone / tablet / web use the `Control`
 * scale; TV uses the pre-scaled `TvLayout` focus targets (`tvDp`, so tvOS gets
 * the same physical size as Android TV).
 */
export function buttonMinHeight(size: ButtonSize, tv: boolean = isTV()): number {
  if (tv) return size === "sm" ? TvLayout.chipMinHeight : TvLayout.minFocusTarget;
  return Control[size];
}

/**
 * Vertical `hitSlop` that lifts a button's touch area to `Control.minTouch`
 * (44 iOS · 48 Android). Web ignores `hitSlop`, so there the visual height is
 * the target — `md` / `lg` already meet 44.
 */
function minTouchSlop(minHeight: number, tv: boolean) {
  if (tv || Platform.OS === "web") return undefined;
  const slop = Math.ceil((Control.minTouch - minHeight) / 2);
  return slop > 0 ? { top: slop, bottom: slop } : undefined;
}

export function Button({
  label,
  onPress,
  variant = "primary",
  size = "md",
  icon,
  trailingIcon,
  fullWidth,
  disabled,
  loading = false,
  labelColor,
  accessibilityHint,
  style,
  preferredFocus,
  haptic = "light",
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
      : variant === "destructive"
        ? tokens.status.danger.fill
        : variant === "secondary"
          ? withAlpha(colors.accent, tokens.isDark ? 0.28 : 0.2)
          : tokens.hover;

  const fg =
    labelColor ??
    (variant === "primary"
      ? colors.accentForeground
      : variant === "destructive"
        ? tokens.status.danger.onFill
        : variant === "ghost"
          ? colors.mutedForeground
          : // Contrast-checked for the secondary tint (≥ 4.5:1 on every surface).
            tokens.accentOnSoft);

  const isSm = size === "sm";
  const paddingVertical = isSm ? Spacing.oneHalf : Spacing.two;
  const paddingHorizontal = isSm ? Spacing.twoHalf : size === "lg" ? Spacing.four : Spacing.three;
  const minHeight = buttonMinHeight(size, tv);
  // Glyphs stay unscaled dp — SymbolView / AppIcon apply the tvOS density. TV
  // goes one step up the scale.
  const iconSize = isSm ? (tv ? IconSize.md : IconSize.sm) : tv ? IconSize.lg : IconSize.md;
  const borderWidth =
    variant === "ghost" ? BorderWidth.thin : variant === "secondary" ? BorderWidth.hairline : 0;
  const borderColor = variant === "secondary" ? tokens.accentBorder : colors.border;

  const spinner = <ActivityIndicator size="small" color={fg} />;
  // With no leading icon the spinner overlays a transparent label, so the
  // button never changes width when `loading` flips.
  const overlaySpinner = loading && !icon;

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityHint={accessibilityHint}
      accessibilityState={loading ? { busy: true } : undefined}
      // react-native-web drops `accessibilityState`; ARIA reaches the DOM.
      aria-busy={loading || undefined}
      disabled={disabled}
      // Guarded rather than removed, so the control keeps its pointer cursor
      // and keyboard activation while busy — it just does nothing.
      onPress={onPress ? () => (loading ? undefined : onPress()) : undefined}
      scaleTo={loading ? 1 : 0.97}
      dimOnPress={!loading}
      haptic={loading ? false : haptic}
      hitSlop={minTouchSlop(minHeight, tv)}
      {...(preferredFocus && tv ? { hasTVPreferredFocus: true } : {})}
      style={[
        styles.base,
        {
          backgroundColor: bg,
          minHeight,
          paddingVertical,
          paddingHorizontal,
          alignSelf: fullWidth ? "stretch" : "flex-start",
          borderWidth,
          borderColor,
        },
        style,
      ]}
    >
      <View style={styles.content}>
        {icon ? (
          loading ? (
            <View style={[styles.iconBox, { width: iconSize, height: iconSize }]}>{spinner}</View>
          ) : (
            <AppIcon icon={icon} size={iconSize} tintColor={fg} />
          )
        ) : null}
        <ThemedText
          type={isSm ? "footnote" : "button"}
          weight={isSm ? "semibold" : undefined}
          style={[{ color: fg }, overlaySpinner && styles.hiddenLabel]}
        >
          {label}
        </ThemedText>
        {trailingIcon ? <SymbolView name={trailingIcon} size={iconSize} tintColor={fg} /> : null}
        {overlaySpinner ? (
          <View style={styles.spinnerOverlay} testID="button-spinner">
            {spinner}
          </View>
        ) : null}
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
  iconBox: {
    alignItems: "center",
    justifyContent: "center",
  },
  // Keeps the label's width (and its accessible name) while the spinner shows.
  hiddenLabel: {
    opacity: 0,
  },
  spinnerOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
  },
});
