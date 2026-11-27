/**
 * Circles API wrapper (NF-3.16 family · NF-3.17 partner · NF-3.18 group khatm).
 *
 * The ONE place the app talks to `apps/api/src/circles`. Screens and hooks
 * (`lib/circles/hooks.ts`) import from here. Calls go through the Orval-generated
 * client (`@munib-tracker/api-client`, `pnpm generate:api`); the app-facing types
 * below mirror `apps/api/src/circles/dto/circles.dto.ts` with proper nullables.
 *
 * Account calls send the session bearer (omitted for web cookie sessions).
 * Child-device calls send the scoped child token (`mtc_…`) and never trigger the
 * account token refresher (`skipAuthRefresh`) — a child session is not an
 * account session.
 */
import * as gen from "@munib-tracker/api-client";
import {
  ApiError,
  type AssignKhatmPartDto,
  type CreateChildProfileDto,
  type CreateCircleDto,
  type CreateInviteDto,
  type CreateKhatmDto,
  type CreateNearbyRequestDto,
  type CreateNearbySessionDto,
  type GraduateChildDto,
  type JoinCircleDto,
  type UpdateChildProfileDto,
  type UpdateCircleDto,
  type UpdateKhatmDto,
  type UpdateMemberRoleDto,
  type UpdateMyMembershipDto,
} from "@munib-tracker/api-client";
import type {
  ChildAgeBand,
  CircleNudgeKind,
  CircleRole,
  CircleSignalKind,
  CircleType,
  FardStatusValue,
  KhatmAssignmentMode,
  KhatmPartStatus,
  KhatmStatus,
  KhatmUnit,
} from "@munib-tracker/shared/circles";
import type {
  NearbyJoinerStatus,
  NearbyPurpose,
  NearbyRequestStatus,
} from "@munib-tracker/shared/circles/nearby";

import { apiAuthOptions } from "@/api/auth-options";

// ---------------------------------------------------------------------------
// Response / request shapes (mirror the DTOs)
// ---------------------------------------------------------------------------

export type ChildSummary = {
  nickname: string;
  birthYear: number;
  avatar: string | null;
  ageBand: ChildAgeBand;
  /** D34: waiting for a co-parent's re-confirmed consent. */
  consentPending?: boolean;
};

export type CircleMember = {
  memberId: string;
  memberKind: "user" | "child";
  role: CircleRole;
  displayName: string | null;
  joinedAt: string;
  isMe: boolean;
  paused: boolean;
  shareFardStatus: boolean;
  child: ChildSummary | null;
};

export type CircleSummary = {
  id: string;
  type: CircleType;
  name: string;
  myRole: CircleRole;
  myMemberId: string;
  memberCount: number;
  masjidOsmRef: string | null;
  createdAt: string;
};

export type CircleDetail = CircleSummary & { members: CircleMember[] };

export type CreateCircleInput = {
  type: CircleType;
  name: string;
  displayName?: string;
  masjidOsmRef?: string;
};

export type UpdateCircleInput = { name?: string; masjidOsmRef?: string | null };

export type UpdateMyMembershipInput = {
  displayName?: string | null;
  paused?: boolean;
  shareFardStatus?: boolean;
};

export type Invite = {
  id: string;
  role: CircleRole;
  maxUses: number;
  uses: number;
  expiresAt: string;
  createdAt: string;
};

export type InviteCreated = Invite & { code: string; joinPath: string };

export type CreateInviteInput = {
  role?: CircleRole;
  maxUses?: number;
  expiresInHours?: number;
};

export type InvitePreview = {
  circleType: CircleType;
  circleName: string;
  memberCount: number;
  role: CircleRole;
  expiresAt: string;
  alreadyMember: boolean;
};

export type JoinCircleInput = { code: string; displayName?: string };

export type ChildReward = { title: string; days: number };

export type ChildProfile = {
  id: string;
  circleId: string;
  nickname: string;
  birthYear: number;
  avatar: string | null;
  ageBand: ChildAgeBand;
  reward: ChildReward | null;
  graduationUnlocked: boolean;
  graduationAvailable: boolean;
  linkedDeviceAt: string | null;
  createdAt: string;
  /**
   * D34: the consenting parent deleted their account and this profile was
   * transferred to you — re-confirm parental consent before `consentPendingUntil`
   * or it is deleted (device link, edits and logging wait until then).
   */
  consentPending?: boolean;
  consentTransferredAt?: string | null;
  consentPendingUntil?: string | null;
};

export type CreateChildInput = {
  nickname: string;
  birthYear: number;
  avatar?: string;
  parentalConsent: true;
  consentPolicyVersion: string;
};

export type UpdateChildInput = {
  nickname?: string;
  birthYear?: number;
  avatar?: string | null;
  reward?: ChildReward | null;
  graduationUnlocked?: boolean;
};

export type ChildDeviceLink = { linkToken: string; expiresAt: string };

export type ChildSession = { childToken: string; child: ChildProfile };

export type GraduateChildInput = {
  childToken: string;
  displayName?: string;
  shareFardStatus?: boolean;
};

export type CircleSignal = {
  memberId: string;
  date: string;
  kind: CircleSignalKind;
  value: Record<string, boolean>;
  updatedAt: string;
};

export type FardStatusInput = FardStatusValue & { date: string; memberId?: string };

export type Nudge = { id: string; kind: CircleNudgeKind; createdAt: string };

export type KhatmPart = {
  partNo: number;
  assigneeMemberId: string | null;
  status: KhatmPartStatus;
  /** Assigned by round-robin dealing; a member's own claim / a manager's pick is `false` and never re-dealt. */
  dealt: boolean;
  updatedAt: string;
  stale: boolean;
};

export type Khatm = {
  id: string;
  circleId: string;
  title: string;
  intention: string | null;
  unit: KhatmUnit;
  partCount: number;
  assignmentMode: KhatmAssignmentMode;
  deadline: string | null;
  deadlinePassed: boolean;
  round: number;
  status: KhatmStatus;
  createdBy: string | null;
  doneCount: number;
  createdAt: string;
  completedAt: string | null;
};

export type KhatmDetail = Khatm & { parts: KhatmPart[] };

export type CreateKhatmInput = {
  title: string;
  intention?: string;
  unit?: KhatmUnit;
  deadline?: string;
  assignmentMode?: KhatmAssignmentMode;
};

export type UpdateKhatmInput = {
  title?: string;
  intention?: string | null;
  deadline?: string | null;
  openRemainingParts?: boolean;
};

export type KhatmPartAction = "claim" | "release" | "reading" | "complete";

// ---------------------------------------------------------------------------
// Transport
// ---------------------------------------------------------------------------

/** Account bearer (`session.accessToken`); the web cookie marker sends no bearer. */
export type CircleToken = string | undefined;

/** Request options for an account call (cookie sessions omit the bearer). */
const auth = (token: CircleToken) => apiAuthOptions(token);

/** Child-device call: scoped `mtc_…` bearer, never the account refresher. */
const child = (childToken: string) => ({ accessToken: childToken, skipAuthRefresh: true });

/**
 * Orval types nullable strings as `{[key: string]: unknown} | null` and widens a
 * few enums, so responses are narrowed to the app-facing shapes above and
 * requests are passed through as the matching DTO. The runtime JSON is identical.
 */
const as = <T>(value: unknown): T => value as T;

/** HTTP status of a failed circles call (0 = network / unknown). */
export function circleErrorStatus(error: unknown): number {
  return error instanceof ApiError ? error.status : 0;
}

/** Typed `code` of a failed circles call's JSON body (e.g. `CHILD_CONSENT_PENDING`), if any. */
export function circleErrorCode(error: unknown): string | null {
  if (!(error instanceof ApiError)) return null;
  const body = error.body;
  if (body && typeof body === "object" && "code" in body) {
    const code = (body as { code?: unknown }).code;
    return typeof code === "string" ? code : null;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Circles & membership
// ---------------------------------------------------------------------------

export async function listCircles(token: CircleToken): Promise<CircleSummary[]> {
  const res = await gen.circlesControllerList(auth(token));
  return as<CircleSummary[]>(res?.items ?? []);
}

export async function createCircle(
  token: CircleToken,
  input: CreateCircleInput,
): Promise<CircleDetail> {
  return as(await gen.circlesControllerCreate(as<CreateCircleDto>(input), auth(token)));
}

export async function getCircle(token: CircleToken, circleId: string): Promise<CircleDetail> {
  return as(await gen.circlesControllerDetail(circleId, auth(token)));
}

export async function updateCircle(
  token: CircleToken,
  circleId: string,
  input: UpdateCircleInput,
): Promise<CircleDetail> {
  return as(await gen.circlesControllerUpdate(circleId, as<UpdateCircleDto>(input), auth(token)));
}

export async function deleteCircle(token: CircleToken, circleId: string): Promise<void> {
  await gen.circlesControllerRemove(circleId, auth(token));
}

export async function updateMyMembership(
  token: CircleToken,
  circleId: string,
  input: UpdateMyMembershipInput,
): Promise<CircleDetail> {
  return as(
    await gen.circlesControllerUpdateMe(circleId, as<UpdateMyMembershipDto>(input), auth(token)),
  );
}

export async function leaveCircle(token: CircleToken, circleId: string): Promise<void> {
  await gen.circlesControllerLeave(circleId, auth(token));
}

export async function updateMemberRole(
  token: CircleToken,
  circleId: string,
  memberId: string,
  role: "admin" | "parent" | "member",
): Promise<CircleDetail> {
  return as(
    await gen.circlesControllerUpdateRole(
      circleId,
      memberId,
      as<UpdateMemberRoleDto>({ role }),
      auth(token),
    ),
  );
}

export async function removeMember(
  token: CircleToken,
  circleId: string,
  memberId: string,
): Promise<void> {
  await gen.circlesControllerRemoveMember(circleId, memberId, auth(token));
}

// ---------------------------------------------------------------------------
// Invites
// ---------------------------------------------------------------------------

export async function createInvite(
  token: CircleToken,
  circleId: string,
  input: CreateInviteInput = {},
): Promise<InviteCreated> {
  return as(
    await gen.circlesControllerCreateInvite(circleId, as<CreateInviteDto>(input), auth(token)),
  );
}

export async function listInvites(token: CircleToken, circleId: string): Promise<Invite[]> {
  const res = await gen.circlesControllerListInvites(circleId, auth(token));
  return as<Invite[]>(res?.items ?? []);
}

export async function revokeInvite(
  token: CircleToken,
  circleId: string,
  inviteId: string,
): Promise<void> {
  await gen.circlesControllerRevokeInvite(circleId, inviteId, auth(token));
}

export async function previewInvite(token: CircleToken, code: string): Promise<InvitePreview> {
  return as(await gen.circlesControllerPreviewInvite(encodeURIComponent(code), auth(token)));
}

export async function joinCircle(
  token: CircleToken,
  input: JoinCircleInput,
): Promise<CircleDetail> {
  return as(await gen.circlesControllerJoin(as<JoinCircleDto>(input), auth(token)));
}

// ---------------------------------------------------------------------------
// Child profiles (D7) — parent side
// ---------------------------------------------------------------------------

export async function listChildren(token: CircleToken, circleId: string): Promise<ChildProfile[]> {
  return as((await gen.circleChildrenControllerList(circleId, auth(token))) ?? []);
}

export async function createChild(
  token: CircleToken,
  circleId: string,
  input: CreateChildInput,
): Promise<ChildProfile> {
  return as(
    await gen.circleChildrenControllerCreate(
      circleId,
      as<CreateChildProfileDto>(input),
      auth(token),
    ),
  );
}

export async function updateChild(
  token: CircleToken,
  circleId: string,
  childId: string,
  input: UpdateChildInput,
): Promise<ChildProfile> {
  return as(
    await gen.circleChildrenControllerUpdate(
      circleId,
      childId,
      as<UpdateChildProfileDto>(input),
      auth(token),
    ),
  );
}

export async function deleteChild(
  token: CircleToken,
  circleId: string,
  childId: string,
): Promise<void> {
  await gen.circleChildrenControllerRemove(circleId, childId, auth(token));
}

export async function createChildDeviceLink(
  token: CircleToken,
  circleId: string,
  childId: string,
): Promise<ChildDeviceLink> {
  return as(await gen.circleChildrenControllerDeviceLink(circleId, childId, auth(token)));
}

export async function revokeChildDevice(
  token: CircleToken,
  circleId: string,
  childId: string,
): Promise<void> {
  await gen.circleChildrenControllerRevokeDevice(circleId, childId, auth(token));
}

/** Signed-in young person converts their child profile into an adult membership. */
export async function graduateChild(
  token: CircleToken,
  input: GraduateChildInput,
): Promise<CircleSummary> {
  return as(
    await gen.circleChildSessionControllerGraduate(as<GraduateChildDto>(input), auth(token)),
  );
}

/** D34: re-confirm parental consent for a transferred child profile. */
export async function confirmChildConsent(
  token: CircleToken,
  circleId: string,
  childId: string,
  consentPolicyVersion: string,
): Promise<ChildProfile> {
  return as(
    await gen.circleChildrenControllerConfirmConsent(
      circleId,
      childId,
      { parentalConsent: true, consentPolicyVersion },
      auth(token),
    ),
  );
}

// ---------------------------------------------------------------------------
// Child device (scoped child session)
// ---------------------------------------------------------------------------

/** Exchange the one-time QR token (`mtl_…`) for a scoped child session. No auth. */
export async function redeemChildLink(linkToken: string): Promise<ChildSession> {
  return as(await gen.circleChildSessionControllerRedeem({ linkToken }, { skipAuthRefresh: true }));
}

export async function getChildMe(childToken: string): Promise<ChildProfile> {
  return as(await gen.circleChildSessionControllerMe(child(childToken)));
}

export async function listChildSignals(
  childToken: string,
  circleId: string,
  from: string,
  to: string,
): Promise<CircleSignal[]> {
  const res = await gen.circleSignalsControllerList(circleId, { from, to }, child(childToken));
  return as<CircleSignal[]>(res?.items ?? []);
}

export async function putChildFardStatus(
  childToken: string,
  circleId: string,
  input: FardStatusInput,
): Promise<CircleSignal> {
  return as(await gen.circleSignalsControllerPutFardStatus(circleId, input, child(childToken)));
}

// ---------------------------------------------------------------------------
// Signals & nudges — account side
// ---------------------------------------------------------------------------

export async function listSignals(
  token: CircleToken,
  circleId: string,
  from: string,
  to: string,
): Promise<CircleSignal[]> {
  const res = await gen.circleSignalsControllerList(circleId, { from, to }, auth(token));
  return as<CircleSignal[]>(res?.items ?? []);
}

export async function putFardStatus(
  token: CircleToken,
  circleId: string,
  input: FardStatusInput,
): Promise<CircleSignal> {
  return as(await gen.circleSignalsControllerPutFardStatus(circleId, input, auth(token)));
}

export async function putRestDay(
  token: CircleToken,
  circleId: string,
  input: { date: string; memberId?: string },
): Promise<CircleSignal> {
  return as(await gen.circleSignalsControllerPutRestDay(circleId, input, auth(token)));
}

export async function putGoalDone(
  token: CircleToken,
  circleId: string,
  date: string,
): Promise<CircleSignal> {
  return as(await gen.circleSignalsControllerPutGoalDone(circleId, { date }, auth(token)));
}

export async function clearSignal(
  token: CircleToken,
  circleId: string,
  kind: CircleSignalKind,
  date: string,
  memberId?: string,
): Promise<void> {
  await gen.circleSignalsControllerClear(
    circleId,
    kind,
    date,
    memberId ? { memberId } : undefined,
    auth(token),
  );
}

export async function sendNudge(
  token: CircleToken,
  circleId: string,
  toMemberId: string,
  kind: CircleNudgeKind,
): Promise<Nudge> {
  return as(await gen.circleSignalsControllerNudge(circleId, { toMemberId, kind }, auth(token)));
}

export async function listNudges(token: CircleToken, circleId: string): Promise<Nudge[]> {
  const res = await gen.circleSignalsControllerNudges(circleId, auth(token));
  return as<Nudge[]>(res?.items ?? []);
}

// ---------------------------------------------------------------------------
// Group khatm (NF-3.18)
// ---------------------------------------------------------------------------

export async function createKhatm(
  token: CircleToken,
  circleId: string,
  input: CreateKhatmInput,
): Promise<KhatmDetail> {
  return as(await gen.groupKhatmControllerCreate(circleId, as<CreateKhatmDto>(input), auth(token)));
}

export async function listKhatms(token: CircleToken, circleId: string): Promise<Khatm[]> {
  const res = await gen.groupKhatmControllerList(circleId, auth(token));
  return as<Khatm[]>(res?.items ?? []);
}

export async function getKhatm(
  token: CircleToken,
  circleId: string,
  khatmId: string,
): Promise<KhatmDetail> {
  return as(await gen.groupKhatmControllerDetail(circleId, khatmId, auth(token)));
}

export async function updateKhatm(
  token: CircleToken,
  circleId: string,
  khatmId: string,
  input: UpdateKhatmInput,
): Promise<KhatmDetail> {
  return as(
    await gen.groupKhatmControllerUpdate(circleId, khatmId, as<UpdateKhatmDto>(input), auth(token)),
  );
}

export async function deleteKhatm(
  token: CircleToken,
  circleId: string,
  khatmId: string,
): Promise<void> {
  await gen.groupKhatmControllerRemove(circleId, khatmId, auth(token));
}

export async function startKhatmRound(
  token: CircleToken,
  circleId: string,
  khatmId: string,
): Promise<KhatmDetail> {
  return as(await gen.groupKhatmControllerNextRound(circleId, khatmId, auth(token)));
}

/** Round-robin "Deal remaining parts" (managers): `POST …/khatms/:khatmId/deal`. */
export async function dealKhatmParts(
  token: CircleToken,
  circleId: string,
  khatmId: string,
): Promise<KhatmDetail> {
  return as(await gen.groupKhatmControllerDeal(circleId, khatmId, auth(token)));
}

const PART_ACTIONS = {
  claim: gen.groupKhatmControllerClaim,
  release: gen.groupKhatmControllerRelease,
  reading: gen.groupKhatmControllerReading,
  complete: gen.groupKhatmControllerComplete,
} as const;

export async function transitionKhatmPart(
  token: CircleToken,
  circleId: string,
  khatmId: string,
  partNo: number,
  action: KhatmPartAction,
): Promise<KhatmDetail> {
  return as(await PART_ACTIONS[action](circleId, khatmId, partNo, auth(token)));
}

export async function assignKhatmPart(
  token: CircleToken,
  circleId: string,
  khatmId: string,
  partNo: number,
  memberId: string | null,
): Promise<KhatmDetail> {
  return as(
    await gen.groupKhatmControllerAssign(
      circleId,
      khatmId,
      partNo,
      as<AssignKhatmPartDto>({ memberId }),
      auth(token),
    ),
  );
}

// ---------------------------------------------------------------------------
// Nearby join (NF-3.25, D41–D44)
// ---------------------------------------------------------------------------

export type NearbySession = {
  sessionId: string;
  /** 128-bit BLE service UUID the host's phone advertises (app prefix + sessionId). */
  serviceUuid: string;
  /** 4 digits shown large on the host's screen (D44). */
  matchCode: string;
  purpose: NearbyPurpose;
  role: CircleRole;
  expiresAt: string;
};

export type CreateNearbySessionInput = { role?: "parent" | "member"; childId?: string };

export type NearbyRequest = {
  id: string;
  displayName: string | null;
  /** `device` = a child's device (no account). */
  requester: "account" | "guest" | "device";
  status: NearbyRequestStatus;
  createdAt: string;
};

export type NearbyRequestList = { items: NearbyRequest[]; active: boolean; expiresAt: string };

export type NearbySessionPreview = {
  circleType: CircleType;
  circleName: string;
  memberCount: number;
  matchCode: string;
  purpose: NearbyPurpose;
  needsAccount: boolean;
  expiresAt: string;
};

export type NearbyRequestCreated = {
  requestId: string;
  /** One-time poll secret (`mtn_…`) — only ever kept in memory. */
  requestToken: string;
  status: NearbyRequestStatus;
  expiresAt: string;
};

export type NearbyRequestState = {
  status: NearbyJoinerStatus;
  circleType: CircleType;
  circleId: string | null;
  /** Child-device link: the scoped child session, returned exactly once. */
  childToken?: string;
  child?: ChildProfile;
};

/** Host: open a 10-minute nearby session (same role rules as invites; `childId` links a device). */
export async function createNearbySession(
  token: CircleToken,
  circleId: string,
  input: CreateNearbySessionInput = {},
): Promise<NearbySession> {
  return as(
    await gen.circleNearbyHostControllerCreate(
      circleId,
      as<CreateNearbySessionDto>(input),
      auth(token),
    ),
  );
}

/** Host: end the session (screen closed / app backgrounded). */
export async function endNearbySession(
  token: CircleToken,
  circleId: string,
  sessionId: string,
): Promise<void> {
  await gen.circleNearbyHostControllerEnd(circleId, sessionId, auth(token));
}

export async function listNearbyRequests(
  token: CircleToken,
  circleId: string,
  sessionId: string,
): Promise<NearbyRequestList> {
  return as(await gen.circleNearbyHostControllerRequests(circleId, sessionId, auth(token)));
}

export async function decideNearbyRequest(
  token: CircleToken,
  circleId: string,
  sessionId: string,
  requestId: string,
  decision: "accept" | "decline",
): Promise<NearbyRequest> {
  const call =
    decision === "accept"
      ? gen.circleNearbyHostControllerAccept
      : gen.circleNearbyHostControllerDecline;
  return as(await call(circleId, sessionId, requestId, auth(token)));
}

/** Joiner: preview a discovered beacon (no auth; rate-limited per client). */
export async function previewNearbySession(sessionId: string): Promise<NearbySessionPreview> {
  return as(await gen.circleNearbyJoinControllerPreview(sessionId, { skipAuthRefresh: true }));
}

/**
 * Joiner: ask to join after confirming the digits. Pass the account `token` for
 * a member session; `null` asks anonymously (a child's device — no account).
 */
export async function requestNearbyJoin(
  token: CircleToken | null,
  sessionId: string,
  input: { matchCode: string; displayName?: string },
): Promise<NearbyRequestCreated> {
  const options = token === null ? { skipAuthRefresh: true } : auth(token);
  return as(
    await gen.circleNearbyJoinControllerRequest(
      sessionId,
      as<CreateNearbyRequestDto>(input),
      options,
    ),
  );
}

export async function nearbyRequestStatus(
  sessionId: string,
  requestId: string,
  requestToken: string,
): Promise<NearbyRequestState> {
  return as(
    await gen.circleNearbyJoinControllerStatus(
      sessionId,
      requestId,
      { requestToken },
      { skipAuthRefresh: true },
    ),
  );
}

export async function cancelNearbyRequest(
  sessionId: string,
  requestId: string,
  requestToken: string,
): Promise<void> {
  await gen.circleNearbyJoinControllerCancel(
    sessionId,
    requestId,
    { requestToken },
    { skipAuthRefresh: true },
  );
}
