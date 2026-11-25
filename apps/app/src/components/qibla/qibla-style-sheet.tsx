import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { QiblaCompassStyleEditor } from "@/components/qibla/qibla-compass-style-editor";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { Spacing } from "@/constants/theme";

/**
 * "Compass style" sheet opened from the Qibla screen's palette button. Mounted
 * only while open so the thumbnails never load with the compass.
 */
export function QiblaStyleSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  return (
    <Sheet
      accessibilityLabel={t("qiblaStyles.sheetTitle")}
      visible={visible}
      onClose={onClose}
      variant="bottom"
      solid
    >
      {visible ? (
        <View style={styles.body}>
          <View style={styles.header}>
            <ThemedText type="subtitle">{t("qiblaStyles.sheetTitle")}</ThemedText>
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("qiblaStyles.sheetSubtitle")}
            </ThemedText>
          </View>
          <QiblaCompassStyleEditor focusSelected />
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
