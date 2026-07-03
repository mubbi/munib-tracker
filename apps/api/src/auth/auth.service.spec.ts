import { beforeEach, describe, expect, it } from "vitest";
import { createAuthTestingModule } from "../../test/support/testing-module";
import { AuthService } from "./auth.service";
import { AuthProvider } from "./dto/auth.dto";

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    const module = await createAuthTestingModule();
    service = module.get(AuthService);
  });

  it("creates a guest session with a signed access token", async () => {
    const session = await service.createGuestSession({ deviceId: "device-1" });

    expect(session.accountType).toBe("guest");
    expect(session.userId).toBe("device-1");
    expect(session.accessToken.split(".")).toHaveLength(3); // JWT header.payload.signature
    expect(session.accessTokenExpiresIn).toBeGreaterThan(0);
    expect(session.refreshToken).toBeTruthy();
  });

  it("resumes an existing guest by device id", async () => {
    const first = await service.createGuestSession({ deviceId: "device-2" });
    const second = await service.createGuestSession({ deviceId: "device-2" });

    expect(second.userId).toBe(first.userId);
  });

  it("resolves the current user from a signed access token", async () => {
    const session = await service.createGuestSession({ deviceId: "device-3" });
    const user = await service.getCurrentUser(session.accessToken);

    expect(user.userId).toBe("device-3");
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
    const guest = await service.createGuestSession({ deviceId: "device-link" });
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
    const session = await service.createGuestSession({ deviceId: "device-4" });
    const refreshed = await service.refreshSession(session.refreshToken);

    expect(refreshed.refreshToken).not.toBe(session.refreshToken);
    expect(refreshed.userId).toBe(session.userId);

    // The old refresh token is invalidated by rotation.
    await expect(service.refreshSession(session.refreshToken)).rejects.toThrow("Invalid refresh");

    // The freshly issued access token still resolves.
    await expect(service.getCurrentUser(refreshed.accessToken)).resolves.toMatchObject({
      userId: session.userId,
    });
  });

  it("revokes a session on logout so its access token stops working", async () => {
    const session = await service.createGuestSession({ deviceId: "device-5" });
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
});
