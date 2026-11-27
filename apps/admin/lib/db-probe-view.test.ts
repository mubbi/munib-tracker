import { describe, expect, it } from "vitest";
import { dbProbeResponseBody } from "./db-probe-view";

const failing = {
  configured: true,
  connected: true,
  adminTables: false,
  database: "postgres",
  host: "aws-0-eu.pooler.supabase.com",
  port: "5432",
  pgCode: "42P01",
  errorCode: "db_schema",
  errorDetail: 'relation "admin_users" does not exist',
};

describe("dbProbeResponseBody", () => {
  it("hides host, database and driver detail from anonymous callers", () => {
    const body = dbProbeResponseBody(failing, false);
    expect(body).toEqual({
      ok: false,
      configured: true,
      connected: true,
      adminTables: false,
      errorCode: "db_schema",
    });
    expect(JSON.stringify(body)).not.toContain("supabase");
  });

  it("returns full diagnostics to an authenticated caller", () => {
    expect(dbProbeResponseBody(failing, true)).toEqual({ ok: false, ...failing });
  });

  it("reports ok only when connected with admin tables", () => {
    const healthy = { ...failing, adminTables: true, errorCode: undefined };
    expect(dbProbeResponseBody(healthy, false)).toEqual({
      ok: true,
      configured: true,
      connected: true,
      adminTables: true,
    });
  });
});
