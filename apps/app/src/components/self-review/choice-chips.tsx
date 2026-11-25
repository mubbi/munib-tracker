import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { BorderWidth, Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

export interface ChoiceOption<T extends string> {
  id: T;
  label: string;
}

/**
 * A row of single-select chips that may start unselected (unlike
 * `SegmentedControl`). Used for Yes / Partly / No answers, kinship and the
 * digest weekday. Selection is announced via `accessibilityState`.
 */
export function ChoiceChips<T extends string>({
  options,
  value,
  onChange,
  accessibilityLabel,
  wrap = true,
}: {
  options: readonly ChoiceOption<T>[];
  value: T | undefined;
  onChange: (value: T) => void;
  /** Group label read before each option, e.g. the prompt text. */
  accessibilityLabel?: string;
  wrap?: boolean;
}) {
  const { colors, tokens } = useThemeTokens();
  return (
    <View style={[styles.row, wrap ? styles.wrap : null]} accessibilityRole="radiogroup">
      {options.map((option) => {
        const selected = option.id === value;
        return (
          <PressableScale
            key={option.id}
            accessibilityRole="radio"
            accessibilityState={{ selected, checked: selected }}
            accessibilityLabel={
              accessibilityLabel ? `${accessibilityLabel}: ${option.label}` : option.label
            }
            onPress={() => onChange(option.id)}
            haptic="selection"
            scaleTo={0.96}
            style={[
              styles.chip,
              {
                backgroundColor: selected ? tokens.accentSoft : colors.card,
                borderColor: selected ? colors.accent : colors.border,
              },
            ]}
          >
            <ThemedText
              type="smallBold"
              style={{ color: selected ? colors.accentText : colors.foreground }}
            >
              {option.label}
            </ThemedText>
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: Spacing.two },
  wrap: { flexWrap: "wrap" },
  chip: {
    minHeight: 44,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.oneHalf,
    borderRadius: Radius.pill,
    borderWidth: BorderWidth.thin,
    alignItems: "center",
    justifyContent: "center",
  },
});
