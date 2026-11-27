import {
  CIRCLE_PART_PUSH_COLLAPSE_MS,
  type CircleEventRef,
  circleEventHref,
  circlePushCopy,
} from "@munib-tracker/shared/circles/push";
import { Injectable, Logger } from "@nestjs/common";
import { DataSource, In, IsNull, Like, MoreThan } from "typeorm";
import { CircleMemberEntity, InAppNotificationEntity } from "../database/entities";
import { CirclePushService } from "./circle-push.service";

export type CircleEvent =
  | { type: "khatm_part_done"; circleId: string; khatmId: string; round: number; partNo: number }
  | { type: "khatm_completed"; circleId: string; khatmId: string; round: number }
  | { type: "dua_received"; circleId: string; nudgeId: string };

/**
 * Circle event fan-out (D33): an in-app inbox row (polled by the app;
 * de-duplicated per user by `in_app_notifications_user_dedupe`) plus an OS push
 * (`CirclePushService`, gated per kind by the recipient's `notificationPrefs`).
 *
 * - Copy is fixed and content-free (no names, intentions, counts or sender
 *   identity). Inbox rows store the English copy; the app re-localizes by
 *   `routeData.event`. Pushes are localized server-side per device.
 * - A push goes out only for a newly written inbox row, so a replayed event
 *   never pushes twice. "Part completed" pushes collapse to at most one per
 *   recipient per khatm per hour (the inbox still gets every part).
 * - Children never receive server notifications. Best-effort: a failure never
 *   fails the write that triggered it, and nothing user-written is logged.
 */
@Injectable()
export class CircleEventsService {
  private readonly logger = new Logger(CircleEventsService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly push: CirclePushService,
  ) {}

  async emit(event: CircleEvent, recipientUserIds?: string[], excludeMemberId?: string) {
    try {
      const recipients =
        recipientUserIds ??
        (
          await this.dataSource.getRepository(CircleMemberEntity).find({
            where: { circleId: event.circleId, memberKind: "user", leftAt: IsNull() },
            select: { memberId: true },
          })
        ).map((member) => member.memberId);
      const targets = recipients.filter((id) => id !== excludeMemberId);
      if (!targets.length) return;

      const ref: CircleEventRef = {
        type: event.type,
        circleId: event.circleId,
        ...("khatmId" in event ? { khatmId: event.khatmId } : {}),
      };
      const dedupeKey = eventDedupeKey(event);
      const routeData = {
        type: "circle",
        event: event.type,
        circleId: ref.circleId,
        ...(ref.khatmId ? { khatmId: ref.khatmId } : {}),
        // Same route as the OS push tap (`resolveInAppOpenTarget` reads `href`).
        href: circleEventHref(ref),
      };
      const repo = this.dataSource.getRepository(InAppNotificationEntity);
      const existing = await repo.find({
        where: { userId: In(targets), dedupeKey },
        select: { userId: true },
      });
      const already = new Set(existing.map((row) => row.userId));
      const fresh = targets.filter((userId) => !already.has(userId));
      if (!fresh.length) return;

      const pushTo = await this.collapseRecentPartPushes(event, fresh);
      const copy = circlePushCopy("en", event.type);
      await repo.save(
        fresh.map((userId) =>
          repo.create({
            userId,
            kind: "circle",
            ...copy,
            routeData,
            dedupeKey,
          }),
        ),
      );
      if (pushTo.length) await this.push.deliver(ref, pushTo);
    } catch (error) {
      this.logger.warn(
        `circle event ${event.type} not delivered: ${error instanceof Error ? error.name : "error"}`,
      );
    }
  }

  /**
   * Recipients who already got a "part completed" inbox row for this khatm in
   * the last hour keep the inbox row but get no second push.
   */
  private async collapseRecentPartPushes(event: CircleEvent, userIds: string[]) {
    if (event.type !== "khatm_part_done") return userIds;
    const since = new Date(Date.now() - CIRCLE_PART_PUSH_COLLAPSE_MS);
    const recent = await this.dataSource.getRepository(InAppNotificationEntity).find({
      where: {
        userId: In(userIds),
        kind: "circle",
        dedupeKey: Like(`circle:part:${event.khatmId}:%`),
        createdAt: MoreThan(since),
      },
      select: { userId: true },
    });
    const notified = new Set(recent.map((row) => row.userId));
    return userIds.filter((id) => !notified.has(id));
  }
}

function eventDedupeKey(event: CircleEvent): string {
  switch (event.type) {
    case "khatm_part_done":
      return `circle:part:${event.khatmId}:${event.round}:${event.partNo}`;
    case "khatm_completed":
      return `circle:khatm:${event.khatmId}:${event.round}`;
    case "dua_received":
      return `circle:dua:${event.nudgeId}`;
  }
}
