import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { Spacing } from "@/constants/theme";

/** Shown when a guest tries to report — prompts sign-in / account linking. */
export function ContentReportAuthGate({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Sheet visible={visible} onClose={onClose} variant="center">
      <ThemedText type="subtitle">{t("contentReport.signInRequiredTitle")}</ThemedText>
      <ThemedText type="small" themeColor="mutedForeground" style={styles.body}>
        {t("contentReport.signInRequiredBody")}
      </ThemedText>
      <View style={styles.actions}>
        <Button
          variant="primary"
          label={t("contentReport.signInCta")}
          onPress={() => {
            onClose();
            router.push("/profile");
          }}
        />
        <Button variant="ghost" label={t("common.cancel")} onPress={onClose} />
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  body: { marginTop: Spacing.two },
  actions: { marginTop: Spacing.four, gap: Spacing.two },
});
