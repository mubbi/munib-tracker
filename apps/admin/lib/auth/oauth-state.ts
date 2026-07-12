import { jwtVerify, SignJWT } from "jose";
import { requireAdminEnv } from "../env";

const STATE_COOKIE = "mt_admin_oauth_state";
const STATE_TTL = "10m";

function getSecretKey(): Uint8Array {
  const { ADMIN_SESSION_SECRET } = requireAdminEnv();
  return new TextEncoder().encode(ADMIN_SESSION_SECRET);
}

export async function createOAuthState(): Promise<string> {
  return new SignJWT({ purpose: "google_oauth" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(STATE_TTL)
    .sign(getSecretKey());
}

export async function verifyOAuthState(state: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(state, getSecretKey());
    return payload.purpose === "google_oauth";
  } catch {
    return false;
  }
}

export { STATE_COOKIE };
