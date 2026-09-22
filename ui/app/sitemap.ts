import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";
import { requireApiBaseUrl } from "@/lib/config";

export const dynamic = "force-dynamic";

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
  const apiBaseUrl = requireApiBaseUrl(process.env.API_BASE_URL, "API_BASE_URL");
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
  const tracksResponse = await fetch(`${apiBaseUrl}/track-profiles`, {
    next: { revalidate: 86400 },
  });
  if (!tracksResponse.ok) {
    throw new Error(`Sitemap could not load tracks: API returned ${tracksResponse.status}.`);
  }
  const tracksBody = await tracksResponse.json();
  if (!Array.isArray(tracksBody?.data)) throw new Error("Sitemap received an invalid track list.");
  const tracks = tracksBody.data as Array<{ id?: unknown }>;
  const trackPages: MetadataRoute.Sitemap = tracks.map((track, index) => {
    if (typeof track?.id !== "string" || !track.id) throw new Error(`Sitemap track ${index + 1} has no ID.`);
    return {
      url: `${baseUrl}/explore-tracks/${encodeURIComponent(track.id)}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    };
  });

  // 3. Subject Combination pages (metadata-driven pagination)
  const combinationPages: MetadataRoute.Sitemap = [];
  let combinationPage = 1;
  let combinationTotalPages = 1;
  let combinationExpectedCount = 0;
  let combinationRecordsRead = 0;

  while (combinationPage <= combinationTotalPages) {
    const response = await fetch(`${apiBaseUrl}/combinations?page=${combinationPage}&limit=${COMBINATIONS_PAGE_LIMIT}`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) throw new Error(`Sitemap could not load combinations page ${combinationPage}: API returned ${response.status}.`);

    const body = await response.json();
    const rawData = body?.data?.data;
    const meta = body?.data?.meta;
    if (
      !Array.isArray(rawData) ||
      !Number.isInteger(meta?.totalPages) ||
      meta.totalPages < 0 ||
      !Number.isInteger(meta?.total) ||
      meta.total < 0
    ) {
      throw new Error(`Sitemap received an invalid combinations response on page ${combinationPage}.`);
    }
    const combinations = rawData as Array<{ id?: unknown }>;
    combinationTotalPages = Math.max(1, meta.totalPages);
    combinationExpectedCount = meta.total;
    combinationRecordsRead += combinations.length;

    for (const [index, combination] of combinations.entries()) {
      if (typeof combination?.id !== "string" || !combination.id) {
        throw new Error(`Sitemap combination ${index + 1} on page ${combinationPage} has no ID.`);
      }
      if (staticPages.length + trackPages.length + combinationPages.length >= MAX_SITEMAP_URLS) {
        throw new Error(`Sitemap exceeds ${MAX_SITEMAP_URLS} URLs. Split it into multiple sitemap files before publishing all records.`);
      }
      combinationPages.push({
        url: `${baseUrl}/combination/${encodeURIComponent(combination.id)}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }

    if (combinationPage < combinationTotalPages && combinations.length === 0) {
      throw new Error(`Sitemap combinations page ${combinationPage} was empty before the reported final page ${combinationTotalPages}.`);
    }
    combinationPage++;
  }

  if (combinationRecordsRead !== combinationExpectedCount) {
    throw new Error(`Sitemap read ${combinationRecordsRead} of ${combinationExpectedCount} combinations. Check API pagination before publishing.`);
  }

  // 4. School detail pages (metadata-driven pagination without arbitrary 10k ceiling)
  const schoolPages: MetadataRoute.Sitemap = [];
  let page = 1;
  let schoolTotalPages = 1;
  let schoolExpectedCount = 0;
  let schoolRecordsRead = 0;

  while (page <= schoolTotalPages) {
    const res = await fetch(`${apiBaseUrl}/schools?page=${page}&limit=${SCHOOLS_PAGE_LIMIT}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      throw new Error(`Sitemap could not load schools page ${page}: API returned ${res.status}.`);
    }

    const body = await res.json();
    const rawData = body?.data?.data;
    const meta = body?.data?.meta;
    if (
      !Array.isArray(rawData) ||
      !Number.isInteger(meta?.totalPages) ||
      meta.totalPages < 0 ||
      !Number.isInteger(meta?.total) ||
      meta.total < 0
    ) {
      throw new Error(`Sitemap received an invalid school list on page ${page}.`);
    }
    const schools = rawData as Array<{ id?: unknown; slug?: unknown }>;
    schoolTotalPages = Math.max(1, meta.totalPages);
    schoolExpectedCount = meta.total;
    schoolRecordsRead += schools.length;

    for (const school of schools) {
      if (typeof school?.slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(school.slug)) {
        throw new Error(`Data integrity error: school ${String(school?.id ?? "from API page " + page)} has no valid canonical slug.`);
      }
      if (staticPages.length + trackPages.length + combinationPages.length + schoolPages.length >= MAX_SITEMAP_URLS) {
        throw new Error(`Sitemap exceeds ${MAX_SITEMAP_URLS} URLs. Split it into multiple sitemap files before publishing all records.`);
      }

      schoolPages.push({
        url: `${baseUrl}/schools/${encodeURIComponent(school.slug)}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }

    if (page < schoolTotalPages && schools.length === 0) {
      throw new Error(`Sitemap school page ${page} was empty before the reported final page ${schoolTotalPages}.`);
    }
    page++;
  }

  if (schoolRecordsRead !== schoolExpectedCount) {
    throw new Error(`Sitemap read ${schoolRecordsRead} of ${schoolExpectedCount} schools. Check API pagination before publishing.`);
  }

  return [...staticPages, ...trackPages, ...combinationPages, ...schoolPages];
}
