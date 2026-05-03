"use client"

import { NavBar } from "@/components/nav-bar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ApiError, apiGet, buildQuery } from "@/lib/api-client"
import { cn } from "@/lib/utils"
import type { CombinationsListResponse, SubjectCombination, Track, TrackResponse } from "@/types/api"
import {
  ArrowLeft01Icon, ArrowRight01Icon,
  Book01Icon, BookmarkAdd01Icon,
  Building03Icon,
  ChartBarLineIcon,
  FavouriteIcon,
  FlowSquareIcon,
  GlobalIcon,
  HelpCircleIcon,
  Home01Icon,
  InformationCircleIcon,
  Layers01Icon,
  MicroscopeIcon,
  MusicNote01Icon,
  Plant01Icon,
  RouteIcon,
  FootballIcon,
  Search01Icon,
  Settings01Icon,
  StarIcon,
  UserGroupIcon,
  Wrench01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

// ─── Track icon/style map (keyed by track name keywords) ──────────────────────
function getTrackStyle(name: string) {
  const n = name.toLowerCase()
  if (n.includes("pure")) return { icon: MicroscopeIcon, color: "text-blue-600 dark:text-blue-300", bg: "bg-blue-50 dark:bg-blue-950/30", ring: "ring-blue-200 dark:ring-blue-800/50" }
  if (n.includes("applied")) return { icon: Settings01Icon, color: "text-emerald-600 dark:text-emerald-300", bg: "bg-emerald-50 dark:bg-emerald-950/30", ring: "ring-emerald-200 dark:ring-emerald-800/50" }
  if (n.includes("technical")) return { icon: Wrench01Icon, color: "text-orange-600 dark:text-orange-300", bg: "bg-orange-50 dark:bg-orange-950/30", ring: "ring-orange-200 dark:ring-orange-800/50" }
  if (n.includes("art")) return { icon: MusicNote01Icon, color: "text-purple-600 dark:text-purple-300", bg: "bg-purple-50 dark:bg-purple-950/30", ring: "ring-purple-200 dark:ring-purple-800/50" }
  if (n.includes("sport")) return { icon: FootballIcon, color: "text-rose-600 dark:text-rose-300", bg: "bg-rose-50 dark:bg-rose-950/30", ring: "ring-rose-200 dark:ring-rose-800/50" }
  if (n.includes("business") || n.includes("humanities")) return { icon: ChartBarLineIcon, color: "text-teal-600 dark:text-teal-300", bg: "bg-teal-50 dark:bg-teal-950/30", ring: "ring-teal-200 dark:ring-teal-800/50" }
  if (n.includes("language")) return { icon: GlobalIcon, color: "text-indigo-600 dark:text-indigo-300", bg: "bg-indigo-50 dark:bg-indigo-950/30", ring: "ring-indigo-200 dark:ring-indigo-800/50" }
  if (n.includes("agriculture")) return { icon: Plant01Icon, color: "text-lime-600 dark:text-lime-300", bg: "bg-lime-50 dark:bg-lime-950/30", ring: "ring-lime-200 dark:ring-lime-800/50" }
  return { icon: Book01Icon, color: "text-muted-foreground", bg: "bg-muted", ring: "ring-border" }
}

// ─── Difficulty badge ──────────────────────────────────────────────────────────
function DifficultyBadge({ level }: { level: string | null | undefined }) {
  if (!level) return <span className="text-xs text-muted-foreground/80">—</span>
  const l = level.toLowerCase()
  const cls = l.includes("challeng") ? "text-orange-500 dark:text-orange-300" : l.includes("difficult") || l.includes("hard") ? "text-red-500" : l.includes("moderate") ? "text-yellow-500" : "text-emerald-500 dark:text-emerald-300"
  return (
    <span className={cn("flex items-center gap-1 text-xs font-semibold", cls)}>
      <span className="w-2 h-2 rounded-full bg-current" />
      {level}
    </span>
  )
}

const PAGE_SIZE = 10

const MENU_ITEMS = [
  { label: "Overview", icon: Home01Icon },
  { label: "All Combinations", icon: Book01Icon },
  { label: "Subjects in this Track", icon: Layers01Icon },
  { label: "Career Pathways", icon: RouteIcon },
  { label: "Related Tracks", icon: FlowSquareIcon },
  { label: "Saved", icon: FavouriteIcon },
]

export default function TrackCombinationsPage() {
  const params = useParams()
  const trackId = params.id as string

  const [track, setTrack] = useState<Track | null>(null)
  const [trackLoading, setTrackLoading] = useState(true)
  const [trackError, setTrackError] = useState<string | null>(null)

  const [allCombinations, setAllCombinations] = useState<SubjectCombination[]>([])
  const [totalCombinations, setTotalCombinations] = useState(0)
  const [combosLoading, setCombosLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)

  const [searchQuery, setSearchQuery] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState("all")

  // Fetch track profile
  useEffect(() => {
    if (!trackId) return
    const fetchTrack = async () => {
      setTrackLoading(true)
      setTrackError(null)

      try {
        const res = await apiGet<TrackResponse>(`/track-profiles/${encodeURIComponent(trackId)}`)
        setTrack(res.data)
      } catch (err) {
        setTrackError(err instanceof ApiError ? err.message : "Failed to load track.")
      } finally {
        setTrackLoading(false)
      }
    }

    fetchTrack()
  }, [trackId])

  // Fetch first page of combinations
  useEffect(() => {
    if (!trackId) return
    const fetchCombinations = async () => {
      setCombosLoading(true)

      try {
        const qs = buildQuery({ trackId, limit: PAGE_SIZE, page: 1 })
        const res = await apiGet<CombinationsListResponse>(`/combinations${qs}`)
        setAllCombinations(res.data.data)
        setTotalCombinations(res.data.meta.total)
        setPage(1)
      } catch {
        setAllCombinations([])
        setTotalCombinations(0)
      } finally {
        setCombosLoading(false)
      }
    }

    fetchCombinations()
  }, [trackId])

  const loadMore = async () => {
    const nextPage = page + 1
    setLoadingMore(true)
    try {
      const qs = buildQuery({ trackId, limit: PAGE_SIZE, page: nextPage })
      const res = await apiGet<CombinationsListResponse>(`/combinations${qs}`)
      setAllCombinations((prev) => [...prev, ...res.data.data])
      setPage(nextPage)
    } finally {
      setLoadingMore(false)
    }
  }

  const hasMore = allCombinations.length < totalCombinations

  // Client-side filtering
  const filtered = useMemo(() => {
    let list = allCombinations
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      list = list.filter((c) => c.Subjects.some((s) => s.name.toLowerCase().includes(q)))
    }
    if (difficultyFilter !== "all") {
      list = list.filter((c) =>
        c.profile?.difficultyLevel?.toLowerCase().includes(difficultyFilter.toLowerCase())
      )
    }
    return list
  }, [allCombinations, searchQuery, difficultyFilter])

  const trackStyle = track ? getTrackStyle(track.name) : getTrackStyle("")
  const careerPathways = track?.profile?.careerPathways ?? []

  if (trackLoading) {
    return (
      <div className="min-h-screen bg-card flex flex-col items-center">
        <NavBar />
        <div className="flex flex-col items-center justify-center flex-1 mt-32">
          <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800/50 border-t-blue-600 rounded-full animate-spin mb-4" />
          <p className="text-sm font-medium text-muted-foreground">Loading track…</p>
        </div>
      </div>
    )
  }

  if (trackError || !track) {
    return (
      <div className="min-h-screen bg-card flex flex-col items-center">
        <NavBar />
        <div className="flex flex-col items-center justify-center flex-1 mt-32 text-center px-6">
          <p className="text-base font-bold text-foreground mb-4">{trackError ?? "Track not found"}</p>
          <Link href="/explore-tracks">
            <Button variant="outline" className="rounded-xl font-semibold">
              <HugeiconsIcon icon={ArrowLeft01Icon} size={16} className="mr-2" /> Back to Tracks
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-card font-sans flex flex-col items-center pb-20">
      <NavBar />

      <main className="w-full max-w-[1400px] px-4 md:px-6 py-6 grid grid-cols-1 lg:grid-cols-[260px_1fr_280px] gap-6">

        {/* ── LEFT SIDEBAR ── */}
        <aside className="flex flex-col gap-6">
          <Link href="/explore-tracks" className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} className="mr-1.5" /> Back to Tracks
          </Link>

          {/* Track Identity */}
          <div className="flex flex-col items-center text-center gap-3 pb-5 border-b border-border">
            <div className={cn("w-20 h-20 rounded-full flex items-center justify-center ring-4", trackStyle.bg, trackStyle.ring)}>
              <HugeiconsIcon icon={trackStyle.icon} size={40} className={trackStyle.color} />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">{track.name}</h2>
              <span className={cn("text-xs font-bold", trackStyle.color)}>{totalCombinations}+ combinations</span>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-0.5">
            {MENU_ITEMS.map((item, idx) => (
              <button key={idx} className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-left transition-colors",
                idx === 1 ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-300" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}>
                <HugeiconsIcon icon={item.icon} size={18} className={idx === 1 ? "text-blue-600 dark:text-blue-300" : "text-muted-foreground/80"} />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Help box */}
          <div className="p-5 rounded-2xl bg-muted border border-border flex flex-col gap-3 mt-auto">
            <h4 className="font-bold text-foreground text-sm">Need help choosing?</h4>
            <p className="text-xs font-medium text-muted-foreground leading-relaxed">
              Get personalized recommendations based on your interests.
            </p>
            <Link href="/recommendations">
              <Button variant="outline" className="w-full bg-card text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800/50 hover:bg-accent font-semibold rounded-xl h-9 text-sm">
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
                <div className={cn("w-5 h-5 rounded flex items-center justify-center", trackStyle.bg)}>
                  <HugeiconsIcon icon={trackStyle.icon} size={12} className={trackStyle.color} />
                </div>
                <span className={cn("text-xs font-bold tracking-wider uppercase", trackStyle.color)}>
                  {track.name} Track
                </span>
              </div>
              <h1 className="text-4xl font-extrabold text-foreground leading-tight">Subject Combinations</h1>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                {track.profile?.shortDescription ?? `Explore subject combinations under ${track.name} and discover the right path for your future goals.`}
              </p>
            </div>
            {/* Hero illustration */}
            <div className={cn("w-36 h-36 shrink-0 rounded-full flex items-center justify-center ring-8", trackStyle.bg, trackStyle.ring)}>
              <HugeiconsIcon icon={trackStyle.icon} size={72} className={cn("opacity-80", trackStyle.color)} />
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-1">
            <div className="flex flex-col items-center justify-center gap-1 p-4 rounded-2xl border border-border bg-muted/50">
              <HugeiconsIcon icon={Book01Icon} size={22} className={trackStyle.color} />
              <span className="text-xl font-extrabold text-foreground">{totalCombinations}+</span>
              <span className="text-[11px] font-semibold text-muted-foreground">Combinations</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-1 p-4 rounded-2xl border border-border bg-muted/50">
              <HugeiconsIcon icon={StarIcon} size={22} className="text-emerald-500 dark:text-emerald-300" />
              <span className="text-xl font-extrabold text-foreground">High</span>
              <span className="text-[11px] font-semibold text-muted-foreground">University Fit</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-1 p-4 rounded-2xl border border-border bg-muted/50">
              <HugeiconsIcon icon={ChartBarLineIcon} size={22} className="text-blue-500 dark:text-blue-300" />
              <span className="text-xl font-extrabold text-foreground">Strong</span>
              <span className="text-[11px] font-semibold text-muted-foreground">Career Prospects</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-1 p-4 rounded-2xl border border-border bg-muted/50">
              <HugeiconsIcon icon={RouteIcon} size={22} className="text-orange-500 dark:text-orange-300" />
              <span className="text-xl font-extrabold text-foreground">Future</span>
              <span className="text-[11px] font-semibold text-muted-foreground">Ready Skills</span>
            </div>
          </div>

          {/* Search + filters */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <HugeiconsIcon icon={Search01Icon} size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/80" />
              <Input
                placeholder="Search combinations"
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
            Showing {combosLoading ? "…" : filtered.length} combinations
          </p>

          {/* Loading */}
          {combosLoading && (
            <div className="flex items-center gap-3 py-12 justify-center">
              <div className="w-8 h-8 border-4 border-blue-200 dark:border-blue-800/50 border-t-blue-600 rounded-full animate-spin" />
              <span className="text-sm text-muted-foreground font-medium">Loading combinations…</span>
            </div>
          )}

          {/* Empty */}
          {!combosLoading && filtered.length === 0 && (
            <div className="flex flex-col items-center py-16 text-center gap-3">
              <HugeiconsIcon icon={InformationCircleIcon} size={32} className="text-muted-foreground/60" />
              <p className="font-bold text-muted-foreground">No combinations found</p>
              <p className="text-sm text-muted-foreground/80">{searchQuery ? "Try a different search term." : "No combinations on record yet."}</p>
            </div>
          )}

          {/* Combination Rows */}
          {!combosLoading && filtered.length > 0 && (
            <div className="flex flex-col divide-y divide-border border border-border rounded-2xl overflow-hidden bg-card shadow-sm">
              {filtered.map((combo, idx) => (
                <div key={combo.id} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/80 transition-colors group">
                  {/* Rank */}
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                    idx === 0 ? cn(trackStyle.bg, trackStyle.color) : "bg-muted text-muted-foreground"
                  )}>
                    {idx + 1}
                  </div>

                  {/* Name + badge */}
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-sm font-bold text-foreground leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                      {combo.Subjects.map((s) => s.name).join(", ")}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      {idx === 0 && (
                        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1", trackStyle.bg, trackStyle.color)}>
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
                    <span className="text-[10px] font-semibold text-muted-foreground/80 uppercase tracking-wide">Difficulty</span>
                    <DifficultyBadge level={combo.profile?.difficultyLevel} />
                  </div>

                  {/* University fit proxy */}
                  <div className="hidden lg:flex flex-col gap-0.5 w-24 shrink-0">
                    <span className="text-[10px] font-semibold text-muted-foreground/80 uppercase tracking-wide">University Fit</span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
                      <span className="w-2 h-2 rounded-full bg-emerald-50 dark:bg-emerald-950/300" />
                      {combo._count && combo._count.Schools > 50 ? "High" : combo._count && combo._count.Schools > 20 ? "Good" : "Available"}
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
                        View Details <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="ml-1" />
                      </Button>
                    </Link>
                    <button className="p-1.5 text-muted-foreground/60 hover:text-muted-foreground transition-colors">
                      <HugeiconsIcon icon={BookmarkAdd01Icon} size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Load More */}
          {!combosLoading && hasMore && (
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
                  <>Load more combinations <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="rotate-90" /></>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <aside className="hidden lg:flex flex-col gap-6">

          {/* About track */}
          <Card className="flex flex-col p-6 rounded-2xl border-border shadow-sm gap-4">
            <h3 className="font-bold text-foreground">About {track.name}</h3>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              {track.profile?.description ?? track.profile?.shortDescription ?? `The ${track.name} track provides career pathways aligned to the ${track.pathway} pathway.`}
            </p>
            {track.profile?.highlights?.slice(0, 3).map((h, i) => (
              <div key={i} className="flex items-center gap-2.5 text-sm font-medium text-muted-foreground">
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
                  <div key={idx} className="flex items-center justify-between group cursor-pointer hover:text-blue-600 dark:hover:text-blue-300 transition-colors">
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon icon={UserGroupIcon} size={16} className={trackStyle.color} />
                      <span className="text-sm font-medium text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-300">{path}</span>
                    </div>
                    <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="text-muted-foreground/60 group-hover:text-blue-500 dark:group-hover:text-blue-300" />
                  </div>
                ))}
              </div>
              {careerPathways.length > 6 && (
                <button className={cn("text-sm font-bold flex items-center gap-1", trackStyle.color)}>
                  View all pathways <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                </button>
              )}
            </Card>
          )}

          {/* CTA */}
          <Card className="flex flex-col p-6 rounded-2xl bg-muted border-none shadow-sm items-center text-center gap-4">
            <div className="w-12 h-12 rounded-full bg-card shadow-sm flex items-center justify-center">
              <HugeiconsIcon icon={HelpCircleIcon} size={24} className="text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-1">Not sure which combination?</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Get personalized recommendations based on your interests and goals.</p>
            </div>
            <Link href="/recommendations" className="w-full">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl h-11">
                Get Recommendations <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="ml-2" />
              </Button>
            </Link>
          </Card>
        </aside>

      </main>
    </div>
  )
}
