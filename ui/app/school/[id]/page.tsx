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
  { color: "bg-blue-50 text-blue-600 border-blue-100", badgeColor: "bg-blue-100 text-blue-700", icon: Idea01Icon },
  { color: "bg-emerald-50 text-emerald-600 border-emerald-100", badgeColor: "bg-emerald-100 text-emerald-700", icon: Settings01Icon },
  { color: "bg-purple-50 text-purple-600 border-purple-100", badgeColor: "bg-purple-100 text-purple-700", icon: Book01Icon },
  { color: "bg-orange-50 text-orange-600 border-orange-100", badgeColor: "bg-orange-100 text-orange-700", icon: RouteIcon },
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
      <div className="min-h-screen bg-[#f8fafe] font-sans flex flex-col items-center">
        <NavBar />
        <div className="flex flex-col items-center justify-center flex-1 mt-32">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
          <p className="text-sm font-medium text-slate-500">Loading school profile…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8fafe] font-sans flex flex-col items-center">
        <NavBar />
        <div className="flex flex-col items-center justify-center flex-1 mt-32 text-center px-6">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <HugeiconsIcon icon={InformationCircleIcon} size={32} className="text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Unable to load school</h2>
          <p className="text-slate-500 text-sm mb-6 max-w-sm">{error}</p>
          <div className="flex gap-3">
            <Link href="/find-schools">
              <Button variant="outline" className="rounded-xl border-slate-200 font-semibold">
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
    <div className="min-h-screen bg-[#f8fafe] font-sans flex flex-col items-center">
      <NavBar />

      <main className="w-full max-w-[1400px] px-6 py-8 grid grid-cols-1 lg:grid-cols-[240px_1fr_320px] gap-8">

        {/* Left Sidebar */}
        <Card className="flex flex-col gap-8 p-6 rounded-2xl shadow-sm h-fit">
          <div className="flex flex-col gap-4">
            <Link href="/find-schools" className="flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-2">
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
                      ? "bg-slate-100/80 text-blue-600"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <HugeiconsIcon
                    icon={link.icon}
                    size={20}
                    className={cn("mr-3 shrink-0", activeTab === link.label ? "text-blue-600" : "text-slate-400")}
                  />
                  <span>{link.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-3">
            <h3 className="font-bold text-slate-900">Need help deciding?</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-1">
              Get personalized recommendations based on your interests.
            </p>
            <Link href="/recommendations">
              <Button variant="outline" className="w-full bg-white text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 font-semibold h-auto py-2.5 rounded-xl whitespace-normal leading-snug">
                Get Recommendations
              </Button>
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-row items-center gap-4 cursor-pointer hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 shrink-0 shadow-sm">
              <HugeiconsIcon icon={FavouriteIcon} size={20} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 text-sm">Save this school</span>
              <span className="text-xs text-slate-500 font-medium">Add to favorites</span>
            </div>
          </div>
        </Card>

        {/* Main Center Content */}
        <Card className="flex flex-col gap-8 rounded-2xl shadow-sm overflow-hidden h-fit pb-8">

          {/* Header banner */}
          <div className="relative w-full h-[200px] rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            <div className="relative z-10 flex flex-col items-center text-white">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-2">
                <HugeiconsIcon icon={Book01Icon} size={32} className="text-white" />
              </div>
              <p className="text-white/80 text-sm font-semibold">{school.county}</p>
            </div>
            <Button className="absolute top-4 right-4 bg-white/90 hover:bg-white text-slate-700 text-sm font-semibold rounded-xl h-10 px-4 shadow-sm backdrop-blur-sm">
              <HugeiconsIcon icon={FavouriteIcon} size={18} className="mr-2" />
              Save
            </Button>
          </div>

          {/* School Header Info */}
          <div className="flex flex-col sm:flex-row gap-6 items-start px-4">
            <div className="w-20 h-20 rounded-2xl bg-white p-2 shadow-lg shrink-0 border border-slate-100">
              <div className="w-full h-full rounded-xl bg-emerald-800 flex items-center justify-center">
                <HugeiconsIcon icon={Book01Icon} className="text-white" size={28} />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{school.name}</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <HugeiconsIcon icon={Location01Icon} size={16} className="text-slate-400" />
                  {school.county}
                </div>
                {school.cluster && (
                  <>
                    <Badge variant="outline" className="px-2 py-0 h-6 font-semibold border border-blue-200 text-blue-600 bg-white rounded-md">
                      {school.cluster}
                    </Badge>
                    <span className="text-slate-500 -ml-2">({clusterLabel})</span>
                  </>
                )}
                {school.gender && (
                  <div className="flex items-center gap-1.5">
                    <HugeiconsIcon icon={UserGroupIcon} size={16} className="text-slate-400" />
                    {school.gender}
                  </div>
                )}
                {school.accommodationType && (
                  <div className="flex items-center gap-1.5">
                    <HugeiconsIcon icon={Building03Icon} size={16} className="text-slate-400" />
                    {school.accommodationType}
                  </div>
                )}
              </div>
            </div>
          </div>

          {profile?.overview && (
            <div className="px-4">
              <p className="text-slate-600 leading-relaxed max-w-3xl">{profile.overview}</p>
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
              <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold rounded-xl h-11 px-6 shadow-sm">
                <HugeiconsIcon icon={Share01Icon} size={18} className="mr-2 text-blue-600" />
                Share
              </Button>
              <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold rounded-xl h-11 px-6 shadow-sm">
                <HugeiconsIcon icon={FavouriteIcon} size={18} className="mr-2 text-blue-600" />
                Save School
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-8 border-b border-slate-200 px-4 mt-4 overflow-x-auto no-scrollbar">
            {SIDEBAR_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => setActiveTab(link.label)}
                className={cn(
                  "pb-4 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap",
                  activeTab === link.label
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                )}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="px-8 flex flex-col gap-8">

            {/* Quick Facts */}
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-bold text-slate-900">Quick Facts</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <span className="text-xs font-semibold text-blue-400 mb-1">Combinations</span>
                  <span className="text-2xl font-extrabold text-blue-700">{combosLoading ? "…" : totalCombinations}</span>
                </div>
                <div className="flex flex-col p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs font-semibold text-slate-400 mb-1">Tracks</span>
                  <span className="text-2xl font-extrabold text-slate-900">{school.tracksOffered.length}</span>
                </div>
                {school.cluster && (
                  <div className="flex flex-col p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <span className="text-xs font-semibold text-emerald-400 mb-1">Cluster</span>
                    <span className="text-2xl font-extrabold text-emerald-700">{school.cluster}</span>
                  </div>
                )}
                {school.gender && (
                  <div className="flex flex-col p-4 bg-purple-50 rounded-xl border border-purple-100">
                    <span className="text-xs font-semibold text-purple-400 mb-1">Gender</span>
                    <span className="text-lg font-extrabold text-purple-700">{school.gender}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator className="bg-slate-100" />

            {/* Tracks Offered */}
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-bold text-slate-900">
                Tracks Offered <span className="text-slate-500 font-medium">({school.tracksOffered.length})</span>
              </h3>
              {school.tracksOffered.length === 0 ? (
                <p className="text-sm text-slate-500">No tracks data available.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {school.tracksOffered.map((trackName, idx) => {
                    const style = TRACK_COLORS[idx % TRACK_COLORS.length]
                    return (
                      <div key={trackName} className={cn("rounded-2xl border p-5 flex gap-4 items-start transition-shadow hover:shadow-sm", style.color)}>
                        <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0 mt-1">
                          <HugeiconsIcon icon={style.icon} size={24} className="opacity-80" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <h4 className="font-bold text-base text-slate-900">{trackName}</h4>
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

            <Separator className="bg-slate-100" />

            {/* Subject Combinations — grouped by track */}
            <div className="flex flex-col gap-6">
              <h3 className="text-lg font-bold text-slate-900">
                Subject Combinations <span className="text-slate-500 font-medium">({combosLoading ? "…" : totalCombinations})</span>
              </h3>

              {combosLoading && (
                <div className="flex items-center gap-3 py-6">
                  <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                  <p className="text-sm font-medium text-slate-500">Loading combinations…</p>
                </div>
              )}

              {!combosLoading && combos.length === 0 && (
                <div className="flex items-start gap-3 bg-slate-50 border border-slate-100 rounded-xl p-4">
                  <HugeiconsIcon icon={InformationCircleIcon} size={18} className="text-slate-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-500">No combinations on record for this school yet.</p>
                </div>
              )}

              {!combosLoading && combos.map((trackGroup, tidx) => {
                const style = TRACK_COLORS[tidx % TRACK_COLORS.length]
                return (
                  <div key={trackGroup.trackId} className="flex flex-col gap-3">
                    {/* Track header */}
                    <div className={cn("flex items-center gap-3 px-4 py-3 rounded-xl border", style.color)}>
                      <HugeiconsIcon icon={style.icon} size={20} className="shrink-0" />
                      <div className="flex flex-col flex-1">
                        <span className="font-bold text-slate-900 text-sm">{trackGroup.trackName}</span>
                        <span className="text-xs font-medium opacity-70">{trackGroup.pathway} · {trackGroup.combinations.length} combinations</span>
                      </div>
                      <Link href={`/explore-tracks/${trackGroup.trackId}`}>
                        <Badge variant="secondary" className={cn("border-none font-semibold text-xs cursor-pointer hover:opacity-80", style.badgeColor)}>
                          Explore Track
                        </Badge>
                      </Link>
                    </div>

                    {/* Combination cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-4">
                      {trackGroup.combinations.map((combo) => (
                        <Link
                          key={combo.id}
                          href={`/combination/${combo.id}`}
                          className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all group"
                        >
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                              {combo.Subjects.map((s) => s.name).join(", ")}
                            </span>
                            <span className="text-[11px] font-semibold text-slate-400 mt-0.5">{combo.code}</span>
                          </div>
                          <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Profile Highlights */}
            {profile?.highlights && profile.highlights.length > 0 && (
              <>
                <Separator className="bg-slate-100" />
                <div className="flex flex-col gap-4">
                  <h3 className="text-lg font-bold text-slate-900">Highlights</h3>
                  <div className="flex flex-col gap-3">
                    {profile.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <HugeiconsIcon icon={CheckmarkCircle01Icon} size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-sm font-medium text-slate-600 leading-snug">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Right Sidebar */}
        <Card className="flex flex-col gap-6 p-6 rounded-2xl shadow-sm h-fit">
          <h3 className="font-bold text-slate-900">At a glance</h3>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-[28px_110px_1fr] items-start text-sm">
              <HugeiconsIcon icon={Location01Icon} size={16} className="text-slate-400 mt-0.5" />
              <span className="font-semibold text-slate-700">County</span>
              <span className="text-slate-600 font-medium">{school.county}</span>
            </div>
            <Separator className="bg-slate-100" />
            {school.cluster && (
              <>
                <div className="grid grid-cols-[28px_110px_1fr] items-start text-sm">
                  <HugeiconsIcon icon={Task01Icon} size={16} className="text-slate-400 mt-0.5" />
                  <span className="font-semibold text-slate-700">Cluster</span>
                  <span className="text-slate-600 font-medium">{school.cluster} ({clusterLabel})</span>
                </div>
                <Separator className="bg-slate-100" />
              </>
            )}
            {school.gender && (
              <>
                <div className="grid grid-cols-[28px_110px_1fr] items-start text-sm">
                  <HugeiconsIcon icon={UserGroupIcon} size={16} className="text-slate-400 mt-0.5" />
                  <span className="font-semibold text-slate-700">Gender</span>
                  <span className="text-slate-600 font-medium">{school.gender}</span>
                </div>
                <Separator className="bg-slate-100" />
              </>
            )}
            {school.accommodationType && (
              <>
                <div className="grid grid-cols-[28px_110px_1fr] items-start text-sm">
                  <HugeiconsIcon icon={Building03Icon} size={16} className="text-slate-400 mt-0.5" />
                  <span className="font-semibold text-slate-700">Accommodation</span>
                  <span className="text-slate-600 font-medium">{school.accommodationType}</span>
                </div>
                <Separator className="bg-slate-100" />
              </>
            )}
            <div className="grid grid-cols-[28px_110px_1fr] items-start text-sm">
              <HugeiconsIcon icon={Book01Icon} size={16} className="text-slate-400 mt-0.5" />
              <span className="font-semibold text-slate-700">Combinations</span>
              <span className="text-slate-600 font-medium">{combosLoading ? "…" : totalCombinations}</span>
            </div>
          </div>

          {school.category && (
            <>
              <Separator className="bg-slate-100" />
              <div className="flex flex-col gap-2">
                <h4 className="font-bold text-slate-900 text-sm">School Category</h4>
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-none font-semibold w-fit">
                  {school.category}
                </Badge>
              </div>
            </>
          )}

          <Separator className="bg-slate-100" />

          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-slate-900 text-sm">Tracks Offered</h4>
            {school.tracksOffered.length === 0 ? (
              <p className="text-xs text-slate-400">None on record</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {school.tracksOffered.map((t) => (
                  <Badge key={t} variant="secondary" className="bg-slate-100 text-slate-600 border-none font-medium text-xs">
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
