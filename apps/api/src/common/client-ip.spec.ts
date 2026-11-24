import type { Request } from "express";
import { describe, expect, it } from "vitest";
import { buildRequest, type RequestOverrides } from "../test-support/http";
import { clientIp, MAX_TRUST_PROXY_HOPS, trustProxyHops } from "./client-ip";

/** Request whose Express app has `trust proxy` set (as `create-app.ts` does in production). */
function trustedRequest(overrides: RequestOverrides, hops = 1): Request {
  return Object.assign(buildRequest(overrides), {
    app: { get: (name: string) => (name === "trust proxy" ? hops : undefined) },
  });
}

describe("clientIp", () => {
  it.each([
    ["the nearest proxy's hop, not the client-supplied first one", "6.6.6.6, 1.2.3.4", "1.2.3.4"],
    ["a single (edge-overwritten) hop", " 1.2.3.4 ", "1.2.3.4"],
    ["the last non-blank hop", "6.6.6.6, 1.2.3.4, ", "1.2.3.4"],
  ])("uses %s", (_label, header, want) => {
    expect(clientIp(buildRequest({ headers: { "x-forwarded-for": header } }))).toBe(want);
  });

  it("ignores a spoofed first hop: rotating it never changes the key", () => {
    const keys = new Set(
      Array.from({ length: 20 }, (_, i) =>
        clientIp(buildRequest({ headers: { "x-forwarded-for": `203.0.113.${i}, 10.0.0.7` } })),
      ),
    );
    expect([...keys]).toEqual(["10.0.0.7"]);
  });

  it("reads repeated headers in order", () => {
    const req = buildRequest({ headers: { "x-forwarded-for": ["6.6.6.6", "7.7.7.7, 1.2.3.4"] } });
    expect(clientIp(req)).toBe("1.2.3.4");
  });

  it("uses req.ip when Express trust proxy is configured", () => {
    const req = trustedRequest({
      headers: { "x-forwarded-for": "6.6.6.6, 1.2.3.4" },
      ip: "5.5.5.5",
    });
    expect(clientIp(req)).toBe("5.5.5.5");
    expect(clientIp(trustedRequest({ ip: "  " }))).toBe("unknown");
  });

  it("falls back to the socket address without a forwarded header", () => {
    expect(clientIp(buildRequest({ ip: " 9.9.9.9 " }))).toBe("9.9.9.9");
    expect(clientIp(buildRequest({ socket: { remoteAddress: "8.8.8.8" } }))).toBe("8.8.8.8");
    expect(clientIp(buildRequest({ headers: { "x-forwarded-for": " , " } }))).toBe("unknown");
    expect(clientIp(buildRequest({ headers: { "x-forwarded-for": [] as string[] } }))).toBe(
      "unknown",
    );
  });
});

describe("trustProxyHops", () => {
  it("trusts Vercel's single edge hop", () => {
    expect(trustProxyHops({ VERCEL: "1" })).toBe(1);
  });

  it("trusts nothing on a direct (local) server", () => {
    expect(trustProxyHops({})).toBe(0);
  });

  it.each([
    ["0", { VERCEL: "1", TRUST_PROXY_HOPS: "0" }, 0],
    ["2", { TRUST_PROXY_HOPS: " 2 " }, 2],
    ["max", { TRUST_PROXY_HOPS: String(MAX_TRUST_PROXY_HOPS) }, MAX_TRUST_PROXY_HOPS],
  ])("honours an explicit TRUST_PROXY_HOPS=%s", (_label, env, want) => {
    expect(trustProxyHops(env)).toBe(want);
  });

  it.each([
    ["non-numeric", "yes"],
    ["fractional", "1.5"],
    ["negative", "-1"],
    ["too deep", String(MAX_TRUST_PROXY_HOPS + 1)],
  ])("ignores a %s TRUST_PROXY_HOPS", (_label, value) => {
    expect(trustProxyHops({ TRUST_PROXY_HOPS: value })).toBe(0);
    expect(trustProxyHops({ TRUST_PROXY_HOPS: value, VERCEL: "1" })).toBe(1);
  });
});
