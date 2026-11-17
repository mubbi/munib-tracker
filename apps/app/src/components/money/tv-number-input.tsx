import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { IconButton } from "@/components/ui/icon-button";
import { Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  DEFAULT_NUMBER_FORMAT,
  formatNumberForInput,
  type NumberFormatStyle,
  parseNumberInput,
} from "@/lib/format-currency";
import { isTV } from "@/lib/platform/is-tv";

/**
 * TV focus feedback for a raw `TextInput` row.
 *
 * `TextInput` has no D-pad focus ring on Android TV / tvOS (only
 * `PressableScale` draws one). Spread `focusProps` on the input and apply
 * `containerStyle` to its row: a constant-width ring that turns accent while
 * focused (no layout shift) plus the 10-foot minimum height.
 *
 * Phone / tablet / web: empty props and `null` style — no behaviour change.
 */
export function useTvInputFocus(): {
  focusProps: { onFocus?: () => void; onBlur?: () => void };
  /** Plain object (not `ViewStyle`) so it also fits a `TextInput` style. */
  containerStyle: { minHeight: number; borderWidth: number; borderColor: string } | null;
} {
  const tv = isTV();
  const { colors } = useThemeTokens();
  const [focused, setFocused] = useState(false);
  const focusProps = useMemo(
    () => (tv ? { onFocus: () => setFocused(true), onBlur: () => setFocused(false) } : {}),
    [tv],
  );
  if (!tv) return { focusProps, containerStyle: null };
  return {
    focusProps,
    containerStyle: {
      minHeight: TvLayout.minFocusTarget,
      borderWidth: TvLayout.focusRingWidth,
      borderColor: focused ? colors.accent : colors.inputBorder,
    },
  };
}

/**
 * TV-only −/+ buttons for a whole-number text field (days, head of livestock…)
 * so small counts can be set with the remote instead of the on-screen keyboard.
 * Renders nothing off TV.
 */
export function TvStepButtons({
  value,
  onChange,
  label,
  min = 0,
  step = 1,
  maxFractionDigits = 0,
  numberFormat = DEFAULT_NUMBER_FORMAT,
}: {
  /** Current field text (formatted with `numberFormat`). */
  value: string;
  onChange: (next: string) => void;
  /** Field label for the accessibility names ("Increase {{label}}"). */
  label: string;
  min?: number;
  step?: number;
  maxFractionDigits?: number;
  numberFormat?: NumberFormatStyle;
}) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  if (!isTV()) return null;

  const current = parseNumberInput(value, numberFormat);
  const set = (next: number) =>
    onChange(formatNumberForInput(Math.max(min, next), maxFractionDigits, numberFormat));

  return (
    <View style={styles.row}>
      <IconButton
        name={{ ios: "minus", android: "remove", web: "remove" }}
        accessibilityLabel={t("common.decrease", { label })}
        disabled={current <= min}
        hitTarget={TvLayout.minFocusTarget}
        background={colors.card}
        onPress={() => set(current - step)}
      />
      <IconButton
        name={{ ios: "plus", android: "add", web: "add" }}
        accessibilityLabel={t("common.increase", { label })}
        hitTarget={TvLayout.minFocusTarget}
        background={colors.card}
        onPress={() => set(current + step)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
});
