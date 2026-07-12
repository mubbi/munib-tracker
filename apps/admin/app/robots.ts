import type { MetadataRoute } from "next";

/** Block all crawlers — admin console must not be indexed or linked from search. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
  };
}
