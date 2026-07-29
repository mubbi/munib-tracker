import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { PinLockScreen } from "@/features/pin-lock/components/pin-lock-screen";
import { SetPinModal } from "@/features/pin-lock/components/set-pin-modal";
import { usePinLock } from "@/features/pin-lock/providers/pin-lock-provider";

function PinLockGateOverlay() {
  const { t } = useTranslation();
  const {
    isReady,
    isLocked,
    hasStoredPin,
    unlock,
    unlockWithBiometrics,
    biometricsAvailable,
    biometricUnlockLabelKey,
    unlockError,
    unlockErrorParams,
    clearUnlockError,
    isLockedOut,
    lockoutRemainingMs,
  } = usePinLock();

  if (!isReady || !isLocked || !hasStoredPin) return null;

  const errorMessage =
    unlockError != null
      ? unlockErrorParams != null
        ? t(unlockError, unlockErrorParams)
        : t(unlockError)
      : undefined;

  return (
    <View style={[styles.overlay, { pointerEvents: "box-none" }]}>
      <PinLockScreen
        onUnlock={unlock}
        onBiometricUnlock={unlockWithBiometrics}
        biometricsAvailable={biometricsAvailable}
        biometricUnlockLabelKey={biometricUnlockLabelKey}
        errorMessage={errorMessage}
        onClearError={clearUnlockError}
        isLockedOut={isLockedOut}
        lockoutRemainingMs={lockoutRemainingMs}
      />
    </View>
  );
}

function PinSetupRequiredOverlay() {
  const { isReady, pinSetupRequired, enablePin } = usePinLock();

  if (!isReady || !pinSetupRequired) return null;

  return (
    <View style={styles.overlay}>
      <SetPinModal visible embedded onClose={() => {}} onSetPin={enablePin} />
    </View>
  );
}

/** Full-screen PIN lock gate — renders above all navigation when the app is locked. */
export function PinLockGate() {
  return (
    <>
      <PinLockGateOverlay />
      <PinSetupRequiredOverlay />
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 9999,
    elevation: 9999,
  },
});
