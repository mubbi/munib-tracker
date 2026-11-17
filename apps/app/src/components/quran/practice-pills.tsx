import { ScrollView, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

/**
 * A horizontally scrolling row of single-select pills (§9.1). Four mode pills do
 * not fit a phone in a `SegmentedControl`, so this scrolls instead.
 */
export function PracticePills<T extends string>({
  options,
  value,
  onChange,
  accessibilityLabel,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  accessibilityLabel: string;
}) {
  const { colors, tokens } = useThemeTokens();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
    >
      {options.map((option) => {
        const selected = option.id === value;
        return (
          <PressableScale
            key={option.id}
            haptic="selection"
            accessibilityRole="radio"
            accessibilityState={{ selected, checked: selected }}
            accessibilityLabel={option.label}
            onPress={() => onChange(option.id)}
            style={[
              styles.pill,
              {
                backgroundColor: selected ? colors.accent : tokens.accentSoft,
                borderColor: selected ? colors.accent : colors.border,
              },
            ]}
          >
            <ThemedText
              type="small"
              style={{ color: selected ? colors.accentForeground : colors.foreground }}
            >
              {option.label}
            </ThemedText>
          </PressableScale>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: Spacing.two, paddingVertical: Spacing.half },
  pill: {
    minHeight: 40,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.pill,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
