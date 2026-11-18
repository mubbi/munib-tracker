import { ForbiddenException } from "@nestjs/common";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { SyncRecordEntity } from "../database/entities";
import { buildMockAuthService } from "../test-support/auth";
import { buildAuthUser } from "../test-support/fixtures/user";
import { asRepository, buildMockRepository } from "../test-support/repositories";
import type { SyncPushDto } from "./dto/sync.dto";
import { SyncService } from "./sync.service";

const NOW = "2026-06-01T00:00:00.000Z";

function buildSyncRecord(overrides: Partial<SyncRecordEntity> = {}): SyncRecordEntity {
  return {
    id: "row-1",
    userId: "user-1",
    entity: "settings",
    recordId: "s",
    data: {},
    updatedAt: new Date("2026-05-01T00:00:00.000Z"),
    deletedAt: null,
    ...overrides,
  } as SyncRecordEntity;
}

function setup(user = buildAuthUser()) {
  const repo = buildMockRepository();
  const service = new SyncService(
    asRepository<SyncRecordEntity>(repo),
    buildMockAuthService(user).asService(),
  );
  const push = (...changes: Record<string, unknown>[]) =>
    service.push("tok", { changes } as unknown as SyncPushDto);
  const savedRow = () => repo.create.mock.calls[0]?.[0];
  return { repo, service, push, savedRow };
}

const change = (overrides: Record<string, unknown> = {}) => ({
  entity: "settings",
  id: "s",
  data: {},
  updatedAt: "2026-05-15T00:00:00.000Z",
  ...overrides,
});

describe("SyncService (unit)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(NOW));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("forbids guests", async () => {
    const { service } = setup(buildAuthUser({ accountType: "guest" }));
    await expect(service.pull("tok")).rejects.toBeInstanceOf(ForbiddenException);
  });

  describe("push", () => {
    it("skips changes with unparseable timestamps", async () => {
      const { repo, push } = setup();
      await push(change({ updatedAt: "not-a-date" }));
      expect(repo.findOne).not.toHaveBeenCalled();
      expect(repo.save).not.toHaveBeenCalled();
    });

    it("counts skipped changes as accepted", async () => {
      const { push } = setup();
      await expect(push(change({ updatedAt: "not-a-date" }))).resolves.toMatchObject({
        accepted: 1,
        conflicts: [],
      });
    });

    it.each([
      ["clamps far-future clocks to server time", "2027-01-01T00:00:00.000Z", NOW],
      ["keeps skews within five minutes", "2026-06-01T00:04:00.000Z", "2026-06-01T00:04:00.000Z"],
    ])("%s", async (_label, updatedAt, stored) => {
      const { push, savedRow } = setup();
      await push(change({ updatedAt }));
      expect(savedRow()?.updatedAt).toEqual(new Date(stored));
    });

    it.each([
      ["parses deletedAt", "2026-05-31T00:00:00.000Z", new Date("2026-05-31T00:00:00.000Z")],
      ["stores null without deletedAt", undefined, null],
    ])("%s", async (_label, deletedAt, expected) => {
      const { push, savedRow } = setup();
      await push(change({ deletedAt }));
      expect(savedRow()?.deletedAt).toEqual(expected);
    });

    it("overwrites an older stored row in place", async () => {
      const { repo, push, savedRow } = setup();
      repo.findOne.mockResolvedValue(buildSyncRecord());
      await push(change());
      expect(savedRow()).toMatchObject({ id: "row-1", userId: "user-1", recordId: "s" });
    });

    it("inserts a new row when none exists", async () => {
      const { push, savedRow } = setup();
      await push(change());
      expect(savedRow()?.id).toBeUndefined();
    });
  });

  describe("pull", () => {
    it("queries every record for the user without since", async () => {
      const { repo, service } = setup();
      await service.pull("tok");
      expect(repo.find).toHaveBeenCalledWith({
        where: { userId: "user-1" },
        order: { updatedAt: "ASC" },
      });
    });

    it("maps records to DTOs with optional deletedAt", async () => {
      const { repo, service } = setup();
      repo.find.mockResolvedValue([
        buildSyncRecord({ data: { x: 1 }, deletedAt: new Date("2026-05-02T00:00:00.000Z") }),
        buildSyncRecord({ recordId: "t" }),
      ]);

      const out = await service.pull("tok");

      expect(out.changes).toEqual([
        {
          entity: "settings",
          id: "s",
          data: { x: 1 },
          updatedAt: "2026-05-01T00:00:00.000Z",
          deletedAt: "2026-05-02T00:00:00.000Z",
        },
        {
          entity: "settings",
          id: "t",
          data: {},
          updatedAt: "2026-05-01T00:00:00.000Z",
          deletedAt: undefined,
        },
      ]);
    });

    it("reports the server time", async () => {
      const { service } = setup();
      await expect(service.pull("tok")).resolves.toMatchObject({ serverTime: NOW });
    });
  });
});
