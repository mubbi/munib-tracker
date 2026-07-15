import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Sheet } from "@/components/ui/sheet";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  ACCOUNT_CLOSURE_CONFIRMATION,
  ACCOUNT_CLOSURE_REASONS,
  type AccountClosureReasonCode,
  type DeleteAccountRequestBody,
} from "@/lib/auth/account-closure-reasons";

type DeleteAccountModalProps = {
  visible: boolean;
  onClose: () => void;
  onDeleted: () => void;
  deleteAccount: (body: DeleteAccountRequestBody) => Promise<void>;
};

export function DeleteAccountModal({
  visible,
  onClose,
  onDeleted,
  deleteAccount,
}: DeleteAccountModalProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [primaryReason, setPrimaryReason] = useState<AccountClosureReasonCode | null>(null);
  const [details, setDetails] = useState("");
  const [typed, setTyped] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) {
      setStep(1);
      setPrimaryReason(null);
      setDetails("");
      setTyped("");
      setAcknowledged(false);
      setError(null);
    }
  }, [visible]);

  const handleContinue1 = () => setStep(2);
  const handleBack2 = () => {
    setStep(1);
    setError(null);
  };
  const handleContinue2 = () => {
    if (!primaryReason) {
      setError(t("profile.deleteAccountSelectReason"));
      return;
    }
    setError(null);
    setStep(3);
  };
  const handleBack3 = () => {
    setStep(2);
    setTyped("");
    setAcknowledged(false);
    setError(null);
  };

  const canConfirm =
    typed.trim() === ACCOUNT_CLOSURE_CONFIRMATION && acknowledged && primaryReason != null;

  const handleDelete = async () => {
    if (!canConfirm || loading || !primaryReason) return;
    setLoading(true);
    setError(null);
    const trimmedDetails = details.trim();
    try {
      await deleteAccount({
        confirmation: ACCOUNT_CLOSURE_CONFIRMATION,
        primaryReason,
        ...(trimmedDetails ? { details: trimmedDetails.slice(0, 500) } : {}),
      });
      onDeleted();
      onClose();
    } catch {
      setError(t("profile.deleteFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet visible={visible} onClose={loading ? () => {} : onClose} solid scrollable={false}>
      <View style={styles.header}>
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.eyebrow}>
          {t("profile.deleteAccountModalEyebrow")}
        </ThemedText>
        <ThemedText type="subtitle">{t("profile.deleteTitle")}</ThemedText>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {step === 1 ? (
          <>
            <ThemedText type="small" style={styles.blockTitle}>
              {t("profile.deleteAccountStep1Title")}
            </ThemedText>
            <ThemedText type="small" themeColor="mutedForeground">
              {t("profile.deleteAccountStep1Body")}
            </ThemedText>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <ThemedText type="small" style={styles.blockTitle}>
              {t("profile.deleteAccountSurveyTitle")}
            </ThemedText>
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.surveyIntro}>
              {t("profile.deleteAccountSurveyIntro")}
            </ThemedText>
            {ACCOUNT_CLOSURE_REASONS.map((reason) => {
              const selected = primaryReason === reason;
              return (
                <PressableScale
                  key={reason}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  haptic="selection"
                  onPress={() => {
                    setPrimaryReason(reason);
                    setError(null);
                  }}
                  style={[
                    styles.reasonRow,
                    {
                      borderColor: selected ? colors.accent : colors.border,
                      backgroundColor: selected ? tokens.accentSoft : "transparent",
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.radioOuter,
                      { borderColor: selected ? colors.accent : colors.border },
                    ]}
                  >
                    {selected ? (
                      <View style={[styles.radioInner, { backgroundColor: colors.accent }]} />
                    ) : null}
                  </View>
                  <ThemedText type="small" style={styles.reasonLabel}>
                    {t(`profile.deleteAccountReasons.${reason}`)}
                  </ThemedText>
                </PressableScale>
              );
            })}
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.detailsLabel}>
              {t("profile.deleteAccountDetailsOptional")}
            </ThemedText>
            <TextInput
              value={details}
              onChangeText={(value) => {
                setDetails(value.slice(0, 500));
                setError(null);
              }}
              placeholder={t("profile.deleteAccountDetailsPlaceholder")}
              placeholderTextColor={colors.mutedForeground}
              multiline
              editable={!loading}
              style={[
                styles.detailsInput,
                {
                  color: colors.foreground,
                  borderColor: colors.border,
                  backgroundColor: colors.muted,
                },
              ]}
            />
          </>
        ) : null}

        {step === 3 ? (
          <>
            <ThemedText type="small" style={styles.blockTitle}>
              {t("profile.deleteAccountStep3Title")}
            </ThemedText>
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.step3Body}>
              {t("profile.deleteAccountStep3Body")}
            </ThemedText>
            <TextInput
              value={typed}
              onChangeText={(value) => {
                setTyped(value);
                setError(null);
              }}
              placeholder={t("profile.deleteAccountTypePlaceholder")}
              placeholderTextColor={colors.mutedForeground}
              autoCapitalize="characters"
              autoCorrect={false}
              editable={!loading}
              style={[
                styles.confirmInput,
                {
                  color: colors.foreground,
                  borderColor: colors.border,
                  backgroundColor: colors.muted,
                },
              ]}
            />
            <PressableScale
              accessibilityRole="checkbox"
              accessibilityState={{ checked: acknowledged }}
              haptic="selection"
              onPress={() => {
                setAcknowledged((value) => !value);
                setError(null);
              }}
              style={styles.ackRow}
            >
              <View
                style={[
                  styles.checkbox,
                  {
                    borderColor: acknowledged ? colors.accent : colors.border,
                    backgroundColor: acknowledged ? colors.accent : "transparent",
                  },
                ]}
              >
                {acknowledged ? (
                  <ThemedText type="caption" style={{ color: colors.accentForeground }}>
                    ✓
                  </ThemedText>
                ) : null}
              </View>
              <ThemedText type="small" style={styles.ackLabel}>
                {t("profile.deleteAccountAcknowledge")}
              </ThemedText>
            </PressableScale>
          </>
        ) : null}

        {error ? (
          <ThemedText
            type="caption"
            style={{ color: tokens.status.danger.color, marginTop: Spacing.two }}
          >
            {error}
          </ThemedText>
        ) : null}
      </ScrollView>

      <View style={styles.actions}>
        {step === 1 ? (
          <Button label={t("profile.deleteAccountContinue")} fullWidth onPress={handleContinue1} />
        ) : null}
        {step === 2 ? (
          <>
            <Button
              label={t("profile.deleteAccountBack")}
              variant="ghost"
              onPress={handleBack2}
              style={styles.actionHalf}
            />
            <Button
              label={t("profile.deleteAccountContinue")}
              onPress={handleContinue2}
              style={styles.actionHalf}
            />
          </>
        ) : null}
        {step === 3 ? (
          <>
            <Button
              label={t("profile.deleteAccountBack")}
              variant="ghost"
              disabled={loading}
              onPress={handleBack3}
              style={styles.actionHalf}
            />
            <Button
              label={t("profile.deleteConfirm")}
              disabled={!canConfirm || loading}
              onPress={() => void handleDelete()}
              style={[styles.actionHalf, { backgroundColor: tokens.status.danger.color }]}
            />
          </>
        ) : null}
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.one,
    marginBottom: Spacing.two,
  },
  eyebrow: {
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  scroll: {
    maxHeight: 420,
  },
  scrollContent: {
    paddingBottom: Spacing.two,
    gap: Spacing.two,
  },
  blockTitle: {
    fontWeight: "700",
  },
  surveyIntro: {
    marginBottom: Spacing.one,
  },
  reasonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  reasonLabel: {
    flex: 1,
  },
  detailsLabel: {
    marginTop: Spacing.one,
  },
  detailsInput: {
    minHeight: 72,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    textAlignVertical: "top",
  },
  step3Body: {
    marginBottom: Spacing.one,
  },
  confirmInput: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
    fontWeight: "600",
  },
  ackRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: Radius.sm,
    borderWidth: 2,
    marginTop: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  ackLabel: {
    flex: 1,
    lineHeight: 20,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  actionHalf: {
    flex: 1,
    minWidth: 120,
  },
});
