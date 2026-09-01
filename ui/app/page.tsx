import type { Metadata } from "next";
import { HomeSearch } from "@/components/home/home-search";
import { NavBar } from "@/components/nav-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { siteConfig } from "@/lib/seo";
import { JsonLd, websiteSchema } from "@/lib/structured-data";
import {
  ArrowRight01Icon,
  ArrowUp01Icon,
  Book01Icon,
  Book02Icon,
  Building03Icon,
  Compass01Icon,
  FilterIcon,
  FootballIcon,
  MicroscopeIcon,
  MusicNote01Icon,
  Plant01Icon,
  RouteIcon,
  School01Icon,
  Search01Icon,
  Shield01Icon,
  StarIcon,
  Target01Icon,
  Wrench01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Find Grade 10 CBC Subject Combinations and Senior Schools in Kenya",
  description:
    "Explore 500+ Grade 10 subject combinations and 10,000+ senior schools in Kenya aligned to CBC senior school tracks and career pathways.",
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: "Find Grade 10 CBC Subject Combinations and Senior Schools in Kenya | CBC Pathways",
    description:
      "Explore 500+ Grade 10 subject combinations and 10,000+ senior schools in Kenya aligned to CBC senior school tracks and career pathways.",
    url: siteConfig.url,
    type: "website",
  },
};

const TRACK_PREVIEWS = [
  {
    name: "Pure Sciences",
    pathway: "STEM",
    desc: "Physics, Chemistry, Biology & Mathematics for engineering and medicine.",
    icon: MicroscopeIcon,
    color: "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-300 border-blue-100 dark:border-blue-900/40",
  },
  {
    name: "Applied Sciences",
    pathway: "STEM",
    desc: "Agriculture, Computer Science and technical applications.",
    icon: Plant01Icon,
    color: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900/40",
  },
  {
    name: "Technical & Engineering",
    pathway: "STEM",
    desc: "Aviation, Building Construction, Electrical & Mechanical technologies.",
    icon: Wrench01Icon,
    color: "bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-300 border-orange-100 dark:border-orange-900/40",
  },
  {
    name: "Social Sciences & Humanities",
    pathway: "Social Sciences",
    desc: "History, Geography, Religious Studies, Business & Languages.",
    icon: Book01Icon,
    color: "bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-300 border-teal-100 dark:border-teal-900/40",
  },
  {
    name: "Arts & Sports Science",
    pathway: "Arts & Sports",
    desc: "Visual Arts, Performing Arts, Music & Physical Education.",
    icon: MusicNote01Icon,
    color: "bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-300 border-purple-100 dark:border-purple-900/40",
  },
  {
    name: "Sports Science",
    pathway: "Arts & Sports",
    desc: "Sports coaching, fitness training, and athletic excellence.",
    icon: FootballIcon,
    color: "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-300 border-rose-100 dark:border-rose-900/40",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background font-sans flex flex-col items-center">
      <JsonLd data={websiteSchema()} />
      <NavBar />

      <main className="w-full max-w-7xl px-8 flex flex-col items-center pb-24">
        {/* Hero Section */}
        <section className="w-full flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 pt-4 lg:pt-8 pb-0 lg:items-end">
          <div className="flex flex-col items-start z-10 pb-0 lg:pb-16">
            <Badge
              variant="secondary"
              className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/40 border-none px-4 py-1.5 text-xs lg:text-sm font-medium rounded-full mb-4 lg:mb-0"
            >
              CBC Senior School Guidance
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-foreground leading-[1.15] lg:leading-[1.1] tracking-tight lg:mt-8">
              Find Grade 10 <span className="text-blue-600 dark:text-blue-300">CBC Subject</span> Combinations and{" "}
              <span className="text-blue-600 dark:text-blue-300">Senior Schools</span> in Kenya
            </h1>
            <p className="text-muted-foreground mt-4 lg:mt-6 text-base lg:text-lg max-w-[480px] leading-relaxed">
              Explore 500+ Grade 10 subject combinations and 10,000+ senior schools across Kenya aligned to CBC / CBE senior school tracks and career pathways.
            </p>
            <div className="hidden lg:flex gap-4 mt-10">
              <Link href="/find-schools">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-7 text-base shadow-sm font-semibold">
                  <HugeiconsIcon icon={Search01Icon} size={20} className="mr-2 stroke-[2.5]" />
                  Find Schools
                </Button>
              </Link>
              <Link href="/recommendations">
                <Button
                  variant="outline"
                  className="px-8 py-7 text-base text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800/50 hover:bg-accent font-semibold shadow-sm"
                >
                  <HugeiconsIcon icon={Compass01Icon} size={20} className="mr-2 stroke-[2.5]" />
                  Get Recommendations
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative w-full h-[350px] sm:h-[450px] lg:h-[550px] flex items-end justify-center mt-2 lg:mt-0">
            {/* Background decorative blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[400px] lg:w-[600px] h-[300px] sm:h-[400px] lg:h-[500px] bg-blue-100 dark:bg-blue-900/30 rounded-full blur-3xl -z-10" />

            {/* Main Illustration */}
            <div className="relative w-full max-w-[550px] h-full lg:translate-y-4">
              <Image
                src="/hero-image.png"
                alt="Kenyan learners exploring CBC subject combinations and senior schools"
                fill
                className="object-contain object-bottom lg:object-center"
                priority
              />
            </div>

            {/* Floating Badges */}
            <Card className="absolute top-4 lg:top-12 right-0 flex flex-row items-center gap-3 lg:gap-4 p-2 lg:p-3 pr-4 lg:pr-6 rounded-xl lg:rounded-2xl shadow-lg border-border/60 bg-card/90 backdrop-blur-sm whitespace-nowrap scale-75 lg:scale-100 origin-top-right">
              <div className="bg-blue-600 p-2 lg:p-2.5 rounded-lg lg:rounded-xl text-white">
                <HugeiconsIcon icon={School01Icon} size={20} className="lg:w-6 lg:h-6" />
              </div>
              <div className="flex flex-col">
                <p className="font-bold text-base lg:text-lg leading-tight text-foreground">10,000+</p>
                <p className="text-[10px] lg:text-xs text-muted-foreground font-medium">Senior Schools</p>
              </div>
            </Card>

            <Card className="absolute bottom-6 lg:bottom-16 -right-2 lg:-right-4 flex flex-row items-center gap-3 lg:gap-4 p-2 lg:p-3 pr-4 lg:pr-6 rounded-xl lg:rounded-2xl shadow-lg border-border/60 bg-card/90 backdrop-blur-sm whitespace-nowrap scale-75 lg:scale-100 origin-bottom-right">
              <div className="bg-emerald-600 p-2 lg:p-2.5 rounded-lg lg:rounded-xl text-white">
                <HugeiconsIcon icon={Book02Icon} size={20} className="lg:w-6 lg:h-6" />
              </div>
              <div className="flex flex-col">
                <p className="font-bold text-base lg:text-lg leading-tight text-foreground">500+</p>
                <p className="text-[10px] lg:text-xs text-muted-foreground font-medium">Combinations</p>
              </div>
            </Card>

            <Card className="absolute top-1/2 -left-2 lg:-left-8 -translate-y-1/2 flex flex-row items-center gap-3 lg:gap-4 p-2 lg:p-3 pr-4 lg:pr-6 rounded-xl lg:rounded-2xl shadow-lg border-border/60 bg-card/90 backdrop-blur-sm whitespace-nowrap scale-75 lg:scale-100 origin-left">
              <div className="bg-indigo-500 p-2 lg:p-2.5 rounded-lg lg:rounded-xl text-white flex items-center justify-center">
                <HugeiconsIcon icon={RouteIcon} size={20} className="lg:w-6 lg:h-6" />
              </div>
              <div className="flex flex-col">
                <p className="font-bold text-base lg:text-lg leading-tight text-foreground">7</p>
                <p className="text-[10px] lg:text-xs text-muted-foreground font-medium">CBC Tracks</p>
              </div>
            </Card>
          </div>
        </section>

        {/* Interactive Search Bar Section */}
        <HomeSearch />

        {/* Action Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Link href="/explore-tracks" className="group">
            <Card className="p-6 rounded-2xl flex flex-row items-center justify-between hover:shadow-md transition-shadow border-emerald-100 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/30 h-full">
              <div className="flex flex-row items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shrink-0">
                  <HugeiconsIcon icon={Book01Icon} size={32} />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-lg font-bold text-foreground mb-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                    Explore CBC Tracks
                  </h2>
                  <p className="text-sm text-muted-foreground leading-snug">
                    Discover 7 CBC tracks and 500+ subject combinations
                  </p>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground group-hover:bg-muted shrink-0 shadow-sm ml-4">
                <HugeiconsIcon icon={ArrowRight01Icon} size={20} />
              </div>
            </Card>
          </Link>

          <Link href="/recommendations" className="group">
            <Card className="p-6 rounded-2xl flex flex-row items-center justify-between hover:shadow-md transition-shadow border-orange-100 dark:border-orange-900/40 bg-orange-50 dark:bg-orange-950/30 h-full">
              <div className="flex flex-row items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-orange-400 flex items-center justify-center text-white shadow-sm shrink-0">
                  <HugeiconsIcon icon={StarIcon} size={32} />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-lg font-bold text-foreground mb-1 group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors">
                    Get Recommendations
                  </h2>
                  <p className="text-sm text-muted-foreground leading-snug">
                    Answer a few questions and get personalized suggestions
                  </p>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground group-hover:bg-muted shrink-0 shadow-sm ml-4">
                <HugeiconsIcon icon={ArrowRight01Icon} size={20} />
              </div>
            </Card>
          </Link>
        </div>

        {/* Informative Server-Rendered Explanatory Sections */}
        <div className="w-full flex flex-col gap-12 mb-12">
          {/* Section: Understanding CBC Pathways */}
          <Card className="p-8 rounded-2xl border-border bg-card shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Understanding CBC Senior School Pathways
                </h2>
                <p className="text-sm text-muted-foreground max-w-2xl">
                  Under the Competency Based Curriculum (CBC) in Kenya, senior school learners choose from three primary pathways and seven specialized tracks.
                </p>
              </div>
              <Link href="/grade-10-subject-combinations">
                <Button variant="outline" className="rounded-xl font-semibold border-border text-blue-600 dark:text-blue-300">
                  Grade 10 Guide <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="ml-1" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TRACK_PREVIEWS.slice(0, 3).map((track, idx) => (
                <div key={idx} className={cn("p-5 rounded-2xl border flex flex-col justify-between gap-4", track.color)}>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <HugeiconsIcon icon={track.icon} size={24} />
                      <Badge variant="secondary" className="text-[10px] font-bold bg-card/80">
                        {track.pathway}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-base text-foreground mb-1">{track.name}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{track.desc}</p>
                  </div>
                  <Link href="/explore-tracks" className="text-xs font-bold inline-flex items-center text-foreground hover:underline mt-2">
                    Browse combinations <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="ml-1" />
                  </Link>
                </div>
              ))}
            </div>
          </Card>

          {/* Section: How Subject Combinations Work */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 sm:p-8 rounded-2xl border-border bg-card shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-300 mb-4">
                  <HugeiconsIcon icon={Target01Icon} size={24} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  How Grade 10 Subject Selection Works
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Students moving into Senior Secondary School select subject combinations based on career aspirations, Kenya National Examinations Council (KNEC) assessments, and school capacity.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                    <span>Compulsory core subjects provide foundational skills across all pathways.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                    <span>Track electives allow in-depth specialization in STEM, Social Sciences, or Arts.</span>
                  </li>
                </ul>
              </div>
              <Link href="/grade-10-subject-combinations">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold">
                  Read Full Grade 10 Subject Guide
                </Button>
              </Link>
            </Card>

            <Card className="p-6 sm:p-8 rounded-2xl border-border bg-card shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-300 mb-4">
                  <HugeiconsIcon icon={Building03Icon} size={24} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Find Senior Schools in Kenya
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Filter through 10,000+ senior schools categorized across Cluster 1 (C1), Cluster 2 (C2), Cluster 3 (C3), and Cluster 4 (C4) in all 47 counties.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                    <span>Check which schools offer your preferred CBC subject combination.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                    <span>Filter by boys, girls, or mixed schools with boarding and day options.</span>
                  </li>
                </ul>
              </div>
              <Link href="/find-schools">
                <Button variant="outline" className="w-full border-border text-foreground hover:bg-muted rounded-xl font-semibold">
                  Search All 10,000+ Schools
                </Button>
              </Link>
            </Card>
          </div>
        </div>

        {/* Features Bottom Section */}
        <Card className="w-full p-8 rounded-2xl shadow-sm border-border bg-card">
          <h2 className="text-xl font-bold text-foreground mb-8">
            Everything you need. All in one place.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
                <HugeiconsIcon icon={Target01Icon} size={24} />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-sm mb-1.5">Smart Matching</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Data-driven matching for the best schools and subject combinations
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <HugeiconsIcon icon={Shield01Icon} size={24} />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-sm mb-1.5">Trusted Data</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Accurate information on senior schools, subjects, and CBC pathways
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-sm">
                <HugeiconsIcon icon={ArrowUp01Icon} size={24} />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-sm mb-1.5">Career Pathways</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  See what university degrees, diplomas, and careers your subjects lead to
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl border border-orange-100 bg-orange-50 text-orange-600 shadow-sm flex items-center justify-center dark:border-orange-900/40 dark:bg-orange-950/30 dark:text-orange-300">
                <HugeiconsIcon icon={FilterIcon} size={24} />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-sm mb-1.5">Filters that Matter</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Filter by county, cluster (C1–C4), gender, and accommodation type
                </p>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
