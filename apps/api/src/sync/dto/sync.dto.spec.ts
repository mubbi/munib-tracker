import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { describe, expect, it } from "vitest";
import {
  MAX_SYNC_PUSH_CHANGES,
  RETIRED_SYNC_ENTITIES,
  SYNC_ENTITIES,
  SyncPushDto,
} from "./sync.dto";

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

  it("accepts rawatib prayer logs (NF-3.1) — prayer ids are not whitelisted server-side", () => {
    const dto = plainToInstance(SyncPushDto, {
      changes: ["fajr_before", "dhuhr_before", "isha_after", "dhuhr_after_extra"].map(
        (prayerId) => ({
          entity: "prayer_logs",
          id: `${prayerId}::2026-03-10`,
          data: { prayerId, date: "2026-03-10", status: "completed", rakahs: 4, late: true },
          updatedAt: "2026-03-10T08:00:00.000Z",
        }),
      ),
    });
    expect(validateSync(dto)).toHaveLength(0);
  });

  it("still accepts retired entities so an old client's batch is not rejected", () => {
    const dto = plainToInstance(SyncPushDto, {
      changes: [
        makeChange(0),
        ...RETIRED_SYNC_ENTITIES.map((entity) => ({ ...makeChange(1), entity, id: entity })),
      ],
    });
    expect(validateSync(dto)).toHaveLength(0);
    for (const entity of RETIRED_SYNC_ENTITIES) {
      expect(SYNC_ENTITIES as readonly string[]).not.toContain(entity);
    }
  });

  it("rejects the whole batch for an unknown entity", () => {
    const dto = plainToInstance(SyncPushDto, {
      changes: [makeChange(0), { ...makeChange(1), entity: "no_such_entity" }],
    });
    expect(validateSync(dto)).not.toHaveLength(0);
  });
});
