export type AppleNativeCredential = {
  identityToken: string | null;
  fullName?: { givenName?: string | null; familyName?: string | null } | null;
  email?: string | null;
};

export async function isAppleAuthAvailable(): Promise<boolean> {
  return false;
}

export async function signInWithAppleNative(): Promise<AppleNativeCredential> {
  throw new Error("Native Sign in with Apple is only available on iOS.");
}
