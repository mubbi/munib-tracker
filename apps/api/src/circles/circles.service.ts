import { randomUUID } from "node:crypto";
import {
  CIRCLE_LIMITS,
  type CircleRole,
  type CircleType,
  childAgeBand,
  circleJoinPath,
  INVITE_DEFAULT_MAX_USES,
  isValidInviteCode,
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
import { DataSource, In, IsNull, MoreThan } from "typeorm";
import { isRateLimited } from "../common/durable-rate-limit";
import {
  ChildProfileEntity,
  CircleEntity,
  CircleInviteEntity,
  CircleMemberEntity,
} from "../database/entities";
import {
  CircleAccessService,
  requireLinkedAccount,
  requireUserActor,
} from "./circle-access.service";
import { actorMemberId, type CircleActor } from "./circle-auth";
import {
  dissolveCircle,
  handOverOrDissolve,
  releaseMemberParts,
  transferChildrenConsentedBy,
} from "./circle-lifecycle";
import {
  canInviteRole,
  isManager,
  isParentRole,
  PARENT_INVITE_MAX_TTL_HOURS,
} from "./circle-policy";
import { generateInviteCode, hashInviteCode, publicMemberId } from "./circle-tokens";
import type {
  CircleDetailDto,
  CircleListDto,
  CircleMemberDto,
  CircleSummaryDto,
  CreateCircleDto,
  CreateInviteDto,
  InviteCreatedDto,
  InviteDto,
  InviteListDto,
  InvitePreviewDto,
  JoinCircleDto,
  UpdateCircleDto,
  UpdateMemberRoleDto,
  UpdateMyMembershipDto,
} from "./dto/circles.dto";
import { GroupKhatmService } from "./group-khatm.service";

const DAY_MS = 86_400_000;
const HOUR_MS = 3_600_000;
/** Join / preview attempts per user per hour (codes are 50-bit, but don't let anyone enumerate). */
const JOIN_ATTEMPTS_PER_HOUR = 30;

const MAX_MEMBERS: Record<CircleType, number> = {
  family: 2 * CIRCLE_LIMITS.familyMaxChildren,
  partner: CIRCLE_LIMITS.partnerMaxMembers,
  khatm_group: CIRCLE_LIMITS.khatmGroupMaxMembers,
};

@Injectable()
export class CirclesService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly access: CircleAccessService,
    private readonly khatms: GroupKhatmService,
  ) {}

  // -------------------------------------------------------------------------
  // Circles
  // -------------------------------------------------------------------------

  async list(actor: CircleActor): Promise<CircleListDto> {
    // Retention runs only from the surface-push cron (A4, `CircleRetentionService`)
    // — never inside a user's request.
    const memberships = await this.dataSource.getRepository(CircleMemberEntity).find({
      where: { memberId: actorMemberId(actor), leftAt: IsNull() },
    });
    if (!memberships.length) return { items: [] };
    const circles = await this.dataSource.getRepository(CircleEntity).find({
      where: { id: In(memberships.map((m) => m.circleId)), deletedAt: IsNull() },
      order: { createdAt: "ASC" },
    });
    const counts = await this.memberCounts(circles.map((c) => c.id));
    const roleByCircle = new Map(memberships.map((m) => [m.circleId, m.role]));
    return {
      items: circles.map((circle) =>
        toSummary(
          circle,
          roleByCircle.get(circle.id) ?? "member",
          actor,
          counts.get(circle.id) ?? 0,
        ),
      ),
    };
  }

  async create(actor: CircleActor, dto: CreateCircleDto): Promise<CircleDetailDto> {
    const user = requireUserActor(actor);
    if (dto.type !== "khatm_group") requireLinkedAccount(user);
    if (dto.masjidOsmRef && dto.type !== "khatm_group") {
      throw new BadRequestException("Only khatm groups can be tagged with a masjid");
    }
    const active = await this.dataSource
      .getRepository(CircleMemberEntity)
      .count({ where: { memberId: user.userId, leftAt: IsNull() } });
    if (active >= CIRCLE_LIMITS.maxActiveCirclesPerUser) {
      throw new ConflictException("Too many circles");
    }

    const circleId = randomUUID();
    await this.dataSource.transaction(async (manager) => {
      await manager.save(
        manager.create(CircleEntity, {
          id: circleId,
          type: dto.type,
          name: dto.name,
          ownerId: user.userId,
          settings: dto.masjidOsmRef ? { masjidOsmRef: dto.masjidOsmRef } : {},
        }),
      );
      await manager.save(
        manager.create(CircleMemberEntity, {
          circleId,
          memberId: user.userId,
          memberKind: "user",
          role: "owner",
          displayName: dto.displayName ?? null,
          shareScope: {},
        }),
      );
    });
    return this.detail(actor, circleId);
  }

  async detail(actor: CircleActor, circleId: string): Promise<CircleDetailDto> {
    const { circle, member } = await this.access.requireMembership(actor, circleId);
    const members = await this.access.activeMembers(circleId);
    const childIds = members.filter((m) => m.memberKind === "child").map((m) => m.memberId);
    const children = childIds.length
      ? await this.dataSource
          .getRepository(ChildProfileEntity)
          .find({ where: { id: In(childIds) } })
      : [];
    const childById = new Map(children.map((child) => [child.id, child]));
    const me = actorMemberId(actor);
    // A child session sees itself and the adults, never sibling profiles.
    const visible =
      actor.kind === "child"
        ? members.filter((m) => m.memberKind === "user" || m.memberId === me)
        : members;
    return {
      ...toSummary(circle, member.role, actor, members.length),
      members: visible.map((m) => toMemberDto(circle.id, m, me, childById.get(m.memberId))),
    };
  }

  async update(actor: CircleActor, circleId: string, dto: UpdateCircleDto) {
    const { circle } = await this.access.requireManager(requireUserActor(actor), circleId);
    if (dto.masjidOsmRef !== undefined && circle.type !== "khatm_group") {
      throw new BadRequestException("Only khatm groups can be tagged with a masjid");
    }
    const settings = { ...circle.settings };
    if (dto.masjidOsmRef === null) delete settings.masjidOsmRef;
    else if (dto.masjidOsmRef) settings.masjidOsmRef = dto.masjidOsmRef;
    await this.dataSource
      .getRepository(CircleEntity)
      .update({ id: circleId }, { name: dto.name ?? circle.name, settings });
    return this.detail(actor, circleId);
  }

  /** Owner only: deletes all circle data now and leaves a content-free tombstone. */
  async remove(actor: CircleActor, circleId: string): Promise<void> {
    const { circle, member } = await this.access.requireMembership(
      requireUserActor(actor),
      circleId,
    );
    if (member.role !== "owner") throw new ForbiddenException("Only the owner can delete");
    await this.dataSource.transaction((manager) => dissolveCircle(manager, circle.id, new Date()));
  }

  // -------------------------------------------------------------------------
  // Members
  // -------------------------------------------------------------------------

  async updateMyMembership(actor: CircleActor, circleId: string, dto: UpdateMyMembershipDto) {
    const { circle, member } = await this.access.requireMembership(
      requireUserActor(actor),
      circleId,
    );
    if (dto.paused !== undefined && circle.type !== "partner") {
      throw new BadRequestException("Pausing applies to partner circles");
    }
    if (
      dto.shareFardStatus !== undefined &&
      (circle.type !== "family" || member.role !== "member")
    ) {
      throw new BadRequestException("Only adult family members can share fard status");
    }
    const shareScope = { ...member.shareScope };
    if (dto.paused !== undefined) shareScope.paused = dto.paused;
    if (dto.shareFardStatus !== undefined) shareScope.shareFardStatus = dto.shareFardStatus;
    await this.dataSource.getRepository(CircleMemberEntity).update(
      { circleId, memberId: member.memberId },
      {
        shareScope,
        displayName: dto.displayName === undefined ? member.displayName : dto.displayName || null,
      },
    );
    return this.detail(actor, circleId);
  }

  /**
   * Leave silently. Unfinished khatm parts return to the pool; the owner hands
   * the circle over (or it dissolves). Signals are purged 30 days later.
   */
  async leave(actor: CircleActor, circleId: string): Promise<void> {
    const { circle, member } = await this.access.requireMembership(
      requireUserActor(actor),
      circleId,
    );
    await this.dataSource.transaction(async (manager) => {
      const now = new Date();
      await releaseMemberParts(manager, member.memberId, now, circleId);
      const outcome = await handOverOrDissolve(manager, circle, member.memberId, now);
      if (outcome === "dissolved") return;
      // D34: children this parent consented to pass to a remaining parent
      // (consent pending) or are deleted when none is left.
      if (circle.type === "family") {
        await transferChildrenConsentedBy(manager, circleId, member.memberId, now);
      }
      await manager.update(
        CircleMemberEntity,
        { circleId, memberId: member.memberId },
        { leftAt: now, role: member.role === "owner" ? "member" : member.role },
      );
    });
  }

  async removeMember(actor: CircleActor, circleId: string, publicId: string): Promise<void> {
    const context = await this.access.requireManager(requireUserActor(actor), circleId);
    const target = await this.access.findActiveMemberByPublicId(circleId, publicId);
    const memberId = target.memberId;
    if (target.role === "owner") throw new ForbiddenException("The owner can't be removed");
    if (target.memberKind === "child") {
      throw new BadRequestException("Delete the child profile instead");
    }
    if (target.memberId === context.member.memberId) {
      throw new BadRequestException("Use leave to remove yourself");
    }
    // A co-parent can't remove another parent — that would take the consent
    // holder's ability to erase their child's data away from them (D34).
    if (
      context.circle.type === "family" &&
      isParentRole(target.role) &&
      context.member.role !== "owner"
    ) {
      throw new ForbiddenException("Only the owner can remove a parent");
    }
    await this.dataSource.transaction(async (manager) => {
      const now = new Date();
      await releaseMemberParts(manager, memberId, now, circleId);
      if (context.circle.type === "family") {
        await transferChildrenConsentedBy(manager, circleId, memberId, now);
      }
      await manager.update(CircleMemberEntity, { circleId, memberId }, { leftAt: now });
    });
  }

  async updateMemberRole(
    actor: CircleActor,
    circleId: string,
    publicId: string,
    dto: UpdateMemberRoleDto,
  ) {
    const { circle, member } = await this.access.requireMembership(
      requireUserActor(actor),
      circleId,
    );
    if (member.role !== "owner") throw new ForbiddenException("Only the owner can change roles");
    const target = await this.access.findActiveMemberByPublicId(circleId, publicId);
    const memberId = target.memberId;
    if (target.memberKind !== "user" || target.role === "owner") {
      throw new BadRequestException("Role can't be changed for this member");
    }
    const allowed: Record<CircleType, CircleRole[]> = {
      family: ["parent", "member"],
      partner: ["member"],
      khatm_group: ["admin", "member"],
    };
    if (!allowed[circle.type].includes(dto.role)) {
      throw new BadRequestException("Role not available in this circle");
    }
    await this.dataSource.transaction(async (manager) => {
      await manager.update(CircleMemberEntity, { circleId, memberId }, { role: dto.role });
      // D34: a demoted parent no longer holds consent for the children.
      if (circle.type === "family" && isParentRole(target.role) && !isParentRole(dto.role)) {
        await transferChildrenConsentedBy(manager, circleId, memberId, new Date());
      }
    });
    return this.detail(actor, circleId);
  }

  // -------------------------------------------------------------------------
  // Invites
  // -------------------------------------------------------------------------

  async createInvite(
    actor: CircleActor,
    circleId: string,
    dto: CreateInviteDto,
  ): Promise<InviteCreatedDto> {
    const user = requireUserActor(actor);
    const { circle, member } = await this.access.requireMembership(user, circleId);
    const role = dto.role ?? "member";
    if (!canInviteRole(circle.type, member.role, role)) {
      throw new ForbiddenException("You can't invite with this role");
    }
    const invites = this.dataSource.getRepository(CircleInviteEntity);
    const recent = await invites.count({
      where: { createdBy: user.userId, createdAt: MoreThan(new Date(Date.now() - DAY_MS)) },
    });
    if (recent >= CIRCLE_LIMITS.invitesPerUserPerDay) {
      throw new HttpException("Too many invites today", HttpStatus.TOO_MANY_REQUESTS);
    }
    // A parent invite grants access to the children's data: owner-only
    // (`canInviteRole`), always single-use and short-lived.
    const isParentInvite = role === "parent";
    if (isParentInvite && (dto.expiresInHours ?? 0) > PARENT_INVITE_MAX_TTL_HOURS) {
      throw new BadRequestException(
        `A parent invite can last at most ${PARENT_INVITE_MAX_TTL_HOURS} hours`,
      );
    }
    const maxUses = isParentInvite
      ? 1
      : Math.min(dto.maxUses ?? INVITE_DEFAULT_MAX_USES[circle.type], MAX_MEMBERS[circle.type]);
    const ttlHours =
      dto.expiresInHours ??
      (isParentInvite ? PARENT_INVITE_MAX_TTL_HOURS : CIRCLE_LIMITS.inviteDefaultTtlHours);
    const code = generateInviteCode();
    const invite = await invites.save(
      invites.create({
        id: randomUUID(),
        circleId,
        codeHash: hashInviteCode(code),
        role,
        maxUses,
        uses: 0,
        expiresAt: new Date(Date.now() + ttlHours * HOUR_MS),
        createdBy: user.userId,
      }),
    );
    return { ...toInviteDto(invite), code, joinPath: circleJoinPath(code) };
  }

  async listInvites(actor: CircleActor, circleId: string): Promise<InviteListDto> {
    const { circle, member } = await this.access.requireMembership(
      requireUserActor(actor),
      circleId,
    );
    const where = {
      circleId,
      revokedAt: IsNull(),
      expiresAt: MoreThan(new Date()),
      // Managers see every live invite; others only their own.
      ...(isManager(circle.type, member.role) ? {} : { createdBy: member.memberId }),
    };
    const rows = await this.dataSource
      .getRepository(CircleInviteEntity)
      .find({ where, order: { createdAt: "DESC" } });
    return { items: rows.filter((row) => row.uses < row.maxUses).map(toInviteDto) };
  }

  async revokeInvite(actor: CircleActor, circleId: string, inviteId: string): Promise<void> {
    const { circle, member } = await this.access.requireMembership(
      requireUserActor(actor),
      circleId,
    );
    const invite = await this.dataSource
      .getRepository(CircleInviteEntity)
      .findOne({ where: { id: inviteId, circleId } });
    if (!invite) throw new NotFoundException("Invite not found");
    if (invite.createdBy !== member.memberId && !isManager(circle.type, member.role)) {
      throw new ForbiddenException("You can't revoke this invite");
    }
    await this.dataSource
      .getRepository(CircleInviteEntity)
      .update({ id: inviteId }, { revokedAt: new Date() });
  }

  async previewInvite(actor: CircleActor, code: string): Promise<InvitePreviewDto> {
    const user = requireUserActor(actor);
    await this.throttleJoin(user.userId);
    const { invite, circle } = await this.findUsableInvite(code);
    const memberCount = (await this.memberCounts([circle.id])).get(circle.id) ?? 0;
    const existing = await this.dataSource.getRepository(CircleMemberEntity).findOne({
      where: { circleId: circle.id, memberId: user.userId, leftAt: IsNull() },
    });
    return {
      circleType: circle.type,
      circleName: circle.name ?? "",
      memberCount,
      role: invite.role,
      expiresAt: invite.expiresAt.toISOString(),
      alreadyMember: Boolean(existing),
    };
  }

  /**
   * Redeem an invite. The use counter is incremented with a conditional UPDATE
   * (`uses < maxUses`, not revoked, not expired) so concurrent joins can never
   * overshoot `max_uses`.
   */
  async join(actor: CircleActor, dto: JoinCircleDto): Promise<CircleDetailDto> {
    const user = requireUserActor(actor);
    await this.throttleJoin(user.userId);
    const { invite, circle } = await this.findUsableInvite(dto.code);
    if (circle.type !== "khatm_group") requireLinkedAccount(user);

    const members = this.dataSource.getRepository(CircleMemberEntity);
    const existing = await members.findOne({
      where: { circleId: circle.id, memberId: user.userId },
    });
    if (existing && !existing.leftAt) return this.detail(actor, circle.id);

    const activeCount = (await this.memberCounts([circle.id])).get(circle.id) ?? 0;
    if (activeCount >= MAX_MEMBERS[circle.type]) {
      throw new ConflictException("This circle is full");
    }
    const myCircles = await members.count({ where: { memberId: user.userId, leftAt: IsNull() } });
    if (myCircles >= CIRCLE_LIMITS.maxActiveCirclesPerUser) {
      throw new ConflictException("Too many circles");
    }

    await this.dataSource.transaction(async (manager) => {
      const claimed = await manager
        .createQueryBuilder()
        .update(CircleInviteEntity)
        .set({ uses: () => `"uses" + 1` })
        .where("id = :id", { id: invite.id })
        .andWhere(`"uses" < "maxUses"`)
        .andWhere(`"revokedAt" IS NULL`)
        .andWhere(`"expiresAt" > :now`, { now: new Date() })
        .execute();
      if ((claimed.affected ?? 0) !== 1) throw new GoneException("Invite expired or used up");

      await manager.save(
        manager.create(CircleMemberEntity, {
          circleId: circle.id,
          memberId: user.userId,
          memberKind: "user",
          role: invite.role,
          displayName: dto.displayName ?? existing?.displayName ?? null,
          shareScope: {},
          joinedAt: new Date(),
          leftAt: null,
        }),
      );
    });
    // NF-3.18: a round-robin khatm deals its not-started parts to the newcomer too.
    if (circle.type === "khatm_group") await this.khatms.onMemberJoined(circle.id);
    return this.detail(actor, circle.id);
  }

  // -------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------

  private async findUsableInvite(rawCode: string) {
    if (!isValidInviteCode(rawCode)) throw new NotFoundException("Invite not found");
    const invite = await this.dataSource
      .getRepository(CircleInviteEntity)
      .findOne({ where: { codeHash: hashInviteCode(rawCode) } });
    const circle = invite
      ? await this.dataSource
          .getRepository(CircleEntity)
          .findOne({ where: { id: invite.circleId, deletedAt: IsNull() } })
      : null;
    if (!invite || !circle) throw new NotFoundException("Invite not found");
    if (invite.revokedAt || invite.expiresAt.getTime() <= Date.now()) {
      throw new GoneException("Invite expired");
    }
    if (invite.uses >= invite.maxUses) throw new GoneException("Invite already used");
    return { invite, circle };
  }

  private async throttleJoin(userId: string): Promise<void> {
    if (
      await isRateLimited({
        key: `circles:join:${userId}`,
        limit: JOIN_ATTEMPTS_PER_HOUR,
        windowMs: HOUR_MS,
      })
    ) {
      throw new HttpException("Too many attempts", HttpStatus.TOO_MANY_REQUESTS);
    }
  }

  private async memberCounts(circleIds: string[]): Promise<Map<string, number>> {
    if (!circleIds.length) return new Map();
    const rows = await this.dataSource
      .getRepository(CircleMemberEntity)
      .createQueryBuilder("m")
      .select("m.circleId", "circleId")
      .addSelect("COUNT(*)", "count")
      .where("m.circleId IN (:...ids)", { ids: circleIds })
      .andWhere("m.leftAt IS NULL")
      .groupBy("m.circleId")
      .getRawMany<{ circleId: string; count: string | number }>();
    return new Map(rows.map((row) => [row.circleId, Number(row.count)]));
  }
}

export function toSummary(
  circle: CircleEntity,
  role: CircleRole,
  actor: CircleActor,
  memberCount: number,
): CircleSummaryDto {
  return {
    id: circle.id,
    type: circle.type,
    name: circle.name ?? "",
    myRole: role,
    myMemberId: publicMemberId(
      circle.id,
      actorMemberId(actor),
      actor.kind === "child" ? "child" : "user",
    ),
    memberCount,
    masjidOsmRef: circle.settings?.masjidOsmRef ?? null,
    createdAt: circle.createdAt.toISOString(),
  };
}

function toMemberDto(
  circleId: string,
  member: CircleMemberEntity,
  me: string,
  child: ChildProfileEntity | undefined,
): CircleMemberDto {
  return {
    // L11: never the global users.id — an opaque per-circle id.
    memberId: publicMemberId(circleId, member.memberId, member.memberKind),
    memberKind: member.memberKind,
    role: member.role,
    displayName: member.displayName ?? null,
    joinedAt: member.joinedAt.toISOString(),
    isMe: member.memberId === me,
    paused: member.shareScope?.paused === true,
    shareFardStatus: member.shareScope?.shareFardStatus === true,
    child: child
      ? {
          nickname: child.nickname,
          birthYear: child.birthYear,
          avatar: child.avatar ?? null,
          ageBand: childAgeBand(child.birthYear),
          consentPending: child.consentTransferredAt != null,
        }
      : null,
  };
}

function toInviteDto(invite: CircleInviteEntity): InviteDto {
  return {
    id: invite.id,
    role: invite.role,
    maxUses: invite.maxUses,
    uses: invite.uses,
    expiresAt: invite.expiresAt.toISOString(),
    createdAt: invite.createdAt.toISOString(),
  };
}
