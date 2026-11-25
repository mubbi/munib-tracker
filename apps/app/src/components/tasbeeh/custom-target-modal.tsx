import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { TextField } from "@/components/ui/text-field";
import { Spacing } from "@/constants/theme";

type CustomTargetModalProps = {
  visible: boolean;
  initial?: number;
  onSubmit: (target: number) => void;
  onClose: () => void;
};

export function CustomTargetModal({ visible, initial, onSubmit, onClose }: CustomTargetModalProps) {
  const { t } = useTranslation();
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
    <Sheet accessibilityLabel={t("tasbeehUi.customTitle")} visible={visible} onClose={onClose}>
      <ThemedText type="subtitle">{t("tasbeehUi.customTitle")}</ThemedText>
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("tasbeehUi.customPrompt")}
      </ThemedText>
      <TextField
        label={t("tasbeehUi.customPlaceholder")}
        value={value}
        onChangeText={(text) => setValue(text.replace(/[^0-9]/g, "").slice(0, 5))}
        keyboardType="number-pad"
        placeholder={t("tasbeehUi.customPlaceholder")}
        inputStyle={styles.input}
        style={styles.field}
        returnKeyType="done"
        onSubmitEditing={submit}
      />
      <View style={styles.actions}>
        <Button label={t("common.cancel")} variant="ghost" onPress={onClose} />
        <Button label={t("common.set")} onPress={submit} />
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  field: {
    marginTop: Spacing.two,
  },
  input: {
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
