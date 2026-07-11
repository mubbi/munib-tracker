import { getRepositoryToken } from "@nestjs/typeorm";
import type { Repository } from "typeorm";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createAuthTestingModule } from "../../test/support/testing-module";
import { AuthSessionEntity, SyncRecordEntity } from "../database/entities";
import { AuthService } from "./auth.service";
import { AuthProvider } from "./dto/auth.dto";

describe("AuthService", () => {
  let service: AuthService;
  let module: Awaited<ReturnType<typeof createAuthTestingModule>>;

  beforeEach(async () => {
    module = await createAuthTestingModule();
    service = module.get(AuthService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("creates a guest session with a signed access token", async () => {
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
    const first = await service.createGuestSession({ deviceId: "device-2-xxxxxxxx" });
    const second = await service.createGuestSession({ deviceId: "device-2-xxxxxxxx" });

    expect(second.userId).toBe(first.userId);
  });

  it("resolves the current user from a signed access token", async () => {
    const session = await service.createGuestSession({ deviceId: "device-3-xxxxxxxx" });
    const user = await service.getCurrentUser(session.accessToken);

    expect(user.userId).toBe(session.userId);
    expect(user.accountType).toBe("guest");
  });

  it("completes OAuth and returns a real profile", async () => {
    const session = await service.completeOAuth(AuthProvider.Google, { code: "auth-code" });
    expect(session.accountType).toBe("user");
    expect(session.provider).toBe(AuthProvider.Google);

    const user = await service.getCurrentUser(session.accessToken);
    expect(user.email).toBe("google-user@example.com");
  });

  it("links a guest account to a provider, preserving the user id", async () => {
    const guest = await service.createGuestSession({ deviceId: "device-link-xxxxxxxx" });
    const linked = await service.linkGuestAccount(guest.accessToken, {
      provider: AuthProvider.Google,
      code: "auth-code",
    });

    expect(linked.accountType).toBe("user");
    expect(linked.provider).toBe(AuthProvider.Google);
    expect(linked.userId).toBe(guest.userId);

    const user = await service.getCurrentUser(linked.accessToken);
    expect(user.email).toBe("google-user@example.com");
  });

  it("rotates the refresh token and keeps the session usable", async () => {
    const session = await service.createGuestSession({ deviceId: "device-4-xxxxxxxx" });
    const refreshed = await service.refreshSession(session.refreshToken);

    expect(refreshed.refreshToken).not.toBe(session.refreshToken);
    expect(refreshed.userId).toBe(session.userId);

    // The old refresh token is invalidated by rotation.
    await expect(service.refreshSession(session.refreshToken)).rejects.toThrow(
      "Invalid or expired refresh token",
    );

    // The freshly issued access token still resolves.
    await expect(service.getCurrentUser(refreshed.accessToken)).resolves.toMatchObject({
      userId: session.userId,
    });
  });

  it("rejects an expired refresh token and deletes the stale session", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));

    const session = await service.createGuestSession({ deviceId: "device-expiry-xxxxxxxx" });
    const sessionsRepo = module.get<Repository<AuthSessionEntity>>(
      getRepositoryToken(AuthSessionEntity),
    );
    await expect(sessionsRepo.count()).resolves.toBe(1);

    // Advance past JWT_REFRESH_TTL_DAYS (default 30) so the refresh token expires.
    vi.setSystemTime(new Date("2026-02-15T00:00:00.000Z"));

    await expect(service.refreshSession(session.refreshToken)).rejects.toThrow(
      "Invalid or expired refresh token",
    );

    // The expired session row is purged so a stale token can't be probed again.
    await expect(sessionsRepo.count()).resolves.toBe(0);
  });

  it("rejects linking when the account is no longer a guest", async () => {
    const linked = await service.completeOAuth(AuthProvider.Google, { code: "auth-code" });

    await expect(
      service.linkGuestAccount(linked.accessToken, {
        provider: AuthProvider.Google,
        code: "auth-code",
      }),
    ).rejects.toThrow("Only guest accounts can be linked");
  });

  it("rejects linking a provider identity already owned by another user", async () => {
    // A different user has already signed in with this Google identity.
    await service.completeOAuth(AuthProvider.Google, { code: "auth-code" });

    // A separate guest tries to link the same Google identity — must be rejected,
    // not silently merged/overwritten.
    const guest = await service.createGuestSession({ deviceId: "device-collision-xxxxxxxx" });
    await expect(
      service.linkGuestAccount(guest.accessToken, {
        provider: AuthProvider.Google,
        code: "auth-code",
      }),
    ).rejects.toThrow("already linked to another user");
  });

  it("revokes a session on logout so its access token stops working", async () => {
    const session = await service.createGuestSession({ deviceId: "device-5-xxxxxxxx" });
    await service.revokeSession(session.accessToken);

    await expect(service.getCurrentUser(session.accessToken)).rejects.toThrow(
      "Invalid or expired session",
    );
  });

  it("rejects a malformed access token", async () => {
    await expect(service.getCurrentUser("not-a-jwt")).rejects.toThrow(
      "Invalid or expired access token",
    );
  });

  it("permanently deletes the account, its sessions across devices, and all synced records", async () => {
    const session = await service.completeOAuth(AuthProvider.Google, { code: "auth-code" });
    const user = await service.getCurrentUser(session.accessToken);

    // A second device session for the same account, plus a synced record.
    const secondDevice = await service.completeOAuth(AuthProvider.Google, { code: "auth-code" });
    const syncRepo = module.get<Repository<SyncRecordEntity>>(getRepositoryToken(SyncRecordEntity));
    await syncRepo.save(
      syncRepo.create({
        userId: user.userId,
        entity: "prayer_logs",
        recordId: "fajr-2026-01-01",
        data: { status: "completed" },
        updatedAt: new Date(),
      }),
    );

    const sessionsRepo = module.get<Repository<AuthSessionEntity>>(
      getRepositoryToken(AuthSessionEntity),
    );
    await expect(sessionsRepo.count({ where: { userId: user.userId } })).resolves.toBe(2);

    await service.deleteAccount(session.accessToken);

    // Synced data and every session for the user are gone.
    await expect(syncRepo.count({ where: { userId: user.userId } })).resolves.toBe(0);
    await expect(sessionsRepo.count({ where: { userId: user.userId } })).resolves.toBe(0);

    // Both the deleting token and the other device's token stop resolving.
    await expect(service.getCurrentUser(session.accessToken)).rejects.toThrow(
      "Invalid or expired session",
    );
    await expect(service.getCurrentUser(secondDevice.accessToken)).rejects.toThrow(
      "Invalid or expired session",
    );

    // Signing in again with the same identity yields a brand-new, empty account.
    const fresh = await service.completeOAuth(AuthProvider.Google, { code: "auth-code" });
    const freshUser = await service.getCurrentUser(fresh.accessToken);
    expect(freshUser.userId).not.toBe(user.userId);
    await expect(syncRepo.count({ where: { userId: freshUser.userId } })).resolves.toBe(0);
  });
});
