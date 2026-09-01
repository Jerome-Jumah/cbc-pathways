import { NavBar } from "@/components/nav-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { siteConfig } from "@/lib/seo";
import { breadcrumbSchema, JsonLd } from "@/lib/structured-data";
import { cn } from "@/lib/utils";
import {
  ArrowRight01Icon,
  Building03Icon,
  CheckmarkCircle01Icon,
  FavouriteIcon,
  Mortarboard01Icon,
  QuoteUpIcon,
  RouteIcon,
  Search01Icon,
  Settings01Icon,
  Target01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";

const FEATURES = [
  {
    title: "Explore Subjects & Interests",
    description:
      "Discover subjects you love and areas that match your strengths and passions.",
    icon: Search01Icon,
    color: "text-blue-600 dark:text-blue-300",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    title: "Find the Right Combinations",
    description:
      "Get subject combinations that align with your interests and senior school tracks.",
    icon: Settings01Icon,
    color: "text-emerald-600 dark:text-emerald-300",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  {
    title: "Discover Senior Schools",
    description:
      "Explore and compare Kenya CBC schools that offer your preferred subject combinations.",
    icon: Building03Icon,
    color: "text-purple-600 dark:text-purple-300",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
  },
  {
    title: "Explore Career Pathways",
    description:
      "See university and career options related to your choices and plan your future with confidence.",
    icon: RouteIcon,
    color: "text-orange-600 dark:text-orange-300",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
  },
  {
    title: "Get Smart Recommendations",
    description:
      "Receive personalized pathway and combination recommendations tailored to your profile.",
    icon: FavouriteIcon,
    color: "text-pink-600 dark:text-pink-300",
    bgColor: "bg-pink-50 dark:bg-pink-950/30",
  },
];

const TRUST_POINTS = [
  "Aligned with the Competency Based Curriculum (CBC / CBE) in Kenya",
  "Comprehensive database of 10,000+ senior secondary schools across 47 counties",
  "Over 500 verified subject combinations covering all 7 CBC tracks",
  "Personalized recommendations based on your unique interests and strengths",
  "Built for Kenyan learners, supported by parents, teachers, and career advisors",
];

export default function AboutPage() {
  const breadcrumbData = breadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "About", url: `${siteConfig.url}/about` },
  ]);

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col items-center pb-20">
      <JsonLd data={breadcrumbData} />
      <NavBar />

      <main className="w-full max-w-[1400px] px-6 mt-8">
        <Card className="w-full flex flex-col bg-card rounded-2xl overflow-hidden border-border shadow-sm">
          {/* HERO SECTION */}
          <section className="relative w-full bg-gradient-to-r from-card via-muted/40 to-blue-50/80 dark:from-card dark:via-card dark:to-muted flex flex-col lg:flex-row items-center p-8 lg:p-16 gap-12 border-b border-border">
            <div
              className="absolute top-0 right-0 w-full lg:w-1/2 h-full opacity-35 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(color-mix(in oklch, var(--muted-foreground) 35%, transparent) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />

            {/* Left Content */}
            <div className="relative z-10 flex flex-col items-start w-full lg:w-[55%]">
              <Badge className="bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 border-none px-4 py-1.5 rounded-full font-bold text-xs mb-6">
                About CBC Pathways
              </Badge>

              <h1 className="text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-[1.1] mb-6">
                Your trusted guide to <br className="hidden lg:block" /> CBC senior school success.
              </h1>

              <p className="text-lg text-muted-foreground font-medium leading-relaxed max-w-xl mb-12">
                CBC Pathways helps Kenyan learners discover the right subject combinations, senior schools, and career pathways—so you can make confident choices for your future.
              </p>

              {/* Stats Row */}
              <div className="flex flex-wrap items-center gap-y-6 gap-x-8 lg:gap-x-12">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0">
                    <HugeiconsIcon icon={Building03Icon} size={24} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-extrabold text-foreground leading-none mb-1">
                      10,000+
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground">Schools</span>
                  </div>
                </div>

                <div className="w-px h-10 bg-muted hidden sm:block" />

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-300 flex items-center justify-center shrink-0">
                    <HugeiconsIcon icon={UserGroupIcon} size={24} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-extrabold text-foreground leading-none mb-1">
                      500+
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground">
                      Combinations
                    </span>
                  </div>
                </div>

                <div className="w-px h-10 bg-muted hidden md:block" />

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-300 flex items-center justify-center shrink-0">
                    <HugeiconsIcon icon={RouteIcon} size={24} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-extrabold text-foreground leading-none mb-1">
                      7
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground">CBC Tracks</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="relative z-10 w-full lg:w-[45%] flex items-center justify-center min-h-[300px] lg:min-h-[400px]">
              <div className="absolute w-[80%] h-[80%] bg-blue-100 dark:bg-blue-900/30 rounded-full blur-3xl opacity-60" />

              <div className="relative w-full max-w-[500px] aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border-4 border-border z-10">
                <Image
                  src="/about-hero-image.png"
                  fill
                  alt="Kenyan students studying together for CBC senior secondary school"
                  className="object-cover"
                />
              </div>

              {/* Floating Badges */}
              <div
                className="absolute top-[10%] left-[5%] w-14 h-14 bg-card rounded-2xl shadow-lg flex items-center justify-center z-20 animate-bounce"
                style={{ animationDuration: "3s" }}
              >
                <HugeiconsIcon
                  icon={Mortarboard01Icon}
                  size={28}
                  className="text-blue-600 dark:text-blue-300"
                />
              </div>
              <div
                className="absolute top-[20%] right-[10%] w-12 h-12 bg-card rounded-2xl shadow-lg flex items-center justify-center z-20 animate-bounce"
                style={{ animationDuration: "4s", animationDelay: "1s" }}
              >
                <HugeiconsIcon
                  icon={Building03Icon}
                  size={24}
                  className="text-emerald-600 dark:text-emerald-300"
                />
              </div>
              <div
                className="absolute bottom-[20%] right-[0%] w-16 h-16 bg-card rounded-2xl shadow-lg flex items-center justify-center z-20 animate-bounce"
                style={{ animationDuration: "3.5s", animationDelay: "0.5s" }}
              >
                <HugeiconsIcon
                  icon={Target01Icon}
                  size={32}
                  className="text-purple-600 dark:text-purple-300"
                />
              </div>
            </div>
          </section>

          <div className="flex flex-col gap-12 p-8 lg:p-16">
            {/* FEATURES GRID SECTION */}
            <section className="flex flex-col items-center gap-8 pt-4">
              <h2 className="text-2xl font-extrabold text-foreground">
                How CBC Pathways helps you
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
                {FEATURES.map((feature, idx) => (
                  <Card
                    key={idx}
                    className="flex flex-col items-center text-center p-6 rounded-2xl border-border shadow-sm bg-card hover:-translate-y-1 transition-transform cursor-pointer"
                  >
                    <div
                      className={cn(
                        "w-14 h-14 rounded-full flex items-center justify-center mb-5 shrink-0",
                        feature.bgColor,
                        feature.color,
                      )}
                    >
                      <HugeiconsIcon icon={feature.icon} size={28} />
                    </div>
                    <h3 className="text-[15px] font-bold text-foreground mb-2 leading-tight px-2">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                      {feature.description}
                    </p>
                  </Card>
                ))}
              </div>
            </section>

            {/* BOTTOM SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-6">
              {/* Trust Section */}
              <Card className="flex flex-col md:flex-row items-center overflow-hidden rounded-2xl border-border shadow-sm bg-muted/50">
                <div className="flex flex-col p-8 lg:p-10 w-full md:w-3/5">
                  <h3 className="text-xl font-bold text-foreground mb-6">
                    Why learners and parents trust CBC Pathways
                  </h3>
                  <div className="flex flex-col gap-4">
                    {TRUST_POINTS.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <HugeiconsIcon
                          icon={CheckmarkCircle01Icon}
                          size={20}
                          className="text-emerald-500 dark:text-emerald-300 shrink-0 mt-0.5"
                        />
                        <span className="text-sm font-semibold text-foreground leading-snug">
                          {point}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative w-full md:w-2/5 min-h-[250px] md:min-h-full flex items-center justify-center p-8">
                  <div className="relative w-48 h-48">
                    <div className="absolute inset-0 bg-blue-200 dark:bg-blue-900/40 rounded-full blur-2xl opacity-50" />
                    <Image
                      src="/about-shield-desc.png"
                      width={650}
                      height={650}
                      alt="Verified Educational Security Shield"
                      className="object-cover rounded-3xl shadow-xl z-10 border-4 border-border"
                    />
                  </div>
                </div>
              </Card>

              <div className="flex flex-col gap-6">
                {/* Mission Section */}
                <Card className="flex flex-col p-8 rounded-2xl border-border shadow-sm bg-card h-full justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0">
                        <HugeiconsIcon icon={Target01Icon} size={20} />
                      </div>
                      <h3 className="text-lg font-bold text-foreground">Our Mission</h3>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-6">
                      To empower every CBC learner in Kenya with the knowledge, tools, and guidance to make informed academic choices and build a successful future.
                    </p>
                  </div>

                  <div className="bg-muted rounded-xl p-5 border border-border flex gap-4 items-start relative overflow-hidden">
                    <HugeiconsIcon
                      icon={QuoteUpIcon}
                      size={32}
                      className="text-blue-100 absolute -top-1 -left-1 opacity-50 rotate-180"
                    />
                    <div className="text-blue-600 dark:text-blue-300 shrink-0 relative z-10">
                      <HugeiconsIcon icon={QuoteUpIcon} size={24} className="fill-current" />
                    </div>
                    <p className="text-sm font-bold text-foreground italic relative z-10 leading-relaxed">
                      &ldquo;Your journey is unique. We&apos;re here to guide every step.&rdquo;
                    </p>
                  </div>
                </Card>
              </div>
            </div>

            {/* Call to Action Banner */}
            <Card className="w-full rounded-2xl bg-muted border border-border shadow-sm p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-card text-blue-600 dark:text-blue-300 shadow-sm flex items-center justify-center shrink-0">
                  <HugeiconsIcon icon={Mortarboard01Icon} size={28} />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-xl font-bold text-foreground mb-1">
                    Ready to discover your path?
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium">
                    Start exploring combinations, schools and careers that match who you are and where you want to go.
                  </p>
                </div>
              </div>

              <Link href="/explore-tracks" className="w-full md:w-auto shrink-0">
                <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm h-12 px-8 text-[15px]">
                  Explore Tracks <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="ml-2" />
                </Button>
              </Link>
            </Card>
          </div>
        </Card>
      </main>
    </div>
  );
}
