/**
 * Metro resolves `expo-apple-authentication` here when `EXPO_TV=1`.
 * Native Sign in with Apple button / APIs are phone-oriented in this build.
 */

export enum AppleAuthenticationScope {
  FULL_NAME = 0,
  EMAIL = 1,
}

export async function isAvailableAsync(): Promise<boolean> {
  return false;
}

export async function signInAsync(_options?: {
  requestedScopes?: AppleAuthenticationScope[];
}): Promise<never> {
  throw new Error("Apple Authentication unavailable on TV");
}

export async function getCredentialStateAsync(_user: string): Promise<number> {
  return 0;
}

export default {
  AppleAuthenticationScope,
  isAvailableAsync,
  signInAsync,
  getCredentialStateAsync,
};
