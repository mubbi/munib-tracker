import { describe, expect, it } from "vitest";
import {
  adminDbErrorMessage,
  classifyAdminDatabaseError,
  extractPgError,
  sanitizeDatabaseErrorDetail,
} from "./db-errors";

describe("extractPgError", () => {
  it("extracts code and message from pg error object", () => {
    const pg = { code: "42P01", message: "relation does not exist" };
    expect(extractPgError(pg)).toEqual(pg);
  });

  it("walks Error.cause chain", () => {
    const pg = { code: "08006", message: "connection failure" };
    const error = new Error("wrapper", { cause: pg });
    expect(extractPgError(error)).toEqual(pg);
  });

  it("returns null when no pg error found", () => {
    expect(extractPgError(new Error("plain"))).toBeNull();
    expect(extractPgError("string error")).toBeNull();
  });
});

describe("classifyAdminDatabaseError", () => {
  it("classifies undefined table as db_schema", () => {
    expect(classifyAdminDatabaseError({ code: "42P01", message: "relation admin_users" })).toBe(
      "db_schema",
    );
  });

  it("classifies connection codes as db_connect", () => {
    expect(classifyAdminDatabaseError({ code: "08006", message: "connection terminated" })).toBe(
      "db_connect",
    );
    expect(classifyAdminDatabaseError({ code: "57P01", message: "admin shutdown" })).toBe(
      "db_connect",
    );
  });

  it("classifies relation missing messages as db_schema", () => {
    const error = new Error('relation "admin_users" does not exist');
    expect(classifyAdminDatabaseError(error)).toBe("db_schema");
  });

  it("classifies network errors as db_connect", () => {
    expect(classifyAdminDatabaseError(new Error("connect ECONNREFUSED"))).toBe("db_connect");
    expect(classifyAdminDatabaseError(new Error("getaddrinfo ENOTFOUND"))).toBe("db_connect");
  });

  it("defaults to db_unavailable", () => {
    expect(classifyAdminDatabaseError(new Error("syntax error"))).toBe("db_unavailable");
  });
});

describe("adminDbErrorMessage", () => {
  it("returns guidance for each code", () => {
    expect(adminDbErrorMessage("db_schema")).toContain("Admin tables");
    expect(adminDbErrorMessage("db_connect")).toContain("Could not connect");
    expect(adminDbErrorMessage("db_unavailable")).toContain("Database error");
  });
});

describe("sanitizeDatabaseErrorDetail", () => {
  it("redacts postgres URLs and truncates", () => {
    const detail = sanitizeDatabaseErrorDetail(
      new Error("failed postgresql://user:secret@host/db connection"),
    );
    expect(detail).toContain("postgresql://***");
    expect(detail).not.toContain("secret");
  });

  it("includes pg code when present", () => {
    const detail = sanitizeDatabaseErrorDetail({ code: "42P01", message: "missing table" });
    expect(detail).toBe("missing table [42P01]");
  });

  it("truncates long messages", () => {
    const detail = sanitizeDatabaseErrorDetail(new Error("x".repeat(400)));
    expect(detail.length).toBeLessThanOrEqual(280);
  });
});
