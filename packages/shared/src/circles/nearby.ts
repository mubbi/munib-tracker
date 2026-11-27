/**
 * NF-3.25 "Nearby join" (D41–D44) — the contract the app, the API and the
 * native BLE module (`apps/app/modules/munib-nearby`) share.
 *
 * - The host's phone advertises ONE 128-bit Bluetooth LE service UUID while its
 *   invite screen is open: a fixed 8-byte app prefix + the 8-byte opaque nearby
 *   session id. Nothing else is broadcast (no invite code, no names, no ids
 *   that outlive the 10-minute session). 16 + 2 header bytes + 3 flag bytes fit
 *   the 31-byte legacy advertising packet on iOS and Android, so neither side
 *   depends on scan responses, service data or a local name (iOS can't
 *   advertise service data; Android can't set a per-advert local name).
 * - Joiners scan for the prefix, fetch the session preview (circle name, type,
 *   member count, 4-digit match code), compare the 4 digits with the host's
 *   screen (D44) and only then send a join request; the host approves each one
 *   (D42).
 */
/*
 * Same unions as `CircleType` / `CircleRole` in `./index` (kept local so this
 * subpath has no relative value/type import for the API's node16 resolution;
 * `nearby.test.ts` asserts they stay identical).
 */
type CircleType = "family" | "partner" | "khatm_group";
type CircleRole = "owner" | "admin" | "parent" | "member" | "child";

/** How long a nearby session (and the host's advertising) lasts. */
export const NEARBY_SESSION_TTL_MINUTES = 10;

export const NEARBY_LIMITS = {
  sessionTtlMinutes: NEARBY_SESSION_TTL_MINUTES,
  /** Pending "Asking to join" requests one session holds at once. */
  maxPendingPerSession: 20,
  /** Sessions a user may open per rolling 24 h (each one is short-lived). */
  sessionsPerUserPerDay: 30,
  /** Session previews per client IP per 15 min (a crowded masjid shares one IP). */
  lookupsPerIpPer15Min: 120,
  /** Join requests per client IP per 15 min. */
  requestsPerIpPer15Min: 60,
  /** Status polls per request per 15 min. */
  pollsPerRequestPer15Min: 450,
  /** An accepted child-device request must be picked up within this window. */
  childPickupMinutes: 5,
  /** App polling cadence while the host / joiner screen is open. */
  pollMs: 3_000,
} as const;

/** Bytes 0–7 of every nearby service UUID (random, app-specific). */
export const NEARBY_SERVICE_UUID_PREFIX = "9a3c5e71-2b84-4f06";
/** Prefix mask for Android `ScanFilter.setServiceUuid(uuid, mask)` (match bytes 0–7 only). */
export const NEARBY_SERVICE_UUID_MASK = "ffffffff-ffff-ffff-0000-000000000000";

/** 8 random bytes as 16 lowercase hex chars. */
const SESSION_ID_RE = /^[0-9a-f]{16}$/;
const MATCH_CODE_RE = /^[0-9]{4}$/;
const SERVICE_UUID_RE = /^9a3c5e71-2b84-4f06-([0-9a-f]{4})-([0-9a-f]{12})$/;

export const NEARBY_MATCH_CODE_LENGTH = 4;

export const NEARBY_PURPOSES = ["member", "child_link"] as const;
/** `member`: an adult joins the circle; `child_link`: a parent links a child's device (D7). */
export type NearbyPurpose = (typeof NEARBY_PURPOSES)[number];

/** Stored request states. */
export const NEARBY_REQUEST_STATUSES = [
  "pending",
  "accepted",
  "declined",
  "cancelled",
  "completed",
] as const;
export type NearbyRequestStatus = (typeof NEARBY_REQUEST_STATUSES)[number];

/** What the joiner's poll reports (adds `expired`: the session ended before a decision). */
export const NEARBY_JOINER_STATUSES = [...NEARBY_REQUEST_STATUSES, "expired"] as const;
export type NearbyJoinerStatus = (typeof NEARBY_JOINER_STATUSES)[number];

/** Typed 409 codes the app maps to friendly copy. */
export const NEARBY_ERROR_CODES = {
  matchMismatch: "NEARBY_MATCH_MISMATCH",
  alreadyMember: "NEARBY_ALREADY_MEMBER",
  sessionFull: "NEARBY_SESSION_FULL",
} as const;

export function isValidNearbySessionId(value: string): boolean {
  return SESSION_ID_RE.test(value);
}

export function isValidNearbyMatchCode(value: string): boolean {
  return MATCH_CODE_RE.test(value);
}

/** The service UUID the host advertises for `sessionId`. */
export function nearbyServiceUuid(sessionId: string): string {
  if (!isValidNearbySessionId(sessionId)) throw new Error("Invalid nearby session id");
  return `${NEARBY_SERVICE_UUID_PREFIX}-${sessionId.slice(0, 4)}-${sessionId.slice(4)}`;
}

/** Inverse of {@link nearbyServiceUuid}; `null` for any other UUID (case-insensitive). */
export function nearbySessionIdFromUuid(uuid: string): string | null {
  const match = SERVICE_UUID_RE.exec(uuid.trim().toLowerCase());
  return match ? `${match[1]}${match[2]}` : null;
}

/** "4712" → "4 7 1 2" for screen readers (digits read one by one). */
export function spellMatchCode(code: string): string {
  return code.split("").join(" ");
}

/**
 * D43 scope: nearby join is offered for group khatm, family (adult members and
 * — owner only — parents), accountability partner, and child-device linking.
 * A subset of `INVITABLE_ROLES` (the API still applies `canInviteRole`, so a
 * parent session is owner-only); khatm `admin` invites stay code-only.
 */
const NEARBY_ROLES: Record<CircleType, readonly CircleRole[]> = {
  family: ["parent", "member"],
  partner: ["member"],
  khatm_group: ["member"],
};

export function nearbyRolesFor(type: CircleType): readonly CircleRole[] {
  return NEARBY_ROLES[type] ?? [];
}

export function canOfferNearby(type: CircleType, role: CircleRole): boolean {
  return nearbyRolesFor(type).includes(role);
}

/** Guests may only ask to join a khatm group (family / partner need a linked account). */
export function nearbyNeedsLinkedAccount(type: CircleType, purpose: NearbyPurpose): boolean {
  return purpose === "member" && type !== "khatm_group";
}
