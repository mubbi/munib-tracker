import { useEffect, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

type CustomTargetModalProps = {
  visible: boolean;
  initial?: number;
  onSubmit: (target: number) => void;
  onClose: () => void;
};

export function CustomTargetModal({ visible, initial, onSubmit, onClose }: CustomTargetModalProps) {
  const { colors } = useThemeTokens();
  const [value, setValue] = useState(initial ? String(initial) : "");

  useEffect(() => {
    if (visible) setValue(initial ? String(initial) : "");
  }, [visible, initial]);

  const submit = () => {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed) && parsed > 0) {
      onSubmit(parsed);
      onClose();
    }
  };

  return (
    <Sheet visible={visible} onClose={onClose}>
      <ThemedText type="subtitle">Custom target</ThemedText>
      <ThemedText type="caption" themeColor="mutedForeground">
        How many times would you like to repeat?
      </ThemedText>
      <TextInput
        value={value}
        onChangeText={(text) => setValue(text.replace(/[^0-9]/g, "").slice(0, 5))}
        keyboardType="number-pad"
        placeholder="e.g. 313"
        placeholderTextColor={colors.mutedForeground}
        style={[
          styles.input,
          { color: colors.foreground, backgroundColor: colors.muted, borderColor: colors.border },
        ]}
      />
      <View style={styles.actions}>
        <Button label="Cancel" variant="ghost" onPress={onClose} />
        <Button label="Set" onPress={submit} />
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  input: {
    marginTop: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
});
