import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { DataSource, IsNull } from "typeorm";
import { CircleEntity, CircleMemberEntity } from "../database/entities";
import { actorMemberId, type CircleActor } from "./circle-auth";
import { isManager } from "./circle-policy";
import { publicMemberId } from "./circle-tokens";

export type MembershipContext = {
  actor: CircleActor;
  circle: CircleEntity;
  member: CircleMemberEntity;
};

/**
 * Membership gate used by every circles endpoint. Non-members (and departed
 * members) get 404 so circle ids can't be probed.
 */
@Injectable()
export class CircleAccessService {
  constructor(private readonly dataSource: DataSource) {}

  async requireMembership(actor: CircleActor, circleId: string): Promise<MembershipContext> {
    if (actor.kind === "child" && actor.circleId !== circleId) {
      throw new NotFoundException("Circle not found");
    }
    const circle = await this.dataSource
      .getRepository(CircleEntity)
      .findOne({ where: { id: circleId, deletedAt: IsNull() } });
    const member = circle
      ? await this.dataSource.getRepository(CircleMemberEntity).findOne({
          where: { circleId, memberId: actorMemberId(actor), leftAt: IsNull() },
        })
      : null;
    if (!circle || !member) throw new NotFoundException("Circle not found");
    return { actor, circle, member };
  }

  async requireManager(actor: CircleActor, circleId: string): Promise<MembershipContext> {
    const context = await this.requireMembership(actor, circleId);
    if (!isManager(context.circle.type, context.member.role)) {
      throw new ForbiddenException("Only circle managers can do this");
    }
    return context;
  }

  activeMembers(circleId: string): Promise<CircleMemberEntity[]> {
    return this.dataSource.getRepository(CircleMemberEntity).find({
      where: { circleId, leftAt: IsNull() },
      order: { joinedAt: "ASC" },
    });
  }

  async findActiveMember(circleId: string, memberId: string): Promise<CircleMemberEntity> {
    const member = await this.dataSource
      .getRepository(CircleMemberEntity)
      .findOne({ where: { circleId, memberId, leftAt: IsNull() } });
    if (!member) throw new NotFoundException("Member not found");
    return member;
  }

  /**
   * Resolve the opaque id other members see (`publicMemberId`, L11) to the
   * active member row. Unknown / departed ids get 404.
   */
  async findActiveMemberByPublicId(
    circleId: string,
    publicId: string,
  ): Promise<CircleMemberEntity> {
    const wanted = publicId.toLowerCase();
    const member = (await this.activeMembers(circleId)).find(
      (m) => publicMemberId(circleId, m.memberId, m.memberKind) === wanted,
    );
    if (!member) throw new NotFoundException("Member not found");
    return member;
  }
}

export function requireUserActor(actor: CircleActor): Extract<CircleActor, { kind: "user" }> {
  if (actor.kind !== "user") throw new ForbiddenException("Not available in a child session");
  return actor;
}

/** Family and partner circles need a recoverable (linked) account; khatm groups accept guests. */
export function requireLinkedAccount(actor: Extract<CircleActor, { kind: "user" }>): void {
  if (actor.accountType !== "user") {
    throw new UnauthorizedException("Sign in with a linked account to use this circle");
  }
}
