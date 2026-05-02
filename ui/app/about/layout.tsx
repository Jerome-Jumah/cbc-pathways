import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About CBC Pathways - Helping Kenyan Students Choose the Right Path",
  description:
    "Learn about CBC Pathways — a free platform helping Kenyan students, parents, and educators navigate the Competency Based Curriculum and find the right senior school subject combinations.",
  keywords: [
    "about CBC Pathways",
    "CBC Kenya platform",
    "CBC guidance Kenya",
    "Kenyan students CBC",
  ],
  alternates: {
    canonical: `${siteConfig.url}/about`,
  },
  openGraph: {
    title: "About CBC Pathways",
    description:
      "A free platform helping Kenyan students, parents, and educators navigate the CBC and find the right senior school subject combinations.",
    url: `${siteConfig.url}/about`,
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
