import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ParentalConsent } from "@/components/circles/parental-consent";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { Spacing } from "@/constants/theme";
import { type ChildProfile, confirmChildConsent, deleteChild } from "@/lib/circles/api";
import { CHILD_CONSENT_POLICY_VERSION, consentDaysLeft } from "@/lib/circles/consent";
import { useCircleAction } from "@/lib/circles/hooks";
import { useToast } from "@/providers/toast-provider";

/**
 * D34: the parent who consented deleted their account and the child profiles
 * moved to this co-parent. Blocking until they confirm consent (same text +
 * policy version as on creation) or delete the profiles; unconfirmed profiles
 * are deleted by the server after 30 days.
 */
export function ReconsentSheet({
  circleId,
  pending,
  onDone,
}: {
  circleId: string;
  pending: readonly ChildProfile[];
  onDone: () => void;
}) {
  const { t } = useTranslation();
  const toast = useToast();
  const [consent, setConsent] = useState(false);
  // Deleting can't be undone: a second, explicit tap (inline — no dialog on top of this sheet).
  const [confirmDelete, setConfirmDelete] = useState(false);
  const confirm = useCircleAction((token) =>
    Promise.all(
      pending.map((child) =>
        confirmChildConsent(token, circleId, child.id, CHILD_CONSENT_POLICY_VERSION),
      ),
    ),
  );
  const remove = useCircleAction((token) =>
    Promise.all(pending.map((child) => deleteChild(token, circleId, child.id))),
  );
  const busy = confirm.isPending || remove.isPending;
  const names = pending.map((c) => c.nickname).join(", ");
  const days = pending
    .map((c) => consentDaysLeft(c))
    .filter((d): d is number => d != null)
    .sort((a, b) => a - b)[0];

  const run = async (fn: () => Promise<unknown>, okKey: string) => {
    try {
      await fn();
      toast.success(t(okKey));
      onDone();
    } catch {
      toast.error(t("circles.common.offline"));
    }
  };

  return (
    <Sheet
      accessibilityLabel={t("family.reconsent.title")}
      visible
      onClose={() => {}}
      variant="center"
      scrollable
    >
      <View style={styles.body} accessibilityViewIsModal>
        <ThemedText type="subtitle">{t("family.reconsent.title")}</ThemedText>
        <ThemedText type="small" themeColor="mutedForeground">
          {t("family.reconsent.body", { names })}
        </ThemedText>
        {days != null ? (
          <ThemedText type="small" themeColor="mutedForeground">
            {t("family.reconsent.deadline", { count: days })}
          </ThemedText>
        ) : null}
        <ParentalConsent value={consent} onChange={setConsent} />
        <Button
          label={t("family.reconsent.confirm")}
          disabled={!consent || busy}
          onPress={() => void run(() => confirm.mutateAsync(), "family.reconsent.confirmed")}
        />
        {confirmDelete ? (
          <View style={styles.confirm} accessibilityLiveRegion="polite">
            <ThemedText type="small">{t("family.reconsent.deleteConfirm")}</ThemedText>
            <View style={styles.row}>
              <Button
                label={t("family.reconsent.delete")}
                disabled={busy}
                onPress={() => void run(() => remove.mutateAsync(), "family.child.deleted")}
              />
              <Button
                label={t("common.cancel")}
                variant="ghost"
                disabled={busy}
                onPress={() => setConfirmDelete(false)}
              />
            </View>
          </View>
        ) : (
          <Button
            label={t("family.reconsent.delete")}
            variant="secondary"
            disabled={busy}
            onPress={() => setConfirmDelete(true)}
          />
        )}
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  body: { gap: Spacing.two },
  confirm: { gap: Spacing.two },
  row: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
});
