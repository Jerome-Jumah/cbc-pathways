"use client"

import { NavBar } from "@/components/nav-bar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ApiError, apiGet } from "@/lib/api-client"
import { cn } from "@/lib/utils"
import type { Track, TracksResponse } from "@/types/api"
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
  RefreshIcon,
  RouteIcon,
  FootballIcon,
  Settings01Icon,
  Wrench01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"

// ─── Track icon/style by name (consistent with detail page) ───────────────────

function getTrackStyle(name: string) {
  const n = name.toLowerCase()
  if (n.includes("pure")) return { color: "bg-[#f2f8fc] border-blue-100", iconBg: "bg-blue-100/50", iconColor: "text-blue-600", textColor: "text-blue-600", icon: MicroscopeIcon }
  if (n.includes("applied")) return { color: "bg-[#f4fbf5] border-emerald-100", iconBg: "bg-emerald-100/50", iconColor: "text-emerald-600", textColor: "text-emerald-600", icon: Settings01Icon }
  if (n.includes("technical")) return { color: "bg-[#fcf6f0] border-orange-100", iconBg: "bg-orange-100/50", iconColor: "text-orange-600", textColor: "text-orange-600", icon: Wrench01Icon }
  if (n.includes("art")) return { color: "bg-[#fbf4fc] border-purple-100", iconBg: "bg-purple-100/50", iconColor: "text-purple-600", textColor: "text-purple-600", icon: MusicNote01Icon }
  if (n.includes("sport")) return { color: "bg-[#fcf4f4] border-rose-100", iconBg: "bg-rose-100/50", iconColor: "text-rose-600", textColor: "text-rose-600", icon: FootballIcon }
  if (n.includes("business") || n.includes("humanities")) return { color: "bg-[#f0f9f9] border-teal-100", iconBg: "bg-teal-100/50", iconColor: "text-teal-600", textColor: "text-teal-600", icon: ChartBarLineIcon }
  if (n.includes("language")) return { color: "bg-[#f0f4ff] border-indigo-100", iconBg: "bg-indigo-100/50", iconColor: "text-indigo-600", textColor: "text-indigo-600", icon: GlobalIcon }
  if (n.includes("agriculture")) return { color: "bg-[#f5fbf0] border-lime-100", iconBg: "bg-lime-100/50", iconColor: "text-lime-600", textColor: "text-lime-600", icon: Plant01Icon }
  return { color: "bg-[#f2f8fc] border-blue-100", iconBg: "bg-blue-100/50", iconColor: "text-blue-600", textColor: "text-blue-600", icon: Book01Icon }
}

export default function ExploreTracksPage() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTracks = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await apiGet<TracksResponse>("/track-profiles")
      setTracks(res.data)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load tracks.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    queueMicrotask(() => {
      void fetchTracks()
    })
  }, [fetchTracks])

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans flex flex-col items-center">
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
              <span className="text-sm font-bold text-slate-500 tracking-wider">
                EXPLORE TRACKS PAGE
              </span>
            </div>
            
            <h1 className="text-4xl lg:text-[44px] font-extrabold text-slate-900 leading-tight tracking-tight">
              Explore CBC Tracks
            </h1>
            
            <p className="text-lg text-slate-600 leading-relaxed font-medium">
              Discover {tracks.length > 0 ? tracks.length : "7"} CBC tracks and 500+ subject combinations designed to shape your future.
            </p>
          </div>

          {/* Right Image */}
          <div className="relative w-full lg:w-[480px] h-[280px] shrink-0">
             <div className="absolute top-0 right-0 w-full h-full bg-blue-50/50 rounded-[3rem] -z-10 blur-3xl opacity-50"></div>
             <Image 
                src="/stack-book.png"
                alt="Stacked books"
                width={400}
                height={400}
                className="object-cover rounded-3xl shadow-sm mix-blend-multiply opacity-90"
             />
          </div>

        </section>

        {/* Stats Bar */}
        <Card className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm p-8 mt-4 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 gap-8 md:gap-0">
            
            <div className="flex items-center gap-5 md:px-8 first:pl-0">
               <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                 <HugeiconsIcon icon={RouteIcon} size={28} />
               </div>
               <div className="flex flex-col gap-0.5">
                 <span className="text-xl font-extrabold text-slate-900">
                   {loading ? "…" : tracks.length} Tracks
                 </span>
                 <span className="text-sm text-slate-500 font-medium">Career pathways</span>
               </div>
            </div>

            <div className="flex items-center gap-5 md:px-8">
               <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                 <HugeiconsIcon icon={Book01Icon} size={28} />
               </div>
               <div className="flex flex-col gap-0.5">
                 <span className="text-xl font-extrabold text-slate-900">500+ Combinations</span>
                 <span className="text-sm text-slate-500 font-medium">Subject combinations</span>
               </div>
            </div>

            <div className="flex items-center gap-5 md:px-8 last:pr-0">
               <div className="w-14 h-14 rounded-2xl bg-purple-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                 <HugeiconsIcon icon={Building03Icon} size={28} />
               </div>
               <div className="flex flex-col gap-0.5">
                 <span className="text-xl font-extrabold text-slate-900">10,000+ Schools</span>
                 <span className="text-sm text-slate-500 font-medium">Across Kenya</span>
               </div>
            </div>

          </div>
        </Card>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
            <p className="text-sm font-medium text-slate-500">Loading tracks…</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <HugeiconsIcon icon={InformationCircleIcon} size={28} className="text-red-500" />
            </div>
            <p className="text-base font-bold text-slate-900 mb-2">Failed to load tracks</p>
            <p className="text-sm text-slate-500 mb-6">{error}</p>
            <Button
              onClick={fetchTracks}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold h-11 px-6"
            >
              <HugeiconsIcon icon={RefreshIcon} size={16} className="mr-2" /> Retry
            </Button>
          </div>
        )}

        {/* Tracks Grid */}
        {!loading && !error && (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-20">
            
            {tracks.map((track, idx) => {
              const style = getTrackStyle(track.name)
              const profileDesc = track.profile?.shortDescription
                ?? track.profile?.description?.slice(0, 120)
                ?? `Explore ${track.name} combinations and career pathways.`
              const careerPreview = track.profile?.careerPathways?.slice(0, 2) ?? []

              return (
                <div 
                  key={track.id}
                  className={cn(
                    "relative flex flex-col p-6 rounded-2xl border transition-transform hover:-translate-y-1 hover:shadow-sm cursor-pointer h-full",
                    style.color
                  )}
                >
                  {/* Top Left Number Badge */}
                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[11px] font-bold shadow-sm text-slate-600 mb-6">
                    {idx + 1}
                  </div>

                  {/* Main Content */}
                  <div className="flex flex-col xl:flex-row gap-5 mb-8 flex-1">
                     {/* Icon */}
                     <div className={cn("w-20 h-20 shrink-0 rounded-full flex items-center justify-center shadow-sm", style.iconBg, style.iconColor)}>
                        <HugeiconsIcon icon={style.icon} size={40} />
                     </div>
                     
                     {/* Text Content */}
                     <div className="flex flex-col">
                       <h3 className="text-lg font-bold text-slate-900 mb-1 leading-tight">{track.name}</h3>
                       <span className={cn("text-xs font-bold mb-3", style.textColor)}>
                         {track.pathway}
                       </span>
                       <p className="text-sm text-slate-600 font-medium leading-relaxed">
                         {profileDesc}
                       </p>
                       {careerPreview.length > 0 && (
                         <div className="mt-3 flex flex-wrap gap-1">
                           {careerPreview.map((career) => (
                             <span key={career} className="text-[10px] font-semibold bg-white/70 text-slate-600 rounded-full px-2 py-0.5 border border-white/50">
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
              )
            })}

            {/* Call To Action Card */}
            <div className="flex flex-col p-6 rounded-2xl border border-slate-200 bg-white shadow-sm transition-transform hover:-translate-y-1 h-full">
               <div className="flex items-center gap-4 mt-6">
                 <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <HugeiconsIcon icon={InformationCircleIcon} size={28} className="text-blue-600" />
                 </div>
                 <div className="flex flex-col">
                   <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1">Not sure where to start?</h3>
                 </div>
               </div>
               
               <p className="text-sm text-slate-600 font-medium leading-relaxed mt-4 mb-6">
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
        )}

      </main>
    </div>
  )
}
