import { randomUUID } from "node:crypto";
import type { VisiblePushItem, VisiblePushSender } from "@munib-tracker/surface-push-delivery";
import type { TestingModule } from "@nestjs/testing";
import { DataSource } from "typeorm";
import { createAuthTestingModule } from "../../test/support/testing-module";
import { ChildProfilesService } from "../circles/child-profiles.service";
import { CircleAccessService } from "../circles/circle-access.service";
import type { CircleActor } from "../circles/circle-auth";
import { CircleActorService } from "../circles/circle-auth";
import { CircleEventsService } from "../circles/circle-events.service";
import {
  CIRCLE_PUSH_SENDERS,
  type CirclePushSenders,
  CirclePushService,
} from "../circles/circle-push.service";
import { CircleRetentionService } from "../circles/circle-retention.service";
import { CircleSignalsService } from "../circles/circle-signals.service";
import { publicMemberId } from "../circles/circle-tokens";
import { CirclesService } from "../circles/circles.service";
import { FamilyDigestService } from "../circles/family-digest.service";
import { GroupKhatmService } from "../circles/group-khatm.service";
import { resetMemoryRateLimits } from "../common/durable-rate-limit";
import { UserEntity } from "../database/entities";

/** Cold Nest + SQLite compiles can be slow on a busy machine. */
export const BED_TIMEOUT_MS = 60_000;

export type UserActor = Extract<CircleActor, { kind: "user" }>;

/** Birth year for a child of (approximately) `age` this year. */
export function birthYearForAge(age: number, now = new Date()): number {
  return now.getUTCFullYear() - age;
}

/** The opaque per-circle id other members see for `actor` (L11). */
export function memberIdIn(circleId: string, actor: UserActor): string {
  return publicMemberId(circleId, actor.userId);
}

/** Today's UTC date (signals accept today ± slack). */
export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * In-memory SQLite + real auth stack + every circles service. `user()` inserts
 * a user row and returns the actor the guard would resolve for it.
 *
 * OS push goes to `pushSenders` (default: fakes that record every send and
 * succeed — no network), exposed as `bed.pushSends`.
 */
export async function createCirclesTestBed(options: { pushSenders?: CirclePushSenders } = {}) {
  resetMemoryRateLimits();
  const pushSends: Array<{ platform: "expo" | "web"; items: VisiblePushItem[] }> = [];
  const recordingSender = (platform: "expo" | "web"): VisiblePushSender => ({
    channel: platform === "web" ? "web_push" : "expo",
    sendMany: async (items) => {
      pushSends.push({ platform, items: [...items] });
      return items.map(() => ({ ok: true as const }));
    },
  });
  const module: TestingModule = await createAuthTestingModule([
    CircleActorService,
    CircleAccessService,
    CircleEventsService,
    CirclePushService,
    {
      provide: CIRCLE_PUSH_SENDERS,
      useValue: options.pushSenders ?? {
        expo: recordingSender("expo"),
        web: recordingSender("web"),
      },
    },
    CirclesService,
    ChildProfilesService,
    CircleSignalsService,
    GroupKhatmService,
    FamilyDigestService,
    CircleRetentionService,
  ]);
  const dataSource = module.get(DataSource);

  async function user(accountType: "user" | "guest" = "user"): Promise<UserActor> {
    const id = randomUUID();
    await dataSource
      .getRepository(UserEntity)
      .save({ id, accountType, provider: accountType === "user" ? "google" : null });
    return { kind: "user", userId: id, accountType };
  }

  return {
    module,
    dataSource,
    user,
    circles: module.get(CirclesService),
    children: module.get(ChildProfilesService),
    signals: module.get(CircleSignalsService),
    khatms: module.get(GroupKhatmService),
    actors: module.get(CircleActorService),
    events: module.get(CircleEventsService),
    familyDigest: module.get(FamilyDigestService),
    retention: module.get(CircleRetentionService),
    pushSends,
    close: () => module.close(),
  };
}

export type CirclesTestBed = Awaited<ReturnType<typeof createCirclesTestBed>>;

/** Owner creates a circle; each extra member joins through a fresh invite. */
export async function circleWithMembers(
  bed: CirclesTestBed,
  type: "family" | "partner" | "khatm_group",
  owner: UserActor,
  members: Array<{ actor: UserActor; role?: "admin" | "parent" | "member" }> = [],
) {
  const circle = await bed.circles.create(owner, { type, name: `${type} circle` });
  for (const { actor, role } of members) {
    const invite = await bed.circles.createInvite(owner, circle.id, { role: role ?? "member" });
    await bed.circles.join(actor, { code: invite.code });
  }
  return circle;
}
