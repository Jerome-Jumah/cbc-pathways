import type { Metadata } from "next";
import { NavBar } from "@/components/nav-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getTracks } from "@/lib/api/server";
import { siteConfig } from "@/lib/seo";
import { breadcrumbSchema, JsonLd } from "@/lib/structured-data";
import { cn } from "@/lib/utils";
import type { Track } from "@/types/api";
import {
  ArrowRight01Icon,
  Book01Icon,
  Building03Icon,
  CheckmarkCircle01Icon,
  Compass01Icon,
  MicroscopeIcon,
  MusicNote01Icon,
  Plant01Icon,
  RouteIcon,
  Search01Icon,
  Shield01Icon,
  Target01Icon,
  Wrench01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Grade 10 Subject Combinations in Kenya",
  description:
    "Comprehensive guide to Grade 10 CBC subject combinations, senior school pathways, tracks, and school selection in Kenya.",
  keywords: [
    "Grade 10 subject combinations Kenya",
    "CBC Grade 10 combinations",
    "senior school pathways Kenya",
    "CBC tracks Kenya",
    "Grade 10 subjects CBC",
    "Kenya senior secondary school combinations",
  ],
  alternates: {
    canonical: `${siteConfig.url}/grade-10-subject-combinations`,
  },
  openGraph: {
    title: "Grade 10 Subject Combinations in Kenya | CBC Pathways",
    description:
      "Comprehensive guide to Grade 10 CBC subject combinations, senior school pathways, tracks, and school selection in Kenya.",
    url: `${siteConfig.url}/grade-10-subject-combinations`,
    type: "article",
  },
};

const PATHWAY_EXPLANATIONS = [
  {
    title: "1. STEM Pathway (Science, Technology, Engineering & Mathematics)",
    description:
      "Designed for learners with aptitude and passion for physical sciences, life sciences, engineering concepts, computer science, and agricultural innovation.",
    tracks: [
      {
        name: "Pure Sciences",
        subjects: "Biology, Chemistry, Physics, Advanced Mathematics",
        careers: "Medicine, Pharmacy, Actuarial Science, Civil Engineering, Astrophysics",
        icon: MicroscopeIcon,
        color: "text-blue-600 dark:text-blue-300",
        bg: "bg-blue-50 dark:bg-blue-950/30",
      },
      {
        name: "Applied Sciences",
        subjects: "Agriculture, Computer Studies, Home Science, Fishery",
        careers: "Software Development, Agronomy, Agribusiness, Food Science, Data Analysis",
        icon: Plant01Icon,
        color: "text-emerald-600 dark:text-emerald-300",
        bg: "bg-emerald-50 dark:bg-emerald-950/30",
      },
      {
        name: "Technical & Engineering",
        subjects: "Aviation, Building Construction, Electrical, Power Mechanics",
        careers: "Aeronautical Engineering, Architecture, Robotics, Telecommunications",
        icon: Wrench01Icon,
        color: "text-orange-600 dark:text-orange-300",
        bg: "bg-orange-50 dark:bg-orange-950/30",
      },
    ],
  },
  {
    title: "2. Social Sciences Pathway",
    description:
      "Focuses on understanding human society, history, languages, governance, business principles, and legal systems.",
    tracks: [
      {
        name: "Humanities & Business",
        subjects: "History, Geography, CRE / IRE / HRE, Business Studies, Economics",
        careers: "Law, International Relations, Public Policy, Finance, Accounting, Journalism",
        icon: Book01Icon,
        color: "text-teal-600 dark:text-teal-300",
        bg: "bg-teal-50 dark:bg-teal-950/30",
      },
      {
        name: "Languages & Literature",
        subjects: "English Literature, Fasihi ya Kiswahili, French, German, Arabic, Mandarin",
        careers: "Diplomacy, Translation & Interpretation, Publishing, Media Communications",
        icon: RouteIcon,
        color: "text-indigo-600 dark:text-indigo-300",
        bg: "bg-indigo-50 dark:bg-indigo-950/30",
      },
    ],
  },
  {
    title: "3. Arts and Sports Science Pathway",
    description:
      "Nurtures creative talent, visual arts, music, theatre, film production, and athletic excellence alongside academic rigor.",
    tracks: [
      {
        name: "Arts Track",
        subjects: "Visual Arts, Performing Arts, Music, Film Production",
        careers: "Graphic Design, Music Production, Fine Arts, Theatre & Screen Acting",
        icon: MusicNote01Icon,
        color: "text-purple-600 dark:text-purple-300",
        bg: "bg-purple-50 dark:bg-purple-950/30",
      },
      {
        name: "Sports Science",
        subjects: "Physical Education, Sports Nutrition, Biomechanics",
        careers: "Professional Athletics, Sports Coaching, Physiotherapy, Sports Management",
        icon: Target01Icon,
        color: "text-rose-600 dark:text-rose-300",
        bg: "bg-rose-50 dark:bg-rose-950/30",
      },
    ],
  },
];

export default async function Grade10CombinationsPage() {
  const tracks: Track[] = await getTracks();

  const breadcrumbData = breadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    {
      name: "Grade 10 Subject Combinations",
      url: `${siteConfig.url}/grade-10-subject-combinations`,
    },
  ]);

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col items-center pb-24">
      <JsonLd data={breadcrumbData} />
      <NavBar />

      <main className="w-full max-w-5xl px-6 py-8 flex flex-col gap-12 mt-4">
        {/* Breadcrumb Visual Trail */}
        <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground font-semibold">Grade 10 Subject Combinations</span>
        </nav>

        {/* Hero Section */}
        <section className="flex flex-col gap-6">
          <Badge className="bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-none px-4 py-1.5 rounded-full font-bold text-xs self-start">
            CBC Senior School Guide
          </Badge>

          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-[1.15]">
            Grade 10 CBC Subject Combinations in Kenya
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium max-w-3xl">
            A comprehensive guide for students, parents, and educators on how senior secondary school pathway selection works under the Competency Based Curriculum (CBC / CBE) in Kenya.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link href="/explore-tracks">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 px-6 font-semibold">
                <HugeiconsIcon icon={RouteIcon} size={18} className="mr-2" />
                Explore 7 CBC Tracks
              </Button>
            </Link>
            <Link href="/find-schools">
              <Button
                variant="outline"
                className="border-border text-foreground hover:bg-muted rounded-xl h-11 px-6 font-semibold"
              >
                <HugeiconsIcon icon={Search01Icon} size={18} className="mr-2" />
                Find Offering Schools
              </Button>
            </Link>
            <Link href="/recommendations">
              <Button
                variant="outline"
                className="border-blue-200 dark:border-blue-800/50 text-blue-600 dark:text-blue-300 hover:bg-accent rounded-xl h-11 px-6 font-semibold"
              >
                <HugeiconsIcon icon={Compass01Icon} size={18} className="mr-2" />
                Get Personalized Recommendations
              </Button>
            </Link>
          </div>
        </section>

        {/* Section 1: Overview of Senior School (Grades 10, 11, 12) */}
        <Card className="p-8 rounded-2xl border-border bg-card shadow-sm flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-foreground">
            How CBC Senior School Works in Kenya
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Senior Secondary School spans three years: Grade 10, Grade 11, and Grade 12. Unlike the previous 8-4-4 system where students took broad cluster subjects, the CBC framework specializes learning early according to each student&apos;s demonstrated abilities, passions, and future university or career goals.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-5 rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={CheckmarkCircle01Icon} size={20} className="text-blue-600 dark:text-blue-300" />
                <h3 className="font-bold text-foreground text-base">Compulsory Core Subjects</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                All Grade 10 students take foundational subjects ensuring literacy, numeracy, and citizenship:
              </p>
              <ul className="text-xs text-muted-foreground space-y-1 pl-4 list-disc">
                <li>English / Literature in English</li>
                <li>Kiswahili / Kenya Sign Language (KSL)</li>
                <li>Mathematics (Core or Applied)</li>
                <li>Community Service Learning (CSL)</li>
                <li>Physical Education</li>
              </ul>
            </div>

            <div className="p-5 rounded-xl border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={Target01Icon} size={20} className="text-emerald-600 dark:text-emerald-300" />
                <h3 className="font-bold text-foreground text-base">Track Elective Combinations</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Students select 3 to 4 elective subjects matching their chosen track. These form the subject combination determining eligibility for higher education programs through KUCCPS.
              </p>
              <ul className="text-xs text-muted-foreground space-y-1 pl-4 list-disc">
                <li>Specialized focus based on student strengths</li>
                <li>Direct alignment to university and TVET diplomas</li>
                <li>Matched with senior schools equipped with relevant labs/studios</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Section 2: Detailed Pathway and Track Breakdown */}
        <section className="flex flex-col gap-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              The 3 Main Pathways &amp; 7 CBC Tracks
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Explore how senior secondary school tracks are structured under the Kenyan curriculum:
            </p>
          </div>

          <div className="flex flex-col gap-8">
            {PATHWAY_EXPLANATIONS.map((pathway, pIdx) => (
              <Card key={pIdx} className="p-6 md:p-8 rounded-2xl border-border bg-card shadow-sm flex flex-col gap-6">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{pathway.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{pathway.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {pathway.tracks.map((track, tIdx) => (
                    <div
                      key={tIdx}
                      className={cn("p-5 rounded-2xl border border-border flex flex-col justify-between gap-4", track.bg)}
                    >
                      <div className="flex flex-col gap-3">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-card shadow-sm", track.color)}>
                          <HugeiconsIcon icon={track.icon} size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-base text-foreground mb-1">{track.name}</h4>
                          <span className="text-[11px] font-semibold text-muted-foreground block mb-2">
                            Key Subjects: {track.subjects}
                          </span>
                          <p className="text-xs text-muted-foreground/90 leading-relaxed">
                            <strong className="text-foreground font-semibold">Related Careers:</strong> {track.careers}
                          </p>
                        </div>
                      </div>

                      <Link
                        href="/explore-tracks"
                        className="text-xs font-bold text-blue-600 dark:text-blue-300 inline-flex items-center hover:underline mt-2"
                      >
                        View combinations <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="ml-1" />
                      </Link>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Section 3: Live Application Data Tracks Strip */}
        {tracks.length > 0 && (
          <Card className="p-8 rounded-2xl border-border bg-muted/40 shadow-sm flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-1">
                  Explore Live CBC Tracks in the Platform
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Click on any track to inspect all verified subject combinations and schools offering it in Kenya.
                </p>
              </div>
              <Link href="/explore-tracks">
                <Button variant="outline" className="rounded-xl font-semibold border-border bg-card">
                  View All Tracks
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {tracks.map((track) => (
                <Link
                  key={track.id}
                  href={`/explore-tracks/${track.id}`}
                  className="p-4 rounded-xl border border-border bg-card hover:border-blue-200 dark:hover:border-blue-800/50 hover:shadow-sm transition-all flex flex-col justify-between gap-3 group"
                >
                  <div>
                    <Badge variant="secondary" className="text-[10px] font-bold mb-2">
                      {track.pathway}
                    </Badge>
                    <h4 className="font-bold text-sm text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                      {track.name}
                    </h4>
                  </div>
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-300 inline-flex items-center">
                    Combinations <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="ml-1" />
                  </span>
                </Link>
              ))}
            </div>
          </Card>
        )}

        {/* Section 4: Discovering Senior Schools Offering Combinations */}
        <Card className="p-8 rounded-2xl border-border bg-card shadow-sm flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-300 shrink-0">
              <HugeiconsIcon icon={Building03Icon} size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Finding Senior Schools for Your Combination
              </h2>
              <p className="text-sm text-muted-foreground">
                Understanding Kenya senior secondary school clusters and selection criteria.
              </p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            In Kenya, senior secondary schools are organized into distinct clusters based on infrastructure, specialized facilities (such as science laboratories, aviation hangars, or music studios), and boarding facilities:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-border bg-muted/40">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-300 block mb-1">Cluster 1 (C1)</span>
              <p className="text-xs text-muted-foreground">
                National and premier specialized institutions offering comprehensive STEM and technical facilities.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-muted/40">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-300 block mb-1">Cluster 2 (C2)</span>
              <p className="text-xs text-muted-foreground">
                Extra-county boarding and day schools with established track specializations.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-muted/40">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-300 block mb-1">Cluster 3 (C3)</span>
              <p className="text-xs text-muted-foreground">
                County-level senior schools serving regional educational needs.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-muted/40">
              <span className="text-xs font-bold text-orange-600 dark:text-orange-300 block mb-1">Cluster 4 (C4)</span>
              <p className="text-xs text-muted-foreground">
                Sub-county and community day senior schools providing accessible secondary education.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/find-schools">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold h-11 px-8">
                Search 10,000+ Senior Schools <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Trust Notice */}
        <div className="p-6 rounded-2xl bg-muted border border-border flex items-start gap-4">
          <HugeiconsIcon icon={Shield01Icon} size={24} className="text-blue-600 dark:text-blue-300 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <h4 className="font-bold text-foreground text-sm">Educational Disclaimer</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              CBC Pathways compiles official curriculum guidelines and verified school records to help Kenyan learners make informed choices. Final placement and subject availability depend on school capacities, Kenya National Examinations Council (KNEC) guidelines, and Ministry of Education placement directives.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
