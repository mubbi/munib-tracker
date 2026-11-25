import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { Spacing } from "@/constants/theme";

/**
 * Phase 6 consent, shown once before the Quran Lab SDK is initialised: a second
 * listener download, one activation call to Quran Lab, audio processed on the
 * device. Declining leaves every lesson exactly as it was.
 */
export function PronunciationConsentSheet({
  visible,
  onAgree,
  onClose,
}: {
  visible: boolean;
  onAgree: () => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  return (
    <Sheet
      accessibilityLabel={t("quranCompanion.pronunciation.consentTitle")}
      visible={visible}
      onClose={onClose}
      variant="bottom"
    >
      <View style={styles.body}>
        <ThemedText type="subtitle">{t("quranCompanion.pronunciation.consentTitle")}</ThemedText>
        <ThemedText type="small">{t("quranCompanion.pronunciation.consentDownload")}</ThemedText>
        <ThemedText type="small">{t("quranCompanion.pronunciation.consentActivation")}</ThemedText>
        <ThemedText type="small">{t("quranCompanion.pronunciation.consentOnDevice")}</ThemedText>
        <ThemedText type="small">{t("quranCompanion.pronunciation.consentAnalytics")}</ThemedText>
        <ThemedText type="small">{t("quranCompanion.pronunciation.consentSharingAsk")}</ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("quranCompanion.pronunciation.consentRemotePause")}
        </ThemedText>
        <Button label={t("quranCompanion.pronunciation.agree")} onPress={onAgree} fullWidth />
        <Button
          label={t("quranCompanion.pronunciation.notNow")}
          variant="ghost"
          onPress={onClose}
          fullWidth
        />
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  body: { gap: Spacing.three, padding: Spacing.three },
});
