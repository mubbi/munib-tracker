import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { VaultUnlockSheet } from "@/components/vault";
import { Spacing } from "@/constants/theme";
import { VaultError, type VaultErrorCode, vaultErrorI18nKey } from "@/lib/vault";

/**
 * Shown by the muhasabah and family-ties screens when their vault document
 * can't be opened on this device (`locked`: encrypted with a key that isn't
 * here yet; `error`: storage / crypto problem). Offers the unlock sheet.
 */
export function VaultStateNotice({
  status,
  error,
}: {
  status: "idle" | "loading" | "ready" | "locked" | "error";
  error: VaultErrorCode | null;
}) {
  const { t } = useTranslation();
  const [unlockOpen, setUnlockOpen] = useState(false);
  if (status !== "locked" && status !== "error") return null;
  return (
    <Card padding="four">
      <View style={styles.body}>
        <ThemedText type="smallBold">{t("selfReview.vaultLockedTitle")}</ThemedText>
        <ThemedText type="small" themeColor="mutedForeground">
          {status === "locked"
            ? t("selfReview.vaultLockedBody")
            : t(vaultErrorI18nKey(new VaultError(error ?? "vault-unavailable")))}
        </ThemedText>
        {status === "locked" ? (
          <Button
            label={t("selfReview.vaultUnlock")}
            variant="secondary"
            onPress={() => setUnlockOpen(true)}
          />
        ) : null}
      </View>
      <VaultUnlockSheet visible={unlockOpen} onClose={() => setUnlockOpen(false)} />
    </Card>
  );
}

const styles = StyleSheet.create({
  body: { gap: Spacing.two },
});
