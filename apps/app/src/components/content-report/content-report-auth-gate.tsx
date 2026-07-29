import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { IconWell } from "@/components/ui/icon-well";
import { Sheet } from "@/components/ui/sheet";
import { Radius, Spacing } from "@/constants/theme";

const ACCOUNT_ICON = {
  ios: "person.crop.circle.badge.exclamationmark",
  android: "account_circle",
  web: "account_circle",
} as const;

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
      <View style={styles.header}>
        <IconWell icon={ACCOUNT_ICON} size={30} well={64} radius={Radius.lg} />
        <ThemedText type="subtitle" style={styles.title}>
          {t("contentReport.signInRequiredTitle")}
        </ThemedText>
        <ThemedText type="small" themeColor="mutedForeground" style={styles.body}>
          {t("contentReport.signInRequiredBody")}
        </ThemedText>
      </View>
      <View style={styles.actions}>
        <Button
          variant="primary"
          fullWidth
          icon={ACCOUNT_ICON}
          label={t("contentReport.signInCta")}
          onPress={() => {
            onClose();
            router.push("/profile");
          }}
        />
        <Button variant="ghost" fullWidth label={t("common.cancel")} onPress={onClose} />
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    gap: Spacing.two,
    paddingTop: Spacing.two,
  },
  title: {
    textAlign: "center",
  },
  body: {
    textAlign: "center",
  },
  actions: {
    marginTop: Spacing.four,
    gap: Spacing.two,
  },
});
