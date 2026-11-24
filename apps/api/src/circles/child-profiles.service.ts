import { randomUUID } from "node:crypto";
import {
  CHILD_CONSENT_PENDING_CODE,
  CIRCLE_LIMITS,
  childAgeBand,
  isGraduationAge,
  isValidChildBirthYear,
} from "@munib-tracker/shared/circles";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  GoneException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { DataSource } from "typeorm";
import { isRateLimited } from "../common/durable-rate-limit";
import { ChildProfileEntity, CircleMemberEntity } from "../database/entities";
import {
  CircleAccessService,
  type MembershipContext,
  requireLinkedAccount,
  requireUserActor,
} from "./circle-access.service";
import { type CircleActor, CircleActorService } from "./circle-auth";
import { deleteChildProfileData } from "./circle-lifecycle";
import { isParentRole } from "./circle-policy";
import { generateChildLinkToken, generateChildSessionToken, sha256Hex } from "./circle-tokens";
import { CirclesService } from "./circles.service";
import type {
  ChildDeviceLinkDto,
  ChildProfileDto,
  ChildSessionDto,
  CircleSummaryDto,
  ConfirmChildConsentDto,
  CreateChildProfileDto,
  GraduateChildDto,
  UpdateChildProfileDto,
} from "./dto/circles.dto";

/** Child-link redemption attempts per IP per 15 min. */
const REDEEM_LIMIT = 20;
const REDEEM_WINDOW_MS = 15 * 60_000;

/**
 * Parent-managed child profiles (D7): nickname + birth year only; consent is
 * recorded server-side; the child's device is linked by a one-time QR token
 * and then holds a scoped child-session bearer. Deletion is immediate.
 */
@Injectable()
export class ChildProfilesService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly access: CircleAccessService,
    private readonly actors: CircleActorService,
    private readonly circles: CirclesService,
  ) {}

  async create(
    actor: CircleActor,
    circleId: string,
    dto: CreateChildProfileDto,
  ): Promise<ChildProfileDto> {
    const user = requireUserActor(actor);
    requireLinkedAccount(user);
    const context = await this.requireParent(user, circleId);
    if (!isValidChildBirthYear(dto.birthYear)) {
      throw new BadRequestException(
        "Child profiles are for children under 13 — older children join with their own account",
      );
    }
    const existing = await this.dataSource
      .getRepository(ChildProfileEntity)
      .count({ where: { circleId } });
    if (existing >= CIRCLE_LIMITS.familyMaxChildren) {
      throw new ConflictException("Too many child profiles");
    }

    const childId = randomUUID();
    const now = new Date();
    await this.dataSource.transaction(async (manager) => {
      await manager.save(
        manager.create(ChildProfileEntity, {
          id: childId,
          circleId: context.circle.id,
          createdBy: user.userId,
          nickname: dto.nickname,
          birthYear: dto.birthYear,
          avatar: dto.avatar ?? null,
          reward: null,
          graduationUnlocked: false,
          consentedAt: now,
          consentPolicyVersion: dto.consentPolicyVersion,
        }),
      );
      await manager.save(
        manager.create(CircleMemberEntity, {
          circleId,
          memberId: childId,
          memberKind: "child",
          role: "child",
          displayName: null,
          shareScope: {},
        }),
      );
    });
    return toChildDto(await this.findChild(circleId, childId));
  }

  async list(actor: CircleActor, circleId: string): Promise<ChildProfileDto[]> {
    await this.requireParent(requireUserActor(actor), circleId);
    const rows = await this.dataSource
      .getRepository(ChildProfileEntity)
      .find({ where: { circleId }, order: { createdAt: "ASC" } });
    return rows.map(toChildDto);
  }

  async update(
    actor: CircleActor,
    circleId: string,
    childId: string,
    dto: UpdateChildProfileDto,
  ): Promise<ChildProfileDto> {
    await this.requireParent(requireUserActor(actor), circleId);
    const child = await this.findChild(circleId, childId);
    requireConsent(child);
    if (dto.birthYear !== undefined && !isValidChildBirthYear(dto.birthYear)) {
      throw new BadRequestException("Invalid birth year for a child profile");
    }
    await this.dataSource.getRepository(ChildProfileEntity).update(
      { id: childId },
      {
        nickname: dto.nickname ?? child.nickname,
        birthYear: dto.birthYear ?? child.birthYear,
        avatar: dto.avatar === undefined ? child.avatar : dto.avatar,
        reward:
          dto.reward === undefined
            ? child.reward
            : dto.reward && { title: dto.reward.title, days: dto.reward.days },
        graduationUnlocked: dto.graduationUnlocked ?? child.graduationUnlocked,
      },
    );
    return toChildDto(await this.findChild(circleId, childId));
  }

  /**
   * D34: a parent re-confirms consent for a profile transferred to them when
   * the consenting parent left, was removed or demoted, or deleted their account
   * (also records a newer policy version for any profile). The confirming parent
   * becomes `createdBy`. After the 30-day window → 410 (profile deleted).
   */
  async confirmConsent(
    actor: CircleActor,
    circleId: string,
    childId: string,
    dto: ConfirmChildConsentDto,
  ): Promise<ChildProfileDto> {
    const user = requireUserActor(actor);
    requireLinkedAccount(user);
    await this.requireParent(user, circleId);
    const child = await this.findChild(circleId, childId);
    if (isConsentLapsed(child)) {
      // Past the 30-day window the profile is due for deletion (the retention
      // sweep would remove it); late consent can't revive it — delete it now.
      await this.dataSource.transaction((manager) => deleteChildProfileData(manager, child));
      throw new GoneException("This child profile expired — add the child again");
    }
    await this.dataSource.getRepository(ChildProfileEntity).update(
      { id: childId },
      {
        createdBy: user.userId,
        consentedAt: new Date(),
        consentPolicyVersion: dto.consentPolicyVersion,
        consentTransferredAt: null,
      },
    );
    return toChildDto(await this.findChild(circleId, childId));
  }

  /** Immediate hard delete (profile, membership, signals, nudges). */
  async remove(actor: CircleActor, circleId: string, childId: string): Promise<void> {
    await this.requireParent(requireUserActor(actor), circleId);
    const child = await this.findChild(circleId, childId);
    await this.dataSource.transaction((manager) => deleteChildProfileData(manager, child));
  }

  /** One-time QR token (5-min TTL). Issuing a new one invalidates the previous one. */
  async createDeviceLink(
    actor: CircleActor,
    circleId: string,
    childId: string,
  ): Promise<ChildDeviceLinkDto> {
    await this.requireParent(requireUserActor(actor), circleId);
    requireConsent(await this.findChild(circleId, childId));
    const linkToken = generateChildLinkToken();
    const expiresAt = new Date(Date.now() + CIRCLE_LIMITS.childLinkTtlMinutes * 60_000);
    await this.dataSource
      .getRepository(ChildProfileEntity)
      .update(
        { id: childId },
        { linkTokenHash: sha256Hex(linkToken), linkTokenExpiresAt: expiresAt },
      );
    return { linkToken, expiresAt: expiresAt.toISOString() };
  }

  /** Parent revokes the child's device session (and any pending link token). */
  async revokeDevice(actor: CircleActor, circleId: string, childId: string): Promise<void> {
    await this.requireParent(requireUserActor(actor), circleId);
    await this.findChild(circleId, childId);
    await this.dataSource.getRepository(ChildProfileEntity).update(
      { id: childId },
      {
        deviceTokenHash: null,
        linkedDeviceAt: null,
        linkTokenHash: null,
        linkTokenExpiresAt: null,
      },
    );
  }

  /**
   * Child device scans the QR: the one-time token is consumed atomically
   * (conditional UPDATE on the hash + expiry) and swapped for a scoped
   * child-session bearer. One linked device per child; re-linking replaces it.
   */
  async redeemDeviceLink(linkToken: string, clientIp = "unknown"): Promise<ChildSessionDto> {
    if (
      await isRateLimited({
        key: `circles:child-link:${clientIp}`,
        limit: REDEEM_LIMIT,
        windowMs: REDEEM_WINDOW_MS,
      })
    ) {
      throw new HttpException("Too many attempts", HttpStatus.TOO_MANY_REQUESTS);
    }
    const linkHash = sha256Hex(linkToken);
    const repo = this.dataSource.getRepository(ChildProfileEntity);
    const child = await repo.findOne({ where: { linkTokenHash: linkHash } });
    if (!child?.linkTokenExpiresAt || child.linkTokenExpiresAt.getTime() <= Date.now()) {
      throw new GoneException("Link code expired — ask a parent for a new one");
    }
    const childToken = generateChildSessionToken();
    const now = new Date();
    const consumed = await repo
      .createQueryBuilder()
      .update(ChildProfileEntity)
      .set({
        deviceTokenHash: sha256Hex(childToken),
        linkedDeviceAt: now,
        linkTokenHash: null,
        linkTokenExpiresAt: null,
      })
      .where("id = :id", { id: child.id })
      .andWhere(`"linkTokenHash" = :hash`, { hash: linkHash })
      .andWhere(`"linkTokenExpiresAt" > :now`, { now })
      .execute();
    if ((consumed.affected ?? 0) !== 1) {
      throw new GoneException("Link code expired — ask a parent for a new one");
    }
    return { childToken, child: toChildDto(await this.findChild(child.circleId, child.id)) };
  }

  /** `GET /circle-child/me` for a child session. */
  async me(actor: CircleActor): Promise<ChildProfileDto> {
    if (actor.kind !== "child") throw new ForbiddenException("Child session required");
    return toChildDto(await this.findChild(actor.circleId, actor.childId));
  }

  /**
   * Graduation: the young person signs in with their own account on the child
   * device and presents the child token. They join the family as an adult
   * `member`; the child profile and its signals are deleted, so the parents'
   * visibility ends unless they opt in to share `fard_status`.
   */
  async graduate(actor: CircleActor, dto: GraduateChildDto): Promise<CircleSummaryDto> {
    const user = requireUserActor(actor);
    requireLinkedAccount(user);
    const child = await this.actors.resolveChildToken(dto.childToken);
    if (!child.graduationUnlocked && !isGraduationAge(child.birthYear)) {
      throw new ForbiddenException("Graduation is offered from 13, or earlier if a parent allows");
    }
    const members = this.dataSource.getRepository(CircleMemberEntity);
    const existing = await members.findOne({
      where: { circleId: child.circleId, memberId: user.userId },
    });
    if (existing && !existing.leftAt) {
      throw new ConflictException("This account is already in the family circle");
    }
    await this.dataSource.transaction(async (manager) => {
      await deleteChildProfileData(manager, child);
      await manager.save(
        manager.create(CircleMemberEntity, {
          circleId: child.circleId,
          memberId: user.userId,
          memberKind: "user",
          role: "member",
          displayName: dto.displayName ?? child.nickname,
          shareScope: { shareFardStatus: dto.shareFardStatus === true },
          joinedAt: new Date(),
          leftAt: null,
        }),
      );
    });
    const detail = await this.circles.detail(user, child.circleId);
    const { members: _members, ...summary } = detail;
    return summary;
  }

  private async requireParent(
    actor: Extract<CircleActor, { kind: "user" }>,
    circleId: string,
  ): Promise<MembershipContext> {
    const context = await this.access.requireMembership(actor, circleId);
    if (context.circle.type !== "family") {
      throw new BadRequestException("Child profiles belong to family circles");
    }
    if (!isParentRole(context.member.role)) {
      throw new ForbiddenException("Only parents can manage child profiles");
    }
    return context;
  }

  private async findChild(circleId: string, childId: string): Promise<ChildProfileEntity> {
    const child = await this.dataSource
      .getRepository(ChildProfileEntity)
      .findOne({ where: { id: childId, circleId } });
    if (!child) throw new NotFoundException("Child profile not found");
    return child;
  }
}

export function toChildDto(child: ChildProfileEntity): ChildProfileDto {
  return {
    id: child.id,
    circleId: child.circleId,
    nickname: child.nickname,
    birthYear: child.birthYear,
    avatar: child.avatar ?? null,
    ageBand: childAgeBand(child.birthYear),
    reward: child.reward ?? null,
    graduationUnlocked: child.graduationUnlocked,
    graduationAvailable: child.graduationUnlocked || isGraduationAge(child.birthYear),
    linkedDeviceAt: child.linkedDeviceAt?.toISOString() ?? null,
    createdAt: child.createdAt.toISOString(),
    consentPending: isConsentPending(child),
    consentTransferredAt: child.consentTransferredAt?.toISOString() ?? null,
    consentPendingUntil: child.consentTransferredAt
      ? new Date(
          child.consentTransferredAt.getTime() + CIRCLE_LIMITS.childConsentTransferDays * DAY_MS,
        ).toISOString()
      : null,
  };
}

const DAY_MS = 86_400_000;

/** D34: transferred from a parent who left / was removed / demoted / deleted their account, not yet re-confirmed. */
export function isConsentPending(child: Pick<ChildProfileEntity, "consentTransferredAt">): boolean {
  return child.consentTransferredAt != null;
}

/** D34: still pending past `childConsentTransferDays` — due for deletion. */
export function isConsentLapsed(
  child: Pick<ChildProfileEntity, "consentTransferredAt">,
  now: Date = new Date(),
): boolean {
  return (
    child.consentTransferredAt != null &&
    now.getTime() - child.consentTransferredAt.getTime() >
      CIRCLE_LIMITS.childConsentTransferDays * DAY_MS
  );
}

/** Parent actions that process the child's data wait for re-confirmed consent (D34). */
function requireConsent(child: ChildProfileEntity): void {
  if (isConsentPending(child)) {
    throw new ForbiddenException({
      message: "Re-confirm parental consent for this child first",
      code: CHILD_CONSENT_PENDING_CODE,
    });
  }
}
