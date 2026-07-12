import { describe, expect, it } from "vitest";
import {
  isTransactionPoolerUrl,
  preparePgConnection,
  resolveMigrateDatabaseUrl,
  sanitizeDatabaseUrl,
  toSessionPoolerUrl,
} from "./preparePgConnection";

describe("sanitizeDatabaseUrl", () => {
  it("strips invalid supa* query params", () => {
    const out = sanitizeDatabaseUrl(
      "postgresql://u:p@aws-0.pooler.supabase.com:5432/postgres?supa=base-pooler.x&sslmode=require",
      { stripSslMode: true },
    );
    expect(out).not.toContain("supa=");
    expect(out).not.toContain("sslmode=");
    expect(out).toContain("pooler.supabase.com");
  });
});

describe("transaction → session pooler", () => {
  it("detects port 6543 and pgbouncer=true", () => {
    expect(isTransactionPoolerUrl("postgresql://u:p@aws-0.pooler.supabase.com:6543/postgres")).toBe(
      true,
    );
    expect(
      isTransactionPoolerUrl(
        "postgresql://u:p@aws-0.pooler.supabase.com:5432/postgres?pgbouncer=true",
      ),
    ).toBe(true);
    expect(isTransactionPoolerUrl("postgresql://u:p@aws-0.pooler.supabase.com:5432/postgres")).toBe(
      false,
    );
  });

  it("rewrites 6543 to 5432", () => {
    expect(toSessionPoolerUrl("postgresql://u:p@aws-0.pooler.supabase.com:6543/postgres")).toBe(
      "postgresql://u:p@aws-0.pooler.supabase.com:5432/postgres",
    );
  });

  it("resolveMigrateDatabaseUrl prefers DATABASE_MIGRATE_URL then upgrades", () => {
    expect(
      resolveMigrateDatabaseUrl({
        DATABASE_MIGRATE_URL: "postgresql://u:p@db.example.com:5432/munib",
        DATABASE_URL: "postgresql://u:p@db.example.com:6543/munib",
      }),
    ).toBe("postgresql://u:p@db.example.com:5432/munib");

    expect(
      resolveMigrateDatabaseUrl({
        DATABASE_URL: "postgresql://u:p@db.example.com:6543/munib",
      }),
    ).toBe("postgresql://u:p@db.example.com:5432/munib");
  });
});

describe("preparePgConnection", () => {
  it("enables verified TLS for Supabase hosts", () => {
    const conn = preparePgConnection(
      "postgresql://u:p@aws-0-eu.pooler.supabase.com:5432/postgres",
      {},
    );
    expect(conn.ssl).toMatchObject({ rejectUnauthorized: true });
    expect(conn.connectionString).not.toContain("sslmode=");
  });

  it("keeps localhost plaintext", () => {
    const conn = preparePgConnection("postgresql://postgres:@localhost:5432/munib", {});
    expect(conn.ssl).toBeUndefined();
  });
});
