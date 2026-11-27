import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { TasbeehAppearanceEditor } from "@/components/tasbeeh/tasbeeh-appearance-editor";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { Spacing } from "@/constants/theme";

/**
 * "Counter style" sheet opened from the counter's palette button (NF-3.19).
 * Mounted only while open so the editor's previews never load with the counter.
 */
export function TasbeehStyleSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  return (
    <Sheet
      accessibilityLabel={t("tasbeehDesigns.sheetTitle")}
      visible={visible}
      onClose={onClose}
      variant="bottom"
      solid
    >
      {visible ? (
        <View style={styles.body}>
          <View style={styles.header}>
            <ThemedText type="subtitle">{t("tasbeehDesigns.sheetTitle")}</ThemedText>
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("tasbeehDesigns.sheetSubtitle")}
            </ThemedText>
          </View>
          <TasbeehAppearanceEditor focusSelected />
          <Button label={t("common.done")} onPress={onClose} fullWidth />
        </View>
      ) : null}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: Spacing.four,
  },
  header: {
    gap: Spacing.one,
  },
});
