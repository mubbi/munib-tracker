import * as AppleAuthentication from "expo-apple-authentication";

export type AppleNativeCredential = {
  identityToken: string | null;
  fullName?: { givenName?: string | null; familyName?: string | null } | null;
  email?: string | null;
};

export async function isAppleAuthAvailable(): Promise<boolean> {
  return AppleAuthentication.isAvailableAsync();
}

export async function signInWithAppleNative(): Promise<AppleNativeCredential> {
  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  });
  return {
    identityToken: credential.identityToken,
    fullName: credential.fullName,
    email: credential.email,
  };
}
