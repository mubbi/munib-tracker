import { describe, expect, it } from "vitest";
import {
  assertPostgresUtf8Encoding,
  isTransactionPoolerUrl,
  POSTGRES_CLIENT_UTF8_OPTIONS,
  parseDatabaseUrl,
  resolvePostgresConnection,
  toSessionPoolerUrl,
  toTypeOrmPostgresOptions,
} from "./postgres-connection";

describe("parseDatabaseUrl", () => {
  it("parses a Session-pooler style URI", () => {
    expect(
      parseDatabaseUrl(
        "postgresql://postgres.abc:s3cret%21@aws-0-eu-central-1.pooler.supabase.com:5432/postgres",
      ),
    ).toEqual({
      host: "aws-0-eu-central-1.pooler.supabase.com",
      port: 5432,
      username: "postgres.abc",
      password: "s3cret!",
      database: "postgres",
    });
  });

  it("strips invalid supa* query params", () => {
    const parsed = parseDatabaseUrl(
      "postgresql://u:p@aws-0.pooler.supabase.com:5432/postgres?supa=base-pooler.x",
    );
    expect(parsed.host).toBe("aws-0.pooler.supabase.com");
  });

  it("accepts the postgres:// scheme", () => {
    expect(parseDatabaseUrl("postgres://u:p@db.example.com:6543/munib").host).toBe(
      "db.example.com",
    );
  });

  it("rejects a malformed URI", () => {
    expect(() => parseDatabaseUrl("not-a-url")).toThrow(/not a valid Postgres URI/);
  });
});

describe("migrate pooler rewrite", () => {
  it("upgrades transaction pooler URLs when forMigrate is set", () => {
    const conn = resolvePostgresConnection(
      {
        DATABASE_URL: "postgresql://u:p@aws-0.pooler.supabase.com:6543/postgres",
      },
      { forMigrate: true },
    );
    expect(conn.url).toContain(":5432/");
    expect(conn.port).toBe(5432);
    expect(isTransactionPoolerUrl(conn.url ?? "")).toBe(false);
  });

  it("prefers DATABASE_MIGRATE_URL for migrations", () => {
    const conn = resolvePostgresConnection(
      {
        DATABASE_URL: "postgresql://u:p@aws-0.pooler.supabase.com:6543/postgres",
        DATABASE_MIGRATE_URL: "postgresql://u:p@db.example.com:5432/munib",
      },
      { forMigrate: true },
    );
    expect(conn.url).toBe("postgresql://u:p@db.example.com:5432/munib");
  });

  it("toSessionPoolerUrl rewrites 6543", () => {
    expect(toSessionPoolerUrl("postgresql://u:p@host:6543/db")).toBe(
      "postgresql://u:p@host:5432/db",
    );
  });
});

describe("resolvePostgresConnection", () => {
  it("prefers DATABASE_URL and exposes TypeORM url option", () => {
    const conn = resolvePostgresConnection({
      DATABASE_URL: "postgresql://app:secret@db.neon.tech:5432/munib",
      DATABASE_HOST: "localhost",
    });
    expect(conn.url).toBe("postgresql://app:secret@db.neon.tech:5432/munib");
    expect(conn.host).toBe("db.neon.tech");
    expect(toTypeOrmPostgresOptions(conn)).toEqual({
      type: "postgres",
      url: "postgresql://app:secret@db.neon.tech:5432/munib",
      ssl: { rejectUnauthorized: true },
      extra: { options: POSTGRES_CLIENT_UTF8_OPTIONS },
    });
  });

  it("forces UTF-8 client encoding so Windows WIN1252 locales accept Arabic", () => {
    const conn = resolvePostgresConnection({
      DATABASE_HOST: "localhost",
      DATABASE_PASSWORD: "postgres",
    });
    expect(toTypeOrmPostgresOptions(conn).extra).toEqual({
      options: POSTGRES_CLIENT_UTF8_OPTIONS,
    });
  });

  it("pins Supabase CA and strips sslmode from the URL", () => {
    const conn = resolvePostgresConnection({
      DATABASE_URL:
        "postgresql://u:p@aws-0.pooler.supabase.com:5432/postgres?sslmode=require&supa=base-pooler.x",
    });
    expect(conn.url).not.toContain("sslmode=");
    expect(conn.url).not.toContain("supa=");
    expect(conn.ssl).toMatchObject({ rejectUnauthorized: true });
    expect(conn.ssl).toHaveProperty("ca");
  });

  it("falls back to discrete DATABASE_* vars", () => {
    const conn = resolvePostgresConnection({
      DATABASE_HOST: "db.example.com",
      DATABASE_PORT: "5433",
      DATABASE_USER: "munib",
      DATABASE_PASSWORD: "pw",
      DATABASE_NAME: "tracker",
      DATABASE_SSL: "true",
    });
    expect(conn.url).toBeUndefined();
    expect(toTypeOrmPostgresOptions(conn)).toMatchObject({
      type: "postgres",
      host: "db.example.com",
      port: 5433,
      username: "munib",
      password: "pw",
      database: "tracker",
      ssl: { rejectUnauthorized: true },
    });
  });

  it("fails fast on Vercel when still resolving to localhost", () => {
    expect(() =>
      resolvePostgresConnection({
        VERCEL: "1",
        DATABASE_HOST: "localhost",
      }),
    ).toThrow(/Postgres resolved to localhost during a Vercel build/);
  });

  it("allows localhost outside Vercel (local migrations)", () => {
    const conn = resolvePostgresConnection({
      DATABASE_HOST: "localhost",
      DATABASE_PASSWORD: "postgres",
    });
    expect(conn.host).toBe("localhost");
    expect(conn.ssl).toBe(false);
  });
});

describe("assertPostgresUtf8Encoding", () => {
  it("allows UTF8", async () => {
    await expect(
      assertPostgresUtf8Encoding(async () => [{ server_encoding: "UTF8" }]),
    ).resolves.toBeUndefined();
  });

  it("rejects WIN1252 with a recreate hint", async () => {
    await expect(
      assertPostgresUtf8Encoding(async () => [{ server_encoding: "WIN1252" }]),
    ).rejects.toThrow(/ENCODING 'UTF8'/);
  });
});
