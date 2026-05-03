import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo";

type Props = {
  params: Promise<{ id: string }>;
};

/**
 * Dynamic metadata for /combination/[id].
 *
 * In production replace the mock lookup with a real fetch:
 *   const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/combinations/${params.id}`)
 *   const combo = await res.json()
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  // --- Mock data lookup (replace with real API/DB call in production) ---
  const MOCK_COMBINATIONS: Record<
    string,
    { name: string; subjects: string[]; track: string; schoolCount: number }
  > = {
    "pure-sciences": {
      name: "Pure Sciences",
      subjects: ["Biology", "Chemistry", "Physics", "Mathematics"],
      track: "Sciences and Technology",
      schoolCount: 124,
    },
    "applied-sciences": {
      name: "Applied Sciences",
      subjects: ["Biology", "Chemistry", "Agriculture", "Mathematics"],
      track: "Sciences and Technology",
      schoolCount: 89,
    },
    "arts-sports": {
      name: "Arts and Sports Science",
      subjects: ["English", "Kiswahili", "History", "Geography"],
      track: "Arts and Sports Science",
      schoolCount: 67,
    },
    "social-sciences": {
      name: "Social Sciences",
      subjects: ["History", "Geography", "CRE", "Business Studies"],
      track: "Social Sciences",
      schoolCount: 78,
    },
  };

  const combo = MOCK_COMBINATIONS[id];

  if (!combo) {
    return {
      title: "Combination Not Found",
      robots: { index: false, follow: false },
    };
  }

  const subjectsLabel = combo.subjects.join(", ");
  const title = `${combo.name} - Schools Offering This Combination`;
  const description = `Explore ${combo.schoolCount}+ schools offering ${subjectsLabel} under ${combo.track}. Compare counties, clusters, gender, and accommodation options for this CBC subject combination.`;
  const url = `${siteConfig.url}/combination/${id}`;

  return {
    title,
    description,
    keywords: [...combo.subjects, combo.track, "CBC combination Kenya", "CBC subjects Kenya"],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
    },
  };
}

export default function CombinationDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
