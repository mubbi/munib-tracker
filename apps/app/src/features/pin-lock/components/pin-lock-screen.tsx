import { SymbolView } from "expo-symbols";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Spacing } from "@/constants/theme";
import { PinKeypad } from "@/features/pin-lock/components/pin-keypad";
import { PinShell } from "@/features/pin-lock/components/pin-shell";
import type { BiometricUnlockLabelKey } from "@/features/pin-lock/lib/biometric-unlock-label";
import { PIN_LENGTH } from "@/features/pin-lock/lib/pin-crypto";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { triggerHaptic } from "@/lib/haptics";

function formatLockoutRemaining(ms: number): string {
  const totalSec = Math.ceil(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  if (min > 0) return `${min} min ${sec} sec`;
  return `${sec} sec`;
}

interface PinLockScreenProps {
  onUnlock: (pin: string) => Promise<boolean>;
  biometricsAvailable?: boolean;
  biometricUnlockLabelKey?: BiometricUnlockLabelKey;
  onBiometricUnlock?: () => Promise<boolean>;
  title?: string;
  subtitle?: string;
  errorMessage?: string;
  onClearError?: () => void;
  isLockedOut?: boolean;
  lockoutRemainingMs?: number;
}

export function PinLockScreen({
  onUnlock,
  biometricsAvailable,
  biometricUnlockLabelKey = "pinLock.unlockWithBiometrics",
  onBiometricUnlock,
  title,
  subtitle,
  errorMessage,
  onClearError,
  isLockedOut = false,
  lockoutRemainingMs = 0,
}: PinLockScreenProps) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const [pin, setPin] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isBiometricVerifying, setIsBiometricVerifying] = useState(false);

  const isBusy = isVerifying || isBiometricVerifying;

  const handleBiometricUnlock = useCallback(() => {
    if (!onBiometricUnlock || isBusy || isLockedOut) return;
    triggerHaptic("light");
    onClearError?.();
    setIsBiometricVerifying(true);
    onBiometricUnlock().finally(() => setIsBiometricVerifying(false));
  }, [onBiometricUnlock, isBusy, onClearError, isLockedOut]);

  const handleDigit = useCallback(
    (digit: string) => {
      if (isLockedOut || isBusy) return;
      triggerHaptic("light");
      onClearError?.();
      if (pin.length >= PIN_LENGTH) return;
      const next = pin + digit;
      setPin(next);
      if (next.length === PIN_LENGTH) {
        setIsVerifying(true);
        onUnlock(next)
          .then((ok) => {
            if (!ok) {
              triggerHaptic("error");
              setPin("");
            }
          })
          .finally(() => setIsVerifying(false));
      }
    },
    [pin, onUnlock, onClearError, isLockedOut, isBusy],
  );

  const handleBackspace = useCallback(() => {
    if (isLockedOut || isBusy) return;
    triggerHaptic("light");
    onClearError?.();
    setPin((p) => p.slice(0, -1));
  }, [onClearError, isLockedOut, isBusy]);

  const displayTitle = title ?? t("pinLock.enterPin");
  const displaySubtitle = isVerifying
    ? t("pinLock.unlockingApp")
    : isBiometricVerifying
      ? t("pinLock.verifyingPin")
      : (subtitle ?? t("pinLock.enterPinSubtitle"));

  const statusMessage =
    isLockedOut && lockoutRemainingMs > 0
      ? t("pinLock.tryAgainIn", { time: formatLockoutRemaining(lockoutRemainingMs) })
      : (errorMessage ?? null);

  const biometricFooter =
    biometricsAvailable && onBiometricUnlock && !isLockedOut ? (
      <PressableScale
        onPress={handleBiometricUnlock}
        disabled={isBusy}
        haptic="selection"
        scaleTo={0.97}
        hitSlop={{ top: 16, bottom: 16, left: 24, right: 24 }}
        style={[styles.biometricBtn, { opacity: isBusy ? 0.5 : 1 }]}
        accessibilityRole="button"
        accessibilityLabel={
          isBiometricVerifying ? t("pinLock.verifyingPin") : t(biometricUnlockLabelKey)
        }
      >
        {isBiometricVerifying ? (
          <ActivityIndicator size="small" color={colors.foreground} />
        ) : (
          <SymbolView
            name={{ ios: "touchid", android: "fingerprint", web: "fingerprint" }}
            size={22}
            tintColor={colors.foreground}
          />
        )}
        <ThemedText type="small" themeColor="mutedForeground">
          {isBiometricVerifying ? t("pinLock.verifyingPin") : t(biometricUnlockLabelKey)}
        </ThemedText>
      </PressableScale>
    ) : null;

  return (
    <PinShell
      title={displayTitle}
      subtitle={displaySubtitle}
      filledCount={pin.length}
      dotsLoading={isVerifying}
      dotsError={Boolean(errorMessage && !isVerifying)}
      errorMessage={statusMessage}
      shakeTrigger={errorMessage && !isLockedOut ? errorMessage : null}
      presentation="lock"
      footer={biometricFooter}
      keypad={
        <PinKeypad
          onDigit={handleDigit}
          onBackspace={handleBackspace}
          disabled={isLockedOut || isBusy}
          loading={isVerifying}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  biometricBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    minHeight: 44,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
    marginTop: Spacing.four,
  },
});
