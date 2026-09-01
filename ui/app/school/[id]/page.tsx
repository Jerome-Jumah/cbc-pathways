import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import { SchoolDetailsClient } from "@/components/schools/school-details-client";
import { getSchoolCombinations, getSchoolProfile } from "@/lib/api/server";
import { siteConfig } from "@/lib/seo";
import { breadcrumbSchema, JsonLd, schoolSchema } from "@/lib/structured-data";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await getSchoolProfile(id);

  if (!data?.school) {
    return {
      title: "School Not Found | CBC Pathways",
      robots: { index: false, follow: false },
    };
  }

  const { school } = data;
  const title = `${school.name} CBC Subject Combinations`;
  const description = `Explore CBC pathways, tracks and Grade 10 subject combinations offered at ${school.name} in ${school.county} County, Kenya.`;
  const url = `${siteConfig.url}/school/${school.id}`;

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
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function SchoolDetailsPage({ params }: Props) {
  const { id } = await params;

  const [profileData, combosData] = await Promise.all([
    getSchoolProfile(id),
    getSchoolCombinations(id),
  ]);

  if (!profileData?.school) {
    notFound();
  }

  const { school } = profileData;
  const combos = combosData?.byTrack ?? [];
  const schoolUrl = `${siteConfig.url}/school/${school.id}`;

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
