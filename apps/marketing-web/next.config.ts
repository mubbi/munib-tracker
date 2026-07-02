import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@munib-tracker/shared",
    "@munib-tracker/theme",
    "@munib-tracker/api-client",
  ],
  cacheComponents: true,
};

export default nextConfig;
