import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api";

/**
 * Next.js App Router sitemap.
 * Attempts to fetch real IDs from the API; falls back to static stubs on failure.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;
  const now = new Date();

  // ── Static pages ──────────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/explore-tracks`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/find-schools`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/recommendations`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  // ── Dynamic track pages ────────────────────────────────────────────────────
  let trackIds: string[] = [];
  try {
    const res = await fetch(`${API}/track-profiles`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const body = await res.json();
      trackIds = (body.data as Array<{ id: string }>).map((t) => t.id);
    }
  } catch {
    // silently fall back to nothing — static pages still work
  }

  const trackPages: MetadataRoute.Sitemap = trackIds.map((id) => ({
    url: `${baseUrl}/explore-tracks/${id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // ── Dynamic school pages ───────────────────────────────────────────────────
  // Only fetch first page of schools to keep sitemap lightweight
  let schoolIds: string[] = [];
  try {
    const res = await fetch(`${API}/schools?page=1&limit=100`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const body = await res.json();
      schoolIds = (body.data?.data as Array<{ id: string }>)?.map((s) => s.id) ?? [];
    }
  } catch {
    // silently fail
  }

  const schoolPages: MetadataRoute.Sitemap = schoolIds.map((id) => ({
    url: `${baseUrl}/school/${id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...trackPages, ...schoolPages];
}
