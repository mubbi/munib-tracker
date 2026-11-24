import { SymbolView } from "expo-symbols";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";

export interface ChoiceListItem<V> {
  value: V;
  label: string;
  description?: string;
}

/**
 * Single-choice radio list (§4.5.5) — replaces the three copied `Choices`
 * lists, the radio cards and the method sheet rows.
 */
export function ChoiceList<V>({
  items,
  value,
  onChange,
  disabled,
}: {
  items: readonly ChoiceListItem<V>[];
  value: V;
  onChange: (value: V) => void;
  disabled?: boolean;
}) {
  const { colors, tokens } = useThemeTokens();
  const tv = isTV();
  return (
    <View style={styles.list} accessibilityRole="radiogroup">
      {items.map((item) => {
        const selected = Object.is(item.value, value);
        return (
          <PressableScale
            key={String(item.value)}
            haptic="selection"
            accessibilityRole="radio"
            accessibilityState={{ selected, checked: selected, disabled: !!disabled }}
            accessibilityLabel={
              item.description ? `${item.label}, ${item.description}` : item.label
            }
            disabled={disabled}
            // TV: start D-pad focus on the current choice.
            {...(tv && selected ? { hasTVPreferredFocus: true } : {})}
            onPress={() => onChange(item.value)}
            style={[
              styles.row,
              tv && styles.rowTv,
              {
                backgroundColor: selected ? tokens.accentSoft : colors.muted,
                borderColor: selected ? tokens.accentBorder : tokens.hairline,
                opacity: disabled ? 0.5 : 1,
              },
            ]}
          >
            <View style={styles.copy}>
              <ThemedText type={selected ? "smallBold" : "small"}>{item.label}</ThemedText>
              {item.description ? (
                <ThemedText type="caption" themeColor="mutedForeground">
                  {item.description}
                </ThemedText>
              ) : null}
            </View>
            {selected ? (
              <SymbolView
                name={{
                  ios: "checkmark.circle.fill",
                  android: "check_circle",
                  web: "check_circle",
                }}
                size={20}
                tintColor={colors.accent}
              />
            ) : null}
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.two },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
  rowTv: { minHeight: TvLayout.minFocusTarget },
  copy: { flex: 1, gap: 2 },
});
