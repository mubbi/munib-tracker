import { describe, expect, it } from "vitest";
import { hostRequiresDatabaseSsl, resolveDatabaseSsl } from "./database-ssl";

describe("hostRequiresDatabaseSsl", () => {
  it("detects Supabase / Neon / AWS RDS-style hosts", () => {
    expect(hostRequiresDatabaseSsl("db.abcdefgh.supabase.co")).toBe(true);
    expect(hostRequiresDatabaseSsl("aws-0-eu-central-1.pooler.supabase.com")).toBe(true);
    expect(hostRequiresDatabaseSsl("ep-cool-name.eu-central-1.aws.neon.tech")).toBe(true);
    expect(hostRequiresDatabaseSsl("munib.cluster-xyz.eu-central-1.rds.amazonaws.com")).toBe(true);
    expect(hostRequiresDatabaseSsl("localhost")).toBe(false);
  });
});

describe("resolveDatabaseSsl", () => {
  it("returns false (plaintext) when SSL is disabled", () => {
    expect(resolveDatabaseSsl({ enabled: false, rejectUnauthorized: true })).toBe(false);
  });

  it("verifies the certificate chain by default when SSL is enabled", () => {
    expect(resolveDatabaseSsl({ enabled: true, rejectUnauthorized: true })).toEqual({
      rejectUnauthorized: true,
    });
  });

  it("never silently keeps rejectUnauthorized off unless explicitly configured", () => {
    // The insecure legacy behaviour was a hardcoded { rejectUnauthorized: false }.
    // With the secure default the flag is only false when an operator opts in.
    const secure = resolveDatabaseSsl({ enabled: true, rejectUnauthorized: true });
    expect(secure).toMatchObject({ rejectUnauthorized: true });

    const optedOut = resolveDatabaseSsl({ enabled: true, rejectUnauthorized: false });
    expect(optedOut).toMatchObject({ rejectUnauthorized: false });
  });

  it("expands and attaches a PEM CA bundle with literal \\n sequences", () => {
    const result = resolveDatabaseSsl({
      enabled: true,
      rejectUnauthorized: true,
      ca: "-----BEGIN CERTIFICATE-----\\nMIIF\\n-----END CERTIFICATE-----",
    });
    expect(result).toEqual({
      rejectUnauthorized: true,
      ca: "-----BEGIN CERTIFICATE-----\nMIIF\n-----END CERTIFICATE-----",
    });
  });

  it("ignores a blank CA string", () => {
    expect(resolveDatabaseSsl({ enabled: true, rejectUnauthorized: true, ca: "   " })).toEqual({
      rejectUnauthorized: true,
    });
  });
});
