import { graduationPromptStage, shouldShowGraduationPrompt } from "@munib-tracker/shared/circles";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spacing } from "@/constants/theme";
import type { ChildProfile } from "@/lib/circles/api";
import {
  clearChildSession,
  dismissGraduationPrompt,
  useChildSession,
} from "@/lib/circles/child-session";

/** Linked child device only: the graduation offer (13 / 15, E13) and "Unlink this device". */
export function KidsDeviceFooter({ child }: { child: ChildProfile }) {
  const { t } = useTranslation();
  const router = useRouter();
  const session = useChildSession();
  const [confirm, setConfirm] = useState(false);
  // E13: offered at 13 (or when a parent unlocks it), offered again at 15.
  const stage = graduationPromptStage(child.birthYear, child.graduationUnlocked);
  const showGraduation =
    child.graduationAvailable &&
    shouldShowGraduationPrompt(stage, session.meta?.graduationDismissed);
  return (
    <View style={styles.gap}>
      {showGraduation ? (
        <Card padding="three" style={styles.gap}>
          <ThemedText type="small">
            {stage === "reprompt" ? t("kids.graduate.reprompt") : t("kids.graduate.offer")}
          </ThemedText>
          <Button label={t("kids.graduate.cta")} onPress={() => router.push("/kids/graduate")} />
          <Button
            label={t("kids.graduate.notNow")}
            variant="ghost"
            size="sm"
            onPress={() => void dismissGraduationPrompt(stage)}
          />
        </Card>
      ) : null}
      <Button label={t("kids.unlink")} variant="ghost" onPress={() => setConfirm(true)} />
      <ConfirmDialog
        visible={confirm}
        title={t("kids.unlinkTitle")}
        message={t("kids.unlinkBody")}
        confirmLabel={t("kids.unlink")}
        destructive
        onConfirm={() => {
          setConfirm(false);
          void clearChildSession().then(() => router.replace("/"));
        }}
        onClose={() => setConfirm(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  gap: { gap: Spacing.two },
});
