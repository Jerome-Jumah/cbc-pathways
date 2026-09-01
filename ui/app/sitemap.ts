import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

const BASE_URL =
  process.env.API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:8080/api";

const SCHOOLS_PAGE_LIMIT = 1000;
const COMBINATIONS_PAGE_LIMIT = 100;
const MAX_SITEMAP_URLS = 45000; // Safe upper bound below Google's 50,000 URL ceiling

/**
 * Next.js App Router comprehensive sitemap.
 * Generates canonical URLs for:
 * 1. Static landing and informational pages
 * 2. All 7 CBC Tracks
 * 3. All verified Subject Combinations (paginated across all pages)
 * 4. All Senior Schools (paginated across all pages without an arbitrary 10-page ceiling)
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

  // 3. Subject Combination pages (metadata-driven pagination)
  const combinationPages: MetadataRoute.Sitemap = [];
  try {
    let page = 1;
    let totalPages = 1;

    while (
      page <= totalPages &&
      staticPages.length + trackPages.length + combinationPages.length < MAX_SITEMAP_URLS
    ) {
      const res = await fetch(
        `${BASE_URL}/combinations?page=${page}&limit=${COMBINATIONS_PAGE_LIMIT}`,
        { next: { revalidate: 3600 } },
      );
      if (!res.ok) break;

      const body = await res.json();
      const rawData = body?.data?.data ?? body?.data;
      const combos = (Array.isArray(rawData) ? rawData : []) as Array<{ id: string }>;
      const meta = body?.data?.meta ?? body?.meta;

      if (meta?.totalPages && typeof meta.totalPages === "number") {
        totalPages = meta.totalPages;
      }

      for (const c of combos) {
        if (c?.id) {
          combinationPages.push({
            url: `${baseUrl}/combination/${c.id}`,
            lastModified: now,
            changeFrequency: "weekly" as const,
            priority: 0.8,
          });
        }
      }

      if (combos.length === 0 || combos.length < COMBINATIONS_PAGE_LIMIT) {
        break;
      }
      page++;
    }
  } catch {
    // fallback gracefully if API is offline
  }

  // 4. School detail pages (metadata-driven pagination without arbitrary 10k ceiling)
  const schoolPages: MetadataRoute.Sitemap = [];
  try {
    let page = 1;
    let totalPages = 1;

    while (
      page <= totalPages &&
      staticPages.length +
        trackPages.length +
        combinationPages.length +
        schoolPages.length <
        MAX_SITEMAP_URLS
    ) {
      const res = await fetch(
        `${BASE_URL}/schools?page=${page}&limit=${SCHOOLS_PAGE_LIMIT}`,
        { next: { revalidate: 3600 } },
      );
      if (!res.ok) break;

      const body = await res.json();
      const rawData = body?.data?.data ?? body?.data;
      const schools = (Array.isArray(rawData) ? rawData : []) as Array<{ id: string }>;
      const meta = body?.data?.meta ?? body?.meta;

      if (meta?.totalPages && typeof meta.totalPages === "number") {
        totalPages = meta.totalPages;
      }

      for (const s of schools) {
        if (s?.id) {
          schoolPages.push({
            url: `${baseUrl}/school/${s.id}`,
            lastModified: now,
            changeFrequency: "weekly" as const,
            priority: 0.8,
          });
        }
      }

      if (schools.length === 0 || schools.length < SCHOOLS_PAGE_LIMIT) {
        break;
      }
      page++;
    }
  } catch {
    // fallback gracefully if API is offline
  }

  return [...staticPages, ...trackPages, ...combinationPages, ...schoolPages];
}
