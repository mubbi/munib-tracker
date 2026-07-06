import { SymbolView } from "expo-symbols";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { ADHAN_STYLES } from "@/lib/adhan-audio";

type AdhanStylePickerProps = {
  value: string;
  onChange: (id: string) => void;
};

/** Vertical adhan style list — avoids cramming long muezzin names into a segmented row. */
export function AdhanStylePicker({ value, onChange }: AdhanStylePickerProps) {
  const { colors, tokens } = useThemeTokens();

  return (
    <View style={styles.list}>
      {ADHAN_STYLES.map((style) => {
        const selected = style.id === value;
        return (
          <PressableScale
            key={style.id}
            haptic="selection"
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={style.name}
            onPress={() => {
              if (!selected) onChange(style.id);
            }}
            style={[
              styles.row,
              {
                backgroundColor: selected ? tokens.accentSoft : colors.muted,
                borderColor: selected ? tokens.accentBorder : "transparent",
                borderWidth: selected ? 1.5 : 0,
              },
            ]}
          >
            <View style={styles.copy}>
              <ThemedText type="smallBold" numberOfLines={2}>
                {style.name}
              </ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
                {style.location}
              </ThemedText>
            </View>
            {selected ? (
              <SymbolView
                name={{
                  ios: "checkmark.circle.fill",
                  android: "check_circle",
                  web: "check_circle",
                }}
                size={22}
                tintColor={colors.accent}
              />
            ) : (
              <View style={styles.checkPlaceholder} />
            )}
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 56,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 2,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  copy: {
    flex: 1,
    gap: 2,
    paddingEnd: Spacing.two,
  },
  checkPlaceholder: {
    width: 22,
    height: 22,
  },
});
