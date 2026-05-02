import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo";

type Props = {
  params: Promise<{ id: string }>;
};

/**
 * Dynamic metadata for /explore-tracks/[id].
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const MOCK_TRACKS: Record<string, { name: string; description: string }> = {
    sciences: {
      name: "Sciences and Technology",
      description:
        "Pure Sciences, Applied Sciences, Computer Science, and Engineering pathways.",
    },
    arts: {
      name: "Arts and Sports Science",
      description:
        "Creative arts, performing arts, sports, and physical education pathways.",
    },
    social: {
      name: "Social Sciences",
      description: "History, Geography, Law, Economics, and Humanities pathways.",
    },
    technical: {
      name: "Technical and Applied Sciences",
      description: "Agriculture, Technical, Vocational, and Applied Science pathways.",
    },
  };

  const track = MOCK_TRACKS[id];

  if (!track) {
    return {
      title: "Track Not Found",
      robots: { index: false, follow: false },
    };
  }

  const title = `${track.name} - CBC Track`;
  const description = `Explore ${track.name} subject combinations and career pathways in Kenya's CBC curriculum. ${track.description} Find the right school offering this track.`;
  const url = `${siteConfig.url}/explore-tracks/${id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}

export default function TrackDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
