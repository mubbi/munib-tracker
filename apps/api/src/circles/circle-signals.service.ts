import { randomUUID } from "node:crypto";
import {
  CHILD_CONSENT_PENDING_CODE,
  CIRCLE_LIMITS,
  type CircleNudgeKind,
  type CircleSignalKind,
  daysBetweenIso,
  isIsoDate,
  isSignalDateWritable,
  nudgeLimitDay,
} from "@munib-tracker/shared/circles";
import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { Between, DataSource, In, IsNull, MoreThan, Not, QueryFailedError } from "typeorm";
import {
  ChildProfileEntity,
  CircleDailySignalEntity,
  type CircleMemberEntity,
  CircleNudgeEntity,
} from "../database/entities";
import {
  CircleAccessService,
  type MembershipContext,
  requireUserActor,
} from "./circle-access.service";
import type { CircleActor } from "./circle-auth";
import { CircleEventsService } from "./circle-events.service";
import { canReadSignals, canWriteSignal } from "./circle-policy";
import { publicMemberId } from "./circle-tokens";
import type {
  CreateNudgeDto,
  FardStatusSignalDto,
  GoalDoneSignalDto,
  NudgeDto,
  NudgeListDto,
  RestDaySignalDto,
  SignalDto,
  SignalListDto,
  SignalsQueryDto,
} from "./dto/circles.dto";

const NUDGE_INBOX_DAYS = 7;

/**
 * Minimal shared daily state (closed schema per kind — the DTOs reject any
 * other field) and partner nudges. There is no "missed" state anywhere: a day
 * without a signal is just "no signal" (covers excused / private days).
 */
@Injectable()
export class CircleSignalsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly access: CircleAccessService,
    private readonly events: CircleEventsService,
  ) {}

  async list(actor: CircleActor, circleId: string, query: SignalsQueryDto): Promise<SignalListDto> {
    if (!isIsoDate(query.from) || !isIsoDate(query.to)) {
      throw new BadRequestException("Invalid date");
    }
    const span = daysBetweenIso(query.from, query.to);
    if (span < 0 || span >= CIRCLE_LIMITS.signalReadMaxDays) {
      throw new BadRequestException(`Range must be 1–${CIRCLE_LIMITS.signalReadMaxDays} days`);
    }
    const context = await this.access.requireMembership(actor, circleId);
    const members = await this.access.activeMembers(circleId);
    // D34: a child awaiting re-confirmed consent is hidden from the parent view
    // (the child still sees its own signals).
    const pending = await this.consentPendingChildIds(members);
    const readable = new Set(
      members
        .filter((target) => canReadSignals(context.circle.type, context.member, target))
        .filter(
          (target) => !pending.has(target.memberId) || target.memberId === context.member.memberId,
        )
        .map((target) => target.memberId),
    );
    const memberKinds = new Map(members.map((m) => [m.memberId, m.memberKind]));
    const rows = await this.dataSource.getRepository(CircleDailySignalEntity).find({
      where: { circleId, date: Between(query.from, query.to) },
      order: { date: "ASC" },
    });
    return {
      items: rows
        .filter((row) => readable.has(row.memberId))
        .map((row) => toSignalDto(row, memberKinds.get(row.memberId) ?? "user")),
    };
  }

  putFardStatus(actor: CircleActor, circleId: string, dto: FardStatusSignalDto) {
    const value = {
      fajr: dto.fajr,
      dhuhr: dto.dhuhr,
      asr: dto.asr,
      maghrib: dto.maghrib,
      isha: dto.isha,
    };
    return this.write(actor, circleId, "fard_status", dto.date, dto.memberId, value);
  }

  putRestDay(actor: CircleActor, circleId: string, dto: RestDaySignalDto) {
    return this.write(actor, circleId, "rest_day", dto.date, dto.memberId, { rest: true });
  }

  putGoalDone(actor: CircleActor, circleId: string, dto: GoalDoneSignalDto) {
    return this.write(actor, circleId, "goal_done", dto.date, undefined, { done: true });
  }

  /** "Skip sharing" a day / undo: removes the signal (there is no negative state). */
  async clear(
    actor: CircleActor,
    circleId: string,
    kind: CircleSignalKind,
    date: string,
    memberId?: string,
  ): Promise<void> {
    const { context, target } = await this.authorizeWrite(actor, circleId, kind, date, memberId);
    await this.dataSource.getRepository(CircleDailySignalEntity).delete({
      circleId: context.circle.id,
      memberId: target.memberId,
      date,
      kind,
    });
  }

  // -------------------------------------------------------------------------
  // Nudges (partner circles)
  // -------------------------------------------------------------------------

  /**
   * One nudge per kind per (sender, receiver) pair per circle per day (D32: one
   * `dua` plus one `reminder`), enforced by the unique index
   * `circle_nudges_pair_kind_day_unique`. The day is the UTC calendar day
   * (`nudgeLimitDay`) — the one boundary the server can apply the same way for
   * both members, whatever their time zones (the server stores none). `dua` lands in the receiver's inbox
   * anonymously; `reminder` is fetched by the receiver's app, which shows it
   * only after their local Isha (the server doesn't know prayer times).
   */
  async nudge(actor: CircleActor, circleId: string, dto: CreateNudgeDto): Promise<NudgeDto> {
    const context = await this.access.requireMembership(requireUserActor(actor), circleId);
    if (context.circle.type !== "partner") {
      throw new BadRequestException("Nudges are for partner circles");
    }
    const receiver = await this.access.findActiveMemberByPublicId(circleId, dto.toMemberId);
    if (receiver.memberId === context.member.memberId) {
      throw new BadRequestException("You can't nudge yourself");
    }
    const now = new Date();
    const repo = this.dataSource.getRepository(CircleNudgeEntity);
    const nudge = repo.create({
      id: randomUUID(),
      circleId,
      fromMember: context.member.memberId,
      toMember: receiver.memberId,
      kind: dto.kind,
      day: nudgeLimitDay(now),
    });
    try {
      await repo.insert(nudge);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new HttpException(
          dto.kind === "dua"
            ? "You've already sent a dua to this member today"
            : "You've already sent a reminder to this member today",
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
      throw error;
    }
    if (dto.kind === "dua") {
      await this.events.emit({ type: "dua_received", circleId, nudgeId: nudge.id }, [
        receiver.memberId,
      ]);
    }
    return { id: nudge.id, kind: nudge.kind as CircleNudgeKind, createdAt: now.toISOString() };
  }

  async receivedNudges(actor: CircleActor, circleId: string): Promise<NudgeListDto> {
    const context = await this.access.requireMembership(requireUserActor(actor), circleId);
    const since = new Date(Date.now() - NUDGE_INBOX_DAYS * 86_400_000);
    const rows = await this.dataSource.getRepository(CircleNudgeEntity).find({
      where: { circleId, toMember: context.member.memberId, createdAt: MoreThan(since) },
      order: { createdAt: "DESC" },
    });
    // Sender identity is never returned ("Someone made dua for you").
    return {
      items: rows.map((row) => ({
        id: row.id,
        kind: row.kind,
        createdAt: row.createdAt.toISOString(),
      })),
    };
  }

  // -------------------------------------------------------------------------

  private async write(
    actor: CircleActor,
    circleId: string,
    kind: CircleSignalKind,
    date: string,
    memberId: string | undefined,
    value: Record<string, boolean>,
  ): Promise<SignalDto> {
    const { target } = await this.authorizeWrite(actor, circleId, kind, date, memberId);
    const repo = this.dataSource.getRepository(CircleDailySignalEntity);
    await repo.save(repo.create({ circleId, memberId: target.memberId, date, kind, value }));
    const saved = await repo.findOneOrFail({
      where: { circleId, memberId: target.memberId, date, kind },
    });
    return toSignalDto(saved, target.memberKind);
  }

  private async authorizeWrite(
    actor: CircleActor,
    circleId: string,
    kind: CircleSignalKind,
    date: string,
    memberId: string | undefined,
  ): Promise<{ context: MembershipContext; target: CircleMemberEntity }> {
    if (!isSignalDateWritable(date)) {
      throw new BadRequestException("Date is outside the sharing window");
    }
    const context = await this.access.requireMembership(actor, circleId);
    const target = !memberId
      ? context.member
      : await this.access.findActiveMemberByPublicId(circleId, memberId);
    if (!canWriteSignal(context.circle.type, kind, context.member, target)) {
      throw new ForbiddenException("You can't share this here");
    }
    // D34 (conservative): while consent is pending the server accepts no new
    // data about the child — not from a parent, and not from the child's own
    // device, which keeps its taps queued locally and uploads them once a
    // parent re-confirms (a profile deleted after 30 days discards the queue).
    if (target.memberKind === "child" && (await this.consentPendingChildIds([target])).size > 0) {
      throw new ForbiddenException({
        message:
          target.memberId === context.member.memberId
            ? "Waiting for a parent to re-confirm consent"
            : "Re-confirm parental consent for this child first",
        code: CHILD_CONSENT_PENDING_CODE,
      });
    }
    return { context, target };
  }

  private async consentPendingChildIds(
    members: readonly Pick<CircleMemberEntity, "memberId" | "memberKind">[],
  ): Promise<Set<string>> {
    const childIds = members.filter((m) => m.memberKind === "child").map((m) => m.memberId);
    if (!childIds.length) return new Set();
    const rows = await this.dataSource.getRepository(ChildProfileEntity).find({
      where: { id: In(childIds), consentTransferredAt: Not(IsNull()) },
      select: { id: true },
    });
    return new Set(rows.map((row) => row.id));
  }
}

function toSignalDto(row: CircleDailySignalEntity, memberKind: "user" | "child"): SignalDto {
  return {
    // L11: the opaque per-circle member id, never the global users.id.
    memberId: publicMemberId(row.circleId, row.memberId, memberKind),
    date: row.date,
    kind: row.kind,
    value: row.value,
    updatedAt: row.updatedAt.toISOString(),
  };
}
