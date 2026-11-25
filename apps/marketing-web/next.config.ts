import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { DEFAULT_LOCALE, LOCALES } from "./src/i18n/config";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/**
 * Baseline CSP: directives that cannot break Next's inline bootstrap scripts,
 * GA4, fonts or framer-motion (no script-src/style-src without a nonce setup).
 * Blocks clickjacking, plugin content, <base> hijacking and off-site form posts.
 */
const CONTENT_SECURITY_POLICY = [
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY },
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
] as const;

const LOCALE_PATTERN = LOCALES.join("|");

/**
 * Alternate URLs people (and the original site plan) use for pages we
 * consolidated into one canonical page each — avoids thin duplicates. Paths
 * are locale-less; `redirects()` applies them inside every locale.
 */
const LEGACY_REDIRECTS: readonly { source: string; destination: string }[] = [
  {
    source: "/features/prayer-tracker",
    destination: "/features/salah-tracker",
  },
  {
    source: "/features/qaza-tracker",
    destination: "/features/qaza-salah-tracker",
  },
  { source: "/features/dhikr-tracker", destination: "/features/zikr-tracker" },
  {
    source: "/features/quran-recitation",
    destination: "/features/quran-practice",
  },
  {
    source: "/features/ai-recitation-correction",
    destination: "/features/quran-practice",
  },
  { source: "/features/quran-learning", destination: "/features/learn-quran" },
  { source: "/for-beginners", destination: "/for/beginners" },
  { source: "/for-new-muslims", destination: "/for/new-muslims" },
  { source: "/for-quran-learners", destination: "/for/quran-learners" },
  { source: "/for-families", destination: "/for/families" },
  { source: "/for-kids", destination: "/for/families" },
  { source: "/for-muslims", destination: "/for" },
  { source: "/resources/guides", destination: "/resources" },
  { source: "/resources/islamic-learning", destination: "/learn" },
  {
    source: "/compare/munib-tracker-vs-prayer-tracker-apps",
    destination: "/compare/best-salah-tracker-apps",
  },
  {
    source: "/compare/munib-tracker-vs-islamic-habit-trackers",
    destination: "/compare/islamic-habit-tracker-apps",
  },
];

const nextConfig: NextConfig = {
  transpilePackages: ["@munib-tracker/shared", "@munib-tracker/theme"],
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: [...SECURITY_HEADERS] }];
  },
  cacheComponents: true,
  // No `<Link prefetch>` full prefetches or URL-data routes to migrate, so adopt
  // Partial Prefetching (default in the next Next.js major).
  partialPrefetching: true,
  experimental: {
    // The root layout lives under `app/[locale]`, so unmatched URLs (and the
    // proxy's unknown-slug rewrite) render `app/global-not-found.tsx`.
    globalNotFound: true,
  },
  async redirects() {
    return [
      ...LEGACY_REDIRECTS.flatMap(({ source, destination }) => [
        // Legacy alias inside any locale: /ur/features/prayer-tracker → /ur/features/salah-tracker
        {
          source: `/:locale(${LOCALE_PATTERN})${source}`,
          destination: `/:locale${destination}`,
          permanent: true,
        },
        // Legacy alias without a locale → its English page in one hop.
        { source, destination: `/${DEFAULT_LOCALE}${destination}`, permanent: true },
      ]),
      // Any page URL without a locale (including `/`) → the English page.
      // Skips API routes, Next internals and files (anything with a dot:
      // sitemap.xml, robots.txt, images, the web manifest, /.well-known).
      { source: "/", destination: `/${DEFAULT_LOCALE}`, permanent: true },
      {
        source: `/:path((?!(?:${LOCALE_PATTERN})(?:/|$)|api(?:/|$)|_next/|_vercel/|.*[.]).+)`,
        destination: `/${DEFAULT_LOCALE}/:path`,
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
