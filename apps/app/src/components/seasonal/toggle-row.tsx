import { StyleSheet, View } from "react-native";

import { ToggleRow as SettingsToggleRow } from "@/components/settings/settings-rows";
import { ThemedText } from "@/components/themed-text";
import { ThemedSwitch } from "@/components/ui/themed-switch";
import { Spacing } from "@/constants/theme";
import { isTV } from "@/lib/platform/is-tv";

type ToggleRowProps = {
  title: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
};

/**
 * A feature-local on/off row (in-context control for a reminder or intention).
 * TV reuses the settings row, where the whole row is the D-pad target and Select
 * toggles it — a bare switch is a poor focus target (and UISwitch doesn't exist
 * on tvOS).
 */
export function ToggleRow({ title, subtitle, value, onValueChange, disabled }: ToggleRowProps) {
  if (isTV()) {
    return (
      <SettingsToggleRow
        title={title}
        subtitle={subtitle}
        value={value}
        disabled={disabled}
        onValueChange={onValueChange}
      />
    );
  }
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
    // 44pt row even when the subtitle is absent (HIG / M3 minimum target).
    minHeight: 44,
    paddingVertical: Spacing.one,
  },
  text: { flex: 1, minWidth: 0, gap: 2 },
});
