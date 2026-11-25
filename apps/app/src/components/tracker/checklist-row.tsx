import { SymbolView } from "expo-symbols";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppIcon } from "@/components/ui/app-icon";
import { PressableScale } from "@/components/ui/pressable-scale";
import { BorderWidth, Control, IconSize, Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";
import { useChevronForward } from "@/lib/rtl";

const CHECKED = {
  ios: "checkmark.circle.fill",
  android: "check_circle",
  web: "check_circle",
} as const;
const UNCHECKED = {
  ios: "circle",
  android: "radio_button_unchecked",
  web: "radio_button_unchecked",
} as const;

export type ChecklistRowProps = {
  checked: boolean;
  onToggle: () => void;
  title: string;
  /** Second line (also spoken as the hint). */
  subtitle?: string;
  /**
   * A sibling control beside the toggle (details chip, open link, stepper) —
   * never nested inside it (web renders both as `<button>`).
   */
  trailing?: ReactNode;
  /** TV: request initial D-pad focus. */
  preferredFocus?: boolean;
  testID?: string;
};

/**
 * One tickable checklist line (P5-08 / B-79) shared by Sunnah habits, the
 * Jumu'ah checklist and White Days: the whole row (glyph + text) is a single
 * ≥44pt `checkbox` with `checked` state; the drawn circle is decorative.
 */
export function ChecklistRow({
  checked,
  onToggle,
  title,
  subtitle,
  trailing,
  preferredFocus,
  testID,
}: ChecklistRowProps) {
  const { colors, tokens } = useThemeTokens();
  const tv = isTV();

  return (
    <View style={styles.row}>
      <PressableScale
        testID={testID}
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
        // react-native-web drops `accessibilityState`; ARIA reaches the DOM.
        aria-checked={checked}
        accessibilityLabel={title}
        accessibilityHint={subtitle}
        onPress={onToggle}
        scaleTo={0.98}
        haptic={checked ? "selection" : "success"}
        {...(tv && preferredFocus ? { hasTVPreferredFocus: true } : {})}
        style={[styles.main, tv ? styles.mainTv : null]}
      >
        <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <SymbolView
            name={checked ? CHECKED : UNCHECKED}
            size={IconSize.lg + 4}
            tintColor={checked ? tokens.status.success.color : colors.mutedForeground}
          />
        </View>
        <View style={styles.text}>
          <ThemedText type="smallBold">{title}</ThemedText>
          {subtitle ? (
            <ThemedText type="caption" themeColor="mutedForeground">
              {subtitle}
            </ThemedText>
          ) : null}
        </View>
      </PressableScale>
      {trailing}
    </View>
  );
}

/**
 * The "Details" chip beside a checklist line: ≥44pt, with an accessible name
 * that says what it opens (B-82) rather than a generic "Open related content".
 */
export function ChecklistDetailsChip({
  label,
  accessibilityLabel,
  onPress,
}: {
  label: string;
  accessibilityLabel: string;
  onPress: () => void;
}) {
  const { colors, tokens } = useThemeTokens();
  const chevronForward = useChevronForward();
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      haptic="selection"
      scaleTo={0.96}
      style={[
        styles.chip,
        isTV() ? styles.chipTv : null,
        { backgroundColor: tokens.accentSoft, borderColor: colors.border },
      ]}
    >
      <ThemedText type="caption" weight="semibold" style={{ color: tokens.accentOnSoft }}>
        {label}
      </ThemedText>
      <AppIcon icon={chevronForward} size={IconSize.sm} tintColor={tokens.accentOnSoft} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  main: {
    flex: 1,
    minWidth: 0,
    minHeight: Control.md,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radius.md,
  },
  /** TV: a full-row Select target with room for the focus ring. */
  mainTv: {
    minHeight: TvLayout.minFocusTarget,
    paddingHorizontal: Spacing.two,
  },
  text: { flex: 1, gap: Spacing.half, minWidth: 0 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    minHeight: Control.md,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: BorderWidth.hairline,
  },
  chipTv: {
    minHeight: TvLayout.chipMinHeight,
  },
});
