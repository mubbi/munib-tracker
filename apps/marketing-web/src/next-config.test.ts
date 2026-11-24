import { describe, expect, it } from "vitest";
import nextConfig from "../next.config";

describe("next.config security headers", () => {
  it("applies the baseline security headers to every route", async () => {
    const rules = await nextConfig.headers?.();
    const all = rules?.find((rule) => rule.source === "/:path*");
    const headers = Object.fromEntries((all?.headers ?? []).map((h) => [h.key, h.value]));

    expect(headers["X-Frame-Options"]).toBe("DENY");
    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(headers["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["Strict-Transport-Security"]).toMatch(/^max-age=\d+/);
    expect(headers["Permissions-Policy"]).toContain("camera=()");

    const csp = headers["Content-Security-Policy"] ?? "";
    for (const directive of [
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ]) {
      expect(csp).toContain(directive);
    }
    // No script-src/style-src until a nonce setup exists — it would break
    // Next's inline bootstrap, GA4 and the JSON-LD scripts.
    expect(csp).not.toMatch(/script-src|style-src|default-src/);
  });

  it("does not advertise the framework", () => {
    expect(nextConfig.poweredByHeader).toBe(false);
  });
});
