import { useEffect, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

const MAX_NOTES = 500;

type PrayerNotesModalProps = {
  visible: boolean;
  title: string;
  initialValue?: string;
  onSave: (notes: string) => void;
  onClose: () => void;
};

/** Reusable notes editor (max 500 chars) used by the tracker and history detail. */
export function PrayerNotesModal({
  visible,
  title,
  initialValue,
  onSave,
  onClose,
}: PrayerNotesModalProps) {
  const { colors } = useThemeTokens();
  const [value, setValue] = useState(initialValue ?? "");

  useEffect(() => {
    if (visible) setValue(initialValue ?? "");
  }, [visible, initialValue]);

  return (
    <Sheet visible={visible} onClose={onClose}>
      <ThemedText type="subtitle">{title}</ThemedText>
      <ThemedText type="caption" themeColor="mutedForeground">
        Optional — a private note for this day.
      </ThemedText>

      <TextInput
        value={value}
        onChangeText={(text) => setValue(text.slice(0, MAX_NOTES))}
        placeholder="e.g. prayed in congregation at the masjid"
        placeholderTextColor={colors.mutedForeground}
        multiline
        style={[
          styles.input,
          { color: colors.foreground, backgroundColor: colors.muted, borderColor: colors.border },
        ]}
      />
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.counter}>
        {value.length}/{MAX_NOTES}
      </ThemedText>

      <View style={styles.actions}>
        <Button label="Cancel" variant="ghost" onPress={onClose} />
        <Button
          label="Save note"
          onPress={() => {
            onSave(value.trim());
            onClose();
          }}
        />
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 96,
    marginTop: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    fontSize: 15,
    textAlignVertical: "top",
  },
  counter: {
    alignSelf: "flex-end",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
});
