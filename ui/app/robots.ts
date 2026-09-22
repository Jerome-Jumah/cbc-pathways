import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

/**
 * Next.js App Router robots.txt generator.
 * Explicitly allows crawlable content pages while blocking faceted filter parameters,
 * private session URLs, and internal API routes.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/grade-10-subject-combinations",
          "/explore-tracks",
          "/explore-tracks/",
          "/find-schools",
          "/schools/",
          "/school/",
          "/combination/",
          "/recommendations",
          "/about",
        ],
        disallow: [
          "/api/",
          "/debug/",
          "/admin/",
          "/_next/",
          // Prevent crawling duplicate faceted query variations
          "/find-schools?*",
          // Recommendations session queries
          "/recommendations?*",
        ],
      },
      // Block AI scraping bot per established project policy
      {
        userAgent: "GPTBot",
        disallow: ["/"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
