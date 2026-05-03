"use client"

import { NavBar } from "@/components/nav-bar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getClusterLabel } from "@/constants/filter-options"
import { ApiError, apiGet } from "@/lib/api-client"
import { cn } from "@/lib/utils"
import type {
  NewSchoolCombinationsResponse,
  SchoolCombinationsByTrack,
  SchoolProfileData,
  SchoolProfileResponse,
} from "@/types/api"
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Book01Icon,
  Building03Icon,
  CheckmarkCircle01Icon,
  FavouriteIcon,
  Home01Icon,
  Idea01Icon,
  Image01Icon,
  InformationCircleIcon,
  Location01Icon,
  RefreshIcon,
  RouteIcon,
  Settings01Icon,
  Share01Icon,
  Task01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

const TRACK_COLORS = [
  { color: "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-300 border-blue-100 dark:border-blue-900/40", badgeColor: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300", icon: Idea01Icon },
  { color: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900/40", badgeColor: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300", icon: Settings01Icon },
  { color: "bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-300 border-purple-100 dark:border-purple-900/40", badgeColor: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300", icon: Book01Icon },
  { color: "bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-300 border-orange-100 dark:border-orange-900/40", badgeColor: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300", icon: RouteIcon },
]

const SIDEBAR_LINKS = [
  { label: "Overview", icon: Home01Icon },
  { label: "Subject Combinations", icon: Task01Icon },
  { label: "Tracks Offered", icon: RouteIcon },
  { label: "Gallery", icon: Image01Icon },
  { label: "More Information", icon: InformationCircleIcon },
]

export default function SchoolDetailsPage() {
  const params = useParams()
  const schoolId = params.id as string

  const [activeTab, setActiveTab] = useState("Overview")
  const [data, setData] = useState<SchoolProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [combos, setCombos] = useState<SchoolCombinationsByTrack[]>([])
  const [combosLoading, setCombosLoading] = useState(true)
  const [combosError, setCombosError] = useState<string | null>(null)

  useEffect(() => {
    if (!schoolId) return
    const fetchSchoolData = async () => {
      setLoading(true)
      setError(null)
      setCombosError(null)

      try {
        const [profileRes, combosRes] = await Promise.all([
          apiGet<SchoolProfileResponse>(`/schools/${encodeURIComponent(schoolId)}/profile`),
          apiGet<NewSchoolCombinationsResponse>(`/schools/${encodeURIComponent(schoolId)}/combinations`),
        ])
        setData(profileRes.data)
        setCombos(combosRes.data.byTrack)
      } catch (err) {
        const profileErr = err instanceof ApiError ? err.message : "Failed to load school data."
        setError(profileErr)
        setCombosError(profileErr)
      } finally {
        setLoading(false)
        setCombosLoading(false)
      }
    }

    fetchSchoolData()
  }, [schoolId])

  // Separate combos error handling
  useEffect(() => {
    if (combosError) return
  }, [combosError])

  if (loading) {
    return (
      <div className="min-h-screen bg-background font-sans flex flex-col items-center">
        <NavBar />
        <div className="flex flex-col items-center justify-center flex-1 mt-32">
          <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800/50 border-t-blue-600 rounded-full animate-spin mb-4" />
          <p className="text-sm font-medium text-muted-foreground">Loading school profile…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background font-sans flex flex-col items-center">
        <NavBar />
        <div className="flex flex-col items-center justify-center flex-1 mt-32 text-center px-6">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <HugeiconsIcon icon={InformationCircleIcon} size={32} className="text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Unable to load school</h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-sm">{error}</p>
          <div className="flex gap-3">
            <Link href="/find-schools">
              <Button variant="outline" className="rounded-xl border-border font-semibold">
                <HugeiconsIcon icon={ArrowLeft01Icon} size={16} className="mr-2" /> Back to Schools
              </Button>
            </Link>
            <Button
              onClick={() => window.location.reload()}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              <HugeiconsIcon icon={RefreshIcon} size={16} className="mr-2" /> Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!data) return null

  const { school, profile } = data
  const clusterLabel = getClusterLabel(school.cluster)
  const totalCombinations = combos.reduce((acc, t) => acc + t.combinations.length, 0)

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col items-center">
      <NavBar />

      <main className="w-full max-w-[1400px] px-6 py-8 grid grid-cols-1 lg:grid-cols-[240px_1fr_320px] gap-8">

        {/* Left Sidebar */}
        <Card className="flex flex-col gap-8 p-6 rounded-2xl shadow-sm h-fit">
          <div className="flex flex-col gap-4">
            <Link href="/find-schools" className="flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-2">
              <HugeiconsIcon icon={ArrowLeft01Icon} size={16} className="mr-2" />
              Back to results
            </Link>

            <nav className="flex flex-col gap-1">
              {SIDEBAR_LINKS.map((link) => (
                <button
                  key={link.label}
                  onClick={() => setActiveTab(link.label)}
                  className={cn(
                    "flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-colors text-left leading-snug",
                    activeTab === link.label
                      ? "bg-muted/80 text-blue-600 dark:text-blue-300"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <HugeiconsIcon
                    icon={link.icon}
                    size={20}
                    className={cn("mr-3 shrink-0", activeTab === link.label ? "text-blue-600 dark:text-blue-300" : "text-muted-foreground/80")}
                  />
                  <span>{link.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-5 rounded-2xl bg-muted border border-border flex flex-col gap-3">
            <h3 className="font-bold text-foreground">Need help deciding?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-1">
              Get personalized recommendations based on your interests.
            </p>
            <Link href="/recommendations">
              <Button variant="outline" className="w-full bg-card text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800/50 hover:bg-accent hover:text-blue-700 dark:hover:text-blue-300 font-semibold h-auto py-2.5 rounded-xl whitespace-normal leading-snug">
                Get Recommendations
              </Button>
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-muted border border-border flex flex-row items-center gap-4 cursor-pointer hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-muted-foreground/80 shrink-0 shadow-sm">
              <HugeiconsIcon icon={FavouriteIcon} size={20} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-foreground text-sm">Save this school</span>
              <span className="text-xs text-muted-foreground font-medium">Add to favorites</span>
            </div>
          </div>
        </Card>

        {/* Main Center Content */}
        <Card className="flex flex-col gap-8 rounded-2xl shadow-sm overflow-hidden h-fit pb-8">

          {/* Header banner */}
          <div className="relative w-full h-[200px] rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            <div className="relative z-10 flex flex-col items-center text-white">
              <div className="w-16 h-16 rounded-2xl bg-card/20 flex items-center justify-center mb-2">
                <HugeiconsIcon icon={Book01Icon} size={32} className="text-white" />
              </div>
              <p className="text-white/80 text-sm font-semibold">{school.county}</p>
            </div>
            <Button className="absolute top-4 right-4 bg-card/90 hover:bg-card text-foreground text-sm font-semibold rounded-xl h-10 px-4 shadow-sm backdrop-blur-sm">
              <HugeiconsIcon icon={FavouriteIcon} size={18} className="mr-2" />
              Save
            </Button>
          </div>

          {/* School Header Info */}
          <div className="flex flex-col sm:flex-row gap-6 items-start px-4">
            <div className="w-20 h-20 rounded-2xl bg-card p-2 shadow-lg shrink-0 border border-border">
              <div className="w-full h-full rounded-xl bg-emerald-800 flex items-center justify-center">
                <HugeiconsIcon icon={Book01Icon} className="text-white" size={28} />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h1 className="text-3xl font-extrabold text-foreground tracking-tight">{school.name}</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground font-medium">
                <div className="flex items-center gap-1.5">
                  <HugeiconsIcon icon={Location01Icon} size={16} className="text-muted-foreground/80" />
                  {school.county}
                </div>
                {school.cluster && (
                  <>
                    <Badge variant="outline" className="px-2 py-0 h-6 font-semibold border border-blue-200 dark:border-blue-800/50 text-blue-600 dark:text-blue-300 bg-card rounded-md">
                      {school.cluster}
                    </Badge>
                    <span className="text-muted-foreground -ml-2">({clusterLabel})</span>
                  </>
                )}
                {school.gender && (
                  <div className="flex items-center gap-1.5">
                    <HugeiconsIcon icon={UserGroupIcon} size={16} className="text-muted-foreground/80" />
                    {school.gender}
                  </div>
                )}
                {school.accommodationType && (
                  <div className="flex items-center gap-1.5">
                    <HugeiconsIcon icon={Building03Icon} size={16} className="text-muted-foreground/80" />
                    {school.accommodationType}
                  </div>
                )}
              </div>
            </div>
          </div>

          {profile?.overview && (
            <div className="px-4">
              <p className="text-muted-foreground leading-relaxed max-w-3xl">{profile.overview}</p>
            </div>
          )}

          {!profile && (
            <div className="px-4">
              <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl p-4">
                <HugeiconsIcon icon={InformationCircleIcon} size={18} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-700 font-medium">
                  Detailed profile for this school is coming soon.
                </p>
              </div>
            </div>
          )}

          <div className="px-4">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" className="border-border text-foreground hover:bg-muted font-semibold rounded-xl h-11 px-6 shadow-sm">
                <HugeiconsIcon icon={Share01Icon} size={18} className="mr-2 text-blue-600 dark:text-blue-300" />
                Share
              </Button>
              <Button variant="outline" className="border-border text-foreground hover:bg-muted font-semibold rounded-xl h-11 px-6 shadow-sm">
                <HugeiconsIcon icon={FavouriteIcon} size={18} className="mr-2 text-blue-600 dark:text-blue-300" />
                Save School
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-8 border-b border-border px-4 mt-4 overflow-x-auto no-scrollbar">
            {SIDEBAR_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => setActiveTab(link.label)}
                className={cn(
                  "pb-4 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap",
                  activeTab === link.label
                    ? "border-blue-600 text-blue-600 dark:text-blue-300"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="px-8 flex flex-col gap-8">
            {activeTab === "Overview" && (
              <>
                <div className="flex flex-col gap-4">
                  <h3 className="text-lg font-bold text-foreground">Quick Facts</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex flex-col p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/40">
                      <span className="text-xs font-semibold text-blue-400 mb-1">Combinations</span>
                      <span className="text-2xl font-extrabold text-blue-700 dark:text-blue-300">{combosLoading ? "…" : totalCombinations}</span>
                    </div>
                    <div className="flex flex-col p-4 bg-muted rounded-xl border border-border">
                      <span className="text-xs font-semibold text-muted-foreground/80 mb-1">Tracks</span>
                      <span className="text-2xl font-extrabold text-foreground">{school.tracksOffered.length}</span>
                    </div>
                    {school.cluster && (
                      <div className="flex flex-col p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                        <span className="text-xs font-semibold text-emerald-400 mb-1">Cluster</span>
                        <span className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300">{school.cluster}</span>
                      </div>
                    )}
                    {school.gender && (
                      <div className="flex flex-col p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-100 dark:border-purple-900/40">
                        <span className="text-xs font-semibold text-purple-400 mb-1">Gender</span>
                        <span className="text-lg font-extrabold text-purple-700 dark:text-purple-300">{school.gender}</span>
                      </div>
                    )}
                  </div>
                </div>

                {profile?.highlights && profile.highlights.length > 0 && (
                  <>
                    <Separator className="bg-muted" />
                    <div className="flex flex-col gap-4">
                      <h3 className="text-lg font-bold text-foreground">Highlights</h3>
                      <div className="flex flex-col gap-3">
                        {profile.highlights.map((highlight, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <HugeiconsIcon icon={CheckmarkCircle01Icon} size={18} className="text-emerald-500 dark:text-emerald-300 shrink-0 mt-0.5" />
                            <span className="text-sm font-medium text-muted-foreground leading-snug">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {activeTab === "Subject Combinations" && (
              <div className="flex flex-col gap-6">
                <h3 className="text-lg font-bold text-foreground">
                  Subject Combinations <span className="text-muted-foreground font-medium">({combosLoading ? "…" : totalCombinations})</span>
                </h3>

                {combosLoading && (
                  <div className="flex items-center gap-3 py-6">
                    <div className="w-8 h-8 border-4 border-blue-200 dark:border-blue-800/50 border-t-blue-600 rounded-full animate-spin" />
                    <p className="text-sm font-medium text-muted-foreground">Loading combinations…</p>
                  </div>
                )}

                {!combosLoading && combos.length === 0 && (
                  <div className="flex items-start gap-3 bg-muted border border-border rounded-xl p-4">
                    <HugeiconsIcon icon={InformationCircleIcon} size={18} className="text-muted-foreground/80 shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">No combinations on record for this school yet.</p>
                  </div>
                )}

                {!combosLoading && combos.map((trackGroup, tidx) => {
                  const style = TRACK_COLORS[tidx % TRACK_COLORS.length]
                  return (
                    <div key={trackGroup.trackId} className="flex flex-col gap-3">
                      <div className={cn("flex items-center gap-3 px-4 py-3 rounded-xl border", style.color)}>
                        <HugeiconsIcon icon={style.icon} size={20} className="shrink-0" />
                        <div className="flex flex-col flex-1">
                          <span className="font-bold text-foreground text-sm">{trackGroup.trackName}</span>
                          <span className="text-xs font-medium opacity-70">{trackGroup.pathway} · {trackGroup.combinations.length} combinations</span>
                        </div>
                        <Link href={`/explore-tracks/${trackGroup.trackId}`}>
                          <Badge variant="secondary" className={cn("border-none font-semibold text-xs cursor-pointer hover:opacity-80", style.badgeColor)}>
                            Explore Track
                          </Badge>
                        </Link>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-4">
                        {trackGroup.combinations.map((combo) => (
                          <Link
                            key={combo.id}
                            href={`/combination/${combo.id}`}
                            className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-blue-200 dark:hover:border-blue-800/50 hover:shadow-sm transition-all group"
                          >
                            <div className="flex flex-col flex-1 min-w-0">
                              <span className="text-sm font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors leading-snug line-clamp-2">
                                {combo.Subjects.map((s) => s.name).join(", ")}
                              </span>
                              <span className="text-[11px] font-semibold text-muted-foreground/80 mt-0.5">{combo.code}</span>
                            </div>
                            <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="text-muted-foreground/60 group-hover:text-blue-500 dark:group-hover:text-blue-300 transition-colors shrink-0" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {activeTab === "Tracks Offered" && (
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-bold text-foreground">
                  Tracks Offered <span className="text-muted-foreground font-medium">({school.tracksOffered.length})</span>
                </h3>
                {school.tracksOffered.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No tracks data available.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {school.tracksOffered.map((trackName, idx) => {
                      const style = TRACK_COLORS[idx % TRACK_COLORS.length]
                      return (
                        <div key={trackName} className={cn("rounded-2xl border p-5 flex gap-4 items-start transition-shadow hover:shadow-sm", style.color)}>
                          <div className="w-12 h-12 rounded-xl bg-card shadow-sm flex items-center justify-center shrink-0 mt-1">
                            <HugeiconsIcon icon={style.icon} size={24} className="opacity-80" />
                          </div>
                          <div className="flex flex-col gap-2">
                            <h4 className="font-bold text-base text-foreground">{trackName}</h4>
                            <Badge variant="secondary" className={cn("self-start mt-2 border-none font-semibold px-2.5 py-0.5", style.badgeColor)}>
                              Available
                            </Badge>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === "Gallery" && (
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-bold text-foreground">Gallery</h3>
                <div className="flex items-start gap-3 bg-muted border border-border rounded-xl p-4">
                  <HugeiconsIcon icon={Image01Icon} size={18} className="text-muted-foreground/80 shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">School photos are not available yet.</p>
                </div>
              </div>
            )}

            {activeTab === "More Information" && (
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-bold text-foreground">More Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-border bg-muted p-4">
                    <span className="text-xs font-semibold text-muted-foreground/80">County</span>
                    <p className="text-sm font-bold text-foreground mt-1">{school.county}</p>
                  </div>
                  {school.category && (
                    <div className="rounded-xl border border-border bg-muted p-4">
                      <span className="text-xs font-semibold text-muted-foreground/80">Category</span>
                      <p className="text-sm font-bold text-foreground mt-1">{school.category}</p>
                    </div>
                  )}
                  {school.accommodationType && (
                    <div className="rounded-xl border border-border bg-muted p-4">
                      <span className="text-xs font-semibold text-muted-foreground/80">Accommodation</span>
                      <p className="text-sm font-bold text-foreground mt-1">{school.accommodationType}</p>
                    </div>
                  )}
                  {profile?.sourceUrl && (
                    <div className="rounded-xl border border-border bg-muted p-4">
                      <span className="text-xs font-semibold text-muted-foreground/80">Source</span>
                      <a href={profile.sourceUrl} className="block text-sm font-bold text-blue-600 dark:text-blue-300 mt-1 hover:text-blue-700 dark:hover:text-blue-300" target="_blank" rel="noreferrer">
                        View source
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Right Sidebar */}
        <Card className="flex flex-col gap-6 p-6 rounded-2xl shadow-sm h-fit">
          <h3 className="font-bold text-foreground">At a glance</h3>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-[28px_110px_1fr] items-start text-sm">
              <HugeiconsIcon icon={Location01Icon} size={16} className="text-muted-foreground/80 mt-0.5" />
              <span className="font-semibold text-foreground">County</span>
              <span className="text-muted-foreground font-medium">{school.county}</span>
            </div>
            <Separator className="bg-muted" />
            {school.cluster && (
              <>
                <div className="grid grid-cols-[28px_110px_1fr] items-start text-sm">
                  <HugeiconsIcon icon={Task01Icon} size={16} className="text-muted-foreground/80 mt-0.5" />
                  <span className="font-semibold text-foreground">Cluster</span>
                  <span className="text-muted-foreground font-medium">{school.cluster} ({clusterLabel})</span>
                </div>
                <Separator className="bg-muted" />
              </>
            )}
            {school.gender && (
              <>
                <div className="grid grid-cols-[28px_110px_1fr] items-start text-sm">
                  <HugeiconsIcon icon={UserGroupIcon} size={16} className="text-muted-foreground/80 mt-0.5" />
                  <span className="font-semibold text-foreground">Gender</span>
                  <span className="text-muted-foreground font-medium">{school.gender}</span>
                </div>
                <Separator className="bg-muted" />
              </>
            )}
            {school.accommodationType && (
              <>
                <div className="grid grid-cols-[28px_110px_1fr] items-start text-sm">
                  <HugeiconsIcon icon={Building03Icon} size={16} className="text-muted-foreground/80 mt-0.5" />
                  <span className="font-semibold text-foreground">Accommodation</span>
                  <span className="text-muted-foreground font-medium">{school.accommodationType}</span>
                </div>
                <Separator className="bg-muted" />
              </>
            )}
            <div className="grid grid-cols-[28px_110px_1fr] items-start text-sm">
              <HugeiconsIcon icon={Book01Icon} size={16} className="text-muted-foreground/80 mt-0.5" />
              <span className="font-semibold text-foreground">Combinations</span>
              <span className="text-muted-foreground font-medium">{combosLoading ? "…" : totalCombinations}</span>
            </div>
          </div>

          {school.category && (
            <>
              <Separator className="bg-muted" />
              <div className="flex flex-col gap-2">
                <h4 className="font-bold text-foreground text-sm">School Category</h4>
                <Badge variant="secondary" className="bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-none font-semibold w-fit">
                  {school.category}
                </Badge>
              </div>
            </>
          )}

          <Separator className="bg-muted" />

          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-foreground text-sm">Tracks Offered</h4>
            {school.tracksOffered.length === 0 ? (
              <p className="text-xs text-muted-foreground/80">None on record</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {school.tracksOffered.map((t) => (
                  <Badge key={t} variant="secondary" className="bg-muted text-muted-foreground border-none font-medium text-xs">
                    {t}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </Card>

      </main>
    </div>
  )
}
