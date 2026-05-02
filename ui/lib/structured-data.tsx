import { siteConfig } from "@/lib/seo";

/**
 * JSON-LD structured data helpers.
 * Only include schemas where content is actually visible on the page.
 */

/** WebSite schema for the home page */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/find-schools?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** EducationalOrganization schema for school detail pages */
export function schoolSchema(school: {
  name: string;
  county: string;
  cluster?: string;
  gender?: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: school.name,
    address: {
      "@type": "PostalAddress",
      addressRegion: school.county,
      addressCountry: "KE",
    },
    url: school.url,
  };
}

/** BreadcrumbList schema for detail pages */
export function breadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** Inline JSON-LD script component */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
