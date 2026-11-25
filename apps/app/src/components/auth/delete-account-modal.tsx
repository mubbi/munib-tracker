import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { DeleteAccountConfirmStep } from "@/components/auth/delete-account-confirm-step";
import { DeleteAccountReasonStep } from "@/components/auth/delete-account-reason-step";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Sheet } from "@/components/ui/sheet";
import { TvScrollView } from "@/components/ui/tv-scroll-view";
import { Spacing } from "@/constants/theme";
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
  /**
   * Guest copy (F-22): a guest has no account, so the flow reads "Erase all
   * data on this device?" / "Erase data". The steps and the typed word stay.
   */
  guest?: boolean;
};

export function DeleteAccountModal({
  visible,
  onClose,
  onDeleted,
  deleteAccount,
  guest = false,
}: DeleteAccountModalProps) {
  const { t } = useTranslation();
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
      setError(t(guest ? "profile.eraseFailed" : "profile.deleteFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet
      visible={visible}
      // Busy: the scrim, Back and the close button cannot interrupt the deletion.
      onClose={loading ? () => {} : onClose}
      title={t(guest ? "profile.eraseTitle" : "profile.deleteTitle")}
      showCloseButton={!loading}
      solid
      scrollable={false}
    >
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.eyebrow}>
        {t("profile.deleteAccountStepOf", { step, total: 3 })}
      </ThemedText>

      <TvScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {step === 1 ? (
          <>
            <ThemedText type="smallBold" heading={3}>
              {t("profile.deleteAccountStep1Title")}
            </ThemedText>
            <ThemedText type="small" themeColor="mutedForeground">
              {t(guest ? "profile.deleteMsg" : "profile.deleteAccountStep1Body")}
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
            guest={guest}
          />
        ) : null}

        {error ? <Callout tone="danger">{error}</Callout> : null}
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
              label={t(guest ? "profile.eraseConfirm" : "profile.deleteAccount")}
              variant="destructive"
              disabled={!canConfirm}
              loading={loading}
              onPress={() => void handleDelete()}
              style={styles.actionHalf}
            />
          </>
        ) : null}
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    marginBottom: Spacing.two,
  },
  scroll: {
    maxHeight: 420,
  },
  scrollContent: {
    paddingBottom: Spacing.two,
    gap: Spacing.two,
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
