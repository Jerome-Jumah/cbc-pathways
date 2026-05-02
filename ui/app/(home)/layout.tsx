import type { Metadata } from "next";
import { siteConfig, absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "CBC Pathways - Find the Right Subject Combination and School",
  description:
    "Discover the right CBC subject combination, track, and senior school for you. Get personalised recommendations based on your interests and subjects.",
  keywords: [
    "CBC subject combinations",
    "CBC tracks Kenya",
    "senior school Kenya",
    "CBC pathways",
    "subject selection Kenya",
    ...siteConfig.keywords,
  ],
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: "CBC Pathways - Find the Right Subject Combination and School",
    description:
      "Discover the right CBC subject combination, track, and senior school for you. Get personalised recommendations based on your interests and subjects.",
    url: siteConfig.url,
  },
};

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
