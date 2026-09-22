import { siteConfig } from "./seo";

export interface SchoolSlugTarget {
  slug: string;
}

/**
 * Returns the canonical public URL path for a school.
 * Uses the authoritative, persisted school.slug from the database/API.
 * Never falls back to school.id — the /schools/[slug] route is strictly slug-only.
 */
export function getSchoolUrl(school: SchoolSlugTarget | string): string {
  const slug = typeof school === "string" ? school : school?.slug;
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error("Data integrity error: Cannot construct school URL without a valid canonical slug.");
  }
  return `/schools/${encodeURIComponent(slug)}`;
}

/**
 * Returns the full absolute canonical URL for a school.
 */
export function getSchoolCanonicalUrl(school: SchoolSlugTarget | string): string {
  return `${siteConfig.url}${getSchoolUrl(school)}`;
}

/**
 * Returns the public URL path for a track.
 */
export function getTrackUrl(trackIdOrSlug: string): string {
  return `/explore-tracks/${encodeURIComponent(trackIdOrSlug)}`;
}

/**
 * Returns the public URL path for a combination.
 */
export function getCombinationUrl(combinationIdOrSlug: string): string {
  return `/combination/${encodeURIComponent(combinationIdOrSlug)}`;
}
