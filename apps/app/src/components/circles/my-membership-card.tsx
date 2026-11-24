import { CIRCLE_LIMITS } from "@munib-tracker/shared/circles";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { LabeledInput } from "@/components/records/labeled-input";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { ThemedSwitch } from "@/components/ui/themed-switch";
import { Spacing } from "@/constants/theme";
import { type CircleMember, leaveCircle, updateMyMembership } from "@/lib/circles/api";
import { useCircleAction, useCircleMutation } from "@/lib/circles/hooks";
import { useToast } from "@/providers/toast-provider";

/**
 * My settings inside one partner circle / khatm group (NF-3.17 / 3.18):
 * the per-circle display name (never the account name), "pause sharing"
 * (partner circles only — `PATCH members/me`) and a silent "Leave".
 */
export function MyMembershipCard({
  circleId,
  me,
  showPause,
  onLeft,
}: {
  circleId: string;
  me: CircleMember | undefined;
  showPause: boolean;
  onLeft: () => void;
}) {
  const { t } = useTranslation();
  const toast = useToast();
  const [name, setName] = useState(me?.displayName ?? "");
  const [confirmLeave, setConfirmLeave] = useState(false);
  const update = useCircleMutation(
    (token, input: { displayName?: string | null; paused?: boolean }) =>
      updateMyMembership(token, circleId, input),
  );
  const leave = useCircleAction((token) => leaveCircle(token, circleId));

  useEffect(() => {
    setName(me?.displayName ?? "");
  }, [me?.displayName]);

  const saveName = async () => {
    try {
      await update.mutateAsync({ displayName: name.trim() || null });
      toast.success(t("circleMembership.nameSaved"));
    } catch {
      toast.error(t("circleMembership.error"));
    }
  };

  const togglePause = async (paused: boolean) => {
    try {
      await update.mutateAsync({ paused });
      toast.info(paused ? t("circleMembership.pausedToast") : t("circleMembership.resumedToast"));
    } catch {
      toast.error(t("circleMembership.error"));
    }
  };

  const doLeave = async () => {
    setConfirmLeave(false);
    try {
      await leave.mutateAsync();
      onLeft();
    } catch {
      toast.error(t("circleMembership.error"));
    }
  };

  return (
    <Card padding="three" style={styles.card}>
      <SectionHeader
        title={t("circleMembership.title")}
        icon={{ ios: "person.crop.circle", android: "account_circle", web: "account_circle" }}
      />
      <LabeledInput
        label={t("circleMembership.nameLabel")}
        hint={t("circleMembership.nameHint")}
        value={name}
        onChangeText={setName}
        maxLength={CIRCLE_LIMITS.displayNameMaxLength}
        onSubmitEditing={() => void saveName()}
      />
      <Button
        size="sm"
        variant="secondary"
        label={t("circleMembership.saveName")}
        disabled={update.isPending || name.trim() === (me?.displayName ?? "")}
        onPress={() => void saveName()}
      />
      {showPause ? (
        <View style={styles.switchRow}>
          <View style={styles.switchText}>
            <ThemedText type="smallBold">{t("circleMembership.pauseLabel")}</ThemedText>
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("circleMembership.pauseHint")}
            </ThemedText>
          </View>
          <ThemedSwitch
            value={me?.paused ?? false}
            onValueChange={(value) => void togglePause(value)}
            disabled={update.isPending}
            accessibilityLabel={t("circleMembership.pauseLabel")}
          />
        </View>
      ) : null}
      <Button
        size="sm"
        variant="ghost"
        label={t("circleMembership.leave")}
        onPress={() => setConfirmLeave(true)}
        disabled={leave.isPending}
      />
      <ConfirmDialog
        visible={confirmLeave}
        title={t("circleMembership.leaveTitle")}
        message={t("circleMembership.leaveBody")}
        confirmLabel={t("circleMembership.leave")}
        cancelLabel={t("common.cancel")}
        destructive
        onConfirm={() => void doLeave()}
        onClose={() => setConfirmLeave(false)}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: Spacing.two },
  switchRow: { flexDirection: "row", alignItems: "center", gap: Spacing.three },
  switchText: { flex: 1, gap: Spacing.half },
});
