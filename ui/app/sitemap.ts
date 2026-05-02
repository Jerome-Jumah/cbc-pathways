import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

/**
 * Next.js App Router sitemap.
 * Generates /sitemap.xml automatically.
 * Dynamic school/combination IDs will be fetched from the API in production.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;
  const now = new Date();

  // --- Static pages ---
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/explore-tracks`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/find-schools`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/recommendations`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // --- Dynamic school pages ---
  // In production, replace with a real API/DB fetch:
  // const schools = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/schools`).then(r => r.json());
  const MOCK_SCHOOL_IDS = [
    "alliance-high",
    "lenana-school",
    "st-marys-girls",
    "strathmore-school",
    "starehe-boys",
  ];

  const schoolPages: MetadataRoute.Sitemap = MOCK_SCHOOL_IDS.map((id) => ({
    url: `${baseUrl}/school/${id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // --- Dynamic combination pages ---
  // In production, replace with a real API/DB fetch:
  // const combinations = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/combinations`).then(r => r.json());
  const MOCK_COMBINATION_IDS = [
    "pure-sciences",
    "applied-sciences",
    "arts-sports",
    "social-sciences",
  ];

  const combinationPages: MetadataRoute.Sitemap = MOCK_COMBINATION_IDS.map(
    (id) => ({
      url: `${baseUrl}/combination/${id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })
  );

  // --- Explore-tracks detail pages ---
  const MOCK_TRACK_IDS = ["sciences", "arts", "social", "technical"];

  const trackPages: MetadataRoute.Sitemap = MOCK_TRACK_IDS.map((id) => ({
    url: `${baseUrl}/explore-tracks/${id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...schoolPages, ...combinationPages, ...trackPages];
}
