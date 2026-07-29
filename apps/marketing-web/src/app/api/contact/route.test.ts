import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/contact-messages", () => ({
  CONTACT_RATE_LIMIT: 2,
  countRecentContactMessagesByEmail: vi.fn(),
  insertContactMessage: vi.fn(),
}));

import { countRecentContactMessagesByEmail, insertContactMessage } from "@/lib/contact-messages";
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
const insertMock = vi.mocked(insertContactMessage);

describe("POST /api/contact", () => {
  const originalDatabaseUrl = process.env.DATABASE_URL;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.DATABASE_URL = "postgres://localhost/test";
    countMock.mockResolvedValue(0);
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
});
