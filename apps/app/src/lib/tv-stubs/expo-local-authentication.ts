/**
 * Metro resolves `expo-local-authentication` here when `EXPO_TV=1`.
 * Face ID / Touch ID are unavailable on Apple TV.
 */

export enum AuthenticationType {
  FINGERPRINT = 1,
  FACIAL_RECOGNITION = 2,
  IRIS = 3,
}

export async function hasHardwareAsync(): Promise<boolean> {
  return false;
}

export async function isEnrolledAsync(): Promise<boolean> {
  return false;
}

export async function supportedAuthenticationTypesAsync(): Promise<AuthenticationType[]> {
  return [];
}

export async function authenticateAsync(_options?: {
  promptMessage?: string;
  cancelLabel?: string;
  disableDeviceFallback?: boolean;
}): Promise<{ success: boolean; error?: string }> {
  return { success: false, error: "not_available" };
}

export default {
  AuthenticationType,
  hasHardwareAsync,
  isEnrolledAsync,
  supportedAuthenticationTypesAsync,
  authenticateAsync,
};
