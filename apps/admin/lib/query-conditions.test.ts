import { sql } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { ACTIVE_USER_SQL, GUEST_USER_SQL, whereAll } from "./query-conditions";

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
});
