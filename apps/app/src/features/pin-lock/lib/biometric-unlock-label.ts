import { Platform } from "react-native";

export type BiometricUnlockLabelKey =
  | "pinLock.unlockWithFaceId"
  | "pinLock.unlockWithTouchId"
  | "pinLock.unlockWithFingerprint"
  | "pinLock.unlockWithBiometrics";

/** Numeric values aligned with expo-local-authentication AuthenticationType. */
export const BiometricAuthenticationType = {
  FINGERPRINT: 1,
  FACIAL_RECOGNITION: 2,
  IRIS: 3,
} as const;

/** Pick the most specific biometric unlock label for the enrolled device capabilities. */
export function resolveBiometricUnlockLabelKey(types: readonly number[]): BiometricUnlockLabelKey {
  if (types.includes(BiometricAuthenticationType.FACIAL_RECOGNITION)) {
    return "pinLock.unlockWithFaceId";
  }
  if (types.includes(BiometricAuthenticationType.FINGERPRINT)) {
    return Platform.OS === "ios" ? "pinLock.unlockWithTouchId" : "pinLock.unlockWithFingerprint";
  }
  return "pinLock.unlockWithBiometrics";
}
