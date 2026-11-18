import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, afterEach, describe, expect, it, vi } from "vitest";
import {
  isLocalHost,
  isSupabaseHost,
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
  it("enables verified TLS with pinned Supabase CA", () => {
    const conn = preparePgConnection(
      "postgresql://u:p@aws-0-eu.pooler.supabase.com:5432/postgres",
      {},
    );
    expect(conn.ssl).toMatchObject({ rejectUnauthorized: true });
    expect(conn.ssl).toHaveProperty("ca");
    expect(conn.ssl?.ca).toContain("BEGIN CERTIFICATE");
    expect(conn.connectionString).not.toContain("sslmode=");
  });

  it("keeps localhost plaintext", () => {
    const conn = preparePgConnection("postgresql://postgres:@localhost:5432/munib", {});
    expect(conn.ssl).toBeUndefined();
  });

  it("relaxes verification when DATABASE_SSL_REJECT_UNAUTHORIZED=false", () => {
    const conn = preparePgConnection(
      "postgresql://u:p@aws-0-eu.pooler.supabase.com:5432/postgres",
      { DATABASE_SSL_REJECT_UNAUTHORIZED: "false" },
    );
    expect(conn.ssl).toEqual({ rejectUnauthorized: false });
  });
});

const GENERIC = "postgresql://u@db.example.com/x";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("isLocalHost", () => {
  it.each([
    [" LOCALHOST ", true],
    ["127.0.0.1", true],
    ["::1", true],
    ["db.example.com", false],
  ])("%j -> %s", (host, expected) => {
    expect(isLocalHost(host)).toBe(expected);
  });
});

describe("isSupabaseHost", () => {
  it.each([
    ["supabase.com", true],
    ["SUPABASE.CO", true],
    ["db.abc.supabase.co", true],
    ["notsupabase.com", false],
  ])("%j -> %s", (host, expected) => {
    expect(isSupabaseHost(host)).toBe(expected);
  });
});

describe("sanitizeDatabaseUrl edge cases", () => {
  it("keeps the postgres:// scheme and sslmode unless asked to strip it", () => {
    expect(
      sanitizeDatabaseUrl("postgres://u:p@db.example.com:5432/x?sslmode=require&supa=1&a=b"),
    ).toBe("postgres://u:p@db.example.com:5432/x?sslmode=require&a=b");
  });

  it("returns unparsable URLs unchanged", () => {
    expect(sanitizeDatabaseUrl("not a url")).toBe("not a url");
  });
});

describe("pooler helpers edge cases", () => {
  it("treats unparsable URLs as non-pooler", () => {
    expect(isTransactionPoolerUrl("::::")).toBe(false);
  });

  it.each([
    ["postgres://u:p@db.example.com:6543/x?pgbouncer=true", "postgres://u:p@db.example.com:5432/x"],
    ["postgresql://u:p@db.example.com:5433/x", "postgresql://u:p@db.example.com:5433/x"],
  ])("toSessionPoolerUrl(%s) -> %s", (url, expected) => {
    expect(toSessionPoolerUrl(url)).toBe(expected);
  });

  it.each([
    [{}, undefined],
    [{ DATABASE_MIGRATE_URL: "  ", DATABASE_URL: " " }, undefined],
    [{ DATABASE_URL: " postgresql://u@h:5432/x " }, "postgresql://u@h:5432/x"],
  ])("resolveMigrateDatabaseUrl(%j) -> %s", (env, expected) => {
    expect(resolveMigrateDatabaseUrl(env)).toBe(expected);
  });

  it("resolveMigrateDatabaseUrl defaults to process.env", () => {
    vi.stubEnv("DATABASE_MIGRATE_URL", "postgresql://u@h:6543/x");

    expect(resolveMigrateDatabaseUrl()).toBe("postgresql://u@h:5432/x");
  });
});

describe("preparePgConnection SSL resolution", () => {
  const tmp = mkdtempSync(join(tmpdir(), "munib-db-ca-"));

  afterAll(() => {
    rmSync(tmp, { recursive: true, force: true });
  });

  it.each([
    ["sslmode=disable", `${GENERIC}?sslmode=disable`, {}],
    ["an unknown host", GENERIC, {}],
    ["an unparsable URL", "not a url", {}],
  ])("stays plaintext for %s", (_label, url, env) => {
    expect(preparePgConnection(url, env)).toEqual({ connectionString: url });
  });

  it.each([
    [
      "DATABASE_SSL_NO_VERIFY=1",
      "postgresql://u@localhost/x",
      { DATABASE_SSL_NO_VERIFY: "1" },
      "postgresql://u@localhost/x",
    ],
    [
      "DATABASE_SSL_REJECT_UNAUTHORIZED=0",
      GENERIC,
      { DATABASE_SSL_REJECT_UNAUTHORIZED: "0" },
      GENERIC,
    ],
    ["sslmode=no-verify", `${GENERIC}?sslmode=no-verify`, {}, GENERIC],
    [
      "a forced flag on an unparsable URL",
      "not a url",
      { DATABASE_SSL_NO_VERIFY: "true" },
      "not a url",
    ],
  ])("relaxes verification for %s", (_label, url, env, connectionString) => {
    expect(preparePgConnection(url, env)).toEqual({
      connectionString,
      ssl: { rejectUnauthorized: false },
    });
  });

  it.each([
    ["sslmode=require", `${GENERIC}?sslmode=require`, {}],
    ["sslmode=verify-full", `${GENERIC}?sslmode=verify-full`, {}],
    ["sslmode=verify-ca", `${GENERIC}?sslmode=verify-ca`, {}],
    ["DATABASE_SSL=true", GENERIC, { DATABASE_SSL: "true" }],
    ["a Neon subdomain", "postgresql://u@ep-1.eu.aws.neon.tech/x", {}],
    ["the Neon apex", "postgresql://u@neon.tech/x", {}],
    ["an AWS RDS host", "postgresql://u@x.rds.amazonaws.com/x", {}],
  ])("requires verified TLS without a pinned CA for %s", (_label, url, env) => {
    expect(preparePgConnection(url, env).ssl).toEqual({ rejectUnauthorized: true });
  });

  it("uses an inline PEM CA with escaped newlines", () => {
    const conn = preparePgConnection(`${GENERIC}?sslmode=require`, {
      DATABASE_CA_CERT: "-----BEGIN CERTIFICATE-----\\nabc\\n-----END CERTIFICATE-----",
    });

    expect(conn.ssl?.ca).toBe("-----BEGIN CERTIFICATE-----\nabc\n-----END CERTIFICATE-----");
  });

  it("reads the CA from a file path in DATABASE_SSL_CA", () => {
    const path = join(tmp, "ca.pem");
    writeFileSync(path, "FILE-CA");

    const conn = preparePgConnection(`${GENERIC}?sslmode=require`, {
      DATABASE_CA_CERT: " ",
      DATABASE_SSL_CA: path,
    });

    expect(conn.ssl).toEqual({ rejectUnauthorized: true, ca: "FILE-CA" });
  });

  it("falls back to the raw value when the CA path cannot be read", () => {
    const conn = preparePgConnection(`${GENERIC}?sslmode=require`, {
      DATABASE_SSL_CA: join(tmp, "missing\\n.pem"),
    });

    expect(conn.ssl?.ca).toBe(join(tmp, "missing\n.pem"));
  });

  it("defaults env to process.env", () => {
    vi.stubEnv("DATABASE_SSL_NO_VERIFY", "true");

    expect(preparePgConnection("postgresql://u@localhost/x").ssl).toEqual({
      rejectUnauthorized: false,
    });
  });
});
