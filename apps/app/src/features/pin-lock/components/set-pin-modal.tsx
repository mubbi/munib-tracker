import { SymbolView } from "expo-symbols";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, StyleSheet, View } from "react-native";
import { Radius } from "@/constants/theme";
import { PinKeypad } from "@/features/pin-lock/components/pin-keypad";
import { PinShell } from "@/features/pin-lock/components/pin-shell";
import { PIN_LENGTH } from "@/features/pin-lock/lib/pin-crypto";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { triggerHaptic } from "@/lib/haptics";

const SUCCESS_DISMISS_MS = 550;

type Step = "enter" | "confirm";
type SubmitStatus = "idle" | "saving" | "success";

interface SetPinModalProps {
  visible: boolean;
  onClose: () => void;
  onSetPin: (pin: string) => Promise<boolean>;
  title?: string;
  embedded?: boolean;
}

export function SetPinModal({
  visible,
  onClose,
  onSetPin,
  title,
  embedded = false,
}: SetPinModalProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const [step, setStep] = useState<Step>("enter");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const firstPinRef = useRef("");
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reset = useCallback(() => {
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
    firstPinRef.current = "";
    setStep("enter");
    setPin("");
    setError("");
    setSubmitStatus("idle");
  }, []);

  const handleClose = useCallback(() => {
    if (submitStatus === "saving") return;
    reset();
    onClose();
  }, [onClose, reset, submitStatus]);

  useEffect(() => {
    if (visible) reset();
  }, [visible, reset]);

  useEffect(() => {
    return () => {
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    };
  }, []);

  const isBusy = submitStatus !== "idle";

  const displayTitle = title ?? (step === "enter" ? t("pinLock.setPin") : t("pinLock.confirmPin"));

  const subtitle =
    submitStatus === "saving"
      ? t("pinLock.savingPin")
      : submitStatus === "success"
        ? t("pinLock.pinSaved")
        : step === "enter"
          ? t("pinLock.setPinSubtitle")
          : t("pinLock.confirmPinSubtitle");

  const savePin = useCallback(
    (confirmedPin: string) => {
      setSubmitStatus("saving");
      onSetPin(confirmedPin)
        .then((ok) => {
          if (ok) {
            triggerHaptic("success");
            setSubmitStatus("success");
            dismissTimerRef.current = setTimeout(() => {
              dismissTimerRef.current = null;
              reset();
              onClose();
            }, SUCCESS_DISMISS_MS);
          } else {
            setSubmitStatus("idle");
            setError(t("pinLock.setPinFailed"));
            setPin("");
            setStep("confirm");
          }
        })
        .catch(() => {
          setSubmitStatus("idle");
          setError(t("pinLock.setPinFailed"));
          setPin("");
          setStep("confirm");
        });
    },
    [onSetPin, onClose, reset, t],
  );

  const handleDigit = useCallback(
    (digit: string) => {
      if (isBusy) return;
      triggerHaptic("light");
      setError("");
      if (pin.length >= PIN_LENGTH) return;

      const next = pin + digit;
      setPin(next);
      if (next.length < PIN_LENGTH) return;

      if (step === "enter") {
        firstPinRef.current = next;
        setStep("confirm");
        setPin("");
        return;
      }

      if (next !== firstPinRef.current) {
        setError(t("pinLock.pinMismatch"));
        setPin("");
        return;
      }

      savePin(next);
    },
    [pin, step, isBusy, savePin, t],
  );

  const handleBackspace = useCallback(() => {
    if (isBusy) return;
    triggerHaptic("light");
    setError("");
    setPin((p) => p.slice(0, -1));
  }, [isBusy]);

  if (!visible) return null;

  const shell =
    submitStatus === "success" ? (
      <PinShell
        title={t("pinLock.pinSaved")}
        subtitle=""
        successBody={
          <View
            style={[
              styles.successBadge,
              {
                borderColor: tokens.accentBorder,
                backgroundColor: tokens.accentSoft,
              },
            ]}
          >
            <SymbolView
              name={{ ios: "checkmark.circle.fill", android: "check_circle", web: "check_circle" }}
              size={64}
              tintColor={colors.accent}
            />
          </View>
        }
      />
    ) : (
      <PinShell
        title={displayTitle}
        subtitle={subtitle}
        filledCount={pin.length}
        dotsLoading={submitStatus === "saving"}
        dotsError={Boolean(error)}
        errorMessage={error || null}
        shakeTrigger={error || null}
        onClose={embedded ? undefined : handleClose}
        closeDisabled={submitStatus === "saving"}
        keypad={
          <PinKeypad
            onDigit={handleDigit}
            onBackspace={handleBackspace}
            disabled={isBusy}
            loading={submitStatus === "saving"}
          />
        }
      />
    );

  if (embedded) {
    return <View style={styles.embedded}>{shell}</View>;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      {shell}
    </Modal>
  );
}

const styles = StyleSheet.create({
  embedded: {
    flex: 1,
  },
  successBadge: {
    width: 96,
    height: 96,
    borderRadius: Radius.xl,
    borderCurve: "continuous",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
