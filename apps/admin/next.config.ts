import type { NextConfig } from "next";

const ROBOTS_HEADER_VALUE = "noindex, nofollow, noarchive, nosnippet, noimageindex";

const nextConfig: NextConfig = {
  transpilePackages: ["@munib-tracker/db", "@munib-tracker/shared"],
  serverExternalPackages: ["pg"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: ROBOTS_HEADER_VALUE }],
      },
    ];
  },
};

export default nextConfig;
