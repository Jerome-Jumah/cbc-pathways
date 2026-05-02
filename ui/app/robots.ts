import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

/**
 * Next.js App Router robots.txt.
 * Generates /robots.txt automatically.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/explore-tracks",
          "/explore-tracks/",
          "/find-schools",
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
          // Prevent indexing filter permutations on find-schools
          "/find-schools?*",
          // Recommendation result sessions are private
          "/recommendations?*",
        ],
      },
      // Block common crawlers from hitting the API
      {
        userAgent: "GPTBot",
        disallow: ["/"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
