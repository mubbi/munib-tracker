import { DataSource } from "typeorm";
import { beforeEach, describe, expect, it } from "vitest";
import { createAuthTestingModule } from "../../test/support/testing-module";
import { AuthService } from "../auth/auth.service";
import { AuthProvider } from "../auth/dto/auth.dto";
import { SyncRecordEntity } from "../database/entities";
import { SyncService } from "./sync.service";

describe("SyncService", () => {
  let authService: AuthService;
  let syncService: SyncService;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module = await createAuthTestingModule([SyncService]);
    authService = module.get(AuthService);
    syncService = module.get(SyncService);
    dataSource = module.get(DataSource);
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

  it("skips an invalid vault / ayah-notes record without failing the rest of the batch (H2)", async () => {
    const session = await authService.completeOAuth(AuthProvider.Google, { code: "oauth-code" });
    const at = "2026-01-01T00:00:00.000Z";

    await syncService.push(session.accessToken, {
      changes: [
        // Plaintext where ciphertext is required, and an oversized notes blob.
        {
          entity: "vault_debts",
          id: "vault_debts",
          data: { value: { note: "Zaid" } },
          updatedAt: at,
        },
        {
          entity: "quran_notes",
          id: "quran_notes",
          data: { value: { n1: { id: "n1" } } },
          updatedAt: at,
        },
        {
          entity: "fasting",
          id: "fasting",
          data: { value: { "2026-03-01": "fasted" } },
          updatedAt: at,
        },
      ],
    });

    const pulled = await syncService.pull(session.accessToken);
    expect(pulled.changes.map((change) => change.entity)).toEqual(["fasting"]);
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

  describe("D46 — private fields never stored or returned in plaintext", () => {
    const at = "2026-11-24T00:00:00.000Z";

    it("strips the excused reasons and rounds the location on push", async () => {
      const session = await authService.completeOAuth(AuthProvider.Google, { code: "oauth-code" });
      await syncService.push(session.accessToken, {
        changes: [
          {
            entity: "preferences",
            id: "preferences",
            data: { locale: "en", activeExcusedReason: "hayd" },
            updatedAt: at,
          },
          {
            entity: "prayer_logs",
            id: "fajr::2026-11-24",
            data: { prayerId: "fajr", isExcused: true, excusedReason: "nifas" },
            updatedAt: at,
          },
          {
            entity: "location",
            id: "location",
            data: { value: { latitude: 24.894812, longitude: 91.871534, label: "Sylhet" } },
            updatedAt: at,
          },
        ],
      });

      const stored = await dataSource
        .getRepository(SyncRecordEntity)
        .find({ where: { userId: session.userId } });
      const raw = JSON.stringify(stored.map((row) => row.data));
      expect(raw).not.toContain("hayd");
      expect(raw).not.toContain("nifas");
      expect(raw).not.toContain("24.894812");
      const location = stored.find((row) => row.entity === "location");
      expect(location?.data).toEqual({
        value: { latitude: 24.89, longitude: 91.87, label: "Sylhet" },
      });
      const log = stored.find((row) => row.entity === "prayer_logs");
      expect(log?.data).toEqual({ prayerId: "fajr", isExcused: true });
    });

    it("accepts the retired khushu_journal entity but stores nothing and drops old rows", async () => {
      const session = await authService.completeOAuth(AuthProvider.Google, { code: "oauth-code" });
      const repo = dataSource.getRepository(SyncRecordEntity);
      // A row written before D46.
      await repo.save(
        repo.create({
          userId: session.userId,
          entity: "khushu_journal",
          recordId: "khushu_journal",
          data: { value: { k: { note: "private reflection" } } },
          updatedAt: new Date(at),
        }),
      );
      expect((await syncService.pull(session.accessToken)).changes).toHaveLength(0);

      const response = await syncService.push(session.accessToken, {
        changes: [
          {
            entity: "khushu_journal",
            id: "khushu_journal",
            data: { value: { k: { note: "private reflection" } } },
            updatedAt: at,
          },
        ],
      });

      expect(response.accepted).toBe(1);
      expect(await repo.count({ where: { userId: session.userId } })).toBe(0);
    });

    it("strips plaintext from rows stored before D46 when they are pulled", async () => {
      const session = await authService.completeOAuth(AuthProvider.Google, { code: "oauth-code" });
      const repo = dataSource.getRepository(SyncRecordEntity);
      await repo.save(
        repo.create({
          userId: session.userId,
          entity: "preferences",
          recordId: "preferences",
          data: { locale: "en", activeExcusedReason: "hayd" },
          updatedAt: new Date(at),
        }),
      );

      const pulled = await syncService.pull(session.accessToken);

      expect(pulled.changes[0]?.data).toEqual({ locale: "en" });
    });

    it("accepts the new vault entities as ciphertext only", async () => {
      const session = await authService.completeOAuth(AuthProvider.Google, { code: "oauth-code" });
      const repo = dataSource.getRepository(SyncRecordEntity);
      await syncService.push(session.accessToken, {
        changes: [
          {
            entity: "vault_excused",
            id: "vault_excused",
            data: { value: { reason: "hayd" } },
            updatedAt: at,
          },
          { entity: "vault_khushu", id: "vault_khushu", data: { value: null }, updatedAt: at },
        ],
      });
      const rows = await repo.find({ where: { userId: session.userId } });
      expect(rows.map((row) => row.entity)).toEqual(["vault_khushu"]);
    });
  });
});
