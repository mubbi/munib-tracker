import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { describe, expect, it } from "vitest";
import { MAX_SYNC_PUSH_CHANGES, SyncPushDto } from "./sync.dto";

function makeChange(index: number) {
  return {
    entity: "prayer_logs",
    id: `log-${index}`,
    data: { status: "completed" },
    updatedAt: "2026-01-01T00:00:00.000Z",
  };
}

describe("SyncPushDto validation", () => {
  it("accepts a push at the maximum change count", () => {
    const dto = plainToInstance(SyncPushDto, {
      changes: Array.from({ length: MAX_SYNC_PUSH_CHANGES }, (_, i) => makeChange(i)),
    });
    expect(validateSync(dto)).toHaveLength(0);
  });

  it("rejects a push that exceeds the maximum change count (DoS bound)", () => {
    const dto = plainToInstance(SyncPushDto, {
      changes: Array.from({ length: MAX_SYNC_PUSH_CHANGES + 1 }, (_, i) => makeChange(i)),
    });
    const errors = validateSync(dto);
    expect(errors).not.toHaveLength(0);
    expect(errors[0]?.constraints).toHaveProperty("arrayMaxSize");
  });
});
