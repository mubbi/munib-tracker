import { usersTable } from "@munib-tracker/db/schema";
import { sql } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { ACTIVE_USER_SQL, dateRangeOn, GUEST_USER_SQL, whereAll } from "./query-conditions";

describe("query-conditions", () => {
  it("exports linked/guest SQL fragments", () => {
    expect(ACTIVE_USER_SQL).toBeTruthy();
    expect(GUEST_USER_SQL).toBeTruthy();
  });

  it("whereAll returns undefined when no conditions", () => {
    expect(whereAll([])).toBeUndefined();
    expect(whereAll([undefined, undefined])).toBeUndefined();
  });

  it("whereAll combines defined conditions", () => {
    const a = sql`1 = 1`;
    const b = sql`2 = 2`;
    const combined = whereAll([undefined, a, undefined, b]);
    expect(combined).toBeTruthy();
  });

  it("dateRangeOn is undefined without bounds", () => {
    expect(dateRangeOn(usersTable.createdAt)).toBeUndefined();
  });

  it.each([
    ["from only", new Date("2026-01-01"), undefined],
    ["to only", undefined, new Date("2026-02-01")],
    ["both bounds", new Date("2026-01-01"), new Date("2026-02-01")],
  ])("dateRangeOn builds a condition with %s", (_label, from, to) => {
    expect(dateRangeOn(usersTable.createdAt, from, to)).toBeDefined();
  });
});
