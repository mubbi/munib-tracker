import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

type PillProps = {
  label: string;
  color?: string;
  background?: string;
  icon?: SymbolViewProps["name"];
  style?: StyleProp<ViewStyle>;
  /** Tighter padding for dense list rows. */
  compact?: boolean;
};

export function Pill({ label, color, background, icon, style, compact }: PillProps) {
  const { colors, tokens } = useThemeTokens();
  const fg = color ?? colors.accent;
  const bg = background ?? tokens.accentSoft;

  return (
    <View style={[styles.pill, compact && styles.pillCompact, { backgroundColor: bg }, style]}>
      {icon ? <SymbolView name={icon} size={12} tintColor={fg} /> : null}
      <ThemedText type="caption" numberOfLines={1} style={{ color: fg }}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.half + 2,
    paddingHorizontal: Spacing.two + 2,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    alignSelf: "flex-start",
    flexShrink: 0,
  },
  pillCompact: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half + 2,
    alignSelf: "center",
  },
});
