import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@munib-tracker/shared", "@munib-tracker/theme", "@munib-tracker/api-client"],
  cacheComponents: true,
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
