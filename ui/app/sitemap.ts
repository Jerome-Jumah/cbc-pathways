import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

const BASE_URL =
  process.env.API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:8080/api";

const SCHOOLS_PER_SITEMAP = 2000;
const ESTIMATED_MAX_SCHOOL_SITEMAPS = 6; // Supports up to 12,000+ schools

/**
 * Partition sitemaps using Next.js App Router generateSitemaps().
 * Partition 0: Static pages, all tracks, all subject combinations.
 * Partition 1..N: School pages in chunks of 2,000.
 */
export async function generateSitemaps() {
  const sitemaps = [{ id: 0 }];

  try {
    const res = await fetch(`${BASE_URL}/schools?page=1&limit=1`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const body = await res.json();
      const totalSchools = body?.data?.meta?.total ?? body?.pagination?.total ?? 0;
      const schoolPartitions = Math.max(
        1,
        Math.ceil(totalSchools / SCHOOLS_PER_SITEMAP),
      );
      for (let i = 1; i <= Math.min(schoolPartitions, ESTIMATED_MAX_SCHOOL_SITEMAPS); i++) {
        sitemaps.push({ id: i });
      }
    } else {
      for (let i = 1; i <= ESTIMATED_MAX_SCHOOL_SITEMAPS; i++) {
        sitemaps.push({ id: i });
      }
    }
  } catch {
    for (let i = 1; i <= ESTIMATED_MAX_SCHOOL_SITEMAPS; i++) {
      sitemaps.push({ id: i });
    }
  }

  return sitemaps;
}

export default async function sitemap(props: {
  id: Promise<{ id: string }> | { id: string } | number | string;
}): Promise<MetadataRoute.Sitemap> {
  const rawId = await (typeof props?.id === "object" && "then" in props.id
    ? (await props.id).id
    : typeof props?.id === "object" && "id" in props.id
      ? props.id.id
      : props?.id ?? 0);

  const partitionId = Number(rawId) || 0;
  const baseUrl = siteConfig.url;
  const now = new Date();

  // ── Partition 0: Static pages, Tracks, Combinations ───────────────────────
  if (partitionId === 0) {
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

    // Dynamic track pages
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
      // fallback gracefully
    }

    // Dynamic combination pages
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
      // fallback gracefully
    }

    return [...staticPages, ...trackPages, ...combinationPages];
  }

  // ── Partitions 1..N: School Detail URLs ───────────────────────────────────
  try {
    const pageNumber = partitionId;
    const res = await fetch(
      `${BASE_URL}/schools?page=${pageNumber}&limit=${SCHOOLS_PER_SITEMAP}`,
      { next: { revalidate: 3600 } },
    );

    if (res.ok) {
      const body = await res.json();
      const schools = (body.data?.data as Array<{ id: string }>) ?? [];
      return schools.map((s) => ({
        url: `${baseUrl}/school/${s.id}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    }
  } catch {
    // fallback gracefully
  }

  return [];
}
