import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Get CBC Subject Combination Recommendations",
  description:
    "Answer a few questions about your subjects, interests, and preferences to get personalised CBC subject combination and school recommendations in Kenya.",
  keywords: [
    "CBC recommendations Kenya",
    "best subject combination CBC",
    "CBC combination selector",
    "Kenya senior school guidance",
    "CBC career guidance",
  ],
  alternates: {
    canonical: `${siteConfig.url}/recommendations`,
  },
  openGraph: {
    title: "Get CBC Subject Combination Recommendations",
    description:
      "Answer a few questions about your subjects, interests, and preferences to get personalised CBC subject combination and school recommendations in Kenya.",
    url: `${siteConfig.url}/recommendations`,
  },
  // Recommendation flows are session-based — don't let search engines index result states
  robots: {
    index: true,
    follow: true,
  },
};

export default function RecommendationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
