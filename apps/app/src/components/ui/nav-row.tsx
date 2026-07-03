import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { IconWell } from "@/components/ui/icon-well";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

type NavRowProps = {
  icon: SymbolViewProps["name"];
  label: string;
  /** Optional trailing count pill. */
  count?: number;
  onPress: () => void;
};

/** A tappable navigation row: icon well + label + optional count + chevron. */
export function NavRow({ icon, label, count, onPress }: NavRowProps) {
  const { colors } = useThemeTokens();
  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={[styles.row, { backgroundColor: colors.muted }]}
    >
      <IconWell icon={icon} />
      <ThemedText type="small" style={styles.label}>
        {label}
      </ThemedText>
      {count != null ? (
        <Pill label={`${count}`} color={colors.mutedForeground} background={colors.card} />
      ) : null}
      <SymbolView
        name={{ ios: "chevron.right", android: "chevron_right", web: "chevron_right" }}
        size={14}
        tintColor={colors.mutedForeground}
      />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.two + 2,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  label: {
    flex: 1,
  },
});
