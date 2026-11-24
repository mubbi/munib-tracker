import { childAgeBand } from "@munib-tracker/shared/circles";
import {
  dueFamilyDigestWeek,
  FAMILY_DIGEST_EVENT,
  type FamilyDigestCounts,
  type FamilyDigestWeek,
  familyDigestDedupeKey,
  familyDigestHref,
  familyDigestPushCopy,
  shouldSendFamilyDigest,
  summarizeFamilyWeek,
} from "@munib-tracker/shared/circles/push";
import { Injectable, Logger } from "@nestjs/common";
import { Between, DataSource, In, IsNull } from "typeorm";
import {
  ChildProfileEntity,
  CircleDailySignalEntity,
  CircleEntity,
  CircleMemberEntity,
  InAppNotificationEntity,
  UserEntity,
} from "../database/entities";
import { CirclePushService } from "./circle-push.service";

/** A tick runs the weekly pass at most this often per process. */
const RUN_INTERVAL_MS = 15 * 60_000;
/** Family circles read per batch (keeps `IN (…)` lists bounded). */
const CIRCLE_BATCH = 200;

export type FamilyDigestRunResult = {
  /** ISO week processed, or `null` when no digest is due right now. */
  weekKey: string | null;
  /** Parents that got a new inbox row this run (each also offered a push). */
  delivered: number;
  /** Family circles skipped for having nothing logged (or no eligible child). */
  quiet: number;
};

/**
 * D40 weekly family digest: each parent (owner / `parent` role, linked
 * account) of a family circle gets one inbox row + OS push per ISO week,
 * summarising the children's week as **counts only** ("28 of 35 Salah
 * logged") — no names, no per-child or per-prayer detail.
 *
 * - **When:** Friday 18:00 UTC until the end of that ISO week (the server
 *   stores no timezone). Driven without new infra by the existing surface-push
 *   cron (`POST /surface-push/internal/dispatch-due`, every 1–5 min), throttled
 *   to one pass per 15 min per process.
 * - **Idempotent:** the inbox row's `dedupeKey` (`circle:digest:<circleId>:<week>`)
 *   is unique per user, so a parent gets at most one digest per family per week
 *   even across instances; the push goes out only when this run wrote the row.
 * - **Who counts:** child profiles only, excluding consent-pending children
 *   (D34) and the under-7 "learning" band (no tracking expectations — the
 *   parent view shows no number for them either). Rest days are excluded.
 * - **Quiet weeks:** nothing logged ⇒ no row and no push.
 * - **Gating:** the push honours the master switch + `circleFamilyDigest`
 *   (`CirclePushService`); the inbox row is written either way, like D33 events.
 *   Guests never receive it (family circles need an account anyway).
 * - Best effort: failures are logged by class only and retried next tick.
 */
@Injectable()
export class FamilyDigestService {
  private readonly logger = new Logger(FamilyDigestService.name);
  private lastRunAt = 0;
  private running: Promise<FamilyDigestRunResult> | null = null;

  constructor(
    private readonly dataSource: DataSource,
    private readonly push: CirclePushService,
  ) {}

  /** Throttled entry point for the cron tick. Never throws. */
  async maybeRun(now: Date = new Date()): Promise<void> {
    if (!dueFamilyDigestWeek(now)) return;
    if (this.running || now.getTime() - this.lastRunAt < RUN_INTERVAL_MS) return;
    this.lastRunAt = now.getTime();
    this.running = this.run(now);
    try {
      await this.running;
    } catch (error) {
      this.logger.warn(
        `family digest run failed: ${error instanceof Error ? error.name : "error"}`,
      );
    } finally {
      this.running = null;
    }
  }

  /** One full pass for the week due at `now` (unthrottled; used by tests). */
  async run(now: Date = new Date()): Promise<FamilyDigestRunResult> {
    const week = dueFamilyDigestWeek(now);
    const result: FamilyDigestRunResult = {
      weekKey: week?.weekKey ?? null,
      delivered: 0,
      quiet: 0,
    };
    if (!week) return result;

    const circles = await this.dataSource.getRepository(CircleEntity).find({
      where: { type: "family", deletedAt: IsNull() },
      select: { id: true },
      order: { id: "ASC" },
    });
    for (let i = 0; i < circles.length; i += CIRCLE_BATCH) {
      const batch = circles.slice(i, i + CIRCLE_BATCH).map((circle) => circle.id);
      const outcome = await this.runBatch(batch, week, now);
      result.delivered += outcome.delivered;
      result.quiet += outcome.quiet;
    }
    return result;
  }

  private async runBatch(
    circleIds: string[],
    week: FamilyDigestWeek,
    now: Date,
  ): Promise<{ delivered: number; quiet: number }> {
    const members = await this.dataSource.getRepository(CircleMemberEntity).find({
      where: { circleId: In(circleIds), leftAt: IsNull() },
      select: { circleId: true, memberId: true, memberKind: true, role: true },
    });

    // Parents still owed this week's digest (linked accounts only).
    const parentRows = members.filter(
      (m) => m.memberKind === "user" && (m.role === "owner" || m.role === "parent"),
    );
    if (!parentRows.length) return { delivered: 0, quiet: 0 };
    const linked = new Set(
      (
        await this.dataSource.getRepository(UserEntity).find({
          where: { id: In([...new Set(parentRows.map((m) => m.memberId))]), accountType: "user" },
          select: { id: true },
        })
      ).map((user) => user.id),
    );
    const keyByCircle = new Map(
      circleIds.map((id) => [id, familyDigestDedupeKey(id, week.weekKey)]),
    );
    const sent = await this.dataSource.getRepository(InAppNotificationEntity).find({
      where: {
        userId: In([...linked]),
        dedupeKey: In([...keyByCircle.values()]),
      },
      select: { userId: true, dedupeKey: true },
    });
    const already = new Set(sent.map((row) => `${row.userId}|${row.dedupeKey}`));
    const owed = new Map<string, string[]>();
    for (const parent of parentRows) {
      if (!linked.has(parent.memberId)) continue;
      if (already.has(`${parent.memberId}|${keyByCircle.get(parent.circleId)}`)) continue;
      const list = owed.get(parent.circleId) ?? [];
      list.push(parent.memberId);
      owed.set(parent.circleId, list);
    }
    if (!owed.size) return { delivered: 0, quiet: 0 };

    // Eligible children: consent re-confirmed (D34) and past the learning band.
    const childIds = members
      .filter((m) => m.memberKind === "child" && owed.has(m.circleId))
      .map((m) => m.memberId);
    const profiles = childIds.length
      ? await this.dataSource.getRepository(ChildProfileEntity).find({
          where: { id: In(childIds), consentTransferredAt: IsNull() },
          select: { id: true, circleId: true, birthYear: true },
        })
      : [];
    const childrenByCircle = new Map<string, string[]>();
    for (const child of profiles) {
      if (childAgeBand(child.birthYear, now) === "learning") continue;
      const list = childrenByCircle.get(child.circleId) ?? [];
      list.push(child.id);
      childrenByCircle.set(child.circleId, list);
    }
    const eligible = [...childrenByCircle.values()].flat();
    const signals = eligible.length
      ? await this.dataSource.getRepository(CircleDailySignalEntity).find({
          where: {
            circleId: In([...childrenByCircle.keys()]),
            memberId: In(eligible),
            date: Between(week.from, week.to),
            kind: In(["fard_status", "rest_day"]),
          },
          select: { circleId: true, memberId: true, date: true, kind: true, value: true },
        })
      : [];

    let delivered = 0;
    let quiet = 0;
    for (const [circleId, parents] of owed) {
      const children = childrenByCircle.get(circleId) ?? [];
      const counts = summarizeFamilyWeek(
        signals.filter((signal) => signal.circleId === circleId),
        children,
        week,
      );
      if (!children.length || !shouldSendFamilyDigest(counts)) {
        quiet += 1;
        continue;
      }
      const fresh = await this.writeInboxRows(circleId, parents, counts, week);
      delivered += fresh.length;
      if (fresh.length) await this.push.deliverFamilyDigest(circleId, counts, fresh);
    }
    return { delivered, quiet };
  }

  /**
   * One row per parent; the unique `(userId, dedupeKey)` index makes a
   * concurrent run's insert fail, and only parents whose row this run wrote
   * are pushed.
   */
  private async writeInboxRows(
    circleId: string,
    parents: string[],
    counts: FamilyDigestCounts,
    week: FamilyDigestWeek,
  ): Promise<string[]> {
    const repo = this.dataSource.getRepository(InAppNotificationEntity);
    const href = familyDigestHref(circleId);
    const copy = familyDigestPushCopy("en", counts);
    const fresh: string[] = [];
    for (const userId of parents) {
      try {
        await repo.insert({
          userId,
          kind: "circle",
          ...copy,
          // The app re-localizes by `event` with these counts (no names).
          routeData: {
            type: "circle",
            event: FAMILY_DIGEST_EVENT,
            circleId,
            prayed: counts.prayed,
            possible: counts.possible,
            href,
          },
          dedupeKey: familyDigestDedupeKey(circleId, week.weekKey),
        });
        fresh.push(userId);
      } catch {
        // Already written by a concurrent run (unique dedupe index).
      }
    }
    return fresh;
  }
}
