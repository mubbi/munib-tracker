import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

function makeRequest(body: unknown, ip = "203.0.113.1") {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": ip,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const validBody = {
  name: "Aisha",
  email: "aisha@example.com",
  message: "Salaam, I have a question.",
};

// Each test uses a distinct IP so the module-level rate-limit buckets do not
// bleed across tests.
let ipCounter = 0;
function nextIp() {
  ipCounter += 1;
  return `198.51.100.${ipCounter}`;
}

describe("POST /api/contact", () => {
  const originalWebhook = process.env.CONTACT_WEBHOOK_URL;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    if (originalWebhook === undefined) {
      delete process.env.CONTACT_WEBHOOK_URL;
    } else {
      process.env.CONTACT_WEBHOOK_URL = originalWebhook;
    }
  });

  it("returns 503 and does not report success when no webhook is configured", async () => {
    delete process.env.CONTACT_WEBHOOK_URL;
    const res = await POST(makeRequest(validBody, nextIp()));
    expect(res.status).toBe(503);
    const json = await res.json();
    expect(json.ok).toBeUndefined();
    expect(json.error).toBeTruthy();
  });

  it("delivers to the webhook and returns ok when configured", async () => {
    process.env.CONTACT_WEBHOOK_URL = "https://hooks.example.com/contact";
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(null, { status: 200 }));

    const res = await POST(makeRequest(validBody, nextIp()));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const call = fetchMock.mock.calls[0];
    if (!call) throw new Error("expected fetch to have been called");
    const [url, init] = call;
    expect(url).toBe("https://hooks.example.com/contact");
    expect(JSON.parse((init as RequestInit).body as string)).toMatchObject({
      name: "Aisha",
      email: "aisha@example.com",
    });
  });

  it("returns 503 when the webhook responds non-2xx", async () => {
    process.env.CONTACT_WEBHOOK_URL = "https://hooks.example.com/contact";
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 500 }));
    const res = await POST(makeRequest(validBody, nextIp()));
    expect(res.status).toBe(503);
  });

  it("silently accepts (200) but does not deliver when the honeypot is filled", async () => {
    process.env.CONTACT_WEBHOOK_URL = "https://hooks.example.com/contact";
    const fetchMock = vi.spyOn(globalThis, "fetch");
    const res = await POST(makeRequest({ ...validBody, company: "AcmeBot" }, nextIp()));
    expect(res.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects an over-length message with 400", async () => {
    process.env.CONTACT_WEBHOOK_URL = "https://hooks.example.com/contact";
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 200 }));
    const res = await POST(makeRequest({ ...validBody, message: "x".repeat(5001) }, nextIp()));
    expect(res.status).toBe(400);
  });

  it("rejects an over-length name with 400", async () => {
    process.env.CONTACT_WEBHOOK_URL = "https://hooks.example.com/contact";
    const res = await POST(makeRequest({ ...validBody, name: "x".repeat(101) }, nextIp()));
    expect(res.status).toBe(400);
  });

  it("rate-limits repeated submissions from the same IP", async () => {
    process.env.CONTACT_WEBHOOK_URL = "https://hooks.example.com/contact";
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 200 }));
    const ip = nextIp();

    const statuses: number[] = [];
    for (let i = 0; i < 7; i += 1) {
      const res = await POST(makeRequest(validBody, ip));
      statuses.push(res.status);
    }
    // First 5 within the window succeed; the 6th+ are limited.
    expect(statuses.slice(0, 5).every((s) => s === 200)).toBe(true);
    expect(statuses[5]).toBe(429);
    expect(statuses[6]).toBe(429);
  });
});
