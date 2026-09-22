import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import { SchoolDetailsClient } from "@/components/schools/school-details-client";
import { getSchoolCombinationsBySlug, getSchoolProfileBySlug } from "@/lib/api/server";
import { getSchoolCanonicalUrl } from "@/lib/routes";
import { siteConfig } from "@/lib/seo";
import { breadcrumbSchema, JsonLd, schoolSchema } from "@/lib/structured-data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getSchoolProfileBySlug(slug);

  if (!data?.school) {
    return {
      title: "School Not Found",
      robots: { index: false, follow: false },
    };
  }

  const { school } = data;
  if (school.slug !== slug) {
    throw new Error(`Data integrity error: slug route ${slug} resolved to school slug ${school.slug}.`);
  }
  const title = `${school.name} | CBC Subject Combinations & School Details`;
  const tracksText = school.tracksOffered?.length ? ` (${school.tracksOffered.join(", ")})` : "";
  const comboCountText = school.combinationCount ? ` ${school.combinationCount}` : "";
  const description = `Explore ${school.name} in ${school.county} County, Kenya. View${comboCountText} available Grade 10 CBC subject combinations, tracks${tracksText}, cluster, and admission details.`;
  const url = getSchoolCanonicalUrl(school);

  return {
    title,
    description,
    keywords: [
      school.name,
      `${school.name} CBC`,
      `${school.county} senior schools`,
      `${school.name} subject combinations`,
      "CBC senior school Kenya",
    ],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function SchoolDetailsPage({ params }: Props) {
  const { slug } = await params;

  const [profileData, combosData] = await Promise.all([
    getSchoolProfileBySlug(slug),
    getSchoolCombinationsBySlug(slug),
  ]);

  if (!profileData?.school) {
    notFound();
  }

  const { school } = profileData;
  if (school.slug !== slug) {
    throw new Error(`Data integrity error: slug route ${slug} resolved to school slug ${school.slug}.`);
  }
  if (!combosData || combosData.schoolSlug !== school.slug) {
    throw new Error(`Data integrity error: combinations for school slug ${school.slug} did not return its canonical slug.`);
  }
  const combos = combosData?.byTrack ?? [];
  const schoolUrl = getSchoolCanonicalUrl(school);

  const schoolStructuredData = schoolSchema({
    name: school.name,
    county: school.county,
    cluster: school.cluster ?? undefined,
    gender: school.gender ?? undefined,
    url: schoolUrl,
  });

  const breadcrumbStructuredData = breadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "Schools", url: `${siteConfig.url}/find-schools` },
    { name: school.name, url: schoolUrl },
  ]);

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col items-center">
      <JsonLd data={schoolStructuredData} />
      <JsonLd data={breadcrumbStructuredData} />
      <NavBar />
      <SchoolDetailsClient initialData={profileData} combos={combos} />
    </div>
  );
}
