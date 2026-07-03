import { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

type CustomTargetModalProps = {
  visible: boolean;
  initial?: number;
  onSubmit: (target: number) => void;
  onClose: () => void;
};

export function CustomTargetModal({ visible, initial, onSubmit, onClose }: CustomTargetModalProps) {
  const { colors, tokens } = useThemeTokens();
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
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={[styles.scrim, { backgroundColor: tokens.scrim }]} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={(event) => event.stopPropagation()}
        >
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
              {
                color: colors.foreground,
                backgroundColor: colors.muted,
                borderColor: colors.border,
              },
            ]}
          />
          <View style={styles.actions}>
            <Button label="Cancel" variant="ghost" onPress={onClose} />
            <Button label="Set" onPress={submit} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    justifyContent: "center",
    padding: Spacing.four,
  },
  sheet: {
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.four,
    gap: Spacing.two,
    maxWidth: 420,
    width: "100%",
    alignSelf: "center",
  },
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
