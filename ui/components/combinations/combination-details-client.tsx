"use client";

import { BookmarkButton } from "@/components/bookmark-button";
import { ShareButton } from "@/components/share-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apiGet } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import type { CombinationProfileData, CombinationProfileResponse } from "@/types/api";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Book01Icon,
  Building03Icon,
  CheckmarkCircle01Icon,
  FavouriteIcon,
  Home01Icon,
  InformationCircleIcon,
  Layers01Icon,
  Mortarboard01Icon,
  Plant01Icon,
  RouteIcon,
  Task01Icon,
  TestTube01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useState } from "react";

const MENU_ITEMS = [
  { label: "Overview", icon: Home01Icon },
  { label: "Schools Offering", icon: Building03Icon },
  { label: "Career Pathways", icon: RouteIcon },
  { label: "Requirements", icon: Task01Icon },
  { label: "Subject Details", icon: Book01Icon },
  { label: "Related Combinations", icon: Layers01Icon },
  { label: "Save Combination", icon: FavouriteIcon },
];

interface CombinationDetailsClientProps {
  initialData: CombinationProfileData;
  combinationId: string;
}

export function CombinationDetailsClient({
  initialData,
  combinationId,
}: CombinationDetailsClientProps) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [data, setData] = useState<CombinationProfileData>(initialData);
  const [generating, setGenerating] = useState(false);

  const combination = data.combination;
  const profile = data.profile;
  const isPending = !profile && (data.found === false || !data.profile);

  const handleGenerateProfile = async () => {
    setGenerating(true);
    try {
      const res = await apiGet<CombinationProfileResponse>(
        `/combinations/${encodeURIComponent(combinationId)}/profile?generate=true`,
      );
      if (res.data) {
        setData(res.data);
      }
    } catch {
      // ignore generation errors on client
    } finally {
      setGenerating(false);
    }
  };

  const subjectList = combination?.subjects ?? [];
  const careerPathways = profile?.careerPathways ?? [];
  const keyBenefits = profile?.keyBenefits ?? [];
  const combinationTitle = combination?.subjects.join(", ") ?? "Combination Profile";

  const combinationSavedItem = combination
    ? {
        id: combination.id,
        type: "combination" as const,
        title: combinationTitle,
        subtitle: `${combination.track} · ${combination.schoolCount} schools`,
        href: `/combination/${combination.id}`,
      }
    : null;

  return (
    <>
      {/* Top Bar */}
      <div className="w-full bg-card border-b border-border py-4 px-6 flex justify-center sticky top-0 z-30 shadow-sm">
        <div className="w-full max-w-[1400px]">
          <Link
            href="/recommendations"
            className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} className="mr-2" /> Back to results
          </Link>
        </div>
      </div>

      <main className="w-full max-w-[1400px] px-4 md:px-6 py-4 md:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pb-24">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Main Icon Card */}
          <Card className="w-full aspect-square rounded-3xl bg-indigo-50 dark:bg-indigo-950/30 border-none shadow-sm flex items-center justify-center">
            <HugeiconsIcon
              icon={TestTube01Icon}
              size={120}
              className="text-blue-600 dark:text-blue-300"
            />
          </Card>

          {/* Navigation Menu */}
          <div className="flex flex-col gap-1">
            {MENU_ITEMS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(item.label)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left",
                  activeTab === item.label
                    ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-300"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <HugeiconsIcon
                  icon={item.icon}
                  size={20}
                  className={
                    activeTab === item.label
                      ? "text-blue-600 dark:text-blue-300"
                      : "text-muted-foreground"
                  }
                />
                {item.label}
              </button>
            ))}
          </div>

          {/* Help Box */}
          <Card className="flex flex-col p-5 rounded-2xl border-border bg-card shadow-sm mt-4">
            <h4 className="font-bold text-foreground mb-2">Need help choosing?</h4>
            <p className="text-sm font-medium text-muted-foreground mb-4 leading-relaxed">
              Get personalized recommendations based on your interests.
            </p>
            <Link href="/recommendations">
              <Button
                variant="outline"
                className="w-full bg-card text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800/50 hover:bg-accent hover:text-blue-700 dark:hover:text-blue-300 font-semibold rounded-xl"
              >
                Get Recommendations
              </Button>
            </Link>
          </Card>
        </div>

        {/* CENTER COLUMN */}
        <div className="lg:col-span-6 flex flex-col">
          {combination ? (
            <>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                  <HugeiconsIcon
                    icon={TestTube01Icon}
                    size={20}
                    className="text-blue-600 dark:text-blue-300"
                  />
                </div>
                <h1 className="text-3xl font-extrabold text-foreground">
                  {combination.subjects.join(", ")}
                </h1>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <Badge
                  variant="secondary"
                  className="bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-300 border-none font-bold px-3 py-1"
                >
                  {combination.track}
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-muted text-muted-foreground border-none font-medium px-3 py-1"
                >
                  {combination.pathway}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-3 mb-8">
                {combinationSavedItem && (
                  <BookmarkButton
                    item={combinationSavedItem}
                    className="rounded-xl border-border text-foreground hover:bg-muted"
                  />
                )}
                <ShareButton
                  title={combinationTitle}
                  text={`View this CBC subject combination on CBC Pathways.`}
                  className="rounded-xl border-border text-foreground hover:bg-muted"
                />
              </div>

              {/* Mini Stats */}
              <div className="flex flex-wrap items-center gap-6 mb-8 text-sm font-semibold">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <HugeiconsIcon
                    icon={Building03Icon}
                    size={18}
                    className="text-blue-600 dark:text-blue-300"
                  />
                  <span>{combination.schoolCount} schools offer this</span>
                </div>
                {profile?.difficultyLevel && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <HugeiconsIcon
                      icon={Mortarboard01Icon}
                      size={18}
                      className="text-purple-600 dark:text-purple-300"
                    />
                    <span>{profile.difficultyLevel}</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="mb-6">
              <h1 className="text-3xl font-extrabold text-foreground mb-2">
                Combination Profile
              </h1>
            </div>
          )}

          {/* Horizontal Tabs */}
          <div className="flex items-center gap-8 border-b border-border mb-8 overflow-x-auto">
            {["Overview", "Career Pathways", "Subject Details"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "pb-3 text-sm font-bold whitespace-nowrap transition-colors relative",
                  activeTab === tab
                    ? "text-blue-600 dark:text-blue-300"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-blue-600 rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          {/* Profile pending state */}
          {isPending && (
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl p-5 mb-8">
              <HugeiconsIcon
                icon={InformationCircleIcon}
                size={18}
                className="text-amber-500 shrink-0 mt-0.5"
              />
              <div className="flex flex-col gap-2">
                <p className="text-sm font-bold text-amber-800">Profile insights available on request</p>
                <p className="text-sm text-amber-700">
                  Generate instant AI career pathways, difficulty breakdown, and subject insights for this combination.
                </p>
                <Button
                  size="sm"
                  disabled={generating}
                  className="self-start mt-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold h-9 px-4"
                  onClick={handleGenerateProfile}
                >
                  {generating ? "Generating…" : "Generate Profile Insights"}
                </Button>
              </div>
            </div>
          )}

          {/* Overview Section */}
          {profile?.overview && (
            <div className="mb-10">
              <h3 className="text-lg font-bold text-foreground mb-3">About this Combination</h3>
              <p className="text-[15px] text-muted-foreground font-medium leading-relaxed mb-6">
                {profile.overview}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profile.bestFor && (
                  <Card className="flex flex-col p-4 rounded-2xl border bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/40 shadow-none">
                    <div className="flex items-center gap-2 mb-3">
                      <HugeiconsIcon
                        icon={Book01Icon}
                        size={18}
                        className="text-blue-600 dark:text-blue-300"
                      />
                      <span className="text-sm font-bold text-foreground">Best For</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                      {profile.bestFor}
                    </p>
                  </Card>
                )}
                {profile.difficultyLevel && (
                  <Card className="flex flex-col p-4 rounded-2xl border bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/40 shadow-none">
                    <div className="flex items-center gap-2 mb-3">
                      <HugeiconsIcon
                        icon={Mortarboard01Icon}
                        size={18}
                        className="text-emerald-600 dark:text-emerald-300"
                      />
                      <span className="text-sm font-bold text-foreground">Difficulty Level</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">
                      {profile.difficultyLevel}
                    </p>
                    <Badge
                      variant="secondary"
                      className="mt-2 self-start bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-none font-bold text-[10px]"
                    >
                      {profile.difficultyLevel}
                    </Badge>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* Subjects Table */}
          {subjectList.length > 0 && (
            <div className="mb-10">
              <h3 className="text-lg font-bold text-foreground mb-4">
                Subjects in this Combination
              </h3>
              <div className="border border-border rounded-2xl bg-card overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="py-4 px-6 font-semibold text-muted-foreground text-xs tracking-wider uppercase">
                        Subject
                      </th>
                      <th className="py-4 px-6 font-semibold text-muted-foreground text-xs tracking-wider uppercase">
                        Track
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {subjectList.map((sub, idx) => (
                      <tr key={idx} className="hover:bg-muted/50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center shrink-0">
                              <HugeiconsIcon
                                icon={TestTube01Icon}
                                size={16}
                                className="text-blue-600 dark:text-blue-300"
                              />
                            </div>
                            <span className="font-bold text-foreground">{sub}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-medium text-muted-foreground">
                          {combination?.track ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="bg-blue-50 dark:bg-blue-950/30 p-4 border-t border-border flex items-start gap-3">
                  <HugeiconsIcon
                    icon={InformationCircleIcon}
                    size={18}
                    className="text-blue-600 dark:text-blue-300 mt-0.5 shrink-0"
                  />
                  <p className="text-sm font-medium text-muted-foreground">
                    These subjects form part of the {combination?.track} track under the{" "}
                    {combination?.pathway} pathway.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Schools offering - crawlable link to find-schools */}
          {combination && (
            <div className="mb-10">
              <h3 className="text-lg font-bold text-foreground mb-4">
                Schools Offering This Combination
              </h3>
              <div className="flex flex-col items-center justify-center p-8 bg-muted rounded-2xl border border-border text-center">
                <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center mb-4">
                  <HugeiconsIcon
                    icon={Building03Icon}
                    size={28}
                    className="text-blue-600 dark:text-blue-300"
                  />
                </div>
                <p className="text-2xl font-extrabold text-foreground mb-1">
                  {combination.schoolCount}
                </p>
                <p className="text-sm text-muted-foreground font-medium mb-6">
                  schools offer this combination across Kenya
                </p>
                <Link href={`/find-schools?subjects=${combination.subjects.join(",")}`}>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold h-11 px-8">
                    View Schools{" "}
                    <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Top Career Pathways */}
          {careerPathways.length > 0 && (
            <Card className="flex flex-col p-6 rounded-2xl border-border shadow-sm">
              <h3 className="font-bold text-foreground mb-5">Top Career Pathways</h3>
              <div className="flex flex-col gap-4">
                {careerPathways.map((path, idx) => (
                  <div key={idx} className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center shrink-0">
                      <HugeiconsIcon
                        icon={Plant01Icon}
                        size={18}
                        className="text-blue-600 dark:text-blue-300"
                      />
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="text-sm font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                        {path}
                      </span>
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-300">
                        Strong pathway
                      </span>
                    </div>
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      size={16}
                      className="text-muted-foreground/60 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors"
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Key Benefits */}
          {keyBenefits.length > 0 && (
            <Card className="flex flex-col p-6 rounded-2xl border-border shadow-sm">
              <h3 className="font-bold text-foreground mb-5">Key Benefits</h3>
              <div className="flex flex-col gap-4">
                {keyBenefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <HugeiconsIcon
                      icon={CheckmarkCircle01Icon}
                      size={18}
                      className="text-emerald-500 dark:text-emerald-300 shrink-0 mt-0.5"
                    />
                    <span className="text-sm font-medium text-foreground leading-snug">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Combination metadata */}
          {combination && (
            <Card className="flex flex-col p-6 rounded-2xl border-border shadow-sm gap-4">
              <h3 className="font-bold text-foreground">At a glance</h3>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-muted-foreground">Track</span>
                  <Badge
                    variant="secondary"
                    className="bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-none font-medium"
                  >
                    {combination.track}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-muted-foreground">Pathway</span>
                  <span className="text-foreground font-medium">{combination.pathway}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-muted-foreground">Schools</span>
                  <span className="text-foreground font-bold">{combination.schoolCount}</span>
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>
    </>
  );
}
