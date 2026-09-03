import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CombinationDetailsClient } from "@/components/combinations/combination-details-client";
import { NavBar } from "@/components/nav-bar";
import { getCombinationProfile } from "@/lib/api/server";
import { siteConfig } from "@/lib/seo";
import { breadcrumbSchema, JsonLd } from "@/lib/structured-data";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await getCombinationProfile(id, false);

  if (!data?.combination || data.found === false || data.combinationExists === false) {
    return {
      title: "Combination Not Found",
      robots: { index: false, follow: false },
    };
  }

  const subjects = data?.combination?.subjects ?? [];
  const subjectsLabel =
    subjects.length > 0
      ? subjects.join(", ")
      : "CBC Subject Combination";
  const track = data?.combination?.track ?? "CBC Track";
  const pathway = data?.combination?.pathway ?? "CBC Pathway";
  const schoolCount = data?.combination?.schoolCount ?? 0;

  const title = `${subjectsLabel} CBC Combination`;
  const description = `Explore the ${subjectsLabel} Grade 10 CBC subject combination under the ${track} track (${pathway}), career options, and ${schoolCount}+ schools offering it in Kenya.`;
  const url = `${siteConfig.url}/combination/${id}`;

  return {
    title,
    description,
    keywords: [
      ...subjects,
      track,
      pathway,
      "CBC combination Kenya",
      "CBC subjects Kenya",
      "Grade 10 subject selection",
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

export default async function CombinationDetailsPage({ params }: Props) {
  const { id } = await params;
  const data = await getCombinationProfile(id, false);

  if (!data || (data.found === false && data.combinationExists === false)) {
    notFound();
  }

  const combinationTitle =
    data.combination?.subjects.join(", ") ?? "Combination Profile";
  const combinationUrl = `${siteConfig.url}/combination/${id}`;

  const breadcrumbData = breadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "Subject Combinations", url: `${siteConfig.url}/explore-tracks` },
    { name: combinationTitle, url: combinationUrl },
  ]);

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col items-center">
      <JsonLd data={breadcrumbData} />
      <NavBar />
      <CombinationDetailsClient initialData={data} combinationId={id} />
    </div>
  );
}
