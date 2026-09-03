import { Suspense } from "react";
import { NavBar } from "@/components/nav-bar";
import { FindSchoolsClient } from "@/components/schools/find-schools-client";
import { getSchools } from "@/lib/api/server";
import { siteConfig } from "@/lib/seo";
import { breadcrumbSchema, JsonLd } from "@/lib/structured-data";

interface Props {
  searchParams: Promise<{
    county?: string;
    cluster?: string;
    gender?: string;
    accommodation?: string;
    search?: string;
    subjects?: string;
    recommendedCombinationIds?: string;
    preferredTrack?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function FindSchoolsPage({ searchParams }: Props) {
  const params = await searchParams;

  const initialCounty = params.county;
  const initialCluster = params.cluster;
  const initialGender = params.gender;
  const initialAccommodation = params.accommodation;
  const initialSearch = params.search;
  const initialSubjects = params.subjects ? params.subjects.split(",") : undefined;
  const initialRecommendedCombinationIds = params.recommendedCombinationIds;
  const initialPreferredTrack = params.preferredTrack;
  const initialSort = params.sort;

  const { data: initialSchools, meta } = await getSchools({
    county: initialCounty,
    cluster: initialCluster,
    gender: initialGender !== "any" && initialGender !== "Any" ? initialGender : undefined,
    accommodation:
      initialAccommodation !== "any" && initialAccommodation !== "Any"
        ? initialAccommodation
        : undefined,
    search: initialSearch,
    subjects: initialSubjects,
    recommendedCombinationIds: initialRecommendedCombinationIds,
    preferredTrack: initialPreferredTrack,
    sort: initialSort,
    page: 1,
    limit: 20,
  });

  const breadcrumbData = breadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "Find Schools", url: `${siteConfig.url}/find-schools` },
  ]);

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col items-center pb-20">
      <JsonLd data={breadcrumbData} />
      <NavBar />
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center p-20">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
            <p className="text-sm font-medium text-muted-foreground">Loading schools…</p>
          </div>
        }
      >
        <FindSchoolsClient
          initialSchools={initialSchools}
          initialTotal={meta.total}
          initialTotalPages={meta.totalPages}
          initialParams={{
            county: initialCounty,
            cluster: initialCluster,
            gender: initialGender,
            accommodation: initialAccommodation,
            search: initialSearch,
            subjects: initialSubjects,
            recommendedCombinationIds: initialRecommendedCombinationIds,
            preferredTrack: initialPreferredTrack,
            sort: initialSort,
          }}
        />
      </Suspense>
    </div>
  );
}
