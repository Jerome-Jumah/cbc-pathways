import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Explore CBC Tracks and Pathways",
  description:
    "Browse all CBC senior school tracks and pathways in Kenya. Discover Pure Sciences, Applied Sciences, Arts & Sports Science, Social Sciences, and more.",
  keywords: [
    "CBC tracks Kenya",
    "CBC pathways",
    "Pure Sciences CBC",
    "Applied Sciences CBC",
    "Arts Sports Science CBC",
    "Social Sciences CBC",
    "Technical CBC",
  ],
  alternates: {
    canonical: `${siteConfig.url}/explore-tracks`,
  },
  openGraph: {
    title: "Explore CBC Tracks and Pathways",
    description:
      "Browse all CBC senior school tracks and pathways in Kenya. Discover Pure Sciences, Applied Sciences, Arts & Sports Science, Social Sciences, and more.",
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
