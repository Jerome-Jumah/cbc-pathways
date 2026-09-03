import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: "CBC Tracks and Pathways in Kenya",
  description:
    "Explore the 7 CBC senior school tracks in Kenya, their pathways, subject combinations and schools offering each track.",
  keywords: [
    "CBC tracks Kenya",
    "CBC pathways",
    "Pure Sciences CBC",
    "Applied Sciences CBC",
    "Arts Sports Science CBC",
    "Social Sciences CBC",
    "Technical and Engineering CBC",
    "Senior school tracks Kenya",
  ],
  alternates: {
    canonical: `${siteConfig.url}/explore-tracks`,
  },
  openGraph: {
    title: "CBC Tracks and Pathways in Kenya | CBC Pathways",
    description:
      "Explore the 7 CBC senior school tracks in Kenya, their pathways, subject combinations and schools offering each track.",
    url: `${siteConfig.url}/explore-tracks`,
  },
};

export default function ExploreTracksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
