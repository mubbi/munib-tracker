import { describe, expect, it } from "vitest";
import { ADMIN_CSP, ADMIN_SECURITY_HEADERS } from "./security-headers";

function header(key: string): string | undefined {
  return ADMIN_SECURITY_HEADERS.find((h) => h.key.toLowerCase() === key.toLowerCase())?.value;
}

describe("ADMIN_SECURITY_HEADERS", () => {
  it("blocks framing (clickjacking) both ways", () => {
    expect(header("X-Frame-Options")).toBe("DENY");
    expect(ADMIN_CSP).toContain("frame-ancestors 'none'");
  });

  it("restricts base, plugin and form targets", () => {
    expect(ADMIN_CSP).toContain("base-uri 'self'");
    expect(ADMIN_CSP).toContain("form-action 'self'");
    expect(ADMIN_CSP).toContain("object-src 'none'");
  });

  it("keeps the console out of search indexes", () => {
    expect(header("X-Robots-Tag")).toContain("noindex");
  });

  it("sets nosniff, referrer and HSTS", () => {
    expect(header("X-Content-Type-Options")).toBe("nosniff");
    expect(header("Referrer-Policy")).toBe("same-origin");
    expect(header("Strict-Transport-Security")).toMatch(/max-age=\d+/);
  });
});
