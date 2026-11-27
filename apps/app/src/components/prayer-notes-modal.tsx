import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { BorderWidth, Radius, Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";

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
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();
  const [value, setValue] = useState(initialValue ?? "");

  useEffect(() => {
    if (visible) setValue(initialValue ?? "");
  }, [visible, initialValue]);

  return (
    <Sheet accessibilityLabel={title} visible={visible} onClose={onClose}>
      <ThemedText type="subtitle">{title}</ThemedText>
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("notesModal.hint")}
      </ThemedText>

      <TextInput
        value={value}
        onChangeText={(text) => setValue(text.slice(0, MAX_NOTES))}
        accessibilityLabel={t("notesModal.placeholder")}
        placeholder={t("notesModal.placeholder")}
        placeholderTextColor={colors.mutedForeground}
        multiline
        style={[
          styles.input,
          isTV() ? styles.inputTv : null,
          tokens.inputSurface,
          { color: colors.foreground },
        ]}
      />
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.counter}>
        {value.length}/{MAX_NOTES}
      </ThemedText>

      <View style={styles.actions}>
        <Button label={t("common.cancel")} variant="ghost" onPress={onClose} />
        <Button
          label={t("notesModal.saveNote")}
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
    borderWidth: BorderWidth.hairline,
    fontSize: 15,
    textAlignVertical: "top",
  },
  /** Plain TextInput is not auto-scaled on tvOS — size it explicitly. */
  inputTv: {
    minHeight: tvDp(120),
    fontSize: tvDp(TvLayout.bodyFontSize),
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
