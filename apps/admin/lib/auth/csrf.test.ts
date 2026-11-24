import { afterEach, describe, expect, it, vi } from "vitest";
import { isSameOriginRequest, rejectCrossOrigin } from "./csrf";

const URL_ = "https://admin.munibtracker.app/api/auth/signout";

function post(headers: Record<string, string> = {}, url = URL_): Request {
  return new Request(url, { method: "POST", headers });
}

describe("isSameOriginRequest", () => {
  it("allows same-origin browser POSTs", () => {
    expect(
      isSameOriginRequest(
        post({ origin: "https://admin.munibtracker.app", "sec-fetch-site": "same-origin" }),
      ),
    ).toBe(true);
  });

  it("allows the configured ADMIN_URL origin even behind a different internal host", () => {
    const req = post({ origin: "https://admin.munibtracker.app" }, "http://10.0.0.5:3002/x");
    expect(isSameOriginRequest(req, "https://admin.munibtracker.app")).toBe(true);
    expect(isSameOriginRequest(req)).toBe(false);
  });

  it("allows non-browser clients that send neither Origin nor Sec-Fetch-Site", () => {
    expect(isSameOriginRequest(post())).toBe(true);
    expect(isSameOriginRequest(post({ "sec-fetch-site": "none" }))).toBe(true);
  });

  it("rejects a foreign or null Origin", () => {
    expect(isSameOriginRequest(post({ origin: "https://evil.test" }))).toBe(false);
    expect(isSameOriginRequest(post({ origin: "https://munibtracker.app" }))).toBe(false);
    expect(isSameOriginRequest(post({ origin: "null" }))).toBe(false);
  });

  it("rejects cross-site and same-site (sibling subdomain) fetch metadata", () => {
    expect(isSameOriginRequest(post({ "sec-fetch-site": "cross-site" }))).toBe(false);
    expect(isSameOriginRequest(post({ "sec-fetch-site": "same-site" }))).toBe(false);
  });
});

describe("rejectCrossOrigin", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns 403 for cross-origin and null for same-origin", async () => {
    vi.stubEnv("ADMIN_URL", "https://admin.munibtracker.app");
    const denied = rejectCrossOrigin(post({ origin: "https://evil.test" }));
    expect(denied?.status).toBe(403);
    expect(await denied?.json()).toEqual({ error: "Forbidden" });
    expect(rejectCrossOrigin(post({ origin: "https://admin.munibtracker.app" }))).toBeNull();
  });
});
