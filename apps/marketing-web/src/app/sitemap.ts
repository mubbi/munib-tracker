import type { MetadataRoute } from "next";
import { SITE_PATHS, SITE_URL } from "@/lib/site";

const PRIORITIES: Partial<Record<string, number>> = {
  "/": 1,
  "/features": 0.9,
  "/download": 0.9,
  "/contact": 0.6,
  "/press": 0.5,
  "/about": 0.6,
  "/faq": 0.6,
  "/credits": 0.4,
  "/privacy": 0.4,
  "/terms": 0.4,
};

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return Object.values(SITE_PATHS).map((path) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: PRIORITIES[path] ?? 0.6,
  }));
}
