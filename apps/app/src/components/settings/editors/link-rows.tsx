import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";

import { usePinLock } from "@/features/pin-lock";

import { SettingsRow, ToggleRow } from "../settings-rows";
import { ThisDeviceBadge } from "../this-device-badge";

/** App lock → `/settings/app-lock`, valued with the PIN provider's state. */
export function AppLockRow() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isPinEnabled } = usePinLock();
  return (
    <SettingsRow
      icon={{ ios: "lock.fill", android: "lock", web: "lock" }}
      title={t("settings.appLock")}
      subtitle={t("settings.appLockSub")}
      accessory={<ThisDeviceBadge />}
      value={isPinEnabled ? t("common.on") : t("common.off")}
      onPress={() => router.push("/settings/app-lock" as Href)}
    />
  );
}

/** Siri / Google Assistant shortcuts (title differs per OS). */
export function VoiceShortcutsRow() {
  const { t } = useTranslation();
  const router = useRouter();
  const android = Platform.OS === "android";
  return (
    <SettingsRow
      icon={{ ios: "mic.fill", android: "mic", web: "mic" }}
      title={t(android ? "externalCommands.titleAndroid" : "externalCommands.titleIos")}
      subtitle={t(
        android
          ? "externalCommands.settingsSubtitleAndroid"
          : "externalCommands.settingsSubtitleIos",
      )}
      onPress={() => router.push("/settings/voice-shortcuts" as Href)}
    />
  );
}

/**
 * App lock › biometric unlock (NF-3.0b step 4): Face ID / fingerprint can
 * unlock instead of the PIN. Was always on; now a device toggle (default on).
 * Only shown when a PIN is set and the device has enrolled biometrics.
 */
export function BiometricUnlockRow() {
  const { t } = useTranslation();
  const {
    isPinEnabled,
    biometricsSupported,
    biometricUnlockEnabled,
    setBiometricUnlockEnabled,
    biometricUnlockLabelKey,
  } = usePinLock();
  if (!isPinEnabled || !biometricsSupported) return null;
  return (
    <ToggleRow
      icon={{ ios: "faceid", android: "fingerprint", web: "fingerprint" }}
      title={t(biometricUnlockLabelKey)}
      subtitle={t("settingsStep4.biometric.subtitle")}
      accessory={<ThisDeviceBadge />}
      value={biometricUnlockEnabled}
      onValueChange={setBiometricUnlockEnabled}
    />
  );
}
