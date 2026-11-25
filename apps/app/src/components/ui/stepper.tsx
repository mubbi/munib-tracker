import { SymbolView } from "expo-symbols";
import { type Ref, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  type AccessibilityActionEvent,
  Platform,
  StyleSheet,
  View,
  type ViewInstance,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Control, IconSize, Opacity, Radius, Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { triggerHaptic } from "@/lib/haptics";
import { isTV } from "@/lib/platform/is-tv";

/** TV D-pad target for each step button, regardless of `size`. */
const TV_STEP_TARGET = tvDp(56);

type StepperProps = {
  value: number;
  /**
   * Called with the next, clamped value (`value ± step`). Use this or the
   * `onIncrement` / `onDecrement` pair; `onChange` wins when both are set.
   */
  onChange?: (next: number) => void;
  onIncrement?: () => void;
  onDecrement?: () => void;
  /** Accessible name of the control, e.g. "Fajr qaza". */
  label: string;
  /** When set, the center value becomes tappable (e.g. manual qaza edit). */
  onValuePress?: () => void;
  /** Accessibility label for the tappable value — required when `onValuePress` is set. */
  valueAccessibilityLabel?: string;
  min?: number;
  /** Upper bound; the + button disables at it. Unbounded when unset. */
  max?: number;
  /** Change per press / accessibility action (default 1). */
  step?: number;
  /** Display + spoken text for the value (defaults to the number). */
  formatValue?: (value: number) => string;
  /** `md` (default, 44pt — `Control.md`) or `sm` (36pt + hitSlop) for dense tables only. */
  size?: "sm" | "md";
  /** Button background — defaults to the card color. */
  buttonBackground?: string;
  /** Disables both buttons and dims the control once. */
  disabled?: boolean;
  /** Minimum width of the value column (keeps the buttons still as digits change). */
  valueMinWidth?: number;
};

/**
 * −/value/+ stepper — the one stepper (Qaza counters, Fasting, settings rows via
 * `StepperRow`).
 *
 * Screen readers (iOS / Android) get a single `adjustable` element: its name is
 * `label`, `accessibilityValue` carries `{ min, max, now, text }`, swipe up/down
 * runs `increment` / `decrement`, double-tap runs `onValuePress` when set. On
 * web it is a labelled `group` of two real buttons with a polite live value, and
 * focus moves to the opposite button when one disables at a bound (a disabled
 * `<button>` would drop keyboard focus). TV keeps two focusable buttons and
 * never disables them — a disabled Pressable drops D-pad focus — so a bound is
 * shown dimmed with `accessibilityState.disabled`.
 */
export function Stepper({
  value,
  onChange,
  onIncrement,
  onDecrement,
  label,
  onValuePress,
  valueAccessibilityLabel,
  min = 0,
  max,
  step = 1,
  formatValue,
  size = "md",
  buttonBackground,
  disabled = false,
  valueMinWidth,
}: StepperProps) {
  const { colors } = useThemeTokens();
  const { t } = useTranslation();
  const tv = isTV();
  const web = Platform.OS === "web";
  const dim = tv ? TV_STEP_TARGET : size === "sm" ? Control.sm : Control.md;
  const iconSize = tv ? IconSize.xl : size === "sm" ? IconSize.md : IconSize.lg;
  const text = formatValue ? formatValue(value) : String(value);
  const atMin = value <= min;
  const atMax = max != null && value >= max;

  const clamp = (next: number) => Math.min(max ?? Number.POSITIVE_INFINITY, Math.max(min, next));
  const decrement = () => {
    if (disabled || atMin) return;
    triggerHaptic("selection");
    if (onChange) onChange(clamp(value - step));
    else onDecrement?.();
  };
  const increment = () => {
    if (disabled || atMax) return;
    triggerHaptic("selection");
    if (onChange) onChange(clamp(value + step));
    else onIncrement?.();
  };

  // Web: keep keyboard focus inside the stepper when a press reaches a bound.
  const decRef = useRef<ViewInstance>(null);
  const incRef = useRef<ViewInstance>(null);
  const lastStep = useRef<"dec" | "inc" | null>(null);
  useEffect(() => {
    if (!web) return;
    const next =
      lastStep.current === "dec" && atMin
        ? incRef.current
        : lastStep.current === "inc" && atMax
          ? decRef.current
          : null;
    if (!next) return;
    lastStep.current = null;
    (next as unknown as { focus?: () => void }).focus?.();
  }, [web, atMin, atMax]);

  const onAccessibilityAction = (event: AccessibilityActionEvent) => {
    switch (event.nativeEvent.actionName) {
      case "increment":
        increment();
        break;
      case "decrement":
        decrement();
        break;
      case "activate":
        onValuePress?.();
        break;
    }
  };

  // One adjustable element for VoiceOver / TalkBack (phone + tablet).
  const groupA11y =
    !tv && !web
      ? ({
          accessible: true,
          accessibilityRole: "adjustable",
          accessibilityLabel: label,
          accessibilityValue: { min, max, now: value, text },
          accessibilityState: disabled ? { disabled: true } : undefined,
          accessibilityActions: [
            { name: "increment" },
            { name: "decrement" },
            ...(onValuePress ? [{ name: "activate" }] : []),
          ],
          onAccessibilityAction,
        } as const)
      : web
        ? ({ role: "group", "aria-label": label } as const)
        : null;

  // The value reads "Fajr, 3" wherever it is reachable on its own (web, TV);
  // web also announces changes politely. On iOS / Android it sits inside the
  // adjustable element, which speaks the value instead.
  const valueA11y = {
    accessibilityLabel: `${label}, ${text}`,
    ...(web ? ({ accessibilityLiveRegion: "polite" } as const) : null),
  };

  const minWidth = valueMinWidth ?? dim - 2;
  const background = buttonBackground ?? colors.card;

  return (
    <View style={[styles.row, disabled && styles.disabled]} {...groupA11y}>
      <StepButton
        ref={decRef}
        icon={{ ios: "minus", android: "remove", web: "remove" }}
        label={t("common.decrease", { label })}
        atLimit={atMin}
        groupDisabled={disabled}
        tv={tv}
        dim={dim}
        iconSize={iconSize}
        background={background}
        onPress={() => {
          lastStep.current = "dec";
          decrement();
        }}
      />
      {onValuePress ? (
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={valueAccessibilityLabel ?? label}
          disabled={disabled}
          dimWhenDisabled={false}
          hitSlop={6}
          scaleTo={0.92}
          onPress={() => {
            triggerHaptic("light");
            onValuePress();
          }}
          style={[styles.countPressable, { minWidth }, tv && { minHeight: dim }]}
        >
          <ThemedText type="smallBold" style={styles.count} {...valueA11y}>
            {text}
          </ThemedText>
        </PressableScale>
      ) : (
        <ThemedText type="smallBold" style={[styles.count, { minWidth }]} {...valueA11y}>
          {text}
        </ThemedText>
      )}
      <StepButton
        ref={incRef}
        icon={{ ios: "plus", android: "add", web: "add" }}
        label={t("common.increase", { label })}
        atLimit={atMax}
        groupDisabled={disabled}
        tv={tv}
        dim={dim}
        iconSize={iconSize}
        background={background}
        onPress={() => {
          lastStep.current = "inc";
          increment();
        }}
      />
    </View>
  );
}

function StepButton({
  ref,
  icon,
  label,
  onPress,
  atLimit,
  groupDisabled,
  tv,
  dim,
  iconSize,
  background,
}: {
  ref: Ref<ViewInstance>;
  icon: Parameters<typeof SymbolView>[0]["name"];
  label: string;
  onPress: () => void;
  atLimit: boolean;
  groupDisabled: boolean;
  tv: boolean;
  dim: number;
  iconSize: number;
  background: string;
}) {
  const { colors } = useThemeTokens();
  // TV: never `disabled` at a bound (D-pad focus would drop) — dim + state only.
  const softLimit = tv && atLimit && !groupDisabled;
  return (
    <PressableScale
      ref={ref}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={softLimit ? { disabled: true } : undefined}
      disabled={groupDisabled || (atLimit && !tv)}
      scaleTo={0.9}
      hitSlop={Math.max(6, Math.ceil((Control.minTouch - dim) / 2))}
      onPress={onPress}
      style={[
        styles.button,
        { width: dim, height: dim, backgroundColor: background },
        // The group already dims once when the whole stepper is disabled.
        groupDisabled ? styles.undimmed : softLimit ? styles.disabled : null,
      ]}
    >
      <SymbolView name={icon} size={iconSize} tintColor={colors.foreground} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  button: {
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  countPressable: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.one,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
  },
  count: {
    textAlign: "center",
    fontVariant: ["tabular-nums"],
  },
  disabled: {
    opacity: Opacity.disabled,
  },
  undimmed: {
    opacity: 1,
  },
});
