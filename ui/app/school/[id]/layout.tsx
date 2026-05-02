import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo";

type Props = {
  params: Promise<{ id: string }>;
};

/**
 * Dynamic metadata for /school/[id].
 * Fetches real school profile from backend, falls back gracefully.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api";

  try {
    const res = await fetch(`${apiBase}/schools/${encodeURIComponent(id)}/profile`, {
      next: { revalidate: 3600 }, // cache for 1 hour
    });

    if (!res.ok) throw new Error("Not found");

    const body = await res.json();
    const school = body?.data?.school;

    if (!school) throw new Error("Missing school data");

    const title = `${school.name} - CBC Subject Combinations and Tracks`;
    const description = `Explore CBC subject combinations, tracks, pathway options, and school profile details for ${school.name} in ${school.county}. ${school.cluster ? `Cluster ${school.cluster}.` : ""} ${school.gender ?? ""} ${school.accommodationType ?? ""}.`.trim();
    const url = `${siteConfig.url}/school/${id}`;

    return {
      title,
      description,
      alternates: { canonical: url },
      openGraph: { title, description, url },
    };
  } catch {
    // Graceful fallback — do not block page render
    return {
      title: "School Profile - CBC Pathways",
      description: "View subject combinations, tracks, and pathways for this school.",
    };
  }
}

export default function SchoolDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
