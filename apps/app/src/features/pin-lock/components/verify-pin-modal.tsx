import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "react-native";
import { PinKeypad } from "@/features/pin-lock/components/pin-keypad";
import { PinShell } from "@/features/pin-lock/components/pin-shell";
import { PIN_LENGTH } from "@/features/pin-lock/lib/pin-crypto";
import { triggerHaptic } from "@/lib/haptics";

interface VerifyPinModalProps {
  visible: boolean;
  onClose: () => void;
  onVerify: (pin: string) => Promise<boolean>;
  title?: string;
  subtitle?: string;
}

export function VerifyPinModal({
  visible,
  onClose,
  onVerify,
  title,
  subtitle,
}: VerifyPinModalProps) {
  const { t } = useTranslation();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const reset = useCallback(() => {
    setPin("");
    setError("");
    setIsVerifying(false);
  }, []);

  const handleClose = useCallback(() => {
    if (isVerifying) return;
    reset();
    onClose();
  }, [onClose, reset, isVerifying]);

  const handleDigit = useCallback(
    (digit: string) => {
      if (isVerifying) return;
      triggerHaptic("light");
      setError("");
      if (pin.length >= PIN_LENGTH) return;
      const next = pin + digit;
      setPin(next);
      if (next.length === PIN_LENGTH) {
        setIsVerifying(true);
        onVerify(next)
          .then((ok) => {
            if (ok) handleClose();
            else {
              setError(t("pinLock.wrongPin"));
              setPin("");
            }
          })
          .catch(() => {
            setError(t("pinLock.wrongPin"));
            setPin("");
          })
          .finally(() => setIsVerifying(false));
      }
    },
    [pin, onVerify, handleClose, t, isVerifying],
  );

  const handleBackspace = useCallback(() => {
    if (isVerifying) return;
    triggerHaptic("light");
    setError("");
    setPin((p) => p.slice(0, -1));
  }, [isVerifying]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <PinShell
        title={title ?? t("pinLock.enterPin")}
        subtitle={
          isVerifying ? t("pinLock.verifyingPin") : (subtitle ?? t("pinLock.enterPinSubtitle"))
        }
        filledCount={pin.length}
        dotsLoading={isVerifying}
        dotsError={Boolean(error)}
        errorMessage={error || null}
        shakeTrigger={error || null}
        onClose={handleClose}
        closeDisabled={isVerifying}
        keypad={
          <PinKeypad
            onDigit={handleDigit}
            onBackspace={handleBackspace}
            disabled={isVerifying}
            loading={isVerifying}
          />
        }
      />
    </Modal>
  );
}
