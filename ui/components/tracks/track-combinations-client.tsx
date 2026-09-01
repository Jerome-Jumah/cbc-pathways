"use client";

import { BookmarkButton } from "@/components/bookmark-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiGet, buildQuery } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import type { CombinationsListResponse, SubjectCombination, Track } from "@/types/api";
import {
  ArrowRight01Icon,
  Building03Icon,
  InformationCircleIcon,
  Search01Icon,
  StarIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useMemo, useState } from "react";

const PAGE_SIZE = 10;

function DifficultyBadge({ level }: { level: string | null | undefined }) {
  if (!level) return <span className="text-xs text-muted-foreground/80">—</span>;
  const l = level.toLowerCase();
  const cls = l.includes("challeng")
    ? "text-orange-500 dark:text-orange-300"
    : l.includes("difficult") || l.includes("hard")
      ? "text-red-500"
      : l.includes("moderate")
        ? "text-yellow-500"
        : "text-emerald-500 dark:text-emerald-300";
  return (
    <span className={cn("flex items-center gap-1 text-xs font-semibold", cls)}>
      <span className="w-2 h-2 rounded-full bg-current" />
      {level}
    </span>
  );
}

interface TrackCombinationsClientProps {
  track: Track;
  initialCombinations: SubjectCombination[];
  initialTotal: number;
  trackStyle: {
    icon: any;
    color: string;
    bg: string;
    ring: string;
  };
}

export function TrackCombinationsClient({
  track,
  initialCombinations,
  initialTotal,
  trackStyle,
}: TrackCombinationsClientProps) {
  const [combinations, setCombinations] = useState<SubjectCombination[]>(initialCombinations);
  const [totalCombinations] = useState(initialTotal);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  const loadMore = async () => {
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      const qs = buildQuery({ trackId: track.id, limit: PAGE_SIZE, page: nextPage });
      const res = await apiGet<CombinationsListResponse>(`/combinations${qs}`);
      setCombinations((prev) => [...prev, ...res.data.data]);
      setPage(nextPage);
    } catch {
      // ignore pagination errors
    } finally {
      setLoadingMore(false);
    }
  };

  const filtered = useMemo(() => {
    let list = combinations;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((c) =>
        c.Subjects.some((s) => s.name.toLowerCase().includes(q)),
      );
    }
    if (difficultyFilter !== "all") {
      list = list.filter((c) =>
        c.profile?.difficultyLevel?.toLowerCase().includes(difficultyFilter.toLowerCase()),
      );
    }
    return list;
  }, [combinations, searchQuery, difficultyFilter]);

  const hasMore = combinations.length < totalCombinations;

  return (
    <div className="flex flex-col gap-6">
      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <HugeiconsIcon
            icon={Search01Icon}
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/80"
          />
          <Input
            placeholder="Search combinations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 rounded-xl border-border text-sm"
          />
        </div>
        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger className="h-10 rounded-xl border-border text-sm w-[160px] shrink-0">
            <SelectValue placeholder="All Difficulties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Difficulties</SelectItem>
            <SelectItem value="challeng">Challenging</SelectItem>
            <SelectItem value="difficult">Difficult</SelectItem>
            <SelectItem value="moderate">Moderate</SelectItem>
            <SelectItem value="easy">Easy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Count */}
      <p className="text-xs font-semibold text-muted-foreground">
        Showing {filtered.length} of {totalCombinations} combinations
      </p>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center py-16 text-center gap-3">
          <HugeiconsIcon
            icon={InformationCircleIcon}
            size={32}
            className="text-muted-foreground/60"
          />
          <p className="font-bold text-muted-foreground">No combinations found</p>
          <p className="text-sm text-muted-foreground/80">
            {searchQuery ? "Try a different search term." : "No combinations on record yet."}
          </p>
        </div>
      )}

      {/* Combination Rows */}
      {filtered.length > 0 && (
        <div className="flex flex-col divide-y divide-border border border-border rounded-2xl overflow-hidden bg-card shadow-sm">
          {filtered.map((combo, idx) => (
            <div
              key={combo.id}
              className="flex items-center gap-4 px-5 py-4 hover:bg-muted/80 transition-colors group"
            >
              {/* Rank */}
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                  idx === 0 ? cn(trackStyle.bg, trackStyle.color) : "bg-muted text-muted-foreground",
                )}
              >
                {idx + 1}
              </div>

              {/* Name + badge */}
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-bold text-foreground leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                  {combo.Subjects.map((s) => s.name).join(", ")}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  {idx === 0 && (
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1",
                        trackStyle.bg,
                        trackStyle.color,
                      )}
                    >
                      <HugeiconsIcon icon={StarIcon} size={10} /> Most Popular
                    </span>
                  )}
                  {combo._count && (
                    <span className="text-[11px] font-semibold text-muted-foreground/80 flex items-center gap-1">
                      <HugeiconsIcon icon={Building03Icon} size={11} />
                      {combo._count.Schools} schools
                    </span>
                  )}
                </div>
              </div>

              {/* Difficulty */}
              <div className="hidden md:flex flex-col gap-0.5 w-28 shrink-0">
                <span className="text-[10px] font-semibold text-muted-foreground/80 uppercase tracking-wide">
                  Difficulty
                </span>
                <DifficultyBadge level={combo.profile?.difficultyLevel} />
              </div>

              {/* University fit proxy */}
              <div className="hidden lg:flex flex-col gap-0.5 w-24 shrink-0">
                <span className="text-[10px] font-semibold text-muted-foreground/80 uppercase tracking-wide">
                  University Fit
                </span>
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-50 dark:bg-emerald-950/300" />
                  {combo._count && combo._count.Schools > 50
                    ? "High"
                    : combo._count && combo._count.Schools > 20
                      ? "Good"
                      : "Available"}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <Link href={`/combination/${combo.id}`}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 px-4 rounded-xl border-border text-xs font-bold text-foreground hover:bg-accent hover:text-blue-600 dark:hover:text-blue-300 hover:border-blue-200 dark:hover:border-blue-800/50 transition-all"
                  >
                    View Details{" "}
                    <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="ml-1" />
                  </Button>
                </Link>
                <BookmarkButton
                  item={{
                    id: combo.id,
                    type: "combination",
                    title: combo.Subjects.map((s) => s.name).join(", "),
                    subtitle: `${track.name} · ${combo._count?.Schools ?? 0} schools`,
                    href: `/combination/${combo.id}`,
                  }}
                  showLabel={false}
                  variant="ghost"
                  className="text-muted-foreground/60 hover:text-blue-600 dark:hover:text-blue-300"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-2">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={loadingMore}
            className="h-11 px-8 rounded-xl border-border font-semibold text-sm text-foreground hover:bg-muted flex items-center gap-2"
          >
            {loadingMore ? (
              <>
                <div className="w-4 h-4 border-2 border-border border-t-blue-600 rounded-full animate-spin" />
                Loading…
              </>
            ) : (
              <>
                Load more combinations{" "}
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="rotate-90" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
