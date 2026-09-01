import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

const BASE_URL =
  process.env.API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:8080/api";

const BATCH_SIZE = 1000;
const MAX_SCHOOL_PAGES = 10; // Supports up to 10,000 schools in a single sitemap file (limit is 50,000)

/**
 * Next.js App Router comprehensive sitemap.
 * Generates canonical URLs for:
 * 1. Static landing and informational pages
 * 2. All 7 CBC Tracks
 * 3. All verified Subject Combinations
 * 4. All 10,000+ Senior Schools
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;
  const now = new Date();

  // 1. Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    {
      url: `${baseUrl}/grade-10-subject-combinations`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
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
      priority: 0.7,
    },
  ];

  // 2. Track pages
  let trackPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${BASE_URL}/track-profiles`, {
      next: { revalidate: 86400 },
    });
    if (res.ok) {
      const body = await res.json();
      const tracks = (body.data as Array<{ id: string }>) ?? [];
      trackPages = tracks.map((t) => ({
        url: `${baseUrl}/explore-tracks/${t.id}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    }
  } catch {
    // fallback gracefully if API is offline
  }

  // 3. Combination pages
  let combinationPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${BASE_URL}/combinations?limit=1000`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const body = await res.json();
      const combos = (body.data?.data as Array<{ id: string }>) ?? [];
      combinationPages = combos.map((c) => ({
        url: `${baseUrl}/combination/${c.id}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    }
  } catch {
    // fallback gracefully if API is offline
  }

  // 4. School detail pages (batched up to 10,000 schools)
  const schoolPages: MetadataRoute.Sitemap = [];
  try {
    for (let page = 1; page <= MAX_SCHOOL_PAGES; page++) {
      const res = await fetch(`${BASE_URL}/schools?page=${page}&limit=${BATCH_SIZE}`, {
        next: { revalidate: 3600 },
      });
      if (!res.ok) break;

      const body = await res.json();
      const schools = (body.data?.data as Array<{ id: string }>) ?? [];
      if (schools.length === 0) break;

      for (const s of schools) {
        schoolPages.push({
          url: `${baseUrl}/school/${s.id}`,
          lastModified: now,
          changeFrequency: "weekly" as const,
          priority: 0.8,
        });
      }

      // If returned less than full batch size, we've reached the last page
      if (schools.length < BATCH_SIZE) break;
    }
  } catch {
    // fallback gracefully if API is offline
  }

  return [...staticPages, ...trackPages, ...combinationPages, ...schoolPages];
}
