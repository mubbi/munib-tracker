/**
 * Response headers for every admin route (wired in `next.config.ts`).
 *
 * The CSP deliberately omits `script-src` / `style-src` (Next's inline bootstrap +
 * the theme init script would need nonces); it locks down framing, `<base>`,
 * plugins, and form targets — the clickjacking / form-hijack surface of an ops console.
 */
export const ROBOTS_HEADER_VALUE = "noindex, nofollow, noarchive, nosnippet, noimageindex";

export const ADMIN_CSP = [
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

export const ADMIN_SECURITY_HEADERS: { key: string; value: string }[] = [
  { key: "X-Robots-Tag", value: ROBOTS_HEADER_VALUE },
  { key: "Content-Security-Policy", value: ADMIN_CSP },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Admin URLs embed user ids / search terms — never leak them to external sites.
  { key: "Referrer-Policy", value: "same-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
];
