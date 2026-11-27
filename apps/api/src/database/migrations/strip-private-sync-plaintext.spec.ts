import type { QueryRunner } from "typeorm";
import { describe, expect, it, vi } from "vitest";

import { StripPrivateSyncPlaintext1720000013000 } from "./1720000013000-StripPrivateSyncPlaintext";

describe("StripPrivateSyncPlaintext migration (D46)", () => {
  it("strips excused reasons, deletes khushu rows and rounds locations", async () => {
    const query = vi.fn(async () => undefined);
    await new StripPrivateSyncPlaintext1720000013000().up({ query } as unknown as QueryRunner);

    const sql = query.mock.calls.map((call) => String((call as unknown[])[0]));
    expect(sql).toHaveLength(4);
    expect(sql[0]).toContain("- 'activeExcusedReason'");
    expect(sql[0]).toContain(`"entity" = 'preferences'`);
    expect(sql[1]).toContain("- 'excusedReason'");
    expect(sql[1]).toContain(`"entity" = 'prayer_logs'`);
    expect(sql[2]).toBe(`DELETE FROM "sync_records" WHERE "entity" = 'khushu_journal'`);
    expect(sql[3]).toContain("round(");
    expect(sql[3]).toContain(", 2)");
    expect(sql[3]).toContain(`"entity" = 'location'`);
  });

  it("has nothing to restore on down", async () => {
    await expect(new StripPrivateSyncPlaintext1720000013000().down()).resolves.toBeUndefined();
  });
});
