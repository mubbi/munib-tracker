import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedSwitch } from "@/components/ui/themed-switch";
import { Spacing } from "@/constants/theme";

type ToggleRowProps = {
  title: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
};

/** A feature-local on/off row (in-context control for a reminder or intention). */
export function ToggleRow({ title, subtitle, value, onValueChange, disabled }: ToggleRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.text}>
        <ThemedText type="small">{title}</ThemedText>
        {subtitle ? (
          <ThemedText type="caption" themeColor="mutedForeground">
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
      <ThemedSwitch
        value={value}
        disabled={disabled}
        onValueChange={onValueChange}
        accessibilityLabel={title}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    paddingVertical: Spacing.one,
  },
  text: { flex: 1, minWidth: 0, gap: 2 },
});
