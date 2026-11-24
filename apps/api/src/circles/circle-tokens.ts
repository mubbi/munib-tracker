import { createHash, createHmac, randomBytes, randomInt } from "node:crypto";
import {
  INVITE_CODE_ALPHABET,
  INVITE_CODE_LENGTH,
  normalizeInviteCode,
} from "@munib-tracker/shared/circles";
import { DEV_JWT_SECRET } from "../config/env.schema";

/** Prefix that distinguishes a scoped child-session bearer from a user JWT. */
export const CHILD_TOKEN_PREFIX = "mtc_";
/** Prefix of the one-time QR device-link token. */
export const CHILD_LINK_TOKEN_PREFIX = "mtl_";

export function sha256Hex(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

/** 10 chars of RFC 4648 base32 from a CSPRNG (50 bits). */
export function generateInviteCode(): string {
  let code = "";
  for (let i = 0; i < INVITE_CODE_LENGTH; i += 1) {
    code += INVITE_CODE_ALPHABET[randomInt(INVITE_CODE_ALPHABET.length)];
  }
  return code;
}

/** Hash of the normalized code — the only form persisted. */
export function hashInviteCode(code: string): string {
  return sha256Hex(`circle-invite:${normalizeInviteCode(code)}`);
}

export function generateChildSessionToken(): string {
  return `${CHILD_TOKEN_PREFIX}${randomBytes(32).toString("base64url")}`;
}

export function generateChildLinkToken(): string {
  return `${CHILD_LINK_TOKEN_PREFIX}${randomBytes(24).toString("base64url")}`;
}

export function isChildSessionToken(token: string): boolean {
  return token.startsWith(CHILD_TOKEN_PREFIX);
}

/** Prefix of a nearby joiner's one-time request secret (NF-3.25). */
export const NEARBY_REQUEST_TOKEN_PREFIX = "mtn_";

/** NF-3.25: the 8-byte opaque session id the host's phone advertises over BLE. */
export function generateNearbySessionId(): string {
  return randomBytes(8).toString("hex");
}

/** NF-3.25: the joiner's poll secret (returned once, stored as SHA-256 only). */
export function generateNearbyRequestToken(): string {
  return `${NEARBY_REQUEST_TOKEN_PREFIX}${randomBytes(24).toString("base64url")}`;
}

/** HMAC key derived from JWT_SECRET for a dedicated purpose. */
function purposeKey(purpose: string): Buffer {
  const secret = process.env.JWT_SECRET?.trim() || DEV_JWT_SECRET;
  return createHash("sha256").update(`${purpose}:${secret}`).digest();
}

/**
 * D44: the 4-digit match code both screens show, derived from the session id
 * with a server key — so a spoofing phone advertising its own session shows
 * different digits, and the code never needs storing.
 */
export function nearbyMatchCode(sessionId: string): string {
  const digest = createHmac("sha256", purposeKey("circle-nearby-match"))
    .update(sessionId, "utf8")
    .digest();
  return String(digest.readUInt32BE(0) % 10_000).padStart(4, "0");
}

/** HMAC key for opaque member ids (dedicated purpose string, derived from JWT_SECRET). */
function memberIdKey(): Buffer {
  return purposeKey("circle-member-id");
}

/**
 * L11: the id other members see for an account member — an HMAC of
 * `(circleId, userId)` shaped as a UUID (v4 bits), so it is stable within a
 * circle but can't be linked across circles or back to the global `users.id`.
 * Child profiles already have a per-circle random id and keep it (the app
 * addresses `/children/:childId` with it). Rotating `JWT_SECRET` changes the
 * ids, which the app simply re-reads.
 */
export function publicMemberId(
  circleId: string,
  memberId: string,
  memberKind: "user" | "child" = "user",
): string {
  if (memberKind === "child") return memberId;
  const bytes = createHmac("sha256", memberIdKey())
    .update(`${circleId}:${memberId}`, "utf8")
    .digest()
    .subarray(0, 16);
  bytes[6] = ((bytes[6] ?? 0) & 0x0f) | 0x40;
  bytes[8] = ((bytes[8] ?? 0) & 0x3f) | 0x80;
  const hex = bytes.toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
