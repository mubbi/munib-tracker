import { randomUUID } from "node:crypto";
import {
  isIsoDate,
  isKhatmDeadlinePassed,
  isKhatmPartStale,
  KHATM_ROUND_ROBIN_MIN_MEMBERS,
  khatmPartCount,
  planKhatmDeal,
  roundRobinAssignments,
  utcIsoDate,
} from "@munib-tracker/shared/circles";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import {
  DataSource,
  type EntityManager,
  type FindOptionsWhere,
  In,
  IsNull,
  type QueryDeepPartialEntity,
} from "typeorm";
import { GroupKhatmEntity, KhatmPartEntity } from "../database/entities";
import {
  CircleAccessService,
  type MembershipContext,
  requireUserActor,
} from "./circle-access.service";
import type { CircleActor } from "./circle-auth";
import { CircleEventsService } from "./circle-events.service";
import { isManager } from "./circle-policy";
import { publicMemberId } from "./circle-tokens";
import type {
  AssignKhatmPartDto,
  CreateKhatmDto,
  KhatmDetailDto,
  KhatmDto,
  KhatmListDto,
  KhatmPartDto,
  UpdateKhatmDto,
} from "./dto/circles.dto";

type PartAction = "claim" | "release" | "reading" | "complete";

/** A deal that lost a race on some part re-reads the grid and tries again, at most this often. */
const DEAL_ATTEMPTS = 3;

/**
 * Group khatm (NF-3.18): 30 juz by default (60 hizb / 114 surahs optional).
 * Every part transition is a conditional UPDATE on the expected current state,
 * so two members racing for the same part can never both win (the loser gets
 * 409). No leaderboards: the API exposes parts and a done count, never
 * per-member totals or rankings.
 */
@Injectable()
export class GroupKhatmService {
  private readonly logger = new Logger(GroupKhatmService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly access: CircleAccessService,
    private readonly events: CircleEventsService,
  ) {}

  async create(actor: CircleActor, circleId: string, dto: CreateKhatmDto): Promise<KhatmDetailDto> {
    const context = await this.requireKhatmCircle(actor, circleId);
    if (!isManager("khatm_group", context.member.role)) {
      throw new ForbiddenException("Only the group's creator or admins can start a khatm");
    }
    this.assertFutureDeadline(dto.deadline);
    const khatms = this.dataSource.getRepository(GroupKhatmEntity);
    if (await khatms.count({ where: { circleId, status: "active" } })) {
      throw new ConflictException("This group already has an active khatm");
    }
    const unit = dto.unit ?? "juz";
    const mode = dto.assignmentMode ?? "self_pick";
    const khatmId = randomUUID();
    await this.dataSource.transaction(async (manager) => {
      await manager.save(
        manager.create(GroupKhatmEntity, {
          id: khatmId,
          circleId,
          title: dto.title,
          intention: dto.intention || null,
          unit,
          partCount: khatmPartCount(unit),
          assignmentMode: mode,
          deadline: dto.deadline ?? null,
          round: 1,
          status: "active",
          createdBy: context.member.memberId,
        }),
      );
      await this.seedParts(manager, khatmId, circleId, khatmPartCount(unit), mode);
    });
    return this.detail(actor, circleId, khatmId);
  }

  async list(actor: CircleActor, circleId: string): Promise<KhatmListDto> {
    await this.requireKhatmCircle(actor, circleId);
    const rows = await this.dataSource
      .getRepository(GroupKhatmEntity)
      .find({ where: { circleId }, order: { createdAt: "DESC" } });
    const doneCounts = await this.doneCounts(rows.map((row) => row.id));
    return { items: rows.map((row) => toKhatmDto(row, doneCounts.get(row.id) ?? 0)) };
  }

  async detail(actor: CircleActor, circleId: string, khatmId: string): Promise<KhatmDetailDto> {
    await this.requireKhatmCircle(actor, circleId);
    const khatm = await this.findKhatm(circleId, khatmId);
    const parts = await this.dataSource
      .getRepository(KhatmPartEntity)
      .find({ where: { khatmId }, order: { partNo: "ASC" } });
    const now = new Date();
    const done = parts.filter((part) => part.status === "done").length;
    return {
      ...toKhatmDto(khatm, done, now),
      parts: parts.map((part) => toPartDto(khatm, part, now)),
    };
  }

  async update(
    actor: CircleActor,
    circleId: string,
    khatmId: string,
    dto: UpdateKhatmDto,
  ): Promise<KhatmDetailDto> {
    const context = await this.requireKhatmCircle(actor, circleId);
    this.requireKhatmManager(context);
    const khatm = await this.findKhatm(circleId, khatmId);
    if (dto.deadline) this.assertFutureDeadline(dto.deadline);
    await this.dataSource.transaction(async (manager) => {
      await manager.update(
        GroupKhatmEntity,
        { id: khatmId },
        {
          title: dto.title ?? khatm.title,
          intention: dto.intention === undefined ? khatm.intention : dto.intention || null,
          deadline: dto.deadline === undefined ? khatm.deadline : dto.deadline,
        },
      );
      if (dto.openRemainingParts) {
        if (!isKhatmDeadlinePassed(khatm.deadline ?? null)) {
          throw new BadRequestException("Remaining parts can be opened once the deadline passes");
        }
        await manager.update(
          KhatmPartEntity,
          { khatmId, status: In(["assigned", "reading"]) },
          { status: "open", assigneeMemberId: null, dealt: false, updatedAt: new Date() },
        );
      }
    });
    return this.detail(actor, circleId, khatmId);
  }

  async remove(actor: CircleActor, circleId: string, khatmId: string): Promise<void> {
    const context = await this.requireKhatmCircle(actor, circleId);
    this.requireKhatmManager(context);
    await this.findKhatm(circleId, khatmId);
    await this.dataSource.transaction(async (manager) => {
      await manager.delete(KhatmPartEntity, { khatmId });
      await manager.delete(GroupKhatmEntity, { id: khatmId });
    });
  }

  /** "Start another round": only after completion; increments `round` and resets every part. */
  async startNextRound(
    actor: CircleActor,
    circleId: string,
    khatmId: string,
  ): Promise<KhatmDetailDto> {
    const context = await this.requireKhatmCircle(actor, circleId);
    this.requireKhatmManager(context);
    const khatm = await this.findKhatm(circleId, khatmId);
    const others = await this.dataSource
      .getRepository(GroupKhatmEntity)
      .count({ where: { circleId, status: "active" } });
    if (others) throw new ConflictException("This group already has an active khatm");
    await this.dataSource.transaction(async (manager) => {
      const result = await manager.update(
        GroupKhatmEntity,
        { id: khatmId, status: "completed", round: khatm.round },
        { status: "active", round: khatm.round + 1, completedAt: null },
      );
      if ((result.affected ?? 0) !== 1) {
        throw new ConflictException("Finish this round before starting another");
      }
      await manager.delete(KhatmPartEntity, { khatmId });
      await this.seedParts(manager, khatmId, circleId, khatm.partCount, khatm.assignmentMode);
    });
    return this.detail(actor, circleId, khatmId);
  }

  /** Member actions on a part: claim / release / reading / complete. */
  async partAction(
    actor: CircleActor,
    circleId: string,
    khatmId: string,
    partNo: number,
    action: PartAction,
  ): Promise<KhatmDetailDto> {
    const context = await this.requireKhatmCircle(actor, circleId);
    const khatm = await this.findKhatm(circleId, khatmId);
    this.assertPartNo(khatm, partNo);
    if (khatm.status !== "active") throw new ConflictException("This khatm is complete");
    const me = context.member.memberId;
    const now = new Date();
    const parts = this.dataSource.getRepository(KhatmPartEntity);
    let affected = 0;

    switch (action) {
      case "claim": {
        if (
          khatm.assignmentMode === "creator_assigns" &&
          !isKhatmDeadlinePassed(khatm.deadline ?? null) &&
          !isManager("khatm_group", context.member.role)
        ) {
          throw new ForbiddenException("Parts in this khatm are assigned by its creator");
        }
        affected = await this.transition(
          { khatmId, partNo, status: "open", assigneeMemberId: IsNull() },
          { status: "assigned", assigneeMemberId: me, dealt: false, updatedAt: now },
        );
        break;
      }
      case "release": {
        const part = await parts.findOne({ where: { khatmId, partNo } });
        const mayRelease =
          part?.assigneeMemberId === me || isManager("khatm_group", context.member.role);
        if (!part || !mayRelease) throw new ForbiddenException("This part isn't yours");
        affected = await this.transition(
          {
            khatmId,
            partNo,
            status: In(["assigned", "reading"]),
            assigneeMemberId: part.assigneeMemberId ?? IsNull(),
          },
          { status: "open", assigneeMemberId: null, dealt: false, updatedAt: now },
        );
        break;
      }
      case "reading":
        affected = await this.transition(
          { khatmId, partNo, status: "assigned", assigneeMemberId: me },
          { status: "reading", updatedAt: now },
        );
        break;
      case "complete":
        affected = await this.transition(
          { khatmId, partNo, status: In(["assigned", "reading"]), assigneeMemberId: me },
          { status: "done", updatedAt: now },
        );
        break;
    }
    if (affected !== 1) {
      throw new ConflictException("This part changed — refresh and try again");
    }
    if (action === "complete") await this.afterPartDone(khatm, partNo, me);
    return this.detail(actor, circleId, khatmId);
  }

  /**
   * Creator / admin assignment: any open part, a stale part (idle past
   * `max(2, remaining/3)` days — the app asks the member first), or any unfinished
   * part in `creator_assigns` mode. `memberId: null` returns it to the pool.
   */
  async assign(
    actor: CircleActor,
    circleId: string,
    khatmId: string,
    partNo: number,
    dto: AssignKhatmPartDto,
  ): Promise<KhatmDetailDto> {
    const context = await this.requireKhatmCircle(actor, circleId);
    this.requireKhatmManager(context);
    const khatm = await this.findKhatm(circleId, khatmId);
    this.assertPartNo(khatm, partNo);
    if (khatm.status !== "active") throw new ConflictException("This khatm is complete");
    const part = await this.dataSource
      .getRepository(KhatmPartEntity)
      .findOne({ where: { khatmId, partNo } });
    if (!part) throw new NotFoundException("Part not found");
    if (part.status === "done") throw new ConflictException("This part is already done");
    const reassignable =
      part.status === "open" ||
      khatm.assignmentMode === "creator_assigns" ||
      isKhatmDeadlinePassed(khatm.deadline ?? null) ||
      isKhatmPartStale(part, khatm.deadline ?? null);
    if (!reassignable) {
      throw new ConflictException("This part is still in progress with its member");
    }
    const target = dto.memberId
      ? await this.access.findActiveMemberByPublicId(circleId, dto.memberId)
      : null;
    if (target && target.memberKind !== "user") throw new BadRequestException("Invalid member");
    const affected = await this.transition(
      {
        khatmId,
        partNo,
        status: part.status,
        assigneeMemberId: part.assigneeMemberId ?? IsNull(),
      },
      // A manager's choice is pinned: round-robin dealing never moves it (L12).
      target
        ? {
            status: "assigned",
            assigneeMemberId: target.memberId,
            dealt: false,
            updatedAt: new Date(),
          }
        : { status: "open", assigneeMemberId: null, dealt: false, updatedAt: new Date() },
    );
    if (affected !== 1) throw new ConflictException("This part changed — refresh and try again");
    return this.detail(actor, circleId, khatmId);
  }

  /**
   * "Deal remaining parts" (round-robin only, creator / admins): shares the
   * parts nobody has started (open, or dealt but not being read) evenly over
   * the current members — see `planKhatmDeal`. Reading / done parts, and parts
   * a member claimed or a manager assigned, never move (L12).
   * Needs at least 2 members (409 otherwise).
   */
  async deal(actor: CircleActor, circleId: string, khatmId: string): Promise<KhatmDetailDto> {
    const context = await this.requireKhatmCircle(actor, circleId);
    this.requireKhatmManager(context);
    const khatm = await this.findKhatm(circleId, khatmId);
    if (khatm.assignmentMode !== "round_robin") {
      throw new BadRequestException("Only round-robin khatms deal out parts");
    }
    if (khatm.status !== "active") throw new ConflictException("This khatm is complete");
    if ((await this.roundRobinMembers(circleId)).length < KHATM_ROUND_ROBIN_MIN_MEMBERS) {
      throw new ConflictException("Invite at least one more member before dealing out parts");
    }
    await this.dealRemaining(khatm);
    return this.detail(actor, circleId, khatmId);
  }

  /**
   * Join hook (`CirclesService.join`): re-deal the not-started parts of every
   * active round-robin khatm so the newcomer gets a fair share. Best effort —
   * the join itself has already succeeded, so a failure here is only logged.
   */
  async onMemberJoined(circleId: string): Promise<void> {
    try {
      const khatms = await this.dataSource
        .getRepository(GroupKhatmEntity)
        .find({ where: { circleId, status: "active", assignmentMode: "round_robin" } });
      for (const khatm of khatms) await this.dealRemaining(khatm);
    } catch (error) {
      this.logger.warn(
        `khatm auto-deal failed: ${error instanceof Error ? error.constructor.name : "unknown"}`,
      );
    }
  }

  // -------------------------------------------------------------------------

  /**
   * Apply `planKhatmDeal` with one compare-and-set UPDATE per moved part
   * (expected status + holder). A move that loses a race (the part was claimed,
   * started or released meanwhile) is skipped and the plan is recomputed from a
   * fresh read of members and parts, so concurrent deals / joins converge.
   */
  private async dealRemaining(khatm: GroupKhatmEntity): Promise<void> {
    const repo = this.dataSource.getRepository(KhatmPartEntity);
    for (let attempt = 0; attempt < DEAL_ATTEMPTS; attempt += 1) {
      const members = await this.roundRobinMembers(khatm.circleId);
      const parts = await repo.find({ where: { khatmId: khatm.id }, order: { partNo: "ASC" } });
      const moves = planKhatmDeal(parts, members);
      if (!moves.length) return;
      const now = new Date();
      let lost = 0;
      for (const move of moves) {
        const affected = await this.transition(
          move.from
            ? {
                khatmId: khatm.id,
                partNo: move.partNo,
                status: "assigned",
                assigneeMemberId: move.from,
                dealt: true,
              }
            : {
                khatmId: khatm.id,
                partNo: move.partNo,
                status: "open",
                assigneeMemberId: IsNull(),
              },
          { status: "assigned", assigneeMemberId: move.to, dealt: true, updatedAt: now },
        );
        if (affected !== 1) lost += 1;
      }
      if (!lost) return;
    }
  }

  /** Account members (never child profiles) in join order — the round-robin dealing order. */
  private async roundRobinMembers(circleId: string): Promise<string[]> {
    return (await this.access.activeMembers(circleId))
      .filter((member) => member.memberKind === "user")
      .map((member) => member.memberId);
  }

  /**
   * Conditional UPDATE (compare-and-set): only applies when the row still
   * matches `where`; returns the affected row count (0 = lost the race).
   */
  private async transition(
    where: FindOptionsWhere<KhatmPartEntity>,
    set: QueryDeepPartialEntity<KhatmPartEntity>,
  ): Promise<number> {
    const result = await this.dataSource.getRepository(KhatmPartEntity).update(where, set);
    return result.affected ?? 0;
  }

  private async afterPartDone(khatm: GroupKhatmEntity, partNo: number, me: string) {
    await this.events.emit(
      {
        type: "khatm_part_done",
        circleId: khatm.circleId,
        khatmId: khatm.id,
        round: khatm.round,
        partNo,
      },
      undefined,
      me,
    );
    const open = await this.dataSource
      .getRepository(KhatmPartEntity)
      .count({ where: { khatmId: khatm.id, status: In(["open", "assigned", "reading"]) } });
    if (open) return;
    // Only one request flips the khatm to completed (conditional on round + status).
    const result = await this.dataSource
      .getRepository(GroupKhatmEntity)
      .update(
        { id: khatm.id, status: "active", round: khatm.round },
        { status: "completed", completedAt: new Date() },
      );
    if ((result.affected ?? 0) === 1) {
      await this.events.emit({
        type: "khatm_completed",
        circleId: khatm.circleId,
        khatmId: khatm.id,
        round: khatm.round,
      });
    }
  }

  private async seedParts(
    manager: EntityManager,
    khatmId: string,
    circleId: string,
    partCount: number,
    mode: GroupKhatmEntity["assignmentMode"],
  ): Promise<void> {
    // Round-robin with fewer than 2 members leaves every part open (dealt on join).
    const members = mode === "round_robin" ? await this.roundRobinMembers(circleId) : [];
    const now = new Date();
    const rows = roundRobinAssignments(partCount, members).map(({ partNo, memberId }) =>
      manager.create(KhatmPartEntity, {
        khatmId,
        partNo,
        assigneeMemberId: memberId,
        status: memberId ? "assigned" : "open",
        dealt: memberId != null,
        updatedAt: now,
      }),
    );
    await manager.insert(KhatmPartEntity, rows);
  }

  private async requireKhatmCircle(actor: CircleActor, circleId: string) {
    const context = await this.access.requireMembership(requireUserActor(actor), circleId);
    if (context.circle.type !== "khatm_group") {
      throw new BadRequestException("Group khatms live in khatm groups");
    }
    return context;
  }

  private requireKhatmManager(context: MembershipContext): void {
    if (!isManager("khatm_group", context.member.role)) {
      throw new ForbiddenException("Only the group's creator or admins can do this");
    }
  }

  private async findKhatm(circleId: string, khatmId: string): Promise<GroupKhatmEntity> {
    const khatm = await this.dataSource
      .getRepository(GroupKhatmEntity)
      .findOne({ where: { id: khatmId, circleId } });
    if (!khatm) throw new NotFoundException("Khatm not found");
    return khatm;
  }

  private assertPartNo(khatm: GroupKhatmEntity, partNo: number): void {
    if (!Number.isInteger(partNo) || partNo < 1 || partNo > khatm.partCount) {
      throw new BadRequestException("Invalid part number");
    }
  }

  private assertFutureDeadline(deadline: string | undefined): void {
    if (!deadline) return;
    if (!isIsoDate(deadline) || deadline < utcIsoDate(new Date())) {
      throw new BadRequestException("Deadline must be today or later");
    }
  }

  private async doneCounts(khatmIds: string[]): Promise<Map<string, number>> {
    if (!khatmIds.length) return new Map();
    const rows = await this.dataSource
      .getRepository(KhatmPartEntity)
      .createQueryBuilder("p")
      .select("p.khatmId", "khatmId")
      .addSelect("COUNT(*)", "count")
      .where("p.khatmId IN (:...ids)", { ids: khatmIds })
      .andWhere("p.status = :done", { done: "done" })
      .groupBy("p.khatmId")
      .getRawMany<{ khatmId: string; count: string | number }>();
    return new Map(rows.map((row) => [row.khatmId, Number(row.count)]));
  }
}

function toKhatmDto(khatm: GroupKhatmEntity, doneCount: number, now = new Date()): KhatmDto {
  return {
    id: khatm.id,
    circleId: khatm.circleId,
    title: khatm.title,
    intention: khatm.intention ?? null,
    unit: khatm.unit,
    partCount: khatm.partCount,
    assignmentMode: khatm.assignmentMode,
    deadline: khatm.deadline ?? null,
    deadlinePassed: isKhatmDeadlinePassed(khatm.deadline ?? null, now),
    round: khatm.round,
    status: khatm.status,
    createdBy: khatm.createdBy ? publicMemberId(khatm.circleId, khatm.createdBy) : null,
    doneCount,
    createdAt: khatm.createdAt.toISOString(),
    completedAt: khatm.completedAt?.toISOString() ?? null,
  };
}

function toPartDto(khatm: GroupKhatmEntity, part: KhatmPartEntity, now: Date): KhatmPartDto {
  return {
    partNo: part.partNo,
    // L11: assignees are account members — shown by their opaque per-circle id.
    assigneeMemberId: part.assigneeMemberId
      ? publicMemberId(khatm.circleId, part.assigneeMemberId)
      : null,
    status: part.status,
    dealt: part.status === "assigned" && part.dealt === true,
    updatedAt: part.updatedAt.toISOString(),
    stale: isKhatmPartStale(part, khatm.deadline ?? null, now),
  };
}
