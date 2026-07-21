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

  it("rejects client-written reset markers", async () => {
    const session = await authService.completeOAuth(AuthProvider.Google, { code: "oauth-code" });

    await expect(
      syncService.push(session.accessToken, {
        changes: [
          {
            entity: "data_reset",
            id: "data_reset",
            data: { resetAt: "2026-01-01T00:00:00.000Z" },
            updatedAt: "2026-01-01T00:00:00.000Z",
          },
        ],
      }),
    ).rejects.toThrow("data_reset is server-managed");
  });

  it("rejects an older change as a conflict and returns the newer stored record", async () => {
    const session = await authService.completeOAuth(AuthProvider.Google, { code: "oauth-code" });

    // Store the authoritative (newer) version first.
    await syncService.push(session.accessToken, {
      changes: [
        {
          entity: "prayer_logs",
          id: "log-conflict",
          data: { status: "completed" },
          updatedAt: "2026-01-02T00:00:00.000Z",
        },
      ],
    });

    // A stale change with an older updatedAt loses last-write-wins.
    const response = await syncService.push(session.accessToken, {
      changes: [
        {
          entity: "prayer_logs",
          id: "log-conflict",
          data: { status: "missed" },
          updatedAt: "2026-01-01T00:00:00.000Z",
        },
      ],
    });

    expect(response.accepted).toBe(0);
    expect(response.conflicts).toHaveLength(1);
    expect(response.conflicts[0]?.id).toBe("log-conflict");
    expect(response.conflicts[0]?.data.status).toBe("completed");
    expect(response.conflicts[0]?.updatedAt).toBe("2026-01-02T00:00:00.000Z");
  });

  it("pull(since) only returns records updated after the given timestamp", async () => {
    const session = await authService.completeOAuth(AuthProvider.Google, { code: "oauth-code" });

    await syncService.push(session.accessToken, {
      changes: [
        {
          entity: "prayer_logs",
          id: "old-record",
          data: { status: "completed" },
          updatedAt: "2026-01-01T00:00:00.000Z",
        },
        {
          entity: "prayer_logs",
          id: "new-record",
          data: { status: "completed" },
          updatedAt: "2026-03-01T00:00:00.000Z",
        },
      ],
    });

    const pulled = await syncService.pull(session.accessToken, "2026-02-01T00:00:00.000Z");

    expect(pulled.changes).toHaveLength(1);
    expect(pulled.changes[0]?.id).toBe("new-record");
  });
});
