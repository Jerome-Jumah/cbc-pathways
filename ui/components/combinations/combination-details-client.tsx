"use client";

import { BookmarkButton } from "@/components/bookmark-button";
import { CombinationProfilePending } from "@/components/combinations/combination-profile-pending";
import { ShareButton } from "@/components/share-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useHumanVerification } from "@/context/human-verification-context";
import { ApiError, apiGet } from "@/lib/api/client";
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
  Layers01Icon,
  Mortarboard01Icon,
  RouteIcon,
  Task01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
  const [generationError, setGenerationError] = useState<string | null>(null);

  const { isHumanVerified, openVerificationPrompt } = useHumanVerification();

  const combination = data.combination;
  const profile = data.profile;
  const isPending = !profile && (data.found === false || !data.profile);

  const executeGenerationRef = useRef<(() => Promise<void>) | null>(null);

  const executeGeneration = useCallback(async () => {
    setGenerating(true);
    setGenerationError(null);
    try {
      const res = await apiGet<CombinationProfileResponse>(
        `/combinations/${encodeURIComponent(combinationId)}/profile?generate=true`,
      );
      if (res.data) {
        setData(res.data);
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        openVerificationPrompt({
          title: "Verify to Generate Insights",
          description:
            "Please complete verification to generate AI career pathways and subject insights for this combination.",
          onSuccess: () => {
            void executeGenerationRef.current?.();
          },
        });
      } else {
        setGenerationError(
          err instanceof ApiError ? err.message : "Failed to generate combination profile.",
        );
      }
    } finally {
      setGenerating(false);
    }
  }, [combinationId, openVerificationPrompt]);

  useEffect(() => {
    executeGenerationRef.current = executeGeneration;
  }, [executeGeneration]);

  const handleGenerateClick = useCallback(() => {
    if (!isHumanVerified) {
      openVerificationPrompt({
        title: "Verify to Generate Insights",
        description:
          "Please complete verification to generate AI career pathways and subject insights for this combination.",
        onSuccess: () => {
          void executeGenerationRef.current?.();
        },
      });
      return;
    }
    void executeGeneration();
  }, [isHumanVerified, openVerificationPrompt, executeGeneration]);

  const subjectList = combination?.subjects ?? [];
  const careerPathways = profile?.careerPathways ?? [];
  const keyBenefits = profile?.keyBenefits ?? [];
  const combinationTitle = combination?.subjects.join(", ") ?? "Combination Profile";

  const combinationSavedItem = useMemo(
    () =>
      combination
        ? {
            id: combination.id,
            type: "combination" as const,
            title: combinationTitle,
            subtitle: `${combination.track} · ${combination.schoolCount} schools`,
            href: `/combination/${combination.id}`,
          }
        : null,
    [combination, combinationTitle],
  );

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

      {/* Main Layout */}
      <main className="w-full max-w-[1400px] px-4 md:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sticky Sidebar */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-6 sticky top-24">
          <Card className="flex flex-col p-4 rounded-2xl border-border shadow-sm">
            <h3 className="font-bold text-foreground text-sm mb-4 px-3">Quick Navigation</h3>
            <div className="flex flex-col gap-1">
              {MENU_ITEMS.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    if (item.label === "Save Combination" && combinationSavedItem) {
                      // Handled by bookmark button
                    } else if (
                      item.label === "Overview" ||
                      item.label === "Career Pathways" ||
                      item.label === "Subject Details"
                    ) {
                      setActiveTab(item.label);
                    }
                  }}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors text-left",
                    activeTab === item.label
                      ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <HugeiconsIcon icon={item.icon} size={18} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Action Card */}
          {combination && (
            <Card className="flex flex-col p-5 rounded-2xl border-border shadow-sm gap-3">
              <h4 className="font-bold text-sm text-foreground">Find Schools</h4>
              <p className="text-xs text-muted-foreground font-medium">
                Looking for senior schools offering this combination in your county?
              </p>
              <Link
                href={`/find-schools?combinationId=${combination.id}`}
                className="mt-2 w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-center text-xs font-bold transition-colors"
              >
                View Offering Schools
              </Link>
            </Card>
          )}
        </div>

        {/* Center Main Content Area */}
        <div className="lg:col-span-6 flex flex-col">
          {/* Header Card / Hero */}
          {combination ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 border-none font-bold text-xs uppercase px-3 py-1">
                    {combination.pathway}
                  </Badge>
                  <Badge variant="outline" className="border-border text-muted-foreground font-medium text-xs px-3 py-1">
                    {combination.track}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <ShareButton
                    title={`${combinationTitle} - CBC Pathways`}
                    text={`Check out the ${combinationTitle} combination under ${combination.track} on CBC Pathways!`}
                    className="p-2 border border-border rounded-xl hover:bg-muted text-muted-foreground transition-colors"
                  />
                  {combinationSavedItem && (
                    <BookmarkButton
                      item={combinationSavedItem}
                      className="p-2 border border-border rounded-xl hover:bg-muted text-muted-foreground transition-colors"
                    />
                  )}
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-4">
                {combinationTitle}
              </h1>

              {/* Subject Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {subjectList.map((subject, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-foreground text-xs font-bold border border-border"
                  >
                    <HugeiconsIcon icon={Book01Icon} size={13} className="text-blue-600 dark:text-blue-300" />
                    {subject}
                  </span>
                ))}
              </div>

              {/* Quick Info Badges */}
              <div className="flex flex-wrap items-center gap-4 py-3 border-y border-border mb-6 text-xs font-semibold text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <HugeiconsIcon icon={Building03Icon} size={16} className="text-blue-600 dark:text-blue-300" />
                  <span>
                    <strong className="text-foreground">{combination.schoolCount}</strong> Schools offering
                  </span>
                </div>
                {profile?.difficultyLevel && (
                  <div className="flex items-center gap-1.5">
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
            <CombinationProfilePending
              onGenerate={handleGenerateClick}
              isGenerating={generating}
              generationError={generationError}
            />
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
                      Balanced Workload
                    </Badge>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* Career Pathways */}
          {careerPathways.length > 0 && (
            <div className="mb-10">
              <h3 className="text-lg font-bold text-foreground mb-4">Top Career Pathways</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {careerPathways.map((career, idx) => (
                  <Card
                    key={idx}
                    className="p-4 rounded-2xl border-border shadow-sm flex items-center gap-3 bg-card"
                  >
                    <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0">
                      <HugeiconsIcon icon={RouteIcon} size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-foreground">{career}</span>
                      <span className="text-xs text-muted-foreground font-medium">
                        Direct alignment
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Subject Details */}
          {profile?.subjectDetails && profile.subjectDetails.length > 0 && (
            <div className="mb-10">
              <h3 className="text-lg font-bold text-foreground mb-4">Subject Deep Dive</h3>
              <div className="flex flex-col gap-4">
                {profile.subjectDetails.map((sub, idx) => (
                  <Card key={idx} className="p-5 rounded-2xl border-border shadow-sm flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-muted text-foreground flex items-center justify-center font-bold text-xs">
                          {idx + 1}
                        </div>
                        <h4 className="font-bold text-foreground text-sm">{sub.subject}</h4>
                      </div>
                      {sub.importance && (
                        <Badge
                          variant="secondary"
                          className="bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-none font-bold text-[11px]"
                        >
                          {sub.importance}
                        </Badge>
                      )}
                    </div>
                    {sub.skillsGained && sub.skillsGained.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {sub.skillsGained.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[11px] font-semibold bg-muted text-muted-foreground px-2 py-0.5 rounded-md"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Subject Requirements / Focus */}
          <div className="mb-10">
            <h3 className="text-lg font-bold text-foreground mb-4">Academic Requirements</h3>
            <Card className="p-5 rounded-2xl border-border shadow-sm flex flex-col gap-3 bg-muted/40">
              <div className="flex items-start gap-3">
                <HugeiconsIcon
                  icon={Task01Icon}
                  size={18}
                  className="text-blue-600 dark:text-blue-300 shrink-0 mt-0.5"
                />
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-foreground">Junior School Performance</span>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                    Learners are assessed based on KJSEA continuous assessment tests and final national evaluation
                    with emphasis on matching core subjects.
                  </p>
                </div>
              </div>
            </Card>
          </div>

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

        {/* Right Sticky Column */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Related Tracks / Combinations */}
          {combination?.track && (
            <Card className="flex flex-col p-6 rounded-2xl border-border shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-foreground text-sm">Similar in {combination.track}</h3>
                <Link
                  href="/explore-tracks"
                  className="text-xs text-blue-600 dark:text-blue-300 font-bold hover:underline"
                >
                  All
                </Link>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { name: "Biology, Chemistry, Physics", count: "120+ schools" },
                  { name: "Biology, Chemistry, Agriculture", count: "95+ schools" },
                  { name: "Chemistry, Physics, Computer Studies", count: "64+ schools" },
                ].map((rel, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-muted transition-colors cursor-pointer group"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                        {rel.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {rel.count}
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
