import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@munib-tracker/shared", "@munib-tracker/theme", "@munib-tracker/api-client"],
  cacheComponents: true,
  // No `<Link prefetch>` full prefetches or URL-data routes to migrate, so adopt
  // Partial Prefetching (default in the next Next.js major).
  partialPrefetching: true,
  // Alternate URLs people (and the original site plan) use for pages we
  // consolidated into one canonical page each — avoids thin duplicates.
  async redirects() {
    return [
      {
        source: "/features/prayer-tracker",
        destination: "/features/salah-tracker",
        permanent: true,
      },
      {
        source: "/features/qaza-tracker",
        destination: "/features/qaza-salah-tracker",
        permanent: true,
      },
      { source: "/features/dhikr-tracker", destination: "/features/zikr-tracker", permanent: true },
      {
        source: "/features/quran-recitation",
        destination: "/features/quran-practice",
        permanent: true,
      },
      {
        source: "/features/ai-recitation-correction",
        destination: "/features/quran-practice",
        permanent: true,
      },
      { source: "/features/quran-learning", destination: "/features/learn-quran", permanent: true },
      { source: "/for-beginners", destination: "/for/beginners", permanent: true },
      { source: "/for-new-muslims", destination: "/for/new-muslims", permanent: true },
      { source: "/for-quran-learners", destination: "/for/quran-learners", permanent: true },
      { source: "/for-families", destination: "/for/families", permanent: true },
      { source: "/for-kids", destination: "/for/families", permanent: true },
      { source: "/for-muslims", destination: "/for", permanent: true },
      { source: "/resources/guides", destination: "/resources", permanent: true },
      { source: "/resources/islamic-learning", destination: "/learn", permanent: true },
      {
        source: "/compare/munib-tracker-vs-prayer-tracker-apps",
        destination: "/compare/best-salah-tracker-apps",
        permanent: true,
      },
      {
        source: "/compare/munib-tracker-vs-islamic-habit-trackers",
        destination: "/compare/islamic-habit-tracker-apps",
        permanent: true,
      },
    ];
  },
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
