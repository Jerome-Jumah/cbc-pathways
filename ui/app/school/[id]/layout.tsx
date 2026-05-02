import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo";

type Props = {
  params: Promise<{ id: string }>;
};

/**
 * Dynamic metadata for /school/[id].
 * 
 * In production replace the mock lookup with a real fetch:
 *   const school = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/schools/${params.id}`).then(r => r.json())
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  // --- Mock data lookup (replace with real API/DB call in production) ---
  const MOCK_SCHOOLS: Record<
    string,
    { name: string; county: string; cluster: string; gender: string; accommodation: string }
  > = {
    "alliance-high": {
      name: "Alliance High School",
      county: "Kiambu County",
      cluster: "C1 (National)",
      gender: "Boys",
      accommodation: "Boarding",
    },
    "lenana-school": {
      name: "Lenana School",
      county: "Nairobi County",
      cluster: "C1 (National)",
      gender: "Boys",
      accommodation: "Boarding",
    },
    "st-marys-girls": {
      name: "St. Mary's Girls Nairobi",
      county: "Nairobi County",
      cluster: "C2 (Extra County)",
      gender: "Girls",
      accommodation: "Boarding",
    },
  };

  const school = MOCK_SCHOOLS[id];

  if (!school) {
    // Fallback for unknown IDs
    return {
      title: "School Not Found",
      robots: { index: false, follow: false },
    };
  }

  const title = `${school.name} - Subject Combinations, Tracks and Pathways`;
  const description = `View subject combinations, tracks, and pathways offered by ${school.name} in ${school.county}. ${school.cluster} school · ${school.gender} · ${school.accommodation}. Compare CBC options by cluster, gender, and accommodation type.`;
  const url = `${siteConfig.url}/school/${id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
    },
  };
}

export default function SchoolDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
