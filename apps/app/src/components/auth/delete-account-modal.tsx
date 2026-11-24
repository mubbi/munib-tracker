import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { DeleteAccountConfirmStep } from "@/components/auth/delete-account-confirm-step";
import { DeleteAccountReasonStep } from "@/components/auth/delete-account-reason-step";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { TvScrollView } from "@/components/ui/tv-scroll-view";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  type AccountClosureReasonCode,
  buildDeleteAccountRequest,
  type DeleteAccountRequestBody,
  isAccountClosureConfirmed,
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
  const { tokens } = useThemeTokens();
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

  const canConfirm = isAccountClosureConfirmed(typed, acknowledged, primaryReason);

  const handleDelete = async () => {
    if (!canConfirm || loading || !primaryReason) return;
    setLoading(true);
    setError(null);
    try {
      await deleteAccount(buildDeleteAccountRequest(primaryReason, details));
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

      <TvScrollView
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
          <DeleteAccountReasonStep
            reason={primaryReason}
            onReasonChange={(reason) => {
              setPrimaryReason(reason);
              setError(null);
            }}
            details={details}
            onDetailsChange={(value) => {
              setDetails(value);
              setError(null);
            }}
            disabled={loading}
          />
        ) : null}

        {step === 3 ? (
          <DeleteAccountConfirmStep
            typed={typed}
            onTypedChange={(value) => {
              setTyped(value);
              setError(null);
            }}
            acknowledged={acknowledged}
            onToggleAcknowledged={() => {
              setAcknowledged((value) => !value);
              setError(null);
            }}
            disabled={loading}
          />
        ) : null}

        {error ? (
          <ThemedText
            type="caption"
            style={{ color: tokens.status.danger.color, marginTop: Spacing.two }}
          >
            {error}
          </ThemedText>
        ) : null}
      </TvScrollView>

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
