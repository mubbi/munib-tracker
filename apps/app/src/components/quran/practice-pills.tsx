import type { SymbolViewProps } from "expo-symbols";
import { SymbolView } from "expo-symbols";
import { ScrollView, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { BorderWidth, Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

export type PracticePillOption<T extends string> = {
  id: T;
  label: string;
  /** Optional leading symbol — gives each choice a glanceable shape. */
  icon?: SymbolViewProps["name"];
};

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
  options: PracticePillOption<T>[];
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
        const fg = selected ? colors.accentForeground : colors.foreground;
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
              option.icon ? styles.pillWithIcon : null,
              {
                backgroundColor: selected ? colors.accent : tokens.accentSoft,
                borderColor: selected ? colors.accent : colors.border,
              },
            ]}
          >
            {option.icon ? (
              <SymbolView name={option.icon} size={16} tintColor={selected ? fg : colors.accent} />
            ) : null}
            <ThemedText type="small" style={{ color: fg }}>
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
    borderWidth: BorderWidth.thin,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.oneHalf,
  },
  pillWithIcon: { paddingStart: Spacing.twoHalf },
});
