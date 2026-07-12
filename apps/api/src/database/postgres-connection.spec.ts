import { describe, expect, it } from "vitest";
import { parseDatabaseUrl, resolvePostgresConnection } from "./postgres-connection";

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

  it("accepts the postgres:// scheme", () => {
    expect(parseDatabaseUrl("postgres://u:p@db.example.com:6543/munib").host).toBe(
      "db.example.com",
    );
  });

  it("rejects a malformed URI", () => {
    expect(() => parseDatabaseUrl("not-a-url")).toThrow(/not a valid Postgres URI/);
  });
});

describe("resolvePostgresConnection", () => {
  it("prefers DATABASE_URL over discrete DATABASE_* defaults", () => {
    const conn = resolvePostgresConnection({
      DATABASE_URL: "postgresql://app:secret@db.neon.tech:5432/munib",
      DATABASE_HOST: "localhost",
    });
    expect(conn.host).toBe("db.neon.tech");
    expect(conn.username).toBe("app");
    expect(conn.password).toBe("secret");
    expect(conn.database).toBe("munib");
    expect(conn.ssl).toMatchObject({ rejectUnauthorized: true });
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
    expect(conn).toMatchObject({
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
