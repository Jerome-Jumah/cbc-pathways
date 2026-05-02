/**
 * School Source Discovery — Stub
 *
 * Generates candidate search queries for a school's profile data.
 * Does NOT call any external API or scraper yet.
 * Prepares query strings for future Google Search / Firecrawl integration.
 */

export interface SourceDiscoveryInput {
  schoolName: string;
  county: string;
}

export interface SourceDiscoveryQuery {
  query: string;
  purpose: string;
}

export function discoverSchoolSources(input: SourceDiscoveryInput): SourceDiscoveryQuery[] {
  const { schoolName, county } = input;

  // Trim leading/trailing whitespace and normalise for use in search queries
  const name = schoolName.trim();
  const loc = county.trim();

  return [
    {
      query: `"${name}" "${loc}" official website`,
      purpose: "official_website_search",
    },
    {
      query: `"${name}" "${loc}" motto principal established`,
      purpose: "profile_metadata_search",
    },
    {
      query: `"${name}" site:facebook.com OR site:twitter.com`,
      purpose: "social_media_search",
    },
    {
      query: `"${name}" "${loc}" school contacts phone email`,
      purpose: "contact_details_search",
    },
  ];
}
