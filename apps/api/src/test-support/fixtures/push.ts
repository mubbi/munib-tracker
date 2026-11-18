import { randomUUID } from "node:crypto";
import type {
  LiveActivityPushJobEntity,
  LiveActivityPushTokenEntity,
  SurfacePushJobEntity,
  SurfacePushRegistrationEntity,
} from "../../database/entities";

export const EXPO_PUSH_TOKEN = "ExponentPushToken[abc_123]";

/** Row data for `SurfacePushRegistrationEntity` (pass to `repository.create`). */
export function buildSurfaceRegistrationRow(
  userId: string,
  overrides: Partial<SurfacePushRegistrationEntity> = {},
): Partial<SurfacePushRegistrationEntity> {
  return {
    userId,
    channel: "expo",
    targetHash: randomUUID(),
    target: EXPO_PUSH_TOKEN,
    status: "active",
    ...overrides,
  };
}

/** Row data for a pending `SurfacePushJobEntity` that is already due. */
export function buildSurfaceJobRow(
  registrationId: number,
  overrides: Partial<SurfacePushJobEntity> = {},
): Partial<SurfacePushJobEntity> {
  return {
    id: randomUUID(),
    registrationId,
    channel: "expo",
    phase: "upcoming",
    dedupeKey: randomUUID(),
    executeAt: new Date(Date.now() - 60_000),
    payloadJson: '{"title":"Asr"}',
    status: "pending",
    ...overrides,
  };
}

/** Row data for an active `LiveActivityPushTokenEntity` expiring in an hour. */
export function buildLiveActivityTokenRow(
  userId: string,
  overrides: Partial<LiveActivityPushTokenEntity> = {},
): Partial<LiveActivityPushTokenEntity> {
  return {
    userId,
    activityId: randomUUID(),
    tokenHash: randomUUID(),
    tokenCiphertext: "v1.cipher",
    apnsEnvironment: "sandbox",
    status: "active",
    expiresAt: new Date(Date.now() + 60 * 60_000),
    ...overrides,
  };
}

/** Row data for a pending `LiveActivityPushJobEntity` that is already due. */
export function buildLiveActivityJobRow(
  activityTokenId: number,
  overrides: Partial<LiveActivityPushJobEntity> = {},
): Partial<LiveActivityPushJobEntity> {
  return {
    id: randomUUID(),
    activityTokenId,
    phase: `phase-${randomUUID()}`,
    executeAt: new Date(Date.now() - 60_000),
    contentStateJson: '{"phase":"upcoming"}',
    status: "pending",
    ...overrides,
  };
}
