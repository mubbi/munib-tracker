import {
  deletePlatformSecureItem,
  getPlatformSecureItem,
  setPlatformSecureItem,
} from "@/lib/storage/platform-secure-storage";

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

function isGooglePending(value: unknown): value is GoogleOAuthPendingSession {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.codeVerifier === "string" &&
    typeof v.redirectUri === "string" &&
    typeof v.clientId === "string" &&
    typeof v.state === "string"
  );
}

function isApplePending(value: unknown): value is AppleOAuthPendingSession {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.codeVerifier === "string" &&
    typeof v.redirectUri === "string" &&
    typeof v.state === "string"
  );
}

async function saveJson(key: string, value: unknown): Promise<void> {
  await setPlatformSecureItem(key, JSON.stringify(value));
}

async function loadJson(key: string): Promise<unknown | null> {
  const raw = await getPlatformSecureItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as unknown;
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
  const parsed = await loadJson(GOOGLE_PENDING_KEY);
  return isGooglePending(parsed) ? parsed : null;
}

export async function clearGoogleOAuthPendingSession(): Promise<void> {
  await deletePlatformSecureItem(GOOGLE_PENDING_KEY);
}

export async function saveAppleOAuthPendingSession(
  session: AppleOAuthPendingSession,
): Promise<void> {
  await saveJson(APPLE_PENDING_KEY, session);
}

export async function loadAppleOAuthPendingSession(): Promise<AppleOAuthPendingSession | null> {
  const parsed = await loadJson(APPLE_PENDING_KEY);
  return isApplePending(parsed) ? parsed : null;
}

export async function clearAppleOAuthPendingSession(): Promise<void> {
  await deletePlatformSecureItem(APPLE_PENDING_KEY);
}
