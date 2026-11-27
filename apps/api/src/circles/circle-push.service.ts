import {
  CIRCLE_PUSH_TTL_SECONDS,
  type CircleEventRef,
  type CirclePushCopy,
  type CirclePushPrefs,
  circleEventHref,
  circlePushCopy,
  FAMILY_DIGEST_EVENT,
  FAMILY_DIGEST_PUSH_TTL_SECONDS,
  type FamilyDigestCounts,
  familyDigestHref,
  familyDigestPushCopy,
  isCirclePushEnabled,
  isFamilyDigestPushEnabled,
} from "@munib-tracker/shared/circles/push";
import {
  createExpoVisiblePushSender,
  createWebVisiblePushSender,
  type SurfaceSendResult,
  type VisiblePushItem,
  type VisiblePushSender,
} from "@munib-tracker/surface-push-delivery";
import { Inject, Injectable, Logger, type Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DataSource, In } from "typeorm";
import type { EnvironmentVariables } from "../config/env.schema";
import { PushTokenEntity, SyncRecordEntity, UserEntity } from "../database/entities";

/** `push_tokens.platform` → visible sender. */
export type CirclePushSenders = Partial<Record<"expo" | "web", VisiblePushSender>>;

export const CIRCLE_PUSH_SENDERS = Symbol("CIRCLE_PUSH_SENDERS");

/** Expo always; Web Push only when VAPID keys are configured (same keys as surface-push). */
export function buildCirclePushSenders(
  config: ConfigService<EnvironmentVariables, true>,
): CirclePushSenders {
  const senders: CirclePushSenders = { expo: createExpoVisiblePushSender() };
  const publicKey = config.get("VAPID_PUBLIC_KEY", { infer: true })?.trim();
  const privateKey = config.get("VAPID_PRIVATE_KEY", { infer: true })?.trim();
  const subject =
    config.get("VAPID_SUBJECT", { infer: true })?.trim() || "mailto:support@munibtracker.app";
  if (publicKey && privateKey) {
    senders.web = createWebVisiblePushSender({ publicKey, privateKey, subject });
  }
  return senders;
}

export const CIRCLE_PUSH_PROVIDERS: Provider[] = [
  {
    provide: CIRCLE_PUSH_SENDERS,
    inject: [ConfigService],
    useFactory: buildCirclePushSenders,
  },
];

export type CirclePushOutcome = { sent: number; failed: number; skipped: number };

type SyncedPreferences = {
  locale?: string;
  notificationPrefs?: CirclePushPrefs;
};

/**
 * D33 OS push for circle events (Expo + Web Push), sent alongside the inbox
 * row by `CircleEventsService`, and the D40 weekly family digest
 * (`FamilyDigestService`).
 *
 * - **Gating:** the recipient's synced `preferences` record (`sync_records`,
 *   entity `preferences`) — the master switch plus the per-kind toggle. No
 *   synced record ⇒ allowed (a push token already implies OS permission).
 * - **Guests are skipped:** guest accounts can't sync preferences, so the
 *   server couldn't honour their toggles (they only join khatm groups and see
 *   progress by polling).
 * - **Copy:** fixed, content-free, localized per device from the locale the
 *   push token was registered with (else the synced UI locale, else English).
 * - **Privacy:** nothing user-written is sent or logged — logs carry the event
 *   type and counts only.
 */
@Injectable()
export class CirclePushService {
  private readonly logger = new Logger(CirclePushService.name);

  constructor(
    private readonly dataSource: DataSource,
    @Inject(CIRCLE_PUSH_SENDERS) private readonly senders: CirclePushSenders,
  ) {}

  async deliver(event: CircleEventRef, userIds: readonly string[]): Promise<CirclePushOutcome> {
    const href = circleEventHref(event);
    return this.send(userIds, {
      label: event.type,
      enabled: (prefs) => isCirclePushEnabled(prefs, event.type),
      copy: (locale) => circlePushCopy(locale, event.type),
      tag: event.khatmId ? `circle:khatm:${event.khatmId}` : `circle:${event.circleId}`,
      ttlSeconds: CIRCLE_PUSH_TTL_SECONDS,
      data: {
        type: "circle",
        event: event.type,
        circleId: event.circleId,
        ...(event.khatmId ? { khatmId: event.khatmId } : {}),
        // Native taps read `route`; the PWA service worker reads `url`.
        route: href,
        url: href,
      },
    });
  }

  /**
   * D40 weekly family digest to parents: counts only (no names), gated by the
   * master switch + `circleFamilyDigest`. The push `data` carries ids and the
   * route only — the counts live in the visible copy and the inbox row.
   */
  async deliverFamilyDigest(
    circleId: string,
    counts: FamilyDigestCounts,
    userIds: readonly string[],
  ): Promise<CirclePushOutcome> {
    const href = familyDigestHref(circleId);
    return this.send(userIds, {
      label: FAMILY_DIGEST_EVENT,
      enabled: isFamilyDigestPushEnabled,
      copy: (locale) => familyDigestPushCopy(locale, counts),
      tag: `circle:digest:${circleId}`,
      ttlSeconds: FAMILY_DIGEST_PUSH_TTL_SECONDS,
      data: { type: "circle", event: FAMILY_DIGEST_EVENT, circleId, route: href, url: href },
    });
  }

  private async send(
    userIds: readonly string[],
    spec: {
      /** Event type, for logs only. */
      label: string;
      enabled: (prefs: CirclePushPrefs | undefined) => boolean;
      copy: (locale: string | null | undefined) => CirclePushCopy;
      tag: string;
      ttlSeconds: number;
      data: Record<string, string>;
    },
  ): Promise<CirclePushOutcome> {
    const outcome: CirclePushOutcome = { sent: 0, failed: 0, skipped: 0 };
    if (!userIds.length) return outcome;

    const linked = await this.dataSource.getRepository(UserEntity).find({
      where: { id: In([...userIds]), accountType: "user" },
      select: { id: true },
    });
    const prefsByUser = await this.syncedPreferences(linked.map((user) => user.id));
    const allowed = linked
      .map((user) => user.id)
      .filter((id) => spec.enabled(prefsByUser.get(id)?.notificationPrefs));
    outcome.skipped = userIds.length - allowed.length;
    if (!allowed.length) return outcome;

    const tokens = await this.dataSource.getRepository(PushTokenEntity).find({
      where: { userId: In(allowed) },
      select: { id: true, userId: true, token: true, platform: true, locale: true },
    });

    const byPlatform = new Map<"expo" | "web", { tokenId: number; item: VisiblePushItem }[]>();
    for (const row of tokens) {
      const platform = row.platform === "web" ? "web" : "expo";
      if (!this.senders[platform]) continue;
      const copy = spec.copy(row.locale ?? prefsByUser.get(row.userId)?.locale);
      const list = byPlatform.get(platform) ?? [];
      list.push({
        tokenId: row.id,
        item: {
          target: row.token,
          notification: { ...copy, tag: spec.tag, data: spec.data, ttlSeconds: spec.ttlSeconds },
        },
      });
      byPlatform.set(platform, list);
    }

    const invalid: number[] = [];
    for (const [platform, entries] of byPlatform) {
      const sender = this.senders[platform] as VisiblePushSender;
      let results: SurfaceSendResult[];
      try {
        results = await sender.sendMany(entries.map((entry) => entry.item));
      } catch {
        results = entries.map(() => ({
          ok: false,
          reason: "send failed",
          retryable: true,
          invalidateToken: false,
        }));
      }
      results.forEach((result, index) => {
        if (result.ok) {
          outcome.sent += 1;
          return;
        }
        outcome.failed += 1;
        const entry = entries[index];
        if (result.invalidateToken && entry) invalid.push(entry.tokenId);
      });
    }
    if (invalid.length) {
      await this.dataSource.getRepository(PushTokenEntity).delete({ id: In(invalid) });
    }
    if (outcome.failed) {
      this.logger.warn(
        `circle push ${spec.label}: ${outcome.sent} sent, ${outcome.failed} failed, ${invalid.length} tokens removed`,
      );
    }
    return outcome;
  }

  private async syncedPreferences(userIds: string[]): Promise<Map<string, SyncedPreferences>> {
    const map = new Map<string, SyncedPreferences>();
    if (!userIds.length) return map;
    const rows = await this.dataSource.getRepository(SyncRecordEntity).find({
      where: { userId: In(userIds), entity: "preferences", recordId: "preferences" },
      select: { userId: true, data: true, deletedAt: true },
    });
    for (const row of rows) {
      if (row.deletedAt || !row.data || typeof row.data !== "object") continue;
      const data = row.data as SyncedPreferences;
      map.set(row.userId, {
        locale: typeof data.locale === "string" ? data.locale : undefined,
        notificationPrefs:
          data.notificationPrefs && typeof data.notificationPrefs === "object"
            ? data.notificationPrefs
            : undefined,
      });
    }
    return map;
  }
}
