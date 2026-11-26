import type { QueryRunner } from "typeorm";
import { describe, expect, it, vi } from "vitest";

import { EraseClosedAccountEmails1720000014000 } from "./1720000014000-EraseClosedAccountEmails";

describe("EraseClosedAccountEmails migration", () => {
  it("rewrites legacy tombstones to the PII-free form", async () => {
    const query = vi.fn(async () => undefined);
    await new EraseClosedAccountEmails1720000014000().up({ query } as unknown as QueryRunner);

    const [sql] = query.mock.calls.map((call) => String((call as unknown[])[0]));
    expect(query).toHaveBeenCalledTimes(1);
    expect(sql).toContain(`UPDATE "users"`);
    expect(sql).toContain(`substring("email" from 1 for 41) || 'closed'`);
    expect(sql).toContain(`'^deleted_[a-f0-9]{32}_'`);
  });

  it("keeps the 41-character prefix of a closed-account marker", () => {
    const legacy = "deleted_a1b2c3d4e5f6789012345678abcdef90_user@example.com";
    expect(`${legacy.slice(0, 41)}closed`).toBe("deleted_a1b2c3d4e5f6789012345678abcdef90_closed");
  });

  it("has nothing to restore on down", async () => {
    await expect(new EraseClosedAccountEmails1720000014000().down()).resolves.toBeUndefined();
  });
});
