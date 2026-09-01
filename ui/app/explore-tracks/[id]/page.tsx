import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookmarkButton } from "@/components/bookmark-button";
import { NavBar } from "@/components/nav-bar";
import { ShareButton } from "@/components/share-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrackCombinationsClient } from "@/components/tracks/track-combinations-client";
import { getCombinations, getTrackById } from "@/lib/api/server";
import { siteConfig } from "@/lib/seo";
import { breadcrumbSchema, JsonLd } from "@/lib/structured-data";
import { cn } from "@/lib/utils";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Book01Icon,
  ChartBarLineIcon,
  FavouriteIcon,
  FlowSquareIcon,
  GlobalIcon,
  HelpCircleIcon,
  Home01Icon,
  Layers01Icon,
  MicroscopeIcon,
  MusicNote01Icon,
  Plant01Icon,
  RouteIcon,
  FootballIcon,
  Settings01Icon,
  StarIcon,
  UserGroupIcon,
  Wrench01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

// ─── Track icon/style map ─────────────────────────────────────────────────────

function getTrackStyle(name: string) {
  const n = name.toLowerCase();
  if (n.includes("pure"))
    return {
      icon: MicroscopeIcon,
      color: "text-blue-600 dark:text-blue-300",
      bg: "bg-blue-50 dark:bg-blue-950/30",
      ring: "ring-blue-200 dark:ring-blue-800/50",
    };
  if (n.includes("applied"))
    return {
      icon: Settings01Icon,
      color: "text-emerald-600 dark:text-emerald-300",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      ring: "ring-emerald-200 dark:ring-emerald-800/50",
    };
  if (n.includes("technical"))
    return {
      icon: Wrench01Icon,
      color: "text-orange-600 dark:text-orange-300",
      bg: "bg-orange-50 dark:bg-orange-950/30",
      ring: "ring-orange-200 dark:ring-orange-800/50",
    };
  if (n.includes("art"))
    return {
      icon: MusicNote01Icon,
      color: "text-purple-600 dark:text-purple-300",
      bg: "bg-purple-50 dark:bg-purple-950/30",
      ring: "ring-purple-200 dark:ring-purple-800/50",
    };
  if (n.includes("sport"))
    return {
      icon: FootballIcon,
      color: "text-rose-600 dark:text-rose-300",
      bg: "bg-rose-50 dark:bg-rose-950/30",
      ring: "ring-rose-200 dark:ring-rose-800/50",
    };
  if (n.includes("business") || n.includes("humanities"))
    return {
      icon: ChartBarLineIcon,
      color: "text-teal-600 dark:text-teal-300",
      bg: "bg-teal-50 dark:bg-teal-950/30",
      ring: "ring-teal-200 dark:ring-teal-800/50",
    };
  if (n.includes("language"))
    return {
      icon: GlobalIcon,
      color: "text-indigo-600 dark:text-indigo-300",
      bg: "bg-indigo-50 dark:bg-indigo-950/30",
      ring: "ring-indigo-200 dark:ring-indigo-800/50",
    };
  if (n.includes("agriculture"))
    return {
      icon: Plant01Icon,
      color: "text-lime-600 dark:text-lime-300",
      bg: "bg-lime-50 dark:bg-lime-950/30",
      ring: "ring-lime-200 dark:ring-lime-800/50",
    };
  return {
    icon: Book01Icon,
    color: "text-muted-foreground",
    bg: "bg-muted",
    ring: "ring-border",
  };
}

const MENU_ITEMS = [
  { label: "Overview", icon: Home01Icon },
  { label: "All Combinations", icon: Book01Icon },
  { label: "Subjects in this Track", icon: Layers01Icon },
  { label: "Career Pathways", icon: RouteIcon },
  { label: "Related Tracks", icon: FlowSquareIcon },
  { label: "Saved", icon: FavouriteIcon },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const track = await getTrackById(id);

  if (!track) {
    return {
      title: "Track Not Found | CBC Pathways",
      robots: { index: false, follow: false },
    };
  }

  const title = `${track.name} CBC Track & Subject Combinations`;
  const description =
    track.profile?.shortDescription ??
    `Explore ${track.name} subject combinations, career prospects, and schools under the ${track.pathway} pathway in Kenya.`;
  const url = `${siteConfig.url}/explore-tracks/${id}`;

  return {
    title,
    description,
    keywords: [
      track.name,
      track.pathway,
      "CBC track Kenya",
      "CBC subject combinations",
      "senior school Kenya",
    ],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
    },
  };
}

export default async function TrackCombinationsPage({ params }: Props) {
  const { id } = await params;
  const track = await getTrackById(id);

  if (!track) {
    notFound();
  }

  const { data: initialCombinations, meta: comboMeta } = await getCombinations({
    trackId: track.id,
    limit: 10,
    page: 1,
  });

  const trackStyle = getTrackStyle(track.name);
  const careerPathways = track.profile?.careerPathways ?? [];
  const totalCombinations = comboMeta.total;

  const breadcrumbData = breadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "CBC Tracks", url: `${siteConfig.url}/explore-tracks` },
    { name: track.name, url: `${siteConfig.url}/explore-tracks/${track.id}` },
  ]);

  const trackSavedItem = {
    id: track.id,
    type: "track" as const,
    title: track.name,
    subtitle: track.pathway,
    href: `/explore-tracks/${track.id}`,
  };

  return (
    <div className="min-h-screen bg-card font-sans flex flex-col items-center pb-20">
      <JsonLd data={breadcrumbData} />
      <NavBar />

      <main className="w-full max-w-[1400px] px-4 md:px-6 py-6 grid grid-cols-1 lg:grid-cols-[260px_1fr_280px] gap-6">
        {/* ── LEFT SIDEBAR ── */}
        <aside className="flex flex-col gap-6">
          <Link
            href="/explore-tracks"
            className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} className="mr-1.5" /> Back to Tracks
          </Link>

          {/* Track Identity */}
          <div className="flex flex-col items-center text-center gap-3 pb-5 border-b border-border">
            <div
              className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center ring-4",
                trackStyle.bg,
                trackStyle.ring,
              )}
            >
              <HugeiconsIcon icon={trackStyle.icon} size={40} className={trackStyle.color} />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">{track.name}</h2>
              <span className={cn("text-xs font-bold", trackStyle.color)}>
                {totalCombinations}+ combinations
              </span>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-0.5">
            {MENU_ITEMS.map((item, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                  idx === 1
                    ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-300"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <HugeiconsIcon
                  icon={item.icon}
                  size={18}
                  className={
                    idx === 1
                      ? "text-blue-600 dark:text-blue-300"
                      : "text-muted-foreground/80"
                  }
                />
                {item.label}
              </div>
            ))}
          </nav>

          {/* Help box */}
          <div className="p-5 rounded-2xl bg-muted border border-border flex flex-col gap-3 mt-auto">
            <h4 className="font-bold text-foreground text-sm">Need help choosing?</h4>
            <p className="text-xs font-medium text-muted-foreground leading-relaxed">
              Get personalized recommendations based on your interests.
            </p>
            <Link href="/recommendations">
              <Button
                variant="outline"
                className="w-full bg-card text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800/50 hover:bg-accent font-semibold rounded-xl h-9 text-sm"
              >
                Get Recommendations
              </Button>
            </Link>
          </div>
        </aside>

        {/* ── CENTER ── */}
        <div className="flex flex-col gap-6">
          {/* Track label + heading */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col gap-2 max-w-xl">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-5 h-5 rounded flex items-center justify-center",
                    trackStyle.bg,
                  )}
                >
                  <HugeiconsIcon icon={trackStyle.icon} size={12} className={trackStyle.color} />
                </div>
                <span
                  className={cn(
                    "text-xs font-bold tracking-wider uppercase",
                    trackStyle.color,
                  )}
                >
                  {track.name} Track
                </span>
              </div>
              <h1 className="text-4xl font-extrabold text-foreground leading-tight">
                Subject Combinations
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                {track.profile?.shortDescription ??
                  `Explore subject combinations under ${track.name} and discover the right path for your future goals.`}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <BookmarkButton
                  item={trackSavedItem}
                  className="rounded-xl border-border bg-card text-foreground hover:bg-muted"
                />
                <ShareButton
                  title={`${track.name} Track`}
                  text={`Explore ${track.name} subject combinations on CBC Pathways.`}
                  className="rounded-xl border-border bg-card text-foreground hover:bg-muted"
                />
              </div>
            </div>
            {/* Hero illustration */}
            <div
              className={cn(
                "w-36 h-36 shrink-0 rounded-full flex items-center justify-center ring-8",
                trackStyle.bg,
                trackStyle.ring,
              )}
            >
              <HugeiconsIcon
                icon={trackStyle.icon}
                size={72}
                className={cn("opacity-80", trackStyle.color)}
              />
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-1">
            <div className="flex flex-col items-center justify-center gap-1 p-4 rounded-2xl border border-border bg-muted/50">
              <HugeiconsIcon icon={Book01Icon} size={22} className={trackStyle.color} />
              <span className="text-xl font-extrabold text-foreground">
                {totalCombinations}+
              </span>
              <span className="text-[11px] font-semibold text-muted-foreground">Combinations</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-1 p-4 rounded-2xl border border-border bg-muted/50">
              <HugeiconsIcon
                icon={StarIcon}
                size={22}
                className="text-emerald-500 dark:text-emerald-300"
              />
              <span className="text-xl font-extrabold text-foreground">High</span>
              <span className="text-[11px] font-semibold text-muted-foreground">University Fit</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-1 p-4 rounded-2xl border border-border bg-muted/50">
              <HugeiconsIcon
                icon={ChartBarLineIcon}
                size={22}
                className="text-blue-500 dark:text-blue-300"
              />
              <span className="text-xl font-extrabold text-foreground">Strong</span>
              <span className="text-[11px] font-semibold text-muted-foreground">Career Prospects</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-1 p-4 rounded-2xl border border-border bg-muted/50">
              <HugeiconsIcon
                icon={RouteIcon}
                size={22}
                className="text-orange-500 dark:text-orange-300"
              />
              <span className="text-xl font-extrabold text-foreground">Future</span>
              <span className="text-[11px] font-semibold text-muted-foreground">Ready Skills</span>
            </div>
          </div>

          {/* Interactive Combination Island */}
          <TrackCombinationsClient
            track={track}
            initialCombinations={initialCombinations}
            initialTotal={totalCombinations}
            trackStyle={trackStyle}
          />
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <aside className="hidden lg:flex flex-col gap-6">
          {/* About track */}
          <Card className="flex flex-col p-6 rounded-2xl border-border shadow-sm gap-4">
            <h3 className="font-bold text-foreground">About {track.name}</h3>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              {track.profile?.description ??
                track.profile?.shortDescription ??
                `The ${track.name} track provides career pathways aligned to the ${track.pathway} pathway.`}
            </p>
            {track.profile?.highlights?.slice(0, 3).map((h, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 text-sm font-medium text-muted-foreground"
              >
                <HugeiconsIcon icon={StarIcon} size={14} className={trackStyle.color} />
                {h}
              </div>
            ))}
          </Card>

          {/* Top career pathways */}
          {careerPathways.length > 0 && (
            <Card className="flex flex-col p-6 rounded-2xl border-border shadow-sm gap-4">
              <h3 className="font-bold text-foreground">Top Career Pathways</h3>
              <div className="flex flex-col gap-3">
                {careerPathways.slice(0, 6).map((path, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between group cursor-pointer hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon icon={UserGroupIcon} size={16} className={trackStyle.color} />
                      <span className="text-sm font-medium text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-300">
                        {path}
                      </span>
                    </div>
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      size={14}
                      className="text-muted-foreground/60 group-hover:text-blue-500 dark:group-hover:text-blue-300"
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* CTA */}
          <Card className="flex flex-col p-6 rounded-2xl bg-muted border-none shadow-sm items-center text-center gap-4">
            <div className="w-12 h-12 rounded-full bg-card shadow-sm flex items-center justify-center">
              <HugeiconsIcon
                icon={HelpCircleIcon}
                size={24}
                className="text-blue-600 dark:text-blue-300"
              />
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-1">Not sure which combination?</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Get personalized recommendations based on your interests and goals.
              </p>
            </div>
            <Link href="/recommendations" className="w-full">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl h-11">
                Get Recommendations{" "}
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="ml-2" />
              </Button>
            </Link>
          </Card>
        </aside>
      </main>
    </div>
  );
}
