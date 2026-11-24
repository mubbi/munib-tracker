import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchGoogleProfile } from "./google";

function stubUserinfo(body: Record<string, unknown>, status = 200) {
  const fetchMock = vi.fn(async () => new Response(JSON.stringify(body), { status }));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("fetchGoogleProfile", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns the profile for a verified email", async () => {
    const fetchMock = stubUserinfo({ email: "ops@example.com", email_verified: true, name: "Ops" });
    await expect(fetchGoogleProfile("token")).resolves.toEqual({
      email: "ops@example.com",
      name: "Ops",
      picture: undefined,
    });
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("rejects an unverified email so the allowlist cannot be spoofed", async () => {
    stubUserinfo({ email: "ceo@example.com", email_verified: false });
    await expect(fetchGoogleProfile("token")).rejects.toThrow(/not verified/);
    stubUserinfo({ email: "ceo@example.com" });
    await expect(fetchGoogleProfile("token")).rejects.toThrow(/not verified/);
  });

  it("rejects a missing email or failed request", async () => {
    stubUserinfo({ email_verified: true });
    await expect(fetchGoogleProfile("token")).rejects.toThrow(/missing email/);
    stubUserinfo({}, 401);
    await expect(fetchGoogleProfile("token")).rejects.toThrow(/Failed to fetch/);
  });
});
