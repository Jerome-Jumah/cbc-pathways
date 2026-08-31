/**
 * SEO & Analytics Utilities
 * Centralised helpers for building consistent metadata across pages.
 */

export const siteConfig = {
  name: "CBC Pathways",
  url: "https://cbc-pathways.code4flare.com",
  description:
    "Explore CBC senior school pathways, subject combinations, tracks, and schools in Kenya. Find the right combination and schools based on your interests, subjects, and preferences.",
  keywords: [
    "CBC Kenya",
    "CBC pathways",
    "subject combinations Kenya",
    "senior school Kenya",
    "CBC tracks",
    "KUCCPS combinations",
    "CBC curriculum",
    "Kenya senior secondary school",
    "CBC subject selection",
    "school recommendations Kenya",
  ],
  ogImage: "/opengraph-image.png",
  twitterHandle: "@cbcpathways",
};

/** Build a full absolute URL from a relative path. */
export function absoluteUrl(path: string): string {
  return `${siteConfig.url}${path}`;
}

/** Canonical URL helper — strips query params for filter pages. */
export function canonicalUrl(path: string): string {
  // Always use the base path (without query params) as canonical
  return absoluteUrl(path.split("?")[0]);
}
