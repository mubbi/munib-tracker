import type { NextConfig } from "next";
import { ADMIN_SECURITY_HEADERS } from "./lib/security-headers";

const nextConfig: NextConfig = {
  transpilePackages: ["@munib-tracker/db", "@munib-tracker/shared"],
  serverExternalPackages: ["pg"],
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: ADMIN_SECURITY_HEADERS,
      },
    ];
  },
};

export default nextConfig;
