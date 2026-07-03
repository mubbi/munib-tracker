import { beforeEach, describe, expect, it } from "vitest";
import { createAuthTestingModule } from "../../test/support/testing-module";
import { AuthService } from "../auth/auth.service";
import { AuthProvider } from "../auth/dto/auth.dto";
import { SyncService } from "./sync.service";

describe("SyncService", () => {
  let authService: AuthService;
  let syncService: SyncService;

  beforeEach(async () => {
    const module = await createAuthTestingModule([SyncService]);
    authService = module.get(AuthService);
    syncService = module.get(SyncService);
  });

  it("blocks guest accounts from syncing", async () => {
    const guest = await authService.createGuestSession({});

    await expect(syncService.pull(guest.accessToken)).rejects.toThrow(
      "Cloud sync is disabled for guest accounts",
    );
  });

  it("accepts pushed changes for authenticated users", async () => {
    const session = await authService.completeOAuth(AuthProvider.Google, { code: "oauth-code" });

    const response = await syncService.push(session.accessToken, {
      changes: [
        {
          entity: "prayer_logs",
          id: "log-1",
          data: { completed: true },
          updatedAt: "2026-01-01T00:00:00.000Z",
        },
      ],
    });

    expect(response.accepted).toBe(1);
    expect(response.conflicts).toHaveLength(0);
  });
});
