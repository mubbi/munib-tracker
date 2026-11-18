import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  assertPostgresUtf8Encoding,
  isTransactionPoolerUrl,
  loadLocalApiEnvFile,
  POSTGRES_CLIENT_UTF8_OPTIONS,
  parseDatabaseUrl,
  resolvePostgresConnection,
  sanitizeDatabaseUrl,
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

describe("URL helpers (edge cases)", () => {
  const URL_WITH_PARAMS = "postgresql://u:p@db.example.com:5432/app?sslmode=require&supa=1&x=1";

  it.each([
    ["returns unparsable input unchanged", "not a url", undefined, "not a url"],
    [
      "drops supa* params but keeps sslmode by default",
      URL_WITH_PARAMS,
      undefined,
      "postgresql://u:p@db.example.com:5432/app?sslmode=require&x=1",
    ],
    [
      "drops sslmode when asked",
      URL_WITH_PARAMS,
      { stripSslMode: true },
      "postgresql://u:p@db.example.com:5432/app?x=1",
    ],
  ])("sanitizeDatabaseUrl %s", (_label, url, options, expected) => {
    expect(sanitizeDatabaseUrl(url, options)).toBe(expected);
  });

  it.each([
    ["postgresql://u:p@h:5432/db?pgbouncer=true", true],
    ["postgresql://u:p@h:5432/db", false],
    ["::::", false],
  ])("isTransactionPoolerUrl(%s) → %s", (url, expected) => {
    expect(isTransactionPoolerUrl(url)).toBe(expected);
  });

  it("toSessionPoolerUrl keeps non-6543 ports and the postgresql scheme", () => {
    expect(toSessionPoolerUrl("postgresql://u:p@h:5433/db?pgbouncer=true")).toBe(
      "postgresql://u:p@h:5433/db",
    );
  });

  it.each([
    [
      "another scheme",
      "mysql://u:p@h:3306/db",
      'must use the postgres/postgresql scheme (got "mysql")',
    ],
    ["no database name", "postgresql://u:p@h:5432/", "must include a host and database name"],
  ])("parseDatabaseUrl rejects %s", (_label, url, message) => {
    expect(() => parseDatabaseUrl(url)).toThrow(message);
  });

  it("parseDatabaseUrl defaults the user and password and decodes the database", () => {
    expect(parseDatabaseUrl("postgresql://h.example.com:5432/my%20db")).toEqual({
      host: "h.example.com",
      port: 5432,
      username: "postgres",
      password: "",
      database: "my db",
    });
  });

  it("parseDatabaseUrl decodes credentials", () => {
    expect(parseDatabaseUrl("postgresql://us%40er:p%2Fw@h:5432/db")).toMatchObject({
      username: "us@er",
      password: "p/w",
    });
  });
});

describe("resolvePostgresConnection (edge cases)", () => {
  const RUNTIME_URL = "postgresql://u:p@db.internal:5432/app";

  it("uses built-in defaults when nothing is configured", () => {
    expect(resolvePostgresConnection({})).toEqual({
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "postgres",
      database: "munib_tracker",
      ssl: false,
    });
  });

  it("strips sslmode from the URL but still enables SSL from it", () => {
    const conn = resolvePostgresConnection({ DATABASE_URL: `${RUNTIME_URL}?sslmode=verify-full` });
    expect(conn.url).toBe(RUNTIME_URL);
    expect(conn.ssl).toEqual({ rejectUnauthorized: true });
  });

  it.each(["false", "0"])("DATABASE_SSL_REJECT_UNAUTHORIZED=%s disables verification", (flag) => {
    const conn = resolvePostgresConnection({
      DATABASE_HOST: "db.internal",
      DATABASE_SSL: "1",
      DATABASE_SSL_REJECT_UNAUTHORIZED: flag,
    });
    expect(conn.ssl).toEqual({ rejectUnauthorized: false });
  });

  it("uses DATABASE_CA_CERT as the trust root", () => {
    const conn = resolvePostgresConnection({
      DATABASE_HOST: "db.internal",
      DATABASE_SSL: "true",
      DATABASE_CA_CERT: "-----BEGIN-----\\nabc\\n-----END-----",
    });
    expect(conn.ssl).toEqual({
      rejectUnauthorized: true,
      ca: "-----BEGIN-----\nabc\n-----END-----",
    });
  });

  it.each([
    ["neither URL is set", { DATABASE_HOST: "db.internal" }, undefined],
    ["the runtime URL is a session pooler", { DATABASE_URL: RUNTIME_URL }, RUNTIME_URL],
    [
      "DATABASE_MIGRATE_URL is blank",
      { DATABASE_MIGRATE_URL: "  ", DATABASE_URL: "postgresql://u:p@db.internal:6543/app" },
      RUNTIME_URL,
    ],
  ])("for migrations when %s, url is %j", (_label, env, expected) => {
    expect(resolvePostgresConnection(env, { forMigrate: true }).url).toBe(expected);
  });

  it("allows remote hosts on Vercel", () => {
    expect(resolvePostgresConnection({ VERCEL: "1", DATABASE_HOST: "db.internal" }).host).toBe(
      "db.internal",
    );
  });

  it.each(["::1", " 127.0.0.1 "])("rejects loopback host %j on Vercel", (host) => {
    expect(() => resolvePostgresConnection({ VERCEL: "1", DATABASE_HOST: host })).toThrow(
      /Postgres resolved to localhost/,
    );
  });
});

describe("assertPostgresUtf8Encoding (edge cases)", () => {
  it.each([
    ["lower-case utf-8", [{ server_encoding: "utf-8" }]],
    ["no rows", []],
    ["a row without an encoding", [{}]],
  ])("accepts %s", async (_label, rows) => {
    await expect(assertPostgresUtf8Encoding(async () => rows)).resolves.toBeUndefined();
  });
});

describe("loadLocalApiEnvFile", () => {
  /** Temp cwd with an optional `.env` body (or a directory named `.env`). */
  async function setup(envFile?: string | { directory: true }) {
    const dir = await mkdtemp(join(tmpdir(), "munib-env-"));
    vi.spyOn(process, "cwd").mockReturnValue(dir);
    if (typeof envFile === "string") await writeFile(join(dir, ".env"), envFile);
    if (typeof envFile === "object") await mkdir(join(dir, ".env"));
    return dir;
  }

  const dirs: string[] = [];

  afterEach(async () => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    await Promise.all(dirs.splice(0).map((d) => rm(d, { recursive: true, force: true })));
  });

  async function load(envFile: string | { directory: true } | undefined, env: NodeJS.ProcessEnv) {
    dirs.push(await setup(envFile));
    loadLocalApiEnvFile(env);
    return env;
  }

  it("skips entirely on Vercel", async () => {
    await expect(load("A=1\n", { VERCEL: "1" })).resolves.toEqual({ VERCEL: "1" });
  });

  it("does nothing without a .env file", async () => {
    await expect(load(undefined, {})).resolves.toEqual({});
  });

  it("ignores an unreadable .env path", async () => {
    await expect(load({ directory: true }, {})).resolves.toEqual({});
  });

  it.each([
    [
      "a plain value",
      "DATABASE_URL=postgresql://u:p@h:5432/db",
      "DATABASE_URL",
      "postgresql://u:p@h:5432/db",
    ],
    ["a double-quoted value", 'QUOTED="hello world"', "QUOTED", "hello world"],
    ["a single-quoted value", "SINGLE='single'", "SINGLE", "single"],
    ["an unbalanced quote", 'HALF="open', "HALF", '"open'],
    ["padded key and value", "  SPACED  =  value  ", "SPACED", "value"],
  ])("parses %s", async (_label, line, key, value) => {
    await expect(load(`${line}\r\n`, {})).resolves.toEqual({ [key]: value });
  });

  it.each([
    ["comments", "# comment"],
    ["blank lines", ""],
    ["lines without a key", "=novalue"],
    ["lines without =", "NOEQUALS"],
  ])("skips %s", async (_label, line) => {
    await expect(load(`${line}\n`, {})).resolves.toEqual({});
  });

  it("never overrides variables that are already set", async () => {
    await expect(load("EXISTING=from-file\n", { EXISTING: "from-env" })).resolves.toEqual({
      EXISTING: "from-env",
    });
  });

  it("defaults to process.env", async () => {
    vi.stubEnv("MUNIB_TEST_ENV_LOADER", undefined);
    dirs.push(await setup("MUNIB_TEST_ENV_LOADER=yes\n"));
    loadLocalApiEnvFile();
    expect(process.env.MUNIB_TEST_ENV_LOADER).toBe("yes");
  });
});
