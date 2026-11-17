import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@munib-tracker/shared", "@munib-tracker/theme", "@munib-tracker/api-client"],
  cacheComponents: true,
  // No `<Link prefetch>` full prefetches or URL-data routes to migrate, so adopt
  // Partial Prefetching (default in the next Next.js major).
  partialPrefetching: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
    ],
  },
};

export default nextConfig;
