import { GlassView } from "expo-glass-effect";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import type { ComponentRef, Ref } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

import { hasLiquidGlass } from "@/components/ui/glass-surface";
import { NotificationBadge } from "@/components/ui/notification-badge";
import { PressableScale } from "@/components/ui/pressable-scale";
import { IconSize, Opacity, Radius } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import type { HapticFeedback } from "@/lib/haptics";
import { isTV } from "@/lib/platform/is-tv";

/** TV floor for icon-only D-pad targets (dp, pre-density). */
const TV_MIN_ICON_TARGET = 56;
/** Phone / tablet / web floor (pt, pre-density) — the iOS / WCAG 44 minimum. */
const MIN_ICON_TARGET = 44;

type IconButtonProps = {
  /** TV: request initial D-pad focus on this control. */
  preferredFocus?: boolean;
  /** Host ref — e.g. a `Sheet` `returnFocusRef` so TV focus returns here on close. */
  ref?: Ref<ComponentRef<typeof View>>;
  name: SymbolViewProps["name"];
  onPress?: () => void;
  /** Long-press (touch) — e.g. a context action sheet. */
  onLongPress?: () => void;
  /** Glyph size in points. The tap target stays >= `hitTarget` regardless. */
  size?: number;
  tintColor?: string;
  /** Required so every icon-only control is named for assistive tech. */
  accessibilityLabel: string;
  accessibilityHint?: string;
  accessibilityState?: { selected?: boolean; disabled?: boolean; busy?: boolean };
  haptic?: HapticFeedback | false;
  /** Minimum square tap area. Floored at 44pt (56 on TV) — smaller values are raised. */
  hitTarget?: number;
  /** Optional filled/tinted background well behind the glyph. */
  background?: string;
  /**
   * Render the button as an interactive Liquid Glass well on iOS 26+
   * (per the building-native-ui glass guide). Falls back to `background`
   * elsewhere, so older iOS / Android / web keep the tinted well.
   */
  glass?: boolean;
  /** Corner radius of the glass/background well (defaults to a rounded square). */
  wellRadius?: number;
  disabled?: boolean;
  /**
   * Swaps the glyph for a spinner, blocks presses and reports `busy` (e.g. while
   * a share image renders). The button stays focusable while loading.
   */
  loading?: boolean;
  /**
   * Count badge (e.g. unread notifications). Hidden when `0` / unset; drawn as a
   * `NotificationBadge` hidden from assistive tech, with the count folded into
   * the accessible label ("Notifications, 3 new").
   */
  badge?: number;
  /** Overrides the badge-aware label (e.g. a feature-specific "3 unread" string). */
  badgeAccessibilityLabel?: string;
  /** Badge ring colour — the surface behind the button (defaults to `background`). */
  badgeBorderColor?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * A glyph-only button that always presents at least a `hitTarget` (44pt) square
 * touch area even when the icon is small, closing the systemic sub-44 gaps that
 * bare `SymbolView` + `PressableScale` call sites left open. Centralises the
 * accessibility role/label/state so icon controls are consistent app-wide.
 */
export function IconButton({
  name,
  onPress,
  onLongPress,
  size = IconSize.lg,
  tintColor,
  accessibilityLabel,
  accessibilityHint,
  accessibilityState,
  haptic = "light",
  hitTarget = MIN_ICON_TARGET,
  background,
  glass = false,
  wellRadius = Radius.md,
  disabled,
  loading = false,
  badge,
  badgeAccessibilityLabel,
  badgeBorderColor,
  style,
  preferredFocus,
  ref,
}: IconButtonProps) {
  const { t } = useTranslation();
  // 44pt is a touch target; from 3m away a D-pad target needs to be larger.
  const floor = isTV() ? TV_MIN_ICON_TARGET : MIN_ICON_TARGET;
  const target = tvDp(Math.max(hitTarget, floor));
  const useGlass = glass && hasLiquidGlass;
  const hasBadge = badge != null && badge > 0;
  // The badge node is hidden from assistive tech, so its count is folded into
  // the name via the pluralised `common.badgeA11y` ("Notifications, 3 new").
  const label = hasBadge
    ? (badgeAccessibilityLabel ??
      t("common.badgeA11y", { label: accessibilityLabel, count: badge }))
    : accessibilityLabel;

  const button = (
    <PressableScale
      ref={ref}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ busy: loading, ...accessibilityState }}
      // react-native-web drops `accessibilityState`; ARIA reaches the DOM.
      aria-busy={loading || undefined}
      // Loading is not `disabled`: a disabled web <button> loses focus.
      disabled={disabled}
      onPress={onPress ? () => (loading ? undefined : onPress()) : undefined}
      onLongPress={onLongPress ? () => (loading ? undefined : onLongPress()) : undefined}
      haptic={loading ? false : haptic}
      hitSlop={8}
      {...(preferredFocus && isTV() ? { hasTVPreferredFocus: true } : {})}
      // Always clip a bounded ripple to the well radius — even without a filled
      // background — so icon controls match rounded cards/rows on Android.
      rippleRadius={wellRadius}
      style={[
        styles.base,
        {
          width: target,
          height: target,
          minWidth: target,
          minHeight: target,
          borderRadius: wellRadius,
        },
        // The glass well dims as a whole; don't dim the button inside it again.
        useGlass ? styles.undimmed : null,
        // The glass wrapper supplies the well; only paint a solid background
        // when we're not rendering Liquid Glass.
        !useGlass && background ? { backgroundColor: background } : null,
        style,
      ]}
    >
      <View style={styles.glyph}>
        {loading ? (
          <ActivityIndicator size="small" color={tintColor} />
        ) : (
          <SymbolView name={name} size={size} tintColor={tintColor} />
        )}
      </View>
      {hasBadge ? (
        <View
          style={styles.badgeLayer}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          aria-hidden
          testID="icon-button-badge"
        >
          <NotificationBadge count={badge} borderColor={badgeBorderColor} />
        </View>
      ) : null}
    </PressableScale>
  );

  if (useGlass) {
    return (
      <GlassView
        // Static well only — `isInteractive` runs SwiftUI FluidSpringAnimation on
        // press, which AppHangs when stacked with native navigation (Sentry).
        // PressableScale already supplies the press feedback.
        isInteractive={false}
        glassEffectStyle="regular"
        style={[
          styles.glassWell,
          { borderRadius: wellRadius, opacity: disabled ? Opacity.disabled : 1 },
        ]}
      >
        {button}
      </GlassView>
    );
  }

  return button;
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    borderCurve: "continuous",
  },
  glyph: {
    pointerEvents: "none",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  glassWell: {
    borderCurve: "continuous",
    overflow: "hidden",
  },
  undimmed: {
    opacity: 1,
  },
  badgeLayer: {
    ...StyleSheet.absoluteFill,
    pointerEvents: "none",
  },
});
