import { randomUUID } from "node:crypto";
import { UnauthorizedException } from "@nestjs/common";
import { getRepositoryToken } from "@nestjs/typeorm";
import type { ObjectLiteral, Repository } from "typeorm";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createAuthTestingModule } from "../../test/support/testing-module";
import { AttachmentStorageService } from "../common/attachment-storage.service";
import {
  AuthSessionEntity,
  ContentReportAttachmentEntity,
  ContentReportEntity,
  DeletedAccountEntity,
  InAppNotificationEntity,
  LiveActivityPushJobEntity,
  LiveActivityPushTokenEntity,
  PushTokenEntity,
  SurfacePushJobEntity,
  SurfacePushRegistrationEntity,
  SyncRecordEntity,
  UserEntity,
  UserMediaEntity,
} from "../database/entities";
import { buildTombstoneEmail, isTombstoneValue } from "./account-tombstone";
import { AuthService } from "./auth.service";
import {
  isAuthDeleteAccountRateLimited,
  isAuthGuestRateLimited,
  isAuthOAuthRateLimited,
  isAuthRefreshRateLimited,
  isAuthResetAppDataRateLimited,
  isAuthTvPairClaimRateLimited,
  isAuthTvPairCreateRateLimited,
  isAuthTvPairPollRateLimited,
  resetAuthRateLimits,
} from "./auth-rate-limit";
import { AccountClosureReason, AuthProvider } from "./dto/auth.dto";
import { type OAuthProfile, OAuthProviderService } from "./oauth-provider.service";
import { TokenService } from "./token.service";
import {
  generateTvPairingCode,
  loadTvPairing,
  resetTvPairingMemory,
  saveTvPairing,
} from "./tv-pairing-store";

// Spies that delegate to the real limiters / generator, so a test can force the
// over-quota or code-collision branch without exhausting buckets.
vi.mock("./auth-rate-limit", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./auth-rate-limit")>();
  return {
    ...actual,
    isAuthGuestRateLimited: vi.fn(actual.isAuthGuestRateLimited),
    isAuthTvPairCreateRateLimited: vi.fn(actual.isAuthTvPairCreateRateLimited),
    isAuthTvPairPollRateLimited: vi.fn(actual.isAuthTvPairPollRateLimited),
    isAuthTvPairClaimRateLimited: vi.fn(actual.isAuthTvPairClaimRateLimited),
    isAuthOAuthRateLimited: vi.fn(actual.isAuthOAuthRateLimited),
    isAuthRefreshRateLimited: vi.fn(actual.isAuthRefreshRateLimited),
    isAuthDeleteAccountRateLimited: vi.fn(actual.isAuthDeleteAccountRateLimited),
    isAuthResetAppDataRateLimited: vi.fn(actual.isAuthResetAppDataRateLimited),
  };
});

vi.mock("./tv-pairing-store", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./tv-pairing-store")>();
  return { ...actual, generateTvPairingCode: vi.fn(actual.generateTvPairingCode) };
});

const DELETE_BODY = { confirmation: "DELETE" as const, primaryReason: AccountClosureReason.Other };
const RESET_BODY = { confirmation: "RESET" as const };

/** Real AuthService over in-memory SQLite with a stubbed OAuth provider. */
async function setup() {
  const module = await createAuthTestingModule();
  const service = module.get(AuthService);
  const storage = module.get(AttachmentStorageService);

  const repo = <T extends ObjectLiteral>(entity: new () => T) =>
    module.get<Repository<T>>(getRepositoryToken(entity));

  /** Make the next provider exchange return exactly this profile. */
  const stubNextProfile = (profile: OAuthProfile) =>
    vi.spyOn(module.get(OAuthProviderService), "exchange").mockResolvedValueOnce(profile);

  const signIn = (profile?: OAuthProfile) => {
    if (profile) stubNextProfile(profile);
    return service.completeOAuth(AuthProvider.Google, { code: "auth-code" });
  };

  const guest = (deviceId = `device-${randomUUID()}`) => service.createGuestSession({ deviceId });

  return { module, service, storage, repo, stubNextProfile, signIn, guest };
}

describe("AuthService", () => {
  afterEach(() => {
    resetAuthRateLimits();
    resetTvPairingMemory();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe("rate limits", () => {
    it.each([
      ["guest creation", isAuthGuestRateLimited, (s: AuthService) => s.createGuestSession({})],
      ["TV pairing create", isAuthTvPairCreateRateLimited, (s: AuthService) => s.createTvPairing()],
      ["TV pairing poll", isAuthTvPairPollRateLimited, (s: AuthService) => s.pollTvPairing("C")],
      [
        "TV pairing claim",
        isAuthTvPairClaimRateLimited,
        (s: AuthService) => s.claimTvPairing("t", "C"),
      ],
      [
        "OAuth completion",
        isAuthOAuthRateLimited,
        (s: AuthService) => s.completeOAuth(AuthProvider.Google, { code: "c" }),
      ],
      ["refresh", isAuthRefreshRateLimited, (s: AuthService) => s.refreshSession("r")],
      [
        "account deletion",
        isAuthDeleteAccountRateLimited,
        (s: AuthService) => s.deleteAccount("t", DELETE_BODY),
      ],
      [
        "app data reset",
        isAuthResetAppDataRateLimited,
        (s: AuthService) => s.resetAppData("t", RESET_BODY),
      ],
    ])("responds 429 to %s over quota", async (_label, limiter, call) => {
      const { service } = await setup();
      vi.mocked(limiter).mockResolvedValueOnce(true);
      await expect(call(service)).rejects.toMatchObject({ status: 429 });
    });
  });

  describe("createGuestSession", () => {
    it("creates a guest session with a signed access token", async () => {
      const { service } = await setup();
      const session = await service.createGuestSession({ deviceId: "device-1-xxxxxxxx" });

      expect(session.accountType).toBe("guest");
      expect(session.userId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      );
      expect(session.userId).not.toBe("device-1-xxxxxxxx");
      expect(session.accessToken.split(".")).toHaveLength(3); // JWT header.payload.signature
      expect(session.accessTokenExpiresIn).toBeGreaterThan(0);
      expect(session.refreshToken).toBeTruthy();
    });

    it("resumes an existing guest by device id", async () => {
      const { guest } = await setup();
      const first = await guest("device-2-xxxxxxxx");
      const second = await guest("device-2-xxxxxxxx");
      expect(second.userId).toBe(first.userId);
    });

    it("rejects a too-short device id", async () => {
      const { service } = await setup();
      await expect(service.createGuestSession({ deviceId: " short " })).rejects.toThrow(
        "deviceId is too short",
      );
    });

    it("rate-limits by client ip when no device id is sent", async () => {
      const { service } = await setup();
      await service.createGuestSession({ deviceId: "   " }, "2.2.2.2");
      expect(isAuthGuestRateLimited).toHaveBeenCalledWith("ip:2.2.2.2");
    });

    it("mints a fresh guest without a device id each time", async () => {
      const { service, repo } = await setup();
      const a = await service.createGuestSession({});
      const b = await service.createGuestSession({});
      expect(a.userId).not.toBe(b.userId);
      const stored = await repo(UserEntity).findOneByOrFail({ id: a.userId });
      expect(stored.deviceId).toBeNull();
    });
  });

  describe("TV pairing", () => {
    it("creates a pending pairing with a claim URL", async () => {
      const { service } = await setup();
      vi.mocked(generateTvPairingCode).mockReturnValueOnce("FRESH234");
      const created = await service.createTvPairing();
      expect(created).toMatchObject({
        code: "FRESH234",
        displayCode: "FRES-H234",
        claimUrl: "https://my.munibtracker.app/tv-pair?code=FRESH234",
      });
      expect(created.expiresAt).toBeGreaterThan(Date.now());
      await expect(loadTvPairing("FRESH234")).resolves.toMatchObject({ status: "pending" });
    });

    it("regenerates a code that collides with a live pairing", async () => {
      const { service } = await setup();
      await saveTvPairing("TAKEN234", { status: "pending", createdAt: 1 });
      vi.mocked(generateTvPairingCode)
        .mockReturnValueOnce("TAKEN234")
        .mockReturnValueOnce("FRESH234");
      await expect(service.createTvPairing()).resolves.toMatchObject({ code: "FRESH234" });
    });

    it.each([["--"], ["NOPE2345"]])("reports %j as expired", async (code) => {
      const { service } = await setup();
      await expect(service.pollTvPairing(code)).resolves.toEqual({ status: "expired" });
    });

    it("reports pending while unclaimed", async () => {
      const { service } = await setup();
      const { code } = await service.createTvPairing();
      await expect(service.pollTvPairing(code.toLowerCase())).resolves.toEqual({
        status: "pending",
      });
    });

    it("hands the TV a fresh session for the claiming user", async () => {
      const { service, signIn } = await setup();
      const phone = await signIn();
      const { code, displayCode } = await service.createTvPairing();
      await service.claimTvPairing(phone.accessToken, displayCode);

      const ready = await service.pollTvPairing(code);

      expect(ready.status).toBe("ready");
      expect(ready.session?.userId).toBe(phone.userId);
      expect(ready.session?.refreshToken).not.toBe(phone.refreshToken);
    });

    it("consumes a ready session on the first poll", async () => {
      const { service, signIn } = await setup();
      const phone = await signIn();
      const { code } = await service.createTvPairing();
      await service.claimTvPairing(phone.accessToken, code);
      await service.pollTvPairing(code);
      await expect(service.pollTvPairing(code)).resolves.toEqual({ status: "expired" });
    });

    it("rejects claiming an already-claimed code", async () => {
      const { service, signIn } = await setup();
      const phone = await signIn();
      const { code } = await service.createTvPairing();
      await service.claimTvPairing(phone.accessToken, code);
      await expect(service.claimTvPairing(phone.accessToken, code)).rejects.toThrow(
        "Pairing code already claimed",
      );
    });

    it("rejects claims from guest accounts", async () => {
      const { service, guest } = await setup();
      const session = await guest();
      await expect(service.claimTvPairing(session.accessToken, "ABCD2345")).rejects.toThrow(
        "Sign in with a linked account",
      );
    });

    it.each([
      [" - ", "Invalid pairing code"],
      ["MISS2345", "Pairing code expired or not found"],
    ])("rejects claiming code %j", async (code, message) => {
      const { service, signIn } = await setup();
      const phone = await signIn();
      await expect(service.claimTvPairing(phone.accessToken, code)).rejects.toThrow(message);
    });
  });

  describe("completeOAuth", () => {
    it("completes OAuth and returns a real profile", async () => {
      const { service, signIn } = await setup();
      const session = await signIn();
      expect(session.accountType).toBe("user");
      expect(session.provider).toBe(AuthProvider.Google);
      await expect(service.getCurrentUser(session.accessToken)).resolves.toMatchObject({
        email: "google-user@example.com",
      });
    });

    it("prefers a client-supplied display name", async () => {
      const { service } = await setup();
      const session = await service.completeOAuth(AuthProvider.Google, {
        code: "auth-code",
        displayName: "  Custom Name ",
      });
      await expect(service.getCurrentUser(session.accessToken)).resolves.toMatchObject({
        displayName: "Custom Name",
      });
    });

    it("stores null email/name when the provider omits them", async () => {
      const { service, signIn } = await setup();
      const session = await signIn({ providerAccountId: "bare-1" });
      const me = await service.getCurrentUser(session.accessToken);
      expect(me.email).toBeUndefined();
      expect(me.displayName).toBeUndefined();
    });

    it("keeps stored email/name when a returning profile omits them", async () => {
      const { service, signIn } = await setup();
      await signIn({ providerAccountId: "keep-1", email: "keep@example.com", displayName: "Keep" });
      const again = await signIn({ providerAccountId: "keep-1" });
      await expect(service.getCurrentUser(again.accessToken)).resolves.toMatchObject({
        email: "keep@example.com",
        displayName: "Keep",
      });
    });

    it("rejects an identity whose account was tombstoned", async () => {
      const { repo, signIn } = await setup();
      const users = repo(UserEntity);
      await users.save(
        users.create({
          id: randomUUID(),
          accountType: "user",
          provider: AuthProvider.Google,
          providerAccountId: "closed-1",
          email: buildTombstoneEmail("closed@example.com", "x"),
        }),
      );
      await expect(signIn({ providerAccountId: "closed-1" })).rejects.toThrow(
        "This account has been closed",
      );
    });
  });

  describe("linkGuestAccount", () => {
    it("links a guest account to a provider, preserving the user id", async () => {
      const { service, guest } = await setup();
      const session = await guest();
      const linked = await service.linkGuestAccount(session.accessToken, {
        provider: AuthProvider.Google,
        code: "auth-code",
      });

      expect(linked.accountType).toBe("user");
      expect(linked.provider).toBe(AuthProvider.Google);
      expect(linked.userId).toBe(session.userId);
      await expect(service.getCurrentUser(linked.accessToken)).resolves.toMatchObject({
        email: "google-user@example.com",
      });
    });

    it("applies a trimmed display name and nulls missing profile fields", async () => {
      const { service, guest, stubNextProfile } = await setup();
      const session = await guest();
      stubNextProfile({ providerAccountId: "link-1" });
      const linked = await service.linkGuestAccount(session.accessToken, {
        provider: AuthProvider.Google,
        code: "c",
        displayName: "  Linked ",
      });
      await expect(service.getCurrentUser(linked.accessToken)).resolves.toMatchObject({
        displayName: "Linked",
        email: undefined,
      });
    });

    it("revokes the guest's previous sessions", async () => {
      const { service, guest } = await setup();
      const session = await guest();
      await service.linkGuestAccount(session.accessToken, {
        provider: AuthProvider.Google,
        code: "c",
      });
      await expect(service.getCurrentUser(session.accessToken)).rejects.toThrow(
        "Invalid or expired session",
      );
    });

    it("rejects linking when the account is no longer a guest", async () => {
      const { service, signIn } = await setup();
      const linked = await signIn();
      await expect(
        service.linkGuestAccount(linked.accessToken, {
          provider: AuthProvider.Google,
          code: "auth-code",
        }),
      ).rejects.toThrow("Only guest accounts can be linked");
    });

    it("signs into the existing account when the identity is already owned", async () => {
      // Do not overwrite the guest onto an identity another user owns — sign in instead.
      const { service, signIn, guest } = await setup();
      const owned = await signIn();
      const session = await guest();
      const linked = await service.linkGuestAccount(session.accessToken, {
        provider: AuthProvider.Google,
        code: "auth-code",
      });

      expect(linked.userId).toBe(owned.userId);
      expect(linked.accountType).toBe("user");
      expect(linked.provider).toBe(AuthProvider.Google);
    });

    it.each([[{ email: "owner@example.com", displayName: "Owner" }], [{}]])(
      "keeps an existing owner's stored fields %j when the profile omits them",
      async (stored) => {
        const { service, signIn, guest, stubNextProfile } = await setup();
        await signIn({ providerAccountId: "owner-1", ...stored });
        const session = await guest();
        stubNextProfile({ providerAccountId: "owner-1" });
        const linked = await service.linkGuestAccount(session.accessToken, {
          provider: AuthProvider.Google,
          code: "c",
        });
        const me = await service.getCurrentUser(linked.accessToken);
        expect({ email: me.email, displayName: me.displayName }).toEqual({
          email: undefined,
          displayName: undefined,
          ...stored,
        });
      },
    );
  });

  describe("refreshSession", () => {
    it("rotates the refresh token and keeps the session usable", async () => {
      const { service, guest } = await setup();
      const session = await guest();
      const refreshed = await service.refreshSession(session.refreshToken);

      expect(refreshed.refreshToken).not.toBe(session.refreshToken);
      expect(refreshed.userId).toBe(session.userId);
      await expect(service.getCurrentUser(refreshed.accessToken)).resolves.toMatchObject({
        userId: session.userId,
      });
    });

    it("invalidates the previous refresh token on rotation", async () => {
      const { service, guest } = await setup();
      const session = await guest();
      await service.refreshSession(session.refreshToken);
      await expect(service.refreshSession(session.refreshToken)).rejects.toThrow(
        "Invalid or expired refresh token",
      );
    });

    it("rejects an expired refresh token and deletes the stale session", async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
      const { service, repo, guest } = await setup();
      const session = await guest();
      const sessions = repo(AuthSessionEntity);
      await expect(sessions.count()).resolves.toBe(1);

      // Advance past JWT_REFRESH_TTL_DAYS (default 30) so the refresh token expires.
      vi.setSystemTime(new Date("2026-02-15T00:00:00.000Z"));

      await expect(service.refreshSession(session.refreshToken)).rejects.toThrow(
        "Invalid or expired refresh token",
      );
      await expect(sessions.count()).resolves.toBe(0);
    });

    it("rejects when the rotated session row has no user", async () => {
      const { service, repo, guest } = await setup();
      const session = await guest();
      vi.spyOn(repo(AuthSessionEntity), "findOne").mockResolvedValueOnce(null);
      await expect(service.refreshSession(session.refreshToken)).rejects.toThrow(
        "Invalid refresh token",
      );
    });
  });

  describe("access tokens", () => {
    it("resolves the current user from a signed access token", async () => {
      const { service, guest } = await setup();
      const session = await guest();
      await expect(service.getCurrentUser(session.accessToken)).resolves.toMatchObject({
        userId: session.userId,
        accountType: "guest",
      });
    });

    it("rejects a malformed access token", async () => {
      const { service } = await setup();
      await expect(service.getCurrentUser("not-a-jwt")).rejects.toThrow(
        "Invalid or expired access token",
      );
    });

    it("rejects a token whose subject does not own the session", async () => {
      const { module, service, repo, guest } = await setup();
      const session = await guest();
      const row = await repo(AuthSessionEntity).findOneByOrFail({ userId: session.userId });
      const forged = module.get(TokenService).signAccessToken("someone-else", row.id);
      await expect(service.getCurrentUser(forged.token)).rejects.toThrow(
        "Invalid or expired session",
      );
    });

    it("revokes a session on logout so its access token stops working", async () => {
      const { service, guest } = await setup();
      const session = await guest();
      await service.revokeSession(session.accessToken);
      await expect(service.getCurrentUser(session.accessToken)).rejects.toThrow(
        "Invalid or expired session",
      );
    });
  });

  describe("resetAppData", () => {
    async function seedPrayerLog(repo: Awaited<ReturnType<typeof setup>>["repo"], userId: string) {
      const sync = repo(SyncRecordEntity);
      await sync.save(
        sync.create({
          userId,
          entity: "prayer_logs",
          recordId: "fajr-2026-01-01",
          data: { prayerId: "fajr", date: "2026-01-01", status: "completed" },
          updatedAt: new Date("2026-01-01T05:00:00.000Z"),
        }),
      );
    }

    it("tombstones synced records and writes a reset marker", async () => {
      const { service, repo, signIn } = await setup();
      const session = await signIn();
      await seedPrayerLog(repo, session.userId);

      await service.resetAppData(session.accessToken, RESET_BODY);

      const records = await repo(SyncRecordEntity).findBy({ userId: session.userId });
      const oldRecord = records.find((record) => record.entity === "prayer_logs");
      const marker = records.find((record) => record.entity === "data_reset");
      expect(oldRecord?.deletedAt).toBeInstanceOf(Date);
      expect(oldRecord?.data).toEqual({});
      expect(marker?.deletedAt).toBeNull();
      expect(marker?.data).toMatchObject({ resetAt: expect.any(String) });
    });

    it("preserves the account, identity, and every session", async () => {
      const { service, repo, signIn } = await setup();
      const session = await signIn();
      const secondDevice = await signIn();

      await service.resetAppData(session.accessToken, RESET_BODY);

      await expect(service.getCurrentUser(session.accessToken)).resolves.toMatchObject({
        provider: AuthProvider.Google,
      });
      await expect(service.getCurrentUser(secondDevice.accessToken)).resolves.toMatchObject({
        userId: session.userId,
      });
      const user = await repo(UserEntity).findOneByOrFail({ id: session.userId });
      expect(isTombstoneValue(user.email)).toBe(false);
    });

    it("reuses the existing reset marker on a second reset", async () => {
      const { service, repo, signIn } = await setup();
      const session = await signIn();
      await service.resetAppData(session.accessToken, RESET_BODY);
      await service.resetAppData(session.accessToken, RESET_BODY);
      await expect(
        repo(SyncRecordEntity).countBy({ userId: session.userId, entity: "data_reset" }),
      ).resolves.toBe(1);
    });

    it("purges user media blobs and rows", async () => {
      const { service, repo, storage, signIn } = await setup();
      const session = await signIn();
      const media = repo(UserMediaEntity);
      await media.save(
        media.create({
          id: randomUUID(),
          userId: session.userId,
          mimeType: "image/jpeg",
          filename: "x.jpg",
          sizeBytes: 1,
          storagePath: "cloudinary:x",
        }),
      );
      const remove = vi.spyOn(storage, "remove").mockResolvedValue(undefined);

      await service.resetAppData(session.accessToken, RESET_BODY);

      expect(remove).toHaveBeenCalledWith("cloudinary:x", "authenticated");
      await expect(media.countBy({ userId: session.userId })).resolves.toBe(0);
    });

    it("rejects a guest account", async () => {
      const { service, guest } = await setup();
      const session = await guest();
      await expect(service.resetAppData(session.accessToken, RESET_BODY)).rejects.toThrow(
        "App data reset requires a linked account",
      );
    });
  });

  describe("deleteAccount", () => {
    it("wipes synced data and every session for the user", async () => {
      const { service, repo, signIn } = await setup();
      const session = await signIn();
      const secondDevice = await signIn();
      const sync = repo(SyncRecordEntity);
      await sync.save(
        sync.create({
          userId: session.userId,
          entity: "prayer_logs",
          recordId: "fajr-2026-01-01",
          data: { status: "completed" },
          updatedAt: new Date(),
        }),
      );

      await service.deleteAccount(session.accessToken, {
        ...DELETE_BODY,
        primaryReason: AccountClosureReason.NotUsing,
      });

      await expect(sync.countBy({ userId: session.userId })).resolves.toBe(0);
      await expect(repo(AuthSessionEntity).countBy({ userId: session.userId })).resolves.toBe(0);
      await expect(service.getCurrentUser(secondDevice.accessToken)).rejects.toThrow(
        "Invalid or expired session",
      );
    });

    it("removes push tokens, the inbox and every push surface with its scheduled jobs", async () => {
      const { service, repo, signIn } = await setup();
      const session = await signIn();
      const other = await signIn({ providerAccountId: "other-account" });
      const userId = session.userId;
      const later = new Date(Date.now() + 3_600_000);

      const seed = async (owner: string, suffix: string) => {
        await repo(PushTokenEntity).save(
          repo(PushTokenEntity).create({
            userId: owner,
            token: `expo-${suffix}`,
            platform: "expo",
          }),
        );
        await repo(InAppNotificationEntity).save(
          repo(InAppNotificationEntity).create({
            userId: owner,
            kind: "system",
            title: "t",
            body: "b",
          }),
        );
        const token = await repo(LiveActivityPushTokenEntity).save(
          repo(LiveActivityPushTokenEntity).create({
            userId: owner,
            activityId: `activity-${suffix}`,
            tokenHash: `hash-${suffix}`,
            tokenCiphertext: "ciphertext",
            apnsEnvironment: "sandbox",
            expiresAt: later,
          }),
        );
        await repo(LiveActivityPushJobEntity).save(
          repo(LiveActivityPushJobEntity).create({
            id: randomUUID(),
            activityTokenId: token.id,
            phase: "adhan",
            executeAt: later,
            contentStateJson: "{}",
          }),
        );
        const registration = await repo(SurfacePushRegistrationEntity).save(
          repo(SurfacePushRegistrationEntity).create({
            userId: owner,
            channel: "web_push",
            targetHash: `target-${suffix}`,
            target: "{}",
          }),
        );
        await repo(SurfacePushJobEntity).save(
          repo(SurfacePushJobEntity).create({
            id: randomUUID(),
            registrationId: registration.id,
            channel: "web_push",
            phase: "adhan",
            dedupeKey: `dedupe-${suffix}`,
            executeAt: later,
            payloadJson: "{}",
          }),
        );
      };
      await seed(userId, "mine");
      await seed(other.userId, "theirs");

      await service.deleteAccount(session.accessToken, DELETE_BODY);

      await expect(repo(PushTokenEntity).countBy({ userId })).resolves.toBe(0);
      await expect(repo(InAppNotificationEntity).countBy({ userId })).resolves.toBe(0);
      await expect(repo(LiveActivityPushTokenEntity).countBy({ userId })).resolves.toBe(0);
      await expect(repo(SurfacePushRegistrationEntity).countBy({ userId })).resolves.toBe(0);
      // Only the other account's surfaces (and their jobs) remain.
      await expect(repo(LiveActivityPushJobEntity).count()).resolves.toBe(1);
      await expect(repo(SurfacePushJobEntity).count()).resolves.toBe(1);
      await expect(
        repo(LiveActivityPushTokenEntity).countBy({ userId: other.userId }),
      ).resolves.toBe(1);
      await expect(
        repo(SurfacePushRegistrationEntity).countBy({ userId: other.userId }),
      ).resolves.toBe(1);
    });

    it("retains the user row with a tombstoned identity", async () => {
      const { service, repo, signIn } = await setup();
      const session = await signIn();
      await service.deleteAccount(session.accessToken, DELETE_BODY);

      const closed = await repo(UserEntity).findOneByOrFail({ id: session.userId });
      expect(isTombstoneValue(closed.email)).toBe(true);
      expect(closed.provider).toBeNull();
      expect(closed.providerAccountId).toBeNull();
      expect(closed.displayName).toBeNull();
    });

    it.each([
      ["No longer tracking", "No longer tracking"],
      ["   ", null],
    ])("records closure details %j as %j", async (details, stored) => {
      const { service, repo, signIn } = await setup();
      const session = await signIn();
      await service.deleteAccount(session.accessToken, {
        primaryReason: AccountClosureReason.NotUsing,
        confirmation: "DELETE",
        details,
      });
      const closure = await repo(DeletedAccountEntity).findOneByOrFail({
        formerUserId: session.userId,
      });
      expect(closure.primaryReason).toBe(AccountClosureReason.NotUsing);
      expect(closure.details).toBe(stored);
    });

    it("rejects closing an account that is already closed", async () => {
      const { service, repo, signIn } = await setup();
      const session = await signIn();
      await repo(UserEntity).update(
        { id: session.userId },
        { email: buildTombstoneEmail(null, session.userId) },
      );
      await expect(service.deleteAccount(session.accessToken, DELETE_BODY)).rejects.toThrow(
        new UnauthorizedException("Account closed"),
      );
    });

    it("lets the same identity sign up again as a brand-new account", async () => {
      const { service, signIn } = await setup();
      const session = await signIn();
      await service.deleteAccount(session.accessToken, DELETE_BODY);
      const fresh = await signIn();
      expect(fresh.userId).not.toBe(session.userId);
    });

    it("tombstones a guest without an email using the user id", async () => {
      const { service, repo, guest } = await setup();
      const session = await guest();
      await service.deleteAccount(session.accessToken, DELETE_BODY);
      const user = await repo(UserEntity).findOneByOrFail({ id: session.userId });
      expect(user.email).toMatch(new RegExp(`^deleted_[a-f0-9]{32}_user_${session.userId}$`));
    });

    it("purges Cloudinary user-media assets", async () => {
      const { service, repo, storage, signIn } = await setup();
      const session = await signIn();
      const media = repo(UserMediaEntity);
      const imagePath = "cloudinary:munib-tracker/custom-adhkar/u1/face";
      const pdfPath = "cloudinary:raw:munib-tracker/custom-adhkar/u1/note";
      await media.save(
        [
          ["image/jpeg", "face.jpg", imagePath],
          ["application/pdf", "note.pdf", pdfPath],
        ].map(([mimeType, filename, storagePath]) =>
          media.create({
            id: randomUUID(),
            userId: session.userId,
            mimeType,
            filename,
            sizeBytes: 128,
            storagePath,
          }),
        ),
      );
      const remove = vi.spyOn(storage, "remove").mockResolvedValue(undefined);

      await service.deleteAccount(session.accessToken, DELETE_BODY);

      expect(remove).toHaveBeenCalledWith(imagePath, "authenticated");
      expect(remove).toHaveBeenCalledWith(pdfPath, "authenticated");
      await expect(media.countBy({ userId: session.userId })).resolves.toBe(0);
    });

    it("purges report attachments and logs failed blob removals", async () => {
      const { service, repo, storage, signIn } = await setup();
      const session = await signIn();
      const reports = repo(ContentReportEntity);
      const attachments = repo(ContentReportAttachmentEntity);
      const reportId = randomUUID();
      await reports.save(
        reports.create({
          id: reportId,
          userId: session.userId,
          status: "open",
          issueType: "typo",
          description: "desc",
          content: {},
        }),
      );
      await attachments.save(
        attachments.create({
          id: randomUUID(),
          reportId,
          mimeType: "image/png",
          filename: "a.png",
          sizeBytes: 1,
          storagePath: "reports/a.png",
        }),
      );
      const remove = vi.spyOn(storage, "remove").mockRejectedValue(new Error("cdn down"));
      const warn = vi
        .spyOn((service as unknown as { logger: { warn: () => void } }).logger, "warn")
        .mockImplementation(() => undefined);

      await service.deleteAccount(session.accessToken, DELETE_BODY);

      expect(remove).toHaveBeenCalledWith("reports/a.png");
      expect(warn).toHaveBeenCalledWith(expect.stringContaining("1/1 blob purge(s) failed"));
      await expect(reports.countBy({ userId: session.userId })).resolves.toBe(0);
      await expect(attachments.countBy({ reportId })).resolves.toBe(0);
    });

    it("rejects a stale session for an already-closed account", async () => {
      const { module, service, repo, signIn } = await setup();
      const session = await signIn();
      await service.deleteAccount(session.accessToken, DELETE_BODY);

      // A session row that outlived closure (should not happen in prod).
      const sessions = repo(AuthSessionEntity);
      const staleSessionId = randomUUID();
      await sessions.save(
        sessions.create({
          id: staleSessionId,
          userId: session.userId,
          refreshToken: randomUUID(),
          refreshExpiresAt: new Date(Date.now() + 86_400_000),
        }),
      );
      const stale = module.get(TokenService).signAccessToken(session.userId, staleSessionId);

      await expect(service.deleteAccount(stale.token, DELETE_BODY)).rejects.toThrow(
        "Account closed",
      );
    });
  });
});
