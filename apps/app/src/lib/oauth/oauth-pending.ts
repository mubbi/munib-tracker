import { deleteSecureItem, getSecureItem, setSecureItem } from "@/lib/storage/safe-secure-store";

const GOOGLE_PENDING_KEY = "munib.oauth.google.pending";
const APPLE_PENDING_KEY = "munib.oauth.apple.pending";

export type GoogleOAuthPendingSession = {
  codeVerifier: string;
  redirectUri: string;
  clientId: string;
  state: string;
};

export type AppleOAuthPendingSession = {
  codeVerifier: string;
  redirectUri: string;
  state: string;
};

async function saveJson(key: string, value: unknown): Promise<void> {
  await setSecureItem(key, JSON.stringify(value));
}

async function loadJson<T>(key: string): Promise<T | null> {
  const raw = await getSecureItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function saveGoogleOAuthPendingSession(
  session: GoogleOAuthPendingSession,
): Promise<void> {
  await saveJson(GOOGLE_PENDING_KEY, session);
}

export async function loadGoogleOAuthPendingSession(): Promise<GoogleOAuthPendingSession | null> {
  return loadJson(GOOGLE_PENDING_KEY);
}

export async function clearGoogleOAuthPendingSession(): Promise<void> {
  await deleteSecureItem(GOOGLE_PENDING_KEY);
}

export async function saveAppleOAuthPendingSession(
  session: AppleOAuthPendingSession,
): Promise<void> {
  await saveJson(APPLE_PENDING_KEY, session);
}

export async function loadAppleOAuthPendingSession(): Promise<AppleOAuthPendingSession | null> {
  return loadJson(APPLE_PENDING_KEY);
}

export async function clearAppleOAuthPendingSession(): Promise<void> {
  await deleteSecureItem(APPLE_PENDING_KEY);
}
