import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/contact-messages", () => ({
  CONTACT_RATE_LIMIT: 2,
  CONTACT_IP_RATE_LIMIT: 5,
  countRecentContactMessagesByEmail: vi.fn(),
  countRecentContactMessagesByIp: vi.fn(),
  insertContactMessage: vi.fn(),
}));

import {
  countRecentContactMessagesByEmail,
  countRecentContactMessagesByIp,
  insertContactMessage,
} from "@/lib/contact-messages";
import { POST } from "./route";

function makeRequest(body: unknown, ip = "203.0.113.1") {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": ip,
      "user-agent": "vitest",
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const validBody = {
  name: "Aisha",
  email: "aisha@example.com",
  message: "Salaam, I have a question.",
};

const countMock = vi.mocked(countRecentContactMessagesByEmail);
const ipCountMock = vi.mocked(countRecentContactMessagesByIp);
const insertMock = vi.mocked(insertContactMessage);

describe("POST /api/contact", () => {
  const originalDatabaseUrl = process.env.DATABASE_URL;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.DATABASE_URL = "postgres://localhost/test";
    countMock.mockResolvedValue(0);
    ipCountMock.mockResolvedValue(0);
    insertMock.mockResolvedValue("msg-id");
  });

  afterEach(() => {
    if (originalDatabaseUrl === undefined) {
      delete process.env.DATABASE_URL;
    } else {
      process.env.DATABASE_URL = originalDatabaseUrl;
    }
  });

  it("returns 503 when DATABASE_URL is not configured", async () => {
    delete process.env.DATABASE_URL;
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(503);
    const json = await res.json();
    expect(json.ok).toBeUndefined();
    expect(json.error).toBeTruthy();
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("stores the message and returns ok when configured", async () => {
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(insertMock).toHaveBeenCalledTimes(1);
    expect(insertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Aisha",
        email: "aisha@example.com",
        message: "Salaam, I have a question.",
        ipAddress: "203.0.113.1",
      }),
    );
  });

  it("returns 503 when insert fails", async () => {
    insertMock.mockRejectedValue(new Error("db down"));
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(503);
  });

  it("silently accepts (200) but does not store when the honeypot is filled", async () => {
    const res = await POST(makeRequest({ ...validBody, company: "AcmeBot" }));
    expect(res.status).toBe(200);
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("rejects an over-length message with 400", async () => {
    const res = await POST(makeRequest({ ...validBody, message: "x".repeat(5001) }));
    expect(res.status).toBe(400);
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("rejects an over-length name with 400", async () => {
    const res = await POST(makeRequest({ ...validBody, name: "x".repeat(101) }));
    expect(res.status).toBe(400);
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("rate-limits to 2 submissions per email in 24 hours", async () => {
    countMock.mockResolvedValue(2);
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(429);
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("rate-limits per client IP so rotating emails cannot flood the inbox", async () => {
    ipCountMock.mockResolvedValue(5);
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(429);
    expect(ipCountMock).toHaveBeenCalledWith("203.0.113.1");
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("skips the per-IP limit when the client IP is unknown", async () => {
    ipCountMock.mockResolvedValue(99);
    const res = await POST(
      new Request("http://localhost/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validBody),
      }),
    );
    expect(res.status).toBe(200);
    expect(ipCountMock).not.toHaveBeenCalled();
  });

  it.each([
    ["text/plain", "text/plain"],
    ["form-urlencoded", "application/x-www-form-urlencoded"],
  ])("rejects a %s body with 415 (cross-site form posts)", async (_label, contentType) => {
    const res = await POST(
      new Request("http://localhost/api/contact", {
        method: "POST",
        headers: { "Content-Type": contentType },
        body: JSON.stringify(validBody),
      }),
    );
    expect(res.status).toBe(415);
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("rejects an oversized body with 413 before parsing", async () => {
    const res = await POST(makeRequest({ ...validBody, padding: "x".repeat(40_000) }));
    expect(res.status).toBe(413);
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("truncates an over-long forwarded IP to the column width", async () => {
    const res = await POST(makeRequest(validBody, "a".repeat(200)));
    expect(res.status).toBe(200);
    expect(insertMock).toHaveBeenCalledWith(expect.objectContaining({ ipAddress: "a".repeat(64) }));
  });

  it.each([
    ["malformed JSON", "{oops", "Invalid JSON"],
    ["a JSON null body", "null", "Invalid JSON"],
    ["a JSON array body", "[]", "Invalid JSON"],
    ["a non-string name", { ...validBody, name: 42 }, "Invalid field type"],
    ["an object message", { ...validBody, message: { a: 1 } }, "Invalid field type"],
    ["a non-string honeypot", { ...validBody, company: ["x"] }, "Invalid field type"],
    [
      "a name with a line break",
      { ...validBody, name: "Aisha\r\nBcc: x@y.z" },
      "Name contains invalid characters",
    ],
    [
      "a message with a NUL byte",
      { ...validBody, message: "hi\u0000there" },
      "Message contains invalid characters",
    ],
    ["a missing name", { ...validBody, name: "   " }, "Name required"],
    ["a malformed email", { ...validBody, email: "not-an-email" }, "Valid email required"],
    ["a missing email", { ...validBody, email: undefined }, "Valid email required"],
    [
      "an over-length email",
      { ...validBody, email: `${"a".repeat(250)}@x.io` },
      "Valid email required",
    ],
    ["a missing message", { ...validBody, message: "" }, "Message required"],
  ])("rejects %s with 400", async (_label, body, error) => {
    const res = await POST(makeRequest(body));
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error });
    expect(insertMock).not.toHaveBeenCalled();
  });

  it.each([
    [
      "the first x-forwarded-for hop",
      { "x-forwarded-for": "198.51.100.7, 10.0.0.1" },
      "198.51.100.7",
    ],
    ["an empty x-forwarded-for hop", { "x-forwarded-for": " ,10.0.0.1" }, "unknown"],
    ["x-real-ip", { "x-real-ip": " 192.0.2.4 " }, "192.0.2.4"],
    ["no IP headers", {}, "unknown"],
  ])("records the client IP from %s", async (_label, headers, ipAddress) => {
    const res = await POST(
      new Request("http://localhost/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify(validBody),
      }),
    );
    expect(res.status).toBe(200);
    expect(insertMock).toHaveBeenCalledWith(
      expect.objectContaining({ ipAddress, userAgent: null }),
    );
  });
});
