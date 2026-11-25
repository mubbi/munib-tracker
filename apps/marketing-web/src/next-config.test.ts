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

const PATH_TO_REGEXP: string = "next/dist/compiled/path-to-regexp";

type PathToRegexp = {
  match: (
    pattern: string,
    options: { decode: (s: string) => string },
  ) => (path: string) => false | { params: Record<string, unknown> };
  compile: (pattern: string, options: { validate: boolean }) => (params: object) => string;
};

describe("next.config locale redirects", () => {
  /** First redirect whose source matches `path`, resolved like Next does. */
  async function resolve(path: string): Promise<{ to: string; permanent: boolean } | null> {
    // Next's own bundled path-to-regexp (the matcher it uses for `redirects`); untyped.
    const { match, compile } = (await import(/* @vite-ignore */ PATH_TO_REGEXP)) as PathToRegexp;
    for (const rule of (await nextConfig.redirects?.()) ?? []) {
      const hit = match(rule.source, { decode: decodeURIComponent })(path);
      if (hit) {
        const to = compile(rule.destination, { validate: false })(hit.params as object);
        return { to, permanent: Boolean("permanent" in rule && rule.permanent) };
      }
    }
    return null;
  }

  it.each([
    ["/", "/en"],
    ["/features", "/en/features"],
    ["/features/hadith", "/en/features/hadith"],
    ["/resources/salah/what-is-qaza-salah", "/en/resources/salah/what-is-qaza-salah"],
    ["/opengraph-image", "/en/opengraph-image"],
    ["/features/prayer-tracker", "/en/features/salah-tracker"],
    ["/ur/features/prayer-tracker", "/ur/features/salah-tracker"],
    ["/for-kids", "/en/for/families"],
  ])("permanently redirects %s → %s", async (from, to) => {
    expect(await resolve(from)).toEqual({ to, permanent: true });
  });

  it.each([
    "/en",
    "/en/features",
    "/ar/features/hadith",
    "/ur",
    "/api/contact",
    "/sitemap.xml",
    "/robots.txt",
    "/manifest.webmanifest",
    "/icon-512.png",
    "/screenshots/home.webp",
    "/_next/static/chunk.js",
  ])("leaves %s alone", async (path) => {
    expect(await resolve(path)).toBeNull();
  });
});
