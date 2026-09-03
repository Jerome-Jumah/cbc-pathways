import { BookmarkButton } from "@/components/bookmark-button";
import { NavBar } from "@/components/nav-bar";
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
  ChartBarLineIcon,
  GlobalIcon,
  InformationCircleIcon,
  MicroscopeIcon,
  MusicNote01Icon,
  Plant01Icon,
  RouteIcon,
  FootballIcon,
  Settings01Icon,
  Wrench01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";

// ─── Track icon/style by name (consistent with detail page) ───────────────────

function getTrackStyle(name: string) {
  const n = name.toLowerCase();
  if (n.includes("pure"))
    return {
      color: "bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/40",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-300",
      textColor: "text-blue-600 dark:text-blue-300",
      icon: MicroscopeIcon,
    };
  if (n.includes("applied"))
    return {
      color: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/40",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
      iconColor: "text-emerald-600 dark:text-emerald-300",
      textColor: "text-emerald-600 dark:text-emerald-300",
      icon: Settings01Icon,
    };
  if (n.includes("technical"))
    return {
      color: "bg-orange-50 dark:bg-orange-950/30 border-orange-100 dark:border-orange-900/40",
      iconBg: "bg-orange-100 dark:bg-orange-900/30",
      iconColor: "text-orange-600 dark:text-orange-300",
      textColor: "text-orange-600 dark:text-orange-300",
      icon: Wrench01Icon,
    };
  if (n.includes("art"))
    return {
      color: "bg-purple-50 dark:bg-purple-950/30 border-purple-100 dark:border-purple-900/40",
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:text-purple-300",
      textColor: "text-purple-600 dark:text-purple-300",
      icon: MusicNote01Icon,
    };
  if (n.includes("sport"))
    return {
      color: "bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900/40",
      iconBg: "bg-rose-100 dark:bg-rose-900/30",
      iconColor: "text-rose-600 dark:text-rose-300",
      textColor: "text-rose-600 dark:text-rose-300",
      icon: FootballIcon,
    };
  if (n.includes("business") || n.includes("humanities"))
    return {
      color: "bg-teal-50 dark:bg-teal-950/30 border-teal-100 dark:border-teal-900/40",
      iconBg: "bg-teal-100 dark:bg-teal-900/30",
      iconColor: "text-teal-600 dark:text-teal-300",
      textColor: "text-teal-600 dark:text-teal-300",
      icon: ChartBarLineIcon,
    };
  if (n.includes("language"))
    return {
      color: "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-100 dark:border-indigo-900/40",
      iconBg: "bg-indigo-100 dark:bg-indigo-900/30",
      iconColor: "text-indigo-600 dark:text-indigo-300",
      textColor: "text-indigo-600 dark:text-indigo-300",
      icon: GlobalIcon,
    };
  if (n.includes("agriculture"))
    return {
      color: "bg-lime-50 dark:bg-lime-950/30 border-lime-100 dark:border-lime-900/40",
      iconBg: "bg-lime-100 dark:bg-lime-900/30",
      iconColor: "text-lime-600 dark:text-lime-300",
      textColor: "text-lime-600 dark:text-lime-300",
      icon: Plant01Icon,
    };
  return {
    color: "bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/40",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-300",
    textColor: "text-blue-600 dark:text-blue-300",
    icon: Book01Icon,
  };
}

export default async function ExploreTracksPage() {
  let tracks: Track[] = [];
  try {
    tracks = await getTracks();
  } catch {
    tracks = [];
  }

  const trackCount = tracks.length > 0 ? tracks.length : 7;
  const breadcrumbData = breadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "CBC Tracks", url: `${siteConfig.url}/explore-tracks` },
  ]);

  return (
    <div className="min-h-screen bg-muted/50 font-sans flex flex-col items-center">
      <JsonLd data={breadcrumbData} />
      <NavBar />

      <main className="w-full max-w-[1400px] px-4 md:px-6 py-4 md:py-8 flex flex-col gap-12 mt-4 pb-24">
        {/* Hero Section */}
        <section className="flex flex-col lg:flex-row justify-between items-center gap-12 relative">
          {/* Left Text */}
          <div className="flex flex-col gap-6 max-w-xl z-10">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-md bg-blue-600 text-white text-xs font-bold shadow-sm">
                3
              </span>
              <span className="text-sm font-bold text-muted-foreground tracking-wider uppercase">Explore Tracks Page</span>
            </div>

            <h1 className="text-4xl lg:text-[44px] font-extrabold text-foreground leading-tight tracking-tight">Explore CBC Tracks</h1>

            <p className="text-lg text-muted-foreground leading-relaxed font-medium">
              Discover {trackCount} CBC tracks and 500+ subject combinations designed to shape your future.
            </p>
          </div>

          {/* Right Image */}
          <div className="relative w-full lg:w-[480px] h-[280px] shrink-0">
            <div className="absolute top-0 right-0 w-full h-full bg-blue-50 dark:bg-blue-950/30 rounded-[3rem] -z-10 blur-3xl opacity-50" />
            <Image
              src="/stack-book.png"
              alt="Stacked CBC textbooks illustrating senior school pathways in Kenya"
              width={400}
              height={400}
              className="object-contain rounded-3xl shadow-sm opacity-95 dark:opacity-100 dark:brightness-110 dark:contrast-110"
              priority
            />
          </div>
        </section>

        {/* Stats Bar */}
        <Card className="w-full bg-card rounded-2xl border border-border shadow-sm p-8 mt-4 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border gap-8 md:gap-0">
            <div className="flex items-center gap-5 md:px-8 first:pl-0">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                <HugeiconsIcon icon={RouteIcon} size={28} />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xl font-extrabold text-foreground">{trackCount} Tracks</span>
                <span className="text-sm text-muted-foreground font-medium">Career pathways</span>
              </div>
            </div>

            <div className="flex items-center gap-5 md:px-8">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                <HugeiconsIcon icon={Book01Icon} size={28} />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xl font-extrabold text-foreground">500+ Combinations</span>
                <span className="text-sm text-muted-foreground font-medium">Subject combinations</span>
              </div>
            </div>

            <div className="flex items-center gap-5 md:px-8 last:pr-0">
              <div className="w-14 h-14 rounded-2xl bg-purple-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                <HugeiconsIcon icon={Building03Icon} size={28} />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xl font-extrabold text-foreground">10,000+ Schools</span>
                <span className="text-sm text-muted-foreground font-medium">Across Kenya</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Tracks Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-20">
          {tracks.map((track, idx) => {
            const style = getTrackStyle(track.name);
            const profileDesc =
              track.profile?.shortDescription ??
              track.profile?.description?.slice(0, 120) ??
              `Explore ${track.name} combinations and career pathways.`;
            const careerPreview = track.profile?.careerPathways?.slice(0, 2) ?? [];

            return (
              <div
                key={track.id}
                className={cn(
                  "relative flex flex-col p-6 rounded-2xl border transition-transform hover:-translate-y-1 hover:shadow-sm h-full",
                  style.color,
                )}
              >
                <BookmarkButton
                  item={{
                    id: track.id,
                    type: "track",
                    title: track.name,
                    subtitle: track.pathway,
                    href: `/explore-tracks/${track.id}`,
                  }}
                  showLabel={false}
                  variant="ghost"
                  className="absolute right-4 top-4 text-muted-foreground hover:text-blue-600 dark:hover:text-blue-300"
                />

                {/* Top Left Number Badge */}
                <div className="w-6 h-6 rounded-full bg-card flex items-center justify-center text-[11px] font-bold shadow-sm text-muted-foreground mb-6">
                  {idx + 1}
                </div>

                {/* Main Content */}
                <div className="flex flex-col xl:flex-row gap-5 mb-8 flex-1">
                  {/* Icon */}
                  <div
                    className={cn(
                      "w-20 h-20 shrink-0 rounded-full flex items-center justify-center shadow-sm",
                      style.iconBg,
                      style.iconColor,
                    )}
                  >
                    <HugeiconsIcon icon={style.icon} size={40} />
                  </div>

                  {/* Text Content */}
                  <div className="flex flex-col">
                    <h2 className="text-lg font-bold text-foreground mb-1 leading-tight">{track.name}</h2>
                    <span className={cn("text-xs font-bold mb-3", style.textColor)}>{track.pathway}</span>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">{profileDesc}</p>
                    {careerPreview.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {careerPreview.map(career => (
                          <span
                            key={career}
                            className="text-[10px] font-semibold bg-card/70 text-muted-foreground rounded-full px-2 py-0.5 border border-border/60"
                          >
                            {career}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Link */}
                <Link
                  href={`/explore-tracks/${track.id}`}
                  className={cn("flex items-center text-sm font-bold transition-opacity hover:opacity-80 mt-auto", style.textColor)}
                >
                  Explore combinations
                  <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="ml-1" />
                </Link>
              </div>
            );
          })}

          {/* Call To Action Card */}
          <div className="flex flex-col p-6 rounded-2xl border border-border bg-card shadow-sm transition-transform hover:-translate-y-1 h-full">
            <div className="flex items-center gap-4 mt-6">
              <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center shrink-0">
                <HugeiconsIcon icon={InformationCircleIcon} size={28} className="text-blue-600 dark:text-blue-300" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-bold text-foreground leading-tight mb-1">Not sure where to start?</h3>
              </div>
            </div>

            <p className="text-sm text-muted-foreground font-medium leading-relaxed mt-4 mb-6">
              Get personalized recommendations based on your interests and favorite subjects.
            </p>

            <Link href="/recommendations" className="mt-auto">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 rounded-xl font-bold shadow-sm">
                Get Recommendations
                <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
