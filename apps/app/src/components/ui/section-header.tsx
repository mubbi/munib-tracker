import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

type SectionHeaderProps = {
  title: string;
  icon?: SymbolViewProps["name"];
  actionLabel?: string;
  onActionPress?: () => void;
};

export function SectionHeader({ title, icon, actionLabel, onActionPress }: SectionHeaderProps) {
  const { colors, tokens } = useThemeTokens();

  return (
    <View style={styles.row}>
      <View style={styles.titleRow}>
        {icon ? (
          <View style={[styles.iconWell, { backgroundColor: tokens.accentSoft }]}>
            <SymbolView name={icon} size={14} tintColor={colors.accent} />
          </View>
        ) : null}
        <ThemedText type="subtitle" style={{ textTransform: "capitalize" }}>
          {title}
        </ThemedText>
      </View>

      {actionLabel ? (
        <Pressable
          accessibilityRole="button"
          onPress={onActionPress}
          hitSlop={8}
          style={({ pressed }) => pressed && styles.pressed}
        >
          <ThemedText type="smallBold" style={{ color: colors.accent }}>
            {actionLabel}
          </ThemedText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Spacing.two,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  iconWell: {
    width: 28,
    height: 28,
    borderRadius: 9,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.6,
  },
});
