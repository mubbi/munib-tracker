import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@munib-tracker/shared", "@munib-tracker/theme"],
  cacheComponents: true,
};

export default nextConfig;
