import { randomUUID } from "node:crypto";
import { CHILD_CONSENT_PENDING_CODE, type CircleRole } from "@munib-tracker/shared/circles";
import {
  canOfferNearby,
  isValidNearbySessionId,
  NEARBY_ERROR_CODES,
  NEARBY_LIMITS,
  type NearbyJoinerStatus,
  type NearbyPurpose,
  nearbyNeedsLinkedAccount,
  nearbyServiceUuid,
} from "@munib-tracker/shared/circles/nearby";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  GoneException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { DataSource, type EntityManager, IsNull, MoreThan, Not } from "typeorm";
import { isRateLimited } from "../common/durable-rate-limit";
import {
  ChildProfileEntity,
  CircleEntity,
  CircleMemberEntity,
  CircleNearbyRequestEntity,
  CircleNearbySessionEntity,
} from "../database/entities";
import { toChildDto } from "./child-profiles.service";
import {
  CircleAccessService,
  type MembershipContext,
  requireLinkedAccount,
  requireUserActor,
} from "./circle-access.service";
import type { CircleActor } from "./circle-auth";
import { canInviteRole, isParentRole } from "./circle-policy";
import {
  generateChildSessionToken,
  generateNearbyRequestToken,
  generateNearbySessionId,
  nearbyMatchCode,
  sha256Hex,
} from "./circle-tokens";
import { CirclesService } from "./circles.service";
import type {
  CreateNearbyRequestDto,
  CreateNearbySessionDto,
  NearbyRequestCreatedDto,
  NearbyRequestDto,
  NearbyRequestListDto,
  NearbyRequestStatusDto,
  NearbySessionDto,
  NearbySessionPreviewDto,
} from "./dto/nearby.dto";

const MINUTE_MS = 60_000;
const DAY_MS = 86_400_000;
const WINDOW_15_MIN = 15 * MINUTE_MS;

type UserActor = Extract<CircleActor, { kind: "user" }>;

function purposeOf(session: Pick<CircleNearbySessionEntity, "childId">): NearbyPurpose {
  return session.childId ? "child_link" : "member";
}

/** Parent invites and child-device links are single-use (D43: same rules as invites / QR). */
function isSingleUse(session: Pick<CircleNearbySessionEntity, "role">): boolean {
  return session.role === "parent" || session.role === "child";
}

export function isNearbySessionLive(
  session: Pick<CircleNearbySessionEntity, "expiresAt" | "endedAt" | "consumedAt">,
  now: Date = new Date(),
): boolean {
  return !session.endedAt && !session.consumedAt && session.expiresAt.getTime() > now.getTime();
}

/**
 * NF-3.25 "Nearby join" (D41–D44).
 *
 * The host opens a short-lived session (10 min) whose opaque id their phone
 * advertises over Bluetooth LE while the invite screen is open. A nearby phone
 * previews it (circle name, type, member count and the 4-digit match code),
 * the joiner confirms the digits match the host's screen and sends a request,
 * and the host accepts or declines each one (nothing auto-joins). Accepting
 * runs the same membership creation as an invite join (`admitMember`: caps,
 * linked-account rule) or, for a child-device link, issues the scoped child
 * session exactly like the QR redeem. Requests are claimed with conditional
 * UPDATEs (single decision, single pick-up). Nothing user-written, no IP and
 * no id is logged.
 */
@Injectable()
export class CircleNearbyService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly access: CircleAccessService,
    private readonly circles: CirclesService,
  ) {}

  // -------------------------------------------------------------------------
  // Host
  // -------------------------------------------------------------------------

  async createSession(
    actor: CircleActor,
    circleId: string,
    dto: CreateNearbySessionDto,
  ): Promise<NearbySessionDto> {
    const user = requireUserActor(actor);
    const { circle, member } = await this.access.requireMembership(user, circleId);
    let role: CircleRole;
    let childId: string | null = null;
    if (dto.childId) {
      if (circle.type !== "family") {
        throw new BadRequestException("Child devices link to family circles");
      }
      if (!isParentRole(member.role)) {
        throw new ForbiddenException("Only parents can link a child's device");
      }
      const child = await this.requireLinkableChild(circleId, dto.childId);
      role = "child";
      childId = child.id;
    } else {
      role = dto.role ?? "member";
      if (!canOfferNearby(circle.type, role) || !canInviteRole(circle.type, member.role, role)) {
        throw new ForbiddenException("You can't invite with this role");
      }
    }

    const sessions = this.dataSource.getRepository(CircleNearbySessionEntity);
    const recent = await sessions.count({
      where: { createdBy: user.userId, createdAt: MoreThan(new Date(Date.now() - DAY_MS)) },
    });
    if (recent >= NEARBY_LIMITS.sessionsPerUserPerDay) {
      throw new HttpException("Too many nearby sessions today", HttpStatus.TOO_MANY_REQUESTS);
    }

    const now = new Date();
    // One live session per host per circle: reopening the screen ends the old one.
    await sessions.update(
      { circleId, createdBy: user.userId, endedAt: IsNull() },
      { endedAt: now },
    );
    const session = await sessions.save(
      sessions.create({
        id: generateNearbySessionId(),
        circleId,
        createdBy: user.userId,
        role,
        childId,
        expiresAt: new Date(now.getTime() + NEARBY_LIMITS.sessionTtlMinutes * MINUTE_MS),
        endedAt: null,
        consumedAt: null,
      }),
    );
    return {
      sessionId: session.id,
      serviceUuid: nearbyServiceUuid(session.id),
      matchCode: nearbyMatchCode(session.id),
      purpose: purposeOf(session),
      role: session.role,
      expiresAt: session.expiresAt.toISOString(),
    };
  }

  /** Host closed the screen / backgrounded the app: stop accepting requests. Idempotent. */
  async endSession(actor: CircleActor, circleId: string, sessionId: string): Promise<void> {
    const { session } = await this.requireHostSession(actor, circleId, sessionId);
    if (session.endedAt) return;
    await this.dataSource
      .getRepository(CircleNearbySessionEntity)
      .update({ id: session.id, endedAt: IsNull() }, { endedAt: new Date() });
  }

  async listRequests(
    actor: CircleActor,
    circleId: string,
    sessionId: string,
  ): Promise<NearbyRequestListDto> {
    const { session } = await this.requireHostSession(actor, circleId, sessionId);
    const rows = await this.dataSource.getRepository(CircleNearbyRequestEntity).find({
      where: { sessionId: session.id, status: Not("cancelled") },
      order: { createdAt: "ASC" },
    });
    return {
      items: rows.map(toRequestDto),
      active: isNearbySessionLive(session),
      expiresAt: session.expiresAt.toISOString(),
    };
  }

  async decide(
    actor: CircleActor,
    circleId: string,
    sessionId: string,
    requestId: string,
    decision: "accept" | "decline",
  ): Promise<NearbyRequestDto> {
    const { context, session } = await this.requireHostSession(actor, circleId, sessionId);
    const requests = this.dataSource.getRepository(CircleNearbyRequestEntity);
    const request = await requests.findOne({ where: { id: requestId, sessionId: session.id } });
    if (!request) throw new NotFoundException("Request not found");
    if (request.status !== "pending") {
      throw new ConflictException("This request was already answered");
    }

    if (decision === "decline") {
      await this.claimRequest(this.dataSource.manager, request.id, "declined");
      return toRequestDto({ ...request, status: "declined" });
    }

    if (!isNearbySessionLive(session)) {
      throw new GoneException("This nearby session has ended");
    }
    const { circle, member } = context;
    if (session.childId) {
      if (!isParentRole(member.role)) {
        throw new ForbiddenException("Only parents can link a child's device");
      }
      await this.requireLinkableChild(circleId, session.childId);
      await this.dataSource.transaction(async (manager) => {
        await this.consumeSession(manager, session);
        await this.claimRequest(manager, request.id, "accepted");
      });
      return toRequestDto({ ...request, status: "accepted" });
    }

    // Permission is re-checked at decision time (a demoted host can't admit).
    if (!canInviteRole(circle.type, member.role, session.role)) {
      throw new ForbiddenException("You can't invite with this role");
    }
    if (!request.requesterId || !request.requesterAccountType) {
      throw new NotFoundException("Request not found");
    }
    const requester: UserActor = {
      kind: "user",
      userId: request.requesterId,
      accountType: request.requesterAccountType,
    };
    const admitted = await this.circles.admitMember(
      circle,
      requester,
      session.role,
      request.displayName,
      async (manager) => {
        if (isSingleUse(session)) await this.consumeSession(manager, session);
        await this.claimRequest(manager, request.id, "accepted");
      },
    );
    // Already an active member: nothing to create, but the joiner still sees "accepted".
    if (!admitted) await this.claimRequest(this.dataSource.manager, request.id, "accepted");
    return toRequestDto({ ...request, status: "accepted" });
  }

  // -------------------------------------------------------------------------
  // Joiner
  // -------------------------------------------------------------------------

  /** What a nearby phone shows after discovering the beacon (rate-limited per client IP). */
  async preview(sessionId: string, clientIp: string): Promise<NearbySessionPreviewDto> {
    await throttle(
      `circles:nearby-lookup:${clientIp}`,
      NEARBY_LIMITS.lookupsPerIpPer15Min,
      WINDOW_15_MIN,
    );
    const { session, circle } = await this.requireLiveSession(sessionId);
    const purpose = purposeOf(session);
    return {
      circleType: circle.type,
      circleName: circle.name ?? "",
      memberCount: await this.circles.memberCount(circle.id),
      matchCode: nearbyMatchCode(session.id),
      purpose,
      needsAccount: nearbyNeedsLinkedAccount(circle.type, purpose),
      expiresAt: session.expiresAt.toISOString(),
    };
  }

  /**
   * Joiner confirmed the 4 digits match (D44) and asks to join. Account
   * sessions are required for `member` sessions (guests only for khatm); a
   * child device asks without one (D7: no email, no password).
   */
  async createRequest(
    actor: CircleActor | undefined,
    sessionId: string,
    dto: CreateNearbyRequestDto,
    clientIp: string,
  ): Promise<NearbyRequestCreatedDto> {
    await throttle(
      `circles:nearby-request:${clientIp}`,
      NEARBY_LIMITS.requestsPerIpPer15Min,
      WINDOW_15_MIN,
    );
    const { session, circle } = await this.requireLiveSession(sessionId);
    if (dto.matchCode !== nearbyMatchCode(session.id)) {
      throw new ConflictException({
        message: "The digits don't match this session",
        code: NEARBY_ERROR_CODES.matchMismatch,
      });
    }

    const requests = this.dataSource.getRepository(CircleNearbyRequestEntity);
    let requester: UserActor | null = null;
    if (purposeOf(session) === "member") {
      if (!actor) throw new UnauthorizedException("Missing session");
      requester = requireUserActor(actor);
      if (nearbyNeedsLinkedAccount(circle.type, "member")) requireLinkedAccount(requester);
      const existing = await this.dataSource.getRepository(CircleMemberEntity).findOne({
        where: { circleId: circle.id, memberId: requester.userId, leftAt: IsNull() },
      });
      if (existing) {
        throw new ConflictException({
          message: "Already a member",
          code: NEARBY_ERROR_CODES.alreadyMember,
        });
      }
      // Asking again replaces this joiner's earlier pending request.
      await requests.update(
        { sessionId: session.id, requesterId: requester.userId, status: "pending" },
        { status: "cancelled", decidedAt: new Date() },
      );
    }

    const pending = await requests.count({ where: { sessionId: session.id, status: "pending" } });
    if (pending >= NEARBY_LIMITS.maxPendingPerSession) {
      throw new HttpException(
        { message: "Too many people are asking right now", code: NEARBY_ERROR_CODES.sessionFull },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const requestToken = generateNearbyRequestToken();
    const saved = await requests.save(
      requests.create({
        id: randomUUID(),
        sessionId: session.id,
        requesterId: requester?.userId ?? null,
        requesterAccountType: requester?.accountType ?? null,
        displayName: dto.displayName ?? null,
        tokenHash: sha256Hex(requestToken),
        status: "pending",
        decidedAt: null,
      }),
    );
    return {
      requestId: saved.id,
      requestToken,
      status: "pending",
      expiresAt: session.expiresAt.toISOString(),
    };
  }

  /**
   * Joiner polls with its one-time secret. A child-device link is completed
   * here: the accepted request is consumed with a conditional UPDATE and the
   * scoped child session is minted and returned exactly once.
   */
  async status(
    sessionId: string,
    requestId: string,
    requestToken: string,
  ): Promise<NearbyRequestStatusDto> {
    await throttle(
      `circles:nearby-poll:${requestId}`,
      NEARBY_LIMITS.pollsPerRequestPer15Min,
      WINDOW_15_MIN,
    );
    const { request, session } = await this.requireJoinerRequest(
      sessionId,
      requestId,
      requestToken,
    );
    const circle = await this.dataSource
      .getRepository(CircleEntity)
      .findOne({ where: { id: session.circleId, deletedAt: IsNull() } });
    if (!circle) return { status: "expired", circleType: "family", circleId: null };
    const base = { circleType: circle.type, circleId: null };

    let status: NearbyJoinerStatus = request.status;
    if (status === "pending" && !isNearbySessionLive(session)) status = "expired";
    if (status === "accepted" && !session.childId) {
      return { ...base, status, circleId: circle.id };
    }
    if (status === "accepted" && session.childId) {
      return this.pickUpChildSession(request, session, circle.type);
    }
    return { ...base, status };
  }

  /** Joiner closed the sheet before a decision. Idempotent. */
  async cancel(sessionId: string, requestId: string, requestToken: string): Promise<void> {
    const { request } = await this.requireJoinerRequest(sessionId, requestId, requestToken);
    await this.dataSource
      .getRepository(CircleNearbyRequestEntity)
      .update(
        { id: request.id, status: "pending" },
        { status: "cancelled", decidedAt: new Date() },
      );
  }

  // -------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------

  private async pickUpChildSession(
    request: CircleNearbyRequestEntity,
    session: CircleNearbySessionEntity,
    circleType: NearbyRequestStatusDto["circleType"],
  ): Promise<NearbyRequestStatusDto> {
    const base = { circleType, circleId: null };
    const decidedAt = request.decidedAt?.getTime() ?? 0;
    if (Date.now() - decidedAt > NEARBY_LIMITS.childPickupMinutes * MINUTE_MS) {
      return { ...base, status: "expired" };
    }
    const children = this.dataSource.getRepository(ChildProfileEntity);
    const child = await children.findOne({
      where: { id: session.childId as string, circleId: session.circleId },
    });
    if (!child || child.consentTransferredAt) return { ...base, status: "expired" };

    const childToken = generateChildSessionToken();
    const picked = await this.dataSource.transaction(async (manager) => {
      const claimed = await manager
        .createQueryBuilder()
        .update(CircleNearbyRequestEntity)
        .set({ status: "completed" })
        .where("id = :id", { id: request.id })
        .andWhere(`"status" = 'accepted'`)
        .execute();
      if ((claimed.affected ?? 0) !== 1) return false;
      // Same effect as redeeming the QR: one linked device per child, re-linking replaces it.
      await manager.update(
        ChildProfileEntity,
        { id: child.id },
        {
          deviceTokenHash: sha256Hex(childToken),
          linkedDeviceAt: new Date(),
          linkTokenHash: null,
          linkTokenExpiresAt: null,
        },
      );
      return true;
    });
    if (!picked) return { ...base, status: "completed" };
    const fresh = await children.findOneByOrFail({ id: child.id });
    return { ...base, status: "completed", childToken, child: toChildDto(fresh) };
  }

  private async requireHostSession(
    actor: CircleActor,
    circleId: string,
    sessionId: string,
  ): Promise<{ context: MembershipContext; session: CircleNearbySessionEntity }> {
    const user = requireUserActor(actor);
    const context = await this.access.requireMembership(user, circleId);
    const session = isValidNearbySessionId(sessionId)
      ? await this.dataSource.getRepository(CircleNearbySessionEntity).findOne({
          where: { id: sessionId, circleId, createdBy: user.userId },
        })
      : null;
    if (!session) throw new NotFoundException("Nearby session not found");
    return { context, session };
  }

  private async requireLiveSession(sessionId: string) {
    const session = isValidNearbySessionId(sessionId)
      ? await this.dataSource
          .getRepository(CircleNearbySessionEntity)
          .findOne({ where: { id: sessionId } })
      : null;
    const circle = session
      ? await this.dataSource
          .getRepository(CircleEntity)
          .findOne({ where: { id: session.circleId, deletedAt: IsNull() } })
      : null;
    if (!session || !circle) throw new NotFoundException("Nearby session not found");
    if (!isNearbySessionLive(session)) throw new GoneException("This nearby session has ended");
    return { session, circle };
  }

  private async requireJoinerRequest(sessionId: string, requestId: string, requestToken: string) {
    const request = isValidNearbySessionId(sessionId)
      ? await this.dataSource.getRepository(CircleNearbyRequestEntity).findOne({
          where: { id: requestId, sessionId, tokenHash: sha256Hex(requestToken) },
        })
      : null;
    const session = request
      ? await this.dataSource
          .getRepository(CircleNearbySessionEntity)
          .findOne({ where: { id: request.sessionId } })
      : null;
    if (!request || !session) throw new NotFoundException("Request not found");
    return { request, session };
  }

  private async requireLinkableChild(
    circleId: string,
    childId: string,
  ): Promise<ChildProfileEntity> {
    const child = await this.dataSource
      .getRepository(ChildProfileEntity)
      .findOne({ where: { id: childId, circleId } });
    if (!child) throw new NotFoundException("Child profile not found");
    if (child.consentTransferredAt) {
      throw new ForbiddenException({
        message: "Re-confirm parental consent for this child first",
        code: CHILD_CONSENT_PENDING_CODE,
      });
    }
    return child;
  }

  /** Conditional: a single-use session is consumed by exactly one accept. */
  private async consumeSession(
    manager: EntityManager,
    session: CircleNearbySessionEntity,
  ): Promise<void> {
    const now = new Date();
    const consumed = await manager
      .createQueryBuilder()
      .update(CircleNearbySessionEntity)
      .set({ consumedAt: now })
      .where("id = :id", { id: session.id })
      .andWhere(`"consumedAt" IS NULL`)
      .andWhere(`"endedAt" IS NULL`)
      .andWhere(`"expiresAt" > :now`, { now })
      .execute();
    if ((consumed.affected ?? 0) !== 1) {
      throw new GoneException("This nearby session was already used");
    }
  }

  /** Conditional: a request is answered exactly once. */
  private async claimRequest(
    manager: EntityManager,
    requestId: string,
    status: "accepted" | "declined",
  ): Promise<void> {
    const claimed = await manager
      .createQueryBuilder()
      .update(CircleNearbyRequestEntity)
      .set({ status, decidedAt: new Date() })
      .where("id = :id", { id: requestId })
      .andWhere(`"status" = 'pending'`)
      .execute();
    if ((claimed.affected ?? 0) !== 1) {
      throw new ConflictException("This request was already answered");
    }
  }
}

async function throttle(key: string, limit: number, windowMs: number): Promise<void> {
  if (await isRateLimited({ key, limit, windowMs })) {
    throw new HttpException("Too many attempts", HttpStatus.TOO_MANY_REQUESTS);
  }
}

function toRequestDto(request: CircleNearbyRequestEntity): NearbyRequestDto {
  return {
    id: request.id,
    displayName: request.displayName ?? null,
    requester: !request.requesterId
      ? "device"
      : request.requesterAccountType === "guest"
        ? "guest"
        : "account",
    status: request.status,
    createdAt: request.createdAt.toISOString(),
  };
}
