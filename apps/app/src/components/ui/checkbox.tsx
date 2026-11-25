import { SymbolView } from "expo-symbols";
import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { BorderWidth, Control, IconSize, Radius, Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";

export type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Visible label — also the accessible name. */
  label: string;
  /** Optional second line (spoken as the hint). */
  description?: string;
  disabled?: boolean;
  /** TV: request initial D-pad focus. */
  preferredFocus?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * A labelled check box (acknowledgements, multi-select lists). The whole row is
 * one pressable with role `checkbox` and `checked` state on every platform
 * (`aria-checked` on web); the drawn box is decorative. Use `SwitchRow` for
 * settings that take effect immediately.
 */
export function Checkbox({
  checked,
  onChange,
  label,
  description,
  disabled,
  preferredFocus,
  style,
  testID,
}: CheckboxProps) {
  const { colors, tokens } = useThemeTokens();
  const tv = isTV();
  const box = tv ? tvDp(28) : tvDp(22);

  return (
    <PressableScale
      testID={testID}
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityHint={description}
      accessibilityState={{ checked, disabled: !!disabled }}
      // react-native-web drops `accessibilityState`; ARIA reaches the DOM.
      aria-checked={checked}
      disabled={disabled}
      haptic="selection"
      onPress={() => onChange(!checked)}
      {...(preferredFocus && tv ? { hasTVPreferredFocus: true } : {})}
      style={[styles.row, tv && styles.rowTv, style]}
    >
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={[
          styles.box,
          {
            width: box,
            height: box,
            backgroundColor: checked ? colors.accent : "transparent",
            // Unchecked outline uses the switch off-track token (≥ 3:1 boundary).
            borderColor: checked ? colors.accent : tokens.switchTrackOff,
          },
        ]}
      >
        {checked ? (
          <SymbolView
            name={{ ios: "checkmark", android: "check", web: "check" }}
            size={tv ? IconSize.md : IconSize.sm}
            tintColor={colors.accentForeground}
          />
        ) : null}
      </View>
      <View style={styles.text}>
        <ThemedText type="small" style={tv ? { fontSize: TvLayout.bodyFontSize } : undefined}>
          {label}
        </ThemedText>
        {description ? (
          <ThemedText type="caption" themeColor="mutedForeground">
            {description}
          </ThemedText>
        ) : null}
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    // 44pt / 48dp (Android) target — rows stack, so no overlapping hitSlop.
    minHeight: Math.max(Control.md, Control.minTouch),
    paddingVertical: Spacing.one,
  },
  rowTv: {
    minHeight: TvLayout.minFocusTarget,
    paddingHorizontal: Spacing.three,
  },
  box: {
    borderRadius: Radius.xs,
    borderCurve: "continuous",
    borderWidth: BorderWidth.thick,
    alignItems: "center",
    justifyContent: "center",
  },
  text: { flex: 1, minWidth: 0, gap: Spacing.half },
});
