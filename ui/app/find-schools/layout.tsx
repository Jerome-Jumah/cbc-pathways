import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Find Senior Schools by Subjects, County, Gender, and Cluster",
  description:
    "Search and compare Kenya CBC senior schools by subject combinations, county, school cluster (C1–C4), gender, and accommodation type. Find the best school match for your combination.",
  keywords: [
    "find CBC schools Kenya",
    "senior school by subject Kenya",
    "school cluster Kenya",
    "C1 C2 schools Kenya",
    "boarding schools Kenya CBC",
    "CBC school search",
  ],
  alternates: {
    canonical: `${siteConfig.url}/find-schools`,
  },
  openGraph: {
    title: "Find Senior Schools by Subjects, County, Gender, and Cluster",
    description:
      "Search and compare Kenya CBC senior schools by subject combinations, county, school cluster (C1–C4), gender, and accommodation type.",
    url: `${siteConfig.url}/find-schools`,
  },
};

export default function FindSchoolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
